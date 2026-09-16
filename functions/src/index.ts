import { initializeApp } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { onDocumentWritten } from 'firebase-functions/v2/firestore';
import { onCall, onRequest, HttpsError } from 'firebase-functions/v2/https';
import { defineSecret, defineString } from 'firebase-functions/params';
import { scoreFromIndicators } from './discipline.js';
import { exchangeStravaCode } from './strava.js';
import { buildSystemPrompt, callClaude } from './coach.js';

initializeApp();
const db = getFirestore();

const STRAVA_CLIENT_ID = defineSecret('STRAVA_CLIENT_ID');
const STRAVA_CLIENT_SECRET = defineSecret('STRAVA_CLIENT_SECRET');
const ANTHROPIC_API_KEY = defineSecret('ANTHROPIC_API_KEY');
const APP_URL = defineString('APP_URL', { default: 'https://batu-fit-system-54661.web.app' });

// Strava's free-tier app rate limit effectively caps us at 10 connected athletes.
const MAX_STRAVA_ATHLETES = 10;
const OAUTH_STATE_TTL_MS = 10 * 60 * 1000;

export const onDailyCheckInWrite = onDocumentWritten(
  'users/{uid}/dailyCheckIns/{date}',
  async (event) => {
    const { uid, date } = event.params;
    const after = event.data?.after;
    const scoreRef = db.doc(`users/${uid}/disciplineScores/${date}`);

    if (!after?.exists) {
      await scoreRef.delete().catch(() => undefined);
      return;
    }

    const { score, checkedCount } = scoreFromIndicators(after.data()?.indicators);
    await scoreRef.set(
      { date, score, checkedCount, computedAt: FieldValue.serverTimestamp() },
      { merge: true },
    );
  },
);

const MAX_CHAT_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 4000;
const COACH_HISTORY_DAYS = 14;

export const askCoach = onCall({ secrets: [ANTHROPIC_API_KEY] }, async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Debes iniciar sesión.');
  }
  const uid = request.auth.uid;

  const accessSnap = await db.doc(`users/${uid}/access/status`).get();
  if (accessSnap.data()?.unlocked !== true) {
    throw new HttpsError('permission-denied', 'Necesitas un código de acceso.');
  }

  const messages = request.data?.messages;
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > MAX_CHAT_MESSAGES) {
    throw new HttpsError('invalid-argument', 'Mensajes inválidos.');
  }
  for (const m of messages) {
    if (
      !m ||
      (m.role !== 'user' && m.role !== 'assistant') ||
      typeof m.content !== 'string' ||
      m.content.length === 0 ||
      m.content.length > MAX_MESSAGE_LENGTH
    ) {
      throw new HttpsError('invalid-argument', 'Mensajes inválidos.');
    }
  }

  const [profileSnap, checkInsSnap] = await Promise.all([
    db.doc(`users/${uid}`).get(),
    db
      .collection(`users/${uid}/dailyCheckIns`)
      .orderBy('date', 'desc')
      .limit(COACH_HISTORY_DAYS)
      .get(),
  ]);

  const recentDays = checkInsSnap.docs
    .map((d) => {
      const data = d.data();
      const { score, checkedCount } = scoreFromIndicators(data.indicators);
      return { date: data.date as string, score, checkedCount };
    })
    .sort((a, b) => a.date.localeCompare(b.date));

  const system = buildSystemPrompt({ profile: profileSnap.data(), recentDays });

  try {
    const reply = await callClaude(ANTHROPIC_API_KEY.value(), system, messages);
    return { reply };
  } catch (err) {
    console.error('askCoach failed', err);
    throw new HttpsError('internal', 'Batu AI Coach no está disponible ahora mismo.');
  }
});

export const redeemAccessCode = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Debes iniciar sesión.');
  }
  const uid = request.auth.uid;
  const code = String(request.data?.code ?? '').trim().toUpperCase();
  if (!code) {
    throw new HttpsError('invalid-argument', 'Introduce un código.');
  }

  const codeRef = db.doc(`accessCodes/${code}`);
  const accessRef = db.doc(`users/${uid}/access/status`);

  await db.runTransaction(async (tx) => {
    const snap = await tx.get(codeRef);
    if (!snap.exists) {
      throw new HttpsError('not-found', 'Código no válido.');
    }
    const data = snap.data() as { active?: boolean; maxUses?: number | null; usedCount?: number };
    if (data.active === false) {
      throw new HttpsError('failed-precondition', 'Este código ya no está activo.');
    }
    const usedCount = data.usedCount ?? 0;
    if (data.maxUses != null && usedCount >= data.maxUses) {
      throw new HttpsError('resource-exhausted', 'Este código ha alcanzado su límite de usos.');
    }

    tx.update(codeRef, { usedCount: FieldValue.increment(1) });
    tx.set(accessRef, { unlocked: true, code, unlockedAt: FieldValue.serverTimestamp() });
  });

  return { unlocked: true };
});

export const createStravaOAuthState = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Debes iniciar sesión.');
  }
  const ref = await db.collection('stravaOAuthStates').add({
    uid: request.auth.uid,
    createdAt: FieldValue.serverTimestamp(),
  });
  return { state: ref.id };
});

export const stravaOAuthCallback = onRequest(
  { secrets: [STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET] },
  async (req, res) => {
    const redirect = (status: 'connected' | 'error' | 'limit') => {
      res.redirect(`${APP_URL.value()}/settings?strava=${status}`);
    };

    const { code, state, error } = req.query as Record<string, string | undefined>;
    if (error || !code || !state) {
      redirect('error');
      return;
    }

    const stateRef = db.doc(`stravaOAuthStates/${state}`);
    const stateSnap = await stateRef.get();
    if (!stateSnap.exists) {
      redirect('error');
      return;
    }
    const { uid, createdAt } = stateSnap.data() as { uid: string; createdAt: FirebaseFirestore.Timestamp };
    await stateRef.delete();

    if (Date.now() - createdAt.toMillis() > OAUTH_STATE_TTL_MS) {
      redirect('error');
      return;
    }

    const alreadyConnected = (await db.doc(`stravaTokens/${uid}`).get()).exists;
    if (!alreadyConnected) {
      const countSnap = await db.collection('stravaTokens').count().get();
      if (countSnap.data().count >= MAX_STRAVA_ATHLETES) {
        redirect('limit');
        return;
      }
    }

    try {
      const tokens = await exchangeStravaCode({
        clientId: STRAVA_CLIENT_ID.value(),
        clientSecret: STRAVA_CLIENT_SECRET.value(),
        code,
      });

      await db.doc(`stravaTokens/${uid}`).set({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresAt: tokens.expiresAt,
        athleteId: tokens.athleteId,
        updatedAt: FieldValue.serverTimestamp(),
      });

      await db.doc(`users/${uid}/connections/strava`).set({
        connected: true,
        athleteId: tokens.athleteId,
        scope: tokens.scope,
        connectedAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });

      redirect('connected');
    } catch (err) {
      console.error('Strava token exchange failed', err);
      redirect('error');
    }
  },
);

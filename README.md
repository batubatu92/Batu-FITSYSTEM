# Batu Fit System

App de disciplina diaria: React (Vite) + Firebase, instalable como PWA.

## Modelo de datos (Firestore)

```
users/{uid}                               { goal, trainingLevel, restrictions, notes, updatedAt }  // perfil, editable por el usuario
users/{uid}/dailyCheckIns/{YYYY-MM-DD}    { date, indicators: { training, nutrition, sleep, hydration, mindset, movement }, updatedAt }
users/{uid}/disciplineScores/{YYYY-MM-DD} { date, score, checkedCount, computedAt }   // escrito solo por la Cloud Function
users/{uid}/connections/strava            { connected, athleteId, scope, connectedAt } // escrito solo por la Cloud Function
stravaTokens/{uid}                        // tokens crudos, nunca legibles desde el cliente
stravaOAuthStates/{stateId}               // estado CSRF de un solo uso para el flujo OAuth
```

- **Discipline Score** = `checkedCount / 6 * 100`, calculado en el cliente para respuesta instantánea y espejado por `onDailyCheckInWrite` en `disciplineScores` para uso futuro (histórico, notificaciones, etc.).
- **Racha** = días consecutivos con score ≥ 80%, calculada en el cliente (`src/lib/discipline.ts`) sobre los últimos 60 `dailyCheckIns`.
- **Frase del día** (`src/lib/quotes.ts`): una frase de disciplina distinta cada vez que se abre la app.
- **Batu AI Coach chat** (`functions/src/coach.ts`, función `askCoach`): llama a la API de Claude con un system prompt enfocado en comida real / sin ultraprocesados / rutina matutina, inyectando el perfil del usuario y sus últimos 14 días de check-ins como contexto. El chat es efímero (no se persiste el historial todavía). Gateado por `VITE_ENABLE_COACH`.

## Desarrollo local

```bash
npm install
cp .env.example .env   # rellenar con la config del proyecto Firebase batu-fit-system
npm run dev
```

## Firebase

1. Crear el proyecto `batu-fit-system` en la consola de Firebase (si no existe) y habilitar Auth (Google), Firestore y Hosting.
2. `firebase login` y confirmar que `.firebaserc` apunta a `batu-fit-system`.
3. Reglas e índices: `firebase deploy --only firestore`.

### Cloud Functions

```bash
cd functions
npm install
```

Necesita el proyecto en **plan Blaze** (pago por uso; las cuotas gratuitas no cambian, solo hace falta tarjeta vinculada — recomendable poner una alerta de presupuesto).

Secrets necesarios:

```bash
firebase functions:secrets:set STRAVA_CLIENT_ID
firebase functions:secrets:set STRAVA_CLIENT_SECRET
firebase functions:secrets:set ANTHROPIC_API_KEY
```

`functions/.env` fija `APP_URL` (el dominio de Hosting, usado para las redirecciones del flujo de Strava).

Deploy:

```bash
firebase deploy --only functions
```

### Strava OAuth

1. Crear una app en https://www.strava.com/settings/api.
2. Authorization Callback Domain: el dominio de Hosting (p. ej. `batu-fit-system.web.app`).
3. `VITE_STRAVA_CLIENT_ID` (público) y `VITE_STRAVA_REDIRECT_URI=https://<hosting-domain>/api/strava/callback` en `.env`.
4. El *client secret* solo vive como secret de Cloud Functions (`STRAVA_CLIENT_SECRET`), nunca en el bundle del cliente.
5. El plan gratuito de Strava limita la app a 10 atletas conectados; `stravaOAuthCallback` corta nuevas conexiones al llegar al límite (los ya conectados no se ven afectados).

Flujo: el botón "Conectar con Strava" llama a la función `createStravaOAuthState` (callable) para generar un estado de un solo uso ligado al `uid` autenticado, redirige a Strava, y `stravaOAuthCallback` (rewrite de Hosting `/api/strava/callback`) intercambia el `code` por tokens y guarda el estado de conexión.

### Build + deploy de la app

```bash
npm run build
firebase deploy --only hosting
```

## PWA

Manifest e iconos (SVG, sin dependencias de generación de imágenes) están configurados vía `vite-plugin-pwa` en `vite.config.ts`; el service worker cachea solo el app shell, nunca datos de Firestore.

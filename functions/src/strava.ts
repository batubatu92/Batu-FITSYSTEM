interface TokenExchangeResult {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  athleteId: number;
  scope: string;
}

export async function exchangeStravaCode(params: {
  clientId: string;
  clientSecret: string;
  code: string;
}): Promise<TokenExchangeResult> {
  const res = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: params.clientId,
      client_secret: params.clientSecret,
      code: params.code,
      grant_type: 'authorization_code',
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Strava token exchange failed (${res.status}): ${body}`);
  }

  const data = (await res.json()) as {
    access_token: string;
    refresh_token: string;
    expires_at: number;
    athlete: { id: number };
  };

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: data.expires_at,
    athleteId: data.athlete.id,
    scope: 'activity:read_all',
  };
}

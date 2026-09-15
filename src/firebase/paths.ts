export const paths = {
  dailyCheckIns: (uid: string) => `users/${uid}/dailyCheckIns`,
  dailyCheckIn: (uid: string, date: string) => `users/${uid}/dailyCheckIns/${date}`,
  disciplineScores: (uid: string) => `users/${uid}/disciplineScores`,
  disciplineScore: (uid: string, date: string) => `users/${uid}/disciplineScores/${date}`,
  stravaConnection: (uid: string) => `users/${uid}/connections/strava`,
};

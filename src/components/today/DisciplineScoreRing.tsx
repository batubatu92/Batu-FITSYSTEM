interface Props {
  score: number;
}

const SIZE = 176;
const STROKE = 14;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function DisciplineScoreRing({ score }: Props) {
  const offset = CIRCUMFERENCE * (1 - score / 100);

  return (
    <div
      className="relative mx-auto rounded-full"
      style={{ width: SIZE, height: SIZE, filter: 'drop-shadow(0 0 24px rgba(255,138,61,0.25))' }}
    >
      <svg width={SIZE} height={SIZE} className="-rotate-90">
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffb020" />
            <stop offset="100%" stopColor="#ff4d4d" />
          </linearGradient>
        </defs>
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="#262b36"
          strokeWidth={STROKE}
        />
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="url(#scoreGradient)"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 300ms ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        {score === 0 ? (
          <>
            <span className="text-2xl">☀️</span>
            <span className="mt-1 text-sm font-semibold text-slate-200">Tu día empieza ahora</span>
          </>
        ) : (
          <>
            <span className="text-4xl font-bold text-slate-50">{score}</span>
            <span className="text-xs uppercase tracking-wide text-slate-300">Discipline Score</span>
          </>
        )}
      </div>
    </div>
  );
}

interface Props {
  streak: number;
}

export function StreakBadge({ streak }: Props) {
  return (
    <div className="flex items-center justify-center gap-2 rounded-full bg-base-surface px-4 py-2 text-sm font-medium text-slate-200">
      <span>🔥</span>
      <span>
        {streak} {streak === 1 ? 'día' : 'días'} de racha
      </span>
    </div>
  );
}

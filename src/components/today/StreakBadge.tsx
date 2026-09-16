interface Props {
  streak: number;
}

export function StreakBadge({ streak }: Props) {
  return (
    <div className="flex items-center justify-center gap-2 rounded-full border border-accent/20 bg-gradient-to-r from-flame-from/10 to-flame-to/10 px-4 py-2 text-sm font-medium text-slate-200 shadow-md shadow-black/20">
      <span>🔥</span>
      <span>
        {streak} {streak === 1 ? 'día' : 'días'} de racha
      </span>
    </div>
  );
}

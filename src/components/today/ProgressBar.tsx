export function ProgressBar({ percent }: { percent: number }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-base-bg">
      <div
        className="h-full rounded-full bg-gradient-to-r from-flame-from to-flame-to transition-all"
        style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
      />
    </div>
  );
}

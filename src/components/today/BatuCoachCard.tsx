interface Props {
  message: string;
}

export function BatuCoachCard({ message }: Props) {
  return (
    <div className="rounded-xl border border-base-border bg-base-surface p-4">
      <div className="mb-1 flex items-center gap-2">
        <span className="text-lg">🤖</span>
        <span className="text-sm font-semibold text-slate-200">Batu AI Coach</span>
      </div>
      <p className="text-sm text-slate-300">{message}</p>
    </div>
  );
}

interface Props {
  value: number;
  step: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  formatValue: (value: number) => string;
}

export function Stepper({ value, step, min = 0, max, onChange, formatValue }: Props) {
  const dec = () => onChange(Math.max(min, Math.round((value - step) / step) * step));
  const inc = () => onChange(max != null ? Math.min(max, value + step) : value + step);

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={dec}
        disabled={value <= min}
        aria-label="Restar"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-base-border bg-base-bg text-lg text-slate-200 disabled:opacity-40"
      >
        −
      </button>
      <span className="min-w-[5rem] text-center text-sm font-semibold text-slate-100">
        {formatValue(value)}
      </span>
      <button
        onClick={inc}
        disabled={max != null && value >= max}
        aria-label="Sumar"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-base-border bg-base-bg text-lg text-slate-200 disabled:opacity-40"
      >
        +
      </button>
    </div>
  );
}

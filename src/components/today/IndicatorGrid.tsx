import { INDICATORS } from '../../lib/discipline';
import type { IndicatorKey, IndicatorMap } from '../../types';

interface Props {
  indicators: Partial<IndicatorMap>;
  onToggle: (key: IndicatorKey) => void;
}

export function IndicatorGrid({ indicators, onToggle }: Props) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {INDICATORS.map((indicator) => {
        const checked = Boolean(indicators[indicator.key]);
        return (
          <button
            key={indicator.key}
            onClick={() => onToggle(indicator.key)}
            aria-pressed={checked}
            className={`flex flex-col items-center gap-1 rounded-xl border px-2 py-3 transition ${
              checked
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-base-border bg-base-surface text-slate-400'
            }`}
          >
            <span className="text-2xl">{indicator.emoji}</span>
            <span className="text-xs font-medium">{indicator.label}</span>
          </button>
        );
      })}
    </div>
  );
}

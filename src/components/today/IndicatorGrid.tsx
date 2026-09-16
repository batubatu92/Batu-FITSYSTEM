import { INDICATORS } from '../../lib/discipline';
import type { IndicatorKey, IndicatorMap } from '../../types';

interface Props {
  indicators: Partial<IndicatorMap>;
  onToggle: (key: IndicatorKey) => void;
}

export function IndicatorGrid({ indicators, onToggle }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {INDICATORS.map((indicator) => {
        const checked = Boolean(indicators[indicator.key]);
        return (
          <button
            key={indicator.key}
            onClick={() => onToggle(indicator.key)}
            aria-pressed={checked}
            className={`flex flex-col items-start gap-1 rounded-xl border px-3 py-3 text-left shadow-md shadow-black/20 transition ${
              checked
                ? 'border-accent bg-gradient-to-br from-flame-from/15 to-flame-to/15'
                : 'border-base-border bg-base-surface'
            }`}
          >
            <span className="flex items-center gap-2">
              <span className="text-xl">{indicator.emoji}</span>
              <span className={`text-sm font-semibold ${checked ? 'text-accent' : 'text-slate-200'}`}>
                {indicator.label}
              </span>
            </span>
            <span className="text-xs leading-snug text-slate-500">{indicator.description}</span>
          </button>
        );
      })}
    </div>
  );
}

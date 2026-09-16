import { useEffect, useState } from 'react';
import { INDICATORS, NUTRITION_LEVELS, percentagesFromValues } from '../../lib/discipline';
import type { DailyIndicatorValues } from '../../types';
import { ProgressBar } from './ProgressBar';
import { Stepper } from './Stepper';

interface Props {
  values: Partial<DailyIndicatorValues>;
  glassSizeMl: number;
  onChange: (patch: Partial<DailyIndicatorValues>) => void;
}

function formatHours(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

function SleepControl({ hours, onChange }: { hours: number; onChange: (h: number) => void }) {
  const [local, setLocal] = useState(hours);
  useEffect(() => setLocal(hours), [hours]);

  return (
    <div className="flex flex-col gap-1">
      <input
        type="range"
        min={0}
        max={10}
        step={0.25}
        value={local}
        onChange={(e) => setLocal(Number(e.target.value))}
        onMouseUp={() => onChange(local)}
        onTouchEnd={() => onChange(local)}
        className="w-full accent-accent"
      />
      <span className="text-sm font-semibold text-slate-100">{formatHours(local)}</span>
    </div>
  );
}

export function IndicatorGrid({ values, glassSizeMl, onChange }: Props) {
  const percentages = percentagesFromValues(values);
  const glasses = values.hydrationGlasses ?? 0;
  const liters = (glasses * glassSizeMl) / 1000;

  return (
    <div className="flex flex-col gap-3">
      {INDICATORS.map((indicator) => (
        <div
          key={indicator.key}
          className="rounded-xl border border-base-border bg-base-surface p-3 shadow-md shadow-black/20"
        >
          <div className="mb-1 flex items-center gap-2">
            <span className="text-xl">{indicator.emoji}</span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-100">{indicator.label}</p>
              <p className="truncate text-xs text-slate-400">{indicator.description}</p>
            </div>
            <span className="shrink-0 text-xs font-semibold text-accent">{percentages[indicator.key]}%</span>
          </div>
          <ProgressBar percent={percentages[indicator.key]} />

          <div className="mt-3">
            {indicator.key === 'sleep' && (
              <SleepControl
                hours={values.sleepHours ?? 0}
                onChange={(h) => onChange({ sleepHours: h })}
              />
            )}

            {indicator.key === 'hydration' && (
              <Stepper
                value={glasses}
                step={1}
                max={20}
                onChange={(v) => onChange({ hydrationGlasses: v, hydrationGlassMl: glassSizeMl })}
                formatValue={() => `${glasses} vasos (${liters.toFixed(2)} L)`}
              />
            )}

            {indicator.key === 'training' && (
              <Stepper
                value={values.trainingMinutes ?? 0}
                step={5}
                max={240}
                onChange={(v) => onChange({ trainingMinutes: v })}
                formatValue={(v) => `${v} min`}
              />
            )}

            {indicator.key === 'mindset' && (
              <Stepper
                value={values.mindsetMinutes ?? 0}
                step={5}
                max={120}
                onChange={(v) => onChange({ mindsetMinutes: v })}
                formatValue={(v) => `${v} min`}
              />
            )}

            {indicator.key === 'movement' && (
              <Stepper
                value={values.movementSteps ?? 0}
                step={500}
                max={30000}
                onChange={(v) => onChange({ movementSteps: v })}
                formatValue={(v) => `${v.toLocaleString('es-ES')} pasos`}
              />
            )}

            {indicator.key === 'nutrition' && (
              <div className="flex flex-wrap gap-2">
                {NUTRITION_LEVELS.map((level) => (
                  <button
                    key={level.value}
                    onClick={() => onChange({ nutritionLevel: level.value })}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                      values.nutritionLevel === level.value
                        ? 'border-accent bg-gradient-to-r from-flame-from/20 to-flame-to/20 text-accent'
                        : 'border-base-border text-slate-300'
                    }`}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

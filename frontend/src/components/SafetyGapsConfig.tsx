import type { SafetyGaps } from '@packgenius/shared';
import { memo } from 'react';

interface SafetyGapsConfigProps {
  safetyGaps: SafetyGaps;
  onSafetyGapsChange: (gaps: Partial<SafetyGaps>) => void;
  t: {
    safetyGapTitle: string;
    safetyGapDesc: string;
  };
}

export const SafetyGapsConfig = memo(function SafetyGapsConfig({
  safetyGaps,
  onSafetyGapsChange,
  t,
}: SafetyGapsConfigProps) {
  return (
    <section className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-1">
            {t.safetyGapTitle}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">{t.safetyGapDesc}</p>
        </div>
        <div className="flex gap-3 text-sm">
          {(['l', 'w', 'h'] as const).map((key) => (
            <div key={key} className="flex items-center gap-1">
              <span className="text-slate-500 dark:text-slate-400">
                {key.toUpperCase()} +
              </span>
              <input
                type="number"
                min="0"
                step="0.5"
                value={safetyGaps[key]}
                onChange={(e) =>
                  onSafetyGapsChange({ [key]: parseFloat(e.target.value) || 0 })
                }
                className="w-14 px-2 py-1 border dark:border-slate-600 rounded text-center font-mono bg-white dark:bg-slate-700 dark:text-slate-100"
              />
              <span className="text-slate-400">mm</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

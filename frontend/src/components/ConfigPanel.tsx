import { Layers, ArrowRight, Loader2 } from 'lucide-react';
import type { PackagingConfig, Arrangement } from '@packgenius/shared';
import { memo } from 'react';

interface ConfigPanelProps {
  config: PackagingConfig;
  isLoading: boolean;
  canCalculate: boolean;
  onConfigChange: (cfg: Partial<PackagingConfig>) => void;
  onCalculate: () => void;
  t: {
    strategyTitle: string;
    strategyDesc: string;
    innerPackTitle: string;
    masterCartonTitle: string;
    innerWall: string;
    arrangeL: string;
    arrangeW: string;
    arrangeH: string;
    calculateBtn: string;
    waiting: string;
  };
}

export const ConfigPanel = memo(function ConfigPanel({
  config,
  isLoading,
  canCalculate,
  onConfigChange,
  onCalculate,
  t,
}: ConfigPanelProps) {
  const handleArrangementChange = (
    section: 'innerArrangement' | 'masterArrangement',
    field: keyof Arrangement,
    value: string
  ) => {
    const num = Math.max(1, parseInt(value) || 1);
    onConfigChange({ [section]: { ...config[section], [field]: num } });
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
      <h2 className="text-lg font-bold mb-1 flex items-center gap-2 text-slate-800 dark:text-slate-100">
        <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        {t.strategyTitle}
      </h2>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">{t.strategyDesc}</p>

      {/* Inner Box Config */}
      <div className="bg-indigo-50/50 dark:bg-indigo-900/20 rounded-lg p-4 mb-4 border border-indigo-100 dark:border-indigo-800">
        <h3 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-3 uppercase tracking-wide flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-500 dark:bg-indigo-400" />
          {t.innerPackTitle}
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {(['l', 'w', 'h'] as const).map((field) => (
            <div key={field}>
              <label className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block mb-1">
                {t[`arrange${field.toUpperCase()}` as keyof typeof t]}
              </label>
              <input
                type="number"
                min="1"
                value={config.innerArrangement[field]}
                onChange={(e) => handleArrangementChange('innerArrangement', field, e.target.value)}
                className="w-full text-center border border-indigo-200 dark:border-indigo-700 rounded py-1.5 text-sm focus:ring-1 focus:ring-indigo-500 outline-none bg-white dark:bg-slate-700 dark:text-slate-100"
              />
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-indigo-100 dark:border-indigo-800">
          <label className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block mb-1">
            {t.innerWall}
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              step="0.5"
              value={config.innerWallThickness}
              onChange={(e) =>
                onConfigChange({ innerWallThickness: parseFloat(e.target.value) || 0 })
              }
              className="w-full text-left px-3 border border-indigo-200 dark:border-indigo-700 rounded py-1.5 text-sm bg-white dark:bg-slate-700 focus:ring-1 focus:ring-indigo-500 outline-none dark:text-slate-100"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
              mm
            </span>
          </div>
        </div>
      </div>

      {/* Master Carton Config */}
      <div className="bg-emerald-50/50 dark:bg-emerald-900/20 rounded-lg p-4 border border-emerald-100 dark:border-emerald-800">
        <h3 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-3 uppercase tracking-wide flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400" />
          {t.masterCartonTitle}
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {(['l', 'w', 'h'] as const).map((field) => (
            <div key={field}>
              <label className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block mb-1">
                {t[`arrange${field.toUpperCase()}` as keyof typeof t]}
              </label>
              <input
                type="number"
                min="1"
                value={config.masterArrangement[field]}
                onChange={(e) => handleArrangementChange('masterArrangement', field, e.target.value)}
                className="w-full text-center border border-emerald-200 dark:border-emerald-700 rounded py-1.5 text-sm focus:ring-1 focus:ring-emerald-500 outline-none bg-white dark:bg-slate-700 dark:text-slate-100"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Calculate Button */}
      <button
        onClick={onCalculate}
        disabled={!canCalculate || isLoading}
        className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/50"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            {t.waiting}
          </>
        ) : (
          <>
            {t.calculateBtn}
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>
    </div>
  );
});

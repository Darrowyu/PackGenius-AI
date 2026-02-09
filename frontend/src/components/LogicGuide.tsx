import { X, Component } from 'lucide-react';
import { Translation } from '@/i18n';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  t: Translation;
}

const Step = ({ num, title, desc, color }: { num: number; title: string; desc: string; color: string }) => (
  <div className="flex gap-3">
    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-sm ${color}`}>{num}</div>
    <div>
      <h3 className="font-bold text-slate-800 dark:text-slate-100">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400">{desc}</p>
    </div>
  </div>
);

export const LogicGuide = ({ isOpen, onClose, t }: Props) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Component className="w-6 h-6 text-indigo-600" />{t.logicTitle}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Diagram */}
          <div className="flex flex-col items-center justify-center py-6 bg-slate-50 dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-600">
            <div className="border-2 border-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg p-6 relative">
              <span className="absolute top-0 right-2 text-[10px] font-bold text-emerald-600 uppercase bg-emerald-100 px-1 rounded">{t.diagramMaster}</span>
              <div className="flex items-end gap-2">
                {[1, 2].map(i => (
                  <div key={i} className="border-2 border-indigo-300 bg-indigo-50 dark:bg-indigo-900/30 rounded p-3">
                    {i === 1 && <span className="absolute top-0 left-1 text-[9px] font-bold text-indigo-500">{t.diagramInner}</span>}
                    <div className="flex gap-1 mt-2">
                      {[1, 2, 3].map(j => <div key={j} className="w-4 h-6 bg-slate-300 dark:bg-slate-600 rounded-sm border border-slate-400" />)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Step num={1} title={t.step1Title} desc={t.step1Desc} color="bg-slate-100 text-slate-500" />
              <Step num={2} title={t.step2Title} desc={t.step2Desc} color="bg-indigo-100 text-indigo-600" />
            </div>
            <div className="space-y-4">
              <Step num={3} title={t.step3Title} desc={t.step3Desc} color="bg-purple-100 text-purple-600" />
              <Step num={4} title={t.step4Title} desc={t.step4Desc} color="bg-emerald-100 text-emerald-600" />
            </div>
          </div>

          {/* Case Study */}
          <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded uppercase">Case Study</span>
              {t.n95ExampleTitle}
            </h3>
            <div className="bg-slate-900 text-slate-200 rounded-xl overflow-hidden font-mono text-sm">
              <div className="bg-slate-800 px-5 py-3 border-b border-slate-700">
                <span className="text-slate-400 italic"># {t.n95Scenario}</span>
              </div>
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-indigo-400 font-bold uppercase text-xs tracking-wider mb-3 border-b border-slate-700 pb-1">{t.n95Spec}</h4>
                  <ul className="space-y-2 text-slate-300">
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-slate-500 rounded-full" />{t.n95Spec1}</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />{t.n95Spec2}</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />{t.n95Spec3}</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-emerald-400 font-bold uppercase text-xs tracking-wider mb-3 border-b border-slate-700 pb-1">{t.n95CalcTitle}</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="text-slate-400 text-xs">Inner Pack Dims</div>
                      <div className="text-slate-300">{t.n95InnerCalc}</div>
                      <div className="text-indigo-300 font-bold">{t.n95InnerResult}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-xs">Master Payload</div>
                      <div className="text-slate-300">{t.n95MasterCalc}</div>
                      <div className="text-purple-300 font-bold">{t.n95MasterResult}</div>
                    </div>
                    <div className="bg-emerald-900/30 p-2 rounded border border-emerald-900/50">
                      <div className="text-emerald-500 text-xs font-bold">Target Search Size</div>
                      <div className="text-slate-300 text-xs">{t.n95TargetCalc}</div>
                      <div className="text-white font-bold">{t.n95TargetResult}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 dark:bg-slate-900 px-6 py-4 border-t border-slate-200 dark:border-slate-700 text-right">
          <button onClick={onClose} className="px-6 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg font-medium shadow-sm">
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { X, Component } from 'lucide-react';
import { Translation } from '@/i18n';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  t: Translation;
}

export const LogicGuide: React.FC<Props> = ({ isOpen, onClose, t }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col">
        <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between z-10 shrink-0">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Component className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />{t.logicTitle}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
          </button>
        </div>
        <div className="p-6 space-y-8 overflow-y-auto">
          <div className="flex flex-col items-center justify-center py-6 bg-slate-50 dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-600">
            <div className="flex items-end gap-1 relative">
              <div className="border-2 border-emerald-400 dark:border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg p-6 relative">
                <span className="absolute top-0 right-2 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider bg-emerald-100 dark:bg-emerald-900/50 px-1 rounded">{t.diagramMaster}</span>
                <div className="flex items-end gap-2">
                  <div className="border-2 border-indigo-300 dark:border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 rounded p-3 relative">
                    <span className="absolute top-0 left-1 text-[9px] font-bold text-indigo-500 dark:text-indigo-400 uppercase">{t.diagramInner}</span>
                    <div className="flex gap-1 mt-2">
                      <div className="w-4 h-6 bg-slate-300 dark:bg-slate-600 rounded-sm border border-slate-400 dark:border-slate-500"></div>
                      <div className="w-4 h-6 bg-slate-300 dark:bg-slate-600 rounded-sm border border-slate-400 dark:border-slate-500"></div>
                      <div className="w-4 h-6 bg-slate-300 dark:bg-slate-600 rounded-sm border border-slate-400 dark:border-slate-500"></div>
                    </div>
                  </div>
                  <div className="border-2 border-indigo-300 dark:border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 rounded p-3 relative">
                    <div className="flex gap-1 mt-2">
                      <div className="w-4 h-6 bg-slate-300 dark:bg-slate-600 rounded-sm border border-slate-400 dark:border-slate-500"></div>
                      <div className="w-4 h-6 bg-slate-300 dark:bg-slate-600 rounded-sm border border-slate-400 dark:border-slate-500"></div>
                      <div className="w-4 h-6 bg-slate-300 dark:bg-slate-600 rounded-sm border border-slate-400 dark:border-slate-500"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center shrink-0 font-bold text-slate-500 dark:text-slate-300">1</div>
                <div><h3 className="font-bold text-slate-800 dark:text-slate-100">{t.step1Title}</h3><p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{t.step1Desc}</p></div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center shrink-0 font-bold text-indigo-600 dark:text-indigo-400">2</div>
                <div><h3 className="font-bold text-slate-800 dark:text-slate-100">{t.step2Title}</h3><p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{t.step2Desc}</p></div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center shrink-0 font-bold text-purple-600 dark:text-purple-400">3</div>
                <div><h3 className="font-bold text-slate-800 dark:text-slate-100">{t.step3Title}</h3><p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{t.step3Desc}</p></div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center shrink-0 font-bold text-emerald-600 dark:text-emerald-400">4</div>
                <div><h3 className="font-bold text-slate-800 dark:text-slate-100">{t.step4Title}</h3><p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{t.step4Desc}</p></div>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <span className="bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">Case Study</span>
                {t.n95ExampleTitle}
              </h3>
            </div>
            <div className="bg-slate-900 text-slate-200 rounded-xl overflow-hidden shadow-xl font-mono text-sm">
              <div className="bg-slate-800 px-5 py-3 border-b border-slate-700 flex justify-between items-center">
                <span className="text-slate-400 italic"># {t.n95Scenario}</span>
              </div>
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-indigo-400 font-bold uppercase text-xs tracking-wider mb-3 border-b border-slate-700 pb-1">{t.n95Spec}</h4>
                  <ul className="space-y-2 text-slate-300">
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-slate-500 rounded-full"></div>{t.n95Spec1}</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>{t.n95Spec2}</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>{t.n95Spec3}</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-emerald-400 font-bold uppercase text-xs tracking-wider mb-3 border-b border-slate-700 pb-1">{t.n95CalcTitle}</h4>
                  <div className="space-y-4">
                    <div><div className="text-slate-400 text-xs mb-0.5">Inner Pack Dims</div><div className="text-slate-300">{t.n95InnerCalc}</div><div className="text-indigo-300 font-bold">{t.n95InnerResult}</div></div>
                    <div><div className="text-slate-400 text-xs mb-0.5">Master Payload</div><div className="text-slate-300">{t.n95MasterCalc}</div><div className="text-purple-300 font-bold">{t.n95MasterResult}</div></div>
                    <div className="bg-emerald-900/30 p-2 rounded border border-emerald-900/50 -mx-2">
                      <div className="text-emerald-500 text-xs mb-0.5 font-bold">Target Search Size</div>
                      <div className="text-slate-300 text-xs">{t.n95TargetCalc}</div>
                      <div className="text-white font-bold">{t.n95TargetResult}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-900 px-6 py-4 border-t border-slate-200 dark:border-slate-700 text-right shrink-0">
          <button onClick={onClose} className="px-6 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg font-medium transition-colors shadow-sm">{t.close}</button>
        </div>
      </div>
    </div>
  );
};

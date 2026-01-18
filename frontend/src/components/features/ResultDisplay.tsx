import React, { useState } from 'react';
import { CalculationResult, AIAnalysis, PackagingConfig, Dimensions } from '@/types';
import { CheckCircle2, AlertCircle, Box, Scale, Ruler, Sparkles, Truck, Cuboid, Layers, ArrowRight, Calculator, Download } from 'lucide-react';
import { Translation } from '@/i18n';
import { BoxVisualizer } from './BoxVisualizer';
import { Button } from '@/components/ui/button';

interface Props {
  result: CalculationResult | null;
  aiAnalysis: AIAnalysis | null;
  loadingAI: boolean;
  t: Translation;
  config: PackagingConfig;
  product: Dimensions;
  safetyGaps?: { l: number; w: number; h: number };
}

export const ResultDisplay: React.FC<Props> = ({ result, aiAnalysis, loadingAI, t, config, product, safetyGaps = { l: 3, w: 3, h: 2 } }) => {
  if (!result) return null;

  const payloadVol = result.masterPayloadDims.length * result.masterPayloadDims.width * result.masterPayloadDims.height;
  const boxVol = result.box.length * result.box.width * result.box.height;
  const calcEfficiency = boxVol > 0 ? (payloadVol / boxVol) * 100 : 0;

  const handleExport = () => {
    const data = {
      product,
      config,
      result: {
        box: result.box,
        isCustom: result.isCustom,
        innerBoxDims: result.innerBoxDims,
        masterPayloadDims: result.masterPayloadDims,
        totalItems: result.totalItems,
        gaps: { L: result.gapL, W: result.gapW, H: result.gapH },
        wasteVolume: result.wasteVolume,
        efficiency: calcEfficiency.toFixed(1) + '%'
      },
      aiAnalysis,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `packgenius-result-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button size="sm" variant="outline" onClick={handleExport} className="gap-1 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700">
          <Download className="w-4 h-4" />{t.exportResult}
        </Button>
      </div>

      <StrategySummary t={t} result={result} />
      
      <CalculationLog t={t} result={result} config={config} safetyGaps={safetyGaps} />

      <ResultHighlights t={t} result={result} />

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600 flex items-center gap-2">
          <Cuboid className="w-5 h-5 text-slate-600 dark:text-slate-300" /><h3 className="font-semibold text-slate-700 dark:text-slate-200">{t.visualization}</h3>
        </div>
        <div className="p-6"><BoxVisualizer box={result.box} product={result.masterPayloadDims} isCustom={result.isCustom} t={t} /></div>
      </div>

      <AiAnalysisSection 
        t={t} 
        aiAnalysis={aiAnalysis} 
        loadingAI={loadingAI} 
        payloadVol={payloadVol} 
        boxVol={boxVol} 
        calcEfficiency={calcEfficiency} 
      />
    </div>
  );
};

const StrategySummary = ({ t, result }: { t: Translation, result: CalculationResult }) => (
  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5">
    <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
      <Layers className="w-4 h-4" />{t.strategyTitle}
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
      <div className="bg-slate-50 dark:bg-slate-700 p-3 rounded-lg border border-slate-100 dark:border-slate-600 relative">
        <div className="text-xs text-slate-400 mb-1">{t.innerPackTitle}</div>
        <div className="font-mono font-bold text-slate-700 dark:text-slate-200">{result.innerBoxDims.length.toFixed(0)} x {result.innerBoxDims.width.toFixed(0)} x {result.innerBoxDims.height.toFixed(0)}</div>
        <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-slate-600 rounded-full p-1 border border-slate-200 dark:border-slate-500"><ArrowRight className="w-3 h-3 text-slate-400" /></div>
      </div>
      <div className="bg-slate-50 dark:bg-slate-700 p-3 rounded-lg border border-slate-100 dark:border-slate-600 relative">
        <div className="text-xs text-slate-400 mb-1">{t.masterPayload}</div>
        <div className="font-mono font-bold text-slate-700 dark:text-slate-200">{result.masterPayloadDims.length.toFixed(0)} x {result.masterPayloadDims.width.toFixed(0)} x {result.masterPayloadDims.height.toFixed(0)}</div>
        <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-slate-600 rounded-full p-1 border border-slate-200 dark:border-slate-500"><ArrowRight className="w-3 h-3 text-slate-400" /></div>
      </div>
      <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg border border-blue-100 dark:border-blue-800">
        <div className="text-xs text-blue-500 dark:text-blue-400 mb-1">{t.totalItems}</div>
        <div className="font-mono font-bold text-blue-800 dark:text-blue-300 text-lg">{result.totalItems} <span className="text-xs font-normal opacity-70">pcs</span></div>
      </div>
    </div>
  </div>
);

const CalculationLog = ({ t, result, config, safetyGaps }: { t: Translation, result: CalculationResult, config: PackagingConfig, safetyGaps: {l:number, w:number, h:number} }) => {
  const stackCount = config.innerBox.stackCount;
  const masterArr = config.masterArrangement;
  return (
    <div className="bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="bg-slate-100 dark:bg-slate-700 px-4 py-2 border-b border-slate-200 dark:border-slate-600 flex items-center gap-2">
        <Calculator className="w-4 h-4 text-slate-500 dark:text-slate-400" />
        <h3 className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">{t.calcLogTitle}</h3>
      </div>
      <div className="p-4 space-y-4 text-sm font-mono text-slate-600 dark:text-slate-300">
        <div>
          <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-1">{t.calcLogStep1}</div>
          <div className="grid grid-cols-1 gap-1 pl-2 border-l-2 border-indigo-200 dark:border-indigo-700">
            <div>{t.stackCount || '叠放数量'}: <span className="font-bold text-slate-800 dark:text-slate-100">{stackCount}</span> pcs</div>
            <div>{t.innerDims}: <span className="font-bold text-slate-800 dark:text-slate-100">{result.innerBoxDims.length.toFixed(1)} × {result.innerBoxDims.width.toFixed(1)} × {result.innerBoxDims.height.toFixed(1)}</span> cm</div>
          </div>
        </div>
        <div>
          <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1">{t.calcLogStep2}</div>
          <div className="grid grid-cols-1 gap-1 pl-2 border-l-2 border-emerald-200 dark:border-emerald-700">
            <div>L: {result.innerBoxDims.length.toFixed(1)} × {masterArr.l} = <span className="font-bold text-slate-800 dark:text-slate-100">{result.masterPayloadDims.length.toFixed(1)}</span></div>
            <div>W: {result.innerBoxDims.width.toFixed(1)} × {masterArr.w} = <span className="font-bold text-slate-800 dark:text-slate-100">{result.masterPayloadDims.width.toFixed(1)}</span></div>
            <div>H: {result.innerBoxDims.height.toFixed(1)} × {masterArr.h} = <span className="font-bold text-slate-800 dark:text-slate-100">{result.masterPayloadDims.height.toFixed(1)}</span></div>
          </div>
        </div>
        <div>
          <div className="text-xs font-bold text-amber-600 dark:text-amber-400 mb-1">{t.calcLogStep3}</div>
          <div className="grid grid-cols-1 gap-1 pl-2 border-l-2 border-amber-200 dark:border-amber-700">
            <div>L: {result.masterPayloadDims.length.toFixed(1)} + {safetyGaps.l} ({t.formulaGap}) = <span className="font-bold text-slate-900 dark:text-slate-100 bg-amber-100 dark:bg-amber-900/50 px-1">{(result.masterPayloadDims.length + safetyGaps.l).toFixed(1)}</span></div>
            <div>W: {result.masterPayloadDims.width.toFixed(1)} + {safetyGaps.w} ({t.formulaGap}) = <span className="font-bold text-slate-900 dark:text-slate-100 bg-amber-100 dark:bg-amber-900/50 px-1">{(result.masterPayloadDims.width + safetyGaps.w).toFixed(1)}</span></div>
            <div>H: {result.masterPayloadDims.height.toFixed(1)} + {safetyGaps.h} ({t.formulaGap}) = <span className="font-bold text-slate-900 dark:text-slate-100 bg-amber-100 dark:bg-amber-900/50 px-1">{(result.masterPayloadDims.height + safetyGaps.h).toFixed(1)}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ResultHighlights = ({ t, result }: { t: Translation, result: CalculationResult }) => (
  <div className={`rounded-xl p-1 shadow-lg ${result.isCustom ? 'bg-gradient-to-r from-amber-200 to-orange-100 dark:from-amber-900/50 dark:to-orange-900/30' : 'bg-gradient-to-r from-emerald-200 to-teal-100 dark:from-emerald-900/50 dark:to-teal-900/30'}`}>
    <div className="bg-white dark:bg-slate-800 rounded-lg p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {result.isCustom ? (
              <span className="px-3 py-1 text-xs font-bold tracking-wide text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/50 rounded-full uppercase">{t.customRequired}</span>
            ) : (
              <span className="px-3 py-1 text-xs font-bold tracking-wide text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/50 rounded-full uppercase">{t.stockAvailable}</span>
            )}
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{result.isCustom ? t.fabricateBox : `${t.useBox}: ${result.box.id}`}</h2>
        </div>
        {result.isCustom ? <AlertCircle className="w-10 h-10 text-amber-500 dark:text-amber-400" /> : <CheckCircle2 className="w-10 h-10 text-emerald-500 dark:text-emerald-400" />}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-xl border border-slate-100 dark:border-slate-600">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-2"><Box className="w-4 h-4" /><span className="text-sm font-medium">{t.boxDims}</span></div>
          <div className="text-xl font-bold text-slate-800 dark:text-slate-100">{result.box.length} x {result.box.width} x {result.box.height} <span className="text-sm font-normal text-slate-500 dark:text-slate-400">cm</span></div>
        </div>
        <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-xl border border-slate-100 dark:border-slate-600">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-2"><Ruler className="w-4 h-4" /><span className="text-sm font-medium">{t.actualGaps}</span></div>
          <div className="text-xl font-bold text-slate-800 dark:text-slate-100">+{result.gapL.toFixed(0)} / +{result.gapW.toFixed(0)} / +{result.gapH.toFixed(0)} <span className="text-sm font-normal text-slate-500 dark:text-slate-400">cm</span></div>
        </div>
        <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-xl border border-slate-100 dark:border-slate-600">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-2"><Scale className="w-4 h-4" /><span className="text-sm font-medium">{t.volWaste}</span></div>
          <div className="text-xl font-bold text-slate-800 dark:text-slate-100">{(result.wasteVolume / 1000).toFixed(0)} <span className="text-sm font-normal text-slate-500 dark:text-slate-400">cc</span></div>
        </div>
      </div>
    </div>
  </div>
);

const AiAnalysisSection = ({ t, aiAnalysis, loadingAI, payloadVol, boxVol, calcEfficiency }: { t: Translation, aiAnalysis: AIAnalysis | null, loadingAI: boolean, payloadVol: number, boxVol: number, calcEfficiency: number }) => {
  const [showEffTooltip, setShowEffTooltip] = useState(false);
  
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-indigo-100 dark:border-indigo-900 relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-t-xl"></div>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4"><Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /><h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{t.aiAnalysisTitle}</h3></div>
        {loadingAI ? (
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
            <div className="h-20 bg-slate-100 dark:bg-slate-700 rounded mt-4"></div>
            <div className="text-xs text-slate-400 text-center pt-2">{t.waiting}</div>
          </div>
        ) : aiAnalysis ? (
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg border border-indigo-100 dark:border-indigo-800">
                <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">{t.recommendation}</span>
                <p className="font-semibold text-indigo-900 dark:text-indigo-200 mt-1">{aiAnalysis.recommendation}</p>
              </div>
              <div className="flex-1 bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg border border-purple-100 dark:border-purple-800">
                <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider">{t.material}</span>
                <p className="font-semibold text-purple-900 dark:text-purple-200 mt-1">{aiAnalysis.materialSuggestion}</p>
              </div>
              <div className="w-full md:w-auto bg-slate-50 dark:bg-slate-700 p-4 rounded-lg border border-slate-100 dark:border-slate-600 flex flex-col justify-center items-center min-w-[100px] relative cursor-help transition-colors hover:bg-slate-100 dark:hover:bg-slate-600 hover:border-slate-300 dark:hover:border-slate-500 z-10"
                onMouseEnter={() => setShowEffTooltip(true)} onMouseLeave={() => setShowEffTooltip(false)}>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.efficiency}</span>
                <div className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-1">{aiAnalysis.efficiencyScore}%</div>
                {showEffTooltip && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 bg-slate-800 text-white text-xs rounded-lg p-3 shadow-xl z-50 pointer-events-none animate-in fade-in slide-in-from-bottom-2 duration-200">
                    <div className="font-bold mb-2 border-b border-slate-600 pb-1 text-slate-200">{t.efficiencyFormula}</div>
                    <div className="space-y-1 font-mono text-[11px]">
                      <div className="flex justify-between"><span className="text-slate-400">{t.effVolPayload}:</span><span>{(payloadVol/1000).toFixed(0)} cc</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">{t.effVolBox}:</span><span>{(boxVol/1000).toFixed(0)} cc</span></div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-600 text-center"><span className="text-slate-400">Result: </span><span className="font-bold text-emerald-400 text-sm">{calcEfficiency.toFixed(1)}%</span></div>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-0.5 border-4 border-transparent border-t-slate-800"></div>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3 flex items-center gap-2"><Truck className="w-4 h-4 text-slate-400" />{t.reasoning}</h4>
              <ul className="space-y-3">
                {aiAnalysis.reasoning.map((point, index) => (
                  <li key={index} className="flex items-start gap-3 bg-slate-50 dark:bg-slate-700 p-3 rounded-lg border border-slate-100 dark:border-slate-600">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-bold mt-0.5">{index + 1}</span>
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{point}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-sm">{t.waiting}</div>
        )}
      </div>
    </div>
  );
};

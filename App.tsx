import React, { useState, useEffect } from 'react';
import { Package, ArrowRight, Settings2, Globe, Layers, Lightbulb, Box } from 'lucide-react';
import { DEFAULT_INVENTORY_CSV, GAP_L, GAP_W, GAP_H, DEFAULT_INNER_WALL } from './constants';
import { InventoryEditor } from './components/InventoryEditor';
import { ResultDisplay } from './components/ResultDisplay';
import { LogicGuide } from './components/LogicGuide';
import { parseInventoryCSV, findBestBox } from './services/packaging';
import { getAIRecommendation } from './services/ai';
import { BoxItem, Dimensions, CalculationResult, AIAnalysis, Language, PackagingConfig } from './types';
import { translations } from './i18n';

function App() {
  // State
  const [productDims, setProductDims] = useState<Dimensions>({ length: 0, width: 0, height: 0 });
  
  // Packaging Strategy State
  const [config, setConfig] = useState<PackagingConfig>({
    innerArrangement: { l: 1, w: 1, h: 1 },
    masterArrangement: { l: 1, w: 1, h: 1 },
    innerWallThickness: DEFAULT_INNER_WALL
  });

  const [inventoryCsv, setInventoryCsv] = useState(DEFAULT_INVENTORY_CSV);
  const [inventory, setInventory] = useState<BoxItem[]>([]);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  const [language, setLanguage] = useState<Language>('cn'); 
  const [showLogicGuide, setShowLogicGuide] = useState(false);

  // Get current translations
  const t = translations[language];

  // Initialize
  useEffect(() => {
    const inv = parseInventoryCSV(inventoryCsv);
    setInventory(inv);
  }, [inventoryCsv]);

  useEffect(() => {
     if (!process.env.API_KEY) {
        setApiKeyMissing(true);
     }
  }, []);

  // Update document title when language changes
  useEffect(() => {
    document.title = t.pageTitle;
  }, [language, t.pageTitle]);

  // Handlers
  const handleInputChange = (field: keyof Dimensions, value: string) => {
    const num = parseFloat(value);
    setProductDims(prev => ({ ...prev, [field]: isNaN(num) ? 0 : num }));
  };

  const handleConfigChange = (
    section: 'innerArrangement' | 'masterArrangement',
    field: 'l' | 'w' | 'h',
    value: string
  ) => {
    const num = Math.max(1, parseInt(value) || 1);
    setConfig(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: num }
    }));
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'cn' : 'en');
  };

  const handleCalculate = async () => {
    if (productDims.length === 0 || productDims.width === 0 || productDims.height === 0) {
      return;
    }

    // 1. Core Logic
    const calcResult = findBestBox(productDims, inventory, config);
    setResult(calcResult);
    
    // 2. AI Enhancement
    setAiAnalysis(null);
    setIsAiLoading(true);
    try {
      // Pass the current language to the AI service
      const analysis = await getAIRecommendation(productDims, calcResult, language);
      setAiAnalysis(analysis);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">{t.title}</h1>
              <p className="text-xs text-slate-500 hidden sm:block">{t.subtitle}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
             <button
                onClick={() => setShowLogicGuide(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-full transition-colors border border-amber-200"
             >
                <Lightbulb className="w-4 h-4" />
                <span className="hidden sm:inline">{t.logicGuideBtn}</span>
             </button>

             <button 
               onClick={toggleLanguage}
               className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
             >
               <Globe className="w-4 h-4" />
               <span>{language === 'en' ? '中文' : 'English'}</span>
             </button>

            {apiKeyMissing && (
               <span className="text-xs text-red-500 font-semibold bg-red-50 px-2 py-1 rounded">{t.apiKeyMissing}</span>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        
        {/* Intro / Logic Explained */}
        <section className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-800 mb-1">{t.safetyGapTitle}</h2>
            <p className="text-slate-500 text-sm">
              {t.safetyGapDesc}
            </p>
          </div>
          <div className="flex gap-4 text-sm">
            <div className="px-4 py-2 bg-slate-100 rounded-lg border border-slate-200 font-mono">
              L + {GAP_L}mm
            </div>
            <div className="px-4 py-2 bg-slate-100 rounded-lg border border-slate-200 font-mono">
              W + {GAP_W}mm
            </div>
            <div className="px-4 py-2 bg-slate-100 rounded-lg border border-slate-200 font-mono">
              H + {GAP_H}mm
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Inputs */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Card 1: Product Specifications */}
            <div className="bg-white rounded-xl shadow-lg shadow-indigo-100/50 border border-slate-200 p-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-full -mr-10 -mt-10 blur-2xl"></div>
              <h2 className="text-lg font-bold mb-1 flex items-center gap-2 text-slate-800">
                <Box className="w-5 h-5 text-indigo-600" />
                {t.productDimsTitle}
              </h2>
              <p className="text-xs text-slate-500 mb-6">{t.productDimsDesc}</p>
              
              <div className="grid grid-cols-3 gap-3 mb-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">{t.length}</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-center font-mono"
                    value={productDims.length || ''}
                    onChange={(e) => handleInputChange('length', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">{t.width}</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-center font-mono"
                    value={productDims.width || ''}
                    onChange={(e) => handleInputChange('width', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">{t.height}</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-center font-mono"
                    value={productDims.height || ''}
                    onChange={(e) => handleInputChange('height', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Card 2: Packaging Strategy Configuration */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                 <h2 className="text-lg font-bold mb-1 flex items-center gap-2 text-slate-800">
                    <Layers className="w-5 h-5 text-indigo-600" />
                    {t.strategyTitle}
                 </h2>
                 <p className="text-xs text-slate-500 mb-6">{t.strategyDesc}</p>
                 
                 {/* Inner Pack */}
                 <div className="bg-indigo-50/50 rounded-lg p-4 mb-4 border border-indigo-100">
                    <h3 className="text-xs font-bold text-indigo-600 mb-3 uppercase tracking-wide flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                      {t.innerPackTitle}
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                         <div className="flex-1">
                            <label className="text-[10px] text-slate-500 font-medium block mb-1">{t.arrangeL}</label>
                            <input type="number" min="1" value={config.innerArrangement.l} onChange={(e) => handleConfigChange('innerArrangement', 'l', e.target.value)} className="w-full text-center border border-indigo-200 rounded py-1.5 text-sm focus:ring-1 focus:ring-indigo-500 outline-none" />
                         </div>
                         <div className="flex-1">
                            <label className="text-[10px] text-slate-500 font-medium block mb-1">{t.arrangeW}</label>
                            <input type="number" min="1" value={config.innerArrangement.w} onChange={(e) => handleConfigChange('innerArrangement', 'w', e.target.value)} className="w-full text-center border border-indigo-200 rounded py-1.5 text-sm focus:ring-1 focus:ring-indigo-500 outline-none" />
                         </div>
                         <div className="flex-1">
                            <label className="text-[10px] text-slate-500 font-medium block mb-1">{t.arrangeH}</label>
                            <input type="number" min="1" value={config.innerArrangement.h} onChange={(e) => handleConfigChange('innerArrangement', 'h', e.target.value)} className="w-full text-center border border-indigo-200 rounded py-1.5 text-sm focus:ring-1 focus:ring-indigo-500 outline-none" />
                         </div>
                    </div>
                     <div className="mt-3 pt-3 border-t border-indigo-100">
                        <label className="text-[10px] text-slate-500 font-medium block mb-1">{t.innerWall}</label>
                        <div className="relative">
                          <input 
                              type="number" 
                              min="0" 
                              step="0.5"
                              value={config.innerWallThickness} 
                              onChange={(e) => setConfig({...config, innerWallThickness: parseFloat(e.target.value) || 0})} 
                              className="w-full text-left px-3 border border-indigo-200 rounded py-1.5 text-sm bg-white focus:ring-1 focus:ring-indigo-500 outline-none" 
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">mm</span>
                        </div>
                     </div>
                 </div>

                 {/* Master Carton */}
                 <div className="bg-emerald-50/50 rounded-lg p-4 border border-emerald-100">
                    <h3 className="text-xs font-bold text-emerald-600 mb-3 uppercase tracking-wide flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                       {t.masterCartonTitle}
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                         <div className="flex-1">
                            <label className="text-[10px] text-slate-500 font-medium block mb-1">{t.arrangeL}</label>
                            <input type="number" min="1" value={config.masterArrangement.l} onChange={(e) => handleConfigChange('masterArrangement', 'l', e.target.value)} className="w-full text-center border border-emerald-200 rounded py-1.5 text-sm focus:ring-1 focus:ring-emerald-500 outline-none" />
                         </div>
                         <div className="flex-1">
                            <label className="text-[10px] text-slate-500 font-medium block mb-1">{t.arrangeW}</label>
                            <input type="number" min="1" value={config.masterArrangement.w} onChange={(e) => handleConfigChange('masterArrangement', 'w', e.target.value)} className="w-full text-center border border-emerald-200 rounded py-1.5 text-sm focus:ring-1 focus:ring-emerald-500 outline-none" />
                         </div>
                         <div className="flex-1">
                            <label className="text-[10px] text-slate-500 font-medium block mb-1">{t.arrangeH}</label>
                            <input type="number" min="1" value={config.masterArrangement.h} onChange={(e) => handleConfigChange('masterArrangement', 'h', e.target.value)} className="w-full text-center border border-emerald-200 rounded py-1.5 text-sm focus:ring-1 focus:ring-emerald-500 outline-none" />
                         </div>
                    </div>
                 </div>

              <button
                onClick={handleCalculate}
                disabled={!productDims.length || !productDims.width || !productDims.height}
                className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
              >
                {t.calculateBtn}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Inventory Manager */}
            <InventoryEditor csvData={inventoryCsv} onSave={setInventoryCsv} t={t} />
            
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-7">
            {result ? (
              <ResultDisplay 
                result={result} 
                aiAnalysis={aiAnalysis} 
                loadingAI={isAiLoading} 
                t={t} 
                config={config} 
                product={productDims} 
              />
            ) : (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-slate-400 bg-slate-100/50 rounded-xl border-2 border-dashed border-slate-200">
                <Package className="w-16 h-16 mb-4 opacity-20" />
                <p className="font-medium">{t.emptyStateTitle}</p>
                <p className="text-sm opacity-60">{t.emptyStateDesc}</p>
              </div>
            )}
          </div>
        </div>

        {/* Logic Guide Modal */}
        <LogicGuide isOpen={showLogicGuide} onClose={() => setShowLogicGuide(false)} t={t} />

      </main>
    </div>
  );
}

export default App;
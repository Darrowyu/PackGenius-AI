import { Package, Play, RotateCcw } from 'lucide-react';
import { usePackagingStore } from '@/stores/packaging-store';
import { useAppTranslation } from '@/hooks/useAppTranslation';
import { ProductInput } from '@/components/features/ProductInput';
import { ConfigPanel } from '@/components/features/ConfigPanel';
import { SafetyGapPanel } from '@/components/features/SafetyGapPanel';
import { ResultDisplay } from '@/components/features/ResultDisplay';
import { ProductPreview } from '@/components/features/ProductPreview';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

export function CalculatorPage() {
  const t = useAppTranslation();
  const {
    product, config, safetyGaps, result, aiAnalysis, isLoading, error,
    calculate, reset
  } = usePackagingStore();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-8rem)]">
      {/* Left Column: Input (Scrollable) */}
      <div className="lg:col-span-5 h-full flex flex-col overflow-hidden bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            {t.navCalculator}
          </h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
           {/* Primary Inputs */}
           <div className="space-y-6">
              <ProductInput />
              
              <Accordion type="single" collapsible defaultValue="config" className="w-full">
                <AccordionItem value="config">
                  <AccordionTrigger className="text-sm font-medium">{t.configTitle}</AccordionTrigger>
                  <AccordionContent className="pt-4 px-1">
                    <ConfigPanel />
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="safety">
                  <AccordionTrigger className="text-sm font-medium">{t.safetyGapTitle}</AccordionTrigger>
                  <AccordionContent className="pt-4 px-1">
                    <SafetyGapPanel />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
           </div>
        </div>
        
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex gap-3">
           <Button 
             className="flex-1 gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200 dark:shadow-indigo-900/20"
             onClick={calculate}
             disabled={isLoading}
           >
             <Play className="w-4 h-4 fill-current" />
             {isLoading ? t.calculating : t.calculateBtn || 'Start Calculation'}
           </Button>
           
           <Button 
             variant="outline"
             size="icon"
             onClick={reset}
             title={t.resetBtn || 'Reset'}
             className="border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
           >
             <RotateCcw className="w-4 h-4 text-slate-500" />
           </Button>
        </div>
      </div>

      {/* Right Column: Results (Sticky/Fixed) */}
      <div className="lg:col-span-7 h-full overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="p-6 h-full">
            {result ? (
              <ResultDisplay 
                result={result} 
                aiAnalysis={aiAnalysis} 
                loadingAI={isLoading && !result} 
                t={t} 
                config={config} 
                product={product} 
                safetyGaps={safetyGaps}
              />
            ) : product.length > 0 || product.width > 0 || product.height > 0 ? (
              <div className="h-full flex flex-col">
                <ProductPreview product={product} config={config} t={t} />
                {isLoading && <p className="text-center mt-4 text-slate-500 animate-pulse">{t.calculating}</p>}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                <div className="w-20 h-20 mb-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                   <Package className="w-10 h-10 opacity-20" />
                </div>
                <p className="font-medium text-lg">{t.emptyStateTitle}</p>
                <p className="text-sm opacity-60 max-w-xs text-center mt-2">{t.emptyStateDesc}</p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

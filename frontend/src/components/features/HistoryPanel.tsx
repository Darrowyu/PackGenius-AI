import { useState, useEffect } from 'react';
import { History, Trash2, Clock, ChevronDown, ChevronUp, RotateCcw, Box, Layers } from 'lucide-react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Translation } from '@/i18n';
import { Dimensions, PackagingConfig } from '@/types';

interface HistoryItem {
  id: number;
  product: Dimensions;
  config: PackagingConfig;
  result: {
    box: { id: string; length: number; width: number; height: number };
    isCustom: boolean;
    innerBoxDims?: Dimensions;
    masterPayloadDims?: Dimensions;
    totalItems?: number;
    gapL?: number;
    gapW?: number;
    gapH?: number;
    wasteVolume?: number;
  };
  created_at: string;
}

interface Props {
  t: Translation;
  onRestore: (product: Dimensions, config: PackagingConfig) => void;
  defaultOpen?: boolean;
}

export const HistoryPanel: React.FC<Props> = ({ t, onRestore, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await api.get<HistoryItem[]>('/history');
      setHistory(data);
    } catch (e) {
      console.error('Failed to fetch history:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHistory(); }, []);
  useEffect(() => { if (isOpen) fetchHistory(); }, [isOpen]);

  const handleDelete = async (id: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      await api.delete(`/history/${id}`);
      setHistory(prev => prev.filter(h => h.id !== id));
      if (selectedItem?.id === id) setSelectedItem(null);
    } catch (e) {
      console.error('Failed to delete:', e);
    }
  };

  const handleClear = async () => {
    if (!confirm(t.confirmClearHistory)) return;
    try {
      await api.delete('/history');
      setHistory([]);
      setSelectedItem(null);
    } catch (e) {
      console.error('Failed to clear:', e);
    }
  };

  const handleRestore = (item: HistoryItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    onRestore(item.product, item.config);
    setSelectedItem(null);
  };

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleString();

  return (
    <>
      <Card className="border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600 flex justify-between items-center cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors" onClick={() => setIsOpen(!isOpen)}>
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
            <History className="w-5 h-5" />
            <h2 className="font-semibold">{t.historyTitle}</h2>
            <span className="text-xs bg-slate-200 dark:bg-slate-600 px-2 py-0.5 rounded-full">{history.length}</span>
          </div>
          {isOpen ? <ChevronUp className="w-4 h-4 text-slate-500 dark:text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400" />}
        </div>
        
        {isOpen && (
          <CardContent className="p-4 animate-in slide-in-from-top-4 duration-300">
            {history.length > 0 && (
              <div className="flex justify-end mb-3">
                <Button size="sm" variant="outline" className="text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 dark:border-slate-600 h-8 text-xs" onClick={handleClear}>
                  <Trash2 className="w-3.5 h-3.5 mr-1" />{t.clearHistory}
                </Button>
              </div>
            )}
            
            {loading ? (
              <p className="text-center text-slate-500 dark:text-slate-400 py-8 text-sm">{t.loadingInventory}</p>
            ) : history.length === 0 ? (
              <p className="text-center text-slate-400 dark:text-slate-500 py-8 text-sm">{t.noHistory}</p>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                {history.map(item => {
                  const box = item.result?.box || (item.result as any);
                  if (!item.product || !box?.length) return null;
                  const isCustom = item.result?.isCustom;
                  return (
                    <div key={item.id} onClick={() => setSelectedItem(item)} className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-100 dark:border-slate-600 hover:border-indigo-300 dark:hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-colors cursor-pointer group">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 mb-2">
                            <Clock className="w-3.5 h-3.5 shrink-0" />
                            <span>{formatDate(item.created_at)}</span>
                            <span className={`ml-auto px-2 py-0.5 rounded text-[10px] font-medium ${isCustom ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'}`}>
                              {isCustom ? t.customRequired : box.id}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1">{t.productDimsTitle?.replace('1. ', '').replace(' (单个)', '')}</div>
                              <div className="font-mono text-sm font-semibold text-slate-700 dark:text-slate-200">{item.product.length} × {item.product.width} × {item.product.height}</div>
                            </div>
                            <div>
                              <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1">{t.boxDims}</div>
                              <div className={`font-mono text-sm font-semibold ${isCustom ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>{box.length} × {box.width} × {box.height}</div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1 shrink-0">
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-500 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30" onClick={(e) => handleRestore(item, e)} title={t.restore}>
                            <RotateCcw className="w-4 h-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30" onClick={(e) => handleDelete(item.id, e)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        )}
      </Card>

      <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <DialogContent className="dark:bg-slate-800 dark:border-slate-700 max-w-lg">
          <DialogHeader>
            <DialogTitle className="dark:text-slate-100 flex items-center gap-2">
              <History className="w-5 h-5 text-indigo-500" />
              {t.historyTitle} - {selectedItem && formatDate(selectedItem.created_at)}
            </DialogTitle>
            <DialogDescription className="sr-only">{t.historyPageDesc}</DialogDescription>
          </DialogHeader>
          {selectedItem && <HistoryDetail item={selectedItem} t={t} onRestore={() => handleRestore(selectedItem)} onClose={() => setSelectedItem(null)} />}
        </DialogContent>
      </Dialog>
    </>
  );
};

const defaultArr = { l: 1, w: 1, h: 1 };

const HistoryDetail: React.FC<{ item: HistoryItem; t: Translation; onRestore: () => void; onClose: () => void }> = ({ item, t, onRestore, onClose }) => {
  const result = item.result || {} as any;
  const rawBox = result.box || result;
  const box = { length: rawBox?.length || 0, width: rawBox?.width || 0, height: rawBox?.height || 0, id: rawBox?.id || 'N/A' };
  const isCustom = result.isCustom;
  const product = { length: item.product?.length || 0, width: item.product?.width || 0, height: item.product?.height || 0 };
  
  // 兼容新旧两种配置格式
  const rawConfig = item.config as any || {};
  const innerBox = rawConfig.innerBox || { dims: { length: 0, width: 0, height: 0 }, quantity: 1 };
  const masterArr = rawConfig.masterArrangement || defaultArr;
  const innerQuantity = innerBox.quantity || (rawConfig.innerArrangement ? rawConfig.innerArrangement.l * rawConfig.innerArrangement.w * rawConfig.innerArrangement.h : 1);
  
  // 优先使用存储的真实数据
  const innerDims = result.innerBoxDims || innerBox.dims || { length: 0, width: 0, height: 0 };
  const masterDims = result.masterPayloadDims || {
    length: innerDims.length * masterArr.l,
    width: innerDims.width * masterArr.w,
    height: innerDims.height * masterArr.h
  };
  const totalItems = result.totalItems ?? (innerQuantity * masterArr.l * masterArr.w * masterArr.h);
  const payloadVol = masterDims.length * masterDims.width * masterDims.height;
  const boxVol = box.length * box.width * box.height;
  const efficiency = boxVol > 0 ? ((payloadVol / boxVol) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-4">
      <div className={`p-4 rounded-lg ${isCustom ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800' : 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800'}`}>
        <div className="flex items-center justify-between mb-2">
          <span className={`text-xs font-bold uppercase ${isCustom ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
            {isCustom ? t.customRequired : t.stockAvailable}
          </span>
          <span className={`px-2 py-1 rounded text-xs font-mono font-bold ${isCustom ? 'bg-amber-100 text-amber-700 dark:bg-amber-800 dark:text-amber-200' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-800 dark:text-emerald-200'}`}>
            {isCustom ? 'CUSTOM' : box.id}
          </span>
        </div>
        <div className="text-2xl font-mono font-bold text-slate-800 dark:text-slate-100">
          {box.length} × {box.width} × {box.height} <span className="text-sm font-normal text-slate-500">cm</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <Box className="w-3.5 h-3.5" /> {t.productDimsTitle?.replace('1. ', '')}
          </div>
          <div className="font-mono font-semibold text-slate-700 dark:text-slate-200">{product.length} × {product.width} × {product.height}</div>
        </div>
        <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <Layers className="w-3.5 h-3.5" /> {t.totalItems}
          </div>
          <div className="font-mono font-semibold text-slate-700 dark:text-slate-200">{totalItems} <span className="text-xs font-normal">pcs</span></div>
        </div>
      </div>

      <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800">
        <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-2 uppercase">{t.strategyTitle?.replace('2. ', '')}</div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-slate-500 dark:text-slate-400">{t.innerPackTitle}:</span>
            <span className="ml-1 font-mono font-medium text-slate-700 dark:text-slate-200">{innerQuantity} pcs</span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400">{t.masterCartonTitle}:</span>
            <span className="ml-1 font-mono font-medium text-slate-700 dark:text-slate-200">{masterArr.l}×{masterArr.w}×{masterArr.h}</span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400">{t.innerDims}:</span>
            <span className="ml-1 font-mono font-medium text-slate-700 dark:text-slate-200">{innerDims.length?.toFixed?.(0) || innerDims.length}×{innerDims.width?.toFixed?.(0) || innerDims.width}×{innerDims.height?.toFixed?.(0) || innerDims.height}</span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400">{t.masterPayload}:</span>
            <span className="ml-1 font-mono font-medium text-slate-700 dark:text-slate-200">{masterDims.length?.toFixed?.(0) || masterDims.length}×{masterDims.width?.toFixed?.(0) || masterDims.width}×{masterDims.height?.toFixed?.(0) || masterDims.height}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
        <span className="text-sm text-slate-600 dark:text-slate-300">{t.efficiency}</span>
        <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{efficiency}%</span>
      </div>

      <div className="flex gap-2 pt-2">
        <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700" onClick={onRestore}>
          <RotateCcw className="w-4 h-4 mr-2" /> {t.restore}
        </Button>
        <Button variant="outline" onClick={onClose} className="dark:border-slate-600 dark:text-slate-300">
          {t.close}
        </Button>
      </div>
    </div>
  );
};

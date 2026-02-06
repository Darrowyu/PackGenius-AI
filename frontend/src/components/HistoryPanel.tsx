import { useState, useEffect } from 'react';
import { History, Trash2, Clock, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Translation } from '@/i18n';
import { Dimensions, PackagingConfig } from '@/types';

interface HistoryItem {
  id: number;
  product: Dimensions;
  config: PackagingConfig;
  result: { box: { id: string; length: number; width: number; height: number }; isCustom: boolean };
  created_at: string;
}

interface Props {
  t: Translation;
  onRestore: (product: Dimensions, config: PackagingConfig) => void;
}

export const HistoryPanel: React.FC<Props> = ({ t, onRestore }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => { fetchHistory(); }, []); // 初始加载
  useEffect(() => { if (isOpen) fetchHistory(); }, [isOpen]);

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/history/${id}`);
      setHistory(prev => prev.filter(h => h.id !== id));
    } catch (e) {
      console.error('Failed to delete:', e);
    }
  };

  const handleClear = async () => {
    if (!confirm(t.confirmClearHistory || '确定清空所有历史记录？')) return;
    try {
      await api.delete('/history');
      setHistory([]);
    } catch (e) {
      console.error('Failed to clear:', e);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString();
  };


  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="px-6 py-4 bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600 flex justify-between items-center cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
          <History className="w-5 h-5" />
          <h2 className="font-semibold">{t.historyTitle || '计算历史'}</h2>
          <span className="text-xs bg-slate-200 dark:bg-slate-600 px-2 py-0.5 rounded-full">{history.length}</span>
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4 text-slate-500 dark:text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400" />}
      </div>
      {isOpen && (
        <div className="p-4 animate-in slide-in-from-top-4 duration-300">
          {history.length > 0 && (
            <div className="flex justify-end mb-3">
              <Button size="sm" variant="outline" className="text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 dark:border-slate-600" onClick={handleClear}>
                <Trash2 className="w-4 h-4 mr-1" />{t.clearHistory || '清空历史'}
              </Button>
            </div>
          )}
          {loading ? (
            <p className="text-center text-slate-500 dark:text-slate-400 py-8">{t.loadingInventory}</p>
          ) : history.length === 0 ? (
            <p className="text-center text-slate-400 dark:text-slate-500 py-8">{t.noHistory || '暂无计算历史'}</p>
          ) : (
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {history.filter(item => item.product && item.result?.box).map(item => (
                <div key={item.id} className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-100 dark:border-slate-600 hover:border-slate-200 dark:hover:border-slate-500 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(item.created_at)}
                      </div>
                      <div className="font-mono text-sm">
                        <span className="text-slate-600 dark:text-slate-300">{t.productDimsTitle?.replace('1. ', '') || '产品'}:</span>
                        <span className="ml-2 font-semibold dark:text-slate-100">{item.product.length} × {item.product.width} × {item.product.height}</span>
                      </div>
                      <div className="font-mono text-sm mt-1">
                        <span className="text-slate-600 dark:text-slate-300">{t.boxDims || '纸箱'}:</span>
                        <span className={`ml-2 font-semibold ${item.result.isCustom ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                          {item.result.box.length} × {item.result.box.width} × {item.result.box.height}
                          {item.result.isCustom ? ` (${t.customRequired || '定制'})` : ` (${item.result.box.id})`}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" className="h-7 px-2 text-blue-500 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30" onClick={() => onRestore(item.product, item.config)} title={t.restore || '恢复'}>
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7 px-2 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

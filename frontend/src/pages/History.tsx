import { useNavigate } from 'react-router-dom';
import { usePackagingStore } from '@/stores/packaging-store';
import { useAppTranslation } from '@/hooks/useAppTranslation';
import { HistoryPanel } from '@/components/features/HistoryPanel';

export function HistoryPage() {
  const t = useAppTranslation();
  const navigate = useNavigate();
  const { setProduct, setConfig } = usePackagingStore();

  const handleRestore = (prod: any, cfg: any) => {
    setProduct(prod);
    setConfig(cfg);
    navigate('/'); // Go back to calculator to see result
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{t.historyTitle}</h2>
        <p className="text-slate-500 dark:text-slate-400">{t.historyPageDesc}</p>
      </div>

      <HistoryPanel t={t} onRestore={handleRestore} defaultOpen />
    </div>
  );
}

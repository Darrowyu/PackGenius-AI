import { Package } from 'lucide-react';
import { memo } from 'react';

interface EmptyStateProps {
  t: {
    emptyStateTitle: string;
    emptyStateDesc: string;
  };
}

export const EmptyState = memo(function EmptyState({ t }: EmptyStateProps) {
  return (
    <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 bg-slate-100/50 dark:bg-slate-800/50 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700">
      <Package className="w-16 h-16 mb-4 opacity-20" />
      <p className="font-medium">{t.emptyStateTitle}</p>
      <p className="text-sm opacity-60">{t.emptyStateDesc}</p>
    </div>
  );
});

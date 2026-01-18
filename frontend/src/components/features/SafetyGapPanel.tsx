import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { usePackagingStore } from '@/stores/packaging-store';
import { translations } from '@/i18n/index';

export function SafetyGapPanel() {
  const { safetyGaps, language, setSafetyGaps } = usePackagingStore();
  const t = translations[language];

  return (
    <Card className="border-slate-200 dark:border-slate-700 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200 whitespace-nowrap">
            {t.safetyGapTitle}
          </span>
          <div className="flex items-center gap-1 text-sm">
            {(['l', 'w', 'h'] as const).map((dim, i) => (
              <div key={dim} className="flex items-center">
                {i > 0 && <span className="text-slate-300 mx-2">×</span>}
                <span className="text-slate-500 font-mono uppercase text-xs mr-1">{dim}+</span>
                <Input
                  type="number"
                  min="0"
                  step="0.1"
                  value={safetyGaps[dim]}
                  onChange={(e) => setSafetyGaps({ [dim]: parseFloat(e.target.value) || 0 })}
                  className="h-8 w-14 px-1 text-center font-mono text-sm bg-white dark:bg-slate-700"
                />
              </div>
            ))}
            <span className="text-xs text-slate-400 ml-1">cm</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

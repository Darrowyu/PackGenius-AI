import { Layers, Package, Box } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { usePackagingStore } from '@/stores/packaging-store';
import { translations } from '@/i18n/index';

export function ConfigPanel() {
  const { config, language, setConfig } = usePackagingStore();
  const t = translations[language];

  const handleStackCountChange = (value: string) => {
    const num = Math.max(1, parseInt(value) || 1);
    setConfig({ innerBox: { stackCount: num } });
  };

  const handleMasterChange = (field: 'l' | 'w' | 'h', value: string) => {
    const num = Math.max(1, parseInt(value) || 1);
    setConfig({ masterArrangement: { ...config.masterArrangement, [field]: num } });
  };

  return (
    <Card className="border-slate-200 dark:border-slate-700">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          {t.strategyTitle}
        </CardTitle>
        <CardDescription className="text-xs">{t.strategyDesc}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* 内盒配置 - 叠放模式 */}
        <div className="bg-indigo-50/50 dark:bg-indigo-900/20 rounded-lg p-4 border border-indigo-100 dark:border-indigo-800">
          <h3 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-3 uppercase tracking-wide flex items-center gap-2">
            <Package className="w-3.5 h-3.5" /> {t.innerPackTitle}
          </h3>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mb-2">{t.stackModeDesc || '产品在高度方向叠放'}</p>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-[10px] text-slate-500 dark:text-slate-400 mb-1 block">{t.stackCount || '叠放数量'}</Label>
              <div className="relative">
                <Input type="number" min="1" value={config.innerBox.stackCount} onChange={e => handleStackCountChange(e.target.value)}
                  className="text-center h-9 text-sm bg-white dark:bg-slate-700 pr-10 font-mono font-semibold" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">pcs</span>
              </div>
            </div>
            <div>
              <Label className="text-[10px] text-slate-500 dark:text-slate-400 mb-1 block">{t.innerWall}</Label>
              <div className="relative">
                <Input type="number" min="0" step="0.5" value={config.innerWallThickness}
                  onChange={e => setConfig({ innerWallThickness: parseFloat(e.target.value) || 0 })}
                  className="text-center h-9 text-sm bg-white dark:bg-slate-700 pr-10" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">cm</span>
              </div>
            </div>
          </div>
        </div>

        {/* 外箱排列 */}
        <div className="bg-emerald-50/50 dark:bg-emerald-900/20 rounded-lg p-4 border border-emerald-100 dark:border-emerald-800">
          <h3 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-3 uppercase tracking-wide flex items-center gap-2">
            <Box className="w-3.5 h-3.5" /> {t.masterCartonTitle}
          </h3>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mb-2">{t.masterCartonDesc || '外箱装多少个内盒'}</p>
          <div className="grid grid-cols-3 gap-2">
            {(['l', 'w', 'h'] as const).map(field => (
              <div key={field}>
                <Label className="text-[10px] text-slate-500 dark:text-slate-400 mb-1 block">{t[`arrange${field.toUpperCase()}` as keyof typeof t]}</Label>
                <Input type="number" min="1" value={config.masterArrangement[field]} onChange={e => handleMasterChange(field, e.target.value)}
                  className="text-center h-8 text-sm bg-white dark:bg-slate-700" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

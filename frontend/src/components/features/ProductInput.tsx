import { Box } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { usePackagingStore } from '@/stores/packaging-store';
import { translations } from '@/i18n/index';

export function ProductInput() {
  const { product, language, setProduct, calculate, isLoading } = usePackagingStore();
  const t = translations[language];

  const handleInputChange = (field: 'length' | 'width' | 'height', value: string) => {
    const num = parseFloat(value);
    setProduct({ [field]: isNaN(num) ? 0 : num });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && product.length > 0 && product.width > 0 && product.height > 0 && !isLoading) {
      calculate();
    }
  };

  return (
    <Card className="relative overflow-hidden border-slate-200 dark:border-slate-700 shadow-lg shadow-indigo-100/50 dark:shadow-slate-900/50">
      <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 dark:bg-indigo-900/30 rounded-full -mr-10 -mt-10 blur-2xl pointer-events-none"></div>
      
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Box className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          {t.productDimsTitle}
        </CardTitle>
        <CardDescription className="text-xs">
          {t.productDimsDesc}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-3 gap-3">
          {(['length', 'width', 'height'] as const).map(field => (
            <div key={field} className="space-y-2">
              <Label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {t[field]}
              </Label>
              <div className="relative">
                <Input
                  type="number"
                  min="0"
                  placeholder="0"
                  className="text-center font-mono bg-slate-50 dark:bg-slate-700 pr-8"
                  value={product[field] || ''}
                  onChange={e => handleInputChange(field, e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 pointer-events-none">
                  cm
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

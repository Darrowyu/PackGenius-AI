import { Box } from 'lucide-react';
import type { Dimensions } from '@packgenius/shared';
import { memo } from 'react';

interface ProductInputProps {
  product: Dimensions;
  onProductChange: (dims: Partial<Dimensions>) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  t: {
    productDimsTitle: string;
    productDimsDesc: string;
    length: string;
    width: string;
    height: string;
  };
}

export const ProductInput = memo(function ProductInput({
  product,
  onProductChange,
  onKeyDown,
  t,
}: ProductInputProps) {
  const handleInputChange = (field: keyof Dimensions, value: string) => {
    const num = parseFloat(value);
    onProductChange({ [field]: isNaN(num) ? 0 : num });
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg shadow-indigo-100/50 dark:shadow-slate-900/50 border border-slate-200 dark:border-slate-700 p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 dark:bg-indigo-900/30 rounded-full -mr-10 -mt-10 blur-2xl" />
      <h2 className="text-lg font-bold mb-1 flex items-center gap-2 text-slate-800 dark:text-slate-100">
        <Box className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        {t.productDimsTitle}
      </h2>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">{t.productDimsDesc}</p>
      <div className="grid grid-cols-3 gap-3 mb-2">
        {(['length', 'width', 'height'] as const).map((field) => (
          <div key={field}>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
              {t[field]}
            </label>
            <input
              type="number"
              min="0"
              placeholder="0"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-center font-mono dark:text-slate-100"
              value={product[field] || ''}
              onChange={(e) => handleInputChange(field, e.target.value)}
              onKeyDown={onKeyDown}
            />
          </div>
        ))}
      </div>
    </div>
  );
});

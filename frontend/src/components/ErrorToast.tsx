import { AlertCircle, X } from 'lucide-react';
import { memo } from 'react';

interface ErrorToastProps {
  error: string | null;
  onClose: () => void;
}

export const ErrorToast = memo(function ErrorToast({ error, onClose }: ErrorToastProps) {
  if (!error) return null;

  return (
    <div className="fixed top-20 right-4 z-50 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-right">
      <AlertCircle className="w-5 h-5" />
      <span>{error}</span>
      <button
        onClick={onClose}
        className="hover:bg-red-100 dark:hover:bg-red-800 p-1 rounded"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
});

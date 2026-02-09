import { Package, Globe, Lightbulb, Moon, Sun } from 'lucide-react';
import type { Language } from '@packgenius/shared';

interface HeaderProps {
  language: Language;
  darkMode: boolean;
  onToggleLanguage: () => void;
  onToggleDarkMode: () => void;
  onShowLogicGuide: () => void;
  t: {
    title: string;
    subtitle: string;
    logicGuideBtn: string;
  };
}

export function Header({
  language,
  darkMode,
  onToggleLanguage,
  onToggleDarkMode,
  onShowLogicGuide,
  t,
}: HeaderProps) {
  return (
    <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Package className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {t.title}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              {t.subtitle}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={onShowLogicGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-full transition-colors border border-amber-200"
          >
            <Lightbulb className="w-4 h-4" />
            <span className="hidden sm:inline">{t.logicGuideBtn}</span>
          </button>
          <button
            onClick={onToggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 rounded-full transition-colors"
          >
            <Globe className="w-4 h-4" />
            <span>{language === 'en' ? '中文' : 'English'}</span>
          </button>
          <button
            onClick={onToggleDarkMode}
            className="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 rounded-full transition-colors"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}

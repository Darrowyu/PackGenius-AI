import { Package, Lightbulb, Globe, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePackagingStore } from '@/stores/packaging-store';
import { translations } from '@/i18n/index';

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  onOpenLogicGuide: () => void;
}

export function Header({ darkMode, toggleDarkMode, onOpenLogicGuide }: HeaderProps) {
  const { language, setLanguage } = usePackagingStore();
  const t = translations[language];

  const toggleLanguage = () => setLanguage(language === 'en' ? 'zh-CN' : 'en');

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
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenLogicGuide}
            className="hidden sm:flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200"
          >
            <Lightbulb className="w-4 h-4" />
            <span>{t.logicGuideBtn}</span>
          </Button>
          
          {/* Mobile Icon Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onOpenLogicGuide}
            className="sm:hidden text-amber-700 bg-amber-50"
          >
            <Lightbulb className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="flex items-center gap-1.5"
          >
            <Globe className="w-4 h-4" />
            <span>{language === 'en' ? '中文' : 'English'}</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="rounded-full"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </header>
  );
}

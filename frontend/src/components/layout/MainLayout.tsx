import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  Calculator, 
  Package, 
  History, 
  Settings, 
  Menu, 
  X,
  Box,
  Lightbulb,
  Globe,
  Sun,
  Moon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useAppTranslation } from '@/hooks/useAppTranslation';
// Header removed
import { usePackagingStore } from '@/stores/packaging-store';
import { LogicGuide } from '@/components/features/LogicGuide';
import { Toaster } from '@/components/ui/sonner';

export function MainLayout() {
  const location = useLocation();
  const t = useAppTranslation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  // Store access
  const { 
    language,
    setLanguage
  } = usePackagingStore();
  
  const [showLogicGuide, setShowLogicGuide] = useState(false);
  const [localDarkMode, setLocalDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true' || window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const toggleDarkMode = () => {
    const newMode = !localDarkMode;
    setLocalDarkMode(newMode);
    document.documentElement.classList.toggle('dark', newMode);
    localStorage.setItem('darkMode', String(newMode));
  };

  const toggleLanguage = () => setLanguage(language === 'en' ? 'zh-CN' : 'en');
  
  // Navigation Items
  const navItems = [
    { href: '/', label: t.navCalculator, icon: Calculator },
    { href: '/inventory', label: t.navInventory, icon: Package },
    { href: '/history', label: t.navHistory, icon: History },
  ];

  const NavContent = () => (
    <div className="flex flex-col h-full py-4">
      <div className="px-6 mb-8 flex items-center gap-2">
        <div className="bg-primary/10 p-2 rounded-lg">
          <Box className="w-6 h-6 text-primary" />
        </div>
        <span className="font-bold text-xl tracking-tight">PackGenius</span>
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              )}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-6 mt-auto">
        <div className="text-xs text-slate-400 text-center">
          v0.1.0 Beta
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
      {/* Mobile Sidebar */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetContent side="left" className="p-0 w-72">
          <NavContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 z-30">
        <NavContent />
      </aside>

      {/* Main Content */}
      <div className="lg:pl-72 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-20 h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsMobileOpen(true)}>
              <Menu className="w-5 h-5" />
            </Button>
            <h1 className="font-semibold text-lg hidden sm:block">
              {navItems.find(i => i.href === location.pathname)?.label}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowLogicGuide(true)}
              className="hidden sm:flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200"
            >
              <Lightbulb className="w-4 h-4" />
              <span>{t.logicGuideBtn}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowLogicGuide(true)}
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
              {localDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 overflow-x-hidden">
          <Outlet context={{ setShowLogicGuide, toggleDarkMode, localDarkMode }} />
        </main>
      </div>

      {/* Global Modals */}
      <LogicGuide isOpen={showLogicGuide} onClose={() => setShowLogicGuide(false)} t={t} />
      <Toaster />
    </div>
  );
}

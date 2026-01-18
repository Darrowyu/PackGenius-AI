import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { toast } from 'sonner';

import { MainLayout } from '@/components/layout/MainLayout';
import { CalculatorPage } from '@/pages/Calculator';
import { InventoryPage } from '@/pages/Inventory';
import { HistoryPage } from '@/pages/History';
import { WelcomeGuide } from '@/components/features/WelcomeGuide';

import { usePackagingStore } from '@/stores/packaging-store';
import { useAppTranslation } from '@/hooks/useAppTranslation';

function AppContent() {
  const { error, clearError } = usePackagingStore();
  const t = useAppTranslation();

  // Error handling with Sonner
  useEffect(() => {
    if (error) {
      toast.error(error, {
        onDismiss: clearError,
        action: {
          label: t.close,
          onClick: clearError
        }
      });
    }
  }, [error, clearError, t.close]);

  // Document title
  useEffect(() => {
    document.title = t.pageTitle || 'PackGenius AI';
  }, [t.pageTitle]);

  return (
    <>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<CalculatorPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
      <WelcomeGuide t={t} />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;

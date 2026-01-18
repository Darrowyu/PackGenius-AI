import { usePackagingStore } from '@/stores/packaging-store';
import { translations } from '@/i18n';

export function useAppTranslation() {
  const language = usePackagingStore((state) => state.language);
  return translations[language];
}

import { usePackagingStore } from '@/stores/packaging-store';
import { translations, Translation } from '@/i18n/index';
import { Language } from '@/types';

export function useTranslation() {
  const language = usePackagingStore((state) => state.language);
  const setLanguage = usePackagingStore((state) => state.setLanguage);

  const t: Translation = translations[language];

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'zh-CN' : 'en');
  };

  return { t, language, setLanguage, toggleLanguage };
}

export function getTranslation(language: Language): Translation {
  return translations[language];
}

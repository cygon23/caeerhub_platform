import { useTranslation as useI18nTranslation } from "react-i18next";

// Custom hook with better TypeScript support
export function useTranslation(namespace?: string) {
  return useI18nTranslation(namespace);
}

// Hook for changing language
export function useLanguage() {
  const { i18n } = useI18nTranslation();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return {
    currentLanguage: i18n.language,
    changeLanguage,
    languages: ["en", "sw", "fr"],
  };
}

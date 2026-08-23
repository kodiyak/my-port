import type { Language } from "../config";

export function useLang() {
  const currentLang = "pt-br" as Language;
  return {
    lang: currentLang,
    isLang: (lang: Language) => lang === currentLang,
  };
}

"use client";

import { useLanguage } from './use-language';
import { translations } from '@/lib/i18n/translations';

export function useTranslations() {
  const language = useLanguage();
  
  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };
  
  return { t, language };
}

"use client";

import { createContext, useContext, ReactNode } from 'react';
import { useLanguage } from '@/lib/hooks/use-language';
import { Language } from './language-pack';

interface I18nContextType {
  currentLanguage: Language;
  changeLanguage: (language: Language) => Promise<void>;
  t: (key: string, defaultValue?: string) => string;
  isLoading: boolean;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const languageData = useLanguage();
  
  return (
    <I18nContext.Provider value={languageData}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}

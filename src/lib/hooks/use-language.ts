"use client";

import { useState, useEffect } from 'react';
import { getSelectedLanguage, Language } from '@/lib/i18n/language-pack';

export function useLanguage() {
  const [language, setLanguage] = useState<Language>('ja');

  useEffect(() => {
    setLanguage(getSelectedLanguage());
  }, []);

  return { language };
}

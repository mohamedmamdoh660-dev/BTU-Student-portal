"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, Locale } from './translations';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (keyPath: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en'); // Default to English initially
  const [mounted, setMounted] = useState(false);

  // Initialize from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('portal_language') as Locale;
    if (saved && Object.keys(translations).includes(saved)) {
      setLocaleState(saved);
    }
    setMounted(true);
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('portal_language', newLocale);
    
    // Set html dir attribute for Arabic RTL
    if (newLocale === 'ar') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
    document.documentElement.lang = newLocale;
  };

  // Setup RTL initially
  useEffect(() => {
    if (mounted) {
      if (locale === 'ar') {
        document.documentElement.dir = 'rtl';
      } else {
        document.documentElement.dir = 'ltr';
      }
      document.documentElement.lang = locale;
    }
  }, [locale, mounted]);

  // Translation function helper
  const t = (keyPath: string): string => {
    const keys = keyPath.split('.');
    let current: any = translations[locale];
    
    for (const key of keys) {
      if (current === undefined) return keyPath; // fallback
      current = current[key];
    }
    
    return current || keyPath;
  };

  // Prevent hydration mismatch by not rendering anything locale-specific until mounted
  // or we just render with English and it updates instantly. We'll render to avoid blank screen.
  
  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

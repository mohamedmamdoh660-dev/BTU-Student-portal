"use client";

import React from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Locale } from '@/lib/i18n/translations';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const LANGUAGES: { code: Locale; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' }
];

export function LanguageSwitcher({ variant = 'dark' }: { variant?: 'light' | 'dark' }) {
  const { locale, setLocale } = useLanguage();

  const currentLang = LANGUAGES.find(l => l.code === locale) || LANGUAGES[0];

  const triggerClass = variant === 'light'
    ? "inline-flex shrink-0 items-center justify-center border border-transparent hover:bg-slate-100 hover:text-slate-900 rounded-md text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-slate-300 disabled:pointer-events-none disabled:opacity-50 h-8 gap-2 px-2 text-slate-600 bg-transparent"
    : "inline-flex shrink-0 items-center justify-center border border-transparent hover:bg-slate-100/10 hover:text-white rounded-md text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-slate-300 disabled:pointer-events-none disabled:opacity-50 h-8 gap-2 px-2 text-white/70 hover:text-white bg-transparent";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={triggerClass}>
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline-block">{currentLang.flag} {currentLang.label}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white border-slate-200">
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLocale(lang.code)}
            className={`cursor-pointer text-slate-900 ${locale === lang.code ? 'bg-slate-100 font-bold' : ''}`}
          >
            <span className="mr-2">{lang.flag}</span>
            {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

"use client";

import { useLanguage } from '@/lib/i18n/LanguageContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Info } from 'lucide-react';

export function AboutMenu() {
    const { t } = useLanguage();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex shrink-0 items-center justify-center border border-white/20 hover:bg-white/20 hover:text-white rounded-md text-xs sm:text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-slate-300 disabled:pointer-events-none disabled:opacity-50 h-9 sm:h-10 gap-2 px-3 sm:px-4 text-white bg-white/10 backdrop-blur-md">
                <Info className="mr-2 h-4 w-4" />
                {t('common.aboutUni')}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-slate-900 border-white/10 text-white min-w-[200px]">
                <DropdownMenuItem className="hover:bg-white/10 focus:bg-white/10 cursor-pointer p-0">
                    <a href="https://intoffice.btu.edu.tr/tr" target="_blank" rel="noopener noreferrer" className="block w-full h-full px-2 py-1.5">
                        {t('common.intOffice')}
                    </a>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-white/10 focus:bg-white/10 cursor-pointer p-0">
                    <a href="https://bursatomer.btu.edu.tr/tr" target="_blank" rel="noopener noreferrer" className="block w-full h-full px-2 py-1.5">
                        {t('common.tomer')}
                    </a>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

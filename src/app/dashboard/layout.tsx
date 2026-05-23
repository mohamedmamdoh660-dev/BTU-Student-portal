"use client";

import React, { useState, useEffect } from "react";
import StudentSidebar from "@/components/dashboard/StudentSidebar";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-[#f3f4f6] font-sans flex flex-col md:flex-row">
            {/* Sidebar Container */}
            <div className="w-full md:w-[320px] lg:w-[360px] flex-shrink-0 bg-[#0a0f1e] shadow-2xl relative z-20">
                <StudentSidebar />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-x-hidden overflow-y-auto relative">
                <div className="absolute top-4 right-4 z-50 bg-white/80 backdrop-blur rounded-lg shadow-sm border border-slate-200">
                    <LanguageSwitcher variant="light" />
                </div>
                <main className="p-4 md:p-6 lg:p-8 w-full max-w-7xl mx-auto mt-12 md:mt-0">
                    {children}
                </main>
            </div>
        </div>
    );
}

"use client";

import React from "react";
import ApplicationsTable from "@/components/dashboard/ApplicationsTable";
import DocumentsTable from "@/components/dashboard/DocumentsTable";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function DashboardPage() {
    const { t } = useLanguage();
    return (
        <div className="w-full flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Page Header (Optional, if we want to add breadcrumbs or extra info) */}
            <div className="mb-2">
                <h1 className="text-3xl font-black text-[#0a0f1e] tracking-tight">{t('dashboard.dashboardTitle')}</h1>
                <p className="text-gray-500 mt-1 font-medium">{t('dashboard.dashboardDesc')}</p>
            </div>

            {/* Applications Section */}
            <ApplicationsTable />

            {/* Documents Section */}
            <DocumentsTable />
        </div>
    );
}

"use client";

import React, { useState, useEffect } from "react";
import { Eye, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function ApplicationsTable() {
    const { t } = useLanguage();
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplications = async () => {
            const studentId = localStorage.getItem('studentId');
            if (!studentId) {
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from('Application')
                .select(`
                    id,
                    appNumber,
                    stage,
                    academicYear:academicYearId(name),
                    semester:semesterId(name),
                    degree:degreeId(name),
                    program:programId(name),
                    preferenceOrder
                `)
                .eq('studentId', studentId)
                .order('preferenceOrder', { ascending: true });

            if (data && !error) {
                setApplications(data);
            }
            setLoading(false);
        };

        fetchApplications();
    }, []);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
            {/* Header */}
            <div className="bg-[#0a0f1e] px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-white">
                    <svg className="w-4 h-4 text-btuCyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <h2 className="text-sm font-bold tracking-widest uppercase">{t('dashboard.studentApps')}</h2>
                </div>
                {applications.length < 3 && (
                    <Button 
                        onClick={() => window.location.href = '/dashboard/applications/new'}
                        className="bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-lg font-bold h-8 px-4 transition-all text-xs shadow-none"
                    >
                        <Plus className="w-3 h-3 mr-1.5" />
                        {t('dashboard.addApp')}
                    </Button>
                )}
            </div>

            {/* Hint Box */}
            <div className="bg-gray-50/50 p-3 border-b border-gray-100 flex justify-center">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500 bg-white px-3 py-1.5 rounded-full border border-gray-100 shadow-sm">
                    <InfoIcon className="w-3.5 h-3.5 text-btuCyan" />
                    {t('dashboard.appHint')}
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto p-4">
                {loading ? (
                    <div className="flex justify-center items-center py-10 text-btuCyan">
                        <Loader2 className="w-6 h-6 animate-spin" />
                    </div>
                ) : applications.length === 0 ? (
                    <div className="flex justify-center items-center py-10 text-gray-400 text-sm font-medium">
                        {t('dashboard.noApps')}
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b-2 border-gray-200">
                                <th className="pb-3 font-bold text-gray-600 text-[11px] tracking-wider px-3">#</th>
                                <th className="pb-3 font-bold text-gray-600 text-[11px] tracking-wider px-3">{t('dashboard.tablePref')}</th>
                                <th className="pb-3 font-bold text-gray-600 text-[11px] tracking-wider px-3">{t('dashboard.tableProgram')}</th>
                                <th className="pb-3 font-bold text-gray-600 text-[11px] tracking-wider px-3">{t('dashboard.tableDegree')}</th>
                                <th className="pb-3 font-bold text-gray-600 text-[11px] tracking-wider px-3">{t('dashboard.tableAcadYear')}</th>
                                <th className="pb-3 font-bold text-gray-600 text-[11px] tracking-wider px-3">{t('dashboard.tableStage')}</th>
                                <th className="pb-3 font-bold text-gray-600 text-[11px] tracking-wider px-3">{t('dashboard.tableAppId')}</th>
                                <th className="pb-3 font-bold text-gray-600 text-[11px] tracking-wider px-3 text-center">{t('dashboard.tableActions')}</th>
                            </tr>
                        </thead>
                        <tbody className="text-xs font-medium text-[#0a0f1e]">
                            {applications.map((app, index) => (
                                <tr key={app.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                    <td className="py-3 px-3 text-gray-700 font-semibold">{index + 1}</td>
                                    <td className="py-3 px-3">
                                        {app.preferenceOrder ? (
                                            <span className="bg-orange-50 text-orange-600 text-[10px] font-black px-2 py-1 rounded-md tracking-wider">
                                                {app.preferenceOrder}. {t('dashboard.pref')}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </td>
                                    <td className="py-3 px-3 font-bold text-gray-900">{app.program?.name || t('dashboard.notAvailable')}</td>
                                    <td className="py-3 px-3">
                                        <span className="bg-blue-50 text-btuCyan text-[9px] font-black px-2 py-1 rounded-md tracking-wider uppercase">
                                            {app.degree?.name || t('dashboard.notAvailable')}
                                        </span>
                                    </td>
                                    <td className="py-3 px-3 text-gray-800 font-semibold">{app.academicYear?.name || t('dashboard.notAvailable')}</td>
                                    <td className="py-3 px-3">
                                        <StageBadge stage={app.stage} />
                                    </td>
                                    <td className="py-3 px-3 font-bold text-gray-700 tracking-wider text-[11px]">
                                        {t('dashboard.appPrefix')}{String(app.appNumber).padStart(4, '0')}
                                    </td>
                                    <td className="py-3 px-3 flex justify-center">
                                        <Button 
                                            size="sm" 
                                            className="bg-[#0a0f1e] hover:bg-btuCyan text-white h-7 px-3 rounded-md shadow-sm transition-colors gap-1.5 text-[10px] font-bold"
                                            onClick={() => window.location.href = `/dashboard/applications/${app.id}`}
                                        >
                                            <Eye className="w-3 h-3" />
                                            {t('dashboard.btnView')}
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

function StageBadge({ stage }: { stage: string }) {
    let styles = "";
    const s = stage?.toUpperCase() || "";
    if (s.includes("ACCEPTANCE")) {
        styles = "bg-blue-50 text-blue-600 border border-blue-100";
    } else if (s.includes("COMPLETE") || s.includes("ENROLLED")) {
        styles = "bg-emerald-50 text-emerald-600 border border-emerald-100";
    } else if (s.includes("REJECTED")) {
        styles = "bg-red-50 text-red-600 border border-red-100";
    } else {
        styles = "bg-gray-50 text-gray-600 border border-gray-200";
    }

    return (
        <span className={`text-[9px] font-black px-2 py-1 rounded-full tracking-wider uppercase shadow-sm ${styles}`}>
            {stage || 'PENDING'}
        </span>
    );
}

function InfoIcon(props: any) {
    return (
        <svg fill="currentColor" viewBox="0 0 20 20" {...props}>
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
    );
}

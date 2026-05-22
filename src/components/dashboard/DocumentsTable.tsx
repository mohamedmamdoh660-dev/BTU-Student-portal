"use client";

import React, { useState, useEffect } from "react";
import { Download, FolderOpen, Loader2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function DocumentsTable() {
    const { t } = useLanguage();
    const [documents, setDocuments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDocuments = async () => {
            const studentId = localStorage.getItem('studentId');
            if (!studentId) {
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from('Document')
                .select('*')
                .eq('studentId', studentId)
                .order('createdAt', { ascending: false });

            if (data && !error) {
                setDocuments(data);
            }
            setLoading(false);
        };

        fetchDocuments();
    }, []);

    const handleView = (url: string) => {
        if (url) window.open(url, "_blank");
    };

    const handleDownload = async (url: string, fileName: string) => {
        if (!url) return;
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = fileName || 'document';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error("Download failed, opening in new tab instead", error);
            window.open(url, "_blank");
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
            {/* Header */}
            <div className="bg-[#0a0f1e] px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-white">
                    <svg className="w-4 h-4 text-btuCyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <h2 className="text-sm font-bold tracking-widest uppercase">{t('dashboard.studentDocs')}</h2>
                </div>
            </div>

            {/* Hint Box */}
            <div className="bg-gray-50/50 p-3 border-b border-gray-100 flex justify-center">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500 bg-white px-3 py-1.5 rounded-full border border-gray-100 shadow-sm">
                    <InfoIcon className="w-3.5 h-3.5 text-btuCyan" />
                    {t('dashboard.docHint')}
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto p-4">
                {loading ? (
                    <div className="flex justify-center items-center py-10 text-btuCyan">
                        <Loader2 className="w-6 h-6 animate-spin" />
                    </div>
                ) : documents.length === 0 ? (
                    <div className="flex justify-center items-center py-10 text-gray-400 text-sm font-medium">
                        {t('dashboard.noDocs')}
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse mb-4">
                        <thead>
                            <tr className="border-b-2 border-gray-100">
                                <th className="pb-3 font-bold text-gray-400 text-[10px] tracking-wider px-3">#</th>
                                <th className="pb-3 font-bold text-gray-400 text-[10px] tracking-wider px-3">{t('dashboard.tableDocType')}</th>
                                <th className="pb-3 font-bold text-gray-400 text-[10px] tracking-wider px-3">{t('dashboard.tableFileName')}</th>
                                <th className="pb-3 font-bold text-gray-400 text-[10px] tracking-wider px-3 text-center">{t('dashboard.tableUploadDate')}</th>
                                <th className="pb-3 font-bold text-gray-400 text-[10px] tracking-wider px-3 text-center">{t('dashboard.tableActions')}</th>
                            </tr>
                        </thead>
                        <tbody className="text-xs font-medium text-[#0a0f1e]">
                            {documents.map((doc, index) => {
                                const dateObj = new Date(doc.createdAt);
                                const day = dateObj.toLocaleDateString('en-GB', { day: '2-digit' });
                                const month = dateObj.toLocaleDateString('en-GB', { month: 'short' });
                                const year = dateObj.toLocaleDateString('en-GB', { year: 'numeric' });

                                return (
                                    <tr key={doc.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                        <td className="py-3 px-3 text-gray-500">{index + 1}</td>
                                        <td className="py-3 px-3">
                                            <span className="text-btuCyan font-bold hover:underline cursor-pointer">
                                                {doc.fileType || t('dashboard.fallbackDoc')}
                                            </span>
                                        </td>
                                        <td className="py-3 px-3">
                                            <div className="flex items-center gap-1.5 text-gray-600 max-w-[200px] sm:max-w-[300px]">
                                                <svg className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                                                </svg>
                                                <span className="truncate">{doc.fileName}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-3">
                                            <div className="flex flex-col items-center justify-center text-[10px] text-gray-500 font-semibold gap-0.5">
                                                <CalendarIcon className="w-3 h-3 text-gray-400 mb-0.5" />
                                                <span>{day}-{month}</span>
                                                <span>{year}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-3 flex justify-center gap-2">
                                            <Button 
                                                size="sm" 
                                                className="bg-[#0a0f1e] hover:bg-btuCyan text-white h-7 px-3 rounded-md shadow-sm transition-colors gap-1.5 text-[10px] font-bold"
                                                onClick={() => handleView(doc.fileUrl)}
                                            >
                                                <Eye className="w-3 h-3" />
                                                {t('dashboard.btnView')}
                                            </Button>
                                            <Button 
                                                size="sm" 
                                                className="bg-emerald-500 hover:bg-emerald-600 text-white h-7 px-3 rounded-md shadow-sm transition-colors gap-1.5 text-[10px] font-bold"
                                                onClick={() => handleDownload(doc.fileUrl, doc.fileName)}
                                            >
                                                <Download className="w-3 h-3" />
                                                {t('dashboard.btnDownload')}
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}

                {/* Footer Document Management Button */}
                <div className="border-t border-gray-100 pt-6 pb-2 flex flex-col items-center justify-center text-center">
                    <div className="flex items-center gap-1.5 text-btuCyan font-bold text-xs mb-1">
                        <FolderOpen className="w-3.5 h-3.5" />
                        {t('dashboard.docManagement')}
                    </div>
                    <p className="text-gray-500 text-[11px] mb-3">{t('dashboard.docMngDesc')}</p>
                    <Button className="bg-[#0a0f1e] hover:bg-btuCyan text-white h-10 px-6 rounded-lg font-bold shadow-md transition-all flex items-center gap-2 text-xs">
                        <FolderOpen className="w-4 h-4" />
                        {t('dashboard.btnAllDocs')}
                    </Button>
                </div>
            </div>
        </div>
    );
}

function InfoIcon(props: any) {
    return (
        <svg fill="currentColor" viewBox="0 0 20 20" {...props}>
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
    );
}

function CalendarIcon(props: any) {
    return (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
    );
}

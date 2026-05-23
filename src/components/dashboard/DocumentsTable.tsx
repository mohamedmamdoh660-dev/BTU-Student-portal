"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Download, FolderOpen, Loader2, Eye, AlertCircle, FileText, Upload, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function DocumentsTable() {
    const { t } = useLanguage();
    const [documents, setDocuments] = useState<any[]>([]);
    const [missingApps, setMissingApps] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [missingDocsFiles, setMissingDocsFiles] = useState<Record<string, File>>({});
    const [selectedAppIds, setSelectedAppIds] = useState<string[]>([]);
    const [uploadingDocs, setUploadingDocs] = useState(false);
    const [showPropagationModal, setShowPropagationModal] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        const studentId = localStorage.getItem('studentId');
        if (!studentId) {
            setLoading(false);
            return;
        }

        // Fetch Documents
        const docsPromise = supabase
            .from('Document')
            .select('*')
            .eq('studentId', studentId)
            .order('createdAt', { ascending: false });

        // Fetch Applications to find missing docs
        const appsPromise = supabase
            .from('Application')
            .select('id, appNumber, stage, missingDocs')
            .eq('studentId', studentId);

        const [docsRes, appsRes] = await Promise.all([docsPromise, appsPromise]);

        if (docsRes.data && !docsRes.error) {
            setDocuments(docsRes.data);
        }

        if (appsRes.data && !appsRes.error) {
            const appsWaiting = appsRes.data.filter(app => 
                app.stage && app.stage.toUpperCase() === 'MISSING DOCUMENTS' && app.missingDocs && app.missingDocs.length > 0
            );
            setMissingApps(appsWaiting);
            setSelectedAppIds(appsWaiting.length === 1 ? [appsWaiting[0].id] : []);
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const uniqueMissingDocs = useMemo(() => {
        const docSet = new Set<string>();
        missingApps.forEach(app => {
            (app.missingDocs || []).forEach((doc: string) => docSet.add(doc));
        });
        return Array.from(docSet);
    }, [missingApps]);

    function getDocTypeAndName(missingDocName: string) {
        const lower = missingDocName.toLowerCase();
        if (lower.includes('passport')) return { fileType: 'passport', fileName: 'Passport' };
        if (lower.includes('transcript')) return { fileType: 'high_school_transcript', fileName: 'High School Transcript' };
        if (lower.includes('photo')) return { fileType: 'photo', fileName: 'Personal Photo' };
        return { fileType: 'other', fileName: missingDocName };
    }

    const handleInitialSubmit = () => {
        if (uniqueMissingDocs.length === 0) return;
        
        const allSelected = uniqueMissingDocs.every((docName: string) => missingDocsFiles[docName]);
        if (!allSelected) {
            alert("Please select all required documents before uploading.");
            return;
        }

        if (missingApps.length > 1) {
            setShowPropagationModal(true);
        } else {
            handleUploadMissingDocs();
        }
    };

    const handleUploadMissingDocs = async () => {
        if (uniqueMissingDocs.length === 0 || selectedAppIds.length === 0) return;
        
        // Ensure all are selected
        const allSelected = uniqueMissingDocs.every((docName: string) => missingDocsFiles[docName]);
        if (!allSelected) {
            alert("Please select all required documents before uploading.");
            return;
        }

        setUploadingDocs(true);
        try {
            const studentId = localStorage.getItem('studentId');
            if (!studentId) throw new Error("Student ID missing");

            for (const docName of uniqueMissingDocs) {
                const file = missingDocsFiles[docName];
                const { fileType, fileName } = getDocTypeAndName(docName);
                const ext = file.name.substring(file.name.lastIndexOf('.'));
                const finalFileName = `${fileName}${ext}`;
                const storagePath = `students/${studentId}/${Date.now()}_${Math.random().toString(36).substring(2, 8)}_${finalFileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

                // Upload to Supabase Storage
                const { error: uploadError } = await supabase.storage
                    .from('crm-uploads')
                    .upload(storagePath, file);

                if (uploadError) throw new Error(`Failed to upload ${docName}: ${uploadError.message}`);

                const { data: { publicUrl } } = supabase.storage.from('crm-uploads').getPublicUrl(storagePath);

                // Save to Document table
                const { error: docError } = await supabase.from('Document').insert({
                    id: crypto.randomUUID(),
                    studentId,
                    applicationId: selectedAppIds[0] || null, // Link to first selected application 
                    fileName: finalFileName,
                    fileType,
                    fileUrl: publicUrl,
                    fileSize: file.size,
                    metadata: { storagePath },
                    updatedAt: new Date().toISOString()
                });

                if (docError) throw new Error(`Failed to save document record for ${docName}`);
            }

            // Update Application Stages
            const { error: updateError } = await supabase.from('Application')
                .update({ stage: 'Missing Uploaded' })
                .in('id', selectedAppIds);

            if (updateError) throw new Error("Failed to update application status");

            alert(t('dashboard.submitDocs') + " - Success!");
            setMissingDocsFiles({});
            fetchData();
        } catch (err: any) {
            console.error("Upload error:", err);
            alert(err.message || "An error occurred during upload.");
        } finally {
            setUploadingDocs(false);
        }
    };

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

    const toggleAppSelection = (id: string) => {
        setSelectedAppIds(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
    };

    const toggleAllApps = () => {
        if (selectedAppIds.length === missingApps.length) {
            setSelectedAppIds([]);
        } else {
            setSelectedAppIds(missingApps.map(a => a.id));
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

            {/* Missing Documents Upload Section */}
            {!loading && missingApps.length > 0 && uniqueMissingDocs.length > 0 && (
                <div className="m-4 bg-white rounded-xl border-l-4 border-l-purple-500 border-y border-y-gray-200 border-r border-r-gray-200 shadow-sm overflow-hidden">
                    <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2 bg-purple-50/50">
                        <AlertCircle className="w-4 h-4 text-purple-600" />
                        <h2 className="text-xs font-bold text-purple-900 tracking-wide uppercase">{t('dashboard.missingDocsTitle') || 'Action Required: Missing Documents'}</h2>
                    </div>
                    

                    <div className="p-5 flex flex-col gap-4">
                        <p className="text-xs text-gray-600 font-medium">
                            {t('dashboard.missingDocsDesc') || 'Your application is on hold. Please upload the following required documents to proceed:'}
                        </p>

                        {/* Uploads */}
                        <div className="space-y-3">
                            {uniqueMissingDocs.map((docName: string) => (
                                <div key={docName} className="flex items-center justify-between p-2.5 bg-white border border-gray-200 rounded-lg shadow-sm hover:border-purple-300 transition-colors">
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-gray-400" />
                                        <span className="text-xs font-bold text-gray-800">{docName} <span className="text-red-500">*</span></span>
                                    </div>
                                    
                                    {missingDocsFiles[docName] ? (
                                        <div className="flex items-center gap-3">
                                            <div className="flex flex-col items-end">
                                                <span className="text-[11px] font-bold text-purple-700 truncate max-w-[120px]">{missingDocsFiles[docName].name}</span>
                                                <span className="text-[9px] text-gray-400 font-medium">{(missingDocsFiles[docName].size / 1024).toFixed(1)} KB</span>
                                            </div>
                                            <Button 
                                                size="sm" 
                                                variant="ghost" 
                                                onClick={() => {
                                                    const next = { ...missingDocsFiles };
                                                    delete next[docName];
                                                    setMissingDocsFiles(next);
                                                }} 
                                                className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full shrink-0"
                                            >
                                                <XCircle className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <label className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-md cursor-pointer transition-colors text-[11px] font-bold shrink-0">
                                            <Upload className="w-3.5 h-3.5" />
                                            {t('dashboard.clickToUpload') || 'Browse'}
                                            <input 
                                                type="file" 
                                                className="hidden" 
                                                accept=".pdf,.jpg,.jpeg,.png" 
                                                onChange={e => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        if (file.size > 2 * 1024 * 1024) {
                                                            alert(t('dashboard.maxSize') || "File size must be up to 2MB");
                                                            return;
                                                        }
                                                        setMissingDocsFiles(prev => ({ ...prev, [docName]: file }));
                                                    }
                                                }} 
                                            />
                                        </label>
                                    )}
                                </div>
                            ))}
                            
                            <div className="pt-2 flex justify-end">
                                <Button 
                                    onClick={handleInitialSubmit}
                                    disabled={uploadingDocs || !uniqueMissingDocs.every((doc: string) => missingDocsFiles[doc])}
                                    className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold h-8 px-4 rounded-md shadow-sm transition-all"
                                >
                                    {uploadingDocs ? (
                                        <><Loader2 className="w-3 h-3 mr-2 animate-spin" /> {t('dashboard.uploading') || 'Uploading...'}</>
                                    ) : (
                                        <>{t('dashboard.submitDocs') || 'Submit Missing Documents'}</>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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
                            <tr className="border-b-2 border-gray-200">
                                <th className="pb-3 font-bold text-gray-600 text-[11px] tracking-wider px-3">#</th>
                                <th className="pb-3 font-bold text-gray-600 text-[11px] tracking-wider px-3">{t('dashboard.tableDocType')}</th>
                                <th className="pb-3 font-bold text-gray-600 text-[11px] tracking-wider px-3">{t('dashboard.tableFileName')}</th>
                                <th className="pb-3 font-bold text-gray-600 text-[11px] tracking-wider px-3 text-center">{t('dashboard.tableUploadDate')}</th>
                                <th className="pb-3 font-bold text-gray-600 text-[11px] tracking-wider px-3 text-center">{t('dashboard.tableActions')}</th>
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
                                        <td className="py-3 px-3 text-gray-700 font-semibold">{index + 1}</td>
                                        <td className="py-3 px-3">
                                            <span className="text-btuCyan font-bold hover:underline cursor-pointer">
                                                {doc.fileType || t('dashboard.fallbackDoc')}
                                            </span>
                                        </td>
                                        <td className="py-3 px-3">
                                            <div className="flex items-center gap-1.5 text-gray-800 font-medium max-w-[200px] sm:max-w-[300px]">
                                                <svg className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                                                </svg>
                                                <span className="truncate">{doc.fileName}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-3">
                                            <div className="flex flex-col items-center justify-center text-[11px] text-gray-700 font-semibold gap-0.5">
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
            {/* Propagation Modal */}
            {showPropagationModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{t('dashboard.missingDocsApplyTo') || 'Apply to the following applications:'}</h3>
                        <p className="text-sm text-gray-500 mb-4">{t('dashboard.missingDocsModalDesc') || 'Select which applications should receive these documents.'}</p>
                        
                        <div className="space-y-3 mb-6">
                            <label className="flex items-center gap-2 cursor-pointer pb-2 border-b border-gray-100">
                                <input 
                                    type="checkbox" 
                                    checked={selectedAppIds.length === missingApps.length}
                                    onChange={toggleAllApps}
                                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 w-4 h-4" 
                                />
                                <span className="text-sm font-bold text-gray-700">{t('dashboard.selectAll') || 'Select All'}</span>
                            </label>
                            
                            {missingApps.map(app => (
                                <label key={app.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors">
                                    <input 
                                        type="checkbox" 
                                        checked={selectedAppIds.includes(app.id)}
                                        onChange={() => toggleAppSelection(app.id)}
                                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 w-4 h-4" 
                                    />
                                    <span className="text-sm font-bold text-gray-800">BTU-{String(app.appNumber).padStart(4, '0')}</span>
                                </label>
                            ))}
                        </div>
                        
                        <div className="flex justify-end gap-3">
                            <Button variant="outline" onClick={() => setShowPropagationModal(false)}>{t('dashboard.cancel') || 'Cancel'}</Button>
                            <Button 
                                onClick={() => {
                                    setShowPropagationModal(false);
                                    handleUploadMissingDocs();
                                }}
                                disabled={selectedAppIds.length === 0}
                                className="bg-purple-600 hover:bg-purple-700 text-white"
                            >
                                {t('dashboard.confirmUpload') || 'Confirm & Upload'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
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

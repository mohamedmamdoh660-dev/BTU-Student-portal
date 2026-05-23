"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, BookOpen, Clock, AlertCircle, FileText, Calendar, Building, Globe, MessageSquare, GraduationCap, CheckCircle2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function ApplicationDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [application, setApplication] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { t } = useLanguage();
    const [orientationReceipt, setOrientationReceipt] = useState<File | null>(null);
    const [tomerReceipt, setTomerReceipt] = useState<File | null>(null);
    const [receiptsUploaded, setReceiptsUploaded] = useState(false);
    const [uploadingReceipts, setUploadingReceipts] = useState(false);

    useEffect(() => {
        const fetchApplication = async () => {
            const studentId = localStorage.getItem('studentId');
            if (!studentId) {
                router.push('/');
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('Application')
                    .select(`
                        id,
                        appNumber,
                        stage,
                        status,
                        notes,
                        createdAt,
                        Program(name, Faculty(name), Language(name)),
                        Degree(name),
                        AcademicYear(name),
                        Semester(name),
                        preferenceOrder,
                        missingDocs
                    `)
                    .eq('id', params.id as string)
                    .eq('studentId', studentId)
                    .single();

                if (error || !data) {
                    throw new Error("Application not found or unauthorized access.");
                }

                // Check if receipts are already uploaded
                const { data: docs } = await supabase
                    .from('Document')
                    .select('fileType')
                    .eq('applicationId', params.id as string)
                    .in('fileType', ['Oryantasyon Ücreti', 'TOMER Fee']);
                
                if (docs && docs.length >= 2) {
                    setReceiptsUploaded(true);
                }

                setApplication(data);
            } catch (err: any) {
                console.error("Error fetching application details:", err);
                setError(err.message || "Failed to load application details.");
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchApplication();
        }
    }, [params.id, router]);

    if (loading) {
        return (
            <div className="flex-1 flex justify-center items-center h-screen bg-[#f3f4f6]">
                <Loader2 className="w-10 h-10 animate-spin text-btuCyan" />
            </div>
        );
    }

    if (error || !application) {
        return (
            <div className="flex-1 flex flex-col justify-center items-center h-[70vh] bg-[#f3f4f6] p-4 text-center">
                <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                <h2 className="text-2xl font-black text-[#0a0f1e] mb-2 tracking-tight">Access Denied</h2>
                <p className="text-gray-500 font-medium mb-6">{error || "Could not find the requested application."}</p>
                <Button 
                    onClick={() => router.push('/dashboard')}
                    className="bg-btuCyan hover:bg-[#088ba3] text-white font-bold h-12 px-8 rounded-xl shadow-lg transition-all"
                >
                    Return to Dashboard
                </Button>
            </div>
        );
    }

    const shortId = "BTU-" + String(application.appNumber).padStart(4, '0');
    const dateSubmitted = new Date(application.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });

    // Determine Stage Color Theme
    const stage = application.stage?.toUpperCase() || "PENDING";
    let stageColor = "bg-gray-100 text-gray-700 border-gray-200";
    let iconColor = "text-gray-500";
    
    if (stage.includes("ACCEPT") || stage.includes("COMPLETE")) {
        stageColor = "bg-emerald-50 border-emerald-200 text-emerald-800";
        iconColor = "text-emerald-500";
    } else if (stage.includes("REJECT")) {
        stageColor = "bg-red-50 border-red-200 text-red-800";
        iconColor = "text-red-500";
    } else if (stage.includes("REVIEW") || stage.includes("PENDING")) {
        stageColor = "bg-blue-50 border-blue-200 text-blue-800";
        iconColor = "text-blue-500";
    }

    const handleUploadReceipts = async () => {
        if (!orientationReceipt || !tomerReceipt) {
            alert("Please select both receipts before uploading.");
            return;
        }

        if (orientationReceipt.size > 2 * 1024 * 1024 || tomerReceipt.size > 2 * 1024 * 1024) {
            alert(t('dashboard.maxSize') || "File size must be up to 2MB");
            return;
        }

        setUploadingReceipts(true);
        try {
            const studentId = localStorage.getItem('studentId');
            if (!studentId) throw new Error("Student ID missing");

            const uploadFile = async (file: File, fileType: string) => {
                const ext = file.name.substring(file.name.lastIndexOf('.'));
                const finalFileName = `${fileType.replace(/[^a-zA-Z0-9]/g, '_')}${ext}`;
                const storagePath = `students/${studentId}/${Date.now()}_${Math.random().toString(36).substring(2, 8)}_${finalFileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('crm-uploads')
                    .upload(storagePath, file);

                if (uploadError) throw new Error(`Failed to upload ${fileType}: ${uploadError.message}`);
                const { data: { publicUrl } } = supabase.storage.from('crm-uploads').getPublicUrl(storagePath);

                const { error: docError } = await supabase.from('Document').insert({
                    id: crypto.randomUUID(),
                    studentId,
                    applicationId: application.id,
                    fileName: finalFileName,
                    fileType,
                    fileUrl: publicUrl,
                    fileSize: file.size,
                    metadata: { storagePath },
                    updatedAt: new Date().toISOString()
                });

                if (docError) throw new Error(`Failed to save document record for ${fileType}`);
            };

            await uploadFile(orientationReceipt, 'Oryantasyon Ücreti');
            await uploadFile(tomerReceipt, 'TOMER Fee');

            // Update Application Stage
            const { error: updateError } = await supabase.from('Application')
                .update({ stage: 'Client Pay' })
                .eq('id', application.id);

            if (updateError) throw new Error("Failed to update application status");

            alert(t('dashboard.uploadReceiptsBtn') + " - Success!");
            setReceiptsUploaded(true);
            setApplication({ ...application, stage: 'Client Pay' });
        } catch (err: any) {
            console.error("Upload error:", err);
            alert(err.message || "An error occurred during upload.");
        } finally {
            setUploadingReceipts(false);
        }
    };

    return (
        <div className="w-full flex flex-col gap-6 max-w-5xl mx-auto pb-12">
            
            {/* Top Navigation */}
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h1 className="text-2xl font-black text-[#0a0f1e] tracking-tight">Application Details</h1>
                    <p className="text-gray-500 text-sm mt-1 font-medium">Ref: <span className="text-btuCyan font-bold">{shortId}</span></p>
                </div>
                <div className="flex items-center gap-3">
                    {stage === "PENDING REVIEW" && (
                        <Button 
                            onClick={() => router.push(`/dashboard/applications/${application.id}/edit`)}
                            className="bg-btuCyan hover:bg-[#088ba3] text-white font-bold h-9 px-4 rounded-lg shadow-sm text-xs"
                        >
                            Edit Application
                        </Button>
                    )}
                    <Button 
                        onClick={() => router.push('/dashboard')}
                        variant="outline" 
                        className="border-gray-200 text-gray-600 hover:bg-gray-50 bg-white font-bold h-9 px-4 rounded-lg shadow-sm text-xs"
                    >
                        <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
                        Back to Dashboard
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Left Column: Details */}
                <div className="md:col-span-2 flex flex-col gap-6">

                    {/* Program Information */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="bg-[#0a0f1e] px-6 py-4 flex items-center gap-2 text-white">
                            <BookOpen className="w-4 h-4 text-btuCyan" />
                            <h2 className="text-sm font-bold tracking-widest uppercase">Academic Program</h2>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                                <DetailItem label="Program Name" value={application.Program?.name || 'N/A'} />
                                <DetailItem label="Degree Level" value={application.Degree?.name || 'N/A'} />
                                <DetailItem label="Language" value={application.Program?.Language?.name || 'N/A'} />
                                <DetailItem label="Faculty" value={application.Program?.Faculty?.name || 'N/A'} />
                                <DetailItem label="Academic Year" value={application.AcademicYear?.name || 'N/A'} />
                                <DetailItem label="Preference Order" value={application.preferenceOrder ? `${application.preferenceOrder}${application.preferenceOrder === 1 ? 'st' : application.preferenceOrder === 2 ? 'nd' : 'rd'} Preference` : 'N/A'} />
                            </div>
                        </div>
                    </div>
                    {/* Conditional Acceptance Payment Uploads */}
                    {stage === "CONDITIONAL ACCEPTANCE" && !receiptsUploaded && (
                        <div className="bg-white rounded-2xl shadow-sm border border-orange-200 overflow-hidden">
                            <div className="bg-orange-50 px-6 py-4 flex items-center gap-2 border-b border-orange-100">
                                <AlertCircle className="w-5 h-5 text-orange-600" />
                                <div>
                                    <h2 className="text-sm font-bold text-orange-900 tracking-wide uppercase">{t('dashboard.conditionalUploadTitle') || 'Upload Payment Receipts'}</h2>
                                    <p className="text-xs text-orange-700 font-medium mt-1">{t('dashboard.conditionalUploadDesc') || 'Upload both Oryantasyon Ücreti and TOMER Fee receipts to proceed.'}</p>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                        <h3 className="text-xs font-bold text-gray-700 mb-3">{t('dashboard.orientationFee') || 'Oryantasyon Ücreti'}</h3>
                                        {orientationReceipt ? (
                                            <div className="flex items-center justify-between bg-purple-50 text-purple-700 px-3 py-2 rounded-lg border border-purple-100">
                                                <span className="text-xs font-medium truncate flex-1 pr-2">{orientationReceipt.name}</span>
                                                <button onClick={() => setOrientationReceipt(null)} className="text-purple-400 hover:text-purple-600 p-1">
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                                </button>
                                            </div>
                                        ) : (
                                            <label className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-white text-gray-600 hover:bg-gray-50 hover:text-btuCyan border-2 border-dashed border-gray-200 hover:border-btuCyan rounded-xl cursor-pointer transition-colors">
                                                <Upload className="w-4 h-4" />
                                                <span className="text-xs font-bold">{t('dashboard.clickToUpload') || 'Click to browse'}</span>
                                                <input 
                                                    type="file" 
                                                    className="hidden" 
                                                    accept=".pdf,.jpg,.jpeg,.png" 
                                                    onChange={e => e.target.files?.[0] && setOrientationReceipt(e.target.files[0])} 
                                                />
                                            </label>
                                        )}
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                        <h3 className="text-xs font-bold text-gray-700 mb-3">{t('dashboard.tomerFee') || 'TOMER Fee'}</h3>
                                        {tomerReceipt ? (
                                            <div className="flex items-center justify-between bg-purple-50 text-purple-700 px-3 py-2 rounded-lg border border-purple-100">
                                                <span className="text-xs font-medium truncate flex-1 pr-2">{tomerReceipt.name}</span>
                                                <button onClick={() => setTomerReceipt(null)} className="text-purple-400 hover:text-purple-600 p-1">
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                                </button>
                                            </div>
                                        ) : (
                                            <label className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-white text-gray-600 hover:bg-gray-50 hover:text-btuCyan border-2 border-dashed border-gray-200 hover:border-btuCyan rounded-xl cursor-pointer transition-colors">
                                                <Upload className="w-4 h-4" />
                                                <span className="text-xs font-bold">{t('dashboard.clickToUpload') || 'Click to browse'}</span>
                                                <input 
                                                    type="file" 
                                                    className="hidden" 
                                                    accept=".pdf,.jpg,.jpeg,.png" 
                                                    onChange={e => e.target.files?.[0] && setTomerReceipt(e.target.files[0])} 
                                                />
                                            </label>
                                        )}
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <Button 
                                        onClick={handleUploadReceipts}
                                        disabled={uploadingReceipts || !orientationReceipt || !tomerReceipt}
                                        className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 py-2 h-auto rounded-lg shadow-sm transition-colors"
                                    >
                                        {uploadingReceipts ? (
                                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {t('dashboard.uploading') || 'Uploading...'}</>
                                        ) : (
                                            <>{t('dashboard.uploadReceiptsBtn') || 'Submit Receipts'}</>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Status & Notes */}
                <div className="flex flex-col gap-6">
                    {/* Status Box */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="bg-[#0a0f1e] px-6 py-4 flex items-center gap-2 text-white">
                            <Clock className="w-4 h-4 text-btuCyan" />
                            <h2 className="text-sm font-bold tracking-widest uppercase">Current Status</h2>
                        </div>
                        <div className="p-6 flex flex-col gap-4">
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Application Stage</p>
                                <span className={`text-xs font-black px-3 py-1.5 rounded-md uppercase tracking-wider inline-block border ${stageColor}`}>
                                    {application.stage || 'Pending Review'}
                                </span>
                            </div>
                            <div className="pt-4 border-t border-gray-100">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Date Submitted</p>
                                <p className="text-sm font-bold text-[#0a0f1e]">{dateSubmitted}</p>
                            </div>
                        </div>
                    </div>

                    {/* Admin Notes */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex-1">
                        <div className="bg-btuCyan/10 px-6 py-4 flex items-center gap-2 border-b border-btuCyan/20 text-[#0a0f1e]">
                            <MessageSquare className="w-4 h-4 text-btuCyan" />
                            <h2 className="text-sm font-bold tracking-widest uppercase">Admin Notes</h2>
                        </div>
                        <div className="p-6">
                            {application.notes ? (
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-sm text-gray-700 leading-relaxed font-medium">
                                    {application.notes}
                                </div>
                            ) : (
                                <div className="text-center text-gray-400 py-6">
                                    <p className="text-xs font-medium">No feedback or notes from the administration.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

function DetailItem({ label, value }: { label: string, value: string }) {
    return (
        <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
            <p className="text-sm font-bold text-[#0a0f1e] leading-snug">{value}</p>
        </div>
    );
}

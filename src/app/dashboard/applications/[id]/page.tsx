"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, BookOpen, Clock, AlertCircle, FileText, Calendar, Building, Globe, MessageSquare, GraduationCap, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

export default function ApplicationDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [application, setApplication] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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
                        preferenceOrder
                    `)
                    .eq('id', params.id as string)
                    .eq('studentId', studentId)
                    .single();

                if (error || !data) {
                    throw new Error("Application not found or unauthorized access.");
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
                                <DetailItem label="Intake / Semester" value={application.Semester?.name || 'N/A'} />
                                <DetailItem label="Preference Order" value={application.preferenceOrder ? `${application.preferenceOrder}${application.preferenceOrder === 1 ? 'st' : application.preferenceOrder === 2 ? 'nd' : 'rd'} Preference` : 'N/A'} />
                            </div>
                        </div>
                    </div>
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

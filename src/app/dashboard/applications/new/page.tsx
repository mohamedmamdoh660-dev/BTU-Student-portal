"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, BookOpen, Building, GraduationCap, Calendar, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

export default function AddApplicationPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    // Form Data Options
    const [academicYears, setAcademicYears] = useState<any[]>([]);
    const [semesters, setSemesters] = useState<any[]>([]);
    const [degrees, setDegrees] = useState<any[]>([]);
    const [programs, setPrograms] = useState<any[]>([]);
    const [studentData, setStudentData] = useState<any>(null);

    // Selected Values
    const [selectedYear, setSelectedYear] = useState("");
    const [selectedSemester, setSelectedSemester] = useState("");
    const [selectedDegree, setSelectedDegree] = useState("");
    const [selectedProgram, setSelectedProgram] = useState("");

    useEffect(() => {
        const fetchInitialData = async () => {
            const studentId = localStorage.getItem('studentId');
            if (!studentId) {
                router.push('/');
                return;
            }

            try {
                // 1. Fetch Student & Application Count Check
                const { data: student, error: studentError } = await supabase
                    .from('Student')
                    .select('id, fullName')
                    .eq('id', studentId)
                    .single();

                if (studentError) throw studentError;
                setStudentData(student);

                const { count, error: countError } = await supabase
                    .from('Application')
                    .select('*', { count: 'exact', head: true })
                    .eq('studentId', studentId);

                if (countError) throw countError;
                if (count && count >= 3) {
                    setError("You have reached the maximum limit of 3 applications. You cannot add more.");
                    setLoading(false);
                    return;
                }

                // 2. Fetch Options
                const [yearsRes, semestersRes, degreesRes] = await Promise.all([
                    supabase.from('AcademicYear').select('id, name, isDefault').eq('isActive', true).order('name', { ascending: false }),
                    supabase.from('Semester').select('id, name, isDefault').eq('isActive', true),
                    supabase.from('Degree').select('id, name').eq('isActive', true).order('displayOrder', { ascending: true })
                ]);

                if (yearsRes.data) {
                    setAcademicYears(yearsRes.data);
                    const defaultYear = yearsRes.data.find(y => y.isDefault);
                    if (defaultYear) setSelectedYear(defaultYear.id);
                }
                
                if (semestersRes.data) {
                    setSemesters(semestersRes.data);
                    const defaultSem = semestersRes.data.find(s => s.isDefault);
                    if (defaultSem) setSelectedSemester(defaultSem.id);
                }
                
                if (degreesRes.data) setDegrees(degreesRes.data);

            } catch (err: any) {
                console.error("Error fetching data:", err);
                setError("Failed to load application options. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, [router]);

    // Fetch Programs when Degree changes
    useEffect(() => {
        if (!selectedDegree) {
            setPrograms([]);
            setSelectedProgram("");
            return;
        }

        const fetchPrograms = async () => {
            const { data, error } = await supabase
                .from('Program')
                .select('id, name, Faculty(name), Language(name)')
                .eq('degreeId', selectedDegree)
                .eq('isActive', true)
                .order('name');
            
            if (data && !error) {
                setPrograms(data);
                setSelectedProgram("");
            }
        };

        fetchPrograms();
    }, [selectedDegree]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedYear || !selectedSemester || !selectedDegree || !selectedProgram) {
            setError("Please fill out all fields before submitting.");
            return;
        }

        setSubmitting(true);
        setError("");

        try {
            // Check for duplicates
            const { data: existingApps, error: existingError } = await supabase
                .from('Application')
                .select('id')
                .eq('studentId', studentData.id)
                .eq('programId', selectedProgram)
                .eq('academicYearId', selectedYear)
                .limit(1);

            if (existingApps && existingApps.length > 0) {
                setError("You have already applied for this exact program in this academic year.");
                setSubmitting(false);
                return;
            }

            // Generate a random ID since Prisma @default(cuid()) doesn't run in Supabase REST API
            const newId = 'c' + Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);

            // Insert new Application
            const { error: insertError } = await supabase
                .from('Application')
                .insert({
                    id: newId,
                    studentId: studentData.id,
                    programId: selectedProgram,
                    academicYearId: selectedYear,
                    semesterId: selectedSemester,
                    degreeId: selectedDegree,
                    stage: "Pending Review",
                    status: "New",
                    updatedAt: new Date().toISOString()
                });

            if (insertError) throw insertError;

            setSuccess(true);
            setTimeout(() => {
                router.push('/dashboard');
            }, 2000);

        } catch (err: any) {
            console.error("Submit error:", err);
            setError("An error occurred while submitting your application. Please try again.");
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex-1 flex justify-center items-center h-screen bg-[#f3f4f6]">
                <Loader2 className="w-10 h-10 animate-spin text-btuCyan" />
            </div>
        );
    }

    if (success) {
        return (
            <div className="flex-1 flex justify-center items-center h-screen bg-[#f3f4f6] p-4">
                <div className="bg-white p-10 rounded-3xl shadow-xl max-w-md w-full text-center border border-gray-100">
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-black text-[#0a0f1e] mb-2 tracking-tight">Application Submitted!</h2>
                    <p className="text-gray-500 font-medium mb-8">Your application has been successfully created and is now pending review.</p>
                    <Loader2 className="w-6 h-6 animate-spin text-btuCyan mx-auto" />
                    <p className="text-sm text-gray-400 mt-4">Redirecting to dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Area */}
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h1 className="text-3xl font-black text-[#0a0f1e] tracking-tight">New Application</h1>
                    <p className="text-gray-500 mt-1 font-medium">Select your desired academic program.</p>
                </div>
                <Button 
                    onClick={() => router.push('/dashboard')}
                    variant="outline" 
                    className="border-gray-200 text-gray-600 hover:bg-gray-50 bg-white font-bold h-10 px-4 rounded-xl shadow-sm"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </Button>
            </div>

            {/* Error Message full width */}
            {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-2xl flex items-center gap-3 font-semibold text-sm shadow-sm">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p>{error}</p>
                </div>
            )}

            {/* Form Card */}
            <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden max-w-3xl">
                <div className="bg-[#0a0f1e] px-8 py-5">
                    <div className="flex items-center gap-3 text-white">
                        <BookOpen className="w-5 h-5 text-btuCyan" />
                        <h2 className="text-sm font-bold tracking-widest uppercase">Program Selection</h2>
                    </div>
                </div>

                <div className="p-8">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                        
                        {/* Row 1: Academic Year & Semester */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 tracking-wider uppercase flex items-center gap-2">
                                    <Calendar className="w-3.5 h-3.5 text-btuCyan" />
                                    Academic Year
                                </label>
                                <select 
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(e.target.value)}
                                    className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 text-sm font-semibold text-[#0a0f1e] focus:ring-2 focus:ring-btuCyan/20 focus:border-btuCyan outline-none transition-all disabled:opacity-50"
                                    disabled={error.includes("maximum limit")}
                                >
                                    <option value="" disabled>Select Year</option>
                                    {academicYears.map(y => (
                                        <option key={y.id} value={y.id}>{y.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 tracking-wider uppercase flex items-center gap-2">
                                    <Calendar className="w-3.5 h-3.5 text-btuCyan" />
                                    Intake / Semester
                                </label>
                                <select 
                                    value={selectedSemester}
                                    onChange={(e) => setSelectedSemester(e.target.value)}
                                    className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 text-sm font-semibold text-[#0a0f1e] focus:ring-2 focus:ring-btuCyan/20 focus:border-btuCyan outline-none transition-all disabled:opacity-50"
                                    disabled={error.includes("maximum limit")}
                                >
                                    <option value="" disabled>Select Semester</option>
                                    {semesters.map(s => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Row 2: Degree */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 tracking-wider uppercase flex items-center gap-2">
                                <GraduationCap className="w-3.5 h-3.5 text-btuCyan" />
                                Degree Level
                            </label>
                            <select 
                                value={selectedDegree}
                                onChange={(e) => setSelectedDegree(e.target.value)}
                                className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 text-sm font-semibold text-[#0a0f1e] focus:ring-2 focus:ring-btuCyan/20 focus:border-btuCyan outline-none transition-all disabled:opacity-50"
                                disabled={error.includes("maximum limit")}
                            >
                                <option value="" disabled>Select Degree</option>
                                {degrees.map(d => (
                                    <option key={d.id} value={d.id}>{d.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Row 3: Program */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 tracking-wider uppercase flex items-center gap-2">
                                <Building className="w-3.5 h-3.5 text-btuCyan" />
                                Program / Specialty
                            </label>
                            <select 
                                value={selectedProgram}
                                onChange={(e) => setSelectedProgram(e.target.value)}
                                className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 text-sm font-semibold text-[#0a0f1e] focus:ring-2 focus:ring-btuCyan/20 focus:border-btuCyan outline-none transition-all disabled:opacity-50"
                                disabled={!selectedDegree || error.includes("maximum limit")}
                            >
                                <option value="" disabled>
                                    {!selectedDegree ? "Select a degree first" : programs.length === 0 ? "No programs available for this degree" : "Select Program"}
                                </option>
                                {programs.map(p => (
                                    <option key={p.id} value={p.id}>
                                        {p.name} {p.Language?.name ? `(${p.Language.name})` : ''} 
                                    </option>
                                ))}
                            </select>
                            {selectedDegree && programs.length === 0 && (
                                <p className="text-xs text-orange-500 mt-2 font-medium">No active programs found for this degree level.</p>
                            )}
                        </div>

                        {/* Submit Action */}
                        <div className="pt-4 border-t border-gray-100 flex justify-end">
                            <Button 
                                type="submit" 
                                disabled={submitting || error.includes("maximum limit")}
                                className="bg-btuCyan hover:bg-[#088ba3] text-white h-12 px-8 rounded-xl font-bold shadow-lg shadow-btuCyan/20 transition-all min-w-[200px]"
                            >
                                {submitting ? (
                                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</>
                                ) : (
                                    "Submit Application"
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

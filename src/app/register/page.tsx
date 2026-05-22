"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { 
    User, IdCard, Phone, GraduationCap, Building, FileText,
    ChevronRight, ChevronLeft, Loader2, CheckCircle2, AlertCircle, ArrowLeft, Upload
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

// The full Student Form State
interface RegisterFormState {
    haveTc: "yes" | "no";
    blueCard: "yes" | "no";
    tcNumber: string;
    firstName: string;
    lastName: string;
    gender: string;
    dateOfBirth: string;
    nationality: string;
    passportNumber: string;
    passportIssueDate: string;
    passportExpiryDate: string;
    email: string;
    mobile: string;
    addressLine1: string;
    cityDistrict: string;
    stateProvince: string;
    postalCode: string;
    addressCountry: string;
    fatherName: string;
    fatherMobile: string;
    fatherOccupation: string;
    motherName: string;
    motherMobile: string;
    motherOccupation: string;
    educationLevelId: string;
    hasTomer: string;
    highSchoolName: string;
    highSchoolCountry: string;
    highSchoolType: string;
    yosDegree: string;
    satDegree: string;
    diplomaDegree: string;
    highSchoolGpa: string;
    bachelorSchoolName: string;
    bachelorCountry: string;
    bachelorGpa: string;
    masterSchoolName: string;
    masterCountry: string;
    masterGpa: string;
}

const initialFormState: RegisterFormState = {
    haveTc: "no",
    blueCard: "no",
    tcNumber: "",
    firstName: "",
    lastName: "",
    gender: "",
    dateOfBirth: "",
    nationality: "",
    passportNumber: "",
    passportIssueDate: "",
    passportExpiryDate: "",
    email: "",
    mobile: "",
    addressLine1: "",
    cityDistrict: "",
    stateProvince: "",
    postalCode: "",
    addressCountry: "",
    fatherName: "",
    fatherMobile: "",
    fatherOccupation: "",
    motherName: "",
    motherMobile: "",
    motherOccupation: "",
    educationLevelId: "high_school",
    hasTomer: "Hayır",
    highSchoolName: "",
    highSchoolCountry: "",
    highSchoolType: "Diploma",
    yosDegree: "",
    satDegree: "",
    diplomaDegree: "",
    highSchoolGpa: "",
    bachelorSchoolName: "",
    bachelorCountry: "",
    bachelorGpa: "",
    masterSchoolName: "",
    masterCountry: "",
    masterGpa: ""
};

export default function RegisterPage() {
    const { t } = useLanguage();
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<RegisterFormState>(initialFormState);
    const [countries, setCountries] = useState<any[]>([]);
    const [nationalities, setNationalities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    // Default country for phone
    const [defaultPhoneCountry, setDefaultPhoneCountry] = useState("tr");

    // Realtime error states
    const [emailError, setEmailError] = useState("");
    const [passportError, setPassportError] = useState("");

    // Documents
    const [documents, setDocuments] = useState<any[]>([]);

    useEffect(() => {
        const fetchCountriesAndIP = async () => {
            try {
                // Fetch IP for Phone Input
                const res = await fetch('https://ipapi.co/json/');
                const data = await res.json();
                if (data && data.country_code) {
                    setDefaultPhoneCountry(data.country_code.toLowerCase());
                }
            } catch (e) {
                console.log("Could not detect IP country");
            }

            const { data, error } = await supabase
                .from('Country')
                .select('id, name, activeOnNationalities')
                .eq('isActive', true)
                .order('name');
            if (data && !error) {
                setCountries(data);
                setNationalities(data.filter(c => c.activeOnNationalities));
            }
            setLoading(false);
        };
        fetchCountriesAndIP();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleRadio = (name: keyof RegisterFormState, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePhoneChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Realtime Checks
    const checkEmail = async () => {
        if (!formData.email) return;
        const { data } = await supabase.from('Student').select('id').eq('email', formData.email.trim().toLowerCase()).limit(1);
        if (data && data.length > 0) setEmailError("This email is already registered.");
        else setEmailError("");
    };

    const checkPassport = async () => {
        if (!formData.passportNumber) return;
        const { data } = await supabase.from('Student').select('id').eq('passportNumber', formData.passportNumber.trim()).limit(1);
        if (data && data.length > 0) setPassportError("This Passport Number is already registered.");
        else setPassportError("");
    };

    const validateStep1 = () => {
        if (!formData.firstName || !formData.lastName || !formData.gender || !formData.dateOfBirth || !formData.nationality || !formData.passportNumber) {
            setError("Please fill all required personal fields.");
            return false;
        }
        if (formData.haveTc === "yes" && !formData.tcNumber) {
            setError("T.C. Number is required if you have Turkish T.C.");
            return false;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (formData.passportIssueDate) {
            const issueDate = new Date(formData.passportIssueDate);
            if (issueDate >= today) {
                setError("Passport Issue Date cannot be today or in the future.");
                return false;
            }
        }
        if (formData.passportExpiryDate) {
            const expiryDate = new Date(formData.passportExpiryDate);
            if (expiryDate <= today) {
                setError("Passport Expiry Date must be in the future.");
                return false;
            }
        }
        if (emailError || passportError) {
            setError("Please fix errors before proceeding.");
            return false;
        }

        setError("");
        return true;
    };

    const validateStep2 = () => {
        if (!formData.email || !formData.mobile) {
            setError("Email and Mobile are required.");
            return false;
        }
        if (formData.mobile.length < 8) {
            setError("Please enter a valid mobile number.");
            return false;
        }
        if (!formData.fatherName || !formData.motherName) {
            setError("Father's Name and Mother's Name are required.");
            return false;
        }
        if (emailError) {
            setError("Please fix email error before proceeding.");
            return false;
        }
        setError("");
        return true;
    };

    const validateStep3 = () => {
        if (!formData.educationLevelId) {
            setError("Please select an education level.");
            return false;
        }
        if (!formData.highSchoolCountry || !formData.highSchoolName || !formData.highSchoolGpa) {
            setError("High School Details are required.");
            return false;
        }
        if (formData.highSchoolType === "TR-YÖS" && !formData.yosDegree) {
            setError("TR-YÖS Degree is required.");
            return false;
        }
        if (formData.highSchoolType === "SAT" && !formData.satDegree) {
            setError("SAT Degree is required.");
            return false;
        }
        if (formData.highSchoolType === "Diploma" && !formData.diplomaDegree) {
            setError("Diploma Degree is required.");
            return false;
        }
        setError("");
        return true;
    };

    const handleNext = () => {
        if (currentStep === 1 && !validateStep1()) return;
        if (currentStep === 2 && !validateStep2()) return;
        if (currentStep === 3 && !validateStep3()) return;
        setCurrentStep(prev => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleBack = () => {
        setError("");
        setCurrentStep(prev => prev - 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Documents Logic
    const handleFileSelect = (file: File, documentType: string) => {
        const previewUrl = URL.createObjectURL(file);
        setDocuments(prev => {
            const existing = prev.filter(d => d.type !== documentType);
            return [...existing, { type: documentType, file, previewUrl }];
        });
    };

    const handleFileRemove = (documentType: string) => {
        setDocuments(prev => prev.filter(d => d.type !== documentType));
    };

    const getDocumentRequiredList = () => {
        const requiredDocs = ['personal_photo', 'passport_copy'];
        if (formData.highSchoolType === 'TR-YÖS') requiredDocs.push('yos_certificate');
        if (formData.highSchoolType === 'SAT') requiredDocs.push('sat_certificate');
        if (formData.hasTomer && formData.hasTomer !== 'Hayır') requiredDocs.push('tomer_certificate');
        return requiredDocs;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Validate final step documents
        const requiredDocs = getDocumentRequiredList();
        const missingRequired = requiredDocs.filter(req => !documents.some(d => d.type === req));
        if (missingRequired.length > 0) {
            setError(t('register.docUploadError'));
            return;
        }

        setSubmitting(true);

        try {
            // Re-check just in case
            const { data: existingUser } = await supabase
                .from('Student')
                .select('id')
                .or(`email.eq.${formData.email.trim()},passportNumber.eq.${formData.passportNumber.trim()}`)
                .limit(1);

            if (existingUser && existingUser.length > 0) {
                throw new Error("A student with this Email or Passport Number already exists.");
            }

            // Generate ID
            const newId = 'c' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);

            // Upload Documents
            const uploadedUrls: any[] = [];
            for (const doc of documents) {
                const fileExt = doc.file.name.split('.').pop();
                const fileName = `students/${newId}/${doc.type}-${Date.now()}.${fileExt}`;
                
                const { error: uploadError, data } = await supabase.storage
                    .from('crm-uploads')
                    .upload(fileName, doc.file);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('crm-uploads')
                    .getPublicUrl(fileName);

                uploadedUrls.push({
                    documentType: doc.type,
                    fileName: doc.file.name,
                    fileUrl: publicUrl,
                    fileSize: doc.file.size,
                });
            }

            // Insert Student
            const { error: insertError } = await supabase
                .from('Student')
                .insert({
                    id: newId,
                    haveTc: formData.haveTc === "yes",
                    tcNumber: formData.haveTc === "yes" ? formData.tcNumber : null,
                    blueCard: formData.blueCard === "yes",
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    fullName: `${formData.firstName} ${formData.lastName}`,
                    gender: formData.gender,
                    dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString() : null,
                    nationality: formData.nationality,
                    passportNumber: formData.passportNumber,
                    passportIssueDate: formData.passportIssueDate ? new Date(formData.passportIssueDate).toISOString() : null,
                    passportExpiryDate: formData.passportExpiryDate ? new Date(formData.passportExpiryDate).toISOString() : null,
                    email: formData.email.trim().toLowerCase(),
                    mobile: formData.mobile,
                    phone: formData.mobile,
                    addressLine1: formData.addressLine1,
                    cityDistrict: formData.cityDistrict,
                    stateProvince: formData.stateProvince,
                    postalCode: formData.postalCode,
                    addressCountry: formData.addressCountry,
                    fatherName: formData.fatherName,
                    fatherMobile: formData.fatherMobile,
                    fatherOccupation: formData.fatherOccupation,
                    motherName: formData.motherName,
                    motherMobile: formData.motherMobile,
                    motherOccupation: formData.motherOccupation,
                    educationLevelId: formData.educationLevelId,
                    hasTomer: formData.hasTomer,
                    highSchoolName: formData.highSchoolName,
                    highSchoolCountry: formData.highSchoolCountry,
                    highSchoolType: formData.highSchoolType,
                    yosDegree: formData.yosDegree,
                    satDegree: formData.satDegree,
                    diplomaDegree: formData.diplomaDegree,
                    highSchoolGpa: formData.highSchoolGpa ? parseFloat(formData.highSchoolGpa) : null,
                    bachelorSchoolName: formData.bachelorSchoolName,
                    bachelorCountry: formData.bachelorCountry,
                    bachelorGpa: formData.bachelorGpa ? parseFloat(formData.bachelorGpa) : null,
                    masterSchoolName: formData.masterSchoolName,
                    masterCountry: formData.masterCountry,
                    masterGpa: formData.masterGpa ? parseFloat(formData.masterGpa) : null,
                    documents: uploadedUrls, // Save document JSON array
                    status: "Applicant",
                    isActive: true,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                });

            if (insertError) throw insertError;

            // 🎯 Insert into the Document table to ensure they show up in CRM relations
            if (uploadedUrls.length > 0) {
                const documentRecords = uploadedUrls.map(doc => ({
                    id: 'c' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36),
                    studentId: newId,
                    fileName: doc.fileName,
                    fileType: doc.documentType,
                    fileUrl: doc.fileUrl,
                    fileSize: doc.fileSize,
                    metadata: { uploadedDuring: 'student_portal_registration' },
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }));
                
                const { error: docInsertError } = await supabase
                    .from('Document')
                    .insert(documentRecords);
                    
                if (docInsertError) {
                    console.error("Failed to insert documents relation:", docInsertError);
                }
            }

            // Auto-login
            localStorage.setItem('studentId', newId);
            localStorage.setItem('studentName', `${formData.firstName} ${formData.lastName}`);

            setSuccess(true);
            setTimeout(() => {
                router.push('/dashboard');
            }, 2000);

        } catch (err: any) {
            console.error("Submit error:", err);
            setError(err.message || "An error occurred during registration.");
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="h-screen w-full flex justify-center items-center bg-[#0f172a]">
                <Loader2 className="w-10 h-10 animate-spin text-btuCyan" />
            </div>
        );
    }

    if (success) {
        return (
            <div className="flex-1 flex justify-center items-center h-screen bg-[#0f172a] p-4">
                <div className="bg-white/10 backdrop-blur-xl p-10 rounded-3xl shadow-xl max-w-md w-full text-center border border-white/10">
                    <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                        <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-black text-white mb-2 tracking-tight">Account Created!</h2>
                    <p className="text-white/60 font-medium mb-8">Welcome to the Candidate Portal. Loading your dashboard...</p>
                    <Loader2 className="w-6 h-6 animate-spin text-btuCyan mx-auto" />
                </div>
            </div>
        );
    }

    const StepIndicator = () => (
        <div className="flex items-center justify-between max-w-3xl mx-auto mb-12 relative">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-white/10 -translate-y-1/2 rounded-full z-0"></div>
            <div 
                className="absolute top-1/2 left-0 h-1 bg-btuCyan -translate-y-1/2 rounded-full z-0 transition-all duration-500 shadow-[0_0_10px_#00acc9]"
                style={{ width: currentStep === 1 ? '0%' : currentStep === 2 ? '33.3%' : currentStep === 3 ? '66.6%' : '100%' }}
            ></div>

            {[
                { step: 1, label: "Identity", icon: IdCard },
                { step: 2, label: "Contact", icon: Phone },
                { step: 3, label: "Education", icon: GraduationCap },
                { step: 4, label: "Documents", icon: Upload }
            ].map((s) => {
                const Icon = s.icon;
                const isActive = currentStep >= s.step;
                const isCurrent = currentStep === s.step;
                
                return (
                    <div key={s.step} className="relative z-10 flex flex-col items-center gap-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border-2 
                            ${isActive 
                                ? 'bg-[#0f172a] border-btuCyan text-btuCyan shadow-[0_0_20px_rgba(0,172,201,0.4)]' 
                                : 'bg-[#0f172a] border-white/20 text-white/40'}`}
                        >
                            <Icon className="w-5 h-5" />
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${isCurrent ? 'text-white' : 'text-white/40'}`}>
                            {s.label}
                        </span>
                    </div>
                )
            })}
        </div>
    );

    return (
        <div className="min-h-screen w-full bg-[#0f172a] font-sans selection:bg-btuCyan selection:text-white py-12 px-4 sm:px-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-btuCyan/10 rounded-full blur-[100px] pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none translate-x-1/3 translate-y-1/3"></div>

            <div className="relative z-10 max-w-4xl mx-auto flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                
                <div className="flex items-center justify-between bg-white/[0.02] border border-white/10 p-4 rounded-2xl backdrop-blur-xl shadow-lg">
                    <div className="flex items-center gap-4">
                        <img src="https://depo.btu.edu.tr/img/sayfa//1691134354_5202df5e827e9f026931.png" alt="BTU" className="h-10 w-auto object-contain" />
                        <div className="h-8 w-px bg-white/20"></div>
                        <div>
                            <h1 className="text-xl font-black text-white tracking-tight">{t('register.createAccount')}</h1>
                            <p className="text-xs text-white/50 tracking-widest uppercase">{t('register.candidateReg')}</p>
                        </div>
                    </div>
                    <LanguageSwitcher />
                    <Button 
                        onClick={() => router.push('/')}
                        variant="ghost" 
                        className="text-white/70 hover:text-white hover:bg-white/10 font-bold"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />{t('register.backToLogin')}</Button>
                </div>

                <StepIndicator />

                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-6 py-4 rounded-2xl flex items-center gap-3 font-semibold text-sm shadow-sm backdrop-blur-md">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                <div className="bg-white/[0.03] backdrop-blur-2xl rounded-[2rem] border border-white/10 overflow-hidden shadow-[0_8px_40px_0_rgba(0,0,0,0.4)]">
                    <form onSubmit={handleSubmit} className="p-8 sm:p-12">
                        
                        {/* STEP 1 */}
                        {currentStep === 1 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-2">{t('register.personalIdentity')}</h2>
                                    <p className="text-white/50 text-sm">{t('register.step1Desc')}</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-white/70 uppercase tracking-widest">{t('register.haveTc')} *</label>
                                        <div className="flex gap-4">
                                            <label className="flex items-center gap-2 text-white/80 cursor-pointer">
                                                <input type="radio" name="haveTc" checked={formData.haveTc === "yes"} onChange={() => handleRadio("haveTc", "yes")} className="accent-btuCyan" /> {t('register.yes')}</label>
                                            <label className="flex items-center gap-2 text-white/80 cursor-pointer">
                                                <input type="radio" name="haveTc" checked={formData.haveTc === "no"} onChange={() => handleRadio("haveTc", "no")} className="accent-btuCyan" /> {t('register.no')}</label>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-white/70 uppercase tracking-widest">{t('register.blueCard')} *</label>
                                        <div className="flex gap-4">
                                            <label className="flex items-center gap-2 text-white/80 cursor-pointer">
                                                <input type="radio" name="blueCard" checked={formData.blueCard === "yes"} onChange={() => handleRadio("blueCard", "yes")} className="accent-btuCyan" /> {t('register.yes')}</label>
                                            <label className="flex items-center gap-2 text-white/80 cursor-pointer">
                                                <input type="radio" name="blueCard" checked={formData.blueCard === "no"} onChange={() => handleRadio("blueCard", "no")} className="accent-btuCyan" /> {t('register.no')}</label>
                                        </div>
                                    </div>
                                    
                                    {formData.haveTc === "yes" && (
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-xs font-bold text-white/70 uppercase tracking-widest">{t('register.tcNumber')} *</label>
                                            <input name="tcNumber" value={formData.tcNumber} onChange={handleChange} className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:border-btuCyan outline-none" placeholder="Enter T.C. Number" />
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-white/70 uppercase tracking-widest">{t('register.firstName')} *</label>
                                        <input name="firstName" value={formData.firstName} onChange={handleChange} className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:border-btuCyan outline-none" placeholder="John" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-white/70 uppercase tracking-widest">{t('register.lastName')} *</label>
                                        <input name="lastName" value={formData.lastName} onChange={handleChange} className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:border-btuCyan outline-none" placeholder="Doe" />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-white/70 uppercase tracking-widest">{t('register.gender')} *</label>
                                        <select name="gender" value={formData.gender} onChange={handleChange} className="w-full h-12 bg-[#0f172a] border border-white/10 rounded-xl px-4 text-white focus:border-btuCyan outline-none">
                                            <option value="" disabled>{t('register.selectGender')}</option>
                                            <option value="Male">{t('register.male')}</option>
                                            <option value="Female">{t('register.female')}</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-white/70 uppercase tracking-widest">{t('register.dateOfBirth')} *</label>
                                        <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:border-btuCyan outline-none [color-scheme:dark]" />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-white/70 uppercase tracking-widest">{t('register.nationality')} *</label>
                                        <select name="nationality" value={formData.nationality} onChange={handleChange} className="w-full h-12 bg-[#0f172a] border border-white/10 rounded-xl px-4 text-white focus:border-btuCyan outline-none">
                                            <option value="" disabled>Select Nationality</option>
                                            {nationalities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-white/70 uppercase tracking-widest">{t('register.passportNo')} *</label>
                                        <input name="passportNumber" value={formData.passportNumber} onChange={handleChange} onBlur={checkPassport} className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:border-btuCyan outline-none tracking-widest" placeholder="A1234567" />
                                        {passportError && <p className="text-red-400 text-xs font-bold mt-1">{passportError}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-white/70 uppercase tracking-widest">{t('register.passportIssueDate')}</label>
                                        <input type="date" name="passportIssueDate" value={formData.passportIssueDate} onChange={handleChange} className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:border-btuCyan outline-none [color-scheme:dark]" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-white/70 uppercase tracking-widest">{t('register.passportExpiryDate')}</label>
                                        <input type="date" name="passportExpiryDate" value={formData.passportExpiryDate} onChange={handleChange} className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:border-btuCyan outline-none [color-scheme:dark]" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 2 */}
                        {currentStep === 2 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-2">{t('register.contactFamily')}</h2>
                                    <p className="text-white/50 text-sm">{t('register.emergencyContactDesc')}</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-xs font-bold text-white/70 uppercase tracking-widest">{t('register.emailLabel')} *</label>
                                        <input type="email" name="email" value={formData.email} onChange={handleChange} onBlur={checkEmail} className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:border-btuCyan outline-none" placeholder="your@email.com" />
                                        {emailError && <p className="text-red-400 text-xs font-bold mt-1">{emailError}</p>}
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-xs font-bold text-white/70 uppercase tracking-widest">{t('register.mobileLabel')} *</label>
                                        <div className="dark-phone-input-wrapper">
                                            <PhoneInput
                                                defaultCountry={defaultPhoneCountry}
                                                value={formData.mobile}
                                                onChange={(phone) => handlePhoneChange("mobile", phone)}
                                                inputStyle={{ width: '100%', height: '48px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '0 0.75rem 0.75rem 0' }}
                                                countrySelectorStyleProps={{ buttonStyle: { height: '48px', backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem 0 0 0.75rem' } }}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2 md:col-span-2 mt-4">
                                        <h3 className="text-sm font-bold text-white mb-2 pb-2 border-b border-white/10">{t('register.addressInfo')}</h3>
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-xs font-bold text-white/70 uppercase tracking-widest">{t('register.addressLineLabel')}</label>
                                        <input name="addressLine1" value={formData.addressLine1} onChange={handleChange} className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:border-btuCyan outline-none" placeholder="123 Street Name" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-white/70 uppercase tracking-widest">{t('register.cityDistrict')}</label>
                                        <input name="cityDistrict" value={formData.cityDistrict} onChange={handleChange} className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:border-btuCyan outline-none" placeholder="City" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-white/70 uppercase tracking-widest">{t('register.country')}</label>
                                        <select name="addressCountry" value={formData.addressCountry} onChange={handleChange} className="w-full h-12 bg-[#0f172a] border border-white/10 rounded-xl px-4 text-white focus:border-btuCyan outline-none">
                                            <option value="" disabled>Select Country</option>
                                            {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </div>

                                    <div className="space-y-2 md:col-span-2 mt-4">
                                        <h3 className="text-sm font-bold text-white mb-2 pb-2 border-b border-white/10">{t('register.familyInfo')}</h3>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-white/70 uppercase tracking-widest">{t('register.fatherName')} *</label>
                                        <input name="fatherName" value={formData.fatherName} onChange={handleChange} className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:border-btuCyan outline-none" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-white/70 uppercase tracking-widest">{t('register.fatherPhoneLabel')}</label>
                                        <div className="dark-phone-input-wrapper">
                                            <PhoneInput
                                                defaultCountry={defaultPhoneCountry}
                                                value={formData.fatherMobile}
                                                onChange={(phone) => handlePhoneChange("fatherMobile", phone)}
                                                inputStyle={{ width: '100%', height: '48px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '0 0.75rem 0.75rem 0' }}
                                                countrySelectorStyleProps={{ buttonStyle: { height: '48px', backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem 0 0 0.75rem' } }}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-white/70 uppercase tracking-widest">{t('register.motherName')} *</label>
                                        <input name="motherName" value={formData.motherName} onChange={handleChange} className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:border-btuCyan outline-none" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-white/70 uppercase tracking-widest">{t('register.motherPhoneLabel')}</label>
                                        <div className="dark-phone-input-wrapper">
                                            <PhoneInput
                                                defaultCountry={defaultPhoneCountry}
                                                value={formData.motherMobile}
                                                onChange={(phone) => handlePhoneChange("motherMobile", phone)}
                                                inputStyle={{ width: '100%', height: '48px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '0 0.75rem 0.75rem 0' }}
                                                countrySelectorStyleProps={{ buttonStyle: { height: '48px', backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem 0 0 0.75rem' } }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 3 */}
                        {currentStep === 3 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-2">{t('register.academicBackground')}</h2>
                                    <p className="text-white/50 text-sm">{t('register.academicDesc')}</p>
                                </div>

                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-xs font-bold text-btuCyan uppercase tracking-widest">{t('register.currentEducationLevel')} *</label>
                                            <select name="educationLevelId" value={formData.educationLevelId} onChange={handleChange} className="w-full h-14 bg-btuCyan/10 border border-btuCyan/30 rounded-xl px-4 text-white font-bold focus:border-btuCyan outline-none">
                                                <option value="high_school">High School</option>
                                                <option value="bachelor">Bachelor's Degree</option>
                                                <option value="master">Master's Degree</option>
                                                <option value="phd">Ph.D.</option>
                                            </select>
                                        </div>

                                        <div className="space-y-2 md:col-span-2 mt-2">
                                            <h3 className="text-sm font-bold text-white mb-2 pb-2 border-b border-white/10">{t('register.highSchoolDetails')}</h3>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-white/70 uppercase tracking-widest">{t('register.highSchoolName')} *</label>
                                            <input name="highSchoolName" value={formData.highSchoolName} onChange={handleChange} className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:border-btuCyan outline-none" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-white/70 uppercase tracking-widest">{t('register.country')} *</label>
                                            <select name="highSchoolCountry" value={formData.highSchoolCountry} onChange={handleChange} className="w-full h-12 bg-[#0f172a] border border-white/10 rounded-xl px-4 text-white focus:border-btuCyan outline-none">
                                                <option value="" disabled>Select Country</option>
                                                {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-white/70 uppercase tracking-widest">{t('register.diplomaGradeExample')} *</label>
                                            <input name="highSchoolGpa" value={formData.highSchoolGpa} onChange={handleChange} className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:border-btuCyan outline-none" />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-white/70 uppercase tracking-widest">{t('register.highSchoolType')} *</label>
                                            <select name="highSchoolType" value={formData.highSchoolType} onChange={handleChange} className="w-full h-12 bg-[#0f172a] border border-white/10 rounded-xl px-4 text-white focus:border-btuCyan outline-none">
                                                <option value="Diploma">Diploma</option>
                                                <option value="TR-YÖS">TR-YÖS</option>
                                                <option value="SAT">SAT</option>
                                            </select>
                                        </div>

                                        {formData.highSchoolType === 'TR-YÖS' && (
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-white/70 uppercase tracking-widest">{t('register.trYosDegree')} *</label>
                                                <input name="yosDegree" value={formData.yosDegree} onChange={handleChange} className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:border-btuCyan outline-none" />
                                            </div>
                                        )}
                                        {formData.highSchoolType === 'SAT' && (
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-white/70 uppercase tracking-widest">{t('register.satDegreeLabel')} *</label>
                                                <input name="satDegree" value={formData.satDegree} onChange={handleChange} className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:border-btuCyan outline-none" />
                                            </div>
                                        )}
                                        {formData.highSchoolType === 'Diploma' && (
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-white/70 uppercase tracking-widest">{t('register.diplomaDegreeLabel')} *</label>
                                                <input name="diplomaDegree" value={formData.diplomaDegree} onChange={handleChange} className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:border-btuCyan outline-none" />
                                            </div>
                                        )}

                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-xs font-bold text-white/70 uppercase tracking-widest">{t('register.hasTomerLabel')} *</label>
                                            <select name="hasTomer" value={formData.hasTomer} onChange={handleChange} className="w-full h-12 bg-[#0f172a] border border-white/10 rounded-xl px-4 text-white focus:border-btuCyan outline-none">
                                                <option value="Hayır">Hayır (None)</option>
                                                <option value="A1">A1</option>
                                                <option value="A2">A2</option>
                                                <option value="B1">B1</option>
                                                <option value="B2">B2</option>
                                                <option value="C1">C1</option>
                                                <option value="C2">C2</option>
                                            </select>
                                        </div>

                                        {(formData.educationLevelId === 'master' || formData.educationLevelId === 'phd') && (
                                            <>
                                                <div className="space-y-2 md:col-span-2 mt-4">
                                                    <h3 className="text-sm font-bold text-white mb-2 pb-2 border-b border-white/10">{t('register.bachelorDetails')}</h3>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-white/70 uppercase tracking-widest">{t('register.universityName')}</label>
                                                    <input name="bachelorSchoolName" value={formData.bachelorSchoolName} onChange={handleChange} className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:border-btuCyan outline-none" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-white/70 uppercase tracking-widest">{t('register.country')}</label>
                                                    <select name="bachelorCountry" value={formData.bachelorCountry} onChange={handleChange} className="w-full h-12 bg-[#0f172a] border border-white/10 rounded-xl px-4 text-white focus:border-btuCyan outline-none">
                                                        <option value="" disabled>Select Country</option>
                                                        {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                                    </select>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-white/70 uppercase tracking-widest">{t('register.gpaExample32')}</label>
                                                    <input name="bachelorGpa" value={formData.bachelorGpa} onChange={handleChange} className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:border-btuCyan outline-none" />
                                                </div>
                                            </>
                                        )}

                                        {formData.educationLevelId === 'phd' && (
                                            <>
                                                <div className="space-y-2 md:col-span-2 mt-4">
                                                    <h3 className="text-sm font-bold text-white mb-2 pb-2 border-b border-white/10">{t('register.masterDetails')}</h3>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-white/70 uppercase tracking-widest">University Name</label>
                                                    <input name="masterSchoolName" value={formData.masterSchoolName} onChange={handleChange} className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:border-btuCyan outline-none" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-white/70 uppercase tracking-widest">{t('register.country')}</label>
                                                    <select name="masterCountry" value={formData.masterCountry} onChange={handleChange} className="w-full h-12 bg-[#0f172a] border border-white/10 rounded-xl px-4 text-white focus:border-btuCyan outline-none">
                                                        <option value="" disabled>Select Country</option>
                                                        {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                                    </select>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-white/70 uppercase tracking-widest">{t('register.gpaExample35')}</label>
                                                    <input name="masterGpa" value={formData.masterGpa} onChange={handleChange} className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:border-btuCyan outline-none" />
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 4: Documents */}
                        {currentStep === 4 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-2">{t('register.documentUpload')}</h2>
                                    <p className="text-white/50 text-sm">{t('register.docUploadDesc')}</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white/5 rounded-xl border border-white/10 p-4">
                                        <FileUpload
                                            label={t('register.docPersonalPhoto')}
                                            required={true}
                                            accept="image/*"
                                            currentFile={documents.find(d => d.type === 'personal_photo') ? {
                                                fileName: documents.find(d => d.type === 'personal_photo').file.name,
                                                fileUrl: documents.find(d => d.type === 'personal_photo').previewUrl,
                                            } : undefined}
                                            onFileSelect={(f) => handleFileSelect(f, 'personal_photo')}
                                            onFileRemove={() => handleFileRemove('personal_photo')}
                                        />
                                    </div>
                                    <div className="bg-white/5 rounded-xl border border-white/10 p-4">
                                        <FileUpload
                                            label={t('register.docPassportCopy')}
                                            required={true}
                                            accept="image/*,application/pdf"
                                            currentFile={documents.find(d => d.type === 'passport_copy') ? {
                                                fileName: documents.find(d => d.type === 'passport_copy').file.name,
                                                fileUrl: documents.find(d => d.type === 'passport_copy').previewUrl,
                                            } : undefined}
                                            onFileSelect={(f) => handleFileSelect(f, 'passport_copy')}
                                            onFileRemove={() => handleFileRemove('passport_copy')}
                                        />
                                    </div>
                                    
                                    <div className="bg-white/5 rounded-xl border border-white/10 p-4">
                                        <FileUpload
                                            label={t('register.docHighSchoolCert')}
                                            required={false}
                                            accept="image/*,application/pdf"
                                            currentFile={documents.find(d => d.type === 'high_school_certificate') ? {
                                                fileName: documents.find(d => d.type === 'high_school_certificate').file.name,
                                                fileUrl: documents.find(d => d.type === 'high_school_certificate').previewUrl,
                                            } : undefined}
                                            onFileSelect={(f) => handleFileSelect(f, 'high_school_certificate')}
                                            onFileRemove={() => handleFileRemove('high_school_certificate')}
                                        />
                                    </div>
                                    <div className="bg-white/5 rounded-xl border border-white/10 p-4">
                                        <FileUpload
                                            label={t('register.docHighSchoolTrans')}
                                            required={false}
                                            accept="image/*,application/pdf"
                                            currentFile={documents.find(d => d.type === 'high_school_transcript') ? {
                                                fileName: documents.find(d => d.type === 'high_school_transcript').file.name,
                                                fileUrl: documents.find(d => d.type === 'high_school_transcript').previewUrl,
                                            } : undefined}
                                            onFileSelect={(f) => handleFileSelect(f, 'high_school_transcript')}
                                            onFileRemove={() => handleFileRemove('high_school_transcript')}
                                        />
                                    </div>

                                    {(formData.educationLevelId === 'master' || formData.educationLevelId === 'phd') && (
                                        <>
                                            <div className="bg-white/5 rounded-xl border border-white/10 p-4">
                                                <FileUpload
                                                    label="Bachelor Degree"
                                                    required={false}
                                                    accept="image/*,application/pdf"
                                                    currentFile={documents.find(d => d.type === 'bachelor_degree') ? {
                                                        fileName: documents.find(d => d.type === 'bachelor_degree').file.name,
                                                        fileUrl: documents.find(d => d.type === 'bachelor_degree').previewUrl,
                                                    } : undefined}
                                                    onFileSelect={(f) => handleFileSelect(f, 'bachelor_degree')}
                                                    onFileRemove={() => handleFileRemove('bachelor_degree')}
                                                />
                                            </div>
                                            <div className="bg-white/5 rounded-xl border border-white/10 p-4">
                                                <FileUpload
                                                    label="Bachelor Transcript"
                                                    required={false}
                                                    accept="image/*,application/pdf"
                                                    currentFile={documents.find(d => d.type === 'bachelor_transcript') ? {
                                                        fileName: documents.find(d => d.type === 'bachelor_transcript').file.name,
                                                        fileUrl: documents.find(d => d.type === 'bachelor_transcript').previewUrl,
                                                    } : undefined}
                                                    onFileSelect={(f) => handleFileSelect(f, 'bachelor_transcript')}
                                                    onFileRemove={() => handleFileRemove('bachelor_transcript')}
                                                />
                                            </div>
                                        </>
                                    )}

                                    {formData.highSchoolType === 'TR-YÖS' && (
                                        <div className="bg-white/5 rounded-xl border border-white/10 p-4">
                                            <FileUpload
                                                label="TR-YÖS Certificate"
                                                required={true}
                                                accept="image/*,application/pdf"
                                                currentFile={documents.find(d => d.type === 'yos_certificate') ? {
                                                    fileName: documents.find(d => d.type === 'yos_certificate').file.name,
                                                    fileUrl: documents.find(d => d.type === 'yos_certificate').previewUrl,
                                                } : undefined}
                                                onFileSelect={(f) => handleFileSelect(f, 'yos_certificate')}
                                                onFileRemove={() => handleFileRemove('yos_certificate')}
                                            />
                                        </div>
                                    )}

                                    {formData.highSchoolType === 'SAT' && (
                                        <div className="bg-white/5 rounded-xl border border-white/10 p-4">
                                            <FileUpload
                                                label="SAT Certificate"
                                                required={true}
                                                accept="image/*,application/pdf"
                                                currentFile={documents.find(d => d.type === 'sat_certificate') ? {
                                                    fileName: documents.find(d => d.type === 'sat_certificate').file.name,
                                                    fileUrl: documents.find(d => d.type === 'sat_certificate').previewUrl,
                                                } : undefined}
                                                onFileSelect={(f) => handleFileSelect(f, 'sat_certificate')}
                                                onFileRemove={() => handleFileRemove('sat_certificate')}
                                            />
                                        </div>
                                    )}

                                    {formData.hasTomer && formData.hasTomer !== 'Hayır' && (
                                        <div className="bg-white/5 rounded-xl border border-white/10 p-4">
                                            <FileUpload
                                                label="TOMER Certificate"
                                                required={true}
                                                accept="image/*,application/pdf"
                                                currentFile={documents.find(d => d.type === 'tomer_certificate') ? {
                                                    fileName: documents.find(d => d.type === 'tomer_certificate').file.name,
                                                    fileUrl: documents.find(d => d.type === 'tomer_certificate').previewUrl,
                                                } : undefined}
                                                onFileSelect={(f) => handleFileSelect(f, 'tomer_certificate')}
                                                onFileRemove={() => handleFileRemove('tomer_certificate')}
                                            />
                                        </div>
                                    )}

                                    <div className="bg-white/5 rounded-xl border border-white/10 p-4">
                                        <FileUpload
                                            label="Other Documents"
                                            required={false}
                                            accept="image/*,application/pdf"
                                            currentFile={documents.find(d => d.type === 'other') ? {
                                                fileName: documents.find(d => d.type === 'other').file.name,
                                                fileUrl: documents.find(d => d.type === 'other').previewUrl,
                                            } : undefined}
                                            onFileSelect={(f) => handleFileSelect(f, 'other')}
                                            onFileRemove={() => handleFileRemove('other')}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="mt-12 pt-6 border-t border-white/10 flex items-center justify-between">
                            {currentStep > 1 ? (
                                <Button type="button" onClick={handleBack} variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10 h-12 px-6 rounded-xl">
                                    <ChevronLeft className="w-4 h-4 mr-2" />{t('common.back')}</Button>
                            ) : <div></div>}

                            {currentStep < 4 ? (
                                <Button type="button" onClick={handleNext} className="bg-white text-[#0f172a] hover:bg-white/90 h-12 px-8 rounded-xl font-bold">{t('common.next')}<ChevronRight className="w-4 h-4 ml-2" />
                                </Button>
                            ) : (
                                <Button type="submit" disabled={submitting} className="bg-btuCyan hover:bg-[#0091a8] text-white h-12 px-8 rounded-xl font-bold shadow-[0_0_20px_rgba(0,172,201,0.4)]">
                                    {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                                    Submit Application
                                </Button>
                            )}
                        </div>
                    </form>
                </div>

                <p className="text-center text-xs text-white/30 tracking-widest uppercase">
                    &copy; {new Date().getFullYear()} Bursa Teknik Üniversitesi
                </p>
            </div>
            
            {/* Styles for overriding phone input in dark mode */}
            <style dangerouslySetInnerHTML={{__html: `
                .dark-phone-input-wrapper {
                    --react-international-phone-background-color: rgba(255,255,255,0.05);
                    --react-international-phone-text-color: white;
                    --react-international-phone-border-color: rgba(255,255,255,0.1);
                    --react-international-phone-dropdown-background-color: #0f172a;
                    --react-international-phone-dropdown-item-text-color: white;
                    --react-international-phone-dropdown-item-hover-background-color: rgba(255,255,255,0.1);
                }
            `}} />
        </div>
    );
}

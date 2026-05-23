"use client";

import React, { useState, useEffect } from "react";
import { 
    User, Info, CreditCard, BookOpen, GraduationCap, 
    Building, Users, MapPin, ChevronDown, ChevronUp,
    Phone, Mail, Calendar, VenusAndMars, Hash, Loader2, Key
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

const getSections = (t: any) => [
    { id: 'personal', title: t('sidebar.personal'), icon: User },
    { id: 'status', title: t('sidebar.status'), icon: Info },
    { id: 'identity', title: t('sidebar.identity'), icon: CreditCard },
    { id: 'tomer', title: t('sidebar.tomer'), icon: BookOpen },
    { id: 'academic', title: t('sidebar.academic'), icon: GraduationCap },
    { id: 'highschool', title: t('sidebar.highschool'), icon: Building },
    { id: 'higher', title: t('sidebar.higher'), icon: GraduationCap },
    { id: 'family', title: t('sidebar.family'), icon: Users },
    { id: 'address', title: t('sidebar.address'), icon: MapPin },
];

export default function StudentSidebar() {
    const { t } = useLanguage();
    const [activeSection, setActiveSection] = useState('personal');
    const [studentData, setStudentData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudentData = async () => {
            const studentId = localStorage.getItem('studentId');
            if (!studentId) {
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from('Student')
                .select('*')
                .eq('id', studentId)
                .single();

            if (data && !error) {
                // Fetch personal photo from Document table
                const { data: docData } = await supabase
                    .from('Document')
                    .select('fileUrl')
                    .eq('studentId', studentId)
                    .ilike('fileType', '%personal_photo%')
                    .order('createdAt', { ascending: false })
                    .limit(1)
                    .maybeSingle();

                // Fetch Countries to map CUIDs to Names
                const { data: countries } = await supabase.from('Country').select('id, name');
                const countryMap = countries ? Object.fromEntries(countries.map(c => [c.id, c.name])) : {};

                setStudentData({
                    ...data,
                    nationality: countryMap[data.nationality] || data.nationality,
                    addressCountry: countryMap[data.addressCountry] || data.addressCountry,
                    highSchoolCountry: countryMap[data.highSchoolCountry] || data.highSchoolCountry,
                    bachelorCountry: countryMap[data.bachelorCountry] || data.bachelorCountry,
                    masterCountry: countryMap[data.masterCountry] || data.masterCountry,
                    actualPhotoUrl: docData?.fileUrl || data.photoUrl || null
                });
            }
            setLoading(false);
        };

        fetchStudentData();
    }, []);

    if (loading) {
        return (
            <div className="h-full min-h-screen bg-[#0a0f1e] flex items-center justify-center border-r border-white/5">
                <Loader2 className="w-8 h-8 text-btuCyan animate-spin" />
            </div>
        );
    }

    if (!studentData) {
        return (
            <div className="h-full min-h-screen bg-[#0a0f1e] p-8 text-white text-center border-r border-white/5">
                {t('sidebar.valNoProfile')}
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        if (!dateString) return t('sidebar.valNotProvided');
        return new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    return (
        <div className="h-full min-h-screen bg-[#0a0f1e] text-white flex flex-col border-r border-white/5">
            {/* Header / Profile Info */}
            <div className="p-6 flex flex-col items-center justify-center text-center border-b border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-btuCyan/10 rounded-full blur-3xl"></div>
                
                <h2 className="text-xl font-bold mb-4 relative z-10 tracking-tight">
                    {studentData.fullName || `${studentData.firstName} ${studentData.lastName}`}
                </h2>
                
                <div className="relative w-28 h-28 rounded-full mb-2 p-1 bg-gradient-to-tr from-btuCyan to-blue-500 shadow-[0_0_20px_rgba(0,172,201,0.3)]">
                    <img 
                        src={studentData.actualPhotoUrl || "https://ui-avatars.com/api/?name=" + encodeURIComponent(studentData.firstName + " " + studentData.lastName) + "&background=0D8ABC&color=fff&size=256"} 
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover border-4 border-[#0a0f1e]"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(studentData.firstName + " " + studentData.lastName) + "&background=0D8ABC&color=fff&size=256";
                        }}
                    />
                </div>
            </div>

            {/* Accordion Menu */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {getSections(t).map((section) => {
                    const isActive = activeSection === section.id;
                    const Icon = section.icon;

                    return (
                        <div key={section.id} className="border-b border-white/5">
                            {/* Accordion Header */}
                            <button
                                onClick={() => setActiveSection(isActive ? '' : section.id)}
                                className={`w-full flex items-center justify-between p-4 transition-all duration-300 ${
                                    isActive 
                                    ? "bg-[#ffffff] text-[#0a0f1e] shadow-lg" 
                                    : "hover:bg-white/5 text-white/80 hover:text-white"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-1.5 rounded-lg ${isActive ? 'bg-btuCyan/20 text-btuCyan' : 'bg-white/10'}`}>
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    <span className={`font-bold tracking-wider text-[13px] ${isActive ? 'text-[#0a0f1e]' : ''}`}>
                                        {section.title}
                                    </span>
                                </div>
                                {isActive ? <ChevronUp className="w-3.5 h-3.5 opacity-50" /> : <ChevronDown className="w-3.5 h-3.5 opacity-50" />}
                            </button>

                            {/* Accordion Content (Read Only Data) */}
                            <AnimatePresence>
                                {isActive && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                        className="overflow-hidden bg-[#0f172a] shadow-inner"
                                    >
                                        <div className="p-0">
                                            {section.id === 'personal' && (
                                                <div className="flex flex-col">
                                                    <InfoRow icon={<User />} label={t("sidebar.fieldFirstName")} value={studentData.firstName || '-'} />
                                                    <InfoRow icon={<User />} label={t("sidebar.fieldLastName")} value={studentData.lastName || '-'} />
                                                    <InfoRow icon={<Mail />} label={t("sidebar.fieldEmail")} value={studentData.email || '-'} />
                                                    <InfoRow icon={<Phone />} label={t("sidebar.fieldMobile")} value={studentData.mobile || studentData.phone || t('sidebar.valNotProvided')} />
                                                    <InfoRow icon={<VenusAndMars />} label={t("sidebar.fieldGender")} value={studentData.gender || t('sidebar.valNotProvided')} />
                                                    <InfoRow icon={<Calendar />} label={t("sidebar.fieldDob")} value={formatDate(studentData.dateOfBirth)} isLast />
                                                </div>
                                            )}
                                            {section.id === 'status' && (
                                                <div className="flex flex-col">
                                                    <InfoRow icon={<Info />} label={t("sidebar.fieldAppStatus")} value={studentData.status || t('sidebar.valApplicant')} isLast />
                                                </div>
                                            )}
                                            {section.id === 'identity' && (
                                                <div className="flex flex-col">
                                                    <InfoRow icon={<MapPin />} label={t("sidebar.fieldNationality")} value={studentData.nationality || t('sidebar.valNotProvided')} />
                                                    <InfoRow icon={<CreditCard />} label={t("sidebar.fieldPassport")} value={studentData.passportNumber || t('sidebar.valNotProvided')} />
                                                    <InfoRow icon={<Calendar />} label={t("sidebar.fieldPassIssue")} value={formatDate(studentData.passportIssueDate)} />
                                                    <InfoRow icon={<Calendar />} label={t("sidebar.fieldPassExpiry")} value={formatDate(studentData.passportExpiryDate)} />
                                                    <InfoRow icon={<Key />} label={t("sidebar.fieldTc")} value={studentData.tcNumber || t('sidebar.valNA')} isLast />
                                                </div>
                                            )}
                                            {section.id === 'tomer' && (
                                                <div className="flex flex-col">
                                                    <InfoRow icon={<BookOpen />} label={t("sidebar.fieldHasTomer")} value={studentData.hasTomer || t('sidebar.valNo')} isLast />
                                                </div>
                                            )}
                                            {section.id === 'academic' && (
                                                <div className="flex flex-col">
                                                    <InfoRow icon={<GraduationCap />} label={t("sidebar.fieldEdLevel")} value={studentData.educationLevelName || t('sidebar.valNotSpecified')} isLast />
                                                </div>
                                            )}
                                            {section.id === 'highschool' && (
                                                <div className="flex flex-col">
                                                    <InfoRow icon={<MapPin />} label={t("sidebar.fieldCountry")} value={studentData.highSchoolCountry || t('sidebar.valNotProvided')} />
                                                    <InfoRow icon={<Building />} label={t("sidebar.fieldSchoolName")} value={studentData.highSchoolName || t('sidebar.valNotProvided')} />
                                                    <InfoRow icon={<Info />} label={t("sidebar.fieldSchoolType")} value={studentData.highSchoolType || t('sidebar.valNotProvided')} />
                                                    <InfoRow icon={<Hash />} label={t("sidebar.fieldGpa")} value={studentData.highSchoolGpa?.toString() || t('sidebar.valNotProvided')} isLast />
                                                </div>
                                            )}
                                            {section.id === 'higher' && (
                                                <div className="flex flex-col">
                                                    <InfoRow icon={<Building />} label={t("sidebar.fieldBachSchool")} value={studentData.bachelorSchoolName || t('sidebar.valNA')} />
                                                    <InfoRow icon={<Hash />} label={t("sidebar.fieldBachGpa")} value={studentData.bachelorGpa?.toString() || t('sidebar.valNA')} />
                                                    <InfoRow icon={<Building />} label={t("sidebar.fieldMasterSchool")} value={studentData.masterSchoolName || t('sidebar.valNA')} />
                                                    <InfoRow icon={<Hash />} label={t("sidebar.fieldMasterGpa")} value={studentData.masterGpa?.toString() || t('sidebar.valNA')} isLast />
                                                </div>
                                            )}
                                            {section.id === 'family' && (
                                                <div className="flex flex-col">
                                                    <InfoRow icon={<User />} label={t("sidebar.fieldFatherName")} value={studentData.fatherName || t('sidebar.valNotProvided')} />
                                                    <InfoRow icon={<Phone />} label={t("sidebar.fieldFatherMobile")} value={studentData.fatherMobile || t('sidebar.valNotProvided')} />
                                                    <InfoRow icon={<User />} label={t("sidebar.fieldMotherName")} value={studentData.motherName || t('sidebar.valNotProvided')} />
                                                    <InfoRow icon={<Phone />} label={t("sidebar.fieldMotherMobile")} value={studentData.motherMobile || t('sidebar.valNotProvided')} isLast />
                                                </div>
                                            )}
                                            {section.id === 'address' && (
                                                <div className="flex flex-col">
                                                    <InfoRow icon={<MapPin />} label={t("sidebar.fieldCountry")} value={studentData.addressCountry || t('sidebar.valNotProvided')} />
                                                    <InfoRow icon={<MapPin />} label={t("sidebar.fieldState")} value={studentData.stateProvince || t('sidebar.valNotProvided')} />
                                                    <InfoRow icon={<MapPin />} label={t("sidebar.fieldCity")} value={studentData.cityDistrict || t('sidebar.valNotProvided')} />
                                                    <InfoRow icon={<MapPin />} label={t("sidebar.fieldAddressLine")} value={studentData.addressLine1 || t('sidebar.valNotProvided')} />
                                                    <InfoRow icon={<Hash />} label={t("sidebar.fieldPostal")} value={studentData.postalCode || t('sidebar.valNotProvided')} isLast />
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>
            
            {/* Branding Footer inside sidebar */}
            <div className="p-4 text-center border-t border-white/5 bg-[#0a0f1e]/90 backdrop-blur">
                <img 
                    src="https://depo.btu.edu.tr/img/sayfa//1691134354_5202df5e827e9f026931.png" 
                    alt="BTU Logo" 
                    className="h-8 mx-auto opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all"
                />
            </div>
        </div>
    );
}

function InfoRow({ icon, label, value, isLast = false }: { icon: React.ReactNode, label: string, value: string, isLast?: boolean }) {
    return (
        <div className={`flex flex-col py-3 px-5 hover:bg-white/5 transition-colors ${!isLast ? 'border-b border-white/10' : ''}`}>
            <div className="flex items-center gap-2 mb-1.5 text-white/70">
                <div className="text-btuCyan bg-btuCyan/10 p-1.5 rounded-md w-fit">
                    {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: "w-3.5 h-3.5" })}
                </div>
                <span className="text-[10px] font-bold tracking-widest uppercase">{label}</span>
            </div>
            <div className="pl-10 text-white font-semibold text-sm">
                {value}
            </div>
        </div>
    );
}

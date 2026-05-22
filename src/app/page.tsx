"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2, ArrowRight, UserCircle2, GraduationCap } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { AboutMenu } from "@/components/AboutMenu";

export default function StudentLoginPage() {
    const [email, setEmail] = useState("");
    const [passport, setPassport] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { t } = useLanguage();

    // Framer Motion Values for subtle Parallax
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 50, stiffness: 100, mass: 1 };
    const smoothX = useSpring(mouseX, springConfig);
    const smoothY = useSpring(mouseY, springConfig);

    // Background moves very slightly
    const bgX = useTransform(smoothX, [-1, 1], [15, -15]);
    const bgY = useTransform(smoothY, [-1, 1], [15, -15]);

    // Card floating effect
    const cardY = useTransform(smoothY, [-1, 1], [-5, 5]);

    const handleMouseMove = (e: React.MouseEvent) => {
        const { innerWidth, innerHeight } = window;
        const x = (e.clientX / innerWidth) * 2 - 1;
        const y = (e.clientY / innerHeight) * 2 - 1;
        mouseX.set(x);
        mouseY.set(y);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const { data, error: fetchError } = await supabase
                .from('Student')
                .select('*')
                .eq('email', email.trim().toLowerCase())
                .eq('passportNumber', passport.trim())
                .single();

            if (fetchError || !data) {
                throw new Error("Invalid Email or Passport Number");
            }

            localStorage.setItem('studentId', data.id);
            localStorage.setItem('studentName', data.fullName);
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message || "An error occurred during authentication.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div 
            className="h-screen w-full flex items-center justify-center font-sans selection:bg-btuCyan selection:text-white bg-[#0f172a] overflow-hidden relative"
            onMouseMove={handleMouseMove}
        >
            
            {/* Cinematic Campus Background */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <motion.div 
                    className="absolute inset-[-50px] bg-[url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-luminosity"
                    style={{ x: bgX, y: bgY, scale: 1.05 }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a]/80 via-[#0f172a]/60 to-[#0f172a]/90 backdrop-blur-[4px]"></div>
            </div>

            {/* Main Centered Content */}
            <div className="absolute top-6 right-6 sm:top-8 sm:right-8 z-50 flex items-center gap-2 sm:gap-4">
                <AboutMenu />
                <LanguageSwitcher />
            </div>
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center h-full py-4">
                
                {/* Logo & Header */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="flex flex-col items-center mb-6 sm:mb-8"
                >
                    <img 
                        src="https://depo.btu.edu.tr/img/sayfa//1691134354_5202df5e827e9f026931.png" 
                        alt="Bursa Teknik Üniversitesi" 
                        className="h-14 sm:h-16 md:h-20 w-auto object-contain drop-shadow-2xl mb-4 sm:mb-6"
                    />
                    <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md shadow-xl mb-3 sm:mb-4">
                        <GraduationCap className="h-4 w-4 text-btuCyan" />
                        <span className="text-xs sm:text-sm font-bold tracking-[0.1em] sm:tracking-[0.2em] text-white uppercase text-center">{t('auth.login')}</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tighter text-center px-2">
                        {t('dashboard.welcome')}
                    </h1>
                </motion.div>

                {/* Login Card */}
                <motion.div 
                    className="w-full max-w-5xl"
                    style={{ y: cardY }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                >
                    <div className="bg-white/[0.03] backdrop-blur-2xl rounded-3xl sm:rounded-[2rem] shadow-[0_8px_40px_0_rgba(0,0,0,0.4)] border border-white/10 overflow-hidden flex flex-col md:flex-row relative">
                        
                        {/* Decorative side accent */}
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 sm:w-2 bg-btuCyan shadow-[0_0_20px_#00acc9]"></div>

                        {/* Left Info Panel */}
                        <div className="w-full md:w-5/12 bg-white/5 p-6 sm:p-8 lg:p-10 border-b md:border-b-0 md:border-r border-white/10 flex flex-col justify-center">
                            <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-3 sm:mb-4">Application Status</h2>
                            <p className="text-white/70 leading-relaxed text-sm sm:text-base mb-6 font-light">
                                Sign in with your registered email and passport number to track your application, upload pending documents, and receive official updates from the admission committee.
                            </p>
                            <ul className="space-y-3 sm:space-y-4 text-sm sm:text-base font-medium text-white/60">
                                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-btuCyan shadow-[0_0_10px_#00acc9]"></div> Real-time tracking</li>
                                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-btuCyan shadow-[0_0_10px_#00acc9]"></div> Secure document upload</li>
                                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-btuCyan shadow-[0_0_10px_#00acc9]"></div> Offer letter management</li>
                            </ul>
                        </div>

                        {/* Right Form Panel */}
                        <div className="w-full md:w-7/12 p-6 sm:p-8 lg:p-10 relative overflow-hidden">
                            {/* Inner glow */}
                            <div className="absolute -top-16 -right-16 sm:-top-32 sm:-right-32 w-48 h-48 sm:w-80 sm:h-80 bg-btuCyan/10 rounded-full blur-[40px] sm:blur-[80px] pointer-events-none"></div>

                            <form onSubmit={handleLogin} className="relative z-10 space-y-4 sm:space-y-6">
                                {error && (
                                    <div className="flex items-center gap-3 text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-xl text-sm sm:text-base">
                                        <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                                        <span>{error}</span>
                                    </div>
                                )}
                                
                                <div className="space-y-2 sm:space-y-3">
                                    <Label htmlFor="email" className="text-xs sm:text-sm font-bold text-white/70 uppercase tracking-[0.1em] sm:tracking-[0.15em]">
                                        {t('auth.email')}
                                    </Label>
                                    <div className="relative">
                                        <UserCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="student@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="h-12 sm:h-14 pl-12 bg-[#0f172a]/60 border-white/10 focus:bg-[#0f172a]/90 focus:border-btuCyan focus:ring-1 focus:ring-btuCyan text-white text-base rounded-xl transition-all shadow-inner"
                                        />
                                    </div>
                                </div>
                                
                                <div className="space-y-2 sm:space-y-3">
                                    <Label htmlFor="passport" className="text-xs sm:text-sm font-bold text-white/70 uppercase tracking-[0.1em] sm:tracking-[0.15em]">
                                        {t('register.passportNo')}
                                    </Label>
                                    <Input
                                        id="passport"
                                        type="text"
                                        placeholder="A12345678"
                                        value={passport}
                                        onChange={(e) => setPassport(e.target.value)}
                                        required
                                        className="h-12 sm:h-14 px-4 sm:px-5 bg-[#0f172a]/60 border-white/10 focus:bg-[#0f172a]/90 focus:border-btuCyan focus:ring-1 focus:ring-btuCyan text-white text-base rounded-xl transition-all tracking-wider sm:tracking-[0.15em] shadow-inner"
                                    />
                                </div>
                                
                                <div className="pt-2 sm:pt-4 space-y-3 sm:space-y-4">
                                    <Button 
                                        className="w-full h-12 sm:h-14 bg-btuCyan hover:bg-white hover:text-[#0f172a] text-white font-bold tracking-wide text-base lg:text-lg rounded-xl transition-all duration-300 shadow-[0_0_30px_-5px_rgba(0,172,201,0.5)] group" 
                                        type="submit" 
                                        disabled={loading}
                                    >
                                        <span className="flex items-center justify-center gap-2 sm:gap-3">
                                            {loading ? (
                                                <>
                                                    <Loader2 className="h-5 w-5 animate-spin" />
                                                    Checking Records...
                                                </>
                                            ) : (
                                                <>
                                                    {t('auth.login')}
                                                    <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 transition-transform group-hover:translate-x-1" />
                                                </>
                                            )}
                                        </span>
                                    </Button>

                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <span className="w-full border-t border-white/10" />
                                        </div>
                                        <div className="relative flex justify-center text-[10px] sm:text-xs uppercase">
                                            <span className="bg-[#0f172a]/60 px-2 text-white/50 backdrop-blur-md">Or</span>
                                        </div>
                                    </div>

                                    <Button 
                                        variant="outline"
                                        className="w-full h-12 sm:h-14 bg-white/5 border-white/10 hover:bg-white/10 text-white font-bold tracking-wide text-base lg:text-lg rounded-xl transition-all duration-300"
                                        type="button"
                                        onClick={() => router.push('/register')}
                                    >
                                        {t('auth.register')}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </motion.div>

                {/* Footer */}
                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="mt-6 sm:mt-8 text-xs font-semibold text-white/30 tracking-widest uppercase text-center"
                >
                    &copy; {new Date().getFullYear()} Bursa Teknik Üniversitesi. All Rights Reserved.
                </motion.p>
            </div>
        </div>
    );
}

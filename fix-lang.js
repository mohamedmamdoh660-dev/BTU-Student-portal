const fs = require('fs');

function updateLogin() {
    let content = fs.readFileSync('src/app/page.tsx', 'utf8');
    
    if(!content.includes('useLanguage')) {
        content = content.replace(
            `import { AlertCircle, Loader2, ArrowRight, UserCircle2, GraduationCap } from "lucide-react";`,
            `import { AlertCircle, Loader2, ArrowRight, UserCircle2, GraduationCap } from "lucide-react";\nimport { useLanguage } from "@/lib/i18n/LanguageContext";\nimport { LanguageSwitcher } from "@/components/LanguageSwitcher";`
        );
        
        content = content.replace(
            `const router = useRouter();`,
            `const router = useRouter();\n    const { t } = useLanguage();`
        );
        
        content = content.replace(
            `<div className="bg-white/[0.03] backdrop-blur-2xl`,
            `<div className="absolute top-4 right-4 z-50"><LanguageSwitcher /></div>\n                    <div className="bg-white/[0.03] backdrop-blur-2xl`
        );
        
        content = content.replace(/Welcome to your Future/g, `{t('dashboard.welcome')}`);
        content = content.replace(/Candidate Portal/g, `{t('auth.login')}`);
        content = content.replace(/>Student Login</g, `>{t('auth.login')}<`);
        content = content.replace(/Enter your credentials to access your dashboard\./g, `{t('auth.email')}`);
        content = content.replace(/>Email Address</g, `>{t('auth.email')}<`);
        content = content.replace(/>Passport Number</g, `>{t('register.passportNo')}<`);
        content = content.replace(/>Don't have an account\? \{' '\}/g, `>{t('auth.noAccount')} {' '}`);
        content = content.replace(/>Create one now</g, `>{t('auth.register')}<`);
        content = content.replace(/Sign In/g, `{t('auth.login')}`);
        
        fs.writeFileSync('src/app/page.tsx', content);
        console.log('Login page updated');
    }
}

function updateSidebar() {
    let content = fs.readFileSync('src/components/dashboard/StudentSidebar.tsx', 'utf8');
    if(!content.includes('useLanguage')) {
        content = content.replace(
            `import { supabase } from "@/lib/supabase";`,
            `import { supabase } from "@/lib/supabase";\nimport { useLanguage } from "@/lib/i18n/LanguageContext";\nimport { LanguageSwitcher } from "@/components/LanguageSwitcher";`
        );
        
        content = content.replace(
            `export default function StudentSidebar() {`,
            `export default function StudentSidebar() {\n    const { t } = useLanguage();`
        );
        
        content = content.replace(
            `{s.title}`,
            `{t('sidebar.' + s.id)}`
        );
        
        fs.writeFileSync('src/components/dashboard/StudentSidebar.tsx', content);
        console.log('Sidebar updated');
    }
}

updateLogin();
updateSidebar();

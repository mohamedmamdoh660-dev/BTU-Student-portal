const fs = require('fs');

function updateRegister() {
    let content = fs.readFileSync('src/app/register/page.tsx', 'utf8');
    
    if(!content.includes('useLanguage')) {
        content = content.replace(
            `import 'react-international-phone/style.css';`,
            `import 'react-international-phone/style.css';\nimport { useLanguage } from "@/lib/i18n/LanguageContext";\nimport { LanguageSwitcher } from "@/components/LanguageSwitcher";`
        );
        
        content = content.replace(
            `export default function RegisterPage() {`,
            `export default function RegisterPage() {\n    const { t } = useLanguage();`
        );
        
        content = content.replace(
            `<Button \n                        onClick={() => router.push('/')}`,
            `<LanguageSwitcher />\n                    <Button \n                        onClick={() => router.push('/')}`
        );
        
        fs.writeFileSync('src/app/register/page.tsx', content);
        console.log('Register page updated');
    }
}

updateRegister();

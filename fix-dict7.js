const fs = require('fs');

const transFile = 'src/lib/i18n/translations.ts';

const dicts = [
    { // EN
        contactFamily: "Contact & Family",
        emergencyContactDesc: "Where can we reach you, and who is your emergency contact?",
        emailLabel: "Email",
        mobileLabel: "Mobile",
        docUploadError: "Please upload all required documents (Personal Photo, Passport Copy, etc.)."
    },
    { // TR
        contactFamily: "İletişim ve Aile",
        emergencyContactDesc: "Size nereden ulaşabiliriz ve acil durumda ulaşılacak kişi kimdir?",
        emailLabel: "E-posta",
        mobileLabel: "Cep Telefonu",
        docUploadError: "Lütfen tüm gerekli belgeleri yükleyin (Kişisel Fotoğraf, Pasaport Kopyası vb.)."
    },
    { // AR
        contactFamily: "التواصل والعائلة",
        emergencyContactDesc: "أين يمكننا الوصول إليك، ومن هو جهة الاتصال في حالات الطوارئ؟",
        emailLabel: "البريد الإلكتروني",
        mobileLabel: "رقم الجوال",
        docUploadError: "يرجى تحميل جميع المستندات المطلوبة (صورة شخصية، نسخة من جواز السفر، إلخ)."
    },
    { // FR
        contactFamily: "Contact et Famille",
        emergencyContactDesc: "Où pouvons-nous vous joindre et qui est votre contact en cas d'urgence ?",
        emailLabel: "E-mail",
        mobileLabel: "Mobile",
        docUploadError: "Veuillez télécharger tous les documents requis (Photo personnelle, Copie de passeport, etc.)."
    },
    { // RU
        contactFamily: "Контакты и семья",
        emergencyContactDesc: "Где мы можем с вами связаться, и кто ваше контактное лицо для экстренных случаев?",
        emailLabel: "Электронная почта",
        mobileLabel: "Мобильный телефон",
        docUploadError: "Пожалуйста, загрузите все необходимые документы (Личное фото, Копия паспорта и т.д.)."
    }
];

let content = fs.readFileSync(transFile, 'utf8');

const parts = content.split('    register: {');

if (parts.length === 6) {
    let newContent = parts[0];
    for (let i = 1; i <= 5; i++) {
        const dict = dicts[i - 1];
        let injectStr = '    register: {\n';
        for (const [key, val] of Object.entries(dict)) {
            if (!parts[i].includes(`      ${key}:`)) {
                injectStr += `      ${key}: "${val.replace(/"/g, '\\"')}",\n`;
            }
        }
        newContent += injectStr + parts[i].trimStart();
    }
    fs.writeFileSync(transFile, newContent);
    console.log("SUCCESS");
} else {
    console.log("FAILED to split properly.");
}

const registerFile = 'src/app/register/page.tsx';
let regContent = fs.readFileSync(registerFile, 'utf8');

const reps = [
    { target: '>Contact & Family<', rep: '>{t(\'register.contactFamily\')}<' },
    { target: '>Where can we reach you, and who is your emergency contact?<', rep: '>{t(\'register.emergencyContactDesc\')}<' },
    { target: '>Email *<', rep: '>{t(\'register.emailLabel\')} *<' },
    { target: '>Mobile *<', rep: '>{t(\'register.mobileLabel\')} *<' },
    { target: 'setError("Please upload all required documents (Personal Photo, Passport Copy, etc.).");', rep: 'setError(t(\'register.docUploadError\'));' }
];

for(let r of reps) {
    regContent = regContent.replace(r.target, r.rep);
}

fs.writeFileSync(registerFile, regContent);
console.log("Done updating page.tsx");

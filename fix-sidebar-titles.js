const fs = require('fs');

const transFile = 'src/lib/i18n/translations.ts';
let content = fs.readFileSync(transFile, 'utf8');

const dicts = [
    { // EN (already exists, but we'll add it if missing just in case)
    },
    { // TR
        personal: "KİŞİSEL BİLGİLER",
        status: "DURUM BİLGİLERİ",
        identity: "KİMLİK & UYRUK",
        tomer: "TÖMER DETAYLARI",
        academic: "AKADEMİK HEDEF",
        highschool: "LİSE BİLGİLERİ",
        higher: "YÜKSEKÖĞRENİM",
        family: "AİLE BİLGİLERİ",
        address: "ADRES BİLGİLERİ"
    },
    { // AR
        personal: "المعلومات الشخصية",
        status: "معلومات الحالة",
        identity: "الهوية والجنسية",
        tomer: "تفاصيل تومر",
        academic: "الهدف الأكاديمي",
        highschool: "معلومات المدرسة الثانوية",
        higher: "التعليم العالي",
        family: "معلومات العائلة",
        address: "معلومات العنوان"
    },
    { // FR
        personal: "INFORMATIONS PERSONNELLES",
        status: "INFORMATIONS SUR LE STATUT",
        identity: "IDENTITÉ ET NATIONALITÉ",
        tomer: "DÉTAILS TÖMER",
        academic: "INTENTION ACADÉMIQUE",
        highschool: "INFORMATIONS SUR L'ÉCOLE SECONDAIRE",
        higher: "ENSEIGNEMENT SUPÉRIEUR",
        family: "INFORMATIONS FAMILIALES",
        address: "INFORMATIONS SUR L'ADRESSE"
    },
    { // RU
        personal: "ЛИЧНАЯ ИНФОРМАЦИЯ",
        status: "ИНФОРМАЦИЯ О СТАТУСЕ",
        identity: "ЛИЧНОСТЬ И ГРАЖДАНСТВО",
        tomer: "ДЕТАЛИ TÖMER",
        academic: "АКАДЕМИЧЕСКОЕ НАМЕРЕНИЕ",
        highschool: "ИНФОРМАЦИЯ О СРЕДНЕЙ ШКОЛЕ",
        higher: "ВЫСШЕЕ ОБРАЗОВАНИЕ",
        family: "ИНФОРМАЦИЯ О СЕМЬЕ",
        address: "ИНФОРМАЦИЯ ОБ АДРЕСЕ"
    }
];

const parts = content.split('    sidebar: {');

if (parts.length === 6) {
    let newContent = parts[0];
    for (let i = 1; i <= 5; i++) {
        const dict = dicts[i - 1];
        let injectStr = '    sidebar: {\n';
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
    console.log("FAILED to split properly: " + parts.length);
}

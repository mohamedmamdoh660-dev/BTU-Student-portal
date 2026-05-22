const fs = require('fs');

const transFile = 'src/lib/i18n/translations.ts';
let content = fs.readFileSync(transFile, 'utf8');

const keysToRemove = [
    'personal', 'status', 'identity', 'tomer', 'academic', 
    'highschool', 'higher', 'family', 'address'
];

// Remove all lines that contain these keys in the sidebar block
const lines = content.split('\n');
const newLines = [];
let inSidebar = false;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.includes('    sidebar: {')) {
        inSidebar = true;
        newLines.push(line);
        continue;
    }
    
    if (inSidebar && line.includes('    },')) {
        inSidebar = false;
        newLines.push(line);
        continue;
    }
    
    if (inSidebar) {
        // Check if line starts with any of the keys
        const trimmed = line.trim();
        let isBadKey = false;
        for (const key of keysToRemove) {
            if (trimmed.startsWith(key + ':')) {
                isBadKey = true;
                break;
            }
        }
        if (!isBadKey) {
            // Also fix indentation of lines that lost it
            if (trimmed !== '' && !line.startsWith('      ')) {
                newLines.push('      ' + trimmed);
            } else {
                newLines.push(line);
            }
        }
    } else {
        newLines.push(line);
    }
}

content = newLines.join('\n');

const dicts = [
    { // EN
        personal: "PERSONAL INFORMATION",
        status: "STATUS INFORMATION",
        identity: "IDENTITY & NATIONALITY",
        tomer: "TÖMER DETAILS",
        academic: "ACADEMIC INTENT",
        highschool: "HIGH SCHOOL INFORMATION",
        higher: "HIGHER EDUCATION",
        family: "FAMILY INFORMATION",
        address: "ADDRESS INFORMATION"
    },
    { // TR
        personal: "KİŞİSEL BİLGİLER",
        status: "DURUM BİLGİSİ",
        identity: "KİMLİK & UYRUK",
        tomer: "TÖMER BİLGİLERİ",
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

const parts = content.split('    sidebar: {\n');

if (parts.length === 6) {
    let finalContent = parts[0];
    for (let i = 1; i <= 5; i++) {
        const dict = dicts[i - 1];
        let injectStr = '    sidebar: {\n';
        for (const [key, val] of Object.entries(dict)) {
            injectStr += `      ${key}: "${val.replace(/"/g, '\\"')}",\n`;
        }
        finalContent += injectStr + parts[i];
    }
    fs.writeFileSync(transFile, finalContent);
    console.log("SUCCESS CLEANUP AND INJECT");
} else {
    console.log("FAILED to split properly: " + parts.length);
}

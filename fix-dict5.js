const fs = require('fs');

const transFile = 'src/lib/i18n/translations.ts';

const trDict = {
    addressInfo: "Adres Bilgileri",
    addressLineLabel: "Adres Satırı",
    familyInfo: "Aile Bilgileri",
    fatherPhoneLabel: "Baba Telefon",
    motherPhoneLabel: "Anne Telefon",
    academicBackground: "Akademik Geçmiş",
    academicDesc: "Program uygunluğunu belirlememize yardımcı olmak için eğitim geçmişinizi girin.",
    currentEducationLevel: "Mevcut Eğitim Seviyesi",
    highSchoolDetails: "Lise Bilgileri",
    diplomaGradeExample: "Diploma Notu (örn. 85.5)",
    trYosDegree: "TR-YÖS Puanı",
    satDegreeLabel: "SAT Puanı",
    diplomaDegreeLabel: "Diploma Notu",
    hasTomerLabel: "TÖMER Belgeniz var mı?",
    bachelorDetails: "Lisans Bilgileri",
    universityName: "Üniversite Adı",
    gpaExample32: "GPA (örn. 3.2)",
    masterDetails: "Yüksek Lisans Bilgileri",
    gpaExample35: "GPA (örn. 3.5)",
    docUploadDesc: "Lütfen gerekli tüm dosyaları yükleyin. Başvurunuza güvenli bir şekilde eklenecektir.",
    docPersonalPhoto: "Kişisel Fotoğraf",
    docPassportCopy: "Pasaport Kopyası",
    docHighSchoolCert: "Lise Diploması",
    docHighSchoolTrans: "Lise Transkripti"
};

const arDict = {
    addressInfo: "معلومات العنوان",
    addressLineLabel: "العنوان",
    familyInfo: "معلومات العائلة",
    fatherPhoneLabel: "هاتف الأب",
    motherPhoneLabel: "هاتف الأم",
    academicBackground: "الخلفية الأكاديمية",
    academicDesc: "قدم تاريخك التعليمي لمساعدتنا في تحديد الأهلية للبرنامج.",
    currentEducationLevel: "المستوى التعليمي الحالي",
    highSchoolDetails: "تفاصيل المدرسة الثانوية",
    diplomaGradeExample: "درجة الدبلوم (مثال: 85.5)",
    trYosDegree: "درجة TR-YÖS",
    satDegreeLabel: "درجة SAT",
    diplomaDegreeLabel: "درجة الدبلوم",
    hasTomerLabel: "هل لديك شهادة تومر؟",
    bachelorDetails: "تفاصيل البكالوريوس",
    universityName: "اسم الجامعة",
    gpaExample32: "المعدل (مثال: 3.2)",
    masterDetails: "تفاصيل الماجستير",
    gpaExample35: "المعدل (مثال: 3.5)",
    docUploadDesc: "يرجى تحميل جميع الملفات المطلوبة. سيتم إرفاقها بطلبك بأمان.",
    docPersonalPhoto: "صورة شخصية",
    docPassportCopy: "صورة الجواز",
    docHighSchoolCert: "شهادة الثانوية",
    docHighSchoolTrans: "كشف درجات الثانوية"
};

const frDict = {
    addressInfo: "Informations d'adresse",
    addressLineLabel: "Ligne d'adresse",
    familyInfo: "Informations familiales",
    fatherPhoneLabel: "Téléphone du père",
    motherPhoneLabel: "Téléphone de la mère",
    academicBackground: "Parcours académique",
    academicDesc: "Fournissez votre historique éducatif pour nous aider à déterminer votre admissibilité au programme.",
    currentEducationLevel: "Niveau d'éducation actuel",
    highSchoolDetails: "Détails du lycée",
    diplomaGradeExample: "Note du diplôme (ex: 85.5)",
    trYosDegree: "Note TR-YÖS",
    satDegreeLabel: "Note SAT",
    diplomaDegreeLabel: "Note du diplôme",
    hasTomerLabel: "Avez-vous le TÖMER ?",
    bachelorDetails: "Détails de la licence",
    universityName: "Nom de l'université",
    gpaExample32: "GPA (ex: 3.2)",
    masterDetails: "Détails du master",
    gpaExample35: "GPA (ex: 3.5)",
    docUploadDesc: "Veuillez télécharger tous les fichiers requis. Ils seront joints en toute sécurité à votre candidature.",
    docPersonalPhoto: "Photo personnelle",
    docPassportCopy: "Copie du passeport",
    docHighSchoolCert: "Diplôme d'études secondaires",
    docHighSchoolTrans: "Relevé de notes du lycée"
};

const ruDict = {
    addressInfo: "Адресная информация",
    addressLineLabel: "Адрес",
    familyInfo: "Информация о семье",
    fatherPhoneLabel: "Телефон отца",
    motherPhoneLabel: "Телефон матери",
    academicBackground: "Академическое образование",
    academicDesc: "Укажите историю своего образования, чтобы мы могли определить соответствие требованиям программы.",
    currentEducationLevel: "Текущий уровень образования",
    highSchoolDetails: "Данные о средней школе",
    diplomaGradeExample: "Оценка в аттестате (например, 85.5)",
    trYosDegree: "Балл TR-YÖS",
    satDegreeLabel: "Балл SAT",
    diplomaDegreeLabel: "Балл аттестата",
    hasTomerLabel: "У вас есть TÖMER?",
    bachelorDetails: "Данные о бакалавриате",
    universityName: "Название университета",
    gpaExample32: "GPA (например, 3.2)",
    masterDetails: "Данные о магистратуре",
    gpaExample35: "GPA (например, 3.5)",
    docUploadDesc: "Пожалуйста, загрузите все необходимые файлы. Они будут надежно прикреплены к вашей заявке.",
    docPersonalPhoto: "Личное фото",
    docPassportCopy: "Копия паспорта",
    docHighSchoolCert: "Аттестат об окончании средней школы",
    docHighSchoolTrans: "Табель успеваемости за среднюю школу"
};

const enDict = {
    addressInfo: "Address Information",
    addressLineLabel: "Address Line",
    familyInfo: "Family Information",
    fatherPhoneLabel: "Father's Phone",
    motherPhoneLabel: "Mother's Phone",
    academicBackground: "Academic Background",
    academicDesc: "Provide your educational history to help us determine program eligibility.",
    currentEducationLevel: "Current Education Level",
    highSchoolDetails: "High School Details",
    diplomaGradeExample: "Diploma Grade (e.g. 85.5)",
    trYosDegree: "TR-YÖS Degree",
    satDegreeLabel: "SAT Degree",
    diplomaDegreeLabel: "Diploma Degree",
    hasTomerLabel: "Has TOMER?",
    bachelorDetails: "Bachelor's Details",
    universityName: "University Name",
    gpaExample32: "GPA (e.g. 3.2)",
    masterDetails: "Master's Details",
    gpaExample35: "GPA (e.g. 3.5)",
    docUploadDesc: "Please upload all required files. They will be securely attached to your application.",
    docPersonalPhoto: "Personal Photo",
    docPassportCopy: "Passport Copy",
    docHighSchoolCert: "High School Certificate",
    docHighSchoolTrans: "High School Transcript"
};

let content = fs.readFileSync(transFile, 'utf8');

function injectRegex(content, locale, dictData) {
    const localeRegex = new RegExp(`^\\s*${locale}:\\s*{[\\s\\S]*?^\\s*},?\\s*$`, 'm');
    const localeMatch = content.match(localeRegex);
    if (!localeMatch) return content;
    let localeContent = localeMatch[0];

    const registerRegex = /register:\s*{/;
    const regMatch = localeContent.match(registerRegex);
    if (!regMatch) return content;

    let injectStr = 'register: {\n';
    for (const [key, val] of Object.entries(dictData)) {
        if (!localeContent.includes(key + ':')) {
            injectStr += `      ${key}: "${val.replace(/"/g, '\\"')}",\n`;
        }
    }

    localeContent = localeContent.replace(registerRegex, injectStr);
    return content.replace(localeRegex, localeContent);
}

content = injectRegex(content, 'en', enDict);
content = injectRegex(content, 'tr', trDict);
content = injectRegex(content, 'ar', arDict);
content = injectRegex(content, 'fr', frDict);
content = injectRegex(content, 'ru', ruDict);

fs.writeFileSync(transFile, content);

// Now update page.tsx
const registerFile = 'src/app/register/page.tsx';
let regContent = fs.readFileSync(registerFile, 'utf8');

const reps = [
    { target: '>Address Information<', rep: '>{t(\'register.addressInfo\')}<' },
    { target: '>Address Line<', rep: '>{t(\'register.addressLineLabel\')}<' },
    { target: '>Family Information<', rep: '>{t(\'register.familyInfo\')}<' },
    { target: '>Father\'s Phone<', rep: '>{t(\'register.fatherPhoneLabel\')}<' },
    { target: '>Mother\'s Phone<', rep: '>{t(\'register.motherPhoneLabel\')}<' },
    { target: '>Academic Background<', rep: '>{t(\'register.academicBackground\')}<' },
    { target: '>Provide your educational history to help us determine program eligibility.<', rep: '>{t(\'register.academicDesc\')}<' },
    { target: '>Current Education Level *<', rep: '>{t(\'register.currentEducationLevel\')} *<' },
    { target: '>High School Details<', rep: '>{t(\'register.highSchoolDetails\')}<' },
    { target: '>Diploma Grade (e.g. 85.5) *<', rep: '>{t(\'register.diplomaGradeExample\')} *<' },
    { target: '>TR-YÖS Degree *<', rep: '>{t(\'register.trYosDegree\')} *<' },
    { target: '>SAT Degree *<', rep: '>{t(\'register.satDegreeLabel\')} *<' },
    { target: '>Diploma Degree *<', rep: '>{t(\'register.diplomaDegreeLabel\')} *<' },
    { target: '>Has TOMER? *<', rep: '>{t(\'register.hasTomerLabel\')} *<' },
    { target: '>Bachelor\'s Details<', rep: '>{t(\'register.bachelorDetails\')}<' },
    { target: '>University Name<', rep: '>{t(\'register.universityName\')}<' },
    { target: '>GPA (e.g. 3.2)<', rep: '>{t(\'register.gpaExample32\')}<' },
    { target: '>Master\'s Details<', rep: '>{t(\'register.masterDetails\')}<' },
    { target: '>GPA (e.g. 3.5)<', rep: '>{t(\'register.gpaExample35\')}<' },
    { target: '>Please upload all required files. They will be securely attached to your application.<', rep: '>{t(\'register.docUploadDesc\')}<' },
    { target: 'label="Personal Photo"', rep: 'label={t(\'register.docPersonalPhoto\')}' },
    { target: 'label="Passport Copy"', rep: 'label={t(\'register.docPassportCopy\')}' },
    { target: 'label="High School Certificate"', rep: 'label={t(\'register.docHighSchoolCert\')}' },
    { target: 'label="High School Transcript"', rep: 'label={t(\'register.docHighSchoolTrans\')}' }
];

for(let r of reps) {
    regContent = regContent.replace(r.target, r.rep);
}

fs.writeFileSync(registerFile, regContent);
console.log("Missing strings translated!");

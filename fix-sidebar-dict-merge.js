const fs = require('fs');

const transFile = 'src/lib/i18n/translations.ts';

const dicts = [
    { // EN
        fieldFirstName: "FIRST NAME",
        fieldLastName: "LAST NAME",
        fieldEmail: "EMAIL ADDRESS",
        fieldMobile: "MOBILE NUMBER",
        fieldGender: "GENDER",
        fieldDob: "DATE OF BIRTH",
        fieldAppStatus: "APPLICATION STATUS",
        fieldNationality: "NATIONALITY",
        fieldPassport: "PASSPORT NUMBER",
        fieldPassIssue: "PASSPORT ISSUE",
        fieldPassExpiry: "PASSPORT EXPIRY",
        fieldTc: "TC NUMBER",
        fieldHasTomer: "HAS TÖMER",
        fieldEdLevel: "EDUCATION LEVEL",
        fieldCountry: "COUNTRY",
        fieldSchoolName: "SCHOOL NAME",
        fieldSchoolType: "SCHOOL TYPE",
        fieldGpa: "GPA",
        fieldBachSchool: "BACHELOR SCHOOL",
        fieldBachGpa: "BACHELOR GPA",
        fieldMasterSchool: "MASTER SCHOOL",
        fieldMasterGpa: "MASTER GPA",
        fieldFatherName: "FATHER NAME",
        fieldFatherMobile: "FATHER MOBILE",
        fieldMotherName: "MOTHER NAME",
        fieldMotherMobile: "MOTHER MOBILE",
        fieldState: "STATE / PROVINCE",
        fieldCity: "CITY / DISTRICT",
        fieldAddressLine: "ADDRESS LINE",
        fieldPostal: "POSTAL CODE",

        valNotProvided: "Not provided",
        valApplicant: "Applicant",
        valNA: "N/A",
        valNo: "No",
        valNotSpecified: "Not specified",
        valNoProfile: "No student profile found. Please login."
    },
    { // TR
        fieldFirstName: "AD",
        fieldLastName: "SOYAD",
        fieldEmail: "E-POSTA ADRESİ",
        fieldMobile: "CEP TELEFONU",
        fieldGender: "CİNSİYET",
        fieldDob: "DOĞUM TARİHİ",
        fieldAppStatus: "BAŞVURU DURUMU",
        fieldNationality: "UYRUK",
        fieldPassport: "PASAPORT NUMARASI",
        fieldPassIssue: "PASAPORT VERİLİŞ",
        fieldPassExpiry: "PASAPORT BİTİŞ",
        fieldTc: "TC KİMLİK NUMARASI",
        fieldHasTomer: "TÖMER VAR MI",
        fieldEdLevel: "EĞİTİM SEVİYESİ",
        fieldCountry: "ÜLKE",
        fieldSchoolName: "OKUL ADI",
        fieldSchoolType: "OKUL TÜRÜ",
        fieldGpa: "NOT ORTALAMASI",
        fieldBachSchool: "LİSANS ÜNİVERSİTESİ",
        fieldBachGpa: "LİSANS NOT ORTALAMASI",
        fieldMasterSchool: "YÜKSEK LİSANS ÜNİVERSİTESİ",
        fieldMasterGpa: "YÜKSEK LİSANS NOT ORTALAMASI",
        fieldFatherName: "BABA ADI",
        fieldFatherMobile: "BABA TELEFON",
        fieldMotherName: "ANNE ADI",
        fieldMotherMobile: "ANNE TELEFON",
        fieldState: "EYALET / BÖLGE",
        fieldCity: "İL / İLÇE",
        fieldAddressLine: "ADRES SATIRI",
        fieldPostal: "POSTA KODU",

        valNotProvided: "Sağlanmadı",
        valApplicant: "Aday",
        valNA: "Bilinmiyor",
        valNo: "Hayır",
        valNotSpecified: "Belirtilmedi",
        valNoProfile: "Öğrenci profili bulunamadı. Lütfen giriş yapın."
    },
    { // AR
        fieldFirstName: "الاسم الأول",
        fieldLastName: "اسم العائلة",
        fieldEmail: "البريد الإلكتروني",
        fieldMobile: "رقم الجوال",
        fieldGender: "الجنس",
        fieldDob: "تاريخ الميلاد",
        fieldAppStatus: "حالة الطلب",
        fieldNationality: "الجنسية",
        fieldPassport: "رقم جواز السفر",
        fieldPassIssue: "تاريخ الإصدار",
        fieldPassExpiry: "تاريخ الانتهاء",
        fieldTc: "رقم الهوية التركية",
        fieldHasTomer: "شهادة تومر",
        fieldEdLevel: "مستوى التعليم",
        fieldCountry: "الدولة",
        fieldSchoolName: "اسم المدرسة",
        fieldSchoolType: "نوع المدرسة",
        fieldGpa: "المعدل التراكمي",
        fieldBachSchool: "جامعة البكالوريوس",
        fieldBachGpa: "معدل البكالوريوس",
        fieldMasterSchool: "جامعة الماجستير",
        fieldMasterGpa: "معدل الماجستير",
        fieldFatherName: "اسم الأب",
        fieldFatherMobile: "جوال الأب",
        fieldMotherName: "اسم الأم",
        fieldMotherMobile: "جوال الأم",
        fieldState: "الولاية / المقاطعة",
        fieldCity: "المدينة / الحي",
        fieldAddressLine: "العنوان",
        fieldPostal: "الرمز البريدي",

        valNotProvided: "غير متوفر",
        valApplicant: "متقدم",
        valNA: "لا ينطبق",
        valNo: "لا",
        valNotSpecified: "غير محدد",
        valNoProfile: "لم يتم العثور على ملف تعريف الطالب. يرجى تسجيل الدخول."
    },
    { // FR
        fieldFirstName: "PRÉNOM",
        fieldLastName: "NOM DE FAMILLE",
        fieldEmail: "ADRESSE E-MAIL",
        fieldMobile: "NUMÉRO DE TÉLÉPHONE",
        fieldGender: "GENRE",
        fieldDob: "DATE DE NAISSANCE",
        fieldAppStatus: "STATUT DE LA DEMANDE",
        fieldNationality: "NATIONALITÉ",
        fieldPassport: "NUMÉRO DE PASSEPORT",
        fieldPassIssue: "DATE DE DÉLIVRANCE",
        fieldPassExpiry: "DATE D'EXPIRATION",
        fieldTc: "NUMÉRO TC",
        fieldHasTomer: "A TÖMER",
        fieldEdLevel: "NIVEAU D'ÉDUCATION",
        fieldCountry: "PAYS",
        fieldSchoolName: "NOM DE L'ÉCOLE",
        fieldSchoolType: "TYPE D'ÉCOLE",
        fieldGpa: "MOYENNE",
        fieldBachSchool: "ÉCOLE DE LICENCE",
        fieldBachGpa: "MOYENNE DE LICENCE",
        fieldMasterSchool: "ÉCOLE DE MASTER",
        fieldMasterGpa: "MOYENNE DE MASTER",
        fieldFatherName: "NOM DU PÈRE",
        fieldFatherMobile: "MOBILE DU PÈRE",
        fieldMotherName: "NOM DE LA MÈRE",
        fieldMotherMobile: "MOBILE DE LA MÈRE",
        fieldState: "ÉTAT / PROVINCE",
        fieldCity: "VILLE / QUARTIER",
        fieldAddressLine: "LIGNE D'ADRESSE",
        fieldPostal: "CODE POSTAL",

        valNotProvided: "Non fourni",
        valApplicant: "Candidat",
        valNA: "N/A",
        valNo: "Non",
        valNotSpecified: "Non spécifié",
        valNoProfile: "Aucun profil étudiant trouvé. Veuillez vous connecter."
    },
    { // RU
        fieldFirstName: "ИМЯ",
        fieldLastName: "ФАМИЛИЯ",
        fieldEmail: "АДРЕС ЭЛЕКТРОННОЙ ПОЧТЫ",
        fieldMobile: "НОМЕР МОБИЛЬНОГО ТЕЛЕФОНА",
        fieldGender: "ПОЛ",
        fieldDob: "ДАТА РОЖДЕНИЯ",
        fieldAppStatus: "СТАТУС ЗАЯВКИ",
        fieldNationality: "ГРАЖДАНСТВО",
        fieldPassport: "НОМЕР ПАСПОРТА",
        fieldPassIssue: "ДАТА ВЫДАЧИ ПАСПОРТА",
        fieldPassExpiry: "ДАТА ОКОНЧАНИЯ ПАСПОРТА",
        fieldTc: "НОМЕР TC",
        fieldHasTomer: "ЕСТЬ TÖMER",
        fieldEdLevel: "УРОВЕНЬ ОБРАЗОВАНИЯ",
        fieldCountry: "СТРАНА",
        fieldSchoolName: "НАЗВАНИЕ ШКОЛЫ",
        fieldSchoolType: "ТИП ШКОЛЫ",
        fieldGpa: "СРЕДНИЙ БАЛЛ",
        fieldBachSchool: "УНИВЕРСИТЕТ БАКАЛАВРИАТА",
        fieldBachGpa: "СРЕДНИЙ БАЛЛ БАКАЛАВРИАТА",
        fieldMasterSchool: "УНИВЕРСИТЕТ МАГИСТРАТУРЫ",
        fieldMasterGpa: "СРЕДНИЙ БАЛЛ МАГИСТРАТУРЫ",
        fieldFatherName: "ИМЯ ОТЦА",
        fieldFatherMobile: "ТЕЛЕФОН ОТЦА",
        fieldMotherName: "ИМЯ МАТЕРИ",
        fieldMotherMobile: "ТЕЛЕФОН МАТЕРИ",
        fieldState: "ШТАТ / ПРОВИНЦИЯ",
        fieldCity: "ГОРОД / РАЙОН",
        fieldAddressLine: "АДРЕСНАЯ СТРОКА",
        fieldPostal: "ПОЧТОВЫЙ ИНДЕКС",

        valNotProvided: "Не предоставлено",
        valApplicant: "Кандидат",
        valNA: "Н/Д",
        valNo: "Нет",
        valNotSpecified: "Не указано",
        valNoProfile: "Профиль студента не найден. Пожалуйста, войдите."
    }
];

let content = fs.readFileSync(transFile, 'utf8');

// First remove my previously injected `sidebar: { ... }` block that was placed right before `register: {`
const badSidebarRegex = /    sidebar: \{\n      secPersonal:(?:[\s\S]*?)    \},\n    register: \{/g;
content = content.replace(badSidebarRegex, '    register: {');

// Now we need to append dict keys to the TOP `sidebar: {` block
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

const fs = require('fs');

const transFile = 'src/lib/i18n/translations.ts';

const trDict = {
    step1Desc: "Lütfen resmi kimlik bilgilerinizi pasaportunuzda göründüğü gibi sağlayın.",
    step2Desc: "Size ulaşabilmemiz ve acil durumlar için bu bilgilere ihtiyacımız var.",
    step3Desc: "Lütfen eğitim geçmişi bilgilerinizi sağlayın.",
    step4Desc: "Lütfen belgelerinizin net ve okunaklı kopyalarını yükleyin.",
    haveTc: "T.C. Vatandaşı mısınız?",
    blueCard: "Mavi Kartınız var mı?",
    tcNumber: "T.C. Kimlik Numarası",
    gender: "Cinsiyet",
    dateOfBirth: "Doğum Tarihi",
    nationality: "Uyruk",
    passportIssueDate: "Pasaport Veriliş Tarihi",
    passportExpiryDate: "Pasaport Bitiş Tarihi",
    addressLine1: "Adres Satırı 1",
    cityDistrict: "İl / İlçe",
    stateProvince: "Eyalet / Bölge",
    postalCode: "Posta Kodu",
    country: "Ülke",
    fatherName: "Baba Adı",
    fatherMobile: "Baba Telefon",
    fatherOccupation: "Baba Mesleği",
    motherName: "Anne Adı",
    motherMobile: "Anne Telefon",
    motherOccupation: "Anne Mesleği",
    educationLevel: "Eğitim Seviyesi",
    hasTomer: "TÖMER Belgeniz var mı?",
    highSchoolName: "Lise Adı",
    highSchoolCountry: "Lise Ülkesi",
    highSchoolType: "Lise Türü",
    yosDegree: "YÖS Puanı",
    satDegree: "SAT Puanı",
    diplomaDegree: "Diploma Notu",
    highSchoolGpa: "Lise Not Ortalaması (GPA)",
    bachelorSchoolName: "Lisans Üniversite Adı",
    bachelorCountry: "Lisans Ülkesi",
    bachelorGpa: "Lisans Not Ortalaması (GPA)",
    masterSchoolName: "Yüksek Lisans Üniversite Adı",
    masterCountry: "Yüksek Lisans Ülkesi",
    masterGpa: "Yüksek Lisans Not Ortalaması (GPA)",
    yes: "Evet",
    no: "Hayır",
    selectGender: "Cinsiyet Seçin",
    male: "Erkek",
    female: "Kadın",
    selectCountry: "Ülke Seçin",
    selectLevel: "Seviye Seçin",
    createAccount: "Hesap Oluştur",
    candidateReg: "Aday Kaydı",
    backToLogin: "Girişe Dön",
    personalIdentity: "Kişisel Kimlik",
    contactFamily: "İletişim ve Aile",
    educationDetails: "Eğitim Bilgileri",
    documentUpload: "Belge Yükleme"
};

const arDict = {
    step1Desc: "يرجى تقديم تفاصيل هويتك الرسمية تمامًا كما تظهر في جواز سفرك.",
    step2Desc: "نحتاج إلى هذه المعلومات للوصول إليك وللاتصال في حالات الطوارئ.",
    step3Desc: "يرجى تقديم تفاصيل خلفيتك التعليمية.",
    step4Desc: "يرجى تحميل نسخ واضحة ومقروءة من مستنداتك.",
    haveTc: "هل لديك جنسية تركية؟",
    blueCard: "هل لديك البطاقة الزرقاء؟",
    tcNumber: "رقم الهوية التركية (T.C.)",
    gender: "الجنس",
    dateOfBirth: "تاريخ الميلاد",
    nationality: "الجنسية",
    passportIssueDate: "تاريخ إصدار الجواز",
    passportExpiryDate: "تاريخ انتهاء الجواز",
    addressLine1: "العنوان",
    cityDistrict: "المدينة / المقاطعة",
    stateProvince: "الولاية / المنطقة",
    postalCode: "الرمز البريدي",
    country: "الدولة",
    fatherName: "اسم الأب",
    fatherMobile: "رقم جوال الأب",
    fatherOccupation: "مهنة الأب",
    motherName: "اسم الأم",
    motherMobile: "رقم جوال الأم",
    motherOccupation: "مهنة الأم",
    educationLevel: "المستوى التعليمي",
    hasTomer: "هل لديك شهادة تومر؟",
    highSchoolName: "اسم المدرسة الثانوية",
    highSchoolCountry: "دولة المدرسة الثانوية",
    highSchoolType: "نوع المدرسة الثانوية",
    yosDegree: "درجة اليوس (YÖS)",
    satDegree: "درجة السات (SAT)",
    diplomaDegree: "درجة الدبلوم",
    highSchoolGpa: "المعدل التراكمي للثانوية",
    bachelorSchoolName: "اسم جامعة البكالوريوس",
    bachelorCountry: "دولة البكالوريوس",
    bachelorGpa: "المعدل التراكمي للبكالوريوس",
    masterSchoolName: "اسم جامعة الماجستير",
    masterCountry: "دولة الماجستير",
    masterGpa: "المعدل التراكمي للماجستير",
    yes: "نعم",
    no: "لا",
    selectGender: "اختر الجنس",
    male: "ذكر",
    female: "أنثى",
    selectCountry: "اختر الدولة",
    selectLevel: "اختر المستوى",
    createAccount: "إنشاء حساب",
    candidateReg: "تسجيل مرشح",
    backToLogin: "العودة لتسجيل الدخول",
    personalIdentity: "الهوية الشخصية",
    contactFamily: "الاتصال والعائلة",
    educationDetails: "تفاصيل التعليم",
    documentUpload: "رفع المستندات"
};

const frDict = {
    step1Desc: "Veuillez fournir vos informations d'identité officielles exactement telles qu'elles apparaissent sur votre passeport.",
    step2Desc: "Nous avons besoin de ces informations pour vous joindre et pour les contacts d'urgence.",
    step3Desc: "Veuillez fournir les détails de votre parcours scolaire.",
    step4Desc: "Veuillez télécharger des copies claires et lisibles de vos documents.",
    haveTc: "Avez-vous la citoyenneté turque ?",
    blueCard: "Avez-vous la carte bleue ?",
    tcNumber: "Numéro T.C.",
    gender: "Sexe",
    dateOfBirth: "Date de naissance",
    nationality: "Nationalité",
    passportIssueDate: "Date de délivrance du passeport",
    passportExpiryDate: "Date d'expiration du passeport",
    addressLine1: "Adresse Ligne 1",
    cityDistrict: "Ville / Quartier",
    stateProvince: "État / Province",
    postalCode: "Code Postal",
    country: "Pays",
    fatherName: "Nom du père",
    fatherMobile: "Mobile du père",
    fatherOccupation: "Profession du père",
    motherName: "Nom de la mère",
    motherMobile: "Mobile de la mère",
    motherOccupation: "Profession de la mère",
    educationLevel: "Niveau d'éducation",
    hasTomer: "Avez-vous le TÖMER ?",
    highSchoolName: "Nom du lycée",
    highSchoolCountry: "Pays du lycée",
    highSchoolType: "Type de lycée",
    yosDegree: "Note YÖS",
    satDegree: "Note SAT",
    diplomaDegree: "Note du Diplôme",
    highSchoolGpa: "Moyenne du lycée (GPA)",
    bachelorSchoolName: "Nom de l'université (Licence)",
    bachelorCountry: "Pays de la Licence",
    bachelorGpa: "Moyenne de la Licence",
    masterSchoolName: "Nom de l'université (Master)",
    masterCountry: "Pays du Master",
    masterGpa: "Moyenne du Master",
    yes: "Oui",
    no: "Non",
    selectGender: "Sélectionnez le sexe",
    male: "Homme",
    female: "Femme",
    selectCountry: "Sélectionnez le pays",
    selectLevel: "Sélectionnez le niveau",
    createAccount: "Créer un compte",
    candidateReg: "Inscription Candidat",
    backToLogin: "Retour à la connexion",
    personalIdentity: "Identité personnelle",
    contactFamily: "Contact & Famille",
    educationDetails: "Détails de l'éducation",
    documentUpload: "Téléchargement de documents"
};

const ruDict = {
    step1Desc: "Пожалуйста, предоставьте официальные данные о личности точно так, как они указаны в паспорте.",
    step2Desc: "Нам нужна эта информация, чтобы связаться с вами и для экстренных контактов.",
    step3Desc: "Пожалуйста, предоставьте информацию о вашем образовании.",
    step4Desc: "Пожалуйста, загрузите четкие и разборчивые копии ваших документов.",
    haveTc: "Есть ли гражданство Турции?",
    blueCard: "Есть ли Синяя карта?",
    tcNumber: "Номер T.C.",
    gender: "Пол",
    dateOfBirth: "Дата рождения",
    nationality: "Гражданство",
    passportIssueDate: "Дата выдачи паспорта",
    passportExpiryDate: "Дата окончания паспорта",
    addressLine1: "Адрес",
    cityDistrict: "Город / Район",
    stateProvince: "Штат / Провинция",
    postalCode: "Почтовый индекс",
    country: "Страна",
    fatherName: "Имя отца",
    fatherMobile: "Мобильный отца",
    fatherOccupation: "Профессия отца",
    motherName: "Имя матери",
    motherMobile: "Мобильный матери",
    motherOccupation: "Профессия матери",
    educationLevel: "Уровень образования",
    hasTomer: "У вас есть TÖMER?",
    highSchoolName: "Название средней школы",
    highSchoolCountry: "Страна школы",
    highSchoolType: "Тип школы",
    yosDegree: "Балл YÖS",
    satDegree: "Балл SAT",
    diplomaDegree: "Балл аттестата",
    highSchoolGpa: "Средний балл школы (GPA)",
    bachelorSchoolName: "Название университета (Бакалавриат)",
    bachelorCountry: "Страна Бакалавриата",
    bachelorGpa: "Средний балл Бакалавриата",
    masterSchoolName: "Название университета (Магистратура)",
    masterCountry: "Страна Магистратуры",
    masterGpa: "Средний балл Магистратуры",
    yes: "Да",
    no: "Нет",
    selectGender: "Выберите пол",
    male: "Мужской",
    female: "Женский",
    selectCountry: "Выберите страну",
    selectLevel: "Выберите уровень",
    createAccount: "Создать аккаунт",
    candidateReg: "Регистрация кандидата",
    backToLogin: "Вернуться ко входу",
    personalIdentity: "Личные данные",
    contactFamily: "Контакты и Семья",
    educationDetails: "Данные об образовании",
    documentUpload: "Загрузка документов"
};

let transContent = fs.readFileSync(transFile, 'utf8');

function manualInject(content, locale, dictData) {
    const lines = content.split('\\n');
    let output = [];
    let inLocale = false;
    let inRegister = false;
    let injected = false;
    
    // We want to accumulate existing keys in this register block
    let existingKeys = new Set();
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        if (line.match(new RegExp('^\\s*' + locale + ':\\s*{'))) {
            inLocale = true;
        }
        
        if (inLocale && line.match(/^\\s*register:\s*{/)) {
            inRegister = true;
            output.push(line);
            
            // Look ahead to see what keys exist in THIS register block
            for (let j = i + 1; j < lines.length; j++) {
                if (lines[j].match(/^\\s*},?$/)) break;
                const match = lines[j].match(/^\\s*([a-zA-Z0-9_]+):/);
                if (match) existingKeys.add(match[1]);
            }
            
            // Inject here
            if (!injected) {
                for(let key in dictData) {
                    if(!existingKeys.has(key)) {
                        output.push(`      ${key}: "${dictData[key].replace(/"/g, '\\\\"')}",`);
                    }
                }
                injected = true;
            }
            continue;
        }
        
        if (inLocale && line.match(/^\\s*},?$/) && inRegister) {
            inRegister = false;
        }
        
        if (inLocale && line.match(/^\\s*},?$/) && !inRegister && line.trim() === '},') {
            inLocale = false;
        }
        
        output.push(line);
    }
    return output.join('\\n');
}

transContent = manualInject(transContent, 'tr', trDict);
transContent = manualInject(transContent, 'ar', arDict);
transContent = manualInject(transContent, 'fr', frDict);
transContent = manualInject(transContent, 'ru', ruDict);

fs.writeFileSync(transFile, transContent);
console.log('Translations dictionary fixed properly!');

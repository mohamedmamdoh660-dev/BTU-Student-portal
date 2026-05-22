const fs = require('fs');
const path = require('path');

const registerFile = 'src/app/register/page.tsx';
const transFile = 'src/lib/i18n/translations.ts';

let registerContent = fs.readFileSync(registerFile, 'utf8');

// The new terms we want to translate
const dictionary = {
    step1Desc: "Please provide your official identification details exactly as they appear on your passport.",
    step2Desc: "We need this information to reach you and for emergency contacts.",
    step3Desc: "Please provide your educational background details.",
    step4Desc: "Please upload clear and legible copies of your documents.",
    haveTc: "Have Turkish T.C.?",
    blueCard: "Have Blue Card?",
    tcNumber: "T.C. Number",
    gender: "Gender",
    dateOfBirth: "Date of Birth",
    nationality: "Nationality",
    passportIssueDate: "Passport Issue Date",
    passportExpiryDate: "Passport Expiry Date",
    addressLine1: "Address Line 1",
    cityDistrict: "City / District",
    stateProvince: "State / Province",
    postalCode: "Postal Code",
    country: "Country",
    fatherName: "Father's Name",
    fatherMobile: "Father's Mobile",
    fatherOccupation: "Father's Occupation",
    motherName: "Mother's Name",
    motherMobile: "Mother's Mobile",
    motherOccupation: "Mother's Occupation",
    educationLevel: "Education Level",
    hasTomer: "Do you have TÖMER?",
    highSchoolName: "High School Name",
    highSchoolCountry: "High School Country",
    highSchoolType: "High School Type",
    yosDegree: "YÖS Degree",
    satDegree: "SAT Degree",
    diplomaDegree: "Diploma Degree",
    highSchoolGpa: "High School GPA",
    bachelorSchoolName: "Bachelor School Name",
    bachelorCountry: "Bachelor Country",
    bachelorGpa: "Bachelor GPA",
    masterSchoolName: "Master School Name",
    masterCountry: "Master Country",
    masterGpa: "Master GPA",
    yes: "Yes",
    no: "No",
    selectGender: "Select Gender",
    male: "Male",
    female: "Female",
    selectCountry: "Select Country",
    selectLevel: "Select Level",
    createAccount: "Create Account",
    candidateReg: "Candidate Registration",
    backToLogin: "Back to Login",
    personalIdentity: "Personal Identity",
    contactFamily: "Contact & Family",
    educationDetails: "Education Details",
    documentUpload: "Document Upload"
};

// Turkish Translations (for new dictionary terms)
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

// Arabic Translations
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

// French Translations
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

// Russian Translations
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

// Function to inject new keys into each locale block
function injectDict(content, locale, dictData) {
    const regex = new RegExp(`(${locale}:\\s*{[\\s\\S]*?register:\\s*{)`);
    const match = content.match(regex);
    if(match) {
        let injections = [];
        for(let key in dictData) {
            if(!content.includes(`${key}:`)) {
                injections.push(`      ${key}: "${dictData[key]}"`);
            }
        }
        if(injections.length > 0) {
            content = content.replace(regex, `$1\n${injections.join(',\n')},`);
        }
    }
    return content;
}

transContent = injectDict(transContent, 'en', dictionary);
transContent = injectDict(transContent, 'tr', trDict);
transContent = injectDict(transContent, 'ar', arDict);
transContent = injectDict(transContent, 'fr', frDict);
transContent = injectDict(transContent, 'ru', ruDict);

fs.writeFileSync(transFile, transContent);
console.log('Translations dictionary updated.');

// Replace text in register file
// Using an array of literal replacements
const replacements = [
    { target: 'Create Account', key: 'createAccount' },
    { target: 'Candidate Registration', key: 'candidateReg' },
    { target: 'Back to Login', key: 'backToLogin' },
    { target: 'Personal Identity', key: 'personalIdentity' },
    { target: 'Please provide your official identification details exactly as they appear on your passport.', key: 'step1Desc' },
    { target: 'Have Turkish T.C.? *', key: 'haveTc' },
    { target: 'Have Blue Card? *', key: 'blueCard' },
    { target: 'T.C. Number *', key: 'tcNumber' },
    { target: 'First Name *', key: 'firstName' },
    { target: 'Last Name *', key: 'lastName' },
    { target: 'Gender *', key: 'gender' },
    { target: 'Select Gender', key: 'selectGender' },
    { target: 'Male', key: 'male' },
    { target: 'Female', key: 'female' },
    { target: 'Date of Birth *', key: 'dateOfBirth' },
    { target: 'Nationality *', key: 'nationality' },
    { target: 'Passport Number *', key: 'passportNo' },
    { target: 'Passport Issue Date *', key: 'passportIssueDate' },
    { target: 'Passport Expiry Date *', key: 'passportExpiryDate' },
    { target: 'Contact & Family Details', key: 'contactFamily' },
    { target: 'We need this information to reach you and for emergency contacts.', key: 'step2Desc' },
    { target: 'Email Address *', key: 'email' },
    { target: 'Mobile Number *', key: 'mobile' },
    { target: 'Address Line 1 *', key: 'addressLine1' },
    { target: 'City / District *', key: 'cityDistrict' },
    { target: 'State / Province *', key: 'stateProvince' },
    { target: 'Postal Code *', key: 'postalCode' },
    { target: 'Country *', key: 'country' },
    { target: 'Father\'s Name *', key: 'fatherName' },
    { target: 'Father\'s Mobile *', key: 'fatherMobile' },
    { target: 'Father\'s Occupation', key: 'fatherOccupation' },
    { target: 'Mother\'s Name *', key: 'motherName' },
    { target: 'Mother\'s Mobile *', key: 'motherMobile' },
    { target: 'Mother\'s Occupation', key: 'motherOccupation' },
    { target: 'Education Details', key: 'educationDetails' },
    { target: 'Please provide your educational background details.', key: 'step3Desc' },
    { target: 'Education Level *', key: 'educationLevel' },
    { target: 'Do you have TÖMER? *', key: 'hasTomer' },
    { target: 'High School Name *', key: 'highSchoolName' },
    { target: 'High School Country *', key: 'highSchoolCountry' },
    { target: 'High School Type *', key: 'highSchoolType' },
    { target: 'YÖS Degree', key: 'yosDegree' },
    { target: 'SAT Degree', key: 'satDegree' },
    { target: 'Diploma Degree', key: 'diplomaDegree' },
    { target: 'High School GPA *', key: 'highSchoolGpa' },
    { target: 'Bachelor School Name', key: 'bachelorSchoolName' },
    { target: 'Bachelor Country', key: 'bachelorCountry' },
    { target: 'Bachelor GPA', key: 'bachelorGpa' },
    { target: 'Master School Name', key: 'masterSchoolName' },
    { target: 'Master Country', key: 'masterCountry' },
    { target: 'Master GPA', key: 'masterGpa' },
    { target: 'Upload Documents', key: 'documentUpload' },
    { target: 'Please upload clear and legible copies of your documents.', key: 'step4Desc' }
];

// Careful replace for label content
for(const rep of replacements) {
    // Replace text inside elements
    // For exact text match inside an HTML tag: `>Text<` -> `>{t('register.key')}<`
    const regex1 = new RegExp(`>\\s*${rep.target.replace(/[\*\.\?\(\)]/g, '\\$&')}\\s*<`, 'g');
    registerContent = registerContent.replace(regex1, `>{t('register.${rep.key}')}${rep.target.includes('*') ? ' *' : ''}<`);

    // Sometimes target is without asterisks but in the dictionary it's exact
    const regex2 = new RegExp(`>\\s*${rep.target.replace(/[\*\.\?\(\)]/g, '\\$&').replace(' \\*', '')}\\s*<`, 'g');
    registerContent = registerContent.replace(regex2, `>{t('register.${rep.key}')}<`);
    
    // For placeholders: `placeholder="Text"` -> `placeholder={t('register.key')}`
    const placeholderTarget = rep.target.replace(' *', '');
    const regex3 = new RegExp(`placeholder="${placeholderTarget.replace(/[\*\.\?\(\)]/g, '\\$&')}"`, 'g');
    registerContent = registerContent.replace(regex3, `placeholder={t('register.${rep.key}')}`);
}

// Custom manual replacements for Yes/No radios
registerContent = registerContent.replace(/> Yes\s*<\/label>/g, `> {t('register.yes')}</label>`);
registerContent = registerContent.replace(/> No\s*<\/label>/g, `> {t('register.no')}</label>`);

// Fix Next Step, Back, Submit buttons
registerContent = registerContent.replace(/>\s*Next Step\s*</g, `>{t('common.next')}<`);
registerContent = registerContent.replace(/>\s*Back\s*</g, `>{t('common.back')}<`);
registerContent = registerContent.replace(/>\s*Submit Application\s*</g, `>{t('common.submit')}<`);

fs.writeFileSync(registerFile, registerContent);
console.log('Register page updated with translation keys.');

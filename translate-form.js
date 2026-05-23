const fs = require('fs');

const tsPath = 'src/lib/i18n/translations.ts';
let tsContent = fs.readFileSync(tsPath, 'utf8');

const newTranslations = {
  en: `
      newApp: {
        title: "New Application",
        subtitle: "Select your desired academic program.",
        back: "Back to Dashboard",
        programSelection: "Program Selection",
        academicYear: "Academic Year",
        degreeLevel: "Degree Level",
        programSpecialty: "Program / Specialty",
        preferenceOrder: "Preference Order",
        selectYear: "Select Year",
        selectDegree: "Select Degree",
        selectDegreeFirst: "Select a degree first",
        noPrograms: "No programs available for this degree",
        noActivePrograms: "No active programs found for this degree level.",
        selectProgram: "Select Program",
        selectPreference: "Select Preference Order",
        pref1: "1st Preference",
        pref2: "2nd Preference",
        pref3: "3rd Preference",
        submit: "Submit Application",
        submitting: "Submitting...",
        fillAll: "Please fill out all fields before submitting.",
        duplicateApp: "You have already applied for this exact program in this academic year.",
        duplicatePref: "You have already submitted an application for this preference.",
        submitError: "An error occurred while submitting your application. Please try again.",
        successTitle: "Application Submitted!",
        successDesc: "Your application has been successfully created and is now pending review.",
        redirecting: "Redirecting to dashboard...",
        maxLimit: "You have reached the maximum limit of 3 applications. You cannot add more.",
        loadError: "Failed to load application options. Please try again."
      },`,
  tr: `
      newApp: {
        title: "Yeni Başvuru",
        subtitle: "İstediğiniz akademik programı seçin.",
        back: "Panele Dön",
        programSelection: "Program Seçimi",
        academicYear: "Akademik Yıl",
        degreeLevel: "Derece Seviyesi",
        programSpecialty: "Program / Bölüm",
        preferenceOrder: "Tercih Sırası",
        selectYear: "Yıl Seçin",
        selectDegree: "Derece Seçin",
        selectDegreeFirst: "Önce bir derece seçin",
        noPrograms: "Bu derece için uygun program bulunamadı",
        noActivePrograms: "Bu derece seviyesi için aktif program bulunamadı.",
        selectProgram: "Program Seçin",
        selectPreference: "Tercih Sırası Seçin",
        pref1: "1. Tercih",
        pref2: "2. Tercih",
        pref3: "3. Tercih",
        submit: "Başvuruyu Gönder",
        submitting: "Gönderiliyor...",
        fillAll: "Lütfen göndermeden önce tüm alanları doldurun.",
        duplicateApp: "Bu akademik yılda bu programa zaten başvurdunuz.",
        duplicatePref: "Bu tercih sırası için zaten bir başvuru gönderdiniz.",
        submitError: "Başvurunuz gönderilirken bir hata oluştu. Lütfen tekrar deneyin.",
        successTitle: "Başvuru Gönderildi!",
        successDesc: "Başvurunuz başarıyla oluşturuldu ve şu anda inceleme bekliyor.",
        redirecting: "Panele yönlendiriliyor...",
        maxLimit: "Maksimum 3 başvuru sınırına ulaştınız. Daha fazla ekleyemezsiniz.",
        loadError: "Başvuru seçenekleri yüklenirken hata oluştu. Lütfen tekrar deneyin."
      },`,
  ar: `
      newApp: {
        title: "طلب جديد",
        subtitle: "حدد البرنامج الأكاديمي المطلوب.",
        back: "العودة للوحة التحكم",
        programSelection: "اختيار البرنامج",
        academicYear: "العام الدراسي",
        degreeLevel: "المرحلة الدراسية",
        programSpecialty: "البرنامج / التخصص",
        preferenceOrder: "ترتيب الرغبة",
        selectYear: "اختر العام",
        selectDegree: "اختر المرحلة",
        selectDegreeFirst: "اختر المرحلة أولاً",
        noPrograms: "لا توجد برامج متاحة لهذه المرحلة",
        noActivePrograms: "لم يتم العثور على برامج نشطة لمستوى الدرجة هذا.",
        selectProgram: "اختر البرنامج",
        selectPreference: "اختر ترتيب الرغبة",
        pref1: "الرغبة الأولى",
        pref2: "الرغبة الثانية",
        pref3: "الرغبة الثالثة",
        submit: "إرسال الطلب",
        submitting: "جاري الإرسال...",
        fillAll: "يرجى تعبئة جميع الحقول قبل الإرسال.",
        duplicateApp: "لقد تقدمت بالفعل بطلب لهذا البرنامج في هذا العام الدراسي.",
        duplicatePref: "لقد قمت بالفعل بتقديم طلب بهذه الرغبة.",
        submitError: "حدث خطأ أثناء إرسال طلبك. يرجى المحاولة مرة أخرى.",
        successTitle: "تم إرسال الطلب!",
        successDesc: "تم إنشاء طلبك بنجاح وهو الآن قيد المراجعة.",
        redirecting: "جاري التوجيه إلى لوحة التحكم...",
        maxLimit: "لقد وصلت إلى الحد الأقصى البالغ 3 طلبات. لا يمكنك إضافة المزيد.",
        loadError: "فشل في تحميل خيارات الطلب. يرجى المحاولة مرة أخرى."
      },`,
  fr: `
      newApp: {
        title: "Nouvelle Candidature",
        subtitle: "Sélectionnez votre programme académique souhaité.",
        back: "Retour au Tableau de bord",
        programSelection: "Sélection du Programme",
        academicYear: "Année Académique",
        degreeLevel: "Niveau de Diplôme",
        programSpecialty: "Programme / Spécialité",
        preferenceOrder: "Ordre de Préférence",
        selectYear: "Sélectionner l'Année",
        selectDegree: "Sélectionner le Diplôme",
        selectDegreeFirst: "Sélectionnez d'abord un diplôme",
        noPrograms: "Aucun programme disponible pour ce diplôme",
        noActivePrograms: "Aucun programme actif trouvé pour ce niveau de diplôme.",
        selectProgram: "Sélectionner le Programme",
        selectPreference: "Sélectionner l'Ordre de Préférence",
        pref1: "1ère Préférence",
        pref2: "2ème Préférence",
        pref3: "3ème Préférence",
        submit: "Soumettre la Candidature",
        submitting: "Soumission...",
        fillAll: "Veuillez remplir tous les champs avant de soumettre.",
        duplicateApp: "Vous avez déjà postulé pour ce programme exact cette année académique.",
        duplicatePref: "Vous avez déjà soumis une candidature pour cette préférence.",
        submitError: "Une erreur s'est produite lors de la soumission. Veuillez réessayer.",
        successTitle: "Candidature Soumise !",
        successDesc: "Votre candidature a été créée avec succès et est maintenant en attente d'examen.",
        redirecting: "Redirection vers le tableau de bord...",
        maxLimit: "Vous avez atteint la limite maximale de 3 candidatures.",
        loadError: "Échec du chargement des options de candidature. Veuillez réessayer."
      },`,
  ru: `
      newApp: {
        title: "Новая Заявка",
        subtitle: "Выберите желаемую академическую программу.",
        back: "Вернуться на панель",
        programSelection: "Выбор Программы",
        academicYear: "Учебный Год",
        degreeLevel: "Уровень Степени",
        programSpecialty: "Программа / Специальность",
        preferenceOrder: "Порядок Предпочтения",
        selectYear: "Выберите Год",
        selectDegree: "Выберите Степень",
        selectDegreeFirst: "Сначала выберите степень",
        noPrograms: "Для этой степени нет доступных программ",
        noActivePrograms: "Активные программы для этого уровня не найдены.",
        selectProgram: "Выберите Программу",
        selectPreference: "Выберите Порядок Предпочтения",
        pref1: "1-е Предпочтение",
        pref2: "2-е Предпочтение",
        pref3: "3-е Предпочтение",
        submit: "Отправить Заявку",
        submitting: "Отправка...",
        fillAll: "Пожалуйста, заполните все поля перед отправкой.",
        duplicateApp: "Вы уже подавали заявку на эту программу в этом учебном году.",
        duplicatePref: "Вы уже отправили заявку с этим порядком предпочтения.",
        submitError: "При отправке заявки произошла ошибка. Пожалуйста, попробуйте снова.",
        successTitle: "Заявка Отправлена!",
        successDesc: "Ваша заявка успешно создана и находится на рассмотрении.",
        redirecting: "Перенаправление на панель...",
        maxLimit: "Вы достигли максимального лимита в 3 заявки. Вы не можете добавить больше.",
        loadError: "Не удалось загрузить варианты заявок. Пожалуйста, попробуйте снова."
      },`
};

for (const lang of Object.keys(newTranslations)) {
  const marker = new RegExp('(' + lang + ':\\s*\\{[\\s\\S]*?dashboard:\\s*\\{)');
  tsContent = tsContent.replace(marker, '$1' + newTranslations[lang]);
}

fs.writeFileSync(tsPath, tsContent);
console.log('Updated translations.ts');

const pagePath = 'src/app/dashboard/applications/new/page.tsx';
let pageContent = fs.readFileSync(pagePath, 'utf8');

// Add import
if (!pageContent.includes('useLanguage')) {
  pageContent = pageContent.replace(
    'import { supabase } from "@/lib/supabase";',
    'import { supabase } from "@/lib/supabase";\\nimport { useLanguage } from "@/lib/i18n/LanguageContext";'
  );
}

// Add hook inside component
if (!pageContent.includes('const { t, locale } = useLanguage();')) {
  pageContent = pageContent.replace(
    'const router = useRouter();',
    'const router = useRouter();\\n    const { t, locale } = useLanguage();'
  );
}

// Translate errors
pageContent = pageContent.replace(
  'setError("You have reached the maximum limit of 3 applications. You cannot add more.");',
  'setError(t("dashboard.newApp.maxLimit"));'
);
pageContent = pageContent.replace(
  'setError("Failed to load application options. Please try again.");',
  'setError(t("dashboard.newApp.loadError"));'
);
pageContent = pageContent.replace(
  'setError("Please fill out all fields before submitting.");',
  'setError(t("dashboard.newApp.fillAll"));'
);
pageContent = pageContent.replace(
  'setError("You have already applied for this exact program in this academic year.");',
  'setError(t("dashboard.newApp.duplicateApp"));'
);
pageContent = pageContent.replace(
  'setError(`You have already submitted an application as your ${selectedPreference}${selectedPreference === \\'1\\' ? \\'st\\' : selectedPreference === \\'2\\' ? \\'nd\\' : \\'rd\\'} preference.`);',
  'setError(t("dashboard.newApp.duplicatePref"));'
);
pageContent = pageContent.replace(
  'setError("An error occurred while submitting your application. Please try again.");',
  'setError(t("dashboard.newApp.submitError"));'
);

// Fetch translations in Supabase queries
pageContent = pageContent.replace(
  /supabase\.from\('AcademicYear'\)\.select\('id, name, isDefault'\)/g,
  "supabase.from('AcademicYear').select('id, name, isDefault, translations')"
);
pageContent = pageContent.replace(
  /supabase\.from\('Semester'\)\.select\('id, name, isDefault'\)/g,
  "supabase.from('Semester').select('id, name, isDefault, translations')"
);
pageContent = pageContent.replace(
  /supabase\.from\('Degree'\)\.select\('id, name'\)/g,
  "supabase.from('Degree').select('id, name, translations')"
);
pageContent = pageContent.replace(
  /select\('id, name, Faculty\(name\), Language\(name\)'\)/g,
  "select('id, name, translations, Faculty(name), Language(name)')"
);

// Disable error logic fix
pageContent = pageContent.replace(/disabled=\{error\.includes\("maximum limit"\)\}/g, "disabled={error === t('dashboard.newApp.maxLimit')}");
pageContent = pageContent.replace(/disabled=\{!selectedDegree \|\| error\.includes\("maximum limit"\)\}/g, "disabled={!selectedDegree || error === t('dashboard.newApp.maxLimit')}");
pageContent = pageContent.replace(/disabled=\{submitting \|\| error\.includes\("maximum limit"\)\}/g, "disabled={submitting || error === t('dashboard.newApp.maxLimit')}");

// UI Texts
pageContent = pageContent.replace(
  '<h1 className="text-3xl font-black text-[#0a0f1e] tracking-tight">New Application</h1>',
  '<h1 className="text-3xl font-black text-[#0a0f1e] tracking-tight">{t("dashboard.newApp.title")}</h1>'
);
pageContent = pageContent.replace(
  '<p className="text-gray-500 mt-1 font-medium">Select your desired academic program.</p>',
  '<p className="text-gray-500 mt-1 font-medium">{t("dashboard.newApp.subtitle")}</p>'
);
pageContent = pageContent.replace(
  'Back to Dashboard',
  '{t("dashboard.newApp.back")}'
);
pageContent = pageContent.replace(
  '<h2 className="text-sm font-bold tracking-widest uppercase">Program Selection</h2>',
  '<h2 className="text-sm font-bold tracking-widest uppercase">{t("dashboard.newApp.programSelection")}</h2>'
);

pageContent = pageContent.replace(
  'Academic Year\\n                                </label>',
  '{t("dashboard.newApp.academicYear")}\\n                                </label>'
);
pageContent = pageContent.replace(
  'Degree Level\\n                                </label>',
  '{t("dashboard.newApp.degreeLevel")}\\n                                </label>'
);
pageContent = pageContent.replace(
  'Program / Specialty\\n                            </label>',
  '{t("dashboard.newApp.programSpecialty")}\\n                            </label>'
);
pageContent = pageContent.replace(
  'Preference Order\\n                            </label>',
  '{t("dashboard.newApp.preferenceOrder")}\\n                            </label>'
);

// Options Texts
pageContent = pageContent.replace(
  '<option value="" disabled>Select Year</option>',
  '<option value="" disabled>{t("dashboard.newApp.selectYear")}</option>'
);
pageContent = pageContent.replace(
  '<option value="" disabled>Select Degree</option>',
  '<option value="" disabled>{t("dashboard.newApp.selectDegree")}</option>'
);
pageContent = pageContent.replace(
  '{!selectedDegree ? "Select a degree first" : programs.length === 0 ? "No programs available for this degree" : "Select Program"}',
  '{!selectedDegree ? t("dashboard.newApp.selectDegreeFirst") : programs.length === 0 ? t("dashboard.newApp.noPrograms") : t("dashboard.newApp.selectProgram")}'
);
pageContent = pageContent.replace(
  'No active programs found for this degree level.',
  '{t("dashboard.newApp.noActivePrograms")}'
);
pageContent = pageContent.replace(
  '<option value="" disabled>Select Preference Order</option>',
  '<option value="" disabled>{t("dashboard.newApp.selectPreference")}</option>'
);
pageContent = pageContent.replace(
  '<option value="1">1st Preference (1. Tercih)</option>',
  '<option value="1">{t("dashboard.newApp.pref1")}</option>'
);
pageContent = pageContent.replace(
  '<option value="2">2nd Preference (2. Tercih)</option>',
  '<option value="2">{t("dashboard.newApp.pref2")}</option>'
);
pageContent = pageContent.replace(
  '<option value="3">3rd Preference (3. Tercih)</option>',
  '<option value="3">{t("dashboard.newApp.pref3")}</option>'
);

// Success view
pageContent = pageContent.replace(
  '<h2 className="text-2xl font-black text-[#0a0f1e] mb-2 tracking-tight">Application Submitted!</h2>',
  '<h2 className="text-2xl font-black text-[#0a0f1e] mb-2 tracking-tight">{t("dashboard.newApp.successTitle")}</h2>'
);
pageContent = pageContent.replace(
  '<p className="text-gray-500 font-medium mb-8">Your application has been successfully created and is now pending review.</p>',
  '<p className="text-gray-500 font-medium mb-8">{t("dashboard.newApp.successDesc")}</p>'
);
pageContent = pageContent.replace(
  '<p className="text-sm text-gray-400 mt-4">Redirecting to dashboard...</p>',
  '<p className="text-sm text-gray-400 mt-4">{t("dashboard.newApp.redirecting")}</p>'
);

// Map display translations
pageContent = pageContent.replace(
  '<option key={y.id} value={y.id}>{y.name}</option>',
  '<option key={y.id} value={y.id}>{y.translations?.[locale] || y.name}</option>'
);
pageContent = pageContent.replace(
  '<option key={d.id} value={d.id}>{d.name}</option>',
  '<option key={d.id} value={d.id}>{d.translations?.[locale] || d.name}</option>'
);
// Make sure this is replaced correctly
pageContent = pageContent.replace(
  "{p.name} {p.Language?.name ? `(${p.Language.name})` : ''}",
  '{p.translations?.[locale] || p.name} {p.Language?.name ? `(${p.Language.name})` : ""}'
);

pageContent = pageContent.replace(
  '{submitting ? (\\n                                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</>\\n                                ) : (\\n                                    "Submit Application"\\n                                )}',
  '{submitting ? (\\n                                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {t("dashboard.newApp.submitting")}</>\\n                                ) : (\\n                                    t("dashboard.newApp.submit")\\n                                )}'
);

fs.writeFileSync(pagePath, pageContent);
console.log('Updated page.tsx');

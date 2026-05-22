const fs = require('fs');

const transFile = 'src/lib/i18n/translations.ts';

const dicts = [
    { // EN
        dashboardTitle: "Student Dashboard",
        dashboardDesc: "Manage your applications and necessary documents below.",
        studentApps: "Student Applications",
        addApp: "Add Application",
        appHint: "Click the 'View' button to see detailed application information or 'Add Application' to create a new one",
        noApps: "No applications found. You can add up to 3 programs.",
        tableProgram: "PROGRAM",
        tableDegree: "DEGREE",
        tableAcadYear: "ACADEMIC YEAR",
        tableSemester: "SEMESTER",
        tableStage: "STAGE",
        tableAppId: "APP ID",
        tableActions: "ACTIONS",
        notAvailable: "N/A",
        appPrefix: "App: BTU-",
        btnView: "View",
        stagePending: "PENDING",
        studentDocs: "Student Documents",
        docHint: "Click download button to access documents directly or 'Add Document' to upload new ones",
        noDocs: "No documents found.",
        tableDocType: "DOCUMENT TYPE",
        tableFileName: "FILE NAME",
        tableUploadDate: "UPLOAD DATE",
        fallbackDoc: "Document",
        btnDownload: "Download",
        docManagement: "Document Management",
        docMngDesc: "Access the complete documents report or add new documents",
        btnAllDocs: "All Documents"
    },
    { // TR
        dashboardTitle: "Öğrenci Paneli",
        dashboardDesc: "Aşağıdan başvurularınızı ve gerekli belgelerinizi yönetin.",
        studentApps: "Öğrenci Başvuruları",
        addApp: "Başvuru Ekle",
        appHint: "Detaylı başvuru bilgisini görmek için 'Görüntüle' butonuna veya yeni bir tane oluşturmak için 'Başvuru Ekle'ye tıklayın",
        noApps: "Başvuru bulunamadı. En fazla 3 program ekleyebilirsiniz.",
        tableProgram: "PROGRAM",
        tableDegree: "DERECE",
        tableAcadYear: "AKADEMİK YIL",
        tableSemester: "DÖNEM",
        tableStage: "AŞAMA",
        tableAppId: "BAŞVURU ID",
        tableActions: "İŞLEMLER",
        notAvailable: "Mevcut Değil",
        appPrefix: "Başvuru: BTU-",
        btnView: "Görüntüle",
        stagePending: "BEKLİYOR",
        studentDocs: "Öğrenci Belgeleri",
        docHint: "Belgelere doğrudan erişmek için indir butonuna veya yenilerini yüklemek için 'Belge Ekle'ye tıklayın",
        noDocs: "Belge bulunamadı.",
        tableDocType: "BELGE TÜRÜ",
        tableFileName: "DOSYA ADI",
        tableUploadDate: "YÜKLEME TARİHİ",
        fallbackDoc: "Belge",
        btnDownload: "İndir",
        docManagement: "Belge Yönetimi",
        docMngDesc: "Tüm belgeler raporuna erişin veya yeni belgeler ekleyin",
        btnAllDocs: "Tüm Belgeler"
    },
    { // AR
        dashboardTitle: "لوحة تحكم الطالب",
        dashboardDesc: "قم بإدارة طلباتك والمستندات اللازمة أدناه.",
        studentApps: "طلبات الطالب",
        addApp: "إضافة طلب",
        appHint: "انقر على زر 'عرض' لرؤية معلومات الطلب التفصيلية أو 'إضافة طلب' لإنشاء طلب جديد",
        noApps: "لم يتم العثور على طلبات. يمكنك إضافة ما يصل إلى 3 برامج.",
        tableProgram: "البرنامج",
        tableDegree: "الدرجة",
        tableAcadYear: "العام الدراسي",
        tableSemester: "الفصل الدراسي",
        tableStage: "المرحلة",
        tableAppId: "رقم الطلب",
        tableActions: "الإجراءات",
        notAvailable: "غير متوفر",
        appPrefix: "طلب: BTU-",
        btnView: "عرض",
        stagePending: "قيد الانتظار",
        studentDocs: "مستندات الطالب",
        docHint: "انقر على زر التنزيل للوصول إلى المستندات مباشرة أو 'إضافة مستند' لتحميل مستندات جديدة",
        noDocs: "لم يتم العثور على مستندات.",
        tableDocType: "نوع المستند",
        tableFileName: "اسم الملف",
        tableUploadDate: "تاريخ الرفع",
        fallbackDoc: "مستند",
        btnDownload: "تنزيل",
        docManagement: "إدارة المستندات",
        docMngDesc: "الوصول إلى تقرير المستندات الكامل أو إضافة مستندات جديدة",
        btnAllDocs: "كل المستندات"
    },
    { // FR
        dashboardTitle: "Tableau de Bord Étudiant",
        dashboardDesc: "Gérez vos candidatures et les documents nécessaires ci-dessous.",
        studentApps: "Candidatures Étudiantes",
        addApp: "Ajouter une Candidature",
        appHint: "Cliquez sur le bouton 'Voir' pour consulter les informations détaillées de la candidature ou 'Ajouter une Candidature' pour en créer une nouvelle",
        noApps: "Aucune candidature trouvée. Vous pouvez ajouter jusqu'à 3 programmes.",
        tableProgram: "PROGRAMME",
        tableDegree: "DIPLÔME",
        tableAcadYear: "ANNÉE ACADÉMIQUE",
        tableSemester: "SEMESTRE",
        tableStage: "ÉTAPE",
        tableAppId: "ID CANDIDATURE",
        tableActions: "ACTIONS",
        notAvailable: "N/D",
        appPrefix: "Cand: BTU-",
        btnView: "Voir",
        stagePending: "EN ATTENTE",
        studentDocs: "Documents Étudiants",
        docHint: "Cliquez sur le bouton de téléchargement pour accéder directement aux documents ou 'Ajouter un Document' pour en télécharger de nouveaux",
        noDocs: "Aucun document trouvé.",
        tableDocType: "TYPE DE DOCUMENT",
        tableFileName: "NOM DU FICHIER",
        tableUploadDate: "DATE D'ENVOI",
        fallbackDoc: "Document",
        btnDownload: "Télécharger",
        docManagement: "Gestion des Documents",
        docMngDesc: "Accédez au rapport complet des documents ou ajoutez de nouveaux documents",
        btnAllDocs: "Tous les Documents"
    },
    { // RU
        dashboardTitle: "Панель Студента",
        dashboardDesc: "Управляйте своими заявками и необходимыми документами ниже.",
        studentApps: "Заявки Студента",
        addApp: "Добавить Заявку",
        appHint: "Нажмите кнопку 'Просмотр', чтобы увидеть подробную информацию о заявке, или 'Добавить Заявку', чтобы создать новую",
        noApps: "Заявки не найдены. Вы можете добавить до 3 программ.",
        tableProgram: "ПРОГРАММА",
        tableDegree: "СТЕПЕНЬ",
        tableAcadYear: "УЧЕБНЫЙ ГОД",
        tableSemester: "СЕМЕСТР",
        tableStage: "ЭТАП",
        tableAppId: "ID ЗАЯВКИ",
        tableActions: "ДЕЙСТВИЯ",
        notAvailable: "Н/Д",
        appPrefix: "Заявка: BTU-",
        btnView: "Просмотр",
        stagePending: "В ОЖИДАНИИ",
        studentDocs: "Документы Студента",
        docHint: "Нажмите кнопку загрузки, чтобы получить прямой доступ к документам, или 'Добавить Документ', чтобы загрузить новые",
        noDocs: "Документы не найдены.",
        tableDocType: "ТИП ДОКУМЕНТА",
        tableFileName: "ИМЯ ФАЙЛА",
        tableUploadDate: "ДАТА ЗАГРУЗКИ",
        fallbackDoc: "Документ",
        btnDownload: "Скачать",
        docManagement: "Управление Документами",
        docMngDesc: "Получите доступ к полному отчету о документах или добавьте новые документы",
        btnAllDocs: "Все Документы"
    }
];

let content = fs.readFileSync(transFile, 'utf8');

// The file has a structure where each locale has a `dashboard` object now? No, we will add `dashboard` to each locale block.
// Wait, I should just split by `    register: {` and inject `    dashboard: { ... },\n` BEFORE `    register: {`

const parts = content.split('    register: {');

if (parts.length === 6) {
    let newContent = parts[0];
    for (let i = 1; i <= 5; i++) {
        const dict = dicts[i - 1];
        let injectStr = '    dashboard: {\n';
        for (const [key, val] of Object.entries(dict)) {
            injectStr += `      ${key}: "${val.replace(/"/g, '\\"')}",\n`;
        }
        injectStr += '    },\n    register: {';
        newContent += injectStr + parts[i];
    }
    fs.writeFileSync(transFile, newContent);
    console.log("SUCCESS");
} else {
    console.log("FAILED to split properly.");
}

const fs = require('fs');

const sidebarFile = 'src/components/dashboard/StudentSidebar.tsx';
let content = fs.readFileSync(sidebarFile, 'utf8');

// Replace SECTIONS
content = content.replace(
    /const SECTIONS = \[\s*{\s*id:\s*'personal',\s*title:\s*'PERSONAL INFORMATION',\s*icon:\s*User\s*},[\s\S]*?\];/,
    `const getSections = (t: any) => [
    { id: 'personal', title: t('sidebar.secPersonal'), icon: User },
    { id: 'status', title: t('sidebar.secStatus'), icon: Info },
    { id: 'identity', title: t('sidebar.secIdentity'), icon: CreditCard },
    { id: 'tomer', title: t('sidebar.secTomer'), icon: BookOpen },
    { id: 'academic', title: t('sidebar.secAcademic'), icon: GraduationCap },
    { id: 'highschool', title: t('sidebar.secHighSchool'), icon: Building },
    { id: 'higher', title: t('sidebar.secHigherEd'), icon: GraduationCap },
    { id: 'family', title: t('sidebar.secFamily'), icon: Users },
    { id: 'address', title: t('sidebar.secAddress'), icon: MapPin },
];`
);

// We need to use `getSections(t)` instead of `SECTIONS` inside the component
content = content.replace(/SECTIONS\.map\(\(section\)/g, 'getSections(t).map((section)');

// Replace fallback string when no profile is found
content = content.replace(
    /No student profile found\. Please login\./g,
    `{t('sidebar.valNoProfile')}`
);

// Replace InfoRow values and labels
const replacements = [
    ['label="FIRST NAME"', 'label={t("sidebar.fieldFirstName")}'],
    ['label="LAST NAME"', 'label={t("sidebar.fieldLastName")}'],
    ['label="EMAIL ADDRESS"', 'label={t("sidebar.fieldEmail")}'],
    ['label="MOBILE NUMBER"', 'label={t("sidebar.fieldMobile")}'],
    ['label="GENDER"', 'label={t("sidebar.fieldGender")}'],
    ['label="DATE OF BIRTH"', 'label={t("sidebar.fieldDob")}'],
    ['label="APPLICATION STATUS"', 'label={t("sidebar.fieldAppStatus")}'],
    ['label="NATIONALITY"', 'label={t("sidebar.fieldNationality")}'],
    ['label="PASSPORT NUMBER"', 'label={t("sidebar.fieldPassport")}'],
    ['label="PASSPORT ISSUE"', 'label={t("sidebar.fieldPassIssue")}'],
    ['label="PASSPORT EXPIRY"', 'label={t("sidebar.fieldPassExpiry")}'],
    ['label="TC NUMBER"', 'label={t("sidebar.fieldTc")}'],
    ['label="HAS TÖMER"', 'label={t("sidebar.fieldHasTomer")}'],
    ['label="EDUCATION LEVEL"', 'label={t("sidebar.fieldEdLevel")}'],
    ['label="COUNTRY"', 'label={t("sidebar.fieldCountry")}'],
    ['label="SCHOOL NAME"', 'label={t("sidebar.fieldSchoolName")}'],
    ['label="SCHOOL TYPE"', 'label={t("sidebar.fieldSchoolType")}'],
    ['label="GPA"', 'label={t("sidebar.fieldGpa")}'],
    ['label="BACHELOR SCHOOL"', 'label={t("sidebar.fieldBachSchool")}'],
    ['label="BACHELOR GPA"', 'label={t("sidebar.fieldBachGpa")}'],
    ['label="MASTER SCHOOL"', 'label={t("sidebar.fieldMasterSchool")}'],
    ['label="MASTER GPA"', 'label={t("sidebar.fieldMasterGpa")}'],
    ['label="FATHER NAME"', 'label={t("sidebar.fieldFatherName")}'],
    ['label="FATHER MOBILE"', 'label={t("sidebar.fieldFatherMobile")}'],
    ['label="MOTHER NAME"', 'label={t("sidebar.fieldMotherName")}'],
    ['label="MOTHER MOBILE"', 'label={t("sidebar.fieldMotherMobile")}'],
    ['label="STATE / PROVINCE"', 'label={t("sidebar.fieldState")}'],
    ['label="CITY / DISTRICT"', 'label={t("sidebar.fieldCity")}'],
    ['label="ADDRESS LINE"', 'label={t("sidebar.fieldAddressLine")}'],
    ['label="POSTAL CODE"', 'label={t("sidebar.fieldPostal")}'],

    ["|| 'Not provided'", "|| t('sidebar.valNotProvided')"],
    ["|| 'Applicant'", "|| t('sidebar.valApplicant')"],
    ["|| 'N/A'", "|| t('sidebar.valNA')"],
    ["|| 'No'", "|| t('sidebar.valNo')"],
    ["|| 'Not specified'", "|| t('sidebar.valNotSpecified')"]
];

for (let [search, replace] of replacements) {
    content = content.split(search).join(replace);
}

// In the `formatDate` function, return `t('sidebar.valNotProvided')`
content = content.replace(
    /if \(!dateString\) return 'Not Provided';/g,
    `if (!dateString) return t('sidebar.valNotProvided');`
);

fs.writeFileSync(sidebarFile, content);
console.log("Updated StudentSidebar.tsx");

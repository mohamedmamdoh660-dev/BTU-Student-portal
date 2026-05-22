const fs = require('fs');

const transFile = 'src/lib/i18n/translations.ts';
let content = fs.readFileSync(transFile, 'utf8');

const dicts = [
    { // EN
        aboutUni: "About University",
        intOffice: "International Relations Office",
        tomer: "BURSA TÖMER"
    },
    { // TR
        aboutUni: "Üniversite Hakkında",
        intOffice: "Dış İlişkiler Ofisi",
        tomer: "BURSA TÖMER"
    },
    { // AR
        aboutUni: "عن الجامعة",
        intOffice: "مكتب العلاقات الدولية",
        tomer: "بورصة تومر"
    },
    { // FR
        aboutUni: "À propos de l'université",
        intOffice: "Bureau des relations internationales",
        tomer: "BURSA TÖMER"
    },
    { // RU
        aboutUni: "Об университете",
        intOffice: "Офис международных отношений",
        tomer: "BURSA TÖMER"
    }
];

const parts = content.split('    common: {\n');

if (parts.length === 6) {
    let finalContent = parts[0];
    for (let i = 1; i <= 5; i++) {
        const dict = dicts[i - 1];
        let injectStr = '    common: {\n';
        for (const [key, val] of Object.entries(dict)) {
            if (!parts[i].includes(`      ${key}:`)) {
                injectStr += `      ${key}: "${val}",\n`;
            }
        }
        finalContent += injectStr + parts[i];
    }
    fs.writeFileSync(transFile, finalContent);
    console.log("SUCCESS ADDING COMMON KEYS");
} else {
    console.log("FAILED to split properly: " + parts.length);
}

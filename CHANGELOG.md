# Changelog

## [2026-05-22] - Login Page & Form Translations Fix - Localization

- Updated Turkish translation strings in `src/lib/i18n/translations.ts` for "T.C. Vatandaşı mısınız?" to "Yabancı kimlik numarası var mı ?" and "T.C. Kimlik Numarası" to "Yabancı kimlik numarası".
- Added missing translation keys for the login page text (`appStatusTitle`, `appStatusDesc`, `featureTracking`, `featureUpload`, `featureOffer`) across all supported languages (EN, TR, AR, FR, RU) in `src/lib/i18n/translations.ts`.
- Replaced hardcoded English text on the login page (`src/app/page.tsx`) with the new i18n variables so that it translates correctly when the user changes languages.

## [2026-05-22] - Remove Blue Card Field - UI Adjustment

- Removed the "Mavi Kartınız var mı?" (Blue Card) radio button field and its options from the student registration form (`src/app/register/page.tsx`).

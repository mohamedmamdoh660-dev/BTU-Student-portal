# Changelog

## [2026-05-22] - Login Page & Form Translations Fix - Localization

- Updated Turkish translation strings in `src/lib/i18n/translations.ts` for "T.C. Vatandaşı mısınız?" to "Yabancı kimlik numarası var mı ?" and "T.C. Kimlik Numarası" to "Yabancı kimlik numarası".
- Added missing translation keys for the login page text (`appStatusTitle`, `appStatusDesc`, `featureTracking`, `featureUpload`, `featureOffer`) across all supported languages (EN, TR, AR, FR, RU) in `src/lib/i18n/translations.ts`.
- Replaced hardcoded English text on the login page (`src/app/page.tsx`) with the new i18n variables so that it translates correctly when the user changes languages.

## [2026-05-22] - Remove Blue Card Field - UI Adjustment

- Removed the "Mavi Kartınız var mı?" (Blue Card) radio button field and its options from the student registration form (`src/app/register/page.tsx`).

## [2026-05-22] - Registration Form Layout Fix - Bug Fix

- Fixed the UI grid layout issue when "Hayır" (No) is selected for the Foreign ID question by making the question field span two columns (`md:col-span-2`) in `src/app/register/page.tsx`.

## [2026-05-22] - Registration Enhancements & UI Fixes - Enhancements

- Added age validation on the registration form to ensure applicants are at least 16 years old.
- Removed the duplicate "Diploma Degree" field to streamline the form; only the "Diploma Grade" field is now used.
- Improved the visibility and font colors in the Document Upload section (`src/components/ui/file-upload.tsx`) to look better on dark backgrounds.
- Updated the document validation logic to make "High School Transcript" mandatory for everyone, and "High School Certificate" mandatory specifically when "Diploma" is selected (`src/app/register/page.tsx`).
- Made the "Diploma Grade" field visible and required only when the "Diploma" High School Type is selected. It will no longer erroneously display for "TR-YÖS" or "SAT" (`src/app/register/page.tsx`).

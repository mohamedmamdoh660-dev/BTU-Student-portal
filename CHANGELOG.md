# Changelog

## [2026-06-02] - Registration Form Translations Fix - Localization
- Updated English translation strings in `src/lib/i18n/translations.ts` for "Have Turkish T.C.?" to "Have Foreigner Identity Number ?" and "T.C. Number" to "Foreigner Identity Number".

## [2026-05-23] - Application Form Localization
- Translated all UI labels, form options, error states, and submission messages on the "New Application" form into all supported languages (EN, TR, AR, FR, RU).
- Updated the form's data-fetching logic to dynamically request and display the translated names for degrees, programs, academic years, and faculties, gracefully falling back to the English names if the specific translated string is empty.


## [2026-05-23] - Update Max Upload Size & UI Fixes
- Fixed a bug where dropdown menus (both Language Switcher and Form Selects) appeared with white text on a white background on some OS modes (e.g., iOS/macOS Dark Mode).
- Added `variant` prop to `LanguageSwitcher` to improve visibility on light backgrounds.
- Enforced correct `color-scheme` on all native `<select>` dropdowns across Light/Dark layouts.
- Updated maximum file upload size limit from 10MB to 2MB across all file upload components and translation strings.
- Updated the Missing Documents multi-app selector to be unchecked by default instead of selecting all applications.

## [2026-05-23] - Conditional Acceptance Receipts Upload - Enhancements/Fixes
- Implemented a new UI block in the Application Details page (`[id]/page.tsx`) specifically for applications in the `Conditional Acceptance` stage.
- Added functionality to upload two required receipts: `Oryantasyon Ücreti` and `TOMER Fee`.
- Implemented file size validation (max 2MB) for the receipts.
- Application stage automatically updates to `Client Pay` upon successful upload of both receipts, seamlessly triggering the `Received the payment` transition in the backend.
- Added full multi-language translation support for the new receipts upload UI.

## [2026-05-23] - Missing Documents & Dashboard Improvements - Enhancements/Fixes
- Redesigned the Missing Documents Upload UI to be significantly more compact, clean, and horizontal, aligning with modern dashboard aesthetics.
- Hid the application selection checkboxes when the student has only one application requiring missing documents, auto-applying the upload to that single application.
- Clarified that uploaded documents are treated as student-level assets and are only uploaded once to Supabase Storage, even if applied to multiple applications.
- Refactored Missing Documents Upload logic: Moved from individual application detail pages to a centralized multi-app dashboard component.
- Implemented propagation logic for Missing Documents: Students can now bulk-apply uploaded missing documents across multiple pending applications from the dashboard.
- Replaced the Semester column with Preference Order in the Dashboard Applications Table.
- Implemented "Missing Documents" upload functionality directly inside the Student Portal.
- Supported Dynamic Multi-File Upload for missing documents, which prompts the student for separate files based on the required missing documents, auto-naming and typing them just like the CRM.
- Added a dedicated "Upload" button in the Dashboard table for applications in the "MISSING DOCUMENTS" stage.
- Improved typography and contrast across dashboard tables and the sidebar for better visibility.
- Prevented stage badges (like 'PENDING REVIEW') from wrapping into two lines.
- Fixed the APP ID formatting to use `appNumber` instead of the default ID.
- Allowed students to edit their application data from the portal.
- Fixed a 400 Bad Request error when saving uploaded missing documents due to schema mismatch.
- Fixed 400 Bad Request error caused by missing `id` (cuid) and `updatedAt` constraints when inserting Documents via Supabase REST API.

## [2026-05-22] - Application Preference Order Feature - Feature

- Added a "Preference Order" dropdown to the Application creation form (`src/app/dashboard/applications/new/page.tsx`), allowing students to specify their 1st, 2nd, and 3rd preference.
- Implemented validation to ensure a student cannot submit multiple applications with the same preference order.
- Updated the applications table (`src/components/dashboard/ApplicationsTable.tsx`) to display the preference order and sort applications by preference.
- Added translation strings for the preference feature across all supported languages in `src/lib/i18n/translations.ts`.

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

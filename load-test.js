/**
 * BTU Student Portal — Load Test (مع رفع الملفات)
 * =================================================
 * 3 سيناريوهات متزامنة:
 *   1. login_rush        → 200 مستخدم بيسجل دخول في نفس الوقت
 *   2. dashboard_browse  → 80 طالب بيراجع طلباته
 *   3. new_registrations → 20 طالب جديد بيسجل ويرفع أوراقه
 *
 * الملفات المرفوعة: test-fixtures/sample.jpg + sample.pdf
 * (بيحاكي رفع الصورة الشخصية، الباسبور، الشهادة)
 */

import http   from 'k6/http';
import { check, sleep, group } from 'k6';
import { Trend, Rate, Counter } from 'k6/metrics';

// ─── ملفات الاختبار (بتتحمل مرة واحدة في البداية) ──────────────────────
const SAMPLE_JPG = open('./test-fixtures/sample.jpg', 'b');
const SAMPLE_PDF = open('./test-fixtures/sample.pdf', 'b');

// ─── Config ──────────────────────────────────────────────────────────────
const SUPABASE_URL = 'https://rfibqkkvtowyzfseyfbi.supabase.co';
const ANON_KEY     = 'sb_publishable_QtJ0ntTk_610SmVzkl7gfQ_3T4QNU2w';
const BUCKET       = 'crm-uploads';

const BASE_HEADERS = {
  'apikey':        ANON_KEY,
  'Authorization': `Bearer ${ANON_KEY}`,
};

const JSON_HEADERS = {
  ...BASE_HEADERS,
  'Content-Type': 'application/json',
  'Accept':       'application/json',
};

// ─── Custom Metrics ───────────────────────────────────────────────────────
const loginDuration        = new Trend('login_duration',        true);
const dashboardDuration    = new Trend('dashboard_duration',    true);
const registrationDuration = new Trend('registration_duration', true);
const uploadDuration       = new Trend('upload_duration',       true);
const errorRate            = new Rate('errors');
const totalRegistrations   = new Counter('total_registrations');
const totalUploads         = new Counter('total_file_uploads');

// ─── Scenarios ────────────────────────────────────────────────────────────
export const options = {
  scenarios: {
    login_rush: {
      executor:  'ramping-vus',
      startVUs:  0,
      stages: [
        { duration: '30s', target: 50  },
        { duration: '1m',  target: 200 },
        { duration: '30s', target: 200 },
        { duration: '30s', target: 0   },
      ],
      exec: 'loginFlow',
      tags: { scenario: 'login' },
    },

    dashboard_browse: {
      executor:  'ramping-vus',
      startVUs:  0,
      stages: [
        { duration: '30s', target: 30 },
        { duration: '1m',  target: 80 },
        { duration: '30s', target: 80 },
        { duration: '30s', target: 0  },
      ],
      exec:      'dashboardFlow',
      tags:      { scenario: 'dashboard' },
      startTime: '10s',
    },

    new_registrations: {
      executor:  'ramping-vus',
      startVUs:  0,
      stages: [
        { duration: '30s', target: 5  },
        { duration: '1m',  target: 20 },
        { duration: '30s', target: 20 },
        { duration: '30s', target: 0  },
      ],
      exec:      'registrationFlow',
      tags:      { scenario: 'registration' },
      startTime: '20s',
    },
  },

  thresholds: {
    'login_duration':        ['p(95)<3000'],
    'dashboard_duration':    ['p(95)<2000'],
    'registration_duration': ['p(95)<15000'],  // أطول لأن فيه رفع ملفات
    'upload_duration':       ['p(95)<6000'],   // كل ملف لوحده أقل من 6 ثوانٍ
    'errors':                ['rate<0.05'],
    'http_req_failed':       ['rate<0.05'],
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────
function randomId() {
  return 'c' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const GENDERS    = ['Male', 'Female'];
const HS_TYPES   = ['Diploma', 'TR-YÖS', 'SAT'];
const NATS       = ['TR', 'EG', 'SA', 'SY', 'IQ', 'LY'];

// ─── رفع ملف واحد إلى Supabase Storage ───────────────────────────────────
function uploadFile(studentId, docType, fileBytes, mimeType, extension) {
  const start    = Date.now();
  const fileName = `students/${studentId}/${docType}-${Date.now()}.${extension}`;
  const url      = `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${fileName}`;

  const res = http.post(url, fileBytes, {
    headers: {
      ...BASE_HEADERS,
      'Content-Type': mimeType,
      'x-upsert':     'true',   // بيسمح بالكتابة فوق لو الملف موجود
    },
    tags: { name: `upload_${docType}` },
  });

  const ok = check(res, {
    [`upload ${docType}: 200/200`]: (r) => r.status === 200 || r.status === 201,
    [`upload ${docType}: سريع`]:    (r) => r.timings.duration < 6000,
  });

  uploadDuration.add(Date.now() - start);
  if (ok) totalUploads.add(1);

  // بنجيب الـ public URL زي ما الفرونتيند بيعمل
  const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${fileName}`;
  return { ok, publicUrl, fileName, docType };
}

// ═══════════════════════════════════════════════════════════════════════════
// Scenario 1: Login
// ═══════════════════════════════════════════════════════════════════════════
export function loginFlow() {
  const start = Date.now();

  group('Login', () => {
    const vuId = __VU;
    const res = http.get(
      `${SUPABASE_URL}/rest/v1/Student?select=id,fullName,status&email=eq.student${vuId}%40test.com&passportNumber=eq.P${vuId}`,
      { headers: JSON_HEADERS, tags: { name: 'login_query' } }
    );

    const ok = check(res, {
      'login: status 200':       (r) => r.status === 200,
      'login: response is JSON': (r) => r.headers['Content-Type']?.includes('application/json'),
      'login: سريع <3s':         (r) => r.timings.duration < 3000,
    });

    loginDuration.add(Date.now() - start);
    errorRate.add(ok ? 0 : 1);
  });

  sleep(Math.random() * 2 + 1);
}

// ═══════════════════════════════════════════════════════════════════════════
// Scenario 2: Dashboard
// ═══════════════════════════════════════════════════════════════════════════
export function dashboardFlow() {
  const start         = Date.now();
  const fakeStudentId = randomId();

  group('Dashboard', () => {
    const studentRes = http.get(
      `${SUPABASE_URL}/rest/v1/Student?select=*&id=eq.${fakeStudentId}&limit=1`,
      { headers: JSON_HEADERS, tags: { name: 'dash_student' } }
    );
    check(studentRes, { 'student data: 200': (r) => r.status === 200 });

    sleep(0.5);

    const appsRes = http.get(
      `${SUPABASE_URL}/rest/v1/Application?select=*&studentId=eq.${fakeStudentId}&order=createdAt.desc`,
      { headers: JSON_HEADERS, tags: { name: 'dash_apps' } }
    );
    check(appsRes, { 'applications: 200': (r) => r.status === 200 });

    sleep(0.5);

    const docsRes = http.get(
      `${SUPABASE_URL}/rest/v1/Document?select=*&studentId=eq.${fakeStudentId}&order=createdAt.desc`,
      { headers: JSON_HEADERS, tags: { name: 'dash_docs' } }
    );
    check(docsRes, { 'documents: 200': (r) => r.status === 200 });

    dashboardDuration.add(Date.now() - start);
  });

  sleep(Math.random() * 3 + 2);
}

// ═══════════════════════════════════════════════════════════════════════════
// Scenario 3: Registration + File Upload
// ═══════════════════════════════════════════════════════════════════════════
export function registrationFlow() {
  const start = Date.now();
  const newId = randomId();
  const vuId  = __VU * 10000 + Math.floor(Math.random() * 9999);

  group('Registration — New Student + Upload Docs', () => {

    // ── Step 1: تحميل الـ Countries (onMount) ──────────────────────────
    group('1. Load countries', () => {
      const res = http.get(
        `${SUPABASE_URL}/rest/v1/Country?select=id,name,activeOnNationalities&isActive=eq.true&order=name`,
        { headers: JSON_HEADERS, tags: { name: 'reg_countries' } }
      );
      check(res, { 'countries loaded': (r) => r.status === 200 });
    });
    sleep(1);

    // ── Step 2: فحص الإيميل والباسبور في الوقت الحقيقي ────────────────
    group('2. Real-time checks', () => {
      http.get(
        `${SUPABASE_URL}/rest/v1/Student?select=id&email=eq.lt${vuId}%40btu.test&limit=1`,
        { headers: JSON_HEADERS, tags: { name: 'reg_email_check' } }
      );
      sleep(0.3);
      http.get(
        `${SUPABASE_URL}/rest/v1/Student?select=id&passportNumber=eq.LT${vuId}&limit=1`,
        { headers: JSON_HEADERS, tags: { name: 'reg_passport_check' } }
      );
    });
    sleep(2); // الطالب بيكمل الفورم

    // ── Step 3: رفع الملفات (قبل الـ insert — زي ما بيعمل الكود) ───────
    group('3. Upload documents', () => {
      // صورة شخصية (JPEG)
      uploadFile(newId, 'personal_photo',      SAMPLE_JPG, 'image/jpeg', 'jpg');
      sleep(0.5);

      // نسخة الباسبور (JPEG)
      uploadFile(newId, 'passport_copy',       SAMPLE_JPG, 'image/jpeg', 'jpg');
      sleep(0.5);

      // كشف الدرجات (PDF)
      uploadFile(newId, 'high_school_transcript', SAMPLE_PDF, 'application/pdf', 'pdf');
      sleep(0.5);

      // شهادة الثانوية (PDF)
      uploadFile(newId, 'high_school_certificate', SAMPLE_PDF, 'application/pdf', 'pdf');
    });
    sleep(0.5);

    // ── Step 4: Insert الطالب في قاعدة البيانات ───────────────────────
    group('4. Insert student record', () => {
      const payload = JSON.stringify({
        id:               newId,
        haveTc:           false,
        blueCard:         false,
        firstName:        `LoadTest`,
        lastName:         `VU${vuId}`,
        fullName:         `LoadTest VU${vuId}`,
        gender:           randomItem(GENDERS),
        dateOfBirth:      '2000-01-15T00:00:00.000Z',
        nationality:      randomItem(NATS),
        passportNumber:   `LT${vuId}`,
        email:            `lt${vuId}@btu.test`,
        mobile:           `+905551234567`,
        phone:            `+905551234567`,
        fatherName:       'Test Father',
        motherName:       'Test Mother',
        educationLevelId: 'high_school',
        hasTomer:         'Hayır',
        highSchoolName:   'Load Test High School',
        highSchoolCountry:'TR',
        highSchoolType:   randomItem(HS_TYPES),
        highSchoolGpa:    85,
        documents:        [],   // الـ URLs اتخزنت في جدول Document منفصل
        status:           'Applicant',
        isActive:         true,
        createdAt:        new Date().toISOString(),
        updatedAt:        new Date().toISOString(),
      });

      const res = http.post(
        `${SUPABASE_URL}/rest/v1/Student`,
        payload,
        {
          headers: { ...JSON_HEADERS, 'Prefer': 'return=minimal' },
          tags:    { name: 'reg_insert_student' },
        }
      );

      const ok = check(res, {
        'student inserted: 201': (r) => r.status === 201,
        'insert سريع <5s':       (r) => r.timings.duration < 5000,
      });

      if (ok) totalRegistrations.add(1);
      errorRate.add(ok ? 0 : 1);
    });

    registrationDuration.add(Date.now() - start);
  });

  sleep(Math.random() * 5 + 3);
}

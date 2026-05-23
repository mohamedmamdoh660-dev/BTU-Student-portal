/**
 * BTU Student Portal — Load Test
 * ================================
 * يحاكي 3 سيناريوهات حقيقية في نفس الوقت:
 *   1. login_rush   → طلاب بيحاولوا يسجلوا دخول (الأكثر ضغطاً)
 *   2. dashboard    → طلاب مسجلين بيراجعوا طلباتهم
 *   3. registration → طلاب جدد بيسجلوا (أثقل عملية)
 *
 * يشتغل على Supabase REST مباشرة (زي ما بيعمل الفرونتيند بالظبط)
 */

import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Trend, Rate, Counter } from 'k6/metrics';

// ─── Config ────────────────────────────────────────────────────────────────
const SUPABASE_URL = 'https://rfibqkkvtowyzfseyfbi.supabase.co';
const ANON_KEY     = 'sb_publishable_QtJ0ntTk_610SmVzkl7gfQ_3T4QNU2w';

const HEADERS = {
  'apikey':        ANON_KEY,
  'Authorization': `Bearer ${ANON_KEY}`,
  'Content-Type':  'application/json',
  'Accept':        'application/json',
};

// ─── Custom Metrics ────────────────────────────────────────────────────────
const loginDuration        = new Trend('login_duration',        true);
const dashboardDuration    = new Trend('dashboard_duration',    true);
const registrationDuration = new Trend('registration_duration', true);
const errorRate            = new Rate('errors');
const registrations        = new Counter('total_registrations');

// ─── Scenarios ─────────────────────────────────────────────────────────────
export const options = {
  scenarios: {
    // سيناريو 1: هجوم تسجيل الدخول (الأكثر حدوثاً عند فتح القبول)
    login_rush: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 50  },  // بيزيد لـ 50 مستخدم
        { duration: '1m',  target: 200 },  // ذروة 200 مستخدم
        { duration: '30s', target: 200 },  // بيفضل على الذروة
        { duration: '30s', target: 0   },  // بيرجع للصفر
      ],
      exec: 'loginFlow',
      tags: { scenario: 'login' },
    },

    // سيناريو 2: طلاب بيراجعوا الداشبورد
    dashboard_browse: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 30  },
        { duration: '1m',  target: 80  },
        { duration: '30s', target: 80  },
        { duration: '30s', target: 0   },
      ],
      exec: 'dashboardFlow',
      tags: { scenario: 'dashboard' },
      startTime: '10s', // بيبدأ بعد الـ login بشوية
    },

    // سيناريو 3: تسجيلات جديدة (أقل ولكن أثقل)
    new_registrations: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 5  },
        { duration: '1m',  target: 20 },
        { duration: '30s', target: 20 },
        { duration: '30s', target: 0  },
      ],
      exec: 'registrationFlow',
      tags: { scenario: 'registration' },
      startTime: '20s',
    },
  },

  // حدود القبول — لو فات عنها الاختبار بيفشل
  thresholds: {
    'login_duration':              ['p(95)<3000'],   // 95% من اللوجين أقل من 3 ثوانٍ
    'dashboard_duration':          ['p(95)<2000'],   // الداشبورد أسرع
    'registration_duration':       ['p(95)<8000'],   // التسجيل أبطأ طبيعي
    'errors':                      ['rate<0.05'],    // أقل من 5% أخطاء
    'http_req_failed':             ['rate<0.05'],
  },
};

// ─── Helper ────────────────────────────────────────────────────────────────
function randomId(prefix = 'c') {
  return prefix + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// بيانات وهمية واقعية
const NATIONALITIES = ['TR', 'EG', 'SA', 'SY', 'IQ', 'LY', 'TN', 'MA'];
const GENDERS       = ['Male', 'Female'];
const HS_TYPES      = ['Diploma', 'TR-YÖS', 'SAT'];

// ─── Scenario 1: Login ─────────────────────────────────────────────────────
export function loginFlow() {
  const start = Date.now();

  group('Login — Email + Passport', () => {
    // محاولة لوجين بداتا عشوائية (غالباً هتفشل — ده واقعي)
    const vuId = __VU; // رقم المستخدم الافتراضي
    const res = http.get(
      `${SUPABASE_URL}/rest/v1/Student?select=id,fullName,status&email=eq.student${vuId}%40test.com&passportNumber=eq.P${vuId}`,
      { headers: HEADERS, tags: { name: 'login' } }
    );

    const success = check(res, {
      'login: status 200':       (r) => r.status === 200,
      'login: response is JSON': (r) => r.headers['Content-Type']?.includes('application/json'),
      'login: fast response':    (r) => r.timings.duration < 3000,
    });

    loginDuration.add(Date.now() - start);
    if (!success) errorRate.add(1);
    else errorRate.add(0);
  });

  sleep(Math.random() * 2 + 1); // 1-3 ثوانٍ بين المحاولات
}

// ─── Scenario 2: Dashboard ─────────────────────────────────────────────────
export function dashboardFlow() {
  const start = Date.now();
  const fakeStudentId = randomId();

  group('Dashboard — Load Student Data', () => {
    // 1. جلب بيانات الطالب
    const studentRes = http.get(
      `${SUPABASE_URL}/rest/v1/Student?select=*&id=eq.${fakeStudentId}&limit=1`,
      { headers: HEADERS, tags: { name: 'dashboard_student' } }
    );
    check(studentRes, { 'student data: 200': (r) => r.status === 200 });

    sleep(0.5);

    // 2. جلب الطلبات (Applications)
    const appsRes = http.get(
      `${SUPABASE_URL}/rest/v1/Application?select=*&studentId=eq.${fakeStudentId}&order=createdAt.desc`,
      { headers: HEADERS, tags: { name: 'dashboard_applications' } }
    );
    check(appsRes, { 'applications: 200': (r) => r.status === 200 });

    sleep(0.5);

    // 3. جلب المستندات
    const docsRes = http.get(
      `${SUPABASE_URL}/rest/v1/Document?select=*&studentId=eq.${fakeStudentId}&order=createdAt.desc`,
      { headers: HEADERS, tags: { name: 'dashboard_documents' } }
    );
    check(docsRes, { 'documents: 200': (r) => r.status === 200 });

    dashboardDuration.add(Date.now() - start);
  });

  sleep(Math.random() * 3 + 2); // 2-5 ثوانٍ (الطالب بيراجع الصفحة)
}

// ─── Scenario 3: Registration ──────────────────────────────────────────────
export function registrationFlow() {
  const start  = Date.now();
  const newId  = randomId();
  const vuId   = __VU + Math.floor(Math.random() * 99999);

  group('Registration — New Student', () => {
    // 1. فحص الـ countries أول (بيحصل في onMount)
    const countriesRes = http.get(
      `${SUPABASE_URL}/rest/v1/Country?select=id,name,activeOnNationalities&isActive=eq.true&order=name`,
      { headers: HEADERS, tags: { name: 'reg_countries' } }
    );
    check(countriesRes, { 'countries loaded': (r) => r.status === 200 });

    sleep(1);

    // 2. فحص الإيميل (onBlur)
    const emailCheckRes = http.get(
      `${SUPABASE_URL}/rest/v1/Student?select=id&email=eq.loadtest${vuId}%40test.com&limit=1`,
      { headers: HEADERS, tags: { name: 'reg_email_check' } }
    );
    check(emailCheckRes, { 'email check: 200': (r) => r.status === 200 });

    sleep(0.5);

    // 3. فحص الباسبور (onBlur)
    const passportCheckRes = http.get(
      `${SUPABASE_URL}/rest/v1/Student?select=id&passportNumber=eq.LT${vuId}&limit=1`,
      { headers: HEADERS, tags: { name: 'reg_passport_check' } }
    );
    check(passportCheckRes, { 'passport check: 200': (r) => r.status === 200 });

    sleep(2); // الطالب بيكمل الفورم

    // 4. إدراج الطالب الجديد (الـ submit الفعلي)
    const payload = JSON.stringify({
      id:               newId,
      haveTc:           false,
      blueCard:         false,
      firstName:        `LoadTest${vuId}`,
      lastName:         'User',
      fullName:         `LoadTest${vuId} User`,
      gender:           randomItem(GENDERS),
      dateOfBirth:      '2000-01-01T00:00:00.000Z',
      nationality:      randomItem(NATIONALITIES),
      passportNumber:   `LT${vuId}`,
      email:            `loadtest${vuId}@test.com`,
      mobile:           `+9055512${vuId.toString().slice(-5)}`,
      phone:            `+9055512${vuId.toString().slice(-5)}`,
      fatherName:       'Test Father',
      motherName:       'Test Mother',
      educationLevelId: 'high_school',
      hasTomer:         'Hayır',
      highSchoolName:   'Load Test High School',
      highSchoolCountry:'TR',
      highSchoolType:   randomItem(HS_TYPES),
      highSchoolGpa:    85,
      documents:        [],
      status:           'Applicant',
      isActive:         true,
      createdAt:        new Date().toISOString(),
      updatedAt:        new Date().toISOString(),
    });

    const insertRes = http.post(
      `${SUPABASE_URL}/rest/v1/Student`,
      payload,
      {
        headers: { ...HEADERS, 'Prefer': 'return=minimal' },
        tags:    { name: 'reg_insert_student' },
      }
    );

    const inserted = check(insertRes, {
      'student inserted: 201': (r) => r.status === 201,
      'insert fast enough':    (r) => r.timings.duration < 5000,
    });

    if (inserted) registrations.add(1);

    registrationDuration.add(Date.now() - start);
    errorRate.add(inserted ? 0 : 1);
  });

  sleep(Math.random() * 5 + 3); // 3-8 ثوانٍ بعد التسجيل
}

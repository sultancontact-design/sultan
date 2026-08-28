# تقرير الأمان — Sultan AI OS
## Security Audit Report

---

## 1. ملخص التدقيق | Audit Summary

هذا التقرير يقدم مراجعة شاملة لنموذج الأمان في Sultan AI OS. يغطي المصادقة والتفويض وحماية البيانات وأمان وكلاء الذكاء الاصطناعي وإدارة المفاتيح السرية.

This report provides a comprehensive security model review for Sultan AI OS. It covers authentication, authorization, data protection, AI agent security, and secret management.

| المجال | الحالة | المستوى |
|--------|--------|---------|
| المصادقة (Authentication) | ✅ مُنفّذ | جيد |
| التفويض (Authorization) | ✅ مُنفّذ | جيد |
| حماية البيانات (Data Protection) | ✅ مُنفّذ | جيد |
| إدارة المفاتيح (Secret Management) | ✅ مُنفّذ | جيد |
| حماية AI (AI Security) | ✅ مُنفّذ | متوسط-جيد |
| أمان الشبكة (Network Security) | ✅ مُنفّذ | جيد |

---

## 2. المصادقة | Authentication

### 2.1 الإطار المستخدم | Framework Used

نظام المصادقة مبني على **next-auth** مع محول **Supabase Auth**. هذا الدمج يوفر:

- مصادقة قائمة على البريد الإلكتروني وكلمة المرور
- إدارة جلسات آمنة مع JWT tokens
- تحديث تلقائي للرموز المميزة المنتهية
- دعم OAuth قابلة للتوسيع لمزودي الهوية الخارجيين

### 2.2 آلية العمل | How It Works

1. المستخدم يُدخل البريد الإلكتروني وكلمة المرور في نموذج تسجيل الدخول
2. next-auth يُرسل البيانات إلى Supabase Auth للتحقق
3. عند النجاح، Supabase يُصدر JWT token و session token
4. next-auth يُنشئ جلسة مشفرة ويضعها في HttpOnly cookie
5. الطلبات اللاحقة تتضمن cookie تلقائياً للتحقق من الهوية

### 2.3 إعدادات الأمان | Security Configuration

```typescript
// إعدادات الجلسة الآمنة
const authOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 يوم
    updateAge: 24 * 60 * 60,    // تحديث يومي
  },
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,      // لا يمكن الوصول عبر JavaScript
        sameSite: 'lax',    // حماية CSRF
        path: '/',
        secure: true,       // HTTPS فقط
      },
    },
  },
};
```

### 2.4 تقييم المصادقة | Authentication Assessment

| المعيار | التقييم | التفاصيل |
|---------|---------|----------|
| تخزين كلمات المرور | ✅ آمن | Supabase يستخدم bcrypt مع salt |
| إدارة الجلسات | ✅ آمنة | HttpOnly cookies مع SameSite=lax |
| انتهاء الصلاحية | ✅ مُفعّل | 30 يوم للجلسة، تحديث يومي |
| حماية CSRF | ✅ مُفعّلة | SameSite cookies + CSRF tokens |
| تسجيل الخروج الكامل | ✅ مُتاح | حذف الجلسة من الخادم والعميل |

---

## 3. التفويض | Authorization

### 3.1 التفويض القائم على الأدوار | Role-Based Access Control (RBAC)

النظام يدعم ثلاثة أدوار أساسية:

| الدور | الرمز | الصلاحيات |
|-------|-------|-----------|
| **مدير** | `admin` | وصول كامل لجميع الوظائف والإعدادات |
| **مستخدم** | `user` | استخدام المنصة وإدارة محتواه الخاص |
| **زائر** | `guest` | تصفح المحتوى العام فقط |

### 3.2 جدار حماية صلاحيات AI | Permission Firewall for AI Agents

نظام فريد في Sultan AI OS يُطبّق نموذج تفويض صارم على وكلاء الذكاء الاصطناعي:

**المبدأ الأساسي**: كل وكيل AI له صلاحيات محددة مسبقاً ولا يمكنه تجاوزها، بغض النظر عن ما يطلبه المستخدم أو ما يقترحه الـ LLM.

**الآلية**:
1. كل طلب من وكيل AI يتضمن: هوية الوكيل + الإجراء المطلوب + البيانات
2. جدار الحماية يتحقق من أن الإجراء مُدرج في قائمة صلاحيات الوكيل
3. إذا كان الإجراء مصرحاً، يُنفّذ. إذا لم يكن، يُرفض مع تسجيل المحاولة
4. جميع عمليات الكتابة والحذف تتطلب صلاحية صريحة

```typescript
// مثال مبسط لمنطق جدار الحماية
function checkPermission(agent: AIAgent, action: string): boolean {
  const allowedPermissions = agent.permissions;
  return allowedPermissions.includes(action);
}

// مثال: وكيل السوق لا يمكنه حذف المستخدمين
// marketplace-expert.permissions = ['read', 'write:listing']
// checkPermission(agent, 'delete:user') → false ❌
```

### 3.3 Row Level Security | RLS Policies

جميع جداول Supabase المحمية تستخدم Row Level Security لضمان:

- المستخدم يستطيع قراءة بياناته الخاصة فقط
- البيانات العامة قابلة للقراءة من الجميع
- البيانات الإدارية محمية بدور admin فقط
- لا يمكن لأي مستخدم تعديل بيانات مستخدم آخر

**سياسات RLS المطلوبة لكل جدول محمي**:

```sql
-- مثال: سياسة قراءة القوائم
CREATE POLICY "Users can read public listings" ON listings
  FOR SELECT USING (is_public = true OR user_id = auth.uid());

-- مثال: سياسة كتابة القوائم
CREATE POLICY "Users can create own listings" ON listings
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- مثال: سياسة تحديث البيانات الشخصية
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (user_id = auth.uid());

-- مثال: سياسة إدارية
CREATE POLICY "Admins can manage everything" ON ai_models
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
  );
```

---

## 4. إدارة مفاتيح API | API Key Management

### 4.1 مبدأ الأمان | Security Principle

**مفاتيح API لا تظهر أبداً في الواجهة الأمامية.** جميع المفاتيح تُخزّن فقط في:
1. ملف `.env` على خادم التطوير (غير مُضمّن في Git)
2. متغيرات بيئة Cloudflare Pages (مشفرة في وحدة التحكم)
3. جدول `AiProviderSecret` في قاعدة البيانات (مشفرة بتشفير AES-256-GCM)

### 4.2 التشفير | Encryption

المفاتيح تُخزّن مشفرة في قاعدة البيانات باستخدام:

- **خوارزمية**: AES-256-GCM (معيار عسكري)
- **مفتاح التشفير**: مشتق من `ENCRYPTION_KEY` في متغيرات البيئة
- **Salt**: عشوائي لكل مفتاح (يمنع هجمات قوس القزح)
- **Initialization Vector (IV)**: فريد لكل عملية تشفير

```typescript
// آلية التشفير المستخدمة
async function encryptSecret(plaintext: string, key: string): Promise<EncryptedSecret> {
  const salt = crypto.randomBytes(16);
  const iv = crypto.randomBytes(12);
  const keyMaterial = await crypto.subtle.importKey(
    'raw', Buffer.from(key, 'hex'), 'PBKDF2', false, ['deriveKey']
  );
  const derivedKey = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    keyMaterial, { name: 'AES-GCM', length: 256 }, false, ['encrypt']
  );
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv }, derivedKey, Buffer.from(plaintext)
  );
  return { ciphertext: Buffer.from(encrypted).toString('base64'), iv: iv.toString('hex'), salt: salt.toString('hex') };
}
```

### 4.3 واجهة إدارة المفاتيح | Secret Management UI

مركز الأوامر الإداري (Admin Command Center) يتضمن لوحة **Secrets Panel** التي تتيح:
- إضافة مفاتيح API جديدة (تُشفّر فوراً قبل التخزين)
- عرض حالة المفاتيح (نشط/منتهي) دون إظهار القيمة
- تحديث المفاتيح (التشفير القديم يُحل محل الجديد)
- حذف المفاتيح (حذف نهائي من قاعدة البيانات)

### 4.4 تقييم إدارة المفاتيح | Key Management Assessment

| المعيار | الحالة | التفاصيل |
|---------|--------|----------|
| عدم وجود مفاتيح في Frontend | ✅ | جميع المفاتيح في Server-side فقط |
| تشفير في قاعدة البيانات | ✅ | AES-256-GCM مع PBKDF2 key derivation |
| عدم رفع المفاتيح لـ GitHub | ✅ | `.env` في `.gitignore` |
| تشفير في Cloudflare | ✅ | متغيرات البيئة قابلة للتشفير |
| تدوير المفاتيح | ⚠️ | مدعوم يدوياً، يمكن أتمتته مستقبلاً |

---

## 5. حماية XSS/CSRF/SSRF | XSS/CSRF/SSRF Protection

### 5.1 حماية XSS | Cross-Site Scripting Protection

Next.js 16 يوفر حماية مدمجة قوية ضد XSS:

- **React 19**: يتم تلقائياً تصفية (escape) جميع القيم في JSX. لا يمكن حقن HTML/JavaScript عبر المتغيرات.
- **Content Security Policy (CSP)**: يمكن تهيئتها في `next.config.ts` لمنع تنفيذ السكريبتات الخارجية.
- **No dangerouslySetInnerHTML**: المشروع لا يستخدم هذه الخاصية في أي مكون.

```typescript
// في next.config.ts — إعدادات الأمان المُوصى بها
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];
```

### 5.2 حماية CSRF | Cross-Site Request Forgery Protection

- **SameSite Cookies**: جميع جلسات next-auth تستخدم `SameSite=lax` لمنع إرسال الجلسة مع طلبات من مواقع خارجية.
- **CSRF Tokens**: next-auth يُصدر tokens مزدوجة (double-submit) لكل نموذج.
- **POST-only mutations**: جميع عمليات التعديل تستخدم POST/PUT/DELETE فقط.

### 5.3 حماية SSRF | Server-Side Request Forgery Protection

عندما يتواصل خادم Next.js مع مزودي AI الخارجيين:

- **URL Validation**: جميع عناوين API يتم التحقق منها مقابل قائمة بيضاء (whitelist) للمزودين المعتمدين.
- **No User-Controlled URLs**: المستخدم لا يمكنه تمرير عناوين URL عشوائية للخادم.
- **Timeout**: جميع الطلبات الخارجية لها حد زمني (timeout) لمنع هجمات الحجب.
- **No Internal Network Access**: الطلبات تُحصر على نطاقات المزودين المعتمدين فقط.

---

## 6. حماية حقن الأوامر لـ AI | Prompt Injection Protection

### 6.1 المخاطر | Risks

وكيلي AI يعالجون مدخلات المستخدم وقد يحتوي على محاولات حقن أوامر (prompt injection) مثل:
- تجاوز تعليمات النظام
- طلب بيانات حساسة
- محاولة تنفيذ إجراءات غير مصرح بها

### 6.2 طبقات الحماية | Protection Layers

**الطبقة الأولى: فصل السياق (Context Separation)**
- تعليمات النظام (system prompt) تُرسل بشكل منفصل عن مدخلات المستخدم
- استخدام أدوار (roles) واضحة في رسائل API

**الطبقة الثانية: جدار الحماية (Permission Firewall)**
- حتى لو نجح حقن الأوامر على LLM، لا يمكن تنفيذ إجراء غير مصرح به
- كل إجراء يمر عبر فحص الصلاحيات قبل التنفيذ

**الطبقة الثالثة: تصفية المدخلات (Input Sanitization)**
- المدخلات تُنظّف قبل إرسالها للنماذج
- إزالة الأوامر المخفية والأنماط المشبوهة

**الطبقة الرابعة: المراقبة (Observability)**
- جميع الطلبات غير المعتادة تُسجّل ويمكن مراجعتها
- أنماط الحقن المتكررة تُفعّل تنبيهات تلقائية

### 6.3 نظام صلاحيات الوكلاء | Agent Permission System

كل وكيل محصور بحدود صارمة:

| الوكيل | يمكنه | لا يمكنه |
|--------|--------|----------|
| Sultan Concierge | توجيه الطلبات، عرض المعلومات العامة | حذف بيانات، تعديل إعدادات |
| Marketplace Expert | قراءة القوائم، إنشاء قوائم جديدة | حذف قوائم أخرى، تعديل بيانات المستخدمين |
| Financial Analyst | قراءة البيانات المالية، تقديم تحليلات | تنفيذ معاملات مالية، الوصول لبطاقات الائتمان |
| Trust Verifier | قراءة التقييمات، تحديث تقييمات محددة | حذف تقييمات، تعديل هويات |
| Social Manager | قراءة المنشورات، إنشاء محتوى | حذف حسابات، إرسال رسائل باسم المستخدم |

---

## 7. إدارة الأسرار | Secret Management

### 7.1 التخزين المشفر | Encrypted at Rest

جميع البيانات الحساسة تُخزّن مشفرة:

| نوع البيانات | طريقة التخزين | طريقة التشفير |
|-------------|-------------|-------------|
| مفاتيح API | جدول `AiProviderSecret` | AES-256-GCM |
| كلمات المرور | Supabase Auth (داخلي) | bcrypt (hash فقط) |
| جلسات المستخدمين | HttpOnly Cookie | JWT (توقيع RS256) |
| بيانات الاعتماد | متغيرات بيئة | تشفير Cloudflare |

### 7.2 عدم التسريب | No Leakage

- **Frontend**: لا يحتوي على أي مفتاح أو سر. المتغيرات التي تبدأ بـ `NEXT_PUBLIC_` هي البيانات العامة فقط (URL، أسماء المشاريع).
- **GitHub**: ملف `.env` في `.gitignore`. لا توجد أسرار مُدمجة في الكود.
- **Logs**: مفاتيح API لا تُسجّل في السجلات. تُسجّل فقط معرفات المزودين والنماذج.
- **Network**: جميع الاتصالات عبر HTTPS. Cloudflare يُفعّل HSTS.

### 7.3 تقييم إدارة الأسرار | Secret Management Assessment

| المعيار | الحالة |
|---------|--------|
| الأسرار غير موجودة في الكود المصدري | ✅ |
| الأسرار غير موجودة في الواجهة الأمامية | ✅ |
| الأسرار مشفرة في قاعدة البيانات | ✅ |
| الأسرار مشفرة في Cloudflare | ✅ |
| لا تسريب في السجلات | ✅ |
| HTTPS إلزامي | ✅ |

---

## 8. التوصيات | Recommendations

### 8.1 توصيات ذات أولوية عالية | High Priority

1. **تفعيل RLS على جميع الجداول**: تأكد من تشغيل `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` على كل جدول في ملف التهجير.

2. **إعداد Content Security Policy**: أضف CSP headers صارمة في `next.config.ts` لمنع تحميل موارد من مصادر غير مصرح بها.

3. **تدوير مفاتيح API**: ضع جدول زمني لتغيير مفاتيح API كل 90 يوماً على الأقل.

4. **Rate Limiting**: أضف حدود معدل الطلبات (rate limiting) على جميع API routes لحماية من هجمات الحجب (DDoS).

### 8.2 توصيات ذات أولوية متوسطة | Medium Priority

5. **التدقيق الأمني الدوري**: أجرِ فحص أمني شامل كل 3 أشهر.

6. **إدارة الجلسات المتقدمة**: أضف كشف الجلسات المشبوهة (مثل تغيير IP أو User-Agent مفاجئ).

7. **تسجيل الأحداث الأمنية (Audit Logging)**: سجّل جميع محاولات الوصول المرفوضة والأفعال الإدارية.

8. **اختبار الاختراق (Penetration Testing)**: أجرِ اختبار اختراق احترافي قبل الإطلاق العام.

### 8.3 توصيات مستقبلية | Future Recommendations

9. **Web Application Firewall (WAF)**: فعّل Cloudflare WAF لحماية إضافية.

10. **Two-Factor Authentication (2FA)**: أضف المصادقة الثنائية (TOTP) لحسابات المديرين.

11. **AI Content Moderation**: أضف فلترة محتوى AI لمنع توليد محتوى ضار.

12. **Automated Secret Scanning**: فعّل GitHub Secret Scanning لمنع تسريب الأسرار عن طريق الخطأ.

---

## 9. الخلاصة | Conclusion

نظام Sultan AI OS يتبع ممارسات أمان حديثة وشاملة. نقاط القوة الرئيسية هي فصل الأسرار عن الواجهة الأمامية، وتشفير المفاتيح في قاعدة البيانات، وجدار حماية الصلاحيات الفريد لوكيلي AI. التوصيات المذكورة أعلاه ستعزز الأمان بشكل إضافي مع نضوج المنصة.

The Sultan AI OS follows modern and comprehensive security practices. Key strengths include secret isolation from the frontend, encrypted key storage in the database, and the unique Permission Firewall for AI agents. The recommendations above will further enhance security as the platform matures.

---

*تقرير الأمان — Sultan AI OS — الإصدار 1.0*
*Security Audit Report — Sultan AI OS — Version 1.0*
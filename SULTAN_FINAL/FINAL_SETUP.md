# دليل الإعداد النهائي — Sultan AI OS
## Final Setup Guide

---

## المتطلبات الأساسية | Prerequisites

قبل البدء، تأكد من توفر الأدوات التالية على جهازك:

- **Node.js** الإصدار 20 أو أحدث
- **npm** الإصدار 10 أو أحدث (يأتي مع Node.js)
- **Git** للنسخ من المستودع
- **حساب Supabase** لقاعدة البيانات والمصادقة والتخزين
- **حساب Cloudflare** لاستضافة الموقع
- **مفاتيح API** لمزودي الذكاء الاصطناعي (OpenAI, Anthropic, إلخ)

---

## الخطوة الأولى: استنساخ المشروع من GitHub
## Step 1: Clone the Repository from GitHub

انسخ المشروع من المستودع الرئيسي على GitHub إلى جهازك المحلي:

```bash
git clone https://github.com/sultancontact-design/sultan.git
cd sultan
```

هذا الأمر سيقوم بتنزيل جميع ملفات المشروع بما في ذلك:
- الكود المصدري الكامل في مجلد `src/`
- ملفات الإعداد (`next.config.ts`, `tailwind.config.ts`, `wrangler.jsonc`)
- مخطط قاعدة البيانات (`prisma/schema.prisma`)
- ملفات التهجير (`supabase/migrations/`)
- قالب متغيرات البيئة (`ENVIRONMENT.example`)
- جميع مكونات واجهة المستخدم (47 مكون shadcn/ui + مكونات Sultan المخصصة)
- جميع ملفات API routes (8 مسارات)
- مكتبة الذكاء الاصطناعي الكاملة (13 وكيل، 12 نموذج، 9 مزودين)

بعد الانتهاء من الاستنساخ، تحقق من أن جميع الملفات موجودة:

```bash
ls src/app/api/ai/  # يجب أن يعرض 8 مجلدات للمسارات
ls src/lib/ai/core/  # يجب أن يعرض types.ts, engine.ts, agent-registry.ts
```

---

## الخطوة الثانية: إنشاء ملف المتغيرات البيئية
## Step 2: Create the .env File from ENVIRONMENT.example

انسخ ملف القالب وأنشئ ملف `.env` الفعلي:

```bash
cp ENVIRONMENT.example .env
```

ثم افتح ملف `.env` وأضف قيمك الحقيقية. الملف يحتوي على المتغيرات التالية التي يجب تعبئتها:

### متغيرات Supabase | Supabase Variables

هذه المتغيرات ضرورية لتشغيل قاعدة البيانات والمصادقة:

- `NEXT_PUBLIC_SUPABASE_URL` — رابط مشروع Supabase (يبدأ بـ https://)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — مفتاح Anonymous العام من Supabase
- `SUPABASE_SERVICE_ROLE_KEY` — مفتاح الخدمة (سري، لا يُشارك أبداً)
- `SUPABASE_DB_URL` — رابط قاعدة البيانات المباشر (للتهييرات)

### متغيرات المصادقة | Auth Variables

- `NEXTAUTH_SECRET` — مفتاح سري لتشفير جلسات المستخدمين (أنشئه بـ `openssl rand -base64 32`)
- `NEXTAUTH_URL` — رابط الموقع (مثل https://sultan.pages.dev)

### مفاتيح مزودي AI | AI Provider API Keys

أضف مفاتيح API لكل مزود تريد استخدامه. يمكنك البدء بمزود واحد وإضافة الباقي لاحقاً:

- `OPENAI_API_KEY` — مفتاح OpenAI (لنماذج GPT-4o و GPT-4o-mini)
- `ANTHROPIC_API_KEY` — مفتاح Anthropic (لنماذج Claude)
- `GOOGLE_AI_API_KEY` — مفتاح Google AI (لنماذج Gemini)
- `XAI_API_KEY` — مفتاح xAI (لنماذج Grok)
- `DEEPSEEK_API_KEY` — مفتاح DeepSeek
- `MISTRAL_API_KEY` — مفتاح Mistral
- `GROQ_API_KEY` — مفتاح Groq
- `OPENROUTER_API_KEY` — مفتاح OpenRouter
- `CEREBRAS_API_KEY` — مفتاح Cerebras

> **تحذير أمني مهم**: لا تشارك ملف `.env` أبداً ولا ترفعه إلى GitHub. الملف مُدرج في `.gitignore`.
>
> **Important Security Warning**: Never share the `.env` file or push it to GitHub. It is listed in `.gitignore`.

---

## الخطوة الثالثة: إعداد قاعدة البيانات وتشغيل المشروع
## Step 3: Run Database Setup Then Start Development Server

### إعداد قاعدة البيانات | Database Setup

شغّل سكريبت إعداد قاعدة البيانات الذي سيقوم بـ:
- إنشاء جميع الجداول الـ 33 في Supabase PostgreSQL
- تفعيل Row Level Security (RLS) على الجداول المحمية
- إنشاء الفهارس اللازمة للأداء
- إدراج البيانات الأولية إذا وجدت

```bash
bash supabase/setup-db.sh
```

هذا السكريبت يستخدم `SUPABASE_DB_URL` من ملف `.env` للاتصال بقاعدة البيانات وتنفيذ ملف التهجير `supabase/migrations/00001_init.sql` الذي يحتوي على 639 سطر من أوامر SQL.

### تثبيت التبعيات وتشغيل المشروع | Install Dependencies and Run

بعد إعداد قاعدة البيانات بنجاح، ثبّت التبعيات وشغّل خادم التطوير:

```bash
npm install
npm run dev
```

سيبدأ خادم التطوير على العنوان `http://localhost:3000`. افتح المتصفح وتأكد من:
- الصفحة الرئيسية تظهر بشكل صحيح
- القائمة الجانبية تعمل مع جميع الأقسام الثمانية
- مركز الأوامر الإداري (Admin Command Center) يفتح ويظهر الألواح الخمسة
- مكون المحادثة الذكية (AI Concierge) يظهر ويستقبل الرسائل

---

## إعداد Cloudflare Pages | Cloudflare Pages Setup

بعد التأكد من أن المشروع يعمل محلياً، اتبع هذه الخطوات لنشره على Cloudflare Pages:

### 1. ربط المستودع | Connect GitHub Repository

1. اذهب إلى لوحة تحكم Cloudflare (dash.cloudflare.com)
2. اختر **Workers & Pages** من القائمة الجانبية
3. اضغط على **Create application** ثم **Pages**
4. اختر **Connect to Git**
5. اختر مستودع `sultancontact-design/sultan` من قائمة المستودعات
6. اضغط **Begin setup**

### 2. إعدادات البناء | Build Settings

في صفحة إعدادات البناء، أدخل القيم التالية:

| الإعداد | القيمة |
|---------|-------|
| **Framework preset** | Next.js (Static) |
| **Build command** | `npm run build` |
| **Build output directory** | `.next` |
| **Root directory** | `/` (الافتراضي) |

### 3. متغيرات البيئة | Environment Variables

أضف جميع المتغيرات من ملف `.env` (بدون علامات الاقتباس) في قسم **Environment variables**:

- اضغط **Add variable** لكل متغير
- أدخل الاسم (مثل `NEXT_PUBLIC_SUPABASE_URL`) والقيمة الحقيقية
- لا تختار **Encrypt** إلا للمتغيرات السرية (مفاتيح API، SERVICE_ROLE_KEY)
- أضف متغير `NODE_VERSION` بالقيمة `20`

### 4. النشر | Deploy

اضغط **Save and Deploy**. سيبدأ Cloudflare في:
1. سحب الكود من GitHub
2. تثبيت التبعيات
3. بناء المشروع مع Turbopack
4. نشر الملفات الثابتة على CDN العالمي

بعد اكتمال النشر (عادة دقيقتان)، سيكون موقعك متاحاً على:
- `https://sultan.pages.dev` (أو اسم المشروع الذي اخترته)

---

## التحقق من النشر | Deployment Verification

بعد النشر، تأكد من الآتي:

- [ ] الصفحة الرئيسية تُحمّل بدون أخطاء
- [ ] المصادقة تعمل (تسجيل الدخول والخروج)
- [ ] الأقسام الثمانية تظهر في القائمة الجانبية
- [ ] مركز أوامر الإدارة يفتح ويعرض البيانات
- [ ] محادثة AI تستجيب (تأكد من إضافة مفتاح API واحد على الأقل)
- [ ] ملف `wrangler.jsonc` مُهيأ بشكل صحيح

---

## حل المشاكل الشائعة | Troubleshooting

### مشكلة: خطأ في الاتصال بقاعدة البيانات
**الحل**: تأكد من أن `SUPABASE_DB_URL` صحيح وأن عنوان IP الخاص بك مُسموح في Supabase Dashboard → Settings → Database.

### مشكلة: أخطاء بناء Next.js على Cloudflare
**الحل**: تأكد من إضافة `NODE_VERSION=20` كمتغير بيئة. تأكد أيضاً من أن إصدار `@cloudflare/next-on-pages` متوافق.

### مشكلة: وكلاء AI لا يستجيبون
**الحل**: تأكد من إضافة مفتاح API واحد على الأقل في متغيرات البيئة. تحقق من صلاحية المفتاح في لوحة تحكم المزود.

### مشكلة: ملف `.env` غير موجود
**الحل**: تأكد من نسخ الملف بالأمر `cp ENVIRONMENT.example .env` وأنك في المجلد الصحيح.

---

*دليل الإعداد النهائي — Sultan AI OS — الإصدار 1.0*
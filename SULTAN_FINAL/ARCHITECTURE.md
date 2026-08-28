# Sultan AI OS — وثيقة البنية التقنية
## Sultan AI OS Architecture Document

---

## 1. الملخص التنفيذي | Executive Summary

**Sultan AI OS** هو نظام تشغيل ذكاء اصطناعي متكامل مبني على منصة Sultan الاجتماعية والتجارية. النظام يجمع بين ثمانية أقسام رئيسية (Marketplace، Marriage، Money، Business، Trust، Trends، Social، Media) ومحرك ذكاء اصطناعي يتكون من 13 وكيل AI مستقل مع مركز أوامر إداري شامل.

Sultan AI OS is a comprehensive artificial intelligence operating system built on top of the Sultan social and commercial platform. The system combines eight major platform sections with an AI engine consisting of 13 independent AI agents and a comprehensive admin command center.

### النقاط الرئيسية | Key Highlights

- **13 وكيل AI** يعملون بشكل متوازي مع نظام صلاحيات وصول متقدم
- **9 مزودي نماذج** (OpenAI, Anthropic, Google, xAI, DeepSeek, Mistral, Groq, OpenRouter, Cerebras)
- **12 نموذج AI** مُهيأ مع تسعير وقدرات محددة لكل نموذج
- **33 جدول قاعدة بيانات** (11 من المنصة الأصلية + 22 من نظام AI OS)
- **نظام توجيه ذكي** يحوّل الطلبات تلقائياً إلى النموذج الأنسب
- **جدار حماية صلاحيات** يمنع الوكلاء من تنفيذ إجراءات غير مصرح بها
- **محرك ذاكرة ومعرفة** لتتبع سياق المحادثات والبيانات المستمرة

---

## 2. حزمة التقنيات | Tech Stack

| التقنية | الإصدار | الغرض | الوصف بالعربي |
|---------|---------|-------|---------------|
| **Next.js** | 16.3.3 | Framework | إطار عمل الويب الرئيسي مع App Router و Server Actions |
| **React** | 19 | UI Library | مكتبة واجهة المستخدم مع ميزات التوافق الجديدة |
| **Tailwind CSS** | 4 | Styling | نظام التصميم مع متغيرات CSS الأصلية |
| **shadcn/ui** | latest | Components | مكتبة مكونات واجهة المستخدم القابلة للتخصيص |
| **Prisma** | latest | ORM | طبقة الوصول لقاعدة البيانات مع نوع TypeScript آمن |
| **Supabase** | latest | BaaS | قاعدة البيانات والمصادقة والتخزين والوقت الفعلي |
| **Cloudflare Pages** | — | Hosting | استضافة الإنتاج مع CDN عالمي وEdge Functions |
| **Zustand** | latest | State Mgmt | إدارة الحالة الخفيفة للمكونات التفاعلية |
| **Framer Motion** | latest | Animations | حركات وانتقالات واجهة المستخدم |
| **Recharts** | latest | Charts | المخططات البيانية للإحصائيات والتحليلات |
| **lucide-react** | latest | Icons | أيقونات SVG مُحسّنة لـ React |

### أدوات البناء والتطوير | Build & Dev Tools

- **Turbopack**: محرك بناء سريع مدمج مع Next.js 16
- **TypeScript**: لغة برمجة مع فحص الأنواع في وقت التجميع
- **ESLint**: فحص جودة الكود واكتشاف الأخطاء مبكراً
- **PostCSS**: معالج CSS متقدم مع دعم Tailwind CSS 4

---

## 3. مخطط البنية | System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    المستخدم | User (Browser)                     │
│              React 19 + Tailwind CSS 4 + shadcn/ui               │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTPS
┌────────────────────────────▼────────────────────────────────────┐
│              Cloudflare Pages (Edge CDN)                         │
│         Static Assets + Server-Side Rendering                    │
│         @cloudflare/next-on-pages Adapter                        │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                 Next.js 16 App Router                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │ Pages    │  │ API      │  │ Server   │  │ Middleware        │  │
│  │ (13      │  │ Routes   │  │ Actions  │  │ (Auth + RLS)     │  │
│  │ routes)  │  │ (8)      │  │          │  │                  │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                    Sultan AI OS Layer                            │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Admin Command Center                         │   │
│  │  ┌───────────┐ ┌──────────┐ ┌──────────┐ ┌────────────┐  │   │
│  │  │ Models Hub│ │ Providers│ │ AI Agents│ │  Secrets   │  │   │
│  │  │  Panel    │ │  Panel   │ │  Panel   │ │  Panel     │  │   │
│  │  └───────────┘ └──────────┘ └──────────┘ └────────────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌───────────────┐  ┌───────────────┐  ┌────────────────────┐   │
│  │ Agent Registry│  │ Model Router  │  │ Permission Firewall│   │
│  │ (13 Agents)   │  │ (Smart Fallback)│ │ (Access Control)  │   │
│  └───────────────┘  └───────────────┘  └────────────────────┘   │
│  ┌───────────────┐  ┌───────────────┐  ┌────────────────────┐   │
│  │ Memory &      │  │ Workflow      │  │ Observability      │   │
│  │ Knowledge     │  │ Engine        │  │ Stack              │   │
│  └───────────────┘  └───────────────┘  └────────────────────┘   │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                    Provider Registry                             │
│  ┌───────┐ ┌──────────┐ ┌───────┐ ┌───────┐ ┌──────────────┐   │
│  │OpenAI │ │ Anthropic│ │Google │ │  xAI  │ │  DeepSeek    │   │
│  └───────┘ └──────────┘ └───────┘ └───────┘ └──────────────┘   │
│  ┌───────┐ ┌───────┐ ┌──────────┐ ┌──────────┐                  │
│  │Mistral│ │ Groq  │ │OpenRouter│ │ Cerebras  │                  │
│  └───────┘ └───────┘ └──────────┘ └──────────┘                  │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                      Supabase                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │PostgreSQL│  │   Auth   │  │ Storage  │  │    Realtime      │  │
│  │(33 Tables)│ │ (next-  │  │ (Files,  │  │  (Subscriptions) │  │
│  │          │  │  auth)   │  │  Media)  │  │                  │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. طبقة Sultan AI OS | Sultan AI OS Layer

طبقة نظام التشغيل الذكي هي القلب النابض لمنصة Sultan. تم تصميمها كطبقة وسيطة مستقلة بين واجهة المستخدم ومزودي النماذج الخارجيين. تدير هذه الطبقة جميع عمليات الذكاء الاصطناعي من التوجيه والتحقق إلى المراقبة والتخزين.

The AI OS Layer is the core intelligence layer of the Sultan platform. It acts as an independent middleware layer between the user interface and external model providers, managing all AI operations from routing and validation to monitoring and storage.

### المكونات الأساسية | Core Components

1. **Agent Registry** — سجل مركزي لجميع وكلاء AI مع تعريفاتهم وقدراتهم
2. **Model Router** — موجه ذكي يختار النموذج الأنسب بناءً على نوع المهمة والتكلفة
3. **Permission Firewall** — جدار حماية يتحقق من صلاحيات كل وكيل قبل تنفيذ الإجراءات
4. **Memory & Knowledge** — نظام ذاكرة قصيرة وطويلة المدى مع قاعدة معرفة مشتركة
5. **Workflow Engine** — محرك سير عمل يربط عدة وكلاء معاً لتنفيذ مهام معقدة
6. **Observability Stack** — مكدس مراقبة يسجل جميع الأنشطة والأداء والتكاليف

---

## 5. وكلاء الذكاء الاصطناعي | AI Agents (13 Agent)

كل وكيل يمثل متخصصاً افتراضياً في مجال محدد. يتم تسجيلهم في Agent Registry مع تعريف قدراتهم وصلاحياتهم.

| # | الوكيل | الرمز | الوصف بالعربي | الصلاحيات |
|---|--------|-------|---------------|-----------|
| 1 | **Sultan Concierge** | `sultan-concierge` | الوجه الرئيسي للمنصة، يستقبل طلبات المستخدم ويوجهها للوكيل المناسب | قراءة، كتابة، توجيه |
| 2 | **Marketplace Expert** | `marketplace-expert` | متخصص في السوق، يدير القوائم والمنتجات والبحث التجاري | قراءة، كتابة القوائم |
| 3 | **Marriage Advisor** | `marriage-advisor` | مستشار الزواج، يساعد في البحث عن الشركاء وتقييم التوافق | قراءة الملفات، اقتراحات |
| 4 | **Financial Analyst** | `financial-analyst` | المحلل المالي، يقدم تقارير مالية وتحليلات الاستثمار | قراءة البيانات المالية |
| 5 | **Business Consultant** | `business-consultant` | مستشار الأعمال، يساعد في تخطيط وإدارة المشاريع | قراءة، كتابة الخطط |
| 6 | **Trust Verifier** | `trust-verifier` | موثق الثقة، يتحقق من الهويات والتقييمات والسمعة | قراءة، تحديث التقييمات |
| 7 | **Trends Analyst** | `trends-analyst` | محلل الاتجاهات، يرصد الترندات ويعرض تقارير تحليلية | قراءة البيانات، تقارير |
| 8 | **Social Manager** | `social-manager` | مدير العلاقات الاجتماعية، يدير المحتوى والتفاعل | قراءة، كتابة المنشورات |
| 9 | **Media Producer** | `media-producer` | منتج المحتوى الإعلامي، يصمم وينتج المحتوى المرئي والمكتوب | قراءة، كتابة المحتوى |
| 10 | **Job Matcher** | `job-matcher` | موظف الوظائف، يطابق الباحثين عن عمل مع الفرص المتاحة | قراءة، اقتراحات |
| 11 | **Auction Manager** | `auction-manager` | مدير المزادات، يدير عمليات المزايدة والبيع بالمزاد | قراءة، تحديث المزادات |
| 12 | **Food Guide** | `food-guide` | دليل الطعام، يقدم توصيات مطاعم ووصفات وأخبار غذائية | قراءة، توصيات |
| 13 | **Charity Coordinator** | `charity-coordinator` | منسق الأعمال الخيرية، يربط المتبرعين بالجمعيات | قراءة، تسهيل التبرع |

### هيكل تعريف الوكيل | Agent Definition Structure

كل وكيل مُعرّف بالهيكل التالي في Agent Registry:

```typescript
interface AIAgent {
  id: string;              // معرف فريد
  name: string;            // اسم الوكيل
  nameAr: string;          // الاسم بالعربية
  description: string;     // الوصف
  descriptionAr: string;   // الوصف بالعربية
  category: string;        // القسم التابع له
  capabilities: string[];  // القدرات المتاحة
  permissions: string[];   // الصلاحيات الممنوحة
  modelPreference: string; // النموذج المفضل
  status: 'active' | 'inactive' | 'maintenance';
  systemPrompt: string;    // تعليمات النظام
  tools: string[];         // الأدوات المتاحة
}
```

---

## 6. مركز النماذج وسجل المزودين | Model Hub & Provider Registry

### مركز النماذج | Model Hub

مركز النماذج هو الواجهة الإدارية لإدارة جميع نماذج الذكاء الاصطناعي. يعرض معلومات كل نموذج بما في ذلك السعر والقدرات والحالة.

The Model Hub is the administrative interface for managing all AI models. It displays information for each model including pricing, capabilities, and status.

### سجل المزودين | Provider Registry

سجل مركزي لجميع مزودي نماذج الذكاء الاصطناعي. يدعم حالياً 9 مزودين:

| المزود | المعرف | النماذج المدعومة | الاتصال |
|--------|--------|-----------------|---------|
| **OpenAI** | `openai` | GPT-4o, GPT-4o-mini, o1, o3-mini | REST API |
| **Anthropic** | `anthropic` | Claude 4 Sonnet, Claude 3.5 Haiku | REST API |
| **Google** | `google` | Gemini 2.5 Pro, Gemini 2.0 Flash | REST API |
| **xAI** | `xai` | Grok 3, Grok 3 Mini | REST API |
| **DeepSeek** | `deepseek` | DeepSeek V3, DeepSeek R1 | REST API |
| **Mistral** | `mistral` | Mistral Large, Mistral Small | REST API |
| **Groq** | `groq` | Llama 3.3 70B, Mixtral 8x7B | REST API |
| **OpenRouter** | `openrouter` | متعدد النماذج عبر واجهة واحدة | REST API |
| **Cerebras** | `cerebras` | Llama 3.3 70B (سريع جداً) | REST API |

### 12 نموذج مُهيأ | 12 Configured Models

| النموذج | المزود | السعر (لكل 1M token) | القدرة |
|---------|--------|---------------------|---------|
| GPT-4o | OpenAI | $2.50 / $10.00 | عامة متقدمة |
| GPT-4o-mini | OpenAI | $0.15 / $0.60 | سريع وموفر |
| Claude 4 Sonnet | Anthropic | $3.00 / $15.00 | تحليل وتفكير عميق |
| Claude 3.5 Haiku | Anthropic | $0.80 / $4.00 | سريع وذكي |
| Gemini 2.5 Pro | Google | $1.25 / $10.00 | سياق طويل جداً |
| Gemini 2.0 Flash | Google | $0.10 / $0.40 | سرعة فائقة |
| Grok 3 | xAI | $3.00 / $15.00 | بيانات حية |
| Grok 3 Mini | xAI | $0.30 / $0.50 | موفر ومتعدد |
| DeepSeek V3 | DeepSeek | $0.27 / $1.10 | اقتصادي وقوي |
| DeepSeek R1 | DeepSeek | $0.55 / $2.19 | تفكير منطقي |
| Llama 3.3 70B | Groq | $0.59 / $0.79 | سرعة تنفيذ |
| Llama 3.3 70B | Cerebras | $0.85 / $1.20 | أسرع تنفيذ |

---

## 7. منطق موجه النماذج | Model Router Logic

الموجه الذكي هو المكون المسؤول عن اختيار النموذج الأمثل لكل طلب. يعتمد على قواعد توجيه محددة مسبقاً مع سلاسل احتياطية تلقائية.

The Model Router is the component responsible for selecting the optimal model for each request. It relies on predefined routing rules with automatic fallback chains.

### قواعد التوجيه | Routing Rules

```
القاعدة 1: المهام العامة → Claude 4 Sonnet → GPT-4o → Gemini 2.5 Pro
القاعدة 2: الاستجابة السريعة → GPT-4o-mini → Claude 3.5 Haiku → Gemini 2.0 Flash
القاعدة 3: التحليل المالي → Claude 4 Sonnet → GPT-4o → DeepSeek R1
القاعدة 4: المحتوى الإبداعي → GPT-4o → Claude 4 Sonnet → Grok 3
القاعدة 5: التفكير المنطقي → DeepSeek R1 → Claude 4 Sonnet → o1
```

### منطق الاحتياطي | Fallback Logic

عند فشل النموذج الأساسي (خطأ في الشبكة، تجاوز الحد، عدم توفر)، ينتقل النظام تلقائياً إلى النموذج التالي في سلسلة الاحتياط. يتم تسجيل كل فشل في مكدس المراقبة.

```typescript
// مثال مبسط لمنطق التوجيه
async function routeRequest(task: Task): Promise<Response> {
  const rule = getRoutingRule(task.type);
  for (const modelId of rule.modelChain) {
    try {
      const provider = getProvider(modelId);
      return await provider.complete(task);
    } catch (error) {
      logObservability({ modelId, error, task });
      continue; // الانتقال للنموذج التالي
    }
  }
  throw new Error('All models in fallback chain failed');
}
```

---

## 8. جدار حماية الصلاحيات | Permission Firewall

جدار الحماية هو طبقة أمان حيوية تمنع وكلاء AI من تنفيذ إجراءات تتجاوز صلاحياتهم المحددة. كل طلب من وكيل يمر عبر هذا الجدار قبل التنفيذ.

The Permission Firewall is a critical security layer that prevents AI agents from executing actions beyond their defined permissions. Every agent request passes through this firewall before execution.

### آلية العمل | How It Works

1. **التحقق من الهوية**: تأكيد هوية الوكيل المُرسل
2. **فحص الصلاحية**: مقارنة الإجراء المطلوب بقائمة صلاحيات الوكيل
3. **التحقق من السياق**: التأكد من أن الطلب ضمن السياق الصحيح
4. **التسجيل**: تسجيل كل طلب ونتيجته لأغراض المراجعة
5. **السماح أو الرفض**: تنفيذ الإجراء أو إرجاع خطأ الصلاحية

### مستويات الصلاحيات | Permission Levels

| المستوى | الرمز | الوصف |
|---------|-------|-------|
| `read` | قراءة | الوصول للبيانات فقط دون تعديل |
| `write` | كتابة | إنشاء محتوى وبيانات جديدة |
| `delete` | حذف | حذف البيانات والمحتوى |
| `admin` | إدارة | الوصول الكامل لجميع العمليات |
| `route` | توجيه | توجيه الطلبات لوكلاء آخرين |
| `suggest` | اقتراح | تقديم اقتراحات دون تنفيذ مباشر |

---

## 9. نظام الذاكرة والمعرفة | Memory & Knowledge System

نظام متكامل لإدارة الذاكرة والمعرفة يدعم عمليات الذكاء الاصطناعي. يتكون من طبقتين رئيسيتين:

### الذاكرة قصيرة المدى | Short-Term Memory

- **سياق المحادثة**: آخر N رسائل في كل محادثة
- **الجلسة الحالية**: بيانات المستخدم المؤقتة خلال الجلسة
- **المهام النشطة**: قائمة المهام قيد التنفيذ حالياً

### الذاكرة طويلة المدى | Long-Term Memory

- **تاريخ المستخدم**: التفضيلات والتفاعلات السابقة
- **قاعدة المعرفة**: معلومات منظمة عن المجالات المختلفة
- **نتائج التحليلات**: تقارير وتحليلات مخزنة للرجوع إليها

### التخزين | Storage

الذاكرة طويلة المدى تُخزن في Supabase PostgreSQL عبر جداول مخصصة في الـ 33 جدول:
- `AiMemory` — ذاكرة المحادثات
- `AiKnowledge` — قاعدة المعرفة
- `AiConversation` — سجل المحادثات الكاملة

---

## 10. محرك سير العمل | Workflow Engine

محرك سير العمل يربط عدة وكلاء معاً لتنفيذ مهام معقدة تتطلب تعاوناً بين متخصصين مختلفين.

The Workflow Engine connects multiple agents to execute complex tasks that require collaboration between different specialists.

### أنواع سير العمل | Workflow Types

1. **خطي**: وكيل A → وكيل B → وكيل C (تسلسلي)
2. **موازي**: عدة وكلاء يعملون بشكل متزامن
3. **مشروط**: التفرع بناءً على شروط محددة
4. **حلقي**: تكرار حتى تحقيق شرط معين

### مثال عملي | Practical Example

```
مهمة: تحليل فرصة استثمار جديدة
1. Marketplace Expert → جمع بيانات المنتج والسوق
2. Financial Analyst → تحليل الأرقام والجدوى المالية
3. Trust Verifier → التحقق من سمعة البائع
4. Sultan Concierge → تجميع النتائج وتقديم التوصية النهائية
```

---

## 11. مكدس المراقبة | Observability Stack

نظام مراقبة شامل يتتبع جميع عمليات الذكاء الاصطناعي من الطلب إلى الاستجابة.

### المؤشرات المسجلة | Tracked Metrics

- **Latency**: زمن الاستجابة لكل طلب
- **Token Usage**: عدد الـ tokens المستهلكة (مدخلات ومخرجات)
- **Cost**: التكلفة الفعلية لكل طلب بالدولار
- **Model Accuracy**: دقة الاستجابات (تقييم المستخدم)
- **Error Rate**: معدل الأخطاء لكل نموذج ومزود
- **Agent Performance**: أداء كل وكيل على حدة

### نقاط النهاية | Endpoints

- `POST /api/ai/observability` — تسجيل بيانات المراقبة
- `GET /api/ai/observability` — استعلام عن المؤشرات

---

## 12. نموذج الأمان | Security Model

### المصادقة | Authentication
- **next-auth** مع محول Supabase للمصادقة
- دعم البريد الإلكتروني وكلمات المرور
- JWT tokens مع انتهاء صلاحية
- جلسات آمنة مع HttpOnly cookies

### التفويض | Authorization
- أدوار المستخدمين: admin, user, guest
- Row Level Security (RLS) في Supabase
- Permission Firewall لوكيلي AI

### حماية البيانات | Data Protection
- تشفير البيانات الحساسة في قاعدة البيانات
- مفاتيح API مشفرة ولا تظهر في الواجهة الأمامية
- HTTPS إلزامي عبر Cloudflare
- Content Security Policy (CSP).headers

---

## 13. أقسام المنصة | Platform Sections

### 13.1 السوق | Marketplace
قسم التجارة الإلكترونية الرئيسي. يتيح للمستخدمين عرض وبيع وشراء المنتجات والخدمات. يدعم البحث والتصفية والتصنيفات المتعددة.

### 13.2 الزواج | Marriage
منصة التوافق الزواجي المحترمة. تساعد في البحث عن شريك الحياة بناءً على معايير محددة مع مراعاة الخصوصية والاحترام.

### 13.3 المال | Money
مركز الإدارة المالية. يقدم تقارير مالية وتحليلات استثمارية مع تتبع المصروفات والإيرادات.

### 13.4 الأعمال | Business
قسم إدارة الأعمال والمشاريع. يساعد في تخطيط المشاريع الجديدة وإدارتها مع أدوات تحليل السوق.

### 13.5 الثقة | Trust
نظام التقييم والسمعة. يتحقق من هويات المستخدمين ويبني سجل سمعة شفاف يعتمد على التقييمات الحقيقية.

### 13.6 الاتجاهات | Trends
مركز رصد الترندات. يعرض آخر الاتجاهات في مختلف المجالات مع تحليلات ذكية مدعومة بالذكاء الاصطناعي.

### 13.7 الاجتماعي | Social
الشبكة الاجتماعية. تتيح التواصل والتفاعل بين المستخدمين مع ميزات النشر والتعليق والمشاركة.

### 13.8 الإعلام | Media
قسم الإعلام والمحتوى. يضم الأخبار والمقالات والمحتوى المرئي والمسموع مع إمكانية النشر والإنتاج.

---

## 14. بنية النشر | Deployment Architecture

### سير النشر | Deployment Pipeline

```
المطور ← GitHub Push ←←←←←←←←←←←←←←←←←←←←←←←←←←┐
    │                                                   │
    ▼                                                   │
GitHub Repository                                       │
sultancontact-design/sultan                              │
    │                                                   │
    ▼                                                   │
GitHub Webhook ──→ Cloudflare Pages Build              │
    │              (npm run build)                       │
    ▼                                                   │
Cloudflare Pages CDN                                    │
    │              ┌────────────────────────┐           │
    └─────────────→│  Supabase (Backend)    │←──────────┘
                   │  - PostgreSQL Database  │
                   │  - Auth Service        │
                   │  - Object Storage      │
                   │  - Realtime Engine     │
                   └────────────────────────┘
```

### البيئة | Environment

| المكون | الخدمة | التفاصيل |
|--------|--------|---------|
| Frontend Hosting | Cloudflare Pages | CDN عالمي، Edge Rendering |
| Database | Supabase PostgreSQL | 33 جدول، RLS مُفعّل |
| Authentication | Supabase Auth | بريد إلكتروني + كلمة مرور |
| File Storage | Supabase Storage | صور، ملفات، وسائط |
| Realtime | Supabase Realtime | إشعارات فورية، تحديثات حية |
| Source Control | GitHub | sultancontact-design/sultan |
| CI/CD | Cloudflare Pages | بناء تلقائي عند كل push |

### إعدادات Cloudflare Pages | Cloudflare Pages Configuration

- **Build Command**: `npm run build`
- **Build Output Directory**: `.next`
- **Node.js Version**: 20+
- **Adapter**: `@cloudflare/next-on-pages`
- **Configuration File**: `wrangler.jsonc`

---

## 15. هيكل الملفات | File Structure (Key Files)

```
SULTAN_FINAL/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # التخطيط الرئيسي
│   │   ├── page.tsx                # الصفحة الرئيسية
│   │   ├── globals.css             # الأنماط العالمية
│   │   └── api/
│   │       ├── route.ts            # API root
│   │       ├── listings/route.ts   # قوائم السوق
│   │       └── ai/
│   │           ├── chat/route.ts       # محادثة AI
│   │           ├── models/route.ts     # إدارة النماذج
│   │           ├── agents/route.ts     # إدارة الوكلاء
│   │           ├── providers/route.ts  # إدارة المزودين
│   │           ├── secrets/route.ts    # إدارة المفاتيح
│   │           ├── tasks/route.ts      # إدارة المهام
│   │           ├── search/route.ts     # بحث AI
│   │           └── observability/route.ts # المراقبة
│   ├── components/
│   │   ├── ui/                    # مكونات shadcn/ui (47 مكون)
│   │   └── sultan/                # مكونات Sultan المخصصة
│   │       ├── HomeView.tsx
│   │       ├── MarketplaceView.tsx
│   │       ├── MarriageView.tsx
│   │       ├── SultanMoney.tsx
│   │       ├── BusinessView.tsx
│   │       ├── TrustView.tsx
│   │       ├── TrendsView.tsx
│   │       ├── AdminView.tsx
│   │       ├── AdminCommandCenter.tsx
│   │       ├── SultanAIConcierge.tsx
│   │       └── ...
│   ├── lib/
│   │   ├── ai/
│   │   │   ├── core/
│   │   │   │   ├── types.ts           # أنواع AI الأساسية
│   │   │   │   ├── engine.ts          # محرك AI الرئيسي
│   │   │   │   └── agent-registry.ts  # سجل الوكلاء
│   │   │   ├── providers/
│   │   │   │   └── provider-registry.ts # سجل المزودين
│   │   │   └── tools/
│   │   │       └── tool-definitions.ts  # تعريفات الأدوات
│   │   ├── store.ts               # Zustand store
│   │   ├── db.ts                  # Prisma client
│   │   ├── supabase.ts            # Supabase client
│   │   └── utils.ts               # أدوات مساعدة
│   └── hooks/                     # React hooks مخصصة
├── prisma/
│   └── schema.prisma              # مخطط قاعدة البيانات (33 نموذج)
├── supabase/
│   ├── migrations/
│   │   └── 00001_init.sql         # تهيئة قاعدة البيانات (639 سطر)
│   └── setup-db.sh                # سكريبت إعداد قاعدة البيانات
├── wrangler.jsonc                 # إعدادات Cloudflare
├── next.config.ts                 # إعدادات Next.js
├── tailwind.config.ts             # إعدادات Tailwind CSS
├── ENVIRONMENT.example            # قالب متغيرات البيئة
└── package.json                   # تبعيات المشروع
```

---

*وثيقة البنية التقنية — Sultan AI OS — الإصدار 1.0*
*Architecture Document — Sultan AI OS — Version 1.0*
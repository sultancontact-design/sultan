// ═══════════════════════════════════════════════════════════════════
// SULTAN ECONOMY — Constants & Defaults
// ═══════════════════════════════════════════════════════════════════════════════

import type { SupportOption, SupportMessage, CoinPackage, EconomyRule, FeatureFlag, AudienceSegment } from './types';

// ─── Support Presets ─────────────────────────────────────────────────────────

export const SUPPORT_PRESETS: SupportOption[] = [
  { amount: 50 },
  { amount: 100 },
  { amount: 500 },
  { amount: 1000 },
  { amount: 5000 },
  { amount: 10000 },
  { amount: 0, isCustom: true },
];

export const SUPPORT_MESSAGES: SupportMessage[] = [
  { id: 's1', textAr: 'أعجبني ما قدمته' },
  { id: 's2', textAr: 'شكرًا' },
  { id: 's3', textAr: 'أدعم فكرتك' },
  { id: 's4', textAr: 'تستحق' },
  { id: 's5', textAr: 'أدعم موهبتك' },
];

// ─── Coin Packages (MAD) ────────────────────────────────────────────────────

export const COIN_PACKAGES: CoinPackage[] = [
  { id: 'pkg-1', coins: 100,   priceMAD: 10,    bonus: 0,    popular: false, label: '100 عملة' },
  { id: 'pkg-2', coins: 500,   priceMAD: 45,    bonus: 25,   popular: false, label: '500 عملة + 25 مجاناً' },
  { id: 'pkg-3', coins: 1000,  priceMAD: 85,    bonus: 75,   popular: true,  label: '1,000 عملة + 75 مجاناً' },
  { id: 'pkg-4', coins: 5000,  priceMAD: 400,   bonus: 500,  popular: false, label: '5,000 عملة + 500 مجاناً' },
  { id: 'pkg-5', coins: 10000, priceMAD: 750,   bonus: 1500, popular: false, label: '10,000 عملة + 1,500 مجاناً' },
  { id: 'pkg-6', coins: 50000, priceMAD: 3500,  bonus: 5000, popular: false, label: '50,000 عملة + 5,000 مجاناً' },
];

// ─── Default Economy Rules ──────────────────────────────────────────────────

export const DEFAULT_ECONOMY_RULES: EconomyRule[] = [
  { id: 'rule-1', key: 'coin_purchase_rate', value: 10, label: 'Coin Purchase Rate', labelAr: 'سعر الشراء (SC لكل MAD)', description: 'عدد العملات لكل درهم', category: 'coins', version: 1, updatedBy: null, updatedAt: new Date().toISOString(), previousValue: null, changeReason: null },
  { id: 'rule-2', key: 'reward_conversion_rate', value: 0.7, label: 'Reward Conversion Rate', labelAr: 'نسبة تحويل المكافآت', description: 'نسبة SC التي تتحول إلى SR', category: 'rewards', version: 1, updatedBy: null, updatedAt: new Date().toISOString(), previousValue: null, changeReason: null },
  { id: 'rule-3', key: 'platform_fee_percent', value: 5, label: 'Platform Fee', labelAr: 'رسوم المنصة (%)', description: 'نسبة رسوم المنصة من عمليات الدعم', category: 'commission', version: 1, updatedBy: null, updatedAt: new Date().toISOString(), previousValue: null, changeReason: null },
  { id: 'rule-4', key: 'recipient_share_percent', value: 95, label: 'Recipient Share', labelAr: 'حصة المستلم (%)', description: 'نسبة ما يصل للمستلم من الدعم', category: 'support', version: 1, updatedBy: null, updatedAt: new Date().toISOString(), previousValue: null, changeReason: null },
  { id: 'rule-5', key: 'min_cashout_sr', value: 500, label: 'Minimum Cashout (SR)', labelAr: 'الحد الأدنى للسحب (SR)', description: 'الحد الأدنى من SR المؤهل للسحب', category: 'cashout', version: 1, updatedBy: null, updatedAt: new Date().toISOString(), previousValue: null, changeReason: null },
  { id: 'rule-6', key: 'max_cashout_sr', value: 50000, label: 'Maximum Cashout (SR)', labelAr: 'الحد الأقصى للسحب (SR)', description: 'الحد الأقصى للسحب في عملية واحدة', category: 'cashout', version: 1, updatedBy: null, updatedAt: new Date().toISOString(), previousValue: null, changeReason: null },
  { id: 'rule-7', key: 'cashout_frequency_days', value: 7, label: 'Cashout Frequency', labelAr: 'فترة السحب (أيام)', description: 'الحد الأدنى بين طلبين للسحب', category: 'cashout', version: 1, updatedBy: null, updatedAt: new Date().toISOString(), previousValue: null, changeReason: null },
  { id: 'rule-8', key: 'pending_period_days', value: 7, label: 'Pending Period', labelAr: 'فترة الانتظار (أيام)', description: 'أيام الانتظار قبل توفير المكافآت', category: 'rewards', version: 1, updatedBy: null, updatedAt: new Date().toISOString(), previousValue: null, changeReason: null },
  { id: 'rule-9', key: 'risk_threshold_low', value: 30, label: 'Risk Threshold - Low', labelAr: 'حد المخاطر - منخفض', description: 'أقل من هذا = منخفض', category: 'risk', version: 1, updatedBy: null, updatedAt: new Date().toISOString(), previousValue: null, changeReason: null },
  { id: 'rule-10', key: 'risk_threshold_medium', value: 60, label: 'Risk Threshold - Medium', labelAr: 'حد المخاطر - متوسط', description: 'أقل من هذا = متوسط', category: 'risk', version: 1, updatedBy: null, updatedAt: new Date().toISOString(), previousValue: null, changeReason: null },
  { id: 'rule-11', key: 'risk_threshold_high', value: 80, label: 'Risk Threshold - High', labelAr: 'حد المخاطر - عالي', description: 'أقل من هذا = عالي', category: 'risk', version: 1, updatedBy: null, updatedAt: new Date().toISOString(), previousValue: null, changeReason: null },
  { id: 'rule-12', key: 'support_limit_daily', value: 50000, label: 'Daily Support Limit', labelAr: 'حد الدعم اليومي (SC)', description: 'الحد الأقصى للدعم المرسل يومياً', category: 'support', version: 1, updatedBy: null, updatedAt: new Date().toISOString(), previousValue: null, changeReason: null },
  { id: 'rule-13', key: 'support_limit_new_account', value: 5000, label: 'New Account Support Limit', labelAr: 'حد دعم الحسابات الجديدة (SC)', description: 'الحد اليومي لحساب أقل من 30 يوم', category: 'support', version: 1, updatedBy: null, updatedAt: new Date().toISOString(), previousValue: null, changeReason: null },
  { id: 'rule-14', key: 'boost_price_profile_7d', value: 500, label: 'Profile Boost 7 Days', labelAr: 'تعزيز الملف 7 أيام (SC)', description: 'سعر تعزيز الملف الشخصي لمدة 7 أيام', category: 'campaign', version: 1, updatedBy: null, updatedAt: new Date().toISOString(), previousValue: null, changeReason: null },
  { id: 'rule-15', key: 'boost_price_profile_30d', value: 1500, label: 'Profile Boost 30 Days', labelAr: 'تعزيز الملف 30 يوم (SC)', description: 'سعر تعزيز الملف الشخصي لمدة 30 يوم', category: 'campaign', version: 1, updatedBy: null, updatedAt: new Date().toISOString(), previousValue: null, changeReason: null },
  { id: 'rule-16', key: 'featured_price_7d', value: 1000, label: 'Featured 7 Days', labelAr: 'تثبيت مميز 7 أيام (SC)', description: 'سعر التثبيت المميز لمدة 7 أيام', category: 'campaign', version: 1, updatedBy: null, updatedAt: new Date().toISOString(), previousValue: null, changeReason: null },
  { id: 'rule-17', key: 'grant_max_per_user_monthly', value: 3, label: 'Grant Max Per User/Month', labelAr: 'الحد الأقصى للمنح شهرياً', description: 'الحد الأقصى للمنح التي يمكن للمستخدم تلقيها شهرياً', category: 'grant', version: 1, updatedBy: null, updatedAt: new Date().toISOString(), previousValue: null, changeReason: null },
];

// ─── Feature Flags ──────────────────────────────────────────────────────────

export const DEFAULT_FEATURE_FLAGS: FeatureFlag[] = [
  { key: 'economy_enabled', label: 'Economy', labelAr: 'الاقتصاد', description: 'تفعيل نظام الاقتصاد الرقمي بالكامل', enabled: true, category: 'economy' },
  { key: 'support_enabled', label: 'Support', labelAr: 'الدعم', description: 'تفعيل زر الدعم في جميع الأقسام', enabled: true, category: 'support' },
  { key: 'rewards_enabled', label: 'Rewards', labelAr: 'المكافآت', description: 'تفعيل نظام المكافآت', enabled: true, category: 'rewards' },
  { key: 'cashout_enabled', label: 'Cashout', labelAr: 'السحب', description: 'تفعيل سحب المكافآت', enabled: false, category: 'cashout' },
  { key: 'grants_enabled', label: 'Grants', labelAr: 'المنح', description: 'تفعيل نظام المنح', enabled: true, category: 'grants' },
  { key: 'tasks_enabled', label: 'Tasks', labelAr: 'المهام', description: 'تفعيل المهام المصغرة', enabled: true, category: 'tasks' },
  { key: 'bounties_enabled', label: 'Bounties', labelAr: 'الجوائز', description: 'تفعيل نظام الجوائز', enabled: true, category: 'bounties' },
  { key: 'challenges_enabled', label: 'Challenges', labelAr: 'التحديات', description: 'تفعيل نظام التحديات', enabled: true, category: 'challenges' },
  { key: 'growth_campaigns_enabled', label: 'Growth Campaigns', labelAr: 'حملات النمو', description: 'تفعيل حملات النمو والتعزيز', enabled: true, category: 'growth' },
  { key: 'news_rewards_enabled', label: 'News Rewards', labelAr: 'مكافآت الأخبار', description: 'تفعيل مكافآت المحتوى الإخباري', enabled: false, category: 'news' },
  { key: 'business_boost_enabled', label: 'Business Boost', labelAr: 'تعزيز الأعمال', description: 'تفعيل تعزيز الحسابات التجارية', enabled: true, category: 'business' },
  { key: 'diaspora_enabled', label: 'Diaspora', labelAr: 'المغاربة بالخارج', description: 'تفعيل ميزات الجالية المغربية', enabled: true, category: 'diaspora' },
];

// ─── Audience Segments ──────────────────────────────────────────────────────

export const AUDIENCE_SEGMENTS: { value: AudienceSegment; label: string }[] = [
  { value: 'morocco', label: 'المغرب' },
  { value: 'moroccan_diaspora', label: 'الجالية المغربية' },
  { value: 'france', label: 'فرنسا' },
  { value: 'spain', label: 'إسبانيا' },
  { value: 'belgium', label: 'بلجيكا' },
  { value: 'netherlands', label: 'هولندا' },
  { value: 'canada', label: 'كندا' },
  { value: 'other', label: 'أخرى' },
];

// ─── Moroccan Categories ────────────────────────────────────────────────────

export const OPPORTUNITY_CATEGORIES = [
  'التجارة', 'الخدمات', 'العمل الحر', 'السياحة', 'الحرف', 'الأغذية',
  'التكنولوجيا', 'التصميم', 'التسويق', 'التعليم', 'النقل', 'العقارات',
  'الفعاليات', 'المهام المحلية',
];

export const MOROCCAN_CITIES = [
  'الدار البيضاء', 'الرباط', 'فاس', 'مراكش', 'طنجة', 'أكادير', 'مكناس', 'وجدة',
  'القنيطرة', 'تطوان', 'سلا', 'الجديدة', 'الناظور', 'بني ملال', 'خريبكة', 'تازة',
];

// ─── Integration Status ─────────────────────────────────────────────────────

export const INTEGRATION_PROVIDERS = {
  payment: { provider: 'Payment Gateway', configured: false, mode: 'mock' as const, type: 'payment' as const, lastChecked: new Date().toISOString() },
  cashout: { provider: 'Payout Provider', configured: false, mode: 'mock' as const, type: 'cashout' as const, lastChecked: new Date().toISOString() },
  kyc: { provider: 'KYC Provider', configured: false, mode: 'mock' as const, type: 'kyc' as const, lastChecked: new Date().toISOString() },
};

// ─── Announcements ──────────────────────────────────────────────────────────

export const ANNOUNCEMENT_TYPES = [
  'sultan_supported',
  'sultan_rising',
  'grant_recipient',
  'featured_member',
  'new_opportunity',
  'campaign',
  'news_alert',
  'business_spotlight',
] as const;

// ─── Cashout Status Labels ──────────────────────────────────────────────────

export const CASHOUT_STATUS_LABELS: Record<string, { label: string; color: string; bgColor: string }> = {
  requested: { label: 'مطلوب', color: 'text-blue-400', bgColor: 'bg-blue-400/10' },
  pending: { label: 'قيد الانتظار', color: 'text-yellow-400', bgColor: 'bg-yellow-400/10' },
  risk_review: { label: 'مراجعة المخاطر', color: 'text-orange-400', bgColor: 'bg-orange-400/10' },
  kyc_review: { label: 'مراجعة الهوية', color: 'text-purple-400', bgColor: 'bg-purple-400/10' },
  approved: { label: 'موافق عليه', color: 'text-green-400', bgColor: 'bg-green-400/10' },
  processing: { label: 'جاري المعالجة', color: 'text-cyan-400', bgColor: 'bg-cyan-400/10' },
  paid: { label: 'مدفوع', color: 'text-emerald-400', bgColor: 'bg-emerald-400/10' },
  rejected: { label: 'مرفوض', color: 'text-red-400', bgColor: 'bg-red-400/10' },
  cancelled: { label: 'ملغى', color: 'text-gray-400', bgColor: 'bg-gray-400/10' },
  frozen: { label: 'مجمد', color: 'text-blue-300', bgColor: 'bg-blue-300/10' },
};

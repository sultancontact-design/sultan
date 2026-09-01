'use client'

import { motion } from 'framer-motion'
import {
  Users,
  FileText,
  Gavel,
  Banknote,
  DollarSign,
  Activity,
  HeartPulse,
  TicketCheck,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Zap,
  Server,
  Database,
  HardDrive,
  Mail,
  Bell,
  Search,
  Shield,
  Trash2,
  Star,
  Wallet,
  Flag,
  Settings,
  GavelIcon,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts'
import { Badge } from '@/components/ui/badge'
import {
  adminStats,
  adminChartData,
  adminSystemHealth,
  adminAuditLog,
  adminReports,
} from '@/lib/seed-data'
import { useSultanStore } from '@/lib/store'

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
const fmt = (n: number) => n.toLocaleString('ar-EG')

const pendingReports = adminReports.filter(
  (r) => r.status === 'pending' || r.status === 'under_review'
).length

const latestRevenue = adminChartData.revenue[adminChartData.revenue.length - 1]
const prevRevenue = adminChartData.revenue[adminChartData.revenue.length - 2]
const revenueTrend = prevRevenue
  ? (((latestRevenue.amount - prevRevenue.amount) / prevRevenue.amount) * 100).toFixed(1)
  : '0'

const relativeTime = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'الآن'
  if (mins < 60) return `منذ ${fmt(mins)} دقيقة`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `منذ ${fmt(hrs)} ساعة`
  const days = Math.floor(hrs / 24)
  return `منذ ${fmt(days)} يوم`
}

const severityConfig: Record<
  string,
  { color: string; bg: string; icon: React.ElementType }
> = {
  high: { color: 'text-red-400', bg: 'bg-red-500/15', icon: Trash2 },
  medium: { color: 'text-amber-400', bg: 'bg-amber-500/15', icon: Shield },
  low: { color: 'text-emerald-400', bg: 'bg-emerald-500/15', icon: Star },
}

const serviceIcons: Record<string, React.ElementType> = {
  'الخادم الرئيسي': Server,
  'قاعدة البيانات': Database,
  التخزين: HardDrive,
  'البريد الإلكتروني': Mail,
  الإشعارات: Bell,
  البحث: Search,
}

const serviceColorMap: Record<string, string> = {
  operational: 'bg-emerald-500',
  degraded: 'bg-amber-500',
  down: 'bg-red-500',
}

const barColors = [
  '#D4AF37',
  '#34d399',
  '#F59E0B',
  '#D4AF37',
  '#34d399',
  '#F59E0B',
  '#D4AF37',
  '#34d399',
]

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface OverviewPanelProps {
  onNavigate?: (panel: string) => void
}

/* ------------------------------------------------------------------ */
/*  KPI Data                                                           */
/* ------------------------------------------------------------------ */
const kpiCards = [
  {
    label: 'إجمالي المستخدمين',
    value: fmt(adminStats.totalUsers),
    icon: Users,
    iconBg: 'bg-[#D4AF37]/15',
    iconColor: 'text-[#D4AF37]',
    trend: '+12.5%',
    trendUp: true,
    sub: 'مستخدم مسجّل',
  },
  {
    label: 'إجمالي الإعلانات',
    value: fmt(adminStats.totalListings),
    icon: FileText,
    iconBg: 'bg-emerald-500/15',
    iconColor: 'text-emerald-400',
    trend: `+${fmt(adminStats.todayListings)} اليوم`,
    trendUp: true,
    sub: 'إعلان منشور',
  },
  {
    label: 'المزادات النشطة',
    value: fmt(adminStats.activeAuctions),
    icon: Gavel,
    iconBg: 'bg-amber-500/15',
    iconColor: 'text-amber-400',
    trend: null,
    trendUp: true,
    sub: 'مزاد جارٍ',
  },
  {
    label: 'طلبات السحب',
    value: fmt(adminStats.pendingCashouts),
    icon: Banknote,
    iconBg: 'bg-orange-500/15',
    iconColor: 'text-orange-400',
    trend: 'بانتظار المراجعة',
    trendUp: false,
    sub: 'طلب معلّق',
  },
  {
    label: 'الإيرادات الشهرية',
    value: `${fmt(latestRevenue.amount)} ر.م`,
    icon: DollarSign,
    iconBg: 'bg-[#F0D060]/15',
    iconColor: 'text-[#F0D060]',
    trend: `+${revenueTrend}%`,
    trendUp: true,
    sub: 'درهم',
  },
  {
    label: 'المستخدمون النشطون',
    value: fmt(adminStats.activeUsers),
    icon: Activity,
    iconBg: 'bg-emerald-500/15',
    iconColor: 'text-emerald-400',
    trend: `${((adminStats.activeUsers / adminStats.totalUsers) * 100).toFixed(1)}%`,
    trendUp: true,
    sub: 'نشط هذا الشهر',
  },
  {
    label: 'صحة الاقتصاد',
    value: `${adminStats.economyHealth}%`,
    icon: HeartPulse,
    iconBg: 'bg-emerald-500/15',
    iconColor: 'text-emerald-400',
    trend: 'ممتاز',
    trendUp: true,
    sub: 'مؤشر الصحة',
  },
  {
    label: 'تذاكر الدعم',
    value: fmt(adminStats.openTickets),
    icon: TicketCheck,
    iconBg: 'bg-amber-500/15',
    iconColor: 'text-amber-400',
    trend: adminStats.openTickets > 50 ? 'مرتفع' : 'طبيعي',
    trendUp: adminStats.openTickets <= 50,
    sub: 'تذكرة مفتوحة',
  },
]

/* ------------------------------------------------------------------ */
/*  Quick Actions                                                      */
/* ------------------------------------------------------------------ */
const quickActions = [
  { label: 'المستخدمون', icon: Users, panel: 'users' },
  { label: 'الإعلانات', icon: FileText, panel: 'listings' },
  { label: 'المزادات', icon: GavelIcon, panel: 'auctions' },
  { label: 'المالية', icon: Wallet, panel: 'finance' },
  { label: 'البلاغات', icon: Flag, panel: 'reports' },
  { label: 'الإعدادات', icon: Settings, panel: 'settings' },
]

/* ------------------------------------------------------------------ */
/*  Conversion Funnel                                                  */
/* ------------------------------------------------------------------ */
const funnelSteps = [
  { label: 'الزوار', value: adminSystemHealth.pageViews, color: '#D4AF37' },
  { label: 'التسجيلات', value: adminStats.totalUsers, color: '#F0D060' },
  { label: 'الإعلانات', value: adminStats.totalListings, color: '#34d399' },
  { label: 'الصفقات', value: 8420, color: '#F59E0B' },
]
const funnelMax = Math.max(...funnelSteps.map((s) => s.value))

/* ------------------------------------------------------------------ */
/*  Custom Tooltip                                                     */
/* ------------------------------------------------------------------ */
function DarkTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ value: number; dataKey: string; color: string }>
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-white/10 bg-zinc-900/95 px-4 py-3 shadow-2xl backdrop-blur-md">
      <p className="mb-1 text-xs text-zinc-400">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="text-sm font-medium" style={{ color: p.color }}>
          {p.dataKey === 'users' ? 'المستخدمون' : 'الإعلانات'}: {fmt(p.value)}
        </p>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Health Pill Sub-component                                          */
/* ------------------------------------------------------------------ */
function HealthPill({
  label,
  value,
  status,
}: {
  label: string
  value: string
  status: 'good' | 'warn' | 'bad'
}) {
  const dotColor =
    status === 'good'
      ? 'bg-emerald-500'
      : status === 'warn'
        ? 'bg-amber-500'
        : 'bg-red-500'
  return (
    <div className="rounded-lg bg-white/[0.03] px-3 py-2.5">
      <div className="mb-1 flex items-center gap-1.5">
        <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
        <span className="text-[11px] text-zinc-500">{label}</span>
      </div>
      <p className="text-sm font-semibold text-zinc-200">{value}</p>
    </div>
  )
}

/* ================================================================== */
/*  Main Component                                                     */
/* ================================================================== */
export default function OverviewPanel({ onNavigate }: OverviewPanelProps) {
  const addToast = useSultanStore((s) => s.addToast)

  return (
    <div className="space-y-6">
      {/* ── 1. Alert Banner ──────────────────────────────────────── */}
      {pendingReports > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="admin-card-gold flex items-center justify-between gap-4 border border-[#D4AF37]/30 bg-[#D4AF37]/10 p-4"
        >
          <div className="flex items-center gap-3">
            <div className="pulse-gold flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#D4AF37]/20">
              <AlertTriangle className="h-5 w-5 text-[#D4AF37]" />
            </div>
            <div>
              <p className="font-semibold text-[#F0D060]">
                {fmt(pendingReports)} بلاغات بانتظار المراجعة
              </p>
              <p className="text-sm text-zinc-400">
                هناك تقارير تحتاج إلى تدخل فوري من الإدارة
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              onNavigate?.('reports')
              addToast({ type: 'info', message: 'تم التوجيه إلى البلاغات' })
            }}
            className="press-effect shrink-0 rounded-lg bg-[#D4AF37]/20 px-5 py-2 text-sm font-semibold text-[#D4AF37] transition-colors hover:bg-[#D4AF37]/30"
          >
            مراجعة البلاغات
          </button>
        </motion.div>
      )}

      {/* ── 2. KPI Cards (4×2 grid) ────────────────────────────── */}
      <div className="stagger-children grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpiCards.map((kpi, idx) => {
          const Icon = kpi.icon
          return (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.06 }}
              className="admin-card group relative overflow-hidden p-5"
            >
              <div className="pointer-events-none absolute -inset-1 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-br from-[#D4AF37]/5 to-transparent" />

              <div className="relative flex items-start justify-between">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${kpi.iconBg}`}
                >
                  <Icon className={`h-5 w-5 ${kpi.iconColor}`} />
                </div>
                {kpi.trend && (
                  <Badge
                    variant="outline"
                    className={`text-[11px] font-medium ${
                      kpi.trendUp
                        ? 'border-emerald-500/30 text-emerald-400'
                        : 'border-amber-500/30 text-amber-400'
                    }`}
                  >
                    {kpi.trendUp ? (
                      <TrendingUp className="ml-1 h-3 w-3" />
                    ) : (
                      <TrendingDown className="ml-1 h-3 w-3" />
                    )}
                    {kpi.trend}
                  </Badge>
                )}
              </div>

              <div className="relative mt-4">
                <p className="text-2xl font-bold tracking-tight text-white lg:text-[1.7rem]">
                  {kpi.value}
                </p>
                <p className="mt-0.5 text-sm text-zinc-400">{kpi.label}</p>
                <p className="mt-0.5 text-xs text-zinc-500">{kpi.sub}</p>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* ── 3. Charts Row (2/3 + 1/3) ──────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* LEFT — User & Listing Growth AreaChart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="admin-card col-span-1 p-5 lg:col-span-2"
        >
          <h3 className="mb-4 text-base font-semibold text-white">
            نمو المستخدمين والإعلانات
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={adminChartData.userGrowth}
                margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="emeraldGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.06)"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  tick={{ fill: '#71717a', fontSize: 11 }}
                  tickFormatter={(v: string) => v.slice(5)}
                  axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#71717a', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <RechartsTooltip
                  content={<DarkTooltip />}
                  cursor={{ stroke: 'rgba(212,175,55,0.2)', strokeWidth: 1 }}
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#D4AF37"
                  strokeWidth={2}
                  fill="url(#goldGrad)"
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 0, fill: '#D4AF37' }}
                />
                <Area
                  type="monotone"
                  dataKey="listings"
                  stroke="#34d399"
                  strokeWidth={2}
                  fill="url(#emeraldGrad)"
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 0, fill: '#34d399' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex items-center justify-center gap-6 text-xs text-zinc-400">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#D4AF37]" />
              المستخدمون
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              الإعلانات
            </span>
          </div>
        </motion.div>

        {/* RIGHT — Category Distribution Bars */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="admin-card p-5"
        >
          <h3 className="mb-4 text-base font-semibold text-white">
            توزيع الفئات
          </h3>
          <div
            className="scrollbar-thin space-y-3 overflow-y-auto"
            style={{ maxHeight: '17rem' }}
          >
            {adminChartData.categoryDistribution.slice(0, 8).map((cat, idx) => {
              const maxCount = adminChartData.categoryDistribution[0].count
              const pct = (cat.count / maxCount) * 100
              return (
                <div key={cat.name}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-zinc-300">{cat.name}</span>
                    <span className="text-xs text-zinc-500">{fmt(cat.count)}</span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.7, delay: 0.4 + idx * 0.07 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: barColors[idx] || '#D4AF37' }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>

      {/* ── 4. Bottom Row (1/3 + 1/3 + 1/3) ───────────────────── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Revenue Trend Small AreaChart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="admin-card p-5"
        >
          <div className="mb-1 flex items-center justify-between">
            <h3 className="text-base font-semibold text-white">الإيرادات الشهرية</h3>
            <Badge variant="outline" className="border-emerald-500/30 text-emerald-400">
              <TrendingUp className="ml-1 h-3 w-3" />
              +{revenueTrend}%
            </Badge>
          </div>
          <p className="mb-4 text-xs text-zinc-500">
            {latestRevenue.month}: {fmt(latestRevenue.amount)} ر.م
          </p>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={adminChartData.revenue}
                margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="month"
                  tick={{ fill: '#71717a', fontSize: 10 }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
                  tickLine={false}
                  interval={1}
                />
                <YAxis
                  tick={{ fill: '#71717a', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: number) =>
                    v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)
                  }
                />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: 'rgba(24,24,27,0.95)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#D4AF37',
                    fontSize: '13px',
                  }}
                  formatter={(value: number) => [`${fmt(value)} ر.م`, 'الإيرادات']}
                  labelStyle={{ color: '#a1a1aa' }}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#D4AF37"
                  strokeWidth={2}
                  fill="url(#revGrad)"
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 0, fill: '#D4AF37' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="admin-card p-5"
        >
          <h3 className="mb-4 text-base font-semibold text-white">إجراءات سريعة</h3>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((qa, idx) => {
              const Icon = qa.icon
              return (
                <motion.button
                  key={qa.panel}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.5 + idx * 0.05 }}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onNavigate?.(qa.panel)}
                  className="press-effect flex flex-col items-center gap-2.5 rounded-xl border border-white/5 bg-white/[0.03] py-5 transition-colors hover:border-[#D4AF37]/30 hover:bg-[#D4AF37]/5"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#D4AF37]/10">
                    <Icon className="h-5 w-5 text-[#D4AF37]" />
                  </div>
                  <span className="text-sm font-medium text-zinc-300">{qa.label}</span>
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        {/* System Health */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="admin-card p-5"
        >
          <h3 className="mb-4 text-base font-semibold text-white">صحة النظام</h3>

          {/* Key metrics */}
          <div className="mb-4 grid grid-cols-2 gap-3">
            <HealthPill
              label="وقت التشغيل"
              value={`${adminSystemHealth.uptime}%`}
              status="good"
            />
            <HealthPill
              label="زمن الاستجابة"
              value={`${adminSystemHealth.responseTime}ms`}
              status={adminSystemHealth.responseTime < 200 ? 'good' : 'warn'}
            />
            <HealthPill
              label="الجلسات النشطة"
              value={fmt(adminSystemHealth.activeSessions)}
              status="good"
            />
            <HealthPill
              label="معدل الأخطاء"
              value={`${adminSystemHealth.errorRate}%`}
              status={
                adminSystemHealth.errorRate < 0.5
                  ? 'good'
                  : adminSystemHealth.errorRate < 2
                    ? 'warn'
                    : 'bad'
              }
            />
          </div>

          {/* Services list */}
          <div
            className="scrollbar-thin space-y-2 overflow-y-auto"
            style={{ maxHeight: '11rem' }}
          >
            {adminSystemHealth.services.map((svc) => {
              const SvcIcon = serviceIcons[svc.name] || Zap
              return (
                <div
                  key={svc.name}
                  className="flex items-center justify-between rounded-lg bg-white/[0.03] px-3 py-2"
                >
                  <div className="flex items-center gap-2.5">
                    <SvcIcon className="h-4 w-4 text-zinc-400" />
                    <span className="text-sm text-zinc-300">{svc.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-500">{svc.latency}ms</span>
                    <span
                      className={`h-2 w-2 rounded-full ${serviceColorMap[svc.status]}`}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>

      {/* ── 5. Activity Feed + 6. Funnel ────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Live Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="admin-card p-5"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-semibold text-white">النشاط المباشر</h3>
            <span className="pulse-gold flex items-center gap-1.5 text-xs text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              مباشر
            </span>
          </div>
          <div
            className="scrollbar-thin space-y-3 overflow-y-auto"
            style={{ maxHeight: '22rem' }}
          >
            {adminAuditLog.slice(0, 6).map((log, idx) => {
              const sev = severityConfig[log.severity] ?? severityConfig.low
              const SevIcon = sev.icon
              return (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 + idx * 0.06 }}
                  className="flex gap-3 rounded-lg bg-white/[0.02] p-3 transition-colors hover:bg-white/[0.04]"
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${sev.bg}`}
                  >
                    <SevIcon className={`h-4 w-4 ${sev.color}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-zinc-200">
                      {log.action}
                    </p>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      {log.admin} · {relativeTime(log.createdAt)}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Conversion Funnel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="admin-card p-5"
        >
          <h3 className="mb-6 text-base font-semibold text-white">
            قمع التحويل
          </h3>
          <div className="space-y-5">
            {funnelSteps.map((step, idx) => {
              const widthPct = (step.value / funnelMax) * 100
              const convRate =
                idx > 0
                  ? ((step.value / funnelSteps[idx - 1].value) * 100).toFixed(1)
                  : '100'
              return (
                <div key={step.label}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-zinc-300">{step.label}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-white">{fmt(step.value)}</span>
                      <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-[11px] text-zinc-400">
                        {idx === 0 ? '—' : `${convRate}%`}
                      </span>
                    </div>
                  </div>
                  <div className="relative h-9 w-full overflow-hidden rounded-lg bg-white/[0.04]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${widthPct}%` }}
                      transition={{ duration: 0.8, delay: 0.7 + idx * 0.1, ease: 'easeOut' }}
                      className="absolute inset-y-0 right-0 rounded-lg"
                      style={{
                        backgroundColor: step.color,
                        opacity: 0.18,
                      }}
                    />
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${widthPct}%` }}
                      transition={{ duration: 0.8, delay: 0.7 + idx * 0.1, ease: 'easeOut' }}
                      className="absolute inset-y-0 right-0 rounded-lg"
                      style={{
                        background: `linear-gradient(to left, ${step.color}30, transparent)`,
                      }}
                    />
                  </div>
                  {/* Arrow connector */}
                  {idx < funnelSteps.length - 1 && (
                    <div className="flex justify-center py-1">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="text-zinc-600"
                      >
                        <path
                          d="M12 5v14M19 12l-7 7-7-7"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Funnel summary */}
          <div className="mt-6 rounded-lg border border-white/5 bg-white/[0.02] p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">معدل التحويل الإجمالي</span>
              <span className="text-lg font-bold text-[#D4AF37]">
                {(
                  (funnelSteps[funnelSteps.length - 1].value /
                    funnelSteps[0].value) *
                  100
                ).toFixed(1)}
                %
              </span>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/5">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${(funnelSteps[funnelSteps.length - 1].value / funnelSteps[0].value) * 100}%`,
                }}
                transition={{ duration: 1.2, delay: 1.2 }}
                className="h-full rounded-full bg-gradient-to-l from-[#D4AF37] to-[#F0D060]"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

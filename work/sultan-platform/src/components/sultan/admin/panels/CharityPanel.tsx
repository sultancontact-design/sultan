'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Heart,
  TrendingUp,
  Users,
  Target,
  HandCoins,
  CircleDot,
  Plus,
  Download,
  Eye,
  Pause,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { charityCases } from '@/lib/seed-data'
import { useSultanStore } from '@/lib/store'

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
const fmt = (n: number) => n.toLocaleString('ar-EG')

const statusMap: Record<string, { label: string; cls: string }> = {
  active: { label: 'نشط', cls: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  paused: { label: 'متوقف', cls: 'bg-orange-500/15 text-orange-400 border-orange-500/30' },
  completed: { label: 'مكتمل', cls: 'bg-[#D4AF37]/15 text-[#D4AF37] border-[#D4AF37]/30' },
}

const urgencyMap: Record<string, { label: string; color: string }> = {
  critical: { label: 'حرج', color: 'text-red-400' },
  high: { label: 'عاجل', color: 'text-orange-400' },
  medium: { label: 'متوسط', color: 'text-[#F0D060]' },
  low: { label: 'عادي', color: 'text-emerald-400' },
}

const PIE_COLORS = ['#34d399', '#f97316', '#D4AF37']

/* ------------------------------------------------------------------ */
/*  Computed Data                                                      */
/* ------------------------------------------------------------------ */
const totalCampaigns = charityCases.length
const activeCampaigns = charityCases.filter(c => c.status === 'active').length
const totalCollected = charityCases.reduce((s, c) => s + c.collectedAmount, 0)
const totalGoal = charityCases.reduce((s, c) => s + c.goalAmount, 0)
const totalDonors = charityCases.reduce((s, c) => s + c.donors, 0)
const avgDonation = Math.floor(totalCollected / totalDonors)

const kpiCards = [
  { label: 'إجمالي الحملات', value: fmt(totalCampaigns), icon: Heart, iconBg: 'bg-[#D4AF37]/15', iconColor: 'text-[#D4AF37]', sub: 'حملة تضامن' },
  { label: 'حملات نشطة', value: fmt(activeCampaigns), icon: CircleDot, iconBg: 'bg-emerald-500/15', iconColor: 'text-emerald-400', sub: 'جارٍ جمع التبرعات' },
  { label: 'إجمالي المجموع', value: `${fmt(totalCollected)} ر.م`, icon: HandCoins, iconBg: 'bg-[#F0D060]/15', iconColor: 'text-[#F0D060]', sub: 'درهم' },
  { label: 'المستهدف', value: `${fmt(totalGoal)} ر.م`, icon: Target, iconBg: 'bg-orange-500/15', iconColor: 'text-orange-400', sub: 'هدف إجمالي' },
  { label: 'متوسط التبرع', value: `${fmt(avgDonation)} ر.م`, icon: TrendingUp, iconBg: 'bg-emerald-500/15', iconColor: 'text-emerald-400', sub: 'لكل متبرع' },
  { label: 'المتبرعون', value: fmt(totalDonors), icon: Users, iconBg: 'bg-[#D4AF37]/15', iconColor: 'text-[#D4AF37]', sub: 'متبرع' },
]

/* Collection progress: sorted by collected */
const collectionData = [...charityCases]
  .sort((a, b) => b.collectedAmount - a.collectedAmount)
  .map(c => ({ name: c.title.length > 18 ? c.title.slice(0, 18) + '...' : c.title, collected: c.collectedAmount, goal: c.goalAmount }))

/* Donation trend: simulated 30 days */
const donationTrend = Array.from({ length: 30 }, (_, i) => ({
  day: `${i + 1}`,
  amount: Math.floor(3000 + Math.random() * 12000 + (i > 20 ? 5000 : 0)),
}))

/* Status distribution for PieChart */
const statusDistribution = [
  { name: 'نشطة', value: charityCases.filter(c => c.status === 'active').length },
  { name: 'متوقفة', value: charityCases.filter(c => c.status === 'paused').length },
  { name: 'مكتملة', value: charityCases.filter(c => c.status === 'completed').length },
].filter(d => d.value > 0)

/* ------------------------------------------------------------------ */
/*  Tooltips                                                           */
/* ------------------------------------------------------------------ */
function CollectionTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; dataKey: string; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-white/10 bg-zinc-900/95 px-4 py-3 shadow-2xl backdrop-blur-md">
      <p className="mb-1 text-xs text-zinc-400">{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} className="text-sm font-medium" style={{ color: p.color }}>
          {p.dataKey === 'collected' ? 'المجموع' : 'الهدف'}: {fmt(p.value)} ر.م
        </p>
      ))}
    </div>
  )
}

function AreaTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; dataKey: string; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-white/10 bg-zinc-900/95 px-4 py-3 shadow-2xl backdrop-blur-md">
      <p className="mb-1 text-xs text-zinc-400">يوم {label}</p>
      {payload.map(p => (
        <p key={p.dataKey} className="text-sm font-semibold" style={{ color: p.color }}>
          {fmt(p.value)} ر.م
        </p>
      ))}
    </div>
  )
}

function PieTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number }> }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-white/10 bg-zinc-900/95 px-4 py-3 shadow-2xl backdrop-blur-md">
      <p className="mb-1 text-xs text-zinc-400">{payload[0].name}</p>
      <p className="text-sm font-semibold text-emerald-400">{payload[0].value} حملة</p>
    </div>
  )
}

/* ================================================================== */
/*  Main Component                                                     */
/* ================================================================== */
interface CharityPanelProps { onNavigate?: (panel: string) => void }

export default function CharityPanel({ onNavigate }: CharityPanelProps) {
  const addToast = useSultanStore(s => s.addToast)

  return (
    <div className="space-y-6">
      {/* ── KPI Cards ──────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {kpiCards.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="admin-card flex flex-col gap-2 p-4"
          >
            <div className="flex items-center justify-between">
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${kpi.iconBg}`}>
                <kpi.icon className={`h-4.5 w-4.5 ${kpi.iconColor}`} />
              </div>
              <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
            </div>
            <p className="text-[11px] text-zinc-500">{kpi.label}</p>
            <p className="text-lg font-bold text-zinc-100">{kpi.value}</p>
            <p className="text-[10px] text-zinc-600">{kpi.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* ── Quick Actions ──────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <Button
          onClick={() => addToast('سيتم فتح نموذج إنشاء حملة جديدة', 'info')}
          className="sultan-gradient press-effect gap-2 border-0 text-sm font-semibold text-black"
        >
          <Plus className="h-4 w-4" />
          إنشاء حملة جديدة
        </Button>
        <Button
          variant="outline"
          onClick={() => addToast('تم تصدير التقرير بنجاح', 'success')}
          className="border-white/10 bg-white/[0.03] text-sm text-zinc-300 hover:bg-white/[0.06] hover:text-zinc-200"
        >
          <Download className="ml-2 h-4 w-4" />
          تصدير التقرير
        </Button>
      </div>

      {/* ── Campaigns Table ─────────────────────────────────── */}
      <div className="admin-card p-5">
        <h3 className="mb-4 text-base font-bold text-zinc-100">حملات التضامن</h3>
        <div className="scrollbar-thin max-h-[400px] overflow-y-auto">
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-zinc-900/95 backdrop-blur-sm">
              <tr className="border-b border-white/5 text-zinc-500">
                <th className="pb-2 pr-2 text-right font-medium">الحملة</th>
                <th className="hidden pb-2 pr-2 text-right font-medium sm:table-cell">الهدف</th>
                <th className="pb-2 pr-2 text-right font-medium">المجموع</th>
                <th className="hidden pb-2 pr-2 text-right font-medium md:table-cell">المتبرعون</th>
                <th className="hidden pb-2 pr-2 text-right font-medium lg:table-cell">الأولوية</th>
                <th className="pb-2 pr-2 text-right font-medium">الحالة</th>
                <th className="pb-2 pr-2 text-right font-medium">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {charityCases.map((c, i) => {
                const pct = Math.round((c.collectedAmount / c.goalAmount) * 100)
                const st = statusMap[c.status] || statusMap.active
                const ug = urgencyMap[c.urgency] || urgencyMap.medium
                return (
                  <motion.tr
                    key={c.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="border-b border-white/[0.03] transition-colors hover:bg-white/[0.02]"
                  >
                    <td className="max-w-[160px] truncate py-2.5 pr-2 font-medium text-zinc-200">{c.title}</td>
                    <td className="hidden py-2.5 pr-2 text-zinc-500 sm:table-cell">{fmt(c.goalAmount)} ر.م</td>
                    <td className="py-2.5 pr-2">
                      <div className="w-28">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-[11px] font-semibold text-[#D4AF37]">{fmt(c.collectedAmount)} ر.م</span>
                          <span className="text-[10px] text-zinc-600">{pct}%</span>
                        </div>
                        <Progress value={pct} className="h-1.5 bg-white/[0.06]" />
                      </div>
                    </td>
                    <td className="hidden py-2.5 pr-2 text-zinc-400 md:table-cell">{fmt(c.donors)}</td>
                    <td className="hidden py-2.5 pr-2 lg:table-cell">
                      <span className={`text-[11px] font-medium ${ug.color}`}>{ug.label}</span>
                    </td>
                    <td className="py-2.5 pr-2">
                      <Badge variant="outline" className={`${st.cls} border text-[10px] px-2 py-0`}>{st.label}</Badge>
                    </td>
                    <td className="py-2.5 pr-2">
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-zinc-500 hover:text-[#D4AF37]" onClick={() => addToast(`تم فتح تفاصيل: ${c.title}`, 'info')}>
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* ── Collection Progress BarChart ──────────────────── */}
        <div className="admin-card p-5 lg:col-span-2">
          <h3 className="mb-4 text-base font-bold text-zinc-100">تقدّم جمع التبرعات</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={collectionData} layout="vertical" barGap={4}>
                <XAxis type="number" tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                <YAxis type="category" dataKey="name" tick={{ fill: '#a1a1aa', fontSize: 11 }} axisLine={false} tickLine={false} width={120} />
                <RechartsTooltip content={<CollectionTooltip />} />
                <Bar dataKey="collected" fill="#D4AF37" radius={[0, 4, 4, 0]} name="المجموع" />
                <Bar dataKey="goal" fill="#34d399" opacity={0.2} radius={[0, 4, 4, 0]} name="الهدف" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex justify-center gap-6">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#D4AF37]" />
              <span className="text-xs text-zinc-400">المجموع</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              <span className="text-xs text-zinc-400">الهدف</span>
            </div>
          </div>
        </div>

        {/* ── Status Distribution Pie ───────────────────────── */}
        <div className="admin-card flex flex-col items-center p-5">
          <h3 className="mb-4 self-start text-base font-bold text-zinc-100">توزيع الحالات</h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={68} paddingAngle={4} strokeWidth={0}>
                  {statusDistribution.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex flex-wrap justify-center gap-3">
            {statusDistribution.map((item, i) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                <span className="text-xs text-zinc-400">{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Donation Trend AreaChart ────────────────────────── */}
      <div className="admin-card p-5">
        <h3 className="mb-4 text-base font-bold text-zinc-100">اتجاه التبرعات اليومي</h3>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={donationTrend}>
              <defs>
                <linearGradient id="emeraldGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#34d399" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fill: '#71717a', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
              <RechartsTooltip content={<AreaTooltip />} />
              <Area type="monotone" dataKey="amount" stroke="#34d399" strokeWidth={2} fill="url(#emeraldGrad)" name="التبرعات" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

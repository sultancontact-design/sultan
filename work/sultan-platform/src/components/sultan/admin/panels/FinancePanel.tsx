'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  DollarSign,
  TrendingUp,
  Wallet,
  Clock,
  PiggyBank,
  ArrowUpRight,
  Search,
  ChevronLeft,
  ChevronRight,
  Receipt,
  ShoppingCart,
  ArrowDownLeft,
  ArrowUpLeft,
  RotateCcw,
  Trophy,
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
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { adminTransactions, adminChartData, adminStats } from '@/lib/seed-data'
import { useSultanStore } from '@/lib/store'

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
const fmt = (n: number) => n.toLocaleString('ar-EG')

const typeConfig: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  fee: { icon: Receipt, color: 'text-red-400', label: 'عمولة' },
  purchase: { icon: ShoppingCart, color: 'text-[#D4AF37]', label: 'شراء' },
  withdrawal: { icon: ArrowUpLeft, color: 'text-orange-400', label: 'سحب' },
  deposit: { icon: ArrowDownLeft, color: 'text-emerald-400', label: 'إيداع' },
  refund: { icon: RotateCcw, color: 'text-emerald-400', label: 'استرداد' },
}

const statusConfig: Record<string, { label: string; className: string }> = {
  completed: { label: 'مكتمل', className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  pending: { label: 'معلّق', className: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
  failed: { label: 'فشل', className: 'bg-red-500/15 text-red-400 border-red-500/30' },
}

const PIE_COLORS = ['#f87171', '#D4AF37', '#34d399', '#f97316']

/* ------------------------------------------------------------------ */
/*  Computed Data                                                      */
/* ------------------------------------------------------------------ */
const totalRevenue = adminTransactions
  .filter((t) => t.status === 'completed' && (t.type === 'fee' || t.type === 'purchase'))
  .reduce((s, t) => s + t.amount, 0)

const lastMonthRevenue = adminChartData.revenue[adminChartData.revenue.length - 1].amount

const platformFees = adminTransactions
  .filter((t) => t.type === 'fee')
  .reduce((s, t) => s + t.amount, 0)

const pendingPayouts = adminTransactions
  .filter((t) => t.type === 'withdrawal' && t.status === 'pending')
  .reduce((s, t) => s + t.amount, 0)

const activeWallets = adminStats.activeUsers
const netProfit = totalRevenue - adminTransactions
  .filter((t) => t.type === 'refund' && t.status === 'completed')
  .reduce((s, t) => s + t.amount, 0)

const kpiCards = [
  { label: 'إجمالي الإيرادات', value: `${fmt(totalRevenue)} ر.م`, icon: DollarSign, iconBg: 'bg-[#D4AF37]/15', iconColor: 'text-[#D4AF37]', sub: 'المعاملات المكتملة' },
  { label: 'الإيرادات الشهرية', value: `${fmt(lastMonthRevenue)} ر.م`, icon: TrendingUp, iconBg: 'bg-[#F0D060]/15', iconColor: 'text-[#F0D060]', sub: 'آخر شهر' },
  { label: 'رسوم المنصة', value: `${fmt(platformFees)} ر.م`, icon: Receipt, iconBg: 'bg-red-500/15', iconColor: 'text-red-400', sub: 'العمولات المحصّلة' },
  { label: 'مدفوعات معلّقة', value: `${fmt(pendingPayouts)} ر.م`, icon: Clock, iconBg: 'bg-orange-500/15', iconColor: 'text-orange-400', sub: 'بانتظار الموافقة' },
  { label: 'محافظ نشطة', value: fmt(activeWallets), icon: Wallet, iconBg: 'bg-emerald-500/15', iconColor: 'text-emerald-400', sub: 'محفظة مفعّلة' },
  { label: 'صافي الربح', value: `${fmt(netProfit)} ر.م`, icon: PiggyBank, iconBg: 'bg-[#D4AF37]/15', iconColor: 'text-[#D4AF37]', sub: 'بعد الاستردادات' },
]

/* Revenue breakdown for PieChart */
const revenueByType = useMemo(() => {
  const map: Record<string, number> = {}
  adminTransactions.filter(t => t.status === 'completed').forEach(t => {
    map[t.type] = (map[t.type] || 0) + t.amount
  })
  return Object.entries(map).map(([key, val]) => ({
    name: typeConfig[key]?.label || key,
    value: val,
  }))
}, [])

/* Top earners */
const topEarners = useMemo(() => {
  const map: Record<string, number> = {}
  adminTransactions.forEach(t => {
    map[t.userName] = (map[t.userName] || 0) + t.amount
  })
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name, vol]) => ({ name, volume: vol }))
}, [])
const maxVolume = Math.max(...topEarners.map(e => e.volume))

/* ------------------------------------------------------------------ */
/*  Custom Tooltip                                                     */
/* ------------------------------------------------------------------ */
function FinanceTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; dataKey: string; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-white/10 bg-zinc-900/95 px-4 py-3 shadow-2xl backdrop-blur-md">
      <p className="mb-1 text-xs text-zinc-400">{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} className="text-sm font-medium" style={{ color: p.color }}>
          {p.dataKey === 'amount' ? 'الإيرادات' : 'المصروفات'}: {fmt(p.value)} ر.م
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
      <p className="text-sm font-semibold text-[#D4AF37]">{fmt(payload[0].value)} ر.م</p>
    </div>
  )
}

/* ================================================================== */
/*  Main Component                                                     */
/* ================================================================== */
interface FinancePanelProps { onNavigate?: (panel: string) => void }

export default function FinancePanel({ onNavigate }: FinancePanelProps) {
  const addToast = useSultanStore(s => s.addToast)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [page, setPage] = useState(0)
  const perPage = 8

  const filtered = useMemo(() => {
    return adminTransactions.filter(t => {
      const matchSearch = t.userName.includes(search) || t.description.includes(search) || t.id.includes(search)
      const matchType = typeFilter === 'all' || t.type === typeFilter
      return matchSearch && matchType
    })
  }, [search, typeFilter])

  const paged = filtered.slice(page * perPage, (page + 1) * perPage)
  const totalPages = Math.ceil(filtered.length / perPage)

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
              <ArrowUpRight className="h-3.5 w-3.5 text-emerald-400" />
            </div>
            <p className="text-[11px] text-zinc-500">{kpi.label}</p>
            <p className="text-lg font-bold text-zinc-100">{kpi.value}</p>
            <p className="text-[10px] text-zinc-600">{kpi.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* ── Revenue Chart ──────────────────────────────────── */}
      <div className="admin-card p-5">
        <h3 className="mb-4 text-base font-bold text-zinc-100">تطوّر الإيرادات والمصروفات</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={adminChartData.revenue}>
              <defs>
                <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#D4AF37" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#D4AF37" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
              <RechartsTooltip content={<FinanceTooltip />} />
              <Bar dataKey="expenses" fill="#f97316" opacity={0.3} radius={[4, 4, 0, 0]} name="المصروفات" />
              <Area type="monotone" dataKey="amount" stroke="#D4AF37" strokeWidth={2} fill="url(#goldGrad)" name="الإيرادات" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* ── Revenue Breakdown Pie ────────────────────────── */}
        <div className="admin-card flex flex-col items-center p-5">
          <h3 className="mb-4 self-start text-base font-bold text-zinc-100">توزيع الإيرادات</h3>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={revenueByType} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} strokeWidth={0}>
                  {revenueByType.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex flex-wrap justify-center gap-3">
            {revenueByType.map((item, i) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                <span className="text-xs text-zinc-400">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Transaction Table ────────────────────────────── */}
        <div className="admin-card p-5 lg:col-span-2">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-base font-bold text-zinc-100">سجل المعاملات</h3>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
                <Input
                  placeholder="بحث..."
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(0) }}
                  className="h-8 w-44 bg-white/[0.04] text-xs text-zinc-200 placeholder:text-zinc-600"
                />
              </div>
              <select
                value={typeFilter}
                onChange={e => { setTypeFilter(e.target.value); setPage(0) }}
                className="h-8 rounded-md border border-white/10 bg-white/[0.04] px-3 text-xs text-zinc-300 focus:outline-none"
              >
                <option value="all">الكل</option>
                <option value="fee">عمولات</option>
                <option value="purchase">مشتريات</option>
                <option value="withdrawal">سحوبات</option>
                <option value="deposit">إيداعات</option>
                <option value="refund">استردادات</option>
              </select>
            </div>
          </div>

          <div className="scrollbar-thin max-h-80 overflow-y-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/5 text-zinc-500">
                  <th className="pb-2 pr-2 text-right font-medium">المعرف</th>
                  <th className="pb-2 pr-2 text-right font-medium">النوع</th>
                  <th className="pb-2 pr-2 text-right font-medium">المبلغ</th>
                  <th className="hidden pb-2 pr-2 text-right font-medium sm:table-cell">المستخدم</th>
                  <th className="hidden pb-2 pr-2 text-right font-medium md:table-cell">الوصف</th>
                  <th className="hidden pb-2 pr-2 text-right font-medium lg:table-cell">التاريخ</th>
                  <th className="pb-2 pr-2 text-right font-medium">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {paged.map(tx => {
                  const tc = typeConfig[tx.type] || typeConfig.fee
                  const sc = statusConfig[tx.status] || statusConfig.completed
                  const Icon = tc.icon
                  return (
                    <tr key={tx.id} className="border-b border-white/[0.03] transition-colors hover:bg-white/[0.02]">
                      <td className="py-2.5 pr-2 font-mono text-zinc-500">{tx.id}</td>
                      <td className="py-2.5 pr-2">
                        <span className={`inline-flex items-center gap-1 ${tc.color}`}>
                          <Icon className="h-3.5 w-3.5" />
                          <span>{tc.label}</span>
                        </span>
                      </td>
                      <td className="py-2.5 pr-2 font-semibold text-zinc-200">{fmt(tx.amount)} ر.م</td>
                      <td className="hidden py-2.5 pr-2 text-zinc-400 sm:table-cell">{tx.userName}</td>
                      <td className="hidden max-w-[140px] truncate py-2.5 pr-2 text-zinc-500 md:table-cell">{tx.description}</td>
                      <td className="hidden py-2.5 pr-2 text-zinc-600 lg:table-cell">{new Date(tx.date).toLocaleDateString('ar-EG')}</td>
                      <td className="py-2.5 pr-2">
                        <Badge variant="outline" className={`${sc.className} border text-[10px] px-2 py-0`}>{sc.label}</Badge>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3">
            <span className="text-[11px] text-zinc-600">{fmt(filtered.length)} معاملة</span>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-7 w-7" disabled={page === 0} onClick={() => setPage(p => p - 1)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <span className="px-2 text-[11px] text-zinc-400">{page + 1} / {totalPages}</span>
              <Button variant="ghost" size="icon" className="h-7 w-7" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Top Earners ────────────────────────────────────── */}
      <div className="admin-card p-5">
        <h3 className="mb-4 text-base font-bold text-zinc-100">أعلى المستخدمين حجماً</h3>
        <div className="space-y-4">
          {topEarners.map((earner, i) => (
            <motion.div
              key={earner.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-4"
            >
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${i === 0 ? 'bg-[#D4AF37]/20 text-[#D4AF37]' : i === 1 ? 'bg-[#F0D060]/15 text-[#F0D060]' : 'bg-orange-500/15 text-orange-400'}`}>
                {i + 1}
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-sm font-medium text-zinc-200">{earner.name}</span>
                  <span className="text-sm font-bold text-[#D4AF37]">{fmt(earner.volume)} ر.م</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-white/[0.05]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(earner.volume / maxVolume) * 100}%` }}
                    transition={{ duration: 0.8, delay: i * 0.15 }}
                    className="h-full rounded-full"
                    style={{ background: i === 0 ? '#D4AF37' : i === 1 ? '#F0D060' : '#f97316' }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

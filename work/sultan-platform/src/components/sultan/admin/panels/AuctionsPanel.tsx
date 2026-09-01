'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Gavel,
  TrendingUp,
  CheckCircle2,
  Users,
  DollarSign,
  Clock,
  Eye,
  Ban,
  Square,
  Trophy,
  Flame,
  Zap,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { auctions } from '@/lib/seed-data'
import { useSultanStore } from '@/lib/store'

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
const fmt = (n: number) => n.toLocaleString('ar-EG')

const statusMap: Record<string, { label: string; cls: string }> = {
  active: { label: 'نشط', cls: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  completed: { label: 'مكتمل', cls: 'bg-[#D4AF37]/15 text-[#D4AF37] border-[#D4AF37]/30' },
  cancelled: { label: 'ملغى', cls: 'bg-red-500/15 text-red-400 border-red-500/30' },
}

/* Simulated extra data */
const enrichedAuctions = auctions.map((a, i) => ({
  ...a,
  simulatedBids: a.bidCount + Math.floor(Math.random() * 10),
  simulatedCurrentBid: a.currentBid + Math.floor(Math.random() * 5000),
  status: i < 4 ? 'active' : i === 4 ? 'completed' : 'cancelled' as string,
}))

const totalBids = enrichedAuctions.reduce((s, a) => s + a.simulatedBids, 0)
const totalRevenue = enrichedAuctions
  .filter(a => a.status === 'completed')
  .reduce((s, a) => s + a.simulatedCurrentBid, 0)
const avgPrice = Math.floor(enrichedAuctions.reduce((s, a) => s + a.simulatedCurrentBid, 0) / enrichedAuctions.length)

const kpiCards = [
  { label: 'إجمالي المزادات', value: fmt(enrichedAuctions.length), icon: Gavel, iconBg: 'bg-[#D4AF37]/15', iconColor: 'text-[#D4AF37]', sub: 'مزاد' },
  { label: 'مزادات نشطة', value: fmt(enrichedAuctions.filter(a => a.status === 'active').length), icon: Zap, iconBg: 'bg-emerald-500/15', iconColor: 'text-emerald-400', sub: 'جارٍ الآن' },
  { label: 'مكتملة', value: fmt(enrichedAuctions.filter(a => a.status === 'completed').length), icon: CheckCircle2, iconBg: 'bg-[#D4AF37]/15', iconColor: 'text-[#D4AF37]', sub: 'مزاد' },
  { label: 'إجمالي المزايدات', value: fmt(totalBids), icon: Users, iconBg: 'bg-orange-500/15', iconColor: 'text-orange-400', sub: 'مزايدة' },
  { label: 'متوسط السعر', value: `${fmt(avgPrice)} ر.م`, icon: TrendingUp, iconBg: 'bg-[#F0D060]/15', iconColor: 'text-[#F0D060]', sub: 'درهم' },
  { label: 'الإيرادات', value: `${fmt(totalRevenue)} ر.م`, icon: DollarSign, iconBg: 'bg-emerald-500/15', iconColor: 'text-emerald-400', sub: 'من المزادات المكتملة' },
]

/* Monthly analytics (simulated) */
const monthlyAnalytics = [
  { month: 'يناير', created: 12, completed: 8 },
  { month: 'فبراير', created: 15, completed: 11 },
  { month: 'مارس', created: 18, completed: 14 },
  { month: 'أبريل', created: 22, completed: 16 },
  { month: 'مايو', created: 20, completed: 18 },
  { month: 'يونيو', created: 25, completed: 20 },
]

/* Top 5 by bids */
const topByBids = [...enrichedAuctions].sort((a, b) => b.simulatedBids - a.simulatedBids).slice(0, 5)

/* ------------------------------------------------------------------ */
/*  Tooltip                                                            */
/* ------------------------------------------------------------------ */
function AuctionTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; dataKey: string; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-white/10 bg-zinc-900/95 px-4 py-3 shadow-2xl backdrop-blur-md">
      <p className="mb-1 text-xs text-zinc-400">{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} className="text-sm font-medium" style={{ color: p.color }}>
          {p.dataKey === 'created' ? 'تم الإنشاء' : 'مكتملة'}: {fmt(p.value)}
        </p>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Countdown helper                                                   */
/* ------------------------------------------------------------------ */
function getCountdown(endsAt: string) {
  const diff = Math.max(0, new Date(endsAt).getTime() - Date.now())
  const days = Math.floor(diff / 86400000)
  const hours = Math.floor((diff % 86400000) / 3600000)
  const mins = Math.floor((diff % 3600000) / 60000)
  return { days, hours, mins }
}

/* ================================================================== */
/*  Main Component                                                     */
/* ================================================================== */
interface AuctionsPanelProps { onNavigate?: (panel: string) => void }

export default function AuctionsPanel({ onNavigate }: AuctionsPanelProps) {
  const addToast = useSultanStore(s => s.addToast)
  const [viewAuction, setViewAuction] = useState<typeof enrichedAuctions[0] | null>(null)

  const activeAuctions = enrichedAuctions.filter(a => a.status === 'active')

  const handleEnd = (id: string) => {
    addToast('تم إنهاء المزاد بنجاح', 'success')
  }
  const handleCancel = (id: string) => {
    addToast('تم إلغاء المزاد', 'info')
  }

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

      {/* ── Auctions Table ─────────────────────────────────── */}
      <div className="admin-card p-5">
        <h3 className="mb-4 text-base font-bold text-zinc-100">إدارة المزادات</h3>
        <div className="scrollbar-thin max-h-[400px] overflow-y-auto">
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-zinc-900/95 backdrop-blur-sm">
              <tr className="border-b border-white/5 text-zinc-500">
                <th className="pb-2 pr-2 text-right font-medium">العنوان</th>
                <th className="hidden pb-2 pr-2 text-right font-medium sm:table-cell">سعر البداية</th>
                <th className="pb-2 pr-2 text-right font-medium">أعلى مزايدة</th>
                <th className="hidden pb-2 pr-2 text-right font-medium md:table-cell">المزايدات</th>
                <th className="hidden pb-2 pr-2 text-right font-medium lg:table-cell">الانتهاء</th>
                <th className="pb-2 pr-2 text-right font-medium">الحالة</th>
                <th className="pb-2 pr-2 text-right font-medium">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {enrichedAuctions.map(auction => {
                const st = statusMap[auction.status] || statusMap.active
                return (
                  <tr key={auction.id} className="border-b border-white/[0.03] transition-colors hover:bg-white/[0.02]">
                    <td className="max-w-[180px] truncate py-2.5 pr-2 font-medium text-zinc-200">{auction.title}</td>
                    <td className="hidden py-2.5 pr-2 text-zinc-500 sm:table-cell">{fmt(auction.startPrice)} ر.م</td>
                    <td className="py-2.5 pr-2 font-semibold text-[#D4AF37]">{fmt(auction.simulatedCurrentBid)} ر.م</td>
                    <td className="hidden py-2.5 pr-2 text-zinc-400 md:table-cell">{fmt(auction.simulatedBids)}</td>
                    <td className="hidden py-2.5 pr-2 text-zinc-600 lg:table-cell">{new Date(auction.endsAt).toLocaleDateString('ar-EG')}</td>
                    <td className="py-2.5 pr-2">
                      <Badge variant="outline" className={`${st.cls} border text-[10px] px-2 py-0`}>{st.label}</Badge>
                    </td>
                    <td className="py-2.5 pr-2">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-zinc-500 hover:text-[#D4AF37]" onClick={() => setViewAuction(auction)}>
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        {auction.status === 'active' && (
                          <>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-zinc-500 hover:text-emerald-400" onClick={() => handleEnd(auction.id)}>
                              <Square className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-zinc-500 hover:text-red-400" onClick={() => handleCancel(auction.id)}>
                              <Ban className="h-3.5 w-3.5" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* ── Auction Analytics BarChart ───────────────────── */}
        <div className="admin-card p-5">
          <h3 className="mb-4 text-base font-bold text-zinc-100">تحليل المزادات الشهري</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyAnalytics} barGap={4}>
                <XAxis dataKey="month" tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
                <RechartsTooltip content={<AuctionTooltip />} />
                <Bar dataKey="created" fill="#D4AF37" radius={[4, 4, 0, 0]} name="تم الإنشاء" />
                <Bar dataKey="completed" fill="#34d399" radius={[4, 4, 0, 0]} name="مكتملة" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex justify-center gap-6">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#D4AF37]" />
              <span className="text-xs text-zinc-400">تم الإنشاء</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              <span className="text-xs text-zinc-400">مكتملة</span>
            </div>
          </div>
        </div>

        {/* ── Top 5 Auctions ───────────────────────────────── */}
        <div className="admin-card p-5">
          <h3 className="mb-4 text-base font-bold text-zinc-100">المزادات الأكثر مزايدة</h3>
          <div className="space-y-3">
            {topByBids.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-3 rounded-lg bg-white/[0.02] p-3 transition-colors hover:bg-white/[0.04]"
              >
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-bold text-sm ${i === 0 ? 'bg-[#D4AF37]/20 text-[#D4AF37]' : i === 1 ? 'bg-[#F0D060]/15 text-[#F0D060]' : i === 2 ? 'bg-orange-500/15 text-orange-400' : 'bg-white/[0.05] text-zinc-500'}`}>
                  {i + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-zinc-200">{a.title}</p>
                  <div className="mt-1 flex items-center gap-3 text-[11px] text-zinc-500">
                    <span>{fmt(a.simulatedBids)} مزايدة</span>
                    <span>{fmt(a.simulatedCurrentBid)} ر.م</span>
                  </div>
                </div>
                <Trophy className={`h-4 w-4 shrink-0 ${i === 0 ? 'text-[#D4AF37]' : 'text-zinc-700'}`} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Active Auctions Highlight ──────────────────────── */}
      <div>
        <h3 className="mb-4 text-base font-bold text-zinc-100">المزادات النشطة</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {activeAuctions.map((a, i) => {
            const cd = getCountdown(a.endsAt)
            return (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="admin-card-gold group relative overflow-hidden p-4"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="relative">
                  <div className="mb-2 flex items-center gap-2">
                    <Flame className="h-4 w-4 text-orange-400" />
                    <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 border text-[10px] px-2 py-0">نشط</Badge>
                  </div>
                  <p className="mb-3 line-clamp-2 text-sm font-semibold text-zinc-100">{a.title}</p>
                  <p className="mb-3 text-lg font-bold text-[#D4AF37]">{fmt(a.simulatedCurrentBid)} <span className="text-xs text-zinc-500">ر.م</span></p>
                  {/* Countdown display */}
                  <div className="flex gap-2">
                    {[
                      { val: cd.days, label: 'يوم' },
                      { val: cd.hours, label: 'ساعة' },
                      { val: cd.mins, label: 'دقيقة' },
                    ].map((unit) => (
                      <div key={unit.label} className="flex-1 rounded-md bg-white/[0.05] p-2 text-center">
                        <p className="text-base font-bold text-zinc-200">{String(unit.val).padStart(2, '0')}</p>
                        <p className="text-[10px] text-zinc-600">{unit.label}</p>
                      </div>
                    ))}
                  </div>
                  <p className="mt-2 text-[11px] text-zinc-600">{fmt(a.simulatedBids)} مزايدة</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* ── View Dialog ────────────────────────────────────── */}
      <Dialog open={!!viewAuction} onOpenChange={() => setViewAuction(null)}>
        <DialogContent className="admin-glass max-w-lg border-white/10 bg-zinc-900/95 text-right">
          <DialogHeader>
            <DialogTitle className="text-gradient-sultan text-lg">تفاصيل المزاد</DialogTitle>
          </DialogHeader>
          {viewAuction && (
            <div className="space-y-3 text-sm">
              <p className="font-semibold text-zinc-100">{viewAuction.title}</p>
              <p className="text-xs leading-relaxed text-zinc-400">{viewAuction.description}</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-white/[0.03] p-3">
                  <p className="text-[11px] text-zinc-500">سعر البداية</p>
                  <p className="font-bold text-zinc-200">{fmt(viewAuction.startPrice)} ر.م</p>
                </div>
                <div className="rounded-lg bg-white/[0.03] p-3">
                  <p className="text-[11px] text-zinc-500">أعلى مزايدة</p>
                  <p className="font-bold text-[#D4AF37]">{fmt(viewAuction.simulatedCurrentBid)} ر.م</p>
                </div>
                <div className="rounded-lg bg-white/[0.03] p-3">
                  <p className="text-[11px] text-zinc-500">عدد المزايدات</p>
                  <p className="font-bold text-zinc-200">{fmt(viewAuction.simulatedBids)}</p>
                </div>
                <div className="rounded-lg bg-white/[0.03] p-3">
                  <p className="text-[11px] text-zinc-500">ينتهي في</p>
                  <p className="font-bold text-zinc-200">{new Date(viewAuction.endsAt).toLocaleDateString('ar-EG')}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

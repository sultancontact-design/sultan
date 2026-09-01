'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Flag, AlertTriangle, Eye, CheckCircle2, Clock, Ban,
  MessageSquare, ChevronDown, Search, X, Shield,
  FileText, User, CalendarDays, ArrowUpDown,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogFooter, DialogDescription,
} from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  Tooltip as RechartsTooltip, ResponsiveContainer,
} from 'recharts'
import { adminReports, categories, cities } from '@/lib/seed-data'
import { useSultanStore } from '@/lib/store'

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
const fmt = (n: number) => n.toLocaleString('ar-EG')

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

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface ReportsPanelProps {
  onNavigate?: (panel: string) => void
}

type ReportStatus = 'all' | 'pending' | 'under_review' | 'resolved'

type Report = typeof adminReports[number]

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */
const statusConfig: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  pending:      { label: 'معلّق',     color: 'text-[#D4AF37]',    bg: 'bg-[#D4AF37]/15',   icon: Clock },
  under_review: { label: 'قيد المراجعة', color: 'text-orange-400',  bg: 'bg-orange-500/15', icon: Eye },
  resolved:     { label: 'تم الحل',    color: 'text-emerald-400', bg: 'bg-emerald-500/15', icon: CheckCircle2 },
}

const reasonIcons: Record<string, React.ElementType> = {
  'محتوى مخالف':   Ban,
  'صور غير مرتبطة': Eye,
  'سعر غير واقعي':  AlertTriangle,
  'إزعاج ورسائل مزعجة': MessageSquare,
  'إعلان مكرر':     FileText,
  'احتيال':         Shield,
  'معلومات كاذبة':  AlertTriangle,
}

const PIE_COLORS = ['#D4AF37', '#f97316', '#34d399']

const resolutionOptions = [
  'حذف الإعلان وحظر البائع',
  'حذف الإعلان وتحذير',
  'تحذير ثم حظر',
  'رفض البلاغ — لا مخالفة',
  'إزالة المحتوى المخالف فقط',
  'تعليق الحساب مؤقتاً',
]

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function ReportsPanel({ onNavigate }: ReportsPanelProps) {
  const addToast = useSultanStore((s) => s.addToast)

  const [tab, setTab] = useState<ReportStatus>('all')
  const [search, setSearch] = useState('')
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [resolveDialogOpen, setResolveDialogOpen] = useState(false)
  const [resolution, setResolution] = useState('')
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [sortField, setSortField] = useState<'createdAt' | 'reason'>('createdAt')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  /* ── Computed ── */
  const counts = useMemo(() => {
    const all = adminReports.length
    const pending = adminReports.filter((r) => r.status === 'pending').length
    const review = adminReports.filter((r) => r.status === 'under_review').length
    const resolved = adminReports.filter((r) => r.status === 'resolved').length
    return { all, pending, review, resolved }
  }, [])

  const filtered = useMemo(() => {
    let list = [...adminReports]
    if (tab !== 'all') list = list.filter((r) => r.status === tab)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (r) =>
          r.reason.toLowerCase().includes(q) ||
          r.reporterName.toLowerCase().includes(q) ||
          r.reportedName.toLowerCase().includes(q) ||
          (r.listingTitle && r.listingTitle.toLowerCase().includes(q)),
      )
    }
    list.sort((a, b) => {
      const mul = sortDir === 'asc' ? 1 : -1
      if (sortField === 'createdAt') {
        return mul * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      }
      return mul * a.reason.localeCompare(b.reason, 'ar')
    })
    return list
  }, [tab, search, sortField, sortDir])

  const pieData = useMemo(
    () => [
      { name: 'معلّق', value: counts.pending },
      { name: 'قيد المراجعة', value: counts.review },
      { name: 'تم الحل', value: counts.resolved },
    ],
    [counts],
  )

  const reasonDistribution = useMemo(() => {
    const map = new Map<string, number>()
    adminReports.forEach((r) => map.set(r.reason, (map.get(r.reason) || 0) + 1))
    return Array.from(map.entries()).map(([reason, count]) => ({ reason, count }))
  }, [])

  /* ── Handlers ── */
  const openResolve = (report: Report) => {
    setSelectedReport(report)
    setResolution('')
    setResolveDialogOpen(true)
  }

  const handleResolve = () => {
    if (!selectedReport || !resolution.trim()) return
    addToast(`تم حل البلاغ #${selectedReport.id} بنجاح`, 'success')
    setResolveDialogOpen(false)
    setSelectedReport(null)
    setResolution('')
  }

  const handleDismiss = (report: Report) => {
    addToast(`تم رفض البلاغ #${report.id}`, 'info')
  }

  const handleReview = (report: Report) => {
    addToast(`تم نقل البلاغ #${report.id} إلى قيد المراجعة`, 'info')
  }

  const toggleSort = (field: 'createdAt' | 'reason') => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDir('desc')
    }
  }

  const statCards = [
    { label: 'إجمالي البلاغات', value: counts.all, icon: Flag, color: 'text-white', bg: 'bg-white/10', border: 'border-white/20' },
    { label: 'معلّق', value: counts.pending, icon: Clock, color: 'text-[#D4AF37]', bg: 'bg-[#D4AF37]/10', border: 'border-[#D4AF37]/20' },
    { label: 'قيد المراجعة', value: counts.review, icon: Eye, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
    { label: 'تم الحل', value: counts.resolved, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  ]

  /* ── Custom Tooltip ── */
  const CustomPieTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null
    return (
      <div className="admin-glass rounded-lg px-3 py-2 text-sm">
        <span className="text-white/70">{payload[0].name}: </span>
        <span className="text-gradient-sultan font-bold">{fmt(payload[0].value)}</span>
      </div>
    )
  }

  const CustomBarTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null
    return (
      <div className="admin-glass rounded-lg px-3 py-2 text-sm">
        <span className="text-white/70">{payload[0].payload.reason}: </span>
        <span className="text-gradient-sultan font-bold">{fmt(payload[0].value)}</span>
      </div>
    )
  }

  /* ── Render ── */
  return (
    <div className="space-y-6 p-1">
      {/* ─── Header ─── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Flag className="h-6 w-6 text-[#D4AF37]" />
            إدارة البلاغات
          </h2>
          <p className="text-white/50 text-sm mt-1">مراقبة ومعالجة بلاغات المستخدمين</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <Input
              placeholder="بحث في البلاغات..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64 h-9 bg-white/5 border-white/10 text-white placeholder:text-white/30 text-sm pr-9"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ─── Stats Cards ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className={`admin-card ${card.border} p-4 flex items-center gap-4`}
          >
            <div className={`p-3 rounded-xl ${card.bg}`}>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{fmt(card.value)}</p>
              <p className="text-xs text-white/50">{card.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ─── Charts Row ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="admin-card p-5"
        >
          <h3 className="text-sm font-semibold text-white/80 mb-4">توزيع البلاغات حسب الحالة</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-5 mt-2">
            {pieData.map((item, i) => (
              <div key={item.name} className="flex items-center gap-1.5 text-xs">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: PIE_COLORS[i] }} />
                <span className="text-white/60">{item.name}</span>
                <span className="text-white font-bold">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Bar Chart - Reason Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="admin-card p-5"
        >
          <h3 className="text-sm font-semibold text-white/80 mb-4">توزيع البلاغات حسب السبب</h3>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={reasonDistribution} layout="vertical" margin={{ left: 10, right: 10 }}>
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="reason"
                width={130}
                tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <RechartsTooltip content={<CustomBarTooltip />} />
              <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={16}>
                {reasonDistribution.map((_, i) => (
                  <Cell key={i} fill={['#D4AF37', '#f97316', '#34d399', '#F0D060', '#f87171', '#D4AF37', '#34d399'][i % 7]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* ─── Resolution Progress ─── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="admin-card p-5"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-white/80">معدل الحل</h3>
          <span className="text-lg font-bold text-gradient-sultan">
            {((counts.resolved / counts.all) * 100).toFixed(0)}%
          </span>
        </div>
        <Progress
          value={(counts.resolved / counts.all) * 100}
          className="h-3 bg-white/5"
        />
        <div className="flex items-center justify-between mt-2 text-xs text-white/40">
          <span>{fmt(counts.resolved)} تم الحل</span>
          <span>{fmt(counts.all - counts.resolved)} متبقي</span>
        </div>
      </motion.div>

      {/* ─── Filter Tabs + Table ─── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="admin-card overflow-hidden"
      >
        <Tabs value={tab} onValueChange={(v) => setTab(v as ReportStatus)}>
          <div className="p-4 pb-0">
            <TabsList className="bg-white/5 h-10 w-full sm:w-auto">
              <TabsTrigger value="all" className="text-xs data-[state=active]:bg-[#D4AF37]/15 data-[state=active]:text-[#D4AF37]">
                الكل <span className="mr-1.5 opacity-60">({counts.all})</span>
              </TabsTrigger>
              <TabsTrigger value="pending" className="text-xs data-[state=active]:bg-[#D4AF37]/15 data-[state=active]:text-[#D4AF37]">
                معلّق <span className="mr-1.5 opacity-60">({counts.pending})</span>
              </TabsTrigger>
              <TabsTrigger value="under_review" className="text-xs data-[state=active]:bg-orange-500/15 data-[state=active]:text-orange-400">
                قيد المراجعة <span className="mr-1.5 opacity-60">({counts.review})</span>
              </TabsTrigger>
              <TabsTrigger value="resolved" className="text-xs data-[state=active]:bg-emerald-500/15 data-[state=active]:text-emerald-400">
                تم الحل <span className="mr-1.5 opacity-60">({counts.resolved})</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Shared table for all tabs */}
          <div className="mt-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-right text-white/40 font-medium px-4 py-3 text-xs w-10">#</th>
                    <th
                      className="text-right text-white/40 font-medium px-4 py-3 text-xs cursor-pointer hover:text-white/60"
                      onClick={() => toggleSort('reason')}
                    >
                      <span className="flex items-center gap-1">
                        السبب <ArrowUpDown className="h-3 w-3" />
                      </span>
                    </th>
                    <th className="text-right text-white/40 font-medium px-4 py-3 text-xs">الإعلان / المستخدم</th>
                    <th className="text-right text-white/40 font-medium px-4 py-3 text-xs">المُبلّغ</th>
                    <th className="text-right text-white/40 font-medium px-4 py-3 text-xs">المُبلَّغ عنه</th>
                    <th className="text-right text-white/40 font-medium px-4 py-3 text-xs">الحالة</th>
                    <th
                      className="text-right text-white/40 font-medium px-4 py-3 text-xs cursor-pointer hover:text-white/60"
                      onClick={() => toggleSort('createdAt')}
                    >
                      <span className="flex items-center gap-1">
                        التاريخ <ArrowUpDown className="h-3 w-3" />
                      </span>
                    </th>
                    <th className="text-center text-white/40 font-medium px-4 py-3 text-xs">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence mode="popLayout">
                    {filtered.map((report, idx) => {
                      const sc = statusConfig[report.status]
                      const ReasonIcon = reasonIcons[report.reason] || AlertTriangle
                      return (
                        <motion.tr
                          key={report.id}
                          layout
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.25 }}
                          className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                        >
                          <td className="px-4 py-3.5 text-white/30 text-xs font-mono">{idx + 1}</td>

                          {/* Reason */}
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-2.5">
                              <div className="p-1.5 rounded-lg bg-red-500/10">
                                <ReasonIcon className="h-3.5 w-3.5 text-red-400" />
                              </div>
                              <span className="text-white/90 font-medium text-xs">{report.reason}</span>
                            </div>
                          </td>

                          {/* Listing or User */}
                          <td className="px-4 py-3.5">
                            {report.listingTitle ? (
                              <div className="flex items-center gap-2">
                                <FileText className="h-3.5 w-3.5 text-white/30" />
                                <span className="text-white/70 text-xs max-w-[160px] truncate">{report.listingTitle}</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <User className="h-3.5 w-3.5 text-white/30" />
                                <span className="text-white/50 text-xs italic">بدون إعلان</span>
                              </div>
                            )}
                          </td>

                          {/* Reporter */}
                          <td className="px-4 py-3.5">
                            <span className="text-white/70 text-xs">{report.reporterName}</span>
                          </td>

                          {/* Reported */}
                          <td className="px-4 py-3.5">
                            <span className="text-white/70 text-xs">{report.reportedName}</span>
                          </td>

                          {/* Status */}
                          <td className="px-4 py-3.5">
                            <Badge
                              variant="outline"
                              className={`${sc.bg} ${sc.color} border-0 text-[10px] px-2 py-0.5 font-medium`}
                            >
                              <sc.icon className="h-3 w-3 ml-1" />
                              {sc.label}
                            </Badge>
                          </td>

                          {/* Date */}
                          <td className="px-4 py-3.5">
                            <span className="text-white/40 text-xs">{relativeTime(report.createdAt)}</span>
                          </td>

                          {/* Actions */}
                          <td className="px-4 py-3.5">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => { setSelectedReport(report); setDetailDialogOpen(true) }}
                                className="p-1.5 rounded-lg hover:bg-white/5 text-white/40 hover:text-white/80 transition-colors press-effect"
                                title="التفاصيل"
                              >
                                <Eye className="h-3.5 w-3.5" />
                              </button>
                              {report.status !== 'resolved' && (
                                <>
                                  <button
                                    onClick={() => handleReview(report)}
                                    className="p-1.5 rounded-lg hover:bg-orange-500/10 text-white/40 hover:text-orange-400 transition-colors press-effect"
                                    title="بدء المراجعة"
                                  >
                                    <Eye className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    onClick={() => openResolve(report)}
                                    className="p-1.5 rounded-lg hover:bg-emerald-500/10 text-white/40 hover:text-emerald-400 transition-colors press-effect"
                                    title="حل البلاغ"
                                  >
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDismiss(report)}
                                    className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/40 hover:text-red-400 transition-colors press-effect"
                                    title="رفض"
                                  >
                                    <X className="h-3.5 w-3.5" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      )
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-white/30">
                  <Shield className="h-10 w-10 mb-3" />
                  <p className="text-sm">لا توجد بلاغات مطابقة</p>
                </div>
              )}
            </div>
          </div>
        </Tabs>
      </motion.div>

      {/* ─── Resolve Dialog ─── */}
      <Dialog open={resolveDialogOpen} onOpenChange={setResolveDialogOpen}>
        <DialogContent className="admin-glass border-white/10 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              حل البلاغ
            </DialogTitle>
            <DialogDescription className="text-white/50">
              البلاغ #{selectedReport?.id} — {selectedReport?.reason}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <div className="admin-card p-3 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/40">المُبلَّغ عنه</span>
                <span className="text-white/80">{selectedReport?.reportedName}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/40">المُبلّغ</span>
                <span className="text-white/80">{selectedReport?.reporterName}</span>
              </div>
              {selectedReport?.listingTitle && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/40">الإعلان</span>
                  <span className="text-white/80">{selectedReport.listingTitle}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-white/70 text-sm">الإجراء المتخذ</Label>
              <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto scrollbar-thin">
                {resolutionOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setResolution(opt)}
                    className={`press-effect text-right text-xs px-3 py-2.5 rounded-lg border transition-all ${
                      resolution === opt
                        ? 'border-[#D4AF37]/50 bg-[#D4AF37]/10 text-[#D4AF37]'
                        : 'border-white/5 bg-white/[0.02] text-white/60 hover:border-white/10 hover:text-white/80'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white/70 text-sm">ملاحظات إضافية</Label>
              <Textarea
                placeholder="أضف ملاحظات حول القرار..."
                className="bg-white/5 border-white/10 text-white placeholder:text-white/25 text-sm min-h-[80px] resize-none"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 mt-2">
            <Button
              variant="outline"
              onClick={() => setResolveDialogOpen(false)}
              className="border-white/10 text-white/60 hover:text-white hover:bg-white/5"
            >
              إلغاء
            </Button>
            <Button
              onClick={handleResolve}
              disabled={!resolution.trim()}
              className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30 press-effect"
            >
              <CheckCircle2 className="h-4 w-4 ml-1.5" />
              تأكيد الحل
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Detail Dialog ─── */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="admin-glass border-white/10 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#D4AF37]" />
              تفاصيل البلاغ #{selectedReport?.id}
            </DialogTitle>
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-4 mt-2">
              {/* Status Badge */}
              <div className="flex items-center gap-2">
                {(() => {
                  const sc = statusConfig[selectedReport.status]
                  return (
                    <Badge variant="outline" className={`${sc.bg} ${sc.color} border-0 text-xs px-2.5 py-0.5 font-medium`}>
                      <sc.icon className="h-3.5 w-3.5 ml-1.5" />
                      {sc.label}
                    </Badge>
                  )
                })()}
              </div>

              <Separator className="bg-white/5" />

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="admin-card p-3">
                  <p className="text-[10px] text-white/40 mb-1">سبب البلاغ</p>
                  <div className="flex items-center gap-2">
                    {(() => {
                      const Icon = reasonIcons[selectedReport.reason] || AlertTriangle
                      return <Icon className="h-4 w-4 text-red-400" />
                    })()}
                    <span className="text-white/90 text-sm font-medium">{selectedReport.reason}</span>
                  </div>
                </div>
                <div className="admin-card p-3">
                  <p className="text-[10px] text-white/40 mb-1">تاريخ البلاغ</p>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-white/30" />
                    <span className="text-white/90 text-sm">{relativeTime(selectedReport.createdAt)}</span>
                  </div>
                </div>
                <div className="admin-card p-3">
                  <p className="text-[10px] text-white/40 mb-1">المُبلّغ</p>
                  <span className="text-white/90 text-sm">{selectedReport.reporterName}</span>
                </div>
                <div className="admin-card p-3">
                  <p className="text-[10px] text-white/40 mb-1">المُبلَّغ عنه</p>
                  <span className="text-white/90 text-sm">{selectedReport.reportedName}</span>
                </div>
                {selectedReport.listingTitle && (
                  <div className="admin-card p-3 col-span-2">
                    <p className="text-[10px] text-white/40 mb-1">الإعلان المعني</p>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-[#D4AF37]" />
                      <span className="text-white/90 text-sm font-medium">{selectedReport.listingTitle}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Resolution Info */}
              {selectedReport.status === 'resolved' && (
                <>
                  <Separator className="bg-white/5" />
                  <div className="admin-card-gold p-4">
                    <p className="text-[10px] text-[#D4AF37]/70 mb-1.5">تم الحل بواسطة</p>
                    <p className="text-white text-sm font-medium mb-2">{selectedReport.resolvedBy}</p>
                    <p className="text-[10px] text-white/40 mb-1">الإجراء</p>
                    <p className="text-emerald-400 text-sm">{selectedReport.resolution}</p>
                  </div>
                </>
              )}

              {/* Actions */}
              {selectedReport.status !== 'resolved' && (
                <>
                  <Separator className="bg-white/5" />
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => { setDetailDialogOpen(false); openResolve(selectedReport) }}
                      className="flex-1 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30 press-effect text-sm"
                    >
                      <CheckCircle2 className="h-4 w-4 ml-1.5" />
                      حل البلاغ
                    </Button>
                    <Button
                      onClick={() => { setDetailDialogOpen(false); handleReview(selectedReport) }}
                      className="flex-1 bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 border border-orange-500/30 press-effect text-sm"
                    >
                      <Eye className="h-4 w-4 ml-1.5" />
                      بدء المراجعة
                    </Button>
                    <Button
                      onClick={() => { setDetailDialogOpen(false); handleDismiss(selectedReport) }}
                      className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30 press-effect text-sm"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

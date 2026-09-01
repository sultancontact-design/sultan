'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ScrollText,
  Search,
  Filter,
  Eye,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  CircleDot,
  User,
  FileText,
  Flag,
  Settings,
  Gavel,
  Heart,
  Wallet,
  Clock,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { adminAuditLog } from '@/lib/seed-data'
import { useSultanStore } from '@/lib/store'

const fmt = (n: number) => n.toLocaleString('ar-EG')

interface AuditEntry {
  id: string
  action: string
  admin: string
  adminRole: string
  target: string
  targetType: string
  targetId: string
  ip: string
  userAgent: string
  severity: string
  createdAt: string
}

interface AuditLogPanelProps {
  onNavigate?: (panel: string) => void
}

const severityConfig: Record<string, { color: string; bg: string; label: string; dot: string }> = {
  high: { color: '#f87171', bg: '#f8717115', label: 'مرتفع', dot: 'bg-[#f87171]' },
  medium: { color: '#f97316', bg: '#f9731615', label: 'متوسط', dot: 'bg-[#f97316]' },
  low: { color: '#34d399', bg: '#34d39915', label: 'منخفض', dot: 'bg-[#34d399]' },
}

const typeIcons: Record<string, any> = {
  user: User,
  listing: FileText,
  report: Flag,
  setting: Settings,
  feature_flag: Gavel,
  cashout: Wallet,
  charity: Heart,
}

const typeLabels: Record<string, string> = {
  user: 'مستخدم',
  listing: 'إعلان',
  report: 'بلاغ',
  setting: 'إعداد',
  feature_flag: 'ميزة',
  cashout: 'سحب',
  charity: 'تضامن',
}

const typeColors: Record<string, string> = {
  user: '#D4AF37',
  listing: '#34d399',
  report: '#f87171',
  setting: '#f97316',
  feature_flag: '#F0D060',
  cashout: '#34d399',
  charity: '#f87171',
}

const roleLabels: Record<string, string> = {
  super_admin: 'مدير عام',
  admin: 'مدير',
  moderator: 'مشرف',
}

const roleColors: Record<string, string> = {
  super_admin: '#D4AF37',
  admin: '#34d399',
  moderator: '#f97316',
}

const relativeTime = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(mins / 60)
  const days = Math.floor(hours / 24)
  if (days > 0) return `منذ ${fmt(days)} يوم`
  if (hours > 0) return `منذ ${fmt(hours)} ساعة`
  if (mins > 0) return `منذ ${fmt(mins)} دقيقة`
  return 'الآن'
}

const formatFullTime = (iso: string) => {
  const d = new Date(iso)
  return d.toLocaleDateString('ar-EG', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  })
}

export default function AuditLogPanel({ onNavigate }: AuditLogPanelProps) {
  const [search, setSearch] = useState('')
  const [severityFilter, setSeverityFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [adminFilter, setAdminFilter] = useState('all')
  const [selectedEntry, setSelectedEntry] = useState<AuditEntry | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  const logs: AuditEntry[] = adminAuditLog as unknown as AuditEntry[]

  const stats = useMemo(() => ({
    total: logs.length,
    high: logs.filter((l) => l.severity === 'high').length,
    medium: logs.filter((l) => l.severity === 'medium').length,
    low: logs.filter((l) => l.severity === 'low').length,
  }), [logs])

  const uniqueAdmins = useMemo(() => [...new Set(logs.map((l) => l.admin))], [logs])

  const filteredLogs = useMemo(() => {
    let result = [...logs]
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (l) =>
          l.action.includes(q) ||
          l.admin.includes(q) ||
          l.target.includes(q)
      )
    }
    if (severityFilter !== 'all') result = result.filter((l) => l.severity === severityFilter)
    if (typeFilter !== 'all') result = result.filter((l) => l.targetType === typeFilter)
    if (adminFilter !== 'all') result = result.filter((l) => l.admin === adminFilter)
    return result
  }, [logs, search, severityFilter, typeFilter, adminFilter])

  const timelineLogs = logs.slice(0, 5)

  const openDetail = (entry: AuditEntry) => {
    setSelectedEntry(entry)
    setDetailOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl sultan-gradient flex items-center justify-center">
          <ScrollText className="w-5 h-5 text-[#0A1628]" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gradient-sultan">سجل العمليات</h2>
          <p className="text-xs text-white/40">تتبع جميع الإجراءات الإدارية</p>
        </div>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'إجمالي العمليات', value: stats.total, color: '#D4AF37', icon: <ScrollText className="w-4 h-4" /> },
          { label: 'شدة مرتفعة', value: stats.high, color: '#f87171', icon: <ShieldAlert className="w-4 h-4" /> },
          { label: 'شدة متوسطة', value: stats.medium, color: '#f97316', icon: <AlertTriangle className="w-4 h-4" /> },
          { label: 'شدة منخفضة', value: stats.low, color: '#34d399', icon: <ShieldCheck className="w-4 h-4" /> },
        ].map((s) => (
          <motion.div key={s.label} className="admin-card p-4 flex items-center gap-3" whileHover={{ scale: 1.01 }}>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${s.color}15` }}>
              <span style={{ color: s.color }}>{s.icon}</span>
            </div>
            <div>
              <p className="text-lg font-bold" style={{ color: s.color }}>{fmt(s.value)}</p>
              <p className="text-[10px] text-white/40">{s.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Main Content */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Filters */}
          <div className="admin-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="w-4 h-4 text-[#D4AF37]" />
              <h3 className="text-sm font-bold text-white/70">التصفية</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <Input
                  placeholder="بحث..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/25 pr-9 text-sm focus:border-[#D4AF37]/50"
                />
              </div>
              <Select value={severityFilter} onValueChange={setSeverityFilter} dir="rtl">
                <SelectTrigger className="bg-white/5 border-white/10 text-white text-sm"><SelectValue placeholder="الشدة" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">كل المستويات</SelectItem>
                  <SelectItem value="high">مرتفع</SelectItem>
                  <SelectItem value="medium">متوسط</SelectItem>
                  <SelectItem value="low">منخفض</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter} dir="rtl">
                <SelectTrigger className="bg-white/5 border-white/10 text-white text-sm"><SelectValue placeholder="النوع" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">كل الأنواع</SelectItem>
                  {Object.entries(typeLabels).map(([k, v]) => (<SelectItem key={k} value={k}>{v}</SelectItem>))}
                </SelectContent>
              </Select>
              <Select value={adminFilter} onValueChange={setAdminFilter} dir="rtl">
                <SelectTrigger className="bg-white/5 border-white/10 text-white text-sm"><SelectValue placeholder="المدير" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">كل المديرين</SelectItem>
                  {uniqueAdmins.map((a) => (<SelectItem key={a} value={a}>{a}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Log Table */}
          <div className="admin-card overflow-hidden">
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-right p-3 text-xs text-white/40 font-medium">الوقت</th>
                    <th className="text-right p-3 text-xs text-white/40 font-medium">المدير</th>
                    <th className="text-right p-3 text-xs text-white/40 font-medium">الإجراء</th>
                    <th className="text-right p-3 text-xs text-white/40 font-medium hidden md:table-cell">الهدف</th>
                    <th className="text-right p-3 text-xs text-white/40 font-medium hidden lg:table-cell">النوع</th>
                    <th className="text-center p-3 text-xs text-white/40 font-medium">الشدة</th>
                    <th className="text-center p-3 text-xs text-white/40 font-medium">عرض</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filteredLogs.map((log, i) => {
                      const sev = severityConfig[log.severity] || severityConfig.low
                      const tColor = typeColors[log.targetType] || '#D4AF37'
                      const rColor = roleColors[log.adminRole] || '#D4AF37'
                      const TypeIcon = typeIcons[log.targetType] || FileText
                      return (
                        <motion.tr
                          key={log.id}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 8 }}
                          transition={{ delay: i * 0.03 }}
                          className="border-b border-white/3 hover:bg-white/3 transition-colors cursor-pointer group"
                          style={{ borderRight: `3px solid ${sev.color}30` }}
                          onClick={() => openDetail(log)}
                        >
                          <td className="p-3 text-xs text-white/50 whitespace-nowrap">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-white/20" />
                              {relativeTime(log.createdAt)}
                            </div>
                          </td>
                          <td className="p-3">
                            <div>
                              <p className="text-xs text-white/80 font-medium">{log.admin}</p>
                              <Badge className="text-[8px] px-1 py-0 mt-0.5" style={{ background: `${rColor}18`, color: rColor, border: 0 }}>
                                {roleLabels[log.adminRole] || log.adminRole}
                              </Badge>
                            </div>
                          </td>
                          <td className="p-3 text-xs text-white/70 max-w-[180px] truncate">{log.action}</td>
                          <td className="p-3 text-xs text-white/50 max-w-[140px] truncate hidden md:table-cell">{log.target}</td>
                          <td className="p-3 hidden lg:table-cell">
                            <Badge className="text-[9px] px-1.5 py-0.5 gap-1" style={{ background: `${tColor}15`, color: tColor, border: 0 }}>
                              <TypeIcon className="w-3 h-3" />
                              {typeLabels[log.targetType] || log.targetType}
                            </Badge>
                          </td>
                          <td className="p-3 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <span className={`w-2 h-2 rounded-full ${sev.dot}`} />
                              <span className="text-[10px]" style={{ color: sev.color }}>{sev.label}</span>
                            </div>
                          </td>
                          <td className="p-3 text-center">
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Eye className="w-3.5 h-3.5 text-white/50" />
                            </Button>
                          </td>
                        </motion.tr>
                      )
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
            {filteredLogs.length === 0 && (
              <div className="p-10 text-center">
                <ScrollText className="w-10 h-10 text-white/15 mx-auto mb-3" />
                <p className="text-sm text-white/30">لا توجد نتائج مطابقة</p>
              </div>
            )}
          </div>
        </div>

        {/* Timeline Sidebar */}
        <div className="lg:w-72 shrink-0">
          <div className="admin-card p-4 lg:sticky lg:top-4">
            <h3 className="text-sm font-bold text-white/70 mb-4 flex items-center gap-2">
              <CircleDot className="w-4 h-4 text-[#D4AF37]" />
              آخر العمليات
            </h3>
            <div className="relative space-y-0">
              {/* Connecting line */}
              <div className="absolute top-2 right-[7px] w-px h-[calc(100%-16px)] bg-gradient-to-b from-[#D4AF37]/40 via-[#D4AF37]/15 to-transparent" />
              {timelineLogs.map((log, i) => {
                const sev = severityConfig[log.severity] || severityConfig.low
                return (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="relative pr-5 pb-5 last:pb-0 cursor-pointer group/tl"
                    onClick={() => openDetail(log)}
                  >
                    {/* Dot */}
                    <div
                      className="absolute right-0 top-1.5 w-[15px] h-[15px] rounded-full border-2 border-[#0A1628] z-10"
                      style={{ background: sev.color }}
                    />
                    <div className="group-hover/tl:bg-white/3 rounded-lg p-2 -mt-1 transition-colors">
                      <p className="text-xs text-white/70 font-medium leading-relaxed">{log.action}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] text-white/30">{log.admin}</span>
                        <span className="text-[10px] text-white/15">•</span>
                        <span className="text-[10px] text-white/30">{relativeTime(log.createdAt)}</span>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen} dir="rtl">
        <DialogContent className="bg-[#0A1628] border border-white/10 admin-glass max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-gradient-sultan flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#D4AF37]" />
              تفاصيل العملية
            </DialogTitle>
          </DialogHeader>
          {selectedEntry && (
            <div className="space-y-4 mt-2">
              <DetailRow label="الإجراء" value={selectedEntry.action} />
              <DetailRow label="المدير" value={selectedEntry.admin} />
              <DetailRow label="الدور" value={roleLabels[selectedEntry.adminRole] || selectedEntry.adminRole} />
              <DetailRow label="الهدف" value={selectedEntry.target} />
              <div className="flex items-center gap-6">
                <DetailRow label="النوع" value={typeLabels[selectedEntry.targetType] || selectedEntry.targetType} />
                <DetailRow
                  label="الشدة"
                  value={severityConfig[selectedEntry.severity]?.label || selectedEntry.severity}
                  valueColor={severityConfig[selectedEntry.severity]?.color}
                />
              </div>
              <div className="border-t border-white/5 my-2" />
              <DetailRow label="عنوان IP" value={selectedEntry.ip} mono />
              <div>
                <p className="text-[10px] text-white/30 mb-1">وكيل المستخدم</p>
                <p className="text-xs text-white/60 bg-white/5 p-2.5 rounded-lg font-mono break-all" dir="ltr">{selectedEntry.userAgent}</p>
              </div>
              <DetailRow label="التاريخ والوقت" value={formatFullTime(selectedEntry.createdAt)} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

/* ─── Detail Row Helper ─── */
function DetailRow({ label, value, valueColor, mono }: { label: string; value: string; valueColor?: string; mono?: boolean }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-xs text-white/30 min-w-[90px] pt-0.5">{label}</span>
      <span className={`text-sm text-white/80 font-medium ${mono ? 'font-mono' : ''}`} style={valueColor ? { color: valueColor } : undefined}>
        {value}
      </span>
    </div>
  )
}

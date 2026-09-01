'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, UserCheck, ShieldCheck, ShieldBan, TrendingUp,
  Search, Eye, CheckCircle2, Ban, UserCog, Star,
  Mail, Phone, MapPin, CalendarDays, FileText, Gavel,
  Shield, AlertTriangle, ChevronDown, X, ArrowUpDown,
  Crown, Zap, UserMinus, MoreVertical,
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
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  PieChart, Pie, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell,
} from 'recharts'
import { adminUsers, listings, adminStats, cities } from '@/lib/seed-data'
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
  if (days < 30) return `منذ ${fmt(days)} يوم`
  const months = Math.floor(days / 30)
  return `منذ ${fmt(months)} شهر`
}

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface UsersPanelProps {
  onNavigate?: (panel: string) => void
}

type UserFilter = 'all' | 'user' | 'admin' | 'moderator' | 'super_admin'
type StatusFilter = 'all' | 'active' | 'banned'

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */
const roleConfig: Record<string, { label: string; color: string; bg: string }> = {
  super_admin: { label: 'مدير أعلى', color: 'text-[#D4AF37]', bg: 'bg-[#D4AF37]/15' },
  admin:       { label: 'مدير',      color: 'text-orange-400', bg: 'bg-orange-500/15' },
  moderator:   { label: 'مشرف',      color: 'text-emerald-400', bg: 'bg-emerald-500/15' },
  user:        { label: 'مستخدم',    color: 'text-white/60', bg: 'bg-white/5' },
}

const PIE_COLORS = ['#D4AF37', '#34d399', '#f97316', '#f87171', '#F0D060']
const BAR_COLORS = ['#D4AF37', '#34d399', '#f97316', '#f87171', '#F0D060', '#D4AF37', '#34d399', '#f97316']

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function UsersPanel({ onNavigate }: UsersPanelProps) {
  const addToast = useSultanStore((s) => s.addToast)

  const [roleFilter, setRoleFilter] = useState<UserFilter>('all')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [cityFilter, setCityFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [detailUser, setDetailUser] = useState<typeof adminUsers[number] | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [banDialogOpen, setBanDialogOpen] = useState(false)
  const [banReason, setBanReason] = useState('')
  const [targetUser, setTargetUser] = useState<typeof adminUsers[number] | null>(null)
  const [sortField, setSortField] = useState<'trustScore' | 'listingsCount' | 'createdAt'>('createdAt')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [page, setPage] = useState(0)
  const PER_PAGE = 8

  /* ── Computed ── */
  const stats = useMemo(() => {
    const total = adminUsers.length
    const admins = adminUsers.filter((u) => u.role === 'admin' || u.role === 'super_admin' || u.role === 'moderator').length
    const banned = adminUsers.filter((u) => u.isBanned).length
    const verified = adminUsers.filter((u) => u.isVerified).length
    const rising = adminUsers.filter((u) => u.isRising).length
    const avgTrust = Math.round(adminUsers.reduce((s, u) => s + u.trustScore, 0) / total)
    return { total, admins, banned, verified, rising, avgTrust }
  }, [])

  const filtered = useMemo(() => {
    let list = [...adminUsers]
    if (roleFilter !== 'all') list = list.filter((u) => u.role === roleFilter)
    if (statusFilter === 'banned') list = list.filter((u) => u.isBanned)
    else if (statusFilter === 'active') list = list.filter((u) => !u.isBanned)
    if (cityFilter !== 'all') list = list.filter((u) => u.city === cityFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (u) =>
          u.displayName.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.phone.includes(q),
      )
    }
    list.sort((a, b) => {
      const mul = sortDir === 'asc' ? 1 : -1
      if (sortField === 'trustScore') return mul * (a.trustScore - b.trustScore)
      if (sortField === 'listingsCount') return mul * (a.listingsCount - b.listingsCount)
      return mul * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    })
    return list
  }, [roleFilter, statusFilter, cityFilter, search, sortField, sortDir])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const paginated = filtered.slice(page * PER_PAGE, (page + 1) * PER_PAGE)

  const roleDistribution = useMemo(() => {
    const map = new Map<string, number>()
    adminUsers.forEach((u) => map.set(u.role, (map.get(u.role) || 0) + 1))
    return Array.from(map.entries()).map(([role, count]) => ({ role: roleConfig[role]?.label || role, count }))
  }, [])

  const cityDistribution = useMemo(() => {
    const map = new Map<string, number>()
    adminUsers.forEach((u) => map.set(u.city, (map.get(u.city) || 0) + 1))
    return Array.from(map.entries())
      .map(([city, count]) => ({ city, count }))
      .sort((a, b) => b.count - a.count)
  }, [])

  const trustDistribution = useMemo(() => {
    const ranges = [
      { range: '0-30', label: 'ضعيف', count: 0 },
      { range: '31-60', label: 'متوسط', count: 0 },
      { range: '61-80', label: 'جيد', count: 0 },
      { range: '81-95', label: 'ممتاز', count: 0 },
      { range: '96-100', label: 'استثنائي', count: 0 },
    ]
    adminUsers.forEach((u) => {
      if (u.trustScore <= 30) ranges[0].count++
      else if (u.trustScore <= 60) ranges[1].count++
      else if (u.trustScore <= 80) ranges[2].count++
      else if (u.trustScore <= 95) ranges[3].count++
      else ranges[4].count++
    })
    return ranges
  }, [])

  /* ── Handlers ── */
  const openDetail = (user: typeof adminUsers[number]) => {
    setDetailUser(user)
    setDetailOpen(true)
  }

  const openBanDialog = (user: typeof adminUsers[number]) => {
    setTargetUser(user)
    setBanReason('')
    setBanDialogOpen(true)
  }

  const handleBan = () => {
    if (!targetUser) return
    addToast(`تم حظر ${targetUser.displayName} بنجاح`, 'success')
    setBanDialogOpen(false)
    setTargetUser(null)
  }

  const handleUnban = (user: typeof adminUsers[number]) => {
    addToast(`تم فك الحظر عن ${user.displayName}`, 'success')
  }

  const handleVerify = (user: typeof adminUsers[number]) => {
    addToast(`تم توثيق حساب ${user.displayName}`, 'success')
  }

  const handleRoleChange = (user: typeof adminUsers[number]) => {
    addToast(`تم تغيير دور ${user.displayName}`, 'info')
  }

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortField(field); setSortDir('desc') }
  }

  const trustColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400'
    if (score >= 70) return 'text-[#D4AF37]'
    if (score >= 50) return 'text-orange-400'
    return 'text-red-400'
  }

  const trustBg = (score: number) => {
    if (score >= 90) return 'bg-emerald-500'
    if (score >= 70) return 'bg-[#D4AF37]'
    if (score >= 50) return 'bg-orange-500'
    return 'bg-red-500'
  }

  /* ── Custom Tooltips ── */
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null
    return (
      <div className="admin-glass rounded-lg px-3 py-2 text-sm">
        <span className="text-white/70">{payload[0].payload.role || payload[0].payload.city || payload[0].payload.label}: </span>
        <span className="text-gradient-sultan font-bold">{fmt(payload[0].value)}</span>
      </div>
    )
  }

  /* ── Stat Cards ── */
  const statCards = [
    { label: 'إجمالي المستخدمين', value: fmt(adminStats.totalUsers), icon: Users, color: 'text-white', bg: 'bg-white/10' },
    { label: 'فريق الإدارة', value: fmt(stats.admins), icon: ShieldCheck, color: 'text-[#D4AF37]', bg: 'bg-[#D4AF37]/10' },
    { label: 'محظورون', value: fmt(stats.banned), icon: ShieldBan, color: 'text-red-400', bg: 'bg-red-500/10' },
    { label: 'موثّقون', value: fmt(stats.verified), icon: UserCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  ]

  /* ── Render ── */
  return (
    <div className="space-y-6 p-1">
      {/* ─── Header ─── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="h-6 w-6 text-[#D4AF37]" />
            إدارة المستخدمين
          </h2>
          <p className="text-white/50 text-sm mt-1">إدارة ومراقبة حسابات المستخدمين ({fmt(adminStats.totalUsers)} مسجّل)</p>
        </div>
      </div>

      {/* ─── Stats Cards ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="admin-card p-4 flex items-center gap-4"
          >
            <div className={`p-3 rounded-xl ${card.bg}`}>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{card.value}</p>
              <p className="text-xs text-white/50">{card.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ─── Charts Row ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Role Pie */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="admin-card p-5"
        >
          <h3 className="text-sm font-semibold text-white/80 mb-3">توزيع الأدوار</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={roleDistribution}
                cx="50%" cy="50%"
                innerRadius={45} outerRadius={75}
                paddingAngle={3} dataKey="count" stroke="none"
              >
                {roleDistribution.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-1">
            {roleDistribution.map((item, i) => (
              <div key={item.role} className="flex items-center gap-1 text-[10px]">
                <span className="h-2 w-2 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                <span className="text-white/50">{item.role}</span>
                <span className="text-white font-bold">{item.count}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* City Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="admin-card p-5"
        >
          <h3 className="text-sm font-semibold text-white/80 mb-3">المستخدمون حسب المدينة</h3>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={cityDistribution} layout="vertical" margin={{ left: 5, right: 10 }}>
              <XAxis type="number" hide />
              <YAxis
                type="category" dataKey="city" width={90}
                tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }}
                axisLine={false} tickLine={false}
              />
              <RechartsTooltip content={<CustomTooltip />} />
              <Bar dataKey="count" radius={[0, 5, 5, 0]} barSize={14}>
                {cityDistribution.map((_, i) => (
                  <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Trust Score Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="admin-card p-5"
        >
          <h3 className="text-sm font-semibold text-white/80 mb-3">توزيع نقاط الثقة</h3>
          <ResponsiveContainer width="100%" height={230}>
            <AreaChart data={trustDistribution} margin={{ left: 5, right: 10 }}>
              <defs>
                <linearGradient id="trustGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#D4AF37" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#D4AF37" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="label"
                tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }}
                axisLine={false} tickLine={false}
              />
              <YAxis hide />
              <RechartsTooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="count" stroke="#D4AF37" fill="url(#trustGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center mt-1 gap-2 text-xs text-white/50">
            <Star className="h-3.5 w-3.5 text-[#D4AF37]" />
            <span>المعدل: <span className="text-gradient-sultan font-bold">{stats.avgTrust}</span></span>
          </div>
        </motion.div>
      </div>

      {/* ─── Filters + Table ─── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="admin-card overflow-hidden"
      >
        {/* Filter Bar */}
        <div className="p-4 border-b border-white/5 flex flex-col lg:flex-row gap-3 items-start lg:items-center">
          {/* Search */}
          <div className="relative flex-1 w-full lg:max-w-xs">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <Input
              placeholder="بحث بالاسم أو البريد أو الهاتف..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0) }}
              className="w-full h-9 bg-white/5 border-white/10 text-white placeholder:text-white/30 text-sm pr-9"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            {/* Role Tabs */}
            <Tabs value={roleFilter} onValueChange={(v) => { setRoleFilter(v as UserFilter); setPage(0) }}>
              <TabsList className="bg-white/5 h-9">
                <TabsTrigger value="all" className="text-[11px] data-[state=active]:bg-[#D4AF37]/15 data-[state=active]:text-[#D4AF37] px-2.5">
                  الكل
                </TabsTrigger>
                <TabsTrigger value="user" className="text-[11px] data-[state=active]:bg-white/10 data-[state=active]:text-white px-2.5">
                  مستخدمون
                </TabsTrigger>
                <TabsTrigger value="admin" className="text-[11px] data-[state=active]:bg-orange-500/15 data-[state=active]:text-orange-400 px-2.5">
                  مديرون
                </TabsTrigger>
                <TabsTrigger value="moderator" className="text-[11px] data-[state=active]:bg-emerald-500/15 data-[state=active]:text-emerald-400 px-2.5">
                  مشرفون
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <Separator orientation="vertical" className="h-6 bg-white/10 hidden lg:block" />

            {/* Status Select */}
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v as StatusFilter); setPage(0) }}>
              <SelectTrigger className="w-28 h-9 bg-white/5 border-white/10 text-white text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="admin-glass border-white/10">
                <SelectItem value="all" className="text-white/80 text-xs">الكل</SelectItem>
                <SelectItem value="active" className="text-white/80 text-xs">نشط</SelectItem>
                <SelectItem value="banned" className="text-red-400 text-xs">محظور</SelectItem>
              </SelectContent>
            </Select>

            {/* City Select */}
            <Select value={cityFilter} onValueChange={(v) => { setCityFilter(v); setPage(0) }}>
              <SelectTrigger className="w-36 h-9 bg-white/5 border-white/10 text-white text-xs">
                <SelectValue placeholder="كل المدن" />
              </SelectTrigger>
              <SelectContent className="admin-glass border-white/10">
                <SelectItem value="all" className="text-white/80 text-xs">كل المدن</SelectItem>
                {cities.map((c) => (
                  <SelectItem key={c.id} value={c.nameAr} className="text-white/80 text-xs">{c.nameAr}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Count */}
        <div className="px-4 py-2 border-b border-white/5 flex items-center justify-between">
          <span className="text-xs text-white/40">
            عرض {fmt((page * PER_PAGE) + 1)}-{fmt(Math.min((page + 1) * PER_PAGE, filtered.length))} من {fmt(filtered.length)}
          </span>
          <div className="flex items-center gap-1 text-xs text-white/30">
            <span>الصفحة {fmt(page + 1)} من {fmt(totalPages)}</span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-right text-white/40 font-medium px-4 py-3 text-xs">المستخدم</th>
                <th className="text-right text-white/40 font-medium px-4 py-3 text-xs">الدور</th>
                <th
                  className="text-right text-white/40 font-medium px-4 py-3 text-xs cursor-pointer hover:text-white/60"
                  onClick={() => toggleSort('trustScore')}
                >
                  <span className="flex items-center gap-1">الثقة <ArrowUpDown className="h-3 w-3" /></span>
                </th>
                <th
                  className="text-right text-white/40 font-medium px-4 py-3 text-xs cursor-pointer hover:text-white/60"
                  onClick={() => toggleSort('listingsCount')}
                >
                  <span className="flex items-center gap-1">الإعلانات <ArrowUpDown className="h-3 w-3" /></span>
                </th>
                <th className="text-right text-white/40 font-medium px-4 py-3 text-xs">المدينة</th>
                <th
                  className="text-right text-white/40 font-medium px-4 py-3 text-xs cursor-pointer hover:text-white/60"
                  onClick={() => toggleSort('createdAt')}
                >
                  <span className="flex items-center gap-1">الانضمام <ArrowUpDown className="h-3 w-3" /></span>
                </th>
                <th className="text-center text-white/40 font-medium px-4 py-3 text-xs">الحالة</th>
                <th className="text-center text-white/40 font-medium px-4 py-3 text-xs">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {paginated.map((user) => {
                  const rc = roleConfig[user.role]
                  return (
                    <motion.tr
                      key={user.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                    >
                      {/* User Info */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${user.isBanned ? 'bg-red-500/15 text-red-400' : 'bg-[#D4AF37]/15 text-[#D4AF37]'}`}>
                            {user.displayName.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-white/90 font-medium text-xs truncate max-w-[120px]">{user.displayName}</span>
                              {user.isVerified && <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />}
                              {user.isRising && <Zap className="h-3.5 w-3.5 text-orange-400 shrink-0" />}
                            </div>
                            <p className="text-white/30 text-[10px] truncate max-w-[160px]">{user.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-4 py-3">
                        <Badge variant="outline" className={`${rc.bg} ${rc.color} border-0 text-[10px] px-2 py-0.5 font-medium`}>
                          {user.role === 'super_admin' && <Crown className="h-2.5 w-2.5 ml-1" />}
                          {rc.label}
                        </Badge>
                      </td>

                      {/* Trust Score */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 min-w-[100px]">
                          <Progress value={user.trustScore} className={`h-1.5 flex-1 bg-white/5 [&>div]:${trustBg(user.trustScore)}`} />
                          <span className={`text-xs font-bold min-w-[28px] text-left ${trustColor(user.trustScore)}`}>
                            {user.trustScore}
                          </span>
                        </div>
                      </td>

                      {/* Listings Count */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 text-xs text-white/60">
                          <FileText className="h-3.5 w-3.5" />
                          <span>{user.listingsCount}</span>
                          <span className="text-white/20">|</span>
                          <Gavel className="h-3.5 w-3.5" />
                          <span>{user.bidsCount}</span>
                        </div>
                      </td>

                      {/* City */}
                      <td className="px-4 py-3">
                        <span className="text-white/60 text-xs">{user.city}</span>
                      </td>

                      {/* Joined */}
                      <td className="px-4 py-3">
                        <span className="text-white/40 text-xs">{relativeTime(user.createdAt)}</span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3 text-center">
                        {user.isBanned ? (
                          <Badge variant="outline" className="bg-red-500/15 text-red-400 border-0 text-[10px] px-2 py-0.5 font-medium">
                            <Ban className="h-2.5 w-2.5 ml-1" />
                            محظور
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-emerald-500/15 text-emerald-400 border-0 text-[10px] px-2 py-0.5 font-medium">
                            <CheckCircle2 className="h-2.5 w-2.5 ml-1" />
                            نشط
                          </Badge>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => openDetail(user)}
                            className="p-1.5 rounded-lg hover:bg-white/5 text-white/40 hover:text-white/80 transition-colors press-effect"
                            title="التفاصيل"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                          {user.isBanned ? (
                            <button
                              onClick={() => handleUnban(user)}
                              className="p-1.5 rounded-lg hover:bg-emerald-500/10 text-white/40 hover:text-emerald-400 transition-colors press-effect"
                              title="فك الحظر"
                            >
                              <UserCheck className="h-3.5 w-3.5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => openBanDialog(user)}
                              className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/40 hover:text-red-400 transition-colors press-effect"
                              title="حظر"
                            >
                              <ShieldBan className="h-3.5 w-3.5" />
                            </button>
                          )}
                          {!user.isVerified && !user.isBanned && (
                            <button
                              onClick={() => handleVerify(user)}
                              className="p-1.5 rounded-lg hover:bg-[#D4AF37]/10 text-white/40 hover:text-[#D4AF37] transition-colors press-effect"
                              title="توثيق"
                            >
                              <ShieldCheck className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  )
                })}
              </AnimatePresence>
            </tbody>
          </table>

          {paginated.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-white/30">
              <Users className="h-10 w-10 mb-3" />
              <p className="text-sm">لا يوجد مستخدمون مطابقون</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-white/5 flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="h-8 border-white/10 text-white/60 hover:text-white hover:bg-white/5 text-xs"
            >
              السابق
            </Button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`w-8 h-8 rounded-lg text-xs font-medium transition-all press-effect ${
                  page === i
                    ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30'
                    : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                }`}
              >
                {fmt(i + 1)}
              </button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="h-8 border-white/10 text-white/60 hover:text-white hover:bg-white/5 text-xs"
            >
              التالي
            </Button>
          </div>
        )}
      </motion.div>

      {/* ─── User Detail Dialog ─── */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="admin-glass border-white/10 max-w-lg max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <UserCog className="h-5 w-5 text-[#D4AF37]" />
              تفاصيل المستخدم
            </DialogTitle>
          </DialogHeader>

          {detailUser && (
            <ScrollArea className="max-h-[70vh] pr-2">
              <div className="space-y-4 mt-2">
                {/* Header Card */}
                <div className="admin-card-gold p-4 flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold ${detailUser.isBanned ? 'bg-red-500/15 text-red-400' : 'bg-[#D4AF37]/15 text-[#D4AF37]'}`}>
                    {detailUser.displayName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-white font-bold text-base">{detailUser.displayName}</h3>
                      {detailUser.isVerified && <ShieldCheck className="h-4 w-4 text-emerald-400" />}
                      {detailUser.isRising && <Zap className="h-4 w-4 text-orange-400" />}
                      {detailUser.isBanned && <Badge variant="outline" className="bg-red-500/15 text-red-400 border-0 text-[10px] px-2 py-0.5"><Ban className="h-3 w-3 ml-1" />محظور</Badge>}
                    </div>
                    <Badge variant="outline" className={`${roleConfig[detailUser.role].bg} ${roleConfig[detailUser.role].color} border-0 text-[10px] px-2 py-0.5 mt-1`}>
                      {roleConfig[detailUser.role].label}
                    </Badge>
                  </div>
                </div>

                {/* Trust Score */}
                <div className="admin-card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-white/50">نقطة الثقة</span>
                    <span className={`text-lg font-bold ${trustColor(detailUser.trustScore)}`}>{detailUser.trustScore}</span>
                  </div>
                  <Progress value={detailUser.trustScore} className="h-2.5 bg-white/5" />
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="admin-card p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Mail className="h-3.5 w-3.5 text-white/30" />
                      <span className="text-[10px] text-white/40">البريد</span>
                    </div>
                    <p className="text-white/80 text-xs truncate">{detailUser.email}</p>
                  </div>
                  <div className="admin-card p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Phone className="h-3.5 w-3.5 text-white/30" />
                      <span className="text-[10px] text-white/40">الهاتف</span>
                    </div>
                    <p className="text-white/80 text-xs" dir="ltr">{detailUser.phone}</p>
                  </div>
                  <div className="admin-card p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="h-3.5 w-3.5 text-white/30" />
                      <span className="text-[10px] text-white/40">المدينة</span>
                    </div>
                    <p className="text-white/80 text-xs">{detailUser.city}</p>
                  </div>
                  <div className="admin-card p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <CalendarDays className="h-3.5 w-3.5 text-white/30" />
                      <span className="text-[10px] text-white/40">الانضمام</span>
                    </div>
                    <p className="text-white/80 text-xs">{relativeTime(detailUser.createdAt)}</p>
                  </div>
                  <div className="admin-card p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="h-3.5 w-3.5 text-white/30" />
                      <span className="text-[10px] text-white/40">الإعلانات</span>
                    </div>
                    <p className="text-white/80 text-xs font-bold">{fmt(detailUser.listingsCount)}</p>
                  </div>
                  <div className="admin-card p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Gavel className="h-3.5 w-3.5 text-white/30" />
                      <span className="text-[10px] text-white/40">المزايدات</span>
                    </div>
                    <p className="text-white/80 text-xs font-bold">{fmt(detailUser.bidsCount)}</p>
                  </div>
                  <div className="admin-card p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="h-3.5 w-3.5 text-white/30" />
                      <span className="text-[10px] text-white/40">البلاغات</span>
                    </div>
                    <p className={`text-xs font-bold ${detailUser.reportsCount > 0 ? 'text-red-400' : 'text-white/80'}`}>{fmt(detailUser.reportsCount)}</p>
                  </div>
                  <div className="admin-card p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Eye className="h-3.5 w-3.5 text-white/30" />
                      <span className="text-[10px] text-white/40">آخر ظهور</span>
                    </div>
                    <p className="text-white/80 text-xs">{relativeTime(detailUser.lastSeen)}</p>
                  </div>
                </div>

                {/* Ban Reason */}
                {detailUser.isBanned && detailUser.banReason && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <ShieldBan className="h-4 w-4 text-red-400" />
                      <span className="text-red-400 text-sm font-medium">سبب الحظر</span>
                    </div>
                    <p className="text-red-300/80 text-sm">{detailUser.banReason}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {detailUser.isBanned ? (
                    <Button
                      onClick={() => { setDetailOpen(false); handleUnban(detailUser) }}
                      className="flex-1 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30 press-effect text-sm"
                    >
                      <UserCheck className="h-4 w-4 ml-1.5" />
                      فك الحظر
                    </Button>
                  ) : (
                    <Button
                      onClick={() => { setDetailOpen(false); openBanDialog(detailUser) }}
                      className="flex-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30 press-effect text-sm"
                    >
                      <ShieldBan className="h-4 w-4 ml-1.5" />
                      حظر المستخدم
                    </Button>
                  )}
                  {!detailUser.isVerified && !detailUser.isBanned && (
                    <Button
                      onClick={() => { setDetailOpen(false); handleVerify(detailUser) }}
                      className="flex-1 bg-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37]/30 border border-[#D4AF37]/30 press-effect text-sm"
                    >
                      <ShieldCheck className="h-4 w-4 ml-1.5" />
                      توثيق الحساب
                    </Button>
                  )}
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>

      {/* ─── Ban Dialog ─── */}
      <Dialog open={banDialogOpen} onOpenChange={setBanDialogOpen}>
        <DialogContent className="admin-glass border-white/10 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-400 flex items-center gap-2">
              <ShieldBan className="h-5 w-5" />
              حظر المستخدم
            </DialogTitle>
            <DialogDescription className="text-white/50">
              أنت على وشك حظر <span className="text-white font-medium">{targetUser?.displayName}</span>. هذا الإجراء يمكن عكسه لاحقاً.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <div className="admin-card p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500/15 flex items-center justify-center text-red-400 font-bold">
                {targetUser?.displayName.charAt(0)}
              </div>
              <div>
                <p className="text-white text-sm font-medium">{targetUser?.displayName}</p>
                <p className="text-white/40 text-xs">{targetUser?.email}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white/70 text-sm">سبب الحظر <span className="text-red-400">*</span></Label>
              <Textarea
                placeholder="اكتب سبب الحظر..."
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/25 text-sm min-h-[100px] resize-none"
              />
              <p className="text-[10px] text-white/30">سيتم إشعار المستخدم بسبب الحظر عبر البريد الإلكتروني</p>
            </div>
          </div>

          <DialogFooter className="gap-2 mt-2">
            <Button
              variant="outline"
              onClick={() => setBanDialogOpen(false)}
              className="border-white/10 text-white/60 hover:text-white hover:bg-white/5"
            >
              إلغاء
            </Button>
            <Button
              onClick={handleBan}
              disabled={!banReason.trim()}
              className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30 press-effect"
            >
              <ShieldBan className="h-4 w-4 ml-1.5" />
              تأكيد الحظر
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

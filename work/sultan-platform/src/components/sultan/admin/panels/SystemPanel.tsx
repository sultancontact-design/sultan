'use client'
import { useState, useEffect, useMemo } from 'react'
import { adminSystemHealth, adminAuditLog, adminStats, adminChartData } from '@/lib/seed-data'
import { useSultanStore } from '@/lib/store'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { motion } from 'framer-motion'
import {
  Server, Activity, Database, HardDrive, Cpu, Wifi, WifiOff,
  CheckCircle2, AlertTriangle, XCircle, Clock, Shield, Zap,
  RefreshCw, Download, Trash2, Monitor, Globe, Mail,
  ArrowUpRight, ArrowDownRight, TrendingUp, BarChart3, MemoryStick,
} from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const fmt = (n: number) => n.toLocaleString('ar-EG')
const timeAgo = (d: string) => {
  const diff = Date.now() - new Date(d).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'الآن'
  if (mins < 60) return `منذ ${mins} دقيقة`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `منذ ${hrs} ساعة`
  return `منذ ${Math.floor(hrs / 24)} يوم`
}

export default function SystemPanel({ onNavigate }: { onNavigate?: (panel: string) => void }) {
  const { addToast } = useSultanStore()
  const [currentTime, setCurrentTime] = useState('')
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit' })), 1000)
    return () => clearInterval(t)
  }, [])

  const health = adminSystemHealth
  const statusColors = { operational: 'text-emerald-400', degraded: 'text-orange-400', down: 'text-red-400' }
  const statusBg = { operational: 'bg-emerald-500/10', degraded: 'bg-orange-400/10', down: 'bg-red-500/10' }
  const statusDot = { operational: 'bg-emerald-400', degraded: 'bg-orange-400 animate-pulse', down: 'bg-red-400 animate-pulse' }
  const statusLabels = { operational: 'يعمل', degraded: 'بطيء', down: 'متوقف' }

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => { setRefreshing(false); addToast('تم تحديث بيانات النظام', 'success') }, 800)
  }

  const perfData = useMemo(() => Array.from({ length: 24 }, (_, i) => ({
    time: `${String(i).padStart(2, '0')}:00`,
    response: Math.floor(60 + Math.random() * 80 + (i > 8 && i < 22 ? 30 : 0)),
    errors: Math.floor(Math.random() * 5),
  })), [])

  const storagePercent = parseFloat((parseFloat(health.storageUsed) / parseFloat(health.storageTotal) * 100).toFixed(1))

  return (
    <div className="p-4 md:p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold">صحة النظام</h2>
          <p className="text-xs text-muted-foreground">مراقبة الأداء والبنية التحتية في الوقت الفعلي</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="admin-card px-3 py-1.5 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-emerald-400">متصل</span>
            <span className="text-[10px] text-muted-foreground font-mono">{currentTime}</span>
          </div>
          <Button size="sm" variant="outline" className="text-xs" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`h-3.5 w-3.5 ms-1.5 ${refreshing ? 'animate-spin' : ''}`} />تحديث
          </Button>
        </div>
      </div>

      {/* Overall Status Banner */}
      <div className={`admin-card-gold p-4 flex items-center gap-4 ${health.uptime > 99.5 ? 'border-emerald-500/20' : health.uptime > 99 ? 'border-orange-400/20' : 'border-red-500/20'}`}>
        <div className={`w-14 h-14 rounded-2xl ${health.uptime > 99.5 ? 'bg-emerald-500/10' : 'bg-orange-400/10'} flex items-center justify-center shrink-0`}>
          {health.uptime > 99.5 ? <CheckCircle2 className="h-7 w-7 text-emerald-400" /> : <AlertTriangle className="h-7 w-7 text-orange-400" />}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-base">{health.uptime > 99.5 ? 'جميع الأنظمة تعمل بشكل طبيعي' : 'تنبيه: بعض الخدمات بطيئة'}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">وقت التشغيل {health.uptime}% · زمن الاستجابة {health.responseTime}ms · معدل الأخطاء {health.errorRate}%</p>
        </div>
        <Badge className={`${health.uptime > 99.5 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-orange-400/10 text-orange-400 border-orange-400/20'} text-xs px-3 py-1`}>
          {health.uptime > 99.5 ? 'ممتاز' : 'تحذير'}
        </Badge>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'وقت التشغيل', value: `${health.uptime}%`, sub: 'آخر 30 يوم', icon: Shield, color: health.uptime > 99.5 ? 'text-emerald-400' : 'text-orange-400', bg: health.uptime > 99.5 ? 'bg-emerald-500/10' : 'bg-orange-400/10' },
          { label: 'زمن الاستجابة', value: `${health.responseTime}ms`, sub: health.responseTime < 100 ? 'ممتاز' : health.responseTime < 200 ? 'مقبول' : 'بطيء', icon: Zap, color: health.responseTime < 100 ? 'text-emerald-400' : health.responseTime < 200 ? 'text-orange-400' : 'text-red-400', bg: health.responseTime < 100 ? 'bg-emerald-500/10' : health.responseTime < 200 ? 'bg-orange-400/10' : 'bg-red-500/10' },
          { label: 'الجلسات النشطة', value: fmt(health.activeSessions), sub: `${fmt(health.pageViews)} مشاهدة صفحة`, icon: Users, color: 'text-sultan', bg: 'bg-sultan/10' },
          { label: 'معدل الأخطاء', value: `${health.errorRate}%`, sub: health.errorRate < 1 ? 'طبيعي' : 'مرتفع', icon: AlertTriangle, color: health.errorRate < 1 ? 'text-emerald-400' : 'text-red-400', bg: health.errorRate < 1 ? 'bg-emerald-500/10' : 'bg-red-500/10' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="admin-card p-4">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center`}><s.icon className={`h-4 w-4 ${s.color}`} /></div>
              {s.sub && <span className={`text-[9px] px-1.5 py-0.5 rounded-md ${s.color} ${s.bg}`}>{s.sub}</span>}
            </div>
            <p className="text-xl font-bold">{s.value}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Services Status + Performance Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Services */}
        <div className="admin-card p-4">
          <h3 className="font-semibold text-sm mb-4 flex items-center gap-2"><Server className="h-4 w-4 text-sultan" />حالة الخدمات</h3>
          <div className="space-y-2.5">
            {health.services.map((svc, i) => (
              <motion.div key={svc.name} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.03] hover:border-white/[0.08] transition-colors group">
                <div className={`w-2 h-2 rounded-full shrink-0 ${statusDot[svc.status]}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium">{svc.name}</p>
                  <p className="text-[10px] text-muted-foreground">زمن الاستجابة: {svc.latency}ms</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-500 ${svc.latency < 100 ? 'bg-emerald-400' : svc.latency < 300 ? 'bg-orange-400' : 'bg-red-400'}`} style={{ width: `${Math.min(100, (svc.latency / 500) * 100)}%` }} />
                  </div>
                  <Badge className={`${statusBg[svc.status]} ${statusColors[svc.status]} border-0 text-[9px] h-5 px-2`}>{statusLabels[svc.status]}</Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Performance Chart */}
        <div className="admin-card p-4">
          <h3 className="font-semibold text-sm mb-4 flex items-center gap-2"><Activity className="h-4 w-4 text-emerald-400" />أداء الخادم (24 ساعة)</h3>
          <div className="h-[260px]"><ResponsiveContainer width="100%" height="100%">
            <AreaChart data={perfData}>
              <defs><linearGradient id="gResp" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#34d399" stopOpacity={0.2} /><stop offset="95%" stopColor="#34d399" stopOpacity={0} /></linearGradient></defs>
              <XAxis dataKey="time" tick={{ fontSize: 9 }} stroke="hsl(var(--muted-foreground))" axisLine={false} tickLine={false} interval={3} />
              <YAxis tick={{ fontSize: 9 }} stroke="hsl(var(--muted-foreground))" axisLine={false} tickLine={false} width={35} />
              <Tooltip contentStyle={{ background: 'rgba(10,22,40,0.95)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '10px', fontSize: '11px', direction: 'rtl' }} />
              <Area type="monotone" dataKey="response" stroke="#34d399" fill="url(#gResp)" strokeWidth={2} name="زمن الاستجابة (ms)" />
            </AreaChart>
          </ResponsiveContainer></div>
        </div>
      </div>

      {/* Storage + Resources */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Storage */}
        <div className="admin-card p-4">
          <h3 className="font-semibold text-sm mb-4 flex items-center gap-2"><HardDrive className="h-4 w-4 text-sultan" />التخزين</h3>
          <div className="flex items-center justify-center mb-4">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="10" />
                <motion.circle cx="60" cy="60" r="52" fill="none" stroke="#D4AF37" strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 52}`} strokeDashoffset={`${2 * Math.PI * 52 * (1 - storagePercent / 100)}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 52 }} animate={{ strokeDashoffset: 2 * Math.PI * 52 * (1 - storagePercent / 100) }} transition={{ duration: 1.5, ease: 'easeOut' }} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold">{storagePercent}%</span>
                <span className="text-[10px] text-muted-foreground">مستخدم</span>
              </div>
            </div>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between"><span className="text-muted-foreground">المستخدم</span><span className="font-medium">{health.storageUsed}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">الإجمالي</span><span className="font-medium">{health.storageTotal}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">المتاح</span><span className="font-medium text-emerald-400">{health.storageTotal}</span></div>
          </div>
        </div>

        {/* Database */}
        <div className="admin-card p-4">
          <h3 className="font-semibold text-sm mb-4 flex items-center gap-2"><Database className="h-4 w-4 text-emerald-400" />قاعدة البيانات</h3>
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
              <div className="flex items-center justify-between mb-1"><span className="text-[11px] text-muted-foreground">حجم قاعدة البيانات</span><span className="text-sm font-bold">{health.dbSize}</span></div>
              <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden"><div className="h-full rounded-full bg-emerald-400" style={{ width: '25%' }} /></div>
            </div>
            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
              <div className="flex items-center justify-between mb-1"><span className="text-[11px] text-muted-foreground">معدل ضربات الكاش</span><span className="text-sm font-bold text-sultan">{health.cacheHitRate}%</span></div>
              <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden"><div className="h-full rounded-full bg-sultan" style={{ width: `${health.cacheHitRate}%` }} /></div>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2 rounded bg-white/[0.01]"><span className="text-muted-foreground">آخر نسخة احتياطية</span><span>{timeAgo(health.lastBackup)}</span></div>
              <div className="flex justify-between p-2 rounded bg-white/[0.01]"><span className="text-muted-foreground">آخر مهمة مجدولة</span><span>{timeAgo(health.lastCron)}</span></div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="admin-card p-4">
          <h3 className="font-semibold text-sm mb-4 flex items-center gap-2"><Cpu className="h-4 w-4 text-orange-400" />إجراءات سريعة</h3>
          <div className="space-y-2">
            {[
              { label: 'مسح ذاكرة التخزين المؤقت', icon: Trash2, color: 'text-orange-400', bg: 'bg-orange-400/10', action: 'تم مسح الكاش' },
              { label: 'إنشاء نسخة احتياطية', icon: Download, color: 'text-emerald-400', bg: 'bg-emerald-500/10', action: 'تم إنشاء النسخة الاحتياطية' },
              { label: 'إعادة تشغيل الخدمات', icon: RefreshCw, color: 'text-sultan', bg: 'bg-sultan/10', action: 'تم إعادة تشغيل الخدمات' },
              { label: 'تحديث الفهارس', icon: BarChart3, color: 'text-emerald-400', bg: 'bg-emerald-500/10', action: 'تم تحديث الفهارس' },
              { label: 'فحص سلامة قاعدة البيانات', icon: Shield, color: 'text-sultan', bg: 'bg-sultan/10', action: 'قاعدة البيانات سليمة' },
            ].map(btn => (
              <button key={btn.label} onClick={() => addToast(btn.action, 'success')}
                className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.03] hover:border-white/[0.08] hover:bg-white/[0.04] transition-all text-start group press-effect">
                <div className={`w-8 h-8 rounded-lg ${btn.bg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}><btn.icon className={`h-4 w-4 ${btn.color}`} /></div>
                <span className="text-xs font-medium">{btn.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recent System Events */}
      <div className="admin-card p-4">
        <h3 className="font-semibold text-sm mb-4 flex items-center gap-2"><Clock className="h-4 w-4 text-sultan" />أحداث النظام الأخيرة</h3>
        <div className="space-y-2">
          {adminAuditLog.slice(0, 6).map((log, i) => {
            const sevIcon = log.severity === 'high' ? AlertTriangle : log.severity === 'medium' ? Shield : CheckCircle2
            const sevColor = log.severity === 'high' ? 'text-red-400' : log.severity === 'medium' ? 'text-orange-400' : 'text-emerald-400'
            return (
              <motion.div key={log.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/[0.02] transition-colors">
                <sevIcon className={`h-4 w-4 shrink-0 ${sevColor}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{log.action}</p>
                  <p className="text-[10px] text-muted-foreground">بواسطة {log.admin} · {log.ip}</p>
                </div>
                <span className="text-[10px] text-muted-foreground shrink-0">{timeAgo(log.createdAt)}</span>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

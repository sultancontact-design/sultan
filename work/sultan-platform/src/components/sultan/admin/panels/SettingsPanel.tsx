'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Settings,
  Globe,
  Shield,
  Bell,
  Receipt,
  Cpu,
  Save,
  AlertTriangle,
  Database,
  Trash2,
  RotateCcw,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { adminSettings } from '@/lib/seed-data'
import { useSultanStore } from '@/lib/store'

const fmt = (n: number) => n.toLocaleString('ar-EG')

const cities = ['الدار البيضاء', 'الرباط', 'مراكش', 'فاس', 'طنجة', 'أكادير', 'مكناس', 'وجدة', 'تطوان', 'القنيطرة', 'سلا']

interface SettingsPanelProps {
  onNavigate?: (panel: string) => void
}

export default function SettingsPanel({ onNavigate }: SettingsPanelProps) {
  const addToast = useSultanStore((s) => s.addToast)

  /* ─── General ─── */
  const [siteName, setSiteName] = useState(adminSettings.general.siteName)
  const [siteDesc, setSiteDesc] = useState(adminSettings.general.siteDesc)
  const [defaultCity, setDefaultCity] = useState(adminSettings.general.defaultCity)
  const [contactEmail, setContactEmail] = useState(adminSettings.general.contactEmail)
  const [maintenanceMode, setMaintenanceMode] = useState(adminSettings.general.maintenanceMode)
  const [maxListings, setMaxListings] = useState(adminSettings.general.maxListingsPerUser)
  const [maxImages, setMaxImages] = useState(adminSettings.general.maxImagesPerListing)

  /* ─── Security ─── */
  const [maxLoginAttempts, setMaxLoginAttempts] = useState(adminSettings.security.maxLoginAttempts)
  const [sessionTimeout, setSessionTimeout] = useState(adminSettings.security.sessionTimeout)
  const [rateLimiting, setRateLimiting] = useState(adminSettings.security.rateLimiting)
  const [maxRequests, setMaxRequests] = useState(adminSettings.security.maxRequestsPerMinute)
  const [twoFactor, setTwoFactor] = useState(adminSettings.security.twoFactorAuth)

  /* ─── Notifications ─── */
  const [emailEnabled, setEmailEnabled] = useState(adminSettings.notifications.emailEnabled)
  const [pushEnabled, setPushEnabled] = useState(adminSettings.notifications.pushEnabled)
  const [notifyNewUser, setNotifyNewUser] = useState(adminSettings.notifications.notifyNewUser)
  const [notifyNewListing, setNotifyNewListing] = useState(adminSettings.notifications.notifyNewListing)
  const [notifyNewBid, setNotifyNewBid] = useState(adminSettings.notifications.notifyNewBid)
  const [notifyReport, setNotifyReport] = useState(adminSettings.notifications.notifyReport)
  const [notifyAuctionEnding, setNotifyAuctionEnding] = useState(adminSettings.notifications.notifyAuctionEnding)
  const [adminEmail, setAdminEmail] = useState('admin@sultan.ma')

  /* ─── Fees ─── */
  const [listingFee, setListingFee] = useState(adminSettings.fees.listingFee)
  const [featuredFee, setFeaturedFee] = useState(adminSettings.fees.featuredFee)
  const [auctionCommission, setAuctionCommission] = useState(adminSettings.fees.auctionCommission)
  const [withdrawalFee, setWithdrawalFee] = useState(adminSettings.fees.withdrawalFee)

  /* ─── Advanced ─── */
  const [cacheTTL, setCacheTTL] = useState(3600)
  const [debugMode, setDebugMode] = useState(false)
  const [resetDialogOpen, setResetDialogOpen] = useState(false)
  const [resetConfirmText, setResetConfirmText] = useState('')
  const [backingUp, setBackingUp] = useState(false)
  const [clearingCache, setClearingCache] = useState(false)

  const handleSave = (section: string) => {
    addToast(`تم حفظ إعدادات ${section} بنجاح`, 'success')
  }

  const handleClearCache = () => {
    setClearingCache(true)
    setTimeout(() => {
      setClearingCache(false)
      addToast('تم مسح ذاكرة التخزين المؤقت بنجاح', 'success')
    }, 1500)
  }

  const handleBackup = () => {
    setBackingUp(true)
    setTimeout(() => {
      setBackingUp(false)
      addToast('تم إنشاء نسخة احتياطية بنجاح', 'success')
    }, 2000)
  }

  const handleReset = () => {
    setResetDialogOpen(false)
    setResetConfirmText('')
    addToast('تمت إعادة تعيين النظام بنجاح', 'success')
  }

  const ToggleRow = ({ label, checked, onChange, description }: {
    label: string; checked: boolean; onChange: (v: boolean) => void; description?: string
  }) => (
    <motion.div
      className="flex items-center justify-between p-4 admin-card press-effect cursor-pointer"
      whileTap={{ scale: 0.98 }}
      onClick={() => onChange(!checked)}
    >
      <div className="flex-1 ml-3">
        <p className="text-sm font-medium text-white/90">{label}</p>
        {description && <p className="text-xs text-white/40 mt-0.5">{description}</p>}
      </div>
      <Switch checked={checked} onCheckedChange={onChange} dir="ltr" />
    </motion.div>
  )

  const InputRow = ({ label, value, onChange, type = 'text', suffix, description }: {
    label: string; value: string | number; onChange: (v: any) => void; type?: string; suffix?: string; description?: string
  }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm text-white/70">{label}</Label>
        {suffix && <span className="text-xs text-[#D4AF37] font-medium">{suffix}</span>}
      </div>
      {description && <p className="text-xs text-white/30 -mt-1">{description}</p>}
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
        className="bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-[#D4AF37]/50"
        dir={type === 'email' ? 'ltr' : 'rtl'}
      />
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl sultan-gradient flex items-center justify-center">
          <Settings className="w-5 h-5 text-[#0A1628]" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gradient-sultan">إعدادات النظام</h2>
          <p className="text-xs text-white/40">إدارة وتكوين إعدادات منصة سلطان</p>
        </div>
      </motion.div>

      <Tabs defaultValue="general" dir="rtl" className="w-full">
        <TabsList className="bg-white/5 border border-white/10 h-auto p-1 w-full grid grid-cols-5 gap-1">
          {[
            { value: 'general', label: 'عام', icon: Globe },
            { value: 'security', label: 'أمان', icon: Shield },
            { value: 'notifications', label: 'إشعارات', icon: Bell },
            { value: 'fees', label: 'الرسوم', icon: Receipt },
            { value: 'advanced', label: 'متقدم', icon: Cpu },
          ].map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="data-[state=active]:bg-[#D4AF37]/15 data-[state=active]:text-[#F0D060] text-white/50 text-xs py-2.5 rounded-lg transition-all"
            >
              <tab.icon className="w-3.5 h-3.5 ml-1" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* ═══ General ═══ */}
        <TabsContent value="general" className="mt-4 space-y-4">
          <motion.div className="admin-card p-6 space-y-5" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <InputRow label="اسم الموقع" value={siteName} onChange={setSiteName} />
            <div className="space-y-2">
              <Label className="text-sm text-white/70">وصف الموقع</Label>
              <Textarea value={siteDesc} onChange={(e) => setSiteDesc(e.target.value)} rows={3}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-[#D4AF37]/50" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-white/70">المدينة الافتراضية</Label>
              <Select value={defaultCity} onValueChange={setDefaultCity} dir="rtl">
                <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {cities.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <InputRow label="البريد الإلكتروني للتواصل" value={contactEmail} onChange={setContactEmail} type="email" />
            <Separator className="bg-white/5" />
            <AnimatePresence>
              {maintenanceMode && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-[#f97316]/10 border border-[#f97316]/20 mb-3">
                    <AlertTriangle className="w-4 h-4 text-[#f97316] shrink-0" />
                    <p className="text-xs text-[#f97316]">الموقع في وضع الصيانة — لن يتمكن المستخدمون من الوصول</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <ToggleRow label="وضع الصيانة" checked={maintenanceMode} onChange={setMaintenanceMode} />
            <InputRow label="أقصى عدد إعلانات لكل مستخدم" value={maxListings} onChange={setMaxListings} type="number" />
            <InputRow label="أقصى عدد صور لكل إعلان" value={maxImages} onChange={setMaxImages} type="number" />
            <Button onClick={() => handleSave('عام')} className="w-full sultan-gradient text-[#0A1628] font-bold hover:opacity-90 press-effect">
              <Save className="w-4 h-4 ml-2" />حفظ الإعدادات العامة
            </Button>
          </motion.div>
        </TabsContent>

        {/* ═══ Security ═══ */}
        <TabsContent value="security" className="mt-4 space-y-3">
          <motion.div className="admin-card p-6 space-y-4" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-[#34d399]" />
              <h3 className="text-sm font-bold text-white/80">إعدادات الأمان</h3>
            </div>
            <InputRow label="أقصى عدد محاولات تسجيل الدخول" value={maxLoginAttempts} onChange={setMaxLoginAttempts} type="number" description="عدد المحاولات قبل قفل الحساب مؤقتاً" />
            <InputRow label="مدة الجلسة (دقيقة)" value={sessionTimeout} onChange={setSessionTimeout} type="number" description="بعد انتهاء المدة يتم تسجيل الخروج تلقائياً" />
            <Separator className="bg-white/5" />
            <ToggleRow label="تقييد الطلبات" checked={rateLimiting} onChange={setRateLimiting} description="تحديد عدد الطلبات المسموح بها" />
            <AnimatePresence>
              {rateLimiting && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <div className="pr-4"><InputRow label="أقصى عدد طلبات في الدقيقة" value={maxRequests} onChange={setMaxRequests} type="number" /></div>
                </motion.div>
              )}
            </AnimatePresence>
            <Separator className="bg-white/5" />
            <ToggleRow label="المصادقة الثنائية" checked={twoFactor} onChange={setTwoFactor} description="تطلب من المديرين إدخال رمز تحقق إضافي" />
            <Button onClick={() => handleSave('الأمان')} className="w-full sultan-gradient text-[#0A1628] font-bold hover:opacity-90 press-effect">
              <Save className="w-4 h-4 ml-2" />حفظ إعدادات الأمان
            </Button>
          </motion.div>
        </TabsContent>

        {/* ═══ Notifications ═══ */}
        <TabsContent value="notifications" className="mt-4 space-y-3">
          <motion.div className="admin-card p-6 space-y-3" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-2">
              <Bell className="w-4 h-4 text-[#f97316]" />
              <h3 className="text-sm font-bold text-white/80">إعدادات الإشعارات</h3>
            </div>
            <ToggleRow label="إشعارات البريد الإلكتروني" checked={emailEnabled} onChange={setEmailEnabled} />
            <ToggleRow label="الإشعارات الفورية" checked={pushEnabled} onChange={setPushEnabled} />
            <Separator className="bg-white/5" />
            <p className="text-xs text-white/40 font-medium">إشعارات الأحداث</p>
            <ToggleRow label="مستخدم جديد" checked={notifyNewUser} onChange={setNotifyNewUser} />
            <ToggleRow label="إعلان جديد" checked={notifyNewListing} onChange={setNotifyNewListing} />
            <ToggleRow label="مزايدة جديدة" checked={notifyNewBid} onChange={setNotifyNewBid} />
            <ToggleRow label="بلاغ جديد" checked={notifyReport} onChange={setNotifyReport} />
            <ToggleRow label="انتهاء المزاد" checked={notifyAuctionEnding} onChange={setNotifyAuctionEnding} />
            <Separator className="bg-white/5" />
            <InputRow label="بريد المدير للإشعارات" value={adminEmail} onChange={setAdminEmail} type="email" />
            <Button onClick={() => handleSave('الإشعارات')} className="w-full sultan-gradient text-[#0A1628] font-bold hover:opacity-90 press-effect">
              <Save className="w-4 h-4 ml-2" />حفظ إعدادات الإشعارات
            </Button>
          </motion.div>
        </TabsContent>

        {/* ═══ Fees ═══ */}
        <TabsContent value="fees" className="mt-4 space-y-3">
          <motion.div className="admin-card p-6 space-y-6" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-2">
              <Receipt className="w-4 h-4 text-[#F0D060]" />
              <h3 className="text-sm font-bold text-white/80">هيكل الرسوم</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm text-white/70">عمولة الإعلان</Label>
                <Badge className="bg-[#D4AF37]/15 text-[#F0D060] border-[#D4AF37]/20 text-xs font-mono">{fmt(listingFee)}%</Badge>
              </div>
              <Slider value={[listingFee]} onValueChange={([v]) => setListingFee(v)} max={10} min={0} step={0.5} dir="ltr"
                className="[&_[role=slider]]:bg-[#D4AF37] [&_[role=slider]]:border-[#D4AF37] [&>span:first-child]:bg-white/10" />
              <div className="flex justify-between text-[10px] text-white/25"><span>0%</span><span>10%</span></div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm text-white/70">رسوم التمييز</Label>
                <Badge className="bg-[#34d399]/15 text-[#34d399] border-[#34d399]/20 text-xs font-mono">{fmt(featuredFee)} درهم</Badge>
              </div>
              <Input type="number" value={featuredFee} onChange={(e) => setFeaturedFee(Number(e.target.value))}
                className="bg-white/5 border-white/10 text-white focus:border-[#D4AF37]/50" dir="ltr" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm text-white/70">عمولة المزاد</Label>
                <Badge className="bg-[#f97316]/15 text-[#f97316] border-[#f97316]/20 text-xs font-mono">{fmt(auctionCommission)}%</Badge>
              </div>
              <Slider value={[auctionCommission]} onValueChange={([v]) => setAuctionCommission(v)} max={15} min={0} step={0.5} dir="ltr"
                className="[&_[role=slider]]:bg-[#f97316] [&_[role=slider]]:border-[#f97316] [&>span:first-child]:bg-white/10" />
              <div className="flex justify-between text-[10px] text-white/25"><span>0%</span><span>15%</span></div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm text-white/70">رسوم السحب</Label>
                <Badge className="bg-[#f87171]/15 text-[#f87171] border-[#f87171]/20 text-xs font-mono">{fmt(withdrawalFee)}%</Badge>
              </div>
              <Slider value={[withdrawalFee]} onValueChange={([v]) => setWithdrawalFee(v)} max={5} min={0} step={0.25} dir="ltr"
                className="[&_[role=slider]]:bg-[#f87171] [&_[role=slider]]:border-[#f87171] [&>span:first-child]:bg-white/10" />
              <div className="flex justify-between text-[10px] text-white/25"><span>0%</span><span>5%</span></div>
            </div>
            <Button onClick={() => handleSave('الرسوم')} className="w-full sultan-gradient text-[#0A1628] font-bold hover:opacity-90 press-effect">
              <Save className="w-4 h-4 ml-2" />حفظ هيكل الرسوم
            </Button>
          </motion.div>
        </TabsContent>

        {/* ═══ Advanced ═══ */}
        <TabsContent value="advanced" className="mt-4 space-y-4">
          <motion.div className="admin-card p-6 space-y-4" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-2">
              <Cpu className="w-4 h-4 text-[#D4AF37]" />
              <h3 className="text-sm font-bold text-white/80">إعدادات متقدمة</h3>
            </div>
            <InputRow label="مدة التخزين المؤقت TTL (ثانية)" value={cacheTTL} onChange={setCacheTTL} type="number" />
            <ToggleRow label="وضع التصحيح" checked={debugMode} onChange={setDebugMode} description="تفعيل سجلات التصحيح والأداء التفصيلية" />
            <Separator className="bg-white/5" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button variant="outline" onClick={handleClearCache} disabled={clearingCache}
                className="border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10 press-effect">
                <Zap className="w-4 h-4 ml-2" />{clearingCache ? 'جارٍ المسح...' : 'مسح ذاكرة التخزين المؤقت'}
              </Button>
              <Button variant="outline" onClick={handleBackup} disabled={backingUp}
                className="border-[#34d399]/30 text-[#34d399] hover:bg-[#34d399]/10 press-effect">
                <Database className="w-4 h-4 ml-2" />{backingUp ? 'جارٍ النسخ...' : 'نسخ احتياطي لقاعدة البيانات'}
              </Button>
            </div>
          </motion.div>

          {/* Danger Zone */}
          <motion.div className="admin-card p-6 !border border-[#f87171]/20"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-[#f87171]" />
              <h3 className="text-sm font-bold text-[#f87171]">منطقة الخطر</h3>
            </div>
            <p className="text-xs text-white/40 mb-4">هذه الإجراءات لا يمكن التراجع عنها. تأكد قبل المتابعة.</p>
            <Button variant="outline" onClick={() => setResetDialogOpen(true)}
              className="w-full border-[#f87171]/30 text-[#f87171] hover:bg-[#f87171]/10 press-effect">
              <RotateCcw className="w-4 h-4 ml-2" />إعادة تعيين النظام بالكامل
            </Button>
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Reset Dialog */}
      <Dialog open={resetDialogOpen} onOpenChange={(o) => { setResetDialogOpen(o); setResetConfirmText('') }} dir="rtl">
        <DialogContent className="bg-[#0A1628] border border-[#f87171]/20 admin-glass">
          <DialogHeader>
            <DialogTitle className="text-[#f87171] flex items-center gap-2">
              <Trash2 className="w-5 h-5" />تأكيد إعادة التعيين
            </DialogTitle>
            <DialogDescription className="text-white/50">
              سيتم حذف جميع البيانات وإعادة تعيين النظام إلى الحالة الافتراضية.
            </DialogDescription>
          </DialogHeader>
          <div className="p-3 rounded-lg bg-[#f87171]/10 border border-[#f87171]/15 mt-3">
            <p className="text-xs text-[#f87171] mb-2">اكتب &quot;تأكيد&quot; للمتابعة</p>
            <Input value={resetConfirmText} onChange={(e) => setResetConfirmText(e.target.value)} placeholder="تأكيد"
              className="bg-white/5 border-white/10 text-white" />
          </div>
          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <Button variant="outline" onClick={() => setResetDialogOpen(false)}
              className="border-white/10 text-white/70 hover:bg-white/5">
              إلغاء
            </Button>
            <Button onClick={handleReset} disabled={resetConfirmText !== 'تأكيد'}
              className="bg-[#f87171] hover:bg-[#f87171]/80 text-white press-effect">
              <Trash2 className="w-4 h-4 ml-2" />إعادة تعيين
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

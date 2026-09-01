'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Flag, Search, Plus, ToggleLeft, ToggleRight, X, ChevronDown } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs'
import { featureFlags as seedFlags } from '@/lib/seed-data'
import { useSultanStore } from '@/lib/store'

const fmt = (n: number) => n.toLocaleString('ar-EG')

interface Flag {
  key: string
  value: boolean
  label: string
  category: string
}

interface FeatureFlagsPanelProps {
  onNavigate?: (panel: string) => void
}

const categoryColors: Record<string, string> = {
  'اقتصاد': '#D4AF37',
  'مالية': '#34d399',
  'اجتماعي': '#f97316',
  'ترفيه': '#f87171',
  'تكنولوجيا': '#F0D060',
  'فرص': '#34d399',
  'تسويق': '#f97316',
  'محتوى': '#f87171',
  'توسع': '#D4AF37',
}

export default function FeatureFlagsPanel({ onNavigate }: FeatureFlagsPanelProps) {
  const addToast = useSultanStore((s) => s.addToast)
  const [flags, setFlags] = useState<Flag[]>([...seedFlags])
  const [search, setSearch] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [newKey, setNewKey] = useState('')
  const [newLabel, setNewLabel] = useState('')
  const [newCategory, setNewCategory] = useState('')

  const categories = useMemo(() => {
    const cats = Array.from(new Set(flags.map((f) => f.category)))
    return cats
  }, [flags])

  const stats = useMemo(() => ({
    total: flags.length,
    enabled: flags.filter((f) => f.value).length,
    disabled: flags.filter((f) => !f.value).length,
    categories: categories.length,
  }), [flags, categories])

  const filteredFlags = useMemo(() => {
    let result = flags
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (f) => f.key.toLowerCase().includes(q) || f.label.includes(q) || f.category.includes(q)
      )
    }
    return result
  }, [flags, search])

  const toggleFlag = (key: string) => {
    setFlags((prev) => prev.map((f) => (f.key === key ? { ...f, value: !f.value } : f)))
    const flag = flags.find((f) => f.key === key)
    addToast(
      `${flag?.label}: ${flag?.value ? 'معطل ❌' : 'مفعّل ✅'}`,
      'success'
    )
  }

  const handleCreate = () => {
    if (!newKey.trim() || !newLabel.trim() || !newCategory) {
      addToast('يرجى ملء جميع الحقول', 'error')
      return
    }
    if (flags.some((f) => f.key === newKey.trim())) {
      addToast('هذا المفتاح موجود مسبقاً', 'error')
      return
    }
    setFlags((prev) => [
      { key: newKey.trim().replace(/\s+/g, '_'), value: false, label: newLabel.trim(), category: newCategory },
      ...prev,
    ])
    setNewKey('')
    setNewLabel('')
    setNewCategory('')
    setShowCreate(false)
    addToast('تم إنشاء الميزة الجديدة بنجاح', 'success')
  }

  const StatCard = ({ label, value, color, icon }: { label: string; value: number; color: string; icon: React.ReactNode }) => (
    <motion.div className="admin-card-gold p-4 flex items-center gap-3" whileHover={{ scale: 1.01 }}>
      <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${color}15` }}>
        {icon}
      </div>
      <div>
        <p className="text-lg font-bold" style={{ color }}>{fmt(value)}</p>
        <p className="text-[10px] text-white/40">{label}</p>
      </div>
    </motion.div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl sultan-gradient flex items-center justify-center">
          <Flag className="w-5 h-5 text-[#0A1628]" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gradient-sultan">إدارة الميزات</h2>
          <p className="text-xs text-white/40">تفعيل وتعطيل ميزات المنصة</p>
        </div>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="إجمالي الميزات" value={stats.total} color="#D4AF37" icon={<Flag className="w-4 h-4 text-[#D4AF37]" />} />
        <StatCard label="مفعّلة" value={stats.enabled} color="#34d399" icon={<ToggleRight className="w-4 h-4 text-[#34d399]" />} />
        <StatCard label="معطّلة" value={stats.disabled} color="#f87171" icon={<ToggleLeft className="w-4 h-4 text-[#f87171]" />} />
        <StatCard label="التصنيفات" value={stats.categories} color="#f97316" icon={<ChevronDown className="w-4 h-4 text-[#f97316]" />} />
      </div>

      {/* Search + Create */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <Input
            placeholder="بحث في الميزات..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white/5 border-white/10 text-white placeholder:text-white/25 pr-9 focus:border-[#D4AF37]/50"
          />
        </div>
        <Button
          onClick={() => setShowCreate(!showCreate)}
          className={`press-effect ${showCreate ? 'bg-[#f87171] hover:bg-[#f87171]/80' : 'sultan-gradient hover:opacity-90 text-[#0A1628]'}`}
        >
          {showCreate ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4 ml-1" />}
          <span className="mr-1">{showCreate ? 'إلغاء' : 'ميزة جديدة'}</span>
        </Button>
      </div>

      {/* Create Form */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -8 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -8 }}
            className="overflow-hidden"
          >
            <div className="admin-card-gold p-5 space-y-4">
              <h3 className="text-sm font-bold text-[#F0D060]">إنشاء ميزة جديدة</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs text-white/50">المفتاح (key)</Label>
                  <Input value={newKey} onChange={(e) => setNewKey(e.target.value)} placeholder="my_feature"
                    className="bg-white/5 border-white/10 text-white font-mono text-sm placeholder:text-white/20" dir="ltr" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-white/50">الاسم</Label>
                  <Input value={newLabel} onChange={(e) => setNewLabel(e.target.value)} placeholder="اسم الميزة"
                    className="bg-white/5 border-white/10 text-white text-sm placeholder:text-white/20" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-white/50">التصنيف</Label>
                  <Select value={newCategory} onValueChange={setNewCategory} dir="rtl">
                    <SelectTrigger className="bg-white/5 border-white/10 text-white text-sm"><SelectValue placeholder="اختر" /></SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleCreate} className="sultan-gradient text-[#0A1628] font-bold hover:opacity-90 press-effect">
                <Plus className="w-4 h-4 ml-2" />إنشاء الميزة
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category Tabs + Grid */}
      <Tabs defaultValue="الكل" dir="rtl" className="w-full">
        <TabsList className="bg-white/5 border border-white/10 h-auto p-1 flex-wrap gap-1">
          <TabsTrigger value="الكل"
            className="data-[state=active]:bg-[#D4AF37]/15 data-[state=active]:text-[#F0D060] text-white/50 text-xs py-2 px-3 rounded-lg">
            الكل ({flags.length})
          </TabsTrigger>
          {categories.map((cat) => (
            <TabsTrigger key={cat} value={cat}
              className="data-[state=active]:bg-[#D4AF37]/15 data-[state=active]:text-[#F0D060] text-white/50 text-xs py-2 px-3 rounded-lg">
              {cat}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* All */}
        <TabsContent value="الكل" className="mt-4">
          <FlagsGrid flags={filteredFlags} onToggle={toggleFlag} categoryColors={categoryColors} />
        </TabsContent>

        {/* Per category */}
        {categories.map((cat) => (
          <TabsContent key={cat} value={cat} className="mt-4">
            <FlagsGrid
              flags={filteredFlags.filter((f) => f.category === cat)}
              onToggle={toggleFlag}
              categoryColors={categoryColors}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

/* ─── Flags Grid Sub-component ─── */
function FlagsGrid({
  flags,
  onToggle,
  categoryColors,
}: {
  flags: Flag[]
  onToggle: (key: string) => void
  categoryColors: Record<string, string>
}) {
  if (flags.length === 0) {
    return (
      <div className="admin-card p-10 text-center">
        <Flag className="w-10 h-10 text-white/15 mx-auto mb-3" />
        <p className="text-sm text-white/30">لا توجد ميزات مطابقة</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 stagger-children">
      {flags.map((flag, i) => {
        const color = categoryColors[flag.category] || '#D4AF37'
        return (
          <motion.div
            key={flag.key}
            className={`admin-card p-4 relative overflow-hidden ${flag.value ? '' : 'opacity-70'}`}
            whileHover={{ scale: 1.01 }}
            transition={{ delay: i * 0.02 }}
          >
            {/* Active indicator bar */}
            <motion.div
              className="absolute top-0 right-0 w-1 h-full"
              style={{ background: flag.value ? color : 'rgba(255,255,255,0.1)' }}
              animate={{ opacity: flag.value ? 1 : 0.3 }}
            />

            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0 mr-3">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-mono text-white/30 bg-white/5 px-1.5 py-0.5 rounded" dir="ltr">{flag.key}</span>
                  <Badge
                    className="text-[9px] px-1.5 py-0 border-0"
                    style={{ background: `${color}18`, color }}
                  >
                    {flag.category}
                  </Badge>
                </div>
                <p className="text-sm font-medium text-white/90 mb-1">{flag.label}</p>
                <p className="text-[11px] text-white/30">{flag.value ? 'هذه الميزة مفعّلة ومتاحة للمستخدمين' : 'هذه الميزة معطّلة حالياً'}</p>
              </div>
              <motion.div whileTap={{ scale: 0.9 }}>
                <Switch checked={flag.value} onCheckedChange={() => onToggle(flag.key)} dir="ltr" />
              </motion.div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

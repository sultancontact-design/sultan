'use client'
import { useState, useMemo } from 'react'
import { categories, listings } from '@/lib/seed-data'
import { useSultanStore } from '@/lib/store'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FolderTree, Search, Plus, Pencil, Trash2, Eye, EyeOff,
  Package, ChevronDown, ChevronUp, GripVertical, X, Check, Save,
  BarChart3, TrendingUp, ArrowUpDown, Store,
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

const fmt = (n: number) => n.toLocaleString('ar-EG')
const COLORS = ['#D4AF37','#34d399','#f97316','#f87171','#a78bfa','#f472b6','#facc15','#22d3ee','#a3e635','#fb923c','#e879f9','#2dd4bf','#fca5a5','#86efac','#fde047','#67e8f9']

export default function CategoriesPanel({ onNavigate }: { onNavigate?: (panel: string) => void }) {
  const { addToast } = useSultanStore()
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState<'grid'|'table'>('grid')
  const [editId, setEditId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editSlug, setEditSlug] = useState('')
  const [editOrder, setEditOrder] = useState(0)
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')
  const [newSlug, setNewSlug] = useState('')
  const [newIcon, setNewIcon] = useState('Store')
  const [sortField, setSortField] = useState<'name'|'count'|'order'>('order')
  const [sortDir, setSortDir] = useState<'asc'|'desc'>('asc')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const categoryStats = useMemo(() => {
    return categories.map(cat => {
      const count = listings.filter(l => l.categoryId === cat.id).length
      const activeCount = listings.filter(l => l.categoryId === cat.id && l.status === 'active').length
      const featuredCount = listings.filter(l => l.categoryId === cat.id && l.isFeatured).length
      const totalViews = listings.filter(l => l.categoryId === cat.id).reduce((s, l) => s + (l.viewsCount || 0), 0)
      const avgPrice = listings.filter(l => l.categoryId === cat.id && l.price).reduce((s, l, _, arr) => {
        const filtered = listings.filter(x => x.categoryId === cat.id && x.price)
        return filtered.reduce((sum, x) => sum + (x.price || 0), 0) / (filtered.length || 1)
      }, 0)
      return { ...cat, count, activeCount, featuredCount, totalViews, avgPrice: Math.round(avgPrice) }
    })
  }, [])

  const filtered = useMemo(() => {
    let data = categoryStats.filter(c =>
      c.nameAr.includes(search) || c.nameEn.toLowerCase().includes(search.toLowerCase()) || c.slug.includes(search)
    )
    data.sort((a, b) => {
      let cmp = 0
      if (sortField === 'name') cmp = a.nameAr.localeCompare(b.nameAr, 'ar')
      else if (sortField === 'count') cmp = a.count - b.count
      else cmp = a.order - b.order
      return sortDir === 'asc' ? cmp : -cmp
    })
    return data
  }, [categoryStats, search, sortField, sortDir])

  const totalListings = categoryStats.reduce((s, c) => s + c.count, 0)
  const totalActive = categoryStats.reduce((s, c) => s + c.activeCount, 0)
  const totalFeatured = categoryStats.reduce((s, c) => s + c.featuredCount, 0)
  const chartData = filtered.filter(c => c.count > 0).sort((a, b) => b.count - a.count)
  const pieData = filtered.filter(c => c.count > 0).map((c, i) => ({ name: c.nameAr, value: c.count, color: COLORS[i % COLORS.length] }))

  const startEdit = (cat: typeof categories[0]) => {
    setEditId(cat.id); setEditName(cat.nameAr); setEditSlug(cat.slug); setEditOrder(cat.order)
  }
  const saveEdit = () => {
    if (editId) { addToast(`تم تحديث فئة: ${editName}`, 'success'); setEditId(null) }
  }
  const handleDelete = (id: string) => {
    addToast('تم حذف الفئة (تجريبي)', 'success'); setDeleteConfirm(null)
  }
  const handleCreate = () => {
    if (!newName.trim()) return
    addToast(`تم إنشاء فئة: ${newName}`, 'success')
    setNewName(''); setNewSlug(''); setNewIcon('Store'); setShowCreate(false)
  }
  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('desc') }
  }

  return (
    <div className="p-4 md:p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold">إدارة الفئات</h2>
          <p className="text-xs text-muted-foreground">{categories.length} فئة تخدم {fmt(totalListings)} إعلان</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="text-xs" onClick={() => setViewMode(v => v === 'grid' ? 'table' : 'grid')}>
            <ArrowUpDown className="h-3.5 w-3.5 ms-1.5" />{viewMode === 'grid' ? 'جدول' : 'بطاقات'}
          </Button>
          <Button size="sm" className="text-xs sultan-gradient text-royal border-0 font-semibold press-effect" onClick={() => setShowCreate(true)}>
            <Plus className="h-3.5 w-3.5 ms-1.5" />فئة جديدة
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'إجمالي الفئات', value: categories.length, icon: FolderTree, color: 'text-sultan', bg: 'bg-sultan/10' },
          { label: 'إعلانات نشطة', value: totalActive, icon: Package, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'إعلانات مميزة', value: totalFeatured, icon: TrendingUp, color: 'text-orange-400', bg: 'bg-orange-400/10' },
          { label: 'متوسط الإعلانات/فئة', value: Math.round(totalListings / categories.length), icon: BarChart3, color: 'text-sultan', bg: 'bg-sultan/10' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="admin-card p-4">
            <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center mb-2`}><s.icon className={`h-4 w-4 ${s.color}`} /></div>
            <p className="text-xl font-bold">{fmt(s.value)}</p>
            <p className="text-[11px] text-muted-foreground">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Search + Sort */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input placeholder="ابحث في الفئات..." value={search} onChange={e => setSearch(e.target.value)} className="pr-9 h-9 text-xs" />
        </div>
        {(['order' as const, 'name' as const, 'count' as const]).map(f => (
          <button key={f} onClick={() => toggleSort(f)} className={`admin-card px-3 py-1.5 text-[11px] flex items-center gap-1.5 press-effect ${sortField === f ? 'admin-card-gold text-foreground' : 'text-muted-foreground'}`}>
            <ChevronUp className={`h-3 w-3 ${sortField === f && sortDir === 'asc' ? 'text-sultan' : 'opacity-30'}`} />
            <ChevronDown className={`h-3 w-3 ${sortField === f && sortDir === 'desc' ? 'text-sultan' : 'opacity-30'}`} />
            {{ order: 'الترتيب', name: 'الاسم', count: 'العدد' }[f]}
          </button>
        ))}
      </div>

      {/* Chart + Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="admin-card p-4 lg:col-span-2">
          <h3 className="font-semibold text-sm mb-3 flex items-center gap-2"><BarChart3 className="h-4 w-4 text-sultan" />توزيع الإعلانات حسب الفئة</h3>
          <div className="h-[260px]"><ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ right: 20 }}>
              <XAxis type="number" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="nameAr" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" axisLine={false} tickLine={false} width={90} />
              <Tooltip contentStyle={{ background: 'rgba(10,22,40,0.95)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '10px', fontSize: '11px', direction: 'rtl' }} />
              <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} fillOpacity={0.85} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer></div>
        </div>
        <div className="admin-card p-4">
          <h3 className="font-semibold text-sm mb-3 flex items-center gap-2"><FolderTree className="h-4 w-4 text-emerald-400" />التوزيع النسبي</h3>
          <div className="h-[200px]"><ResponsiveContainer width="100%" height="100%">
            <PieChart><Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={2} dataKey="value" strokeWidth={0}>
              {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
            </Pie><Tooltip contentStyle={{ background: 'rgba(10,22,40,0.95)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '10px', fontSize: '11px', direction: 'rtl' }} /></PieChart>
          </ResponsiveContainer></div>
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-2">
            {pieData.slice(0, 8).map(d => (
              <span key={d.name} className="flex items-center gap-1 text-[9px] text-muted-foreground">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />{d.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Categories Grid/Table */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filtered.map((cat, i) => {
            const isEditing = editId === cat.id
            const isExpanded = expandedId === cat.id
            return (
              <motion.div key={cat.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                className="admin-card p-4 group">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-sultan/10 flex items-center justify-center">
                    <Store className="h-5 w-5 text-sultan" />
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => startEdit(cat)} className="p-1 rounded-md hover:bg-white/[0.06] text-muted-foreground hover:text-sultan"><Pencil className="h-3.5 w-3.5" /></button>
                    <button onClick={() => setDeleteConfirm(cat.id)} className="p-1 rounded-md hover:bg-red-500/10 text-muted-foreground hover:text-red-400"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
                {isEditing ? (
                  <div className="space-y-2">
                    <Input value={editName} onChange={e => setEditName(e.target.value)} className="h-8 text-xs" placeholder="الاسم" />
                    <Input value={editSlug} onChange={e => setEditSlug(e.target.value)} className="h-8 text-xs" placeholder="الرابط" />
                    <div className="flex gap-2"><Button size="sm" className="flex-1 h-7 text-[11px] sultan-gradient text-royal border-0" onClick={saveEdit}><Check className="h-3 w-3 ms-1" />حفظ</Button><Button size="sm" variant="ghost" className="h-7 text-[11px]" onClick={() => setEditId(null)}>إلغاء</Button></div>
                  </div>
                ) : (
                  <>
                    <h4 className="font-semibold text-sm mb-0.5">{cat.nameAr}</h4>
                    <p className="text-[10px] text-muted-foreground mb-3">{cat.slug} · ترتيب {cat.order}</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px]"><span className="text-muted-foreground">الإعلانات</span><span className="font-medium text-sultan">{fmt(cat.count)}</span></div>
                      <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${Math.round((cat.count / (chartData[0]?.count || 1)) * 100)}%` }} transition={{ delay: i * 0.03, duration: 0.5 }} className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${COLORS[i % COLORS.length]}, ${COLORS[i % COLORS.length]}88)` }} /></div>
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground"><span>نشط: {cat.activeCount}</span><span>مميز: {cat.featuredCount}</span></div>
                    </div>
                    <button onClick={() => setExpandedId(isExpanded ? null : cat.id)} className="w-full mt-3 pt-2 border-t border-white/[0.04] text-[10px] text-muted-foreground hover:text-sultan flex items-center justify-center gap-1 transition-colors">
                      {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}{isExpanded ? 'إخفاء' : 'التفاصيل'}
                    </button>
                    <AnimatePresence>{isExpanded && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="pt-2 space-y-1.5 border-t border-white/[0.04] mt-2">
                          <div className="flex justify-between text-[10px]"><span className="text-muted-foreground">الإنجليزية</span><span>{cat.nameEn}</span></div>
                          <div className="flex justify-between text-[10px]"><span className="text-muted-foreground">الفرنسية</span><span>{cat.nameFr}</span></div>
                          <div className="flex justify-between text-[10px]"><span className="text-muted-foreground">المشاهدات</span><span>{fmt(cat.totalViews)}</span></div>
                          <div className="flex justify-between text-[10px]"><span className="text-muted-foreground">متوسط السعر</span><span>{fmt(cat.avgPrice)} درهم</span></div>
                        </div>
                      </motion.div>
                    )}</AnimatePresence>
                  </>
                )}
              </motion.div>
            )
          })}
        </div>
      ) : (
        <div className="admin-card overflow-hidden">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-white/[0.02] backdrop-blur-md">
                <tr className="border-b border-white/[0.06]">
                  <th className="text-start p-3 font-medium text-muted-foreground">الفئة</th>
                  <th className="text-start p-3 font-medium text-muted-foreground">الرابط</th>
                  <th className="text-start p-3 font-medium text-muted-foreground">الإعلانات</th>
                  <th className="text-start p-3 font-medium text-muted-foreground">نشط</th>
                  <th className="text-start p-3 font-medium text-muted-foreground">مميز</th>
                  <th className="text-start p-3 font-medium text-muted-foreground">المشاهدات</th>
                  <th className="text-start p-3 font-medium text-muted-foreground">الترتيب</th>
                  <th className="text-start p-3 font-medium text-muted-foreground">إجراءات</th>
                </tr>
              </thead>
              <tbody>{filtered.map((cat, i) => (
                <tr key={cat.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                  <td className="p-3"><div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} /><span className="font-medium">{cat.nameAr}</span></div></td>
                  <td className="p-3 text-muted-foreground font-mono text-[10px]">{cat.slug}</td>
                  <td className="p-3 font-medium text-sultan">{fmt(cat.count)}</td>
                  <td className="p-3 text-emerald-400">{fmt(cat.activeCount)}</td>
                  <td className="p-3 text-orange-400">{fmt(cat.featuredCount)}</td>
                  <td className="p-3">{fmt(cat.totalViews)}</td>
                  <td className="p-3">{cat.order}</td>
                  <td className="p-3"><div className="flex items-center gap-1">
                    <button onClick={() => startEdit(cat)} className="p-1.5 rounded-md hover:bg-white/[0.06] text-muted-foreground hover:text-sultan"><Pencil className="h-3.5 w-3.5" /></button>
                    <button onClick={() => setDeleteConfirm(cat.id)} className="p-1.5 rounded-md hover:bg-red-500/10 text-muted-foreground hover:text-red-400"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Modal */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="admin-glass border-white/[0.08]">
          <DialogHeader><DialogTitle className="text-gradient-sultan">إنشاء فئة جديدة</DialogTitle></DialogHeader>
          <div className="space-y-3 mt-2">
            <div><label className="text-[11px] text-muted-foreground mb-1 block">الاسم (عربي)</label><Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="مثال: الإلكترونيات" className="h-9 text-sm" /></div>
            <div><label className="text-[11px] text-muted-foreground mb-1 block">الرابط (slug)</label><Input value={newSlug} onChange={e => setNewSlug(e.target.value)} placeholder="مثال: electronics" className="h-9 text-sm" dir="ltr" /></div>
            <Button className="w-full sultan-gradient text-royal border-0 font-semibold press-effect" onClick={handleCreate} disabled={!newName.trim()}><Plus className="h-4 w-4 ms-2" />إنشاء الفئة</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="admin-glass border-white/[0.08]">
          <DialogHeader><DialogTitle className="text-red-400">تأكيد الحذف</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground mt-2">هل أنت متأكد من حذف هذه الفئة؟ لن يتم حذف الإعلانات المرتبطة بها.</p>
          <div className="flex gap-2 mt-4"><Button variant="destructive" className="flex-1" onClick={() => deleteConfirm && handleDelete(deleteConfirm)}>حذف نهائي</Button><Button variant="outline" className="flex-1" onClick={() => setDeleteConfirm(null)}>إلغاء</Button></div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

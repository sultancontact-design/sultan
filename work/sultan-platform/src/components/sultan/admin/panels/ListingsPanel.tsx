'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Star, Eye, MoreHorizontal, CheckCircle2, XCircle,
  Crown, ShieldBan, Trash2, BarChart3, ChevronLeft, ChevronRight,
  ArrowUpDown, Package, Clock, DollarSign, TrendingUp, ImageOff,
  Sparkles, SlidersHorizontal, CalendarDays, User, LayoutGrid, List,
} from 'lucide-react'
import {
  useReactTable, getCoreRowModel, getFilteredRowModel,
  getPaginationRowModel, getSortedRowModel, flexRender,
  type ColumnDef, type SortingState,
} from '@tanstack/react-table'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip as RTooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from '@/components/ui/tooltip'
import { useSultanStore } from '@/lib/store'

/* ------------------------------------------------------------------ */
/*  Types & Helpers                                                     */
/* ------------------------------------------------------------------ */
const fmt = (n: number) => n.toLocaleString('ar-EG')

interface Listing {
  id: string; title: string; description: string; price: number
  categoryId: string; city: string; status: string; viewsCount: number
  isFeatured: boolean; createdAt: string; images?: string
  profile: { displayName: string; city: string; trustScore: number }
}

const PIE_COLORS = ['#34d399', '#F0D060', '#ef4444']
const GRADIENTS = [
  'from-amber-700/50 to-amber-500/20',
  'from-emerald-700/50 to-emerald-500/20',
  'from-rose-700/50 to-rose-500/20',
  'from-orange-700/40 to-orange-400/15',
  'from-teal-700/40 to-teal-400/15',
]

const STATUS_CFG: Record<string, { label: string; cls: string; icon: React.ElementType }> = {
  active:  { label: 'نشط',   cls: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', icon: CheckCircle2 },
  pending: { label: 'معلّق', cls: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30', icon: Clock },
  banned:  { label: 'محظور', cls: 'bg-red-500/15 text-red-400 border-red-500/30', icon: ShieldBan },
}

const qLabel = (s: number) =>
  s >= 75
    ? { t: 'جيد', c: 'text-emerald-400' }
    : s >= 50
      ? { t: 'متوسط', c: 'text-yellow-400' }
      : { t: 'ضعيف', c: 'text-red-400' }

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/* ------------------------------------------------------------------ */
export default function ListingsPanel({ onNavigate }: { onNavigate?: (panel: string) => void }) {
  const storeListings = useSultanStore((s) => s.listings)
  const apiCategories = useSultanStore((s) => s.apiCategories)
  const isDataLoaded = useSultanStore((s) => s.isDataLoaded)

  const catMap = useMemo(
    () => Object.fromEntries((apiCategories || []).map((c: any) => [c.id, c.nameAr])),
    [apiCategories]
  )

  const uniqueCities = useMemo(() => {
    const set = new Set<string>()
    ;(storeListings || []).forEach((l: any) => { if (l.city) set.add(l.city) })
    return Array.from(set).sort()
  }, [storeListings])

  const qScore = (l: Listing) =>
    (l.images ? 25 : 0) +
    ((l.description?.length ?? 0) > 30 ? 25 : 0) +
    (l.price > 0 ? 25 : 0) +
    (l.categoryId && catMap[l.categoryId] ? 25 : 0)

  const qBreakdown = (l: Listing) => [
    { label: 'الصور', v: l.images ? 25 : 0 },
    { label: 'الوصف', v: (l.description?.length ?? 0) > 30 ? 25 : 0 },
    { label: 'السعر', v: l.price > 0 ? 25 : 0 },
    { label: 'القسم', v: l.categoryId && catMap[l.categoryId] ? 25 : 0 },
  ]

  const [data, setData] = useState<Listing[]>([])

  // Sync store listings into local state (keeps local mutations working)
  useMemo(() => {
    if (isDataLoaded && storeListings && storeListings.length > 0) {
      setData((prev) => {
        // Only reset if store has new/changed data
        if (prev.length === 0 || prev.length !== storeListings.length) {
          return storeListings.map((l: any) => ({
            ...l,
            status: l.status || 'active',
            profile: l.profile ? { displayName: l.profile.displayName || '', city: l.profile.city || '', trustScore: l.profile.trustScore || 0 } : { displayName: '', city: '', trustScore: 0 },
          })) as Listing[]
        }
        return prev
      })
    }
  }, [isDataLoaded, storeListings])
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [catFilter, setCatFilter] = useState('all')
  const [cityFilter, setCityFilter] = useState('all')
  const [sortKey, setSortKey] = useState('newest')
  const [advOpen, setAdvOpen] = useState(false)
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [tab, setTab] = useState('all')
  const [detailOpen, setDetailOpen] = useState(false)
  const [selListing, setSelListing] = useState<Listing | null>(null)
  const [rowSel, setRowSel] = useState<Record<string, boolean>>({})
  const [pageSize, setPageSize] = useState(10)

  /* ---- Mutations ---- */
  const updateStatus = (id: string, status: string) =>
    setData((p) => p.map((l) => (l.id === id ? { ...l, status } : l)))

  const toggleFeat = (id: string) =>
    setData((p) => p.map((l) => (l.id === id ? { ...l, isFeatured: !l.isFeatured } : l)))

  const deleteOne = (id: string) => {
    setData((p) => p.filter((l) => l.id !== id))
    setRowSel((p) => { const n = { ...p }; delete n[id]; return n })
  }

  const bulk = (action: string) => {
    setData((p) =>
      p
        .map((l) => {
          if (!rowSel[l.id]) return l
          if (action === 'approve') return { ...l, status: 'active' as const }
          if (action === 'feature') return { ...l, isFeatured: true }
          return l
        })
        .filter((l) => !(action === 'delete' && rowSel[l.id]))
    )
    if (action === 'delete') setRowSel({})
  }

  /* ---- Derived data ---- */
  const filtered = useMemo(() => {
    let items = [...data]
    if (tab === 'pending') items = items.filter((l) => l.status === 'pending')
    else if (tab === 'featured') items = items.filter((l) => l.isFeatured)
    else if (tab === 'banned') items = items.filter((l) => l.status === 'banned')
    if (statusFilter !== 'all') items = items.filter((l) => l.status === statusFilter)
    if (catFilter !== 'all') items = items.filter((l) => l.categoryId === catFilter)
    if (cityFilter !== 'all') items = items.filter((l) => l.city === cityFilter)
    if (globalFilter.trim()) {
      const q = globalFilter.toLowerCase()
      items = items.filter(
        (l) => l.title.toLowerCase().includes(q) || l.description?.toLowerCase().includes(q)
      )
    }
    if (priceMin) items = items.filter((l) => l.price >= +priceMin)
    if (priceMax) items = items.filter((l) => l.price <= +priceMax)
    if (sortKey === 'price-asc') items.sort((a, b) => a.price - b.price)
    else if (sortKey === 'price-desc') items.sort((a, b) => b.price - a.price)
    else if (sortKey === 'newest')
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    else if (sortKey === 'views') items.sort((a, b) => b.viewsCount - a.viewsCount)
    return items
  }, [data, tab, statusFilter, catFilter, cityFilter, globalFilter, priceMin, priceMax, sortKey])

  const stats = useMemo(
    () => ({
      total: data.length,
      active: data.filter((l) => l.status === 'active').length,
      pending: data.filter((l) => l.status === 'pending').length,
      featured: data.filter((l) => l.isFeatured).length,
      banned: data.filter((l) => l.status === 'banned').length,
      avgPrice: data.length ? Math.round(data.reduce((s, l) => s + l.price, 0) / data.length) : 0,
    }),
    [data]
  )

  const selIds = Object.keys(rowSel).filter((k) => rowSel[k])

  const catChart = useMemo(() => {
    const c: Record<string, number> = {}
    data.forEach((l) => {
      const n = catMap[l.categoryId] || 'أخرى'
      c[n] = (c[n] || 0) + 1
    })
    return Object.entries(c)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, count]) => ({ name, count }))
  }, [data, catMap])

  const pieData = useMemo(
    () => [
      { name: 'نشط', value: stats.active },
      { name: 'معلّق', value: stats.pending },
      { name: 'محظور', value: stats.banned },
    ],
    [stats]
  )

  /* ---- TanStack Table Columns ---- */
  const columns = useMemo<ColumnDef<Listing>[]>(
    () => [
      {
        id: 'select', size: 40,
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(v) => row.toggleSelected(!!v)}
          />
        ),
      },
      {
        accessorKey: 'title',
        header: ({ column }) => (
          <Button variant="ghost" size="sm" className="-px-2 text-xs"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            العنوان <ArrowUpDown className="size-3 mr-1" />
          </Button>
        ),
        cell: ({ row }) => (
          <div>
            <div className="font-medium text-sm leading-tight line-clamp-1">
              {row.original.title}
            </div>
            <div className="text-muted-foreground text-xs mt-0.5 flex items-center gap-1">
              <span className="inline-block size-1 rounded-full bg-emerald-400/60" />
              {row.original.city}
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'price',
        header: ({ column }) => (
          <Button variant="ghost" size="sm" className="-px-2 text-xs"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            السعر <ArrowUpDown className="size-3 mr-1" />
          </Button>
        ),
        cell: ({ row }) => (
          <span className="font-semibold text-sm whitespace-nowrap">
            {fmt(row.original.price)}{' '}
            <span className="text-muted-foreground font-normal text-xs">د.م</span>
          </span>
        ),
      },
      {
        id: 'category', accessorKey: 'categoryId', header: 'القسم',
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {catMap[row.original.categoryId] || '—'}
          </span>
        ),
      },
      {
        id: 'seller', header: 'البائع',
        cell: ({ row }) => (
          <span className="text-sm">{row.original.profile?.displayName || '—'}</span>
        ),
      },
      {
        accessorKey: 'status', header: 'الحالة',
        cell: ({ row }) => {
          const cfg = STATUS_CFG[row.original.status] || STATUS_CFG.active
          const Ic = cfg.icon
          return (
            <Badge variant="outline" className={`${cfg.cls} text-xs gap-1`}>
              <Ic className="size-3" />{cfg.label}
            </Badge>
          )
        },
      },
      {
        accessorKey: 'viewsCount',
        header: ({ column }) => (
          <Button variant="ghost" size="sm" className="-px-2 text-xs"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            المشاهدات <ArrowUpDown className="size-3 mr-1" />
          </Button>
        ),
        cell: ({ row }) => (
          <span className="text-sm tabular-nums text-muted-foreground">
            {fmt(row.original.viewsCount)}
          </span>
        ),
      },
      {
        id: 'featured', header: 'مميز',
        cell: ({ row }) =>
          row.original.isFeatured ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Star className="size-4 text-yellow-400 fill-yellow-400" />
              </TooltipTrigger>
              <TooltipContent>إعلان مميز</TooltipContent>
            </Tooltip>
          ) : (
            <span className="text-muted-foreground/30">—</span>
          ),
      },
      {
        id: 'actions', header: '',
        cell: ({ row }) => {
          const l = row.original
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8"
                  onClick={(e) => e.stopPropagation()}>
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setSelListing(l); setDetailOpen(true) }}>
                  <Eye className="size-4 ml-2" />عرض التفاصيل
                </DropdownMenuItem>
                {l.status !== 'active' && (
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); updateStatus(l.id, 'active') }}>
                    <CheckCircle2 className="size-4 ml-2 text-emerald-400" />قبول
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); toggleFeat(l.id) }}>
                  <Crown className="size-4 ml-2 text-yellow-400" />
                  {l.isFeatured ? 'إزالة التمييز' : 'تمييز'}
                </DropdownMenuItem>
                {l.status !== 'banned' && (
                  <DropdownMenuItem className="text-red-400"
                    onClick={(e) => { e.stopPropagation(); updateStatus(l.id, 'banned') }}>
                    <ShieldBan className="size-4 ml-2" />حظر
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-400"
                  onClick={(e) => { e.stopPropagation(); deleteOne(l.id) }}>
                  <Trash2 className="size-4 ml-2" />حذف نهائي
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
    ],
    [data]
  )

  const table = useReactTable({
    data: filtered, columns,
    state: { sorting, rowSelection: rowSel },
    onSortingChange: setSorting, onRowSelectionChange: setRowSel,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: { pagination: { pageSize } },
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
        const next = updater(table.getState().pagination)
        setPageSize(next.pageSize)
      }
    },
  })

  const openDetail = (l: Listing) => { setSelListing(l); setDetailOpen(true) }

  /* ================================================================ */
  /*  RENDER                                                           */
  /* ================================================================ */
  return (
    <TooltipProvider delayDuration={300}>
    <div className="space-y-5 p-4">
      {/* ── Loading / Empty State ── */}
      {!isDataLoaded ? (
        <div className="admin-card p-16 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 animate-pulse">
            <Package className="size-6 text-white/30" />
          </div>
          <p className="text-muted-foreground text-sm">جارٍ تحميل الإعلانات...</p>
        </div>
      ) : data.length === 0 ? (
        <div className="admin-card p-16 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
            <Package className="size-6 text-white/30" />
          </div>
          <p className="text-muted-foreground text-sm">لا توجد إعلانات بعد</p>
          <p className="text-muted-foreground/60 text-xs mt-1">ستظهر الإعلانات الجديدة هنا</p>
        </div>
      ) : (
      <>
      {/* ── Header ── */}
      <div className="flex items-center gap-3">
        <div className="sultan-gradient rounded-xl p-2.5">
          <Package className="size-6 text-[#D4AF37]" />
        </div>
        <div>
          <h2 className="text-lg font-bold">إدارة الإعلانات</h2>
          <p className="text-xs text-muted-foreground">
            مراجعة وإدارة جميع الإعلانات المنشورة على المنصة
          </p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {[
          { icon: Package, label: 'إجمالي الإعلانات', value: fmt(stats.total), color: 'text-white', bg: 'bg-white/5' },
          { icon: CheckCircle2, label: 'النشطة', value: fmt(stats.active), color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { icon: Clock, label: 'بانتظار المراجعة', value: fmt(stats.pending), color: 'text-[#F0D060]', bg: 'bg-yellow-500/10' },
          { icon: Star, label: 'المميزة', value: fmt(stats.featured), color: 'text-[#D4AF37]', bg: 'bg-yellow-500/10' },
          { icon: ShieldBan, label: 'المحظورة', value: fmt(stats.banned), color: 'text-red-400', bg: 'bg-red-500/10' },
          { icon: DollarSign, label: 'متوسط السعر', value: fmt(stats.avgPrice) + ' د.م', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, type: 'spring', stiffness: 260, damping: 20 }}
          >
            <div className="admin-card p-4 flex items-center gap-3 group hover:border-white/10">
              <div className={`${s.bg} rounded-lg p-2.5 group-hover:scale-110 transition-transform`}>
                <s.icon className={`size-5 ${s.color}`} />
              </div>
              <div className="min-w-0">
                <div className={`text-lg font-bold truncate ${s.color}`}>{s.value}</div>
                <div className="text-xs text-muted-foreground truncate">{s.label}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

         2. MODERATION TABS
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-white/5 border border-white/10 h-auto p-1 flex-wrap">
          <TabsTrigger value="all" className="text-xs gap-1">
            <List className="size-3.5" />جميع الإعلانات
            <Badge variant="secondary" className="mr-0.5 text-[10px] px-1.5 h-4">
              {stats.total}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="pending" className="text-xs gap-1">
            <Clock className="size-3.5" />بانتظار المراجعة
            <Badge variant="secondary" className="mr-0.5 text-[10px] px-1.5 h-4">
              {stats.pending}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="featured" className="text-xs gap-1">
            <Star className="size-3.5" />المميزة
            <Badge variant="secondary" className="mr-0.5 text-[10px] px-1.5 h-4">
              {stats.featured}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="banned" className="text-xs gap-1">
            <ShieldBan className="size-3.5" />المحظورة
            <Badge variant="secondary" className="mr-0.5 text-[10px] px-1.5 h-4">
              {stats.banned}
            </Badge>
          </TabsTrigger>
        </TabsList>

        {/* ── Pending Tab: Card Layout ── */}
        <TabsContent value="pending">
          {filtered.length === 0 ? (
            <div className="admin-card p-16 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/10
                flex items-center justify-center mb-4">
                <CheckCircle2 className="size-8 text-emerald-400" />
              </div>
              <p className="text-muted-foreground text-sm">لا توجد إعلانات بانتظار المراجعة</p>
              <p className="text-muted-foreground/60 text-xs mt-1">
                جميع الإعلانات تمت مراجعتها
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((l, i) => (
                <motion.div
                  key={l.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <div className="admin-card overflow-hidden hover:border-yellow-500/20">
                    <div className={`h-32 bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]} relative`}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ImageOff className="size-8 text-white/20" />
                      </div>
                      <Badge className="absolute top-2 right-2 bg-yellow-500/80 text-black
                        text-[10px] font-semibold backdrop-blur-sm">
                        <Clock className="size-3 ml-1" />بانتظار المراجعة
                      </Badge>
                    </div>
                    <div className="p-4 space-y-3">
                      <h4 className="font-semibold text-sm line-clamp-1">{l.title}</h4>
                      <div className="text-[#F0D060] font-bold">
                        {fmt(l.price)}{' '}
                        <span className="text-xs font-normal text-muted-foreground">د.م</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="size-3" />{l.profile?.displayName}
                        </span>
                        <span>{l.city}</span>
                      </div>
                      <div className="flex gap-2 pt-1">
                        <Button size="sm"
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700
                            text-white text-xs h-9 press-effect"
                          onClick={() => updateStatus(l.id, 'active')}>
                          <CheckCircle2 className="size-4 ml-1" />قبول
                        </Button>
                        <Button size="sm" variant="outline"
                          className="flex-1 border-red-500/40 text-red-400
                            hover:bg-red-500/10 text-xs h-9 press-effect"
                          onClick={() => updateStatus(l.id, 'banned')}>
                          <XCircle className="size-4 ml-1" />رفض
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ── Table Tabs (All / Featured / Banned) ── */}
        {['all', 'featured', 'banned'].map((t) => (
          <TabsContent key={t} value={t}>
               3. SEARCH + FILTERS BAR
            <div className="admin-card p-4 space-y-3">
              <div className="flex flex-wrap gap-2 items-center">
                <div className="relative flex-1 min-w-[180px]">
                  <Search className="absolute right-2.5 top-1/2 -translate-y-1/2
                    size-4 text-muted-foreground" />
                  <Input placeholder="بحث بالعنوان أو الوصف..."
                    value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)}
                    className="pr-8 h-9 text-sm bg-white/5 border-white/10
                      focus:border-[#D4AF37]/40" />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[130px] h-9 text-sm bg-white/5 border-white/10">
                    <SelectValue placeholder="الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">الكل</SelectItem>
                    <SelectItem value="active">نشط</SelectItem>
                    <SelectItem value="pending">معلّق</SelectItem>
                    <SelectItem value="banned">محظور</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={catFilter} onValueChange={setCatFilter}>
                  <SelectTrigger className="w-[140px] h-9 text-sm bg-white/5 border-white/10">
                    <SelectValue placeholder="القسم" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الأقسام</SelectItem>
                    {(apiCategories || []).map((c: any) => (
                      <SelectItem key={c.id} value={c.id}>{c.nameAr}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={cityFilter} onValueChange={setCityFilter}>
                  <SelectTrigger className="w-[130px] h-9 text-sm bg-white/5 border-white/10">
                    <SelectValue placeholder="المدينة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع المدن</SelectItem>
                    {uniqueCities.map((city) => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={sortKey} onValueChange={setSortKey}>
                  <SelectTrigger className="w-[130px] h-9 text-sm bg-white/5 border-white/10">
                    <SelectValue placeholder="ترتيب" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">الأحدث</SelectItem>
                    <SelectItem value="price-asc">السعر ↑</SelectItem>
                    <SelectItem value="price-desc">السعر ↓</SelectItem>
                    <SelectItem value="views">الأكثر مشاهدة</SelectItem>
                  </SelectContent>
                </Select>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm"
                      className={`border-white/10 h-9 ${advOpen ? 'border-[#D4AF37]/40 text-[#D4AF37]' : ''}`}
                      onClick={() => setAdvOpen(!advOpen)}>
                      <SlidersHorizontal className="size-4 ml-1" />متقدم
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>فلاتر متقدمة</TooltipContent>
                </Tooltip>
              </div>

              {/* Advanced: Price Range */}
              <AnimatePresence>
                {advOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-wrap gap-3 items-center pt-3 border-t border-white/5">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <DollarSign className="size-3" />نطاق السعر:
                      </span>
                      <Input type="number" placeholder="الحد الأدنى"
                        value={priceMin} onChange={(e) => setPriceMin(e.target.value)}
                        className="w-28 h-8 text-xs bg-white/5 border-white/10" />
                      <span className="text-muted-foreground text-xs">—</span>
                      <Input type="number" placeholder="الحد الأقصى"
                        value={priceMax} onChange={(e) => setPriceMax(e.target.value)}
                        className="w-28 h-8 text-xs bg-white/5 border-white/10" />
                      <Button size="sm" variant="ghost"
                        className="text-xs text-muted-foreground h-8"
                        onClick={() => { setPriceMin(''); setPriceMax('') }}>
                        مسح
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

               4. TANSTACK TABLE
            <div className="admin-card overflow-hidden mt-3">
              <ScrollArea className="max-h-[460px] scrollbar-thin">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 z-10 bg-white/[0.04] backdrop-blur-md">
                    {table.getHeaderGroups().map((hg) => (
                      <tr key={hg.id} className="border-b border-white/5">
                        {hg.headers.map((h) => (
                          <th key={h.id}
                            className="px-3 py-2.5 text-right text-xs font-medium
                              text-muted-foreground whitespace-nowrap">
                            {h.isPlaceholder
                              ? null
                              : flexRender(h.column.columnDef.header, h.getContext())}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody>
                    {table.getRowModel().rows.length === 0 ? (
                      <tr>
                        <td colSpan={columns.length} className="text-center py-16">
                          <div className="flex flex-col items-center gap-2">
                            <Package className="size-8 opacity-30" />
                            <span className="text-sm text-muted-foreground">
                              لا توجد نتائج مطابقة
                            </span>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      table.getRowModel().rows.map((row, i) => (
                        <motion.tr
                          key={row.id}
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.02 }}
                          className="border-b border-white/[0.03] hover:bg-white/[0.04]
                            transition-colors cursor-pointer"
                          onClick={() => openDetail(row.original)}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <td key={cell.id} className="px-3 py-2.5"
                              onClick={(e) => {
                                if (cell.column.id === 'actions' || cell.column.id === 'select')
                                  e.stopPropagation()
                              }}
                            >
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                          ))}
                        </motion.tr>
                      ))
                    )}
                  </tbody>
                </table>
              </ScrollArea>

              {/* Pagination */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-white/5">
                <div className="text-xs text-muted-foreground">
                  صفحة {fmt(table.getState().pagination.pageIndex + 1)} من{' '}
                  {fmt(table.getPageCount())} —{' '}
                  <span className="text-[#D4AF37]">{fmt(filtered.length)}</span> نتيجة
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="icon" className="size-8 border-white/10"
                    disabled={!table.getCanPreviousPage()}
                    onClick={() => table.previousPage()}>
                    <ChevronRight className="size-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="size-8 border-white/10"
                    disabled={!table.getCanNextPage()}
                    onClick={() => table.nextPage()}>
                    <ChevronLeft className="size-4" />
                  </Button>
                  <Select value={String(pageSize)}
                    onValueChange={(v) => table.setPageSize(+v)}>
                    <SelectTrigger className="w-16 h-8 text-xs bg-white/5 border-white/10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>

         6. CATEGORY ANALYTICS — Horizontal BarChart
         7. STATUS DISTRIBUTION — PieChart Donut
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="admin-card p-5">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="size-4 text-[#D4AF37]" />
              تحليل الأقسام
              <Badge variant="outline"
                className="text-[10px] border-[#D4AF37]/30 text-[#D4AF37] mr-auto">
                أفضل 8
              </Badge>
            </h3>
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={catChart} layout="vertical"
                margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
                <XAxis type="number" tick={{ fill: '#888', fontSize: 11 }}
                  axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" width={85}
                  tick={{ fill: '#ccc', fontSize: 11 }}
                  axisLine={false} tickLine={false} />
                <RTooltip contentStyle={{
                  background: 'rgba(10,22,40,0.95)',
                  border: '1px solid rgba(212,175,55,0.3)',
                  borderRadius: 8, fontSize: 12,
                }} labelStyle={{ color: '#F0D060' }} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={16}>
                  {catChart.map((_, i) => (
                    <Cell key={i}
                      fill={i === 0 ? '#D4AF37' : i === 1 ? '#F0D060' : 'rgba(212,175,55,0.4)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="admin-card p-5">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="size-4 text-emerald-400" />
              توزيع الحالات
            </h3>
            <div className="flex items-center gap-6">
              <ResponsiveContainer width={170} height={170}>
                <PieChart>
                  <Pie data={pieData} dataKey="value"
                    innerRadius={45} outerRadius={78} paddingAngle={3}
                    stroke="none" strokeWidth={0}>
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i]} />
                    ))}
                  </Pie>
                  <RTooltip contentStyle={{
                    background: 'rgba(10,22,40,0.95)',
                    border: '1px solid rgba(212,175,55,0.3)',
                    borderRadius: 8, fontSize: 12,
                  }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-4">
                {pieData.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-2.5">
                    <div className="size-3 rounded-sm"
                      style={{ background: PIE_COLORS[i] }} />
                    <span className="text-sm text-muted-foreground">{d.name}</span>
                    <span className="font-bold text-sm mr-auto">{fmt(d.value)}</span>
                  </div>
                ))}
                <div className="pt-2 border-t border-white/5">
                  <div className="text-xs text-muted-foreground">الإجمالي</div>
                  <div className="font-bold text-lg text-gradient-sultan">
                    {fmt(stats.total)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

         8. BULK OPERATIONS — Floating Bar
      <AnimatePresence>
        {selIds.length > 0 && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 admin-card-gold
              px-5 py-3 flex items-center gap-3 shadow-2xl border-beam"
          >
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-[#F0D060] animate-pulse" />
              <span className="text-sm font-semibold">
                {fmt(selIds.length)} عنصر محدد
              </span>
            </div>
            <div className="w-px h-5 bg-white/10" />
            <Button size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8 press-effect"
              onClick={() => bulk('approve')}>
              <CheckCircle2 className="size-3.5 ml-1" />قبول الكل
            </Button>
            <Button size="sm"
              className="bg-yellow-600 hover:bg-yellow-700 text-white text-xs h-8 press-effect"
              onClick={() => bulk('feature')}>
              <Sparkles className="size-3.5 ml-1" />تمييز الكل
            </Button>
            <Button size="sm" variant="outline"
              className="border-red-500/40 text-red-400 hover:bg-red-500/10
                text-xs h-8 press-effect"
              onClick={() => bulk('delete')}>
              <Trash2 className="size-3.5 ml-1" />حذف الكل
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

         5. LISTING DETAIL MODAL
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[88vh] overflow-y-auto scrollbar-thin
          bg-[#0a1628]/95 border-white/10 backdrop-blur-xl">
          {selListing && (
            <>
              <DialogHeader>
                <DialogTitle className="text-lg flex items-center gap-2">
                  <Package className="size-5 text-[#D4AF37]" />
                  تفاصيل الإعلان
                </DialogTitle>
              </DialogHeader>

              {/* Image Gallery Grid */}
              <div className="grid grid-cols-3 gap-2">
                <div className={`col-span-2 row-span-2 h-48 rounded-lg
                  bg-gradient-to-br ${GRADIENTS[0]} relative flex items-center justify-center`}>
                  <ImageOff className="size-10 text-white/15" />
                </div>
                {[1, 2].map((i) => (
                  <div key={i}
                    className={`h-[6.5rem] rounded-lg bg-gradient-to-br ${GRADIENTS[i]}
                      relative flex items-center justify-center`}>
                    <ImageOff className="size-6 text-white/15" />
                  </div>
                ))}
              </div>

              {/* Info */}
              <div className="space-y-4 mt-1">
                {/* Title + Price + Badges */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-bold text-base leading-tight">
                      {selListing.title}
                    </h3>
                    <div className="text-[#F0D060] font-bold text-xl mt-1.5">
                      {fmt(selListing.price)}{' '}
                      <span className="text-sm font-normal text-muted-foreground">
                        د.م
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    {(() => {
                      const cfg = STATUS_CFG[selListing.status] || STATUS_CFG.active
                      const Ic = cfg.icon
                      return (
                        <Badge variant="outline" className={`${cfg.cls} gap-1`}>
                          <Ic className="size-3" />{cfg.label}
                        </Badge>
                      )
                    })()}
                    {selListing.isFeatured && (
                      <Badge className="bg-yellow-500/20 text-yellow-400
                        border-yellow-500/30 gap-1">
                        <Star className="size-3" />مميز
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-xs text-muted-foreground mb-1">الوصف</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed
                    bg-white/[0.02] rounded-lg p-3">
                    {selListing.description}
                  </p>
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/[0.02] rounded-lg p-3">
                    <div className="text-xs text-muted-foreground flex items-center gap-1 mb-0.5">
                      <Sparkles className="size-3" />المدينة
                    </div>
                    <div className="text-sm font-medium">{selListing.city}</div>
                  </div>
                  <div className="bg-white/[0.02] rounded-lg p-3">
                    <div className="text-xs text-muted-foreground flex items-center gap-1 mb-0.5">
                      <LayoutGrid className="size-3" />القسم
                    </div>
                    <div className="text-sm font-medium">
                      {catMap[selListing.categoryId] || '—'}
                    </div>
                  </div>
                  <div className="bg-white/[0.02] rounded-lg p-3">
                    <div className="text-xs text-muted-foreground flex items-center gap-1 mb-0.5">
                      <Eye className="size-3" />المشاهدات
                    </div>
                    <div className="text-sm font-medium">
                      {fmt(selListing.viewsCount)}
                    </div>
                  </div>
                  <div className="bg-white/[0.02] rounded-lg p-3">
                    <div className="text-xs text-muted-foreground flex items-center gap-1 mb-0.5">
                      <CalendarDays className="size-3" />تاريخ الإنشاء
                    </div>
                    <div className="text-sm font-medium">
                      {new Date(selListing.createdAt).toLocaleDateString('ar-EG')}
                    </div>
                  </div>
                </div>

                {/* Quality Score */}
                <div className="admin-card p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium flex items-center gap-1.5">
                      <Sparkles className="size-4 text-[#D4AF37]" />
                      جودة الإعلان
                    </span>
                    <span className={`font-bold text-sm ${qLabel(qScore(selListing)).c}`}>
                      {qScore(selListing)}% — {qLabel(qScore(selListing)).t}
                    </span>
                  </div>
                  <Progress value={qScore(selListing)} className="h-2" />
                  <div className="grid grid-cols-2 gap-2">
                    {qBreakdown(selListing).map((q) => (
                      <div key={q.label}
                        className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{q.label}</span>
                        <span className={q.v === 25 ? 'text-emerald-400' : 'text-red-400'}>
                          {q.v}/25
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Seller Card */}
                <div className="admin-card p-4">
                  <div className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
                    <User className="size-3" />البائع
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full
                      bg-gradient-to-br from-[#D4AF37]/30 to-emerald-500/20
                      flex items-center justify-center text-lg font-bold text-[#D4AF37]
                      shrink-0">
                      {selListing.profile?.displayName?.charAt(0) || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm">
                        {selListing.profile?.displayName || '—'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {selListing.profile?.city}
                      </div>
                    </div>
                    <div className="text-left shrink-0">
                      <div className="text-xs text-muted-foreground">نقاط الثقة</div>
                      <div className="font-bold text-sm text-emerald-400">
                        {selListing.profile?.trustScore ?? 0}/100
                      </div>
                      <Progress value={selListing.profile?.trustScore ?? 0}
                        className="h-1.5 w-24 mt-1" />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                  {selListing.status !== 'active' && (
                    <Button size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white press-effect"
                      onClick={() => {
                        updateStatus(selListing.id, 'active')
                        setSelListing({ ...selListing, status: 'active' })
                      }}>
                      <CheckCircle2 className="size-4 ml-1" />قبول
                    </Button>
                  )}
                  <Button size="sm" variant="outline"
                    className="border-yellow-500/30 text-yellow-400
                      hover:bg-yellow-500/10 press-effect"
                    onClick={() => {
                      toggleFeat(selListing.id)
                      setSelListing({ ...selListing, isFeatured: !selListing.isFeatured })
                    }}>
                    <Star className="size-4 ml-1" />
                    {selListing.isFeatured ? 'إزالة التمييز' : 'تمييز'}
                  </Button>
                  {selListing.status !== 'banned' && (
                    <Button size="sm" variant="outline"
                      className="border-red-500/30 text-red-400 hover:bg-red-500/10 press-effect"
                      onClick={() => {
                        updateStatus(selListing.id, 'banned')
                        setSelListing({ ...selListing, status: 'banned' })
                      }}>
                      <ShieldBan className="size-4 ml-1" />حظر
                    </Button>
                  )}
                  <Button size="sm" variant="outline"
                    className="border-red-500/30 text-red-400 hover:bg-red-500/10 press-effect"
                    onClick={() => { deleteOne(selListing.id); setDetailOpen(false) }}>
                    <Trash2 className="size-4 ml-1" />حذف
                  </Button>
                  <Select onValueChange={(v) => {
                    updateStatus(selListing.id, v)
                    setSelListing({ ...selListing, status: v })
                  }}>
                    <SelectTrigger className="w-[140px] h-8 text-xs bg-white/5 border-white/10">
                      <SelectValue placeholder="تغيير الحالة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">نشط</SelectItem>
                      <SelectItem value="pending">معلّق</SelectItem>
                      <SelectItem value="banned">محظور</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      </>
      )}
    </div>
    </TooltipProvider>
  )
}

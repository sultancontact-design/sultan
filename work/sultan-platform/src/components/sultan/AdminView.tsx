'use client'
import { useState, lazy, Suspense, useCallback } from 'react'
import { useSultanStore } from '@/lib/store'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { motion, AnimatePresence } from 'framer-motion'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from 'cmdk'
import {
  LayoutDashboard, Users, ShoppingBag, Gavel, DollarSign, ToggleRight,
  FileText, Heart, Settings, LogOut, Menu, X, ShieldAlert, FileWarning,
  FolderTree, Server, Search, ChevronLeft, Bell, Command as CmdIcon,
  Activity, ArrowRight, Clock, Zap, Layers,
} from 'lucide-react'

const OverviewPanel = lazy(() => import('./admin/panels/OverviewPanel'))
const UsersPanel = lazy(() => import('./admin/panels/UsersPanel'))
const ListingsPanel = lazy(() => import('./admin/panels/ListingsPanel'))
const AuctionsPanel = lazy(() => import('./admin/panels/AuctionsPanel'))
const FinancePanel = lazy(() => import('./admin/panels/FinancePanel'))
const FeatureFlagsPanel = lazy(() => import('./admin/panels/FeatureFlagsPanel'))
const AuditLogPanel = lazy(() => import('./admin/panels/AuditLogPanel'))
const CharityPanel = lazy(() => import('./admin/panels/CharityPanel'))
const SettingsPanel = lazy(() => import('./admin/panels/SettingsPanel'))
const ReportsPanel = lazy(() => import('./admin/panels/ReportsPanel'))
const CategoriesPanel = lazy(() => import('./admin/panels/CategoriesPanel'))
const SystemPanel = lazy(() => import('./admin/panels/SystemPanel'))

const navSections = [
  { title: 'رئيسي', items: [
    { id: 'overview', label: 'نظرة عامة', icon: LayoutDashboard },
  ]},
  { title: 'إدارة المحتوى', items: [
    { id: 'users', label: 'المستخدمون', icon: Users, badge: 48520 },
    { id: 'listings', label: 'الإعلانات', icon: ShoppingBag, badge: 32150 },
    { id: 'auctions', label: 'المزادات', icon: Gavel, badge: 28 },
    { id: 'reports', label: 'البلاغات', icon: FileWarning, badge: 3 },
    { id: 'categories', label: 'الفئات', icon: FolderTree },
  ]},
  { title: 'التحليلات', items: [
    { id: 'finance', label: 'المالية', icon: DollarSign },
    { id: 'audit', label: 'سجل العمليات', icon: FileText },
    { id: 'system', label: 'صحة النظام', icon: Server },
  ]},
  { title: 'النظام', items: [
    { id: 'features', label: 'أعلام الميزات', icon: ToggleRight },
    { id: 'charity', label: 'التضامن', icon: Heart },
    { id: 'settings', label: 'الإعدادات', icon: Settings },
  ]},
] as const

type PanelId = 'overview'|'users'|'listings'|'auctions'|'finance'|'features'|'audit'|'charity'|'settings'|'reports'|'categories'|'system'

const panelMap: Record<PanelId, React.ComponentType<any>> = {
  overview: OverviewPanel, users: UsersPanel, listings: ListingsPanel,
  auctions: AuctionsPanel, finance: FinancePanel, features: FeatureFlagsPanel,
  audit: AuditLogPanel, charity: CharityPanel, settings: SettingsPanel,
  reports: ReportsPanel, categories: CategoriesPanel, system: SystemPanel,
}

const allNavItems = navSections.flatMap(s => s.items)

export default function AdminView() {
  const { goBack, addToast } = useSultanStore()
  const [activePanel, setActivePanel] = useState<PanelId>('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [cmdOpen, setCmdOpen] = useState(false)
  const [globalSearch, setGlobalSearch] = useState('')

  const handleNav = useCallback((id: PanelId) => {
    setActivePanel(id)
    setSidebarOpen(false)
  }, [])

  const ActiveComponent = panelMap[activePanel]
  const currentNav = allNavItems.find(n => n.id === activePanel)

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-background">
      {/* ─── Mobile overlay ─── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 md:hidden" onClick={() => setSidebarOpen(false)} />
        )}
      </AnimatePresence>

      {/* ─── Sidebar ─── */}
      <aside className={`
        fixed md:static inset-y-0 right-0 z-50 md:z-auto
        w-64 admin-sidebar flex flex-col shrink-0
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="flex items-center gap-3 p-4 border-b border-white/[0.06]">
          <div className="w-9 h-9 rounded-xl sultan-gradient flex items-center justify-center">
            <ShieldAlert className="h-5 w-5 text-royal" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gradient-sultan">مركز القيادة</p>
            <p className="text-[10px] text-muted-foreground">لوحة تحكم احترافية</p>
          </div>
          <Button variant="ghost" size="icon" className="md:hidden h-7 w-7" onClick={() => setSidebarOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Global search in sidebar */}
        <div className="px-3 pt-3 pb-1">
          <button onClick={() => setCmdOpen(true)}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs text-muted-foreground hover:border-sultan/20 transition-colors">
            <Search className="h-3.5 w-3.5" />
            <span>بحث سريع...</span>
            <kbd className="ms-auto text-[9px] bg-white/[0.06] px-1.5 py-0.5 rounded border border-white/[0.08] font-mono">⌘K</kbd>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto scrollbar-thin px-2 py-2">
          {navSections.map(section => (
            <div key={section.title} className="mb-4">
              <p className="px-3 py-1 text-[9px] font-semibold text-muted-foreground/50 uppercase tracking-widest">{section.title}</p>
              <ul className="space-y-0.5">
                {section.items.map(item => {
                  const isActive = activePanel === item.id
                  return (
                    <li key={item.id}>
                      <button onClick={() => handleNav(item.id as PanelId)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] transition-all duration-200 group
                          ${isActive
                            ? 'admin-card-gold text-foreground font-semibold'
                            : 'text-muted-foreground hover:text-foreground hover:bg-white/[0.03]'
                          }`}>
                        <item.icon className={`h-4 w-4 shrink-0 transition-colors ${isActive ? 'text-sultan' : 'group-hover:text-sultan/70'}`} />
                        <span className="flex-1 text-start">{item.label}</span>
                        {'badge' in item && item.badge ? (
                          <span className="text-[9px] text-sultan/70 font-mono">{(item.badge as number).toLocaleString('ar-EG')}</span>
                        ) : null}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className="p-3 border-t border-white/[0.06]">
          <div className="flex items-center gap-3 px-2 py-1.5">
            <div className="w-9 h-9 rounded-full sultan-gradient flex items-center justify-center text-sm font-bold text-royal shrink-0">
              ي
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">يوسف بنعلي</p>
              <div className="flex items-center gap-1.5">
                <Badge className="text-[8px] h-4 px-1.5 sultan-gradient text-royal border-0">سوبر أدمن</Badge>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ─── Main Content ─── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="flex items-center gap-3 px-4 md:px-6 py-3 border-b border-white/[0.06] admin-glass shrink-0">
          <Button variant="ghost" size="icon" className="md:hidden h-8 w-8" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={goBack}>
            <ArrowRight className="h-4 w-4" />
          </Button>

          <div className="flex-1 flex items-center gap-3 min-w-0">
            <div className="flex items-center gap-2">
              {currentNav && <currentNav.icon className="h-4 w-4 text-sultan" />}
              <h1 className="text-sm font-bold truncate">{currentNav?.label || 'لوحة التحكم'}</h1>
            </div>
            <div className="hidden sm:flex items-center gap-1 text-[10px] text-muted-foreground">
              <span>مركز القيادة</span>
              <ChevronLeft className="h-3 w-3" />
              <span className="text-foreground/70">{currentNav?.label}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <div className="hidden md:flex items-center gap-1.5 admin-card px-2.5 py-1 rounded-lg">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] text-emerald-400">مباشر</span>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 relative" onClick={() => addToast('لا توجد إشعارات جديدة', 'info')}>
              <Bell className="h-4 w-4" />
              <span className="absolute -top-0.5 -start-0.5 w-3.5 h-3.5 rounded-full bg-red-500 text-white text-[7px] font-bold flex items-center justify-center">3</span>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => {
              addToast('تم تسجيل الخروج', 'success')
              goBack()
            }}>
              <LogOut className="h-4 w-4 text-muted-foreground hover:text-red-400" />
            </Button>
          </div>
        </header>

        {/* Panel Content */}
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <Suspense fallback={
            <div className="p-4 md:p-6 space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-28 w-full rounded-xl bg-white/[0.03]" />
              ))}
            </div>
          }>
            <ActiveComponent onNavigate={(panel: string) => {
              if (panelMap[panel as PanelId]) setActivePanel(panel as PanelId)
            }} />
          </Suspense>
        </main>
      </div>

      {/* ─── Command Palette ─── */}
      <AnimatePresence>
        {cmdOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black/50" onClick={() => setCmdOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: -10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              className="fixed top-[15%] left-1/2 -translate-x-1/2 z-[61] w-[90%] max-w-lg admin-glass rounded-2xl overflow-hidden shadow-2xl">
              <Command className="bg-transparent">
                <div className="flex items-center border-b border-white/[0.06] px-4">
                  <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                  <CommandInput placeholder="ابحث في لوحة التحكم..." value={globalSearch} onValueChange={setGlobalSearch}
                    className="border-0 focus:ring-0 bg-transparent text-sm h-12" />
                  <kbd className="text-[9px] text-muted-foreground bg-white/[0.06] px-1.5 py-0.5 rounded border border-white/[0.08] font-mono shrink-0">ESC</kbd>
                </div>
                <CommandList className="max-h-72 overflow-y-auto scrollbar-thin">
                  <CommandEmpty className="p-4 text-center text-sm text-muted-foreground">لم يتم العثور على نتائج</CommandEmpty>
                  <CommandGroup heading="اللوحات">
                    {allNavItems.map(item => (
                      <CommandItem key={item.id} onSelect={() => { handleNav(item.id as PanelId); setCmdOpen(false); }}
                        className="flex items-center gap-3 px-4 py-2.5 cursor-pointer text-sm">
                        <item.icon className="h-4 w-4 text-sultan" />
                        <span>{item.label}</span>
                        <span className="ms-auto text-[10px] text-muted-foreground">لوحة</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
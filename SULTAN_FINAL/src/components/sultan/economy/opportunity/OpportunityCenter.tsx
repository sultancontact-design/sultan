'use client';
import { useState, useMemo, useCallback } from 'react';
import { useSultanStore } from '@/lib/store';
import { useEconomyStore } from '@/lib/economy';
import { OPPORTUNITY_CATEGORIES, MOROCCAN_CITIES, AUDIENCE_SEGMENTS } from '@/lib/economy/constants';
import type { SultanTask, Bounty, Challenge, GrantCampaign, CurrencyCode } from '@/lib/economy';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  Search,
  Briefcase,
  ListTodo,
  Trophy,
  Target,
  Gift,
  Wrench,
  Building2,
  Globe,
  MapPin,
  Clock,
  Coins,
  User,
  FolderOpen,
  Zap,
} from 'lucide-react';

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.06 } },
};

// ─── Tab Config ──────────────────────────────────────────────────────────────

type TabKey = 'jobs' | 'tasks' | 'bounties' | 'challenges' | 'grants' | 'services' | 'business';

interface TabConfig {
  key: TabKey;
  label: string;
  icon: typeof Briefcase;
}

const TABS: TabConfig[] = [
  { key: 'jobs', label: 'الوظائف', icon: Briefcase },
  { key: 'tasks', label: 'المهام', icon: ListTodo },
  { key: 'bounties', label: 'الجوائز', icon: Trophy },
  { key: 'challenges', label: 'التحديات', icon: Target },
  { key: 'grants', label: 'المنح', icon: Gift },
  { key: 'services', label: 'الخدمات', icon: Wrench },
  { key: 'business', label: 'فرص الأعمال', icon: Building2 },
];

// ─── Status Labels ───────────────────────────────────────────────────────────

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  draft: { label: 'مسودة', color: 'text-gray-400', bg: 'bg-gray-400/10' },
  published: { label: 'منشور', color: 'text-green-400', bg: 'bg-green-400/10' },
  active: { label: 'نشط', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  in_progress: { label: 'قيد التنفيذ', color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
  submitted: { label: 'تم التسليم', color: 'text-blue-400', bg: 'bg-blue-400/10' },
  under_review: { label: 'قيد المراجعة', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  approved: { label: 'مقبول', color: 'text-green-400', bg: 'bg-green-400/10' },
  paid: { label: 'مدفوع', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  closed: { label: 'مغلق', color: 'text-red-400', bg: 'bg-red-400/10' },
  judging: { label: 'قيد التحكيم', color: 'text-purple-400', bg: 'bg-purple-400/10' },
  winner_selected: { label: 'تم اختيار الفائز', color: 'text-sultan', bg: 'bg-sultan/10' },
  rewarded: { label: 'تمت المكافأة', color: 'text-sultan', bg: 'bg-sultan/10' },
  cancelled: { label: 'ملغى', color: 'text-gray-500', bg: 'bg-gray-500/10' },
  accepting_applications: { label: 'قبول الترشحات', color: 'text-green-400', bg: 'bg-green-400/10' },
  review: { label: 'مراجعة', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  payout: { label: 'صرف', color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
  completed: { label: 'مكتمل', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  disputed: { label: 'متنازع عليه', color: 'text-red-400', bg: 'bg-red-400/10' },
  rejected: { label: 'مرفوض', color: 'text-red-400', bg: 'bg-red-400/10' },
  none: { label: 'لم يبدأ', color: 'text-gray-400', bg: 'bg-gray-400/10' },
  escrowed: { label: 'في الحساب الآمن', color: 'text-sultan', bg: 'bg-sultan/10' },
  released: { label: 'محرر', color: 'text-green-400', bg: 'bg-green-400/10' },
  pending: { label: 'قيد الانتظار', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
};

// ─── Currency Labels ─────────────────────────────────────────────────────────

const CURRENCY_LABELS: Record<CurrencyCode, string> = {
  SC: 'SC',
  SR: 'SR',
  SP: 'SP',
  MAD: 'MAD',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('ar-MA', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return dateStr;
  }
}

function getStatusStyle(status: string) {
  return STATUS_LABELS[status] || { label: status, color: 'text-gray-400', bg: 'bg-gray-400/10' };
}

// ─── Unified Opportunity Item ────────────────────────────────────────────────

interface UnifiedOpportunity {
  id: string;
  type: TabKey;
  title: string;
  category: string;
  city: string | null;
  amount: number;
  currency: CurrencyCode;
  deadline: string;
  status: string;
  creatorId: string;
  description: string;
  extra?: string;
}

function toUnified(item: SultanTask | Bounty | Challenge | GrantCampaign, type: TabKey): UnifiedOpportunity {
  if ('budget' in item && 'reward' in item && 'skills' in item) {
    // SultanTask
    const t = item as SultanTask;
    return {
      id: t.id,
      type,
      title: t.title,
      category: '',
      city: t.location,
      amount: t.budget,
      currency: t.currency,
      deadline: t.deadline,
      status: t.status,
      creatorId: t.creatorId,
      description: t.description,
      extra: t.estimatedTime,
    };
  }
  if ('problem' in item && 'paymentStatus' in item) {
    // Bounty
    const b = item as Bounty;
    return {
      id: b.id,
      type,
      title: b.title,
      category: b.category,
      city: b.location,
      amount: b.budget,
      currency: b.currency,
      deadline: b.deadline,
      status: b.status,
      creatorId: b.creatorId,
      description: b.problem,
    };
  }
  if ('winnerCount' in item && 'submissionType' in item) {
    // Challenge
    const c = item as Challenge;
    return {
      id: c.id,
      type,
      title: c.title,
      category: c.category,
      city: c.location,
      amount: c.reward.amount,
      currency: c.reward.currency,
      deadline: c.deadline,
      status: c.status,
      creatorId: c.creatorId,
      description: c.description,
      extra: `${c.participantCount} مشارك`,
    };
  }
  // GrantCampaign
  const g = item as GrantCampaign;
  return {
    id: g.id,
    type,
    title: g.title,
    category: g.categories[0] || '',
    city: g.cities[0] || null,
    amount: g.grantAmount,
    currency: g.grantCurrency,
    deadline: g.duration.end,
    status: g.status,
    creatorId: '',
    description: g.description,
    extra: `${g.applicantCount} متقدم / ${g.approvedCount} مقبول`,
  };
}

// ─── Opportunity Card ────────────────────────────────────────────────────────

function OpportunityCard({ item, index }: { item: UnifiedOpportunity; index: number }) {
  const statusStyle = getStatusStyle(item.status);
  return (
    <motion.div
      variants={fadeUp}
      className="rounded-xl border border-border/50 bg-card p-4 transition-colors hover:border-sultan/30 hover:bg-sultan-muted"
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h4 className="truncate text-sm font-semibold text-foreground">{item.title}</h4>
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{item.description}</p>
        </div>
        <Badge
          variant="outline"
          className={`shrink-0 border-0 text-[10px] font-medium ${statusStyle.bg} ${statusStyle.color}`}
        >
          {statusStyle.label}
        </Badge>
      </div>

      <Separator className="my-3 bg-border/50" />

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
        {/* Amount */}
        <div className="flex items-center gap-1 text-sultan font-semibold">
          <Coins className="h-3 w-3" />
          <span>{item.amount.toLocaleString('ar-MA')} {CURRENCY_LABELS[item.currency]}</span>
        </div>

        {/* City */}
        {item.city && (
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span>{item.city}</span>
          </div>
        )}

        {/* Category */}
        {item.category && (
          <div className="flex items-center gap-1">
            <FolderOpen className="h-3 w-3" />
            <span>{item.category}</span>
          </div>
        )}

        {/* Deadline */}
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>{formatDate(item.deadline)}</span>
        </div>

        {/* Extra info */}
        {item.extra && (
          <div className="flex items-center gap-1">
            <span>{item.extra}</span>
          </div>
        )}
      </div>

      {/* Creator */}
      {item.creatorId && (
        <div className="mt-3 flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <User className="h-3 w-3" />
          <span>{item.creatorId}</span>
        </div>
      )}
    </motion.div>
  );
}

// ─── Empty State ─────────────────────────────────────────────────────────────

function EmptyState({ message }: { message: string }) {
  return (
    <motion.div
      variants={fadeUp}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="mb-4 rounded-full bg-sultan-muted p-4">
        <FolderOpen className="h-8 w-8 text-sultan" />
      </div>
      <p className="text-sm text-muted-foreground">{message}</p>
    </motion.div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function OpportunityCenter() {
  const goBack = useSultanStore((s) => s.goBack);
  const tasks = useEconomyStore((s) => s.tasks);
  const bounties = useEconomyStore((s) => s.bounties);
  const challenges = useEconomyStore((s) => s.challenges);
  const grantCampaigns = useEconomyStore((s) => s.grantCampaigns);
  const isFeatureEnabled = useEconomyStore((s) => s.isFeatureEnabled);

  // Filter state
  const [activeTab, setActiveTab] = useState<TabKey>('tasks');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterCity, setFilterCity] = useState<string>('all');
  const [filterAudience, setFilterAudience] = useState<string>('all');

  // AI Search state
  const [aiQuery, setAiQuery] = useState('');
  const [aiResults, setAiResults] = useState<UnifiedOpportunity[]>([]);
  const [aiSearched, setAiSearched] = useState(false);

  const diasporaEnabled = isFeatureEnabled('diaspora_enabled');

  // ─── Collect all items per tab ────────────────────────────────────────────

  const allItems = useMemo(() => {
    const items: UnifiedOpportunity[] = [];
    // Jobs = tasks that look like jobs (published or in_progress)
    tasks
      .filter((t) => t.status === 'published' || t.status === 'in_progress')
      .forEach((t) => items.push(toUnified(t, 'jobs')));
    // Tasks = all tasks
    tasks.forEach((t) => items.push(toUnified(t, 'tasks')));
    // Bounties
    bounties.forEach((b) => items.push(toUnified(b, 'bounties')));
    // Challenges
    challenges.forEach((c) => items.push(toUnified(c, 'challenges')));
    // Grants
    grantCampaigns.forEach((g) => items.push(toUnified(g, 'grants')));
    return items;
  }, [tasks, bounties, challenges, grantCampaigns]);

  // ─── Filtered items for each tab ──────────────────────────────────────────

  const getItemsForTab = useCallback(
    (tab: TabKey): UnifiedOpportunity[] => {
      let items: UnifiedOpportunity[] = [];

      switch (tab) {
        case 'jobs':
          items = tasks
            .filter((t) => t.status === 'published' || t.status === 'in_progress')
            .map((t) => toUnified(t, 'jobs'));
          break;
        case 'tasks':
          items = tasks.map((t) => toUnified(t, 'tasks'));
          break;
        case 'bounties':
          items = bounties.map((b) => toUnified(b, 'bounties'));
          break;
        case 'challenges':
          items = challenges.map((c) => toUnified(c, 'challenges'));
          break;
        case 'grants':
          items = grantCampaigns.map((g) => toUnified(g, 'grants'));
          break;
        case 'services':
        case 'business':
          // No dedicated store data yet
          break;
      }

      // Apply category filter
      if (filterCategory !== 'all') {
        items = items.filter((item) => item.category === filterCategory);
      }

      // Apply city filter
      if (filterCity !== 'all') {
        items = items.filter((item) => item.city === filterCity);
      }

      return items;
    },
    [tasks, bounties, challenges, grantCampaigns, filterCategory, filterCity],
  );

  // ─── AI Search handler ────────────────────────────────────────────────────

  const handleAiSearch = useCallback(() => {
    if (!aiQuery.trim()) {
      setAiResults([]);
      setAiSearched(false);
      return;
    }

    const q = aiQuery.trim().toLowerCase();
    const keywords = q.split(/\s+/);

    const scored = allItems.map((item) => {
      let score = 0;
      const haystack = `${item.title} ${item.description} ${item.category} ${item.city || ''} ${item.extra || ''}`.toLowerCase();

      for (const kw of keywords) {
        if (haystack.includes(kw)) {
          score += 1;
          if (item.title.toLowerCase().includes(kw)) score += 3;
          if (item.category.toLowerCase().includes(kw)) score += 2;
        }
      }

      return { item, score };
    });

    const matched = scored
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((s) => s.item);

    setAiResults(matched);
    setAiSearched(true);
  }, [aiQuery, allItems]);

  // ─── Diaspora items ───────────────────────────────────────────────────────

  const diasporaItems = useMemo(() => {
    if (!diasporaEnabled) return [];
    // Filter items that may relate to diaspora audience
    const diasporaCities = ['فرنسا', 'إسبانيا', 'بلجيكا', 'هولندا', 'كندا'];
    return allItems.filter(
      (item) =>
        item.city && diasporaCities.some((dc) => item.city?.includes(dc)),
    );
  }, [allItems, diasporaEnabled]);

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="mx-auto max-w-lg px-4 pb-24">
        {/* ─── Header ─────────────────────────────────────────────────────── */}
        <motion.header
          {...fadeUp}
          className="sticky top-0 z-30 flex items-center gap-3 bg-background/80 py-4 backdrop-blur-xl"
        >
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0 text-muted-foreground hover:text-sultan"
            onClick={goBack}
          >
            <ArrowRight className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-sultan" />
            <h1 className="text-lg font-bold text-foreground">فرص سلطان</h1>
          </div>
        </motion.header>

        {/* ─── AI Opportunity Assistant ────────────────────────────────────── */}
        <motion.section {...fadeUp} className="mb-5 mt-2">
          <div className="rounded-xl border border-sultan/20 bg-gradient-to-br from-sultan/5 to-transparent p-4">
            <div className="mb-3 flex items-center gap-2">
              <Zap className="h-4 w-4 text-sultan" />
              <span className="text-xs font-semibold text-sultan">مساعد الفرص الذكي</span>
            </div>
            <div className="flex gap-2">
              <Input
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAiSearch()}
                placeholder="صف فرصتك..."
                className="h-10 border-sultan/20 bg-background/50 text-sm placeholder:text-muted-foreground/60 focus-visible:ring-sultan/30"
              />
              <Button
                size="icon"
                onClick={handleAiSearch}
                className="h-10 w-10 shrink-0 bg-sultan text-sultan-foreground hover:bg-sultan/90"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>

            {/* AI Results */}
            {aiSearched && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-3"
              >
                <Separator className="mb-3 bg-sultan/20" />
                {aiResults.length === 0 ? (
                  <div className="py-6 text-center">
                    <Search className="mx-auto mb-2 h-6 w-6 text-muted-foreground/40" />
                    <p className="text-xs text-muted-foreground">
                      لا توجد حالياً فرصة مطابقة
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="mb-2 text-[11px] text-muted-foreground">
                      تم العثور على {aiResults.length} فرصة مطابقة
                    </p>
                    {aiResults.slice(0, 5).map((item, i) => (
                      <OpportunityCard key={`ai-${item.id}-${i}`} item={item} index={i} />
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </motion.section>

        {/* ─── Mghrib to the World (Diaspora Badge) ─────────────────────────── */}
        {diasporaEnabled && (
          <motion.section {...fadeUp} className="mb-5">
            <div className="rounded-xl border border-sultan/20 bg-gradient-to-l from-sultan/10 via-sultan/5 to-transparent p-4">
              <div className="mb-3 flex items-center gap-2">
                <Globe className="h-4 w-4 text-sultan" />
                <Badge className="border-0 bg-sultan/20 text-sultan text-xs font-semibold">
                  Mghrib to the World
                </Badge>
              </div>
              <p className="mb-3 text-xs text-muted-foreground">
                فرص مخصصة للمغاربة بالخارج — تواصل مع مجتمعك من أي مكان في العالم
              </p>
              {diasporaItems.length > 0 ? (
                <div className="space-y-2">
                  {diasporaItems.slice(0, 3).map((item, i) => (
                    <OpportunityCard key={`diaspora-${item.id}-${i}`} item={item} index={i} />
                  ))}
                </div>
              ) : (
                <p className="py-3 text-center text-[11px] text-muted-foreground/60">
                  لا توجد فرص حالياً للجالية المغربية
                </p>
              )}
            </div>
          </motion.section>
        )}

        {/* ─── Filter Bar ──────────────────────────────────────────────────── */}
        <motion.section {...fadeUp} className="mb-4">
          <div className="grid grid-cols-3 gap-2">
            {/* Category */}
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="h-9 border-border/50 bg-card text-xs">
                <SelectValue placeholder="التصنيف" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل التصنيفات</SelectItem>
                {OPPORTUNITY_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* City */}
            <Select value={filterCity} onValueChange={setFilterCity}>
              <SelectTrigger className="h-9 border-border/50 bg-card text-xs">
                <SelectValue placeholder="المدينة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل المدن</SelectItem>
                {MOROCCAN_CITIES.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Audience Segment */}
            <Select value={filterAudience} onValueChange={setFilterAudience}>
              <SelectTrigger className="h-9 border-border/50 bg-card text-xs">
                <SelectValue placeholder="الفئة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الفئات</SelectItem>
                {AUDIENCE_SEGMENTS.map((seg) => (
                  <SelectItem key={seg.value} value={seg.value}>
                    {seg.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </motion.section>

        {/* ─── Tabs ────────────────────────────────────────────────────────── */}
        <motion.section {...fadeUp} className="mt-2">
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as TabKey)}
            className="w-full"
          >
            <TabsList className="mb-4 flex h-auto w-full flex-wrap gap-1 bg-transparent p-0">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.key;
                return (
                  <TabsTrigger
                    key={tab.key}
                    value={tab.key}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all data-[state=active]:bg-sultan/15 data-[state=active]:text-sultan data-[state=active]:shadow-none ${
                      isActive
                        ? 'bg-sultan/15 text-sultan'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{tab.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {/* Tab Content for each type */}
            {TABS.map((tab) => {
              const items = getItemsForTab(tab.key);
              return (
                <TabsContent key={tab.key} value={tab.key} className="mt-0">
                  {items.length === 0 ? (
                    <EmptyState message="لا توجد فرص حالياً في هذا القسم" />
                  ) : (
                    <motion.div
                      variants={stagger}
                      initial="initial"
                      animate="animate"
                      className="space-y-3"
                    >
                      {items.map((item, i) => (
                        <OpportunityCard key={`${tab.key}-${item.id}`} item={item} index={i} />
                      ))}
                    </motion.div>
                  )}
                </TabsContent>
              );
            })}
          </Tabs>
        </motion.section>
      </div>
    </div>
  );
}

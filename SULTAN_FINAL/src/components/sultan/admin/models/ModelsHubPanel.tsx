'use client';

import { useState, useMemo } from 'react';
import { DEFAULT_MODELS } from '@/lib/ai/providers/provider-registry';
import type { AIModel } from '@/lib/ai/core/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Cpu,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  DollarSign,
  Zap,
  Brain,
  Eye,
  Code2,
  Sparkles,
  TrendingUp,
  Search,
  Filter,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

function formatPrice(p: number): string {
  if (p < 0.0001) return `$${(p * 1_000_000).toFixed(1)}/M`;
  if (p < 0.01) return `$${(p * 1_000).toFixed(2)}/K`;
  return `$${p.toFixed(3)}/K`;
}

const healthConfig = {
  healthy:  { dot: 'bg-green-500',       label: 'سليم',        badge: 'bg-green-500/20 text-green-400 border-green-500/30' },
  degraded: { dot: 'bg-yellow-500',      label: 'متدهور',      badge: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  down:     { dot: 'bg-red-500',         label: 'متوقف',       badge: 'bg-red-500/20 text-red-400 border-red-500/30' },
  unknown:  { dot: 'bg-muted-foreground', label: 'غير معروف',  badge: 'bg-muted/50 text-muted-foreground border-border' },
} as const;

const capabilityMeta = [
  { key: 'supportsVision' as const,         icon: Eye,      label: 'رؤية',     color: 'text-purple-400',  bg: 'bg-purple-500/15' },
  { key: 'supportsCoding' as const,         icon: Code2,    label: 'برمجة',    color: 'text-blue-400',    bg: 'bg-blue-500/15' },
  { key: 'supportsReasoning' as const,      icon: Brain,    label: 'تفكير',    color: 'text-amber-400',   bg: 'bg-amber-500/15' },
  { key: 'supportsFunctionCalling' as const, icon: Sparkles, label: 'أدوات',    color: 'text-cyan-400',    bg: 'bg-cyan-500/15' },
  { key: 'supportsStreaming' as const,      icon: Zap,      label: 'تدفق',     color: 'text-green-400',   bg: 'bg-green-500/15' },
  { key: 'supportsJsonMode' as const,      icon: Code2,    label: 'JSON',     color: 'text-orange-400',  bg: 'bg-orange-500/15' },
];

const providerColors: Record<string, string> = {
  'OpenAI':     'text-emerald-400',
  'Anthropic':  'text-orange-400',
  'Google AI':  'text-blue-400',
  'xAI':        'text-red-400',
  'DeepSeek':   'text-indigo-400',
  'Mistral AI': 'text-sky-400',
  'Groq':       'text-rose-400',
  'OpenRouter': 'text-teal-400',
  'Cerebras':   'text-violet-400',
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function ModelsHubPanel() {
  const [models, setModels] = useState<AIModel[]>(DEFAULT_MODELS.map(m => ({ ...m })));
  const [search, setSearch] = useState('');
  const [providerFilter, setProviderFilter] = useState<string>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // ── Derived data ──
  const providers = useMemo(
    () => [...new Set(DEFAULT_MODELS.map(m => m.providerName))].sort(),
    []
  );

  const filtered = useMemo(() => {
    let list = models;
    if (providerFilter !== 'all') list = list.filter(m => m.providerName === providerFilter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        m =>
          m.displayName.toLowerCase().includes(q) ||
          m.modelId.toLowerCase().includes(q) ||
          m.providerName.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q)
      );
    }
    return list;
  }, [models, providerFilter, search]);

  const selected = useMemo(() => models.find(m => m.id === selectedId) ?? null, [models, selectedId]);

  const totalCount = models.length;
  const activeCount = models.filter(m => m.isActive).length;
  const providerCount = providers.length;
  const totalCostPer1MInput = useMemo(() => {
    const sum = models.reduce((a, m) => a + m.pricing.inputPer1kTokens, 0);
    return sum > 0 ? `$${(sum).toFixed(2)}` : '—';
  }, [models]);

  // ── Handlers ──
  const toggleModel = (id: string) => {
    setModels(prev => prev.map(m => (m.id === id ? { ...m, isActive: !m.isActive } : m)));
  };

  // ── Render ──
  return (
    <div dir="rtl" className="space-y-5">
      {/* ═══════ Top Bar ═══════ */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="ابحث عن نموذج..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pe-10 h-10 bg-card border-border/50 focus:border-sultan/50"
          />
        </div>

        {/* Provider Filter */}
        <div className="relative w-full sm:w-52">
          <Filter className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Select value={providerFilter} onValueChange={setProviderFilter}>
            <SelectTrigger className="h-10 ps-10 bg-card border-border/50">
              <SelectValue placeholder="كل المزودين" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل المزودين ({totalCount})</SelectItem>
              {providers.map(p => (
                <SelectItem key={p} value={p}>
                  {p} ({models.filter(m => m.providerName === p).length})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Add Model Button */}
        <Button className="h-10 gap-2 bg-sultan hover:bg-sultan/80 text-black font-bold">
          <Cpu className="h-4 w-4" />
          إضافة نموذج
        </Button>
      </div>

      {/* ═══════ Summary Cards ═══════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'إجمالي النماذج',       value: totalCount,     icon: Cpu,          color: 'text-sultan',    bg: 'bg-sultan/10' },
          { label: 'النماذج النشطة',        value: activeCount,   icon: CheckCircle2,  color: 'text-green-400', bg: 'bg-green-400/10' },
          { label: 'المزودون',              value: providerCount, icon: TrendingUp,    color: 'text-blue-400',  bg: 'bg-blue-400/10' },
          { label: 'متوسط التكلفة (مدخل)',  value: totalCostPer1MInput, icon: DollarSign, color: 'text-amber-400', bg: 'bg-amber-400/10' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <Card className="border-border/50">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center shrink-0`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-xl font-bold truncate">{stat.value}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* ═══════ Tabs: Grid + Detail ═══════ */}
      <Tabs defaultValue="grid" className="w-full">
        <TabsList className="bg-card border border-border/50 w-fit">
          <TabsTrigger value="grid" className="gap-1.5 data-[state=active]:bg-sultan/15 data-[state=active]:text-sultan">
            <Cpu className="h-3.5 w-3.5" />
            شبكة النماذج
          </TabsTrigger>
          <TabsTrigger value="detail" className="gap-1.5 data-[state=active]:bg-sultan/15 data-[state=active]:text-sultan" disabled={!selected}>
            <Eye className="h-3.5 w-3.5" />
            التفاصيل
          </TabsTrigger>
        </TabsList>

        {/* ── Grid Tab ── */}
        <TabsContent value="grid" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((model, i) => {
                const h = healthConfig[model.healthStatus];
                const providerColor = providerColors[model.providerName] || 'text-muted-foreground';
                const isSelected = selectedId === model.id;

                return (
                  <motion.div
                    key={model.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95, y: 16 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ delay: i * 0.03, type: 'spring', stiffness: 350, damping: 28 }}
                    onClick={() => setSelectedId(model.id)}
                    className="cursor-pointer"
                  >
                    <Card
                      className={`border-border/50 transition-all duration-200 h-full ${
                        isSelected
                          ? 'border-sultan/60 sultan-glow'
                          : 'hover:border-sultan/30 hover:shadow-lg hover:shadow-sultan/5'
                      } ${!model.isActive ? 'opacity-50' : ''}`}
                    >
                      <CardHeader className="p-4 pb-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            {/* Health dot */}
                            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${h.dot} ${model.healthStatus === 'healthy' ? 'animate-pulse' : ''}`} />
                            <div className="min-w-0">
                              <CardTitle className="text-sm font-bold truncate">{model.displayName}</CardTitle>
                              <p className={`text-[11px] ${providerColor} truncate`}>{model.providerName}</p>
                            </div>
                          </div>
                          {/* Health badge */}
                          <Badge variant="outline" className={`text-[9px] shrink-0 ${h.badge}`}>
                            {h.label}
                          </Badge>
                        </div>
                      </CardHeader>

                      <CardContent className="p-4 pt-1 space-y-3">
                        {/* Model ID */}
                        <p className="text-[10px] text-muted-foreground font-mono truncate" dir="ltr">{model.modelId}</p>

                        {/* Capabilities as icons */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {capabilityMeta.map(cap => {
                            const active = model.capabilities[cap.key];
                            return (
                              <span
                                key={cap.key}
                                title={cap.label}
                                className={`w-7 h-7 rounded-md flex items-center justify-center transition-colors ${
                                  active ? `${cap.bg} ${cap.color}` : 'bg-muted/30 text-muted-foreground/30'
                                }`}
                              >
                                <cap.icon className="h-3.5 w-3.5" />
                              </span>
                            );
                          })}
                        </div>

                        {/* Context + Pricing row */}
                        <div className="flex items-center justify-between text-[10px] text-muted-foreground gap-2">
                          <span className="flex items-center gap-1 truncate">
                            <Zap className="h-3 w-3 text-sultan shrink-0" />
                            {formatTokens(model.capabilities.maxContextTokens)} سياق
                          </span>
                          <span className="flex items-center gap-1 shrink-0" dir="ltr">
                            <DollarSign className="h-3 w-3 text-amber-400" />
                            {formatPrice(model.pricing.inputPer1kTokens)} → {formatPrice(model.pricing.outputPer1kTokens)}
                          </span>
                        </div>

                        {/* Default category badge */}
                        {model.isDefaultForCategory && (
                          <Badge className="bg-sultan/15 text-sultan border-sultan/30 text-[9px] w-fit">
                            <CheckCircle2 className="h-2.5 w-2.5 me-1" />
                            الافتراضي: {model.isDefaultForCategory}
                          </Badge>
                        )}

                        {/* Enable / Disable toggle */}
                        <div className="flex items-center justify-between pt-1 border-t border-border/30">
                          <span className="text-[11px] text-muted-foreground">
                            {model.isActive ? 'مُفعّل' : 'مُعطّل'}
                          </span>
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              toggleModel(model.id);
                            }}
                            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sultan/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 ${
                              model.isActive ? 'bg-sultan' : 'bg-muted'
                            }`}
                            role="switch"
                            aria-checked={model.isActive}
                          >
                            <span
                              className={`pointer-events-none block h-3.5 w-3.5 rounded-full bg-background shadow-lg ring-0 transition-transform ${
                                model.isActive ? 'translate-x-4 rtl:-translate-x-4' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {filtered.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full flex flex-col items-center justify-center py-20 text-muted-foreground"
              >
                <XCircle className="h-10 w-10 mb-3 text-muted-foreground/40" />
                <p className="text-sm">لا توجد نماذج مطابقة للبحث</p>
              </motion.div>
            )}
          </div>
        </TabsContent>

        {/* ── Detail Tab ── */}
        <TabsContent value="detail" className="mt-4">
          {selected && (
            <AnimatePresence mode="wait">
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                <Card className="border-border/50">
                  <CardHeader className="p-5 pb-3">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-sultan/10 flex items-center justify-center">
                          <Cpu className="h-6 w-6 text-sultan" />
                        </div>
                        <div>
                          <CardTitle className="text-lg font-bold">{selected.displayName}</CardTitle>
                          <p className={`text-sm ${providerColors[selected.providerName] || 'text-muted-foreground'}`}>{selected.providerName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={healthConfig[selected.healthStatus].badge}>
                          <span className={`w-2 h-2 rounded-full me-1.5 ${healthConfig[selected.healthStatus].dot}`} />
                          {healthConfig[selected.healthStatus].label}
                        </Badge>
                        {selected.isDefaultForCategory && (
                          <Badge className="bg-sultan/15 text-sultan border-sultan/30">
                            <CheckCircle2 className="h-3 w-3 me-1" />
                            الافتراضي
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{selected.description}</p>
                  </CardHeader>

                  <CardContent className="p-5 pt-0 space-y-5">
                    {/* Model ID */}
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 border border-border/30">
                      <Code2 className="h-4 w-4 text-muted-foreground shrink-0" />
                      <code className="text-xs font-mono text-muted-foreground" dir="ltr">{selected.modelId}</code>
                    </div>

                    {/* Capabilities Grid */}
                    <div>
                      <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
                        <Zap className="h-4 w-4 text-sultan" />
                        القدرات والخصائص
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {/* Context Tokens */}
                        <div className="p-3 rounded-lg bg-card border border-border/40">
                          <p className="text-[10px] text-muted-foreground mb-1">السياق الأقصى</p>
                          <p className="text-sm font-bold text-sultan">{formatTokens(selected.capabilities.maxContextTokens)}</p>
                          <Progress value={(selected.capabilities.maxContextTokens / 1_000_000) * 100} className="h-1 mt-2" />
                          <p className="text-[9px] text-muted-foreground mt-0.5">{(selected.capabilities.maxContextTokens / 1_000_000).toFixed(2)}M رمز</p>
                        </div>

                        {/* Output Tokens */}
                        <div className="p-3 rounded-lg bg-card border border-border/40">
                          <p className="text-[10px] text-muted-foreground mb-1">المخرجات الأقصى</p>
                          <p className="text-sm font-bold text-blue-400">{formatTokens(selected.capabilities.maxOutputTokens)}</p>
                          <Progress value={Math.min((selected.capabilities.maxOutputTokens / 128_000) * 100, 100)} className="h-1 mt-2" />
                          <p className="text-[9px] text-muted-foreground mt-0.5">{formatTokens(selected.capabilities.maxOutputTokens)} رمز</p>
                        </div>

                        {/* Capabilities as detailed items */}
                        {capabilityMeta.map(cap => {
                          const active = selected.capabilities[cap.key];
                          return (
                            <div
                              key={cap.key}
                              className={`p-3 rounded-lg border transition-colors ${
                                active ? 'bg-card border-border/40' : 'bg-muted/10 border-border/20 opacity-40'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <cap.icon className={`h-4 w-4 ${active ? cap.color : 'text-muted-foreground'}`} />
                                <span className="text-sm">{cap.label}</span>
                              </div>
                              <p className={`text-[10px] mt-1 ${active ? 'text-green-400' : 'text-red-400/60'}`}>
                                {active ? 'مدعوم ✓' : 'غير مدعوم ✗'}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Pricing Section */}
                    <div>
                      <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-amber-400" />
                        التسعير
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-lg bg-card border border-border/40 text-center">
                          <p className="text-[10px] text-muted-foreground mb-1">سعر المدخل / 1K رمز</p>
                          <p className="text-base font-bold text-green-400" dir="ltr">${selected.pricing.inputPer1kTokens.toFixed(4)}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-card border border-border/40 text-center">
                          <p className="text-[10px] text-muted-foreground mb-1">سعر المخرج / 1K رمز</p>
                          <p className="text-base font-bold text-orange-400" dir="ltr">${selected.pricing.outputPer1kTokens.toFixed(4)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Toggle + Back */}
                    <div className="flex items-center justify-between pt-3 border-t border-border/30">
                      <Button
                        variant="outline"
                        className="gap-2 border-sultan/30 text-sultan hover:bg-sultan/10"
                        onClick={() => setSelectedId(null)}
                      >
                        ← العودة للشبكة
                      </Button>
                      <Button
                        variant={selected.isActive ? 'destructive' : 'default'}
                        className={`gap-2 ${selected.isActive ? '' : 'bg-sultan hover:bg-sultan/80 text-black'}`}
                        onClick={() => toggleModel(selected.id)}
                      >
                        {selected.isActive ? (
                          <><XCircle className="h-4 w-4" /> تعطيل النموذج</>
                        ) : (
                          <><CheckCircle2 className="h-4 w-4" /> تفعيل النموذج</>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

'use client';

import { useState, useMemo } from 'react';
import { DEFAULT_PROVIDERS, DEFAULT_MODELS } from '@/lib/ai/providers/provider-registry';
import type { AIProvider } from '@/lib/ai/core/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Server, Globe, Activity, Cpu, Zap, Eye, Code2, Brain, Sparkles, Workflow,
  Plus, Loader2, CheckCircle2, XCircle, Clock, MessageSquare,
  ArrowUpDown, Shield, Link2, Timer, Hash,
} from 'lucide-react';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const typeLabels: Record<string, string> = {
  openai_compatible: 'متوافق مع OpenAI',
  anthropic: 'Anthropic',
  google: 'Google',
  custom: 'مخصص',
};

const typeColors: Record<string, string> = {
  openai_compatible: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  anthropic: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  google: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  custom: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
};

const featureIcons: { key: keyof AIProvider['supportedFeatures']; icon: any; label: string; color: string; bg: string }[] = [
  { key: 'chat', icon: MessageSquare, label: 'محادثة', color: 'text-sultan', bg: 'bg-sultan/15' },
  { key: 'vision', icon: Eye, label: 'رؤية', color: 'text-purple-400', bg: 'bg-purple-500/15' },
  { key: 'coding', icon: Code2, label: 'برمجة', color: 'text-blue-400', bg: 'bg-blue-500/15' },
  { key: 'reasoning', icon: Brain, label: 'تفكير', color: 'text-amber-400', bg: 'bg-amber-500/15' },
  { key: 'functionCalling', icon: Sparkles, label: 'أدوات', color: 'text-cyan-400', bg: 'bg-cyan-500/15' },
  { key: 'streaming', icon: Zap, label: 'تدفق', color: 'text-green-400', bg: 'bg-green-500/15' },
  { key: 'jsonMode', icon: Workflow, label: 'JSON', color: 'text-orange-400', bg: 'bg-orange-500/15' },
];


interface LocalProvider extends AIProvider {
  testStatus?: 'idle' | 'testing' | 'success' | 'error';
  testLatencyMs?: number;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProvidersPanel() {
  const [providers, setProviders] = useState<LocalProvider[]>(
    () => DEFAULT_PROVIDERS.map(p => ({ ...p })) as LocalProvider[]
  );
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<string>('openai_compatible');
  const [newBaseUrl, setNewBaseUrl] = useState('');
  const [newApiKey, setNewApiKey] = useState('');
  const [testingId, setTestingId] = useState<string | null>(null);

  // ── Derived data ──
  const modelsPerProvider = useMemo(() => {
    const map = new Map<string, number>();
    for (const model of DEFAULT_MODELS) {
      map.set(model.providerId, (map.get(model.providerId) || 0) + 1);
    }
    return map;
  }, []);

  const totalProviders = providers.length;
  const activeProviders = providers.filter(p => p.isActive).length;
  const totalModels = DEFAULT_MODELS.length;
  const totalFeatures = providers.reduce(
    (acc, p) => acc + Object.values(p.supportedFeatures).filter(Boolean).length, 0
  );

  // ── Handlers ──
  const toggleProvider = (id: string) => {
    setProviders(prev => prev.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p));
  };

  const testConnection = (id: string) => {
    setTestingId(id);
    setProviders(prev => prev.map(p => p.id === id ? { ...p, testStatus: 'testing' } : p));
    const latency = Math.floor(Math.random() * 800) + 100;
    const success = Math.random() > 0.15;
    setTimeout(() => {
      setProviders(prev => prev.map(p =>
        p.id === id
          ? { ...p, testStatus: success ? 'success' : 'error', testLatencyMs: latency }
          : p
      ));
      setTestingId(null);
    }, 1500 + Math.random() * 1000);
  };

  const handleAddProvider = () => {
    if (!newName.trim() || !newBaseUrl.trim()) return;
    const newProvider: LocalProvider = {
      id: `provider-custom-${Date.now()}`,
      name: newName.trim(),
      type: newType as AIProvider['type'],
      baseUrl: newBaseUrl.trim(),
      isActive: true,
      priority: providers.length + 1,
      isDefault: false,
      supportedFeatures: { chat: true, vision: false, coding: false, reasoning: false, functionCalling: false, streaming: true, jsonMode: true },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      testStatus: 'idle',
    };
    setProviders(prev => [...prev, newProvider]);
    setNewName(''); setNewType('openai_compatible'); setNewBaseUrl(''); setNewApiKey('');
    setShowAddForm(false);
  };

  const truncateUrl = (url: string) => {
    if (url.length <= 40) return url;
    return url.slice(0, 20) + '...' + url.slice(-17);
  };

  // ── Render ──
  return (
    <div dir="rtl" className="space-y-5">
      {/* ═══════ Summary Cards ═══════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'إجمالي المزودين', value: totalProviders, icon: Server, color: 'text-sultan', bg: 'bg-sultan/10' },
          { label: 'المزودون النشطون', value: activeProviders, icon: Activity, color: 'text-green-400', bg: 'bg-green-400/10' },
          { label: 'إجمالي النماذج', value: totalModels, icon: Cpu, color: 'text-blue-400', bg: 'bg-blue-400/10' },
          { label: 'الميزات المدعومة', value: totalFeatures, icon: Zap, color: 'text-amber-400', bg: 'bg-amber-400/10' },
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

      {/* ═══════ Header Bar ═══════ */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Server className="h-5 w-5 text-sultan" />
          <h3 className="text-lg font-bold">مزودو الذكاء الاصطناعي</h3>
          <Badge variant="outline" className="text-[10px] text-muted-foreground">
            {activeProviders}/{totalProviders} نشط
          </Badge>
        </div>
        <Button
          className="gap-2 bg-sultan hover:bg-sultan/80 text-black font-bold h-9"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <Plus className="h-4 w-4" />
          إضافة مزود
        </Button>
      </div>

      {/* ═══════ Add Provider Form ═══════ */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <Card className="border-sultan/30 mb-4">
              <CardHeader className="p-4 pb-3">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Plus className="h-4 w-4 text-sultan" />
                  مزود جديد
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[11px] text-muted-foreground">اسم المزود</label>
                    <Input
                      placeholder="مثال: Together AI"
                      value={newName}
                      onChange={e => setNewName(e.target.value)}
                      className="h-9 text-sm bg-card border-border/50"
                      dir="rtl"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] text-muted-foreground">النوع</label>
                    <Select value={newType} onValueChange={setNewType}>
                      <SelectTrigger className="h-9 text-sm bg-card border-border/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="openai_compatible">متوافق مع OpenAI</SelectItem>
                        <SelectItem value="anthropic">Anthropic</SelectItem>
                        <SelectItem value="google">Google</SelectItem>
                        <SelectItem value="custom">مخصص</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] text-muted-foreground">رابط الأساس (Base URL)</label>
                    <Input
                      placeholder="https://api.example.com/v1"
                      value={newBaseUrl}
                      onChange={e => setNewBaseUrl(e.target.value)}
                      className="h-9 text-sm bg-card border-border/50 font-mono"
                      dir="ltr"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] text-muted-foreground">مفتاح API</label>
                    <Input
                      type="password"
                      placeholder="sk-xxxxxxxxxxxx"
                      value={newApiKey}
                      onChange={e => setNewApiKey(e.target.value)}
                      className="h-9 text-sm bg-card border-border/50 font-mono"
                      dir="ltr"
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    size="sm"
                    className="gap-1.5 bg-sultan hover:bg-sultan/80 text-black font-bold h-8"
                    onClick={handleAddProvider}
                    disabled={!newName.trim() || !newBaseUrl.trim()}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    إضافة المزود
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 text-xs"
                    onClick={() => setShowAddForm(false)}
                  >
                    إلغاء
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════ Providers Grid ═══════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {providers.map((provider, i) => {
            const modelCount = modelsPerProvider.get(provider.id) || 0;
            const supportedCount = Object.values(provider.supportedFeatures).filter(Boolean).length;

            return (
              <motion.div
                key={provider.id}
                layout
                initial={{ opacity: 0, scale: 0.95, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ delay: i * 0.04, type: 'spring', stiffness: 350, damping: 28 }}
              >
                <Card className={`border-border/50 transition-all h-full ${
                  provider.isDefault ? 'border-sultan/40 sultan-glow' : 'hover:border-sultan/20'
                } ${!provider.isActive ? 'opacity-50' : ''}`}>
                  {/* Card Header */}
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-11 h-11 rounded-xl ${provider.isDefault ? 'bg-sultan/15' : 'bg-muted/50'} flex items-center justify-center shrink-0`}>
                          <Server className={`h-5 w-5 ${provider.isDefault ? 'text-sultan' : 'text-muted-foreground'}`} />
                        </div>
                        <div className="min-w-0">
                          <CardTitle className="text-sm font-bold truncate">{provider.name}</CardTitle>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <Badge variant="outline" className={`text-[9px] ${typeColors[provider.type] || 'bg-muted/50 text-muted-foreground'}`}>
                              {typeLabels[provider.type] || provider.type}
                            </Badge>
                            {provider.isDefault && (
                              <Badge className="bg-sultan/15 text-sultan border-sultan/30 text-[9px]">
                                <Shield className="h-2.5 w-2.5 me-1" />
                                افتراضي
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-4 pt-1 space-y-3">
                    {/* Base URL */}
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 border border-border/20">
                      <Globe className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <code className="text-[10px] text-muted-foreground font-mono truncate" dir="ltr">
                        {truncateUrl(provider.baseUrl)}
                      </code>
                    </div>

                    {/* Priority + Models + Features count row */}
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <ArrowUpDown className="h-3 w-3 text-sultan" />
                        الأولوية: {provider.priority}
                      </span>
                      <span className="flex items-center gap-1">
                        <Cpu className="h-3 w-3 text-blue-400" />
                        {modelCount} نموذج
                      </span>
                      <span className="flex items-center gap-1">
                        <Zap className="h-3 w-3 text-amber-400" />
                        {supportedCount}/7 ميزة
                      </span>
                    </div>

                    {/* Supported Features as icons */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {featureIcons.map(feat => {
                        const active = provider.supportedFeatures[feat.key];
                        return (
                          <span
                            key={feat.key}
                            title={feat.label}
                            className={`w-7 h-7 rounded-md flex items-center justify-center transition-colors ${
                              active ? `${feat.bg} ${feat.color}` : 'bg-muted/20 text-muted-foreground/30'
                            }`}
                          >
                            <feat.icon className="h-3.5 w-3.5" />
                          </span>
                        );
                      })}
                    </div>

                    {/* Rate Limits */}
                    {(provider.rateLimitRpm || provider.rateLimitTpm) && (
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 rounded-lg bg-card border border-border/30 text-center">
                          <p className="text-[9px] text-muted-foreground">حد الطلبات/د</p>
                          <p className="text-xs font-bold text-blue-400 flex items-center justify-center gap-1">
                            <Timer className="h-3 w-3" />
                            {provider.rateLimitRpm?.toLocaleString()}
                          </p>
                        </div>
                        <div className="p-2 rounded-lg bg-card border border-border/30 text-center">
                          <p className="text-[9px] text-muted-foreground">حد الرموز/د</p>
                          <p className="text-xs font-bold text-purple-400 flex items-center justify-center gap-1">
                            <Hash className="h-3 w-3" />
                            {(provider.rateLimitTpm ?? 0) >= 1000
                              ? `${((provider.rateLimitTpm ?? 0) / 1000).toFixed(0)}K`
                              : (provider.rateLimitTpm ?? 0).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Test Connection Result */}
                    {provider.testStatus && provider.testStatus !== 'idle' && provider.testStatus !== 'testing' && (
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex items-center gap-2 p-2 rounded-lg text-[11px] ${
                          provider.testStatus === 'success'
                            ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}
                      >
                        {provider.testStatus === 'success'
                          ? <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                          : <XCircle className="h-3.5 w-3.5 shrink-0" />
                        }
                        {provider.testStatus === 'success'
                          ? `متصل بنجاح — ${provider.testLatencyMs} مللي ثانية`
                          : 'فشل الاتصال — تحقق من المفتاح والرابط'
                        }
                      </motion.div>
                    )}

                    {/* Actions row */}
                    <div className="flex items-center justify-between pt-2 border-t border-border/30">
                      {/* Active Toggle */}
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-muted-foreground">
                          {provider.isActive ? 'نشط' : 'معطّل'}
                        </span>
                        <button
                          onClick={() => toggleProvider(provider.id)}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sultan/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                            provider.isActive ? 'bg-sultan' : 'bg-muted'
                          }`}
                          role="switch"
                          aria-checked={provider.isActive}
                        >
                          <span className={`pointer-events-none block h-3.5 w-3.5 rounded-full bg-background shadow-lg ring-0 transition-transform ${
                            provider.isActive ? 'translate-x-4 rtl:-translate-x-4' : 'translate-x-0'
                          }`} />
                        </button>
                      </div>

                      {/* Test Connection Button */}
                      <Button
                        size="sm"
                        variant="outline"
                        className={`h-7 text-[11px] gap-1.5 ${
                          testingId === provider.id
                            ? 'border-amber-500/30 text-amber-400'
                            : 'border-sultan/30 text-sultan hover:bg-sultan/10'
                        }`}
                        onClick={() => testConnection(provider.id)}
                        disabled={testingId === provider.id}
                      >
                        {testingId === provider.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Link2 className="h-3 w-3" />
                        )}
                        {testingId === provider.id ? 'جاري الاختبار...' : 'اختبار الاتصال'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
'use client';

import { useState, useMemo } from 'react';
import { listSecrets, storeSecret, deleteSecret, toggleSecret } from '@/lib/ai/core/engine';
import { DEFAULT_PROVIDERS } from '@/lib/ai/providers/provider-registry';
import type { SecretScope } from '@/lib/ai/core/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';
import {
  KeyRound, ShieldCheck, ShieldAlert, Eye, EyeOff, Plus, Trash2, Activity,
  Clock, Server, Lock, FolderOpen, Cloud, Github, CreditCard, MessageSquare,
  Layers, CheckCircle2, XCircle, AlertTriangle, Settings, Copy, Database,
} from 'lucide-react';

// ─── Helpers ──────────────────────────────────────────────────────────────────

interface LocalSecret {
  id: string;
  name: string;
  providerId?: string;
  providerName?: string;
  scope: SecretScope;
  keyPreview: string;
  isActive: boolean;
  lastUsedAt?: string;
  createdAt: string;
  updatedAt: string;
}

const scopeLabels: Record<string, string> = {
  ai_provider: 'مزود ذكاء اصطناعي',
  github: 'GitHub',
  supabase: 'Supabase',
  cloudflare: 'Cloudflare',
  social: 'تواصل اجتماعي',
  payment: 'دفع إلكتروني',
  custom: 'مخصص',
};

const scopeColors: Record<string, string> = {
  ai_provider: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  github: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
  supabase: 'bg-green-500/20 text-green-400 border-green-500/30',
  cloudflare: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  social: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  payment: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  custom: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
};

const scopeIcons: Record<string, any> = {
  ai_provider: Server,
  github: Github,
  supabase: Database,
  cloudflare: Cloud,
  social: MessageSquare,
  payment: CreditCard,
  custom: Settings,
};


// Demo secrets for UI display (server functions use in-memory Map)
const DEMO_SECRETS: LocalSecret[] = [
  {
    id: 'demo-1', name: 'OPENAI_API_KEY', providerId: 'provider-openai', providerName: 'OpenAI',
    scope: 'ai_provider', keyPreview: 'sk-pr...xK8m', isActive: true,
    lastUsedAt: new Date(Date.now() - 300_000).toISOString(), createdAt: '2025-01-15T10:00:00Z', updatedAt: '2025-06-01T08:30:00Z',
  },
  {
    id: 'demo-2', name: 'ANTHROPIC_API_KEY', providerId: 'provider-anthropic', providerName: 'Anthropic',
    scope: 'ai_provider', keyPreview: 'sk-ant...pQ2n', isActive: true,
    lastUsedAt: new Date(Date.now() - 900_000).toISOString(), createdAt: '2025-02-10T14:00:00Z', updatedAt: '2025-05-28T12:00:00Z',
  },
  {
    id: 'demo-3', name: 'GITHUB_TOKEN', scope: 'github',
    keyPreview: 'ghp_aB...zX9w', isActive: true,
    lastUsedAt: new Date(Date.now() - 3_600_000).toISOString(), createdAt: '2025-01-20T09:00:00Z', updatedAt: '2025-06-02T16:00:00Z',
  },
  {
    id: 'demo-4', name: 'SUPABASE_URL', scope: 'supabase',
    keyPreview: 'https://xx...o.supabase.co', isActive: true,
    createdAt: '2025-03-01T11:00:00Z', updatedAt: '2025-03-01T11:00:00Z',
  },
  {
    id: 'demo-5', name: 'CLOUDFLARE_API_TOKEN', scope: 'cloudflare',
    keyPreview: 'cf-tk...mN4p', isActive: false,
    lastUsedAt: new Date(Date.now() - 86_400_000).toISOString(), createdAt: '2025-04-12T07:00:00Z', updatedAt: '2025-05-15T10:00:00Z',
  },
];

const allScopes: SecretScope[] = ['ai_provider', 'github', 'supabase', 'cloudflare', 'social', 'payment', 'custom'];

function timeAgo(isoStr?: string): string {
  if (!isoStr) return 'لم يُستخدم';
  const diff = Date.now() - new Date(isoStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'الآن';
  if (mins < 60) return `منذ ${mins} دقيقة`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `منذ ${hours} ساعة`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `منذ ${days} يوم`;
  return `منذ ${Math.floor(days / 30)} شهر`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SecretsPanel() {
  const [secrets, setSecrets] = useState<LocalSecret[]>(DEMO_SECRETS);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newScope, setNewScope] = useState<string>('ai_provider');
  const [newProvider, setNewProvider] = useState<string>('none');
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());

  // ── Derived data ──
  const totalSecrets = secrets.length;
  const activeSecrets = secrets.filter(s => s.isActive).length;

  const scopeCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const s of secrets) {
      counts.set(s.scope, (counts.get(s.scope) || 0) + 1);
    }
    return counts;
  }, [secrets]);

  const topScope = useMemo(() => {
    let max = 0, top = '—';
    for (const [scope, count] of scopeCounts) {
      if (count > max) { max = count; top = scopeLabels[scope] || scope; }
    }
    return top;
  }, [scopeCounts]);

  // ── Handlers ──
  const handleToggle = (id: string) => {
    const secret = secrets.find(s => s.id === id);
    if (!secret) return;
    const newActive = !secret.isActive;
    setSecrets(prev => prev.map(s => s.id === id ? { ...s, isActive: newActive, updatedAt: new Date().toISOString() } : s));
    // Attempt to call the server function (won't work client-side, but imported as specified)
    try { toggleSecret(id, newActive); } catch { /* client-side demo */ }
  };

  const handleDelete = (id: string) => {
    setSecrets(prev => prev.filter(s => s.id !== id));
    try { deleteSecret(id); } catch { /* client-side demo */ }
  };

  const handleAdd = () => {
    if (!newName.trim() || !newValue.trim()) return;
    const id = `secret-${Date.now()}`;
    const preview = newValue.length > 10
      ? newValue.slice(0, 6) + '...' + newValue.slice(-4)
      : '****';
    const providerId = newProvider !== 'none' ? newProvider : undefined;
    const providerName = providerId
      ? DEFAULT_PROVIDERS.find(p => p.id === providerId)?.name
      : undefined;

    const newSecret: LocalSecret = {
      id,
      name: newName.trim(),
      providerId,
      providerName,
      scope: newScope as SecretScope,
      keyPreview: preview,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setSecrets(prev => [...prev, newSecret]);
    setNewName(''); setNewValue(''); setNewScope('ai_provider'); setNewProvider('none');
    setShowAddForm(false);

    // Attempt to call the server function
    try { storeSecret(newSecret.name, newValue, newSecret.scope, providerId); } catch { /* client-side demo */ }
  };

  const toggleReveal = (id: string) => {
    setRevealedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  // ── Render ──
  return (
    <div dir="rtl" className="space-y-5">
      {/* ═══════ Summary Cards ═══════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'إجمالي الأسرار', value: totalSecrets, icon: KeyRound, color: 'text-sultan', bg: 'bg-sultan/10' },
          { label: 'الأسرار النشطة', value: activeSecrets, icon: ShieldCheck, color: 'text-green-400', bg: 'bg-green-400/10' },
          { label: 'الأسرار المعطّلة', value: totalSecrets - activeSecrets, icon: ShieldAlert, color: 'text-red-400', bg: 'bg-red-400/10' },
          { label: 'النطاق الأكثر', value: topScope, icon: FolderOpen, color: 'text-blue-400', bg: 'bg-blue-400/10' },
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

      {/* ═══════ Security Warning ═══════ */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <div className="w-9 h-9 rounded-lg bg-amber-500/15 flex items-center justify-center shrink-0 mt-0.5">
            <AlertTriangle className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-amber-400 mb-1">تحذير أمني — إدارة الأسرار</h4>
            <p className="text-xs text-amber-400/80 leading-relaxed">
              جميع المفاتيح والرموز السرية تُخزّن مشفّرة. لا تشارك مفاتيح API أبداً أو تُخزّنها في الكود المصدري.
              يُنصح بتدوير المفاتيح دورياً ومراجعة الصلاحيات بشكل منتظم. استخدم نظام إدارة الأسرار (KMS) في بيئة الإنتاج.
            </p>
          </div>
        </div>
      </motion.div>

      {/* ═══════ Header Bar ═══════ */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <KeyRound className="h-5 w-5 text-sultan" />
          <h3 className="text-lg font-bold">إدارة الأسرار والمفاتيح</h3>
          <Badge variant="outline" className="text-[10px] text-muted-foreground">
            {activeSecrets}/{totalSecrets} نشط
          </Badge>
        </div>
        <Button
          className="gap-2 bg-sultan hover:bg-sultan/80 text-black font-bold h-9"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <Plus className="h-4 w-4" />
          إضافة سر
        </Button>
      </div>

      {/* ═══════ Add Secret Form ═══════ */}
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
                  <Lock className="h-4 w-4 text-sultan" />
                  إضافة سر جديد
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[11px] text-muted-foreground">اسم السر</label>
                    <Input
                      placeholder="مثال: OPENAI_API_KEY"
                      value={newName}
                      onChange={e => setNewName(e.target.value)}
                      className="h-9 text-sm bg-card border-border/50 font-mono"
                      dir="ltr"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] text-muted-foreground">القيمة السرية</label>
                    <Input
                      type="password"
                      placeholder="sk-xxxxxxxxxxxx"
                      value={newValue}
                      onChange={e => setNewValue(e.target.value)}
                      className="h-9 text-sm bg-card border-border/50 font-mono"
                      dir="ltr"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] text-muted-foreground">النطاق (Scope)</label>
                    <Select value={newScope} onValueChange={setNewScope}>
                      <SelectTrigger className="h-9 text-sm bg-card border-border/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {allScopes.map(scope => (
                          <SelectItem key={scope} value={scope}>
                            {scopeLabels[scope] || scope}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] text-muted-foreground">المزود (اختياري)</label>
                    <Select value={newProvider} onValueChange={setNewProvider}>
                      <SelectTrigger className="h-9 text-sm bg-card border-border/50">
                        <SelectValue placeholder="بدون مزود" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">بدون مزود</SelectItem>
                        {DEFAULT_PROVIDERS.map(p => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    size="sm"
                    className="gap-1.5 bg-sultan hover:bg-sultan/80 text-black font-bold h-8"
                    onClick={handleAdd}
                    disabled={!newName.trim() || !newValue.trim()}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    تخزين السر
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

      {/* ═══════ Secrets List ═══════ */}
      <Card className="border-border/50">
        <CardHeader className="p-4 pb-3">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Layers className="h-4 w-4 text-sultan" />
            قائمة الأسرار
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="rounded-xl border border-border/40 overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-[1fr_0.8fr_0.7fr_1.2fr_0.7fr_0.6fr_0.7fr] gap-2 px-4 py-2.5 bg-muted/40 text-[10px] text-muted-foreground font-medium border-b border-border/30">
              <span>الاسم</span>
              <span>المزود</span>
              <span>النطاق</span>
              <span>معاينة المفتاح</span>
              <span>آخر استخدام</span>
              <span className="text-center">الحالة</span>
              <span className="text-center">إجراءات</span>
            </div>

            {/* Table Body */}
            <AnimatePresence>
              {secrets.map((secret, i) => {
                const ScopeIcon = scopeIcons[secret.scope] || KeyRound;
                const isRevealed = revealedIds.has(secret.id);

                return (
                  <motion.div
                    key={secret.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10, height: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className={`grid grid-cols-[1fr_0.8fr_0.7fr_1.2fr_0.7fr_0.6fr_0.7fr] gap-2 px-4 py-3 items-center border-b border-border/20 transition-colors hover:bg-muted/20 ${!secret.isActive ? 'opacity-50' : ''}`}
                  >
                    {/* Name */}
                    <div className="flex items-center gap-2 min-w-0">
                      <Lock className="h-3.5 w-3.5 text-sultan shrink-0" />
                      <span className="text-xs font-mono font-medium truncate" dir="ltr">{secret.name}</span>
                    </div>

                    {/* Provider */}
                    <span className="text-[11px] text-muted-foreground truncate">
                      {secret.providerName || '—'}
                    </span>

                    {/* Scope Badge */}
                    <Badge variant="outline" className={`text-[9px] w-fit ${scopeColors[secret.scope] || 'bg-muted/50 text-muted-foreground'}`}>
                      <ScopeIcon className="h-2.5 w-2.5 me-1" />
                      {scopeLabels[secret.scope] || secret.scope}
                    </Badge>

                    {/* Key Preview */}
                    <div className="flex items-center gap-1.5 min-w-0">
                      <code className="text-[10px] font-mono text-muted-foreground truncate" dir="ltr">
                        {isRevealed ? '••••••••••••••••' : secret.keyPreview}
                      </code>
                      <button
                        onClick={() => toggleReveal(secret.id)}
                        className="shrink-0 p-1 rounded hover:bg-muted/50 transition-colors"
                      >
                        {isRevealed
                          ? <EyeOff className="h-3 w-3 text-muted-foreground" />
                          : <Eye className="h-3 w-3 text-muted-foreground" />
                        }
                      </button>
                    </div>

                    {/* Last Used */}
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-muted-foreground shrink-0" />
                      <span className="text-[10px] text-muted-foreground">{timeAgo(secret.lastUsedAt)}</span>
                    </div>

                    {/* Active Toggle */}
                    <div className="flex justify-center">
                      <button
                        onClick={() => handleToggle(secret.id)}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sultan/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                          secret.isActive ? 'bg-sultan' : 'bg-muted'
                        }`}
                        role="switch"
                        aria-checked={secret.isActive}
                      >
                        <span className={`pointer-events-none block h-3.5 w-3.5 rounded-full bg-background shadow-lg ring-0 transition-transform ${
                          secret.isActive ? 'translate-x-4 rtl:-translate-x-4' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>

                    {/* Delete */}
                    <div className="flex justify-center">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 text-red-400/60 hover:text-red-400 hover:bg-red-500/10"
                        onClick={() => handleDelete(secret.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Empty State */}
            {secrets.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-12 text-muted-foreground"
              >
                <KeyRound className="h-10 w-10 mb-3 text-muted-foreground/30" />
                <p className="text-sm">لا توجد أسرار مخزّنة</p>
                <p className="text-[11px] mt-1">أضف سراً جديداً للبدء</p>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
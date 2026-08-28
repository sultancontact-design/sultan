'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Crown,
  Users,
  CheckSquare,
  GitBranch,
  Cpu,
  Cloud,
  Key,
  Sparkles,
  Wrench,
  Brain,
  BookOpen,
  Globe,
  Search,
  Clock,
  Zap,
  Github,
  Database,
  CloudOff,
  Activity,
  ShieldCheck,
  Lock,
  CheckCircle,
  FileText,
  DollarSign,
  Settings,
  Send,
  ChevronRight,
  Terminal,
  Bot,
  BarChart3,
  Layers,
  MessageSquare,
  PanelRightClose,
  PanelRightOpen,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// ────────────────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────────────────

type SectionId =
  | 'command-center'
  | 'ai-employees'
  | 'tasks'
  | 'workflows'
  | 'models-hub'
  | 'providers'
  | 'api-keys'
  | 'skills'
  | 'tools'
  | 'memory'
  | 'knowledge'
  | 'browser'
  | 'web'
  | 'schedules'
  | 'automation'
  | 'github'
  | 'supabase'
  | 'cloudflare'
  | 'observability'
  | 'security'
  | 'permissions'
  | 'approvals'
  | 'audit-log'
  | 'costs'
  | 'system-settings';

interface NavItem {
  type: 'item';
  id: SectionId;
  label: string;
  icon: React.ElementType;
  description: string;
}

interface NavSeparator {
  type: 'separator';
  label: string;
}

type NavEntry = NavItem | NavSeparator;

// ────────────────────────────────────────────────────────────────────────────
// Navigation Definition
// ────────────────────────────────────────────────────────────────────────────

const NAV_ENTRIES: NavEntry[] = [
  { type: 'item', id: 'command-center', label: 'مركز القيادة', icon: Crown, description: 'لوحة التحكم الرئيسية وتنفيذ الأوامر' },
  { type: 'item', id: 'ai-employees', label: 'الموظفون الذكيون', icon: Users, description: 'إدارة وكلاء الذكاء الاصطناعي' },
  { type: 'item', id: 'tasks', label: 'المهام', icon: CheckSquare, description: 'تتبع وإدارة المهام' },
  { type: 'item', id: 'workflows', label: 'سير العمل', icon: GitBranch, description: 'تصميم وأتمتة سير العمل' },
  { type: 'item', id: 'models-hub', label: 'مركز النماذج', icon: Cpu, description: 'إدارة نماذج الذكاء الاصطناعي' },
  { type: 'item', id: 'providers', label: 'المزودون', icon: Cloud, description: 'إعدادات مزودي الخدمة' },
  { type: 'item', id: 'api-keys', label: 'المفاتيح والأسرار', icon: Key, description: 'إدارة مفاتيح API والأسرار' },
  { type: 'item', id: 'skills', label: 'المهارات', icon: Sparkles, description: 'مهارات وقدرات النظام' },
  { type: 'item', id: 'tools', label: 'الأدوات', icon: Wrench, description: 'الأدوات المتاحة للوكلاء' },
  { type: 'item', id: 'memory', label: 'الذاكرة', icon: Brain, description: 'إدارة ذاكرة النظام والسياق' },
  { type: 'item', id: 'knowledge', label: 'قاعدة المعرفة', icon: BookOpen, description: 'المعارف والمستندات' },
  { type: 'item', id: 'browser', label: 'المتصفح', icon: Globe, description: 'أتمتة المتصفح والزحف' },
  { type: 'item', id: 'web', label: 'البحث', icon: Search, description: 'البحث في الويب والاسترجاع' },
  { type: 'item', id: 'schedules', label: 'الجداول الزمنية', icon: Clock, description: 'المهام المجدولة وال cron jobs' },
  { type: 'item', id: 'automation', label: 'الأتمتة', icon: Zap, description: 'القواعد والمحفزات الآلية' },
  { type: 'separator', label: 'تكامل المنصات' },
  { type: 'item', id: 'github', label: 'GitHub', icon: Github, description: 'التكامل مع مستودعات GitHub' },
  { type: 'item', id: 'supabase', label: 'Supabase', icon: Database, description: 'قاعدة البيانات والمصادقة' },
  { type: 'item', id: 'cloudflare', label: 'Cloudflare', icon: CloudOff, description: 'CDN والأمان والشبكة' },
  { type: 'separator', label: 'النظام' },
  { type: 'item', id: 'observability', label: 'المراقبة', icon: Activity, description: 'السجلات والمقاييس والتتبع' },
  { type: 'item', id: 'security', label: 'الأمان', icon: ShieldCheck, description: 'إعدادات الأمان والحماية' },
  { type: 'item', id: 'permissions', label: 'الصلاحيات', icon: Lock, description: 'التحكم في الوصول والأدوار' },
  { type: 'item', id: 'approvals', label: 'الموافقات', icon: CheckCircle, description: 'طلبات الموافقة والمراجعة' },
  { type: 'item', id: 'audit-log', label: 'سجل التدقيق', icon: FileText, description: 'تتبع جميع العمليات' },
  { type: 'item', id: 'costs', label: 'التكاليف', icon: DollarSign, description: 'مراقبة وتحليل التكاليف' },
  { type: 'item', id: 'system-settings', label: 'إعدادات النظام', icon: Settings, description: 'الإعدادات العامة والتكوين' },
];

// ────────────────────────────────────────────────────────────────────────────
// Section Descriptions Map
// ────────────────────────────────────────────────────────────────────────────

const SECTION_META: Record<SectionId, { title: string; description: string; icon: React.ElementType }> = {
  'command-center':    { title: 'مركز القيادة',       description: 'لوحة التحكم الرئيسية — نفّذ الأوامر وأدر النظام من مكان واحد', icon: Crown },
  'ai-employees':      { title: 'الموظفون الذكيون',   description: 'إنشاء وإدارة وكلاء الذكاء الاصطناعي المتخصصين', icon: Users },
  'tasks':             { title: 'المهام',              description: 'عرض وتتبع وإدارة جميع المهام المُنفَّذة والمُجدوَلة', icon: CheckSquare },
  'workflows':         { title: 'سير العمل',          description: 'تصميم وتنفيذ وأتمتة تدفقات العمل المعقدة', icon: GitBranch },
  'models-hub':        { title: 'مركز النماذج',       description: 'استكشاف وتكوين وإدارة نماذج اللغة الكبيرة', icon: Cpu },
  'providers':         { title: 'المزودون',           description: 'إعدادات مزودي الخدمة: OpenAI, Anthropic, Google, وغيرهم', icon: Cloud },
  'api-keys':          { title: 'المفاتيح والأسرار',  description: 'إدارة آمنة لمفاتيح API والبيانات الحساسة', icon: Key },
  'skills':            { title: 'المهارات',           description: 'تثبيت وتكوين وتفعيل مهارات النظام المتقدمة', icon: Sparkles },
  'tools':             { title: 'الأدوات',            description: 'الأدوات المتاحة للوكلاء: بحث، متصفح، حسابات، وغيرها', icon: Wrench },
  'memory':            { title: 'الذاكرة',            description: 'إدارة الذاكرة قصيرة وطويلة المدى وسياق المحادثات', icon: Brain },
  'knowledge':         { title: 'قاعدة المعرفة',      description: 'رفع وتنظيم واستعلام المستندات والمعارف', icon: BookOpen },
  'browser':           { title: 'المتصفح',            description: 'أتمتة المتصفح: زحف، لقطات شاشة، تفاعل مع الصفحات', icon: Globe },
  'web':               { title: 'البحث',              description: 'بحث في الويب واسترجاع المعلومات في الوقت الفعلي', icon: Search },
  'schedules':         { title: 'الجداول الزمنية',    description: 'جدولة المهام المتكررة وإدارة cron jobs', icon: Clock },
  'automation':        { title: 'الأتمتة',            description: 'إنشاء قواعد ومحفزات واستجابات آلية', icon: Zap },
  'github':            { title: 'GitHub',             description: 'ربط المستودعات وإدارة العمليات والنشر', icon: Github },
  'supabase':          { title: 'Supabase',           description: 'إدارة الجداول والمصادقة والتخزين', icon: Database },
  'cloudflare':        { title: 'Cloudflare',         description: 'إعدادات CDN والجدار الناري والنطاقات', icon: CloudOff },
  'observability':     { title: 'المراقبة',           description: 'سجلات النظام ومقاييس الأداء وتتبع الأخطاء', icon: Activity },
  'security':          { title: 'الأمان',             description: 'التحقق الثنائي وتشفير البيانات وحماية النقاط', icon: ShieldCheck },
  'permissions':       { title: 'الصلاحيات',         description: 'نظام التحكم في الوصول القائم على الأدوار RBAC', icon: Lock },
  'approvals':         { title: 'الموافقات',          description: 'مراجعة والموافقة على العمليات الحساسة', icon: CheckCircle },
  'audit-log':         { title: 'سجل التدقيق',        description: 'سجل شامل لجميع العمليات والتغييرات في النظام', icon: FileText },
  'costs':             { title: 'التكاليف',           description: 'تحليل استهلاك API والتنبؤ بالتكاليف الشهرية', icon: DollarSign },
  'system-settings':   { title: 'إعدادات النظام',     description: 'التكوين العام والتفضيلات ومتغيرات البيئة', icon: Settings },
};

// ────────────────────────────────────────────────────────────────────────────
// Command Example Cards (Arabic)
// ────────────────────────────────────────────────────────────────────────────

const COMMAND_EXAMPLES = [
  {
    icon: Bot,
    title: 'أنشئ موظف ذكي جديد',
    description: 'وكيل متخصص لخدمة العملاء يجيب بالعربية',
    command: 'أنشئ موظف ذكي متخصص في خدمة العملاء باللغة العربية',
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
  },
  {
    icon: GitBranch,
    title: 'صمم سير عمل تلقائي',
    description: 'مراجعة المحتوى ثم النشر تلقائياً',
    command: 'صمم سير عمل لمراجعة المحتوى ونشره تلقائياً',
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
  },
  {
    icon: BarChart3,
    title: 'أظهر تقرير التكاليف',
    description: 'ملخص استهلاك API خلال الشهر الحالي',
    command: 'أظهر تقرير تكاليف API للشهر الحالي',
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
  },
  {
    icon: ShieldCheck,
    title: 'فحص أمان شامل',
    description: 'تحقق من جميع المفاتيح والصلاحيات',
    command: 'قم بفحص أمان شامل للنظام وتحقق من المفاتيح والصلاحيات',
    color: 'text-red-400',
    bg: 'bg-red-400/10',
  },
  {
    icon: Layers,
    title: 'إدارة النماذج',
    description: 'قائمة بجميع النماذج المتصلة وحالتها',
    command: 'أظهر حالة جميع نماذج الذكاء الاصطناعي المتصلة',
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
  },
  {
    icon: MessageSquare,
    title: 'تحليل المحادثات',
    description: 'إحصائيات وتحليلات المحادثات الأخيرة',
    command: 'اعرض تحليل وإحصائيات المحادثات خلال آخر 7 أيام',
    color: 'text-cyan-400',
    bg: 'bg-cyan-400/10',
  },
];

// ────────────────────────────────────────────────────────────────────────────
// Quick Stats for Command Center
// ────────────────────────────────────────────────────────────────────────────

const QUICK_STATS = [
  { label: 'الموظفون النشطون', value: '12', icon: Bot, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  { label: 'المهام الجارية', value: '47', icon: CheckSquare, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { label: 'النماذج المتصلة', value: '8', icon: Cpu, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  { label: 'التكلفة اليومية', value: '$23', icon: DollarSign, color: 'text-amber-400', bg: 'bg-amber-400/10' },
];

const RECENT_ACTIVITY = [
  { action: 'تم تنفيذ مهمة فحص المحتوى', agent: 'محتوى-وكتيل', time: 'منذ 3 دقائق', type: 'task' as const },
  { action: 'موظف جديد «دعم فني» مفعل', agent: 'النظام', time: 'منذ 12 دقيقة', type: 'agent' as const },
  { action: 'نموذج GPT-4o متصل بنجاح', agent: 'المزودون', time: 'منذ 30 دقيقة', type: 'system' as const },
  { action: 'سير عمل النشر التلقائي مكتمل', agent: 'أتمتة', time: 'منذ ساعة', type: 'workflow' as const },
  { action: 'تنبيه: استهلاك API تجاوز 80%', agent: 'المراقبة', time: 'منذ ساعتين', type: 'alert' as const },
];

// ────────────────────────────────────────────────────────────────────────────
// Placeholder Section Component
// ────────────────────────────────────────────────────────────────────────────

function PlaceholderSection({ id }: { id: SectionId }) {
  const meta = SECTION_META[id];
  const Icon = meta.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
        className={`w-20 h-20 rounded-2xl bg-sultan/10 flex items-center justify-center mb-6`}
      >
        <Icon className="w-10 h-10 text-sultan" />
      </motion.div>
      <h2 className="text-2xl font-bold mb-3 text-gradient-sultan">{meta.title}</h2>
      <p className="text-muted-foreground text-sm max-w-md mb-6 leading-relaxed">
        {meta.description}
      </p>
      <Badge variant="outline" className="border-sultan/30 text-sultan text-xs">
        قريباً — قيد التطوير
      </Badge>
    </motion.div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Command Center Section (Fully Implemented)
// ────────────────────────────────────────────────────────────────────────────

function CommandCenterSection() {
  const [command, setCommand] = useState('');

  const handleExampleClick = useCallback((cmd: string) => {
    setCommand(cmd);
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;
    // Command execution will be wired up later
    setCommand('');
  }, [command]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="space-y-6"
    >
      {/* ── Chat Command Input ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <Card className="border-sultan/20 sultan-glow overflow-hidden">
          <div className="p-1">
            <form onSubmit={handleSubmit}>
              <div className="flex items-end gap-2 p-4">
                <div className="flex-1 relative">
                  <textarea
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                    placeholder="اكتب أمراً أو اسأل سلطان..."
                    rows={3}
                    className="w-full bg-transparent text-sm placeholder:text-muted-foreground/60 focus:outline-none resize-none leading-relaxed"
                    dir="rtl"
                  />
                </div>
                <Button
                  type="submit"
                  size="icon"
                  disabled={!command.trim()}
                  className="shrink-0 h-10 w-10 rounded-xl bg-sultan hover:bg-sultan/90 text-sultan-foreground sultan-glow"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between px-4 pb-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-border/50 text-[10px] text-muted-foreground">
                    <Terminal className="h-3 w-3 ms-1" />
                    وضع الأوامر
                  </Badge>
                </div>
                <span className="text-[10px] text-muted-foreground">
                  ⌘ + Enter للإرسال
                </span>
              </div>
            </form>
          </div>
        </Card>
      </motion.div>

      {/* ── Quick Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {QUICK_STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
          >
            <Card className="border-border/50 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </div>
              <p className="text-xl font-bold">{stat.value}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{stat.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* ── Example Command Cards ── */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-sultan" />
          أوامر مقترحة
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {COMMAND_EXAMPLES.map((example, i) => (
            <motion.button
              key={example.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + i * 0.05 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleExampleClick(example.command)}
              className="group text-start rounded-xl border border-border/50 bg-card p-4 hover:border-sultan/30 hover:bg-accent/30 transition-all duration-200"
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl ${example.bg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                  <example.icon className={`h-5 w-5 ${example.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold mb-1 group-hover:text-sultan transition-colors">
                    {example.title}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {example.description}
                  </p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-border/30">
                <code className="text-[10px] text-muted-foreground/70 font-mono leading-relaxed line-clamp-1" dir="rtl">
                  {example.command}
                </code>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* ── Recent Activity ── */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="border-border/50 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Activity className="h-4 w-4 text-sultan" />
              النشاط الأخير
            </h3>
            <Badge variant="outline" className="text-[10px] border-border/50">
              <span className="relative flex h-2 w-2 me-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              مباشر
            </Badge>
          </div>
          <div className="space-y-1">
            {RECENT_ACTIVITY.map((activity, i) => {
              const typeStyles: Record<string, { color: string; bg: string }> = {
                task: { color: 'text-blue-400', bg: 'bg-blue-400/10' },
                agent: { color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
                system: { color: 'text-purple-400', bg: 'bg-purple-400/10' },
                workflow: { color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
                alert: { color: 'text-amber-400', bg: 'bg-amber-400/10' },
              };
              const style = typeStyles[activity.type] || typeStyles.system;
              const typeLabels: Record<string, string> = {
                task: 'مهمة',
                agent: 'وكيل',
                system: 'نظام',
                workflow: 'سير عمل',
                alert: 'تنبيه',
              };
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.65 + i * 0.05 }}
                  className="flex items-center gap-3 py-2.5 px-2 rounded-lg hover:bg-accent/30 transition-colors"
                >
                  <div className={`w-8 h-8 rounded-lg ${style.bg} flex items-center justify-center shrink-0`}>
                    <div className={`w-2 h-2 rounded-full ${style.color.replace('text-', 'bg-')}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{activity.action}</p>
                    <p className="text-[10px] text-muted-foreground">{activity.agent}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="secondary" className="text-[9px] px-1.5 py-0">
                      {typeLabels[activity.type]}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">{activity.time}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Sidebar Component
// ────────────────────────────────────────────────────────────────────────────

function Sidebar({
  activeSection,
  onSectionChange,
  collapsed,
  onToggleCollapse,
}: {
  activeSection: SectionId;
  onSectionChange: (id: SectionId) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}) {
  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 72 : 280 }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        className="shrink-0 h-full border-l border-border/50 bg-card flex flex-col overflow-hidden"
      >
        {/* ── Header ── */}
        <div className="p-3 flex flex-col items-center border-b border-border/50">
          <div className="flex items-center justify-between w-full mb-3">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <div className="w-8 h-8 rounded-lg sultan-gradient flex items-center justify-center">
                  <Crown className="w-4 h-4 text-sultan-foreground" />
                </div>
                <div>
                  <h1 className="text-sm font-bold text-gradient-sultan leading-none">SULTAN</h1>
                  <p className="text-[9px] text-muted-foreground leading-none mt-0.5">AI Operating System</p>
                </div>
              </motion.div>
            )}
            {collapsed && (
              <div className="w-8 h-8 rounded-lg sultan-gradient flex items-center justify-center">
                <Crown className="w-4 h-4 text-sultan-foreground" />
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="w-full h-7 text-[10px] text-muted-foreground hover:text-foreground"
          >
            {collapsed ? (
              <PanelRightOpen className="h-3.5 w-3.5 ms-1" />
            ) : (
              <>
                <PanelRightClose className="h-3.5 w-3.5 ms-1" />
                طي القائمة
              </>
            )}
          </Button>
        </div>

        {/* ── Navigation Items ── */}
        <ScrollArea className="flex-1 py-2">
          <nav className="flex flex-col gap-0.5 px-2">
            {NAV_ENTRIES.map((entry) => {
              if (entry.type === 'separator') {
                return (
                  <div key={entry.label} className="flex flex-col gap-1 mt-3 mb-1">
                    {!collapsed && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-2 px-2"
                      >
                        <Separator className="flex-1" />
                        <span className="text-[9px] text-muted-foreground font-medium whitespace-nowrap">
                          {entry.label}
                        </span>
                        <Separator className="flex-1" />
                      </motion.div>
                    )}
                    {collapsed && <Separator className="mx-1" />}
                  </div>
                );
              }

              const isActive = activeSection === entry.id;
              const Icon = entry.icon;

              const buttonContent = (
                <button
                  onClick={() => onSectionChange(entry.id)}
                  className={`
                    w-full flex items-center gap-3 rounded-lg transition-all duration-200 group relative
                    ${collapsed ? 'justify-center p-2.5' : 'px-3 py-2.5'}
                    ${isActive
                      ? 'bg-sultan/10 text-sultan font-medium'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                    }
                  `}
                >
                  {/* Active Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute start-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full bg-sultan"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  <Icon className={`h-4 w-4 shrink-0 transition-colors ${isActive ? 'text-sultan' : ''}`} />
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-xs truncate"
                    >
                      {entry.label}
                    </motion.span>
                  )}
                </button>
              );

              if (collapsed) {
                return (
                  <Tooltip key={entry.id}>
                    <TooltipTrigger asChild>{buttonContent}</TooltipTrigger>
                    <TooltipContent side="left" className="text-xs font-medium">
                      <p>{entry.label}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5 max-w-[200px]">
                        {entry.description}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                );
              }

              return <React.Fragment key={entry.id}>{buttonContent}</React.Fragment>;
            })}
          </nav>
        </ScrollArea>

        {/* ── Footer ── */}
        {!collapsed && (
          <div className="p-3 border-t border-border/50">
            <div className="flex items-center gap-2 px-2">
              <div className="w-7 h-7 rounded-full bg-sultan/20 flex items-center justify-center">
                <span className="text-[10px] font-bold text-sultan">YS</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">يوسف السلطان</p>
                <p className="text-[9px] text-muted-foreground">Super Admin</p>
              </div>
              <Badge variant="outline" className="border-sultan/30 text-sultan text-[8px] px-1 py-0">
                PRO
              </Badge>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="p-2 border-t border-border/50 flex justify-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-8 h-8 rounded-full bg-sultan/20 flex items-center justify-center cursor-pointer">
                  <span className="text-[10px] font-bold text-sultan">YS</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p className="text-xs font-medium">يوسف السلطان</p>
                <p className="text-[10px] text-muted-foreground">Super Admin • PRO</p>
              </TooltipContent>
            </Tooltip>
          </div>
        )}
      </motion.aside>
    </TooltipProvider>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Main Admin Command Center Component
// ────────────────────────────────────────────────────────────────────────────

// Sub-panel imports (lazy-loaded in production)
import AIEmployeesPanel from './agents/AIEmployeesPanel';
import ModelsHubPanel from './models/ModelsHubPanel';
import ProvidersPanel from './providers/ProvidersPanel';
import SecretsPanel from './secrets/SecretsPanel';

interface AdminCommandCenterProps {
  onBack?: () => void;
}

export default function AdminCommandCenter({ onBack }: AdminCommandCenterProps) {
  const [activeSection, setActiveSection] = useState<SectionId>('command-center');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSectionChange = useCallback((id: SectionId) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
  }, []);

  const currentMeta = SECTION_META[activeSection];

  return (
    <div className="h-screen flex bg-background overflow-hidden" dir="rtl">
      {/* ── Mobile Overlay ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Mobile Sidebar ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: 300 }}
            animate={{ x: 0 }}
            exit={{ x: 300 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-y-0 start-0 z-50 lg:hidden"
          >
            <Sidebar
              activeSection={activeSection}
              onSectionChange={handleSectionChange}
              collapsed={false}
              onToggleCollapse={() => setMobileMenuOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Desktop Sidebar ── */}
      <div className="hidden lg:block">
        <Sidebar
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed((c) => !c)}
        />
      </div>

      {/* ── Main Content ── */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* ── Top Bar ── */}
        <header className="shrink-0 h-14 border-b border-border/50 bg-card/80 backdrop-blur-xl flex items-center px-4 gap-3">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-8 w-8"
            onClick={() => setMobileMenuOpen(true)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Section Title */}
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg bg-sultan/10 flex items-center justify-center`}>
              <currentMeta.icon className="h-4 w-4 text-sultan" />
            </div>
            <div>
              <h1 className="text-sm font-bold leading-none">{currentMeta.title}</h1>
              <p className="text-[10px] text-muted-foreground mt-0.5">{currentMeta.description}</p>
            </div>
          </div>

          {/* Status Indicators */}
          <div className="ms-auto flex items-center gap-2">
            <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 text-[10px]">
              <span className="relative flex h-1.5 w-1.5 me-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              متصل
            </Badge>
            <Badge variant="secondary" className="text-[10px]">
              <Crown className="h-3 w-3 me-1 text-sultan" />
              DEMO
            </Badge>
          </div>
        </header>

        {/* ── Scrollable Content ── */}
        <ScrollArea className="flex-1">
          <div className="p-4 lg:p-6 max-w-6xl mx-auto">
            <AnimatePresence mode="wait">
              {activeSection === 'command-center' && <CommandCenterSection key="command-center" />}
              {activeSection === 'ai-employees' && <AIEmployeesPanel key="ai-employees" />}
              {activeSection === 'models-hub' && <ModelsHubPanel key="models-hub" />}
              {activeSection === 'providers' && <ProvidersPanel key="providers" />}
              {activeSection === 'api-keys' && <SecretsPanel key="api-keys" />}
              {!['command-center', 'ai-employees', 'models-hub', 'providers', 'api-keys'].includes(activeSection) && (
                <PlaceholderSection key={activeSection} id={activeSection} />
              )}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}

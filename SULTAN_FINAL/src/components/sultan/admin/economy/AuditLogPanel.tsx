'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useEconomyStore } from '@/lib/economy';
import {
  FileText,
  Filter,
  Clock,
  User,
  ArrowRightLeft,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { AuditLogEntry } from '@/lib/economy';

// ─── Animation ──────────────────────────────────────────────────────────────

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.04 } },
};

// ─── Category Config ───────────────────────────────────────────────────────

const AUDIT_CATEGORY_CONFIG: Record<
  string,
  { labelAr: string; icon: LucideIcon; color: string; bg: string }
> = {
  economy: { labelAr: 'الاقتصاد', icon: ArrowRightLeft, color: 'text-amber-400', bg: 'bg-amber-400/10' },
  user: { labelAr: 'المستخدم', icon: User, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
  campaign: { labelAr: 'الحملات', icon: FileText, color: 'text-pink-400', bg: 'bg-pink-400/10' },
  cashout: { labelAr: 'السحوبات', icon: ArrowRightLeft, color: 'text-red-400', bg: 'bg-red-400/10' },
  grant: { labelAr: 'المنح', icon: ShieldCheck, color: 'text-violet-400', bg: 'bg-violet-400/10' },
  risk: { labelAr: 'المخاطر', icon: ShieldCheck, color: 'text-orange-400', bg: 'bg-orange-400/10' },
  system: { labelAr: 'النظام', icon: ShieldCheck, color: 'text-gray-400', bg: 'bg-gray-400/10' },
};

// ─── Helpers ───────────────────────────────────────────────────────────────

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('ar-MA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatValue(val: any): string {
  if (val === null || val === undefined) return '—';
  if (typeof val === 'object') return JSON.stringify(val, null, 2);
  return String(val);
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function AuditLogPanel() {
  const auditLog = useEconomyStore((s) => s.auditLog);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // ─── Filtered logs ──────────────────────────────────────────────────────

  const filteredLogs = useMemo(() => {
    let logs = [...auditLog];

    if (selectedCategory !== 'all') {
      logs = logs.filter((entry) => entry.category === selectedCategory);
    }

    // Sort newest first
    logs.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );

    return logs;
  }, [auditLog, selectedCategory]);

  // ─── Category counts ────────────────────────────────────────────────────

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: auditLog.length };
    for (const entry of auditLog) {
      counts[entry.category] = (counts[entry.category] ?? 0) + 1;
    }
    return counts;
  }, [auditLog]);

  // ─── Render ─────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6" dir="rtl">
      {/* ─── Header ──────────────────────────────────────────────────────── */}
      <motion.div {...fadeUp}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(212,175,55,0.15)' }}
              >
                <FileText className="w-5 h-5" style={{ color: '#D4AF37' }} />
              </div>
              سجل التدقيق
            </h2>
            <p className="text-sm text-gray-400 mt-1 mr-13">
              تتبع جميع العمليات والتغييرات
            </p>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3 mr-13 sm:mr-0">
            <div
              className="text-center px-3 py-1.5 rounded-lg"
              style={{ background: 'rgba(212,175,55,0.1)' }}
            >
              <p className="text-lg font-bold" style={{ color: '#D4AF37' }}>
                {auditLog.length}
              </p>
              <p className="text-[10px] text-gray-500">إجمالي السجلات</p>
            </div>
          </div>
        </div>
      </motion.div>

      <Separator className="bg-white/5" />

      {/* ─── Filter Bar ──────────────────────────────────────────────────── */}
      <motion.div {...fadeUp}>
        <div className="flex items-center gap-3">
          <Filter className="w-4 h-4 text-gray-500 shrink-0" />
          <span className="text-sm text-gray-400">تصفية حسب القسم:</span>
          <Select
            value={selectedCategory}
            onValueChange={setSelectedCategory}
          >
            <SelectTrigger className="w-[180px] h-9 bg-white/5 border-white/10 text-white text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-white/10">
              <SelectItem value="all" className="text-white">
                جميع الأقسام ({categoryCounts['all'] ?? 0})
              </SelectItem>
              {Object.entries(AUDIT_CATEGORY_CONFIG).map(([key, config]) => (
                <SelectItem key={key} value={key} className="text-white">
                  {config.labelAr} ({categoryCounts[key] ?? 0})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedCategory !== 'all' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedCategory('all')}
              className="text-xs text-gray-400 hover:text-amber-400 hover:bg-amber-400/10 h-8"
            >
              إعادة تعيين
            </Button>
          )}
        </div>
      </motion.div>

      {/* ─── Audit Log Entries ────────────────────────────────────────────── */}
      {filteredLogs.length > 0 ? (
        <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-3">
          {filteredLogs.map((entry) => (
            <AuditLogCard key={entry.id} entry={entry} />
          ))}
        </motion.div>
      ) : (
        <motion.div {...fadeUp} className="text-center py-16">
          <FileText className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500">
            {selectedCategory !== 'all'
              ? 'لا توجد سجلات في هذا القسم'
              : 'لا توجد سجلات تدقيق حالياً'}
          </p>
        </motion.div>
      )}

      {/* ─── Footer Note ──────────────────────────────────────────────────── */}
      <motion.div {...fadeUp}>
        <div className="flex items-center justify-center gap-2 py-4">
          <ShieldCheck className="w-4 h-4 text-gray-600" />
          <p className="text-xs text-gray-600">
            سجلات التدقيق غير قابلة للحذف
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Audit Log Card ─────────────────────────────────────────────────────────

function AuditLogCard({ entry }: { entry: AuditLogEntry }) {
  const catConfig = AUDIT_CATEGORY_CONFIG[entry.category] ?? {
    labelAr: entry.category,
    icon: FileText,
    color: 'text-gray-400',
    bg: 'bg-gray-400/10',
  };
  const CatIcon = catConfig.icon;

  const oldValueStr = formatValue(entry.oldValue);
  const newValueStr = formatValue(entry.newValue);
  const hasValueChange = entry.oldValue !== null && entry.oldValue !== undefined;

  return (
    <motion.div {...fadeUp}>
      <Card className="border-white/5 bg-white/[0.03] backdrop-blur-sm hover:border-white/10 transition-colors">
        <div className="p-4">
          {/* Top Row: Category + Timestamp + Admin */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge
                variant="outline"
                className={`${catConfig.color} ${catConfig.bg} border-0 text-[10px] px-2 py-0.5 flex items-center gap-1`}
              >
                <CatIcon className="w-2.5 h-2.5" />
                {catConfig.labelAr}
              </Badge>
              <span className="text-sm font-medium text-white">{entry.action}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              {formatTimestamp(entry.timestamp)}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Admin */}
            <div className="space-y-1">
              <p className="text-[11px] text-gray-600">المدير</p>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-amber-400/10 flex items-center justify-center">
                  <User className="w-3 h-3 text-amber-400" />
                </div>
                <span className="text-xs text-gray-300 font-mono">{entry.adminId}</span>
              </div>
            </div>

            {/* Target User */}
            <div className="space-y-1">
              <p className="text-[11px] text-gray-600">المستخدم المستهدف</p>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center">
                  <User className="w-3 h-3 text-gray-500" />
                </div>
                <span className="text-xs text-gray-400 font-mono">
                  {entry.targetUser ?? '—'}</span>
              </div>
            </div>
          </div>

          {/* Value Change */}
          {hasValueChange && (
            <div className="mt-3 pt-3 border-t border-white/5">
              <p className="text-[11px] text-gray-600 mb-2">التغيير</p>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-gray-600 mb-1">القيمة السابقة</p>
                  <div className="px-2.5 py-1.5 rounded-lg bg-red-400/5 border border-red-400/10 overflow-hidden">
                    <p className="text-xs text-red-300/80 truncate font-mono">
                      {oldValueStr}
                    </p>
                  </div>
                </div>

                <ArrowRightLeft className="w-4 h-4 text-gray-600 shrink-0 rotate-180" />

                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-gray-600 mb-1">القيمة الجديدة</p>
                  <div className="px-2.5 py-1.5 rounded-lg bg-emerald-400/5 border border-emerald-400/10 overflow-hidden">
                    <p className="text-xs text-emerald-300/80 truncate font-mono">
                      {newValueStr}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reason */}
          {entry.reason && (
            <div className="mt-3 pt-3 border-t border-white/5">
              <p className="text-[11px] text-gray-600 mb-1">السبب</p>
              <p className="text-xs text-gray-400 leading-relaxed">{entry.reason}</p>
            </div>
          )}

          {/* Audit ID */}
          <div className="mt-2 pt-2 border-t border-white/5">
            <p className="text-[10px] text-gray-700 font-mono">{entry.auditId}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

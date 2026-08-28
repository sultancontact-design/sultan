'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useEconomyStore } from '@/lib/economy';
import { useSultanStore } from '@/lib/store';
import {
  Coins,
  Gift,
  ArrowDownLeft,
  ShieldAlert,
  Percent,
  Megaphone,
  Heart,
  HandCoins,
  Pencil,
  Check,
  X,
  History,
  Save,
  Tag,
  Clock,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import type { EconomyRule } from '@/lib/economy';

// ─── Animation ──────────────────────────────────────────────────────────────

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.06 } },
};

// ─── Category Config ───────────────────────────────────────────────────────

const CATEGORY_CONFIG: Record<
  string,
  { labelAr: string; icon: typeof Coins; color: string; bg: string }
> = {
  coins: { labelAr: 'عملات', icon: Coins, color: 'text-amber-400', bg: 'bg-amber-400/10' },
  rewards: { labelAr: 'مكافآت', icon: Gift, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  cashout: { labelAr: 'سحوبات', icon: ArrowDownLeft, color: 'text-red-400', bg: 'bg-red-400/10' },
  risk: { labelAr: 'مخاطر', icon: ShieldAlert, color: 'text-orange-400', bg: 'bg-orange-400/10' },
  commission: { labelAr: 'عمولات', icon: Percent, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
  campaign: { labelAr: 'حملات', icon: Megaphone, color: 'text-pink-400', bg: 'bg-pink-400/10' },
  support: { labelAr: 'دعم', icon: Heart, color: 'text-rose-400', bg: 'bg-rose-400/10' },
  grant: { labelAr: 'منح', icon: HandCoins, color: 'text-violet-400', bg: 'bg-violet-400/10' },
  general: { labelAr: 'عام', icon: Tag, color: 'text-gray-400', bg: 'bg-gray-400/10' },
};

// ─── Component ──────────────────────────────────────────────────────────────

export default function EconomyRulesPanel() {
  const economyRules = useEconomyStore((s) => s.economyRules);
  const updateRule = useEconomyStore((s) => s.updateRule);
  const currentProfile = useSultanStore((s) => s.currentProfile);

  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [newValue, setNewValue] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [reasonError, setReasonError] = useState<string>('');

  // ─── Group rules by category ────────────────────────────────────────────

  const groupedRules = useMemo(() => {
    const groups: Record<string, EconomyRule[]> = {};
    for (const rule of economyRules) {
      if (!groups[rule.category]) groups[rule.category] = [];
      groups[rule.category].push(rule);
    }
    return groups;
  }, [economyRules]);

  // ─── Version info ───────────────────────────────────────────────────────

  const latestUpdate = useMemo(() => {
    if (economyRules.length === 0) return null;
    return economyRules.reduce((latest, rule) => {
      const ruleDate = new Date(rule.updatedAt).getTime();
      return ruleDate > latest ? ruleDate : latest;
    }, new Date(economyRules[0].updatedAt).getTime());
  }, [economyRules]);

  const maxVersion = useMemo(() => {
    if (economyRules.length === 0) return 0;
    return Math.max(...economyRules.map((r) => r.version));
  }, [economyRules]);

  // ─── Handlers ───────────────────────────────────────────────────────────

  const startEdit = (rule: EconomyRule) => {
    setEditingKey(rule.key);
    setNewValue(String(rule.value));
    setReason('');
    setReasonError('');
  };

  const cancelEdit = () => {
    setEditingKey(null);
    setNewValue('');
    setReason('');
    setReasonError('');
  };

  const saveEdit = (rule: EconomyRule) => {
    if (!reason.trim()) {
      setReasonError('يجب إدخال سبب التغيير');
      return;
    }

    const parsedValue = rule.key.includes('rate') || rule.key.includes('percent')
      ? parseFloat(newValue)
      : isNaN(Number(newValue))
        ? newValue
        : Number(newValue);

    updateRule(rule.key, parsedValue, currentProfile?.id ?? 'admin-001', reason.trim());
    setEditingKey(null);
    setNewValue('');
    setReason('');
    setReasonError('');
  };

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
                <Coins className="w-5 h-5" style={{ color: '#D4AF37' }} />
              </div>
              قواعد الاقتصاد
            </h2>
            <p className="text-sm text-gray-400 mt-1 mr-13">
              إدارة قواعد ونسب الاقتصاد الرقمي
            </p>
          </div>

          {/* Version Info */}
          <div className="flex flex-col gap-1 text-sm mr-13 sm:mr-0">
            <div className="flex items-center gap-2 text-gray-300">
              <History className="w-4 h-4" style={{ color: '#D4AF37' }} />
              <span>الإصدار الحالي: </span>
              <span
                className="font-bold px-2 py-0.5 rounded-md text-xs"
                style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37' }}
              >
                {maxVersion}
              </span>
            </div>
            {latestUpdate && (
              <div className="flex items-center gap-2 text-gray-500 text-xs">
                <Clock className="w-3.5 h-3.5" />
                <span>
                  آخر تحديث:{' '}
                  {new Date(latestUpdate).toLocaleDateString('ar-MA', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <Separator className="bg-white/5" />

      {/* ─── Rules by Category ────────────────────────────────────────────── */}
      <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-8">
        {Object.entries(CATEGORY_CONFIG).map(([catKey, catConfig]) => {
          const rules = groupedRules[catKey];
          if (!rules || rules.length === 0) return null;

          const CatIcon = catConfig.icon;

          return (
            <motion.div key={catKey} {...fadeUp}>
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${catConfig.bg}`}
                >
                  <CatIcon className={`w-4 h-4 ${catConfig.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-white">{catConfig.labelAr}</h3>
                <Badge
                  variant="outline"
                  className={`${catConfig.color} ${catConfig.bg} border-0 text-xs`}
                >
                  {rules.length} قاعدة
                </Badge>
              </div>

              {/* Rules List */}
              <div className="space-y-3">
                {rules.map((rule) => {
                  const isEditing = editingKey === rule.key;

                  return (
                    <Card
                      key={rule.id}
                      className="border-white/5 bg-white/[0.03] backdrop-blur-sm hover:border-white/10 transition-colors"
                    >
                      <div className="p-4">
                        {/* Rule Header Row */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-medium text-white">
                                {rule.labelAr}
                              </span>
                              <Badge
                                variant="outline"
                                className={`${catConfig.color} ${catConfig.bg} border-0 text-[10px] px-1.5 py-0`}
                              >
                                {catConfig.labelAr}
                              </Badge>
                              <Badge
                                variant="outline"
                                className="text-gray-500 bg-white/5 border-0 text-[10px] px-1.5 py-0 font-mono"
                              >
                                v{rule.version}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-500 mt-1 truncate">
                              {rule.description}
                            </p>
                          </div>

                          <div className="flex items-center gap-3">
                            {/* Current Value Display */}
                            {!isEditing && (
                              <div
                                className="text-lg font-bold px-3 py-1.5 rounded-lg min-w-[80px] text-center"
                                style={{
                                  background: 'rgba(212,175,55,0.1)',
                                  color: '#D4AF37',
                                }}
                              >
                                {typeof rule.value === 'boolean'
                                  ? rule.value
                                    ? '✓ نعم'
                                    : '✗ لا'
                                  : rule.value}
                              </div>
                            )}

                            {/* Edit / Save / Cancel Buttons */}
                            {!isEditing ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => startEdit(rule)}
                                className="text-gray-400 hover:text-amber-400 hover:bg-amber-400/10 h-8 w-8 p-0"
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                            ) : (
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => saveEdit(rule)}
                                  className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10 h-8 w-8 p-0"
                                >
                                  <Check className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={cancelEdit}
                                  className="text-red-400 hover:text-red-300 hover:bg-red-400/10 h-8 w-8 p-0"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Inline Edit Form */}
                        {isEditing && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 pt-4 border-t border-white/5"
                          >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {/* Old Value */}
                              <div className="space-y-1.5">
                                <label className="text-xs text-gray-500">القيمة الحالية</label>
                                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/5">
                                  <span className="text-gray-400 text-sm line-through">
                                    {String(rule.value)}
                                  </span>
                                  <span className="text-[10px] text-gray-600 font-mono">old</span>
                                </div>
                              </div>

                              {/* New Value Input */}
                              <div className="space-y-1.5">
                                <label className="text-xs text-gray-500">القيمة الجديدة</label>
                                <Input
                                  value={newValue}
                                  onChange={(e) => setNewValue(e.target.value)}
                                  placeholder="أدخل القيمة الجديدة"
                                  className="h-9 bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-amber-500/50 focus:ring-amber-500/20 text-sm"
                                />
                              </div>
                            </div>

                            {/* Reason Textarea */}
                            <div className="mt-4 space-y-1.5">
                              <label className="text-xs text-gray-500">
                                سبب التغيير <span className="text-red-400">*</span>
                              </label>
                              <Textarea
                                value={reason}
                                onChange={(e) => {
                                  setReason(e.target.value);
                                  if (reasonError) setReasonError('');
                                }}
                                placeholder="أدخل سبب تعديل هذه القاعدة..."
                                rows={2}
                                className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-amber-500/50 focus:ring-amber-500/20 text-sm resize-none"
                              />
                              {reasonError && (
                                <p className="text-xs text-red-400 flex items-center gap-1">
                                  <X className="w-3 h-3" />
                                  {reasonError}
                                </p>
                              )}
                            </div>

                            {/* Save Button */}
                            <div className="mt-4 flex justify-end">
                              <Button
                                onClick={() => saveEdit(rule)}
                                disabled={!reason.trim()}
                                className="gap-2 text-sm h-9 px-4"
                                style={{
                                  background: 'linear-gradient(135deg, #D4AF37, #B8962E)',
                                  color: '#0a0a0a',
                                }}
                              >
                                <Save className="w-3.5 h-3.5" />
                                حفظ التغيير
                              </Button>
                            </div>
                          </motion.div>
                        )}

                        {/* Previous Change Reason (if exists) */}
                        {rule.changeReason && !isEditing && (
                          <div className="mt-3 pt-3 border-t border-white/5">
                            <p className="text-[11px] text-gray-500">
                              <span className="text-gray-600">آخر سبب لتغيير: </span>
                              <span className="text-gray-400">{rule.changeReason}</span>
                            </p>
                          </div>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Empty State */}
      {economyRules.length === 0 && (
        <motion.div {...fadeUp} className="text-center py-16">
          <Coins className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500">لا توجد قواعد اقتصادية حالياً</p>
        </motion.div>
      )}
    </div>
  );
}

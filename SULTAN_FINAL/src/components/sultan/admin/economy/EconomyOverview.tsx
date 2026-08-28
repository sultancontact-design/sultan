'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useEconomyStore } from '@/lib/economy';
import { useSultanStore } from '@/lib/store';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Coins,
  TrendingUp,
  Gift,
  ArrowDownLeft,
  Receipt,
  Heart,
  Users,
  Clock,
  Activity,
  Settings,
  Megaphone,
  CircleDollarSign,
  Landmark,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronLeft,
  ShoppingCart,
  Award,
  Banknote,
  type LucideIcon,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

// ─── Animation ──────────────────────────────────────────────────────────────

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.06 } },
};

// ─── Colors ──────────────────────────────────────────────────────────────────

const GOLD = '#D4AF37';
const GOLD_LIGHT = '#F0D060';
const BLUE = '#3B82F6';
const GREEN = '#22C55E';
const CHART_GOLD = '#D4AF37';
const CHART_BLUE = '#60A5FA';
const CHART_GREEN = '#4ADE80';

const PIE_COLORS = [GOLD, BLUE, GREEN];

// ─── Transaction Status Labels ───────────────────────────────────────────────

const TX_STATUS: Record<string, { label: string; color: string; bg: string }> = {
  completed: { label: 'مكتمل', color: 'text-green-400', bg: 'bg-green-400/10' },
  pending: { label: 'معلّق', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  frozen: { label: 'مجمد', color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
  failed: { label: 'فاشل', color: 'text-red-400', bg: 'bg-red-400/10' },
  cancelled: { label: 'ملغى', color: 'text-gray-400', bg: 'bg-gray-400/10' },
  reversed: { label: 'مرتجع', color: 'text-orange-400', bg: 'bg-orange-400/10' },
};

const TX_TYPE: Record<string, { label: string; icon: LucideIcon; color: string }> = {
  coin_purchase: { label: 'شراء عملات', icon: ShoppingCart, color: 'text-sultan' },
  support_sent: { label: 'دعم مُرسل', icon: Heart, color: 'text-pink-400' },
  support_received: { label: 'دعم مُستلم', icon: Heart, color: 'text-green-400' },
  reward_earned: { label: 'مكافأة', icon: Gift, color: 'text-sultan' },
  reward_pending: { label: 'مكافأة معلّقة', icon: Clock, color: 'text-yellow-400' },
  reward_available: { label: 'مكافأة متاحة', icon: Gift, color: 'text-green-400' },
  cashout_requested: { label: 'طلب سحب', icon: ArrowDownLeft, color: 'text-cyan-400' },
  cashout_paid: { label: 'سحب مدفوع', icon: Banknote, color: 'text-emerald-400' },
  commission_deducted: { label: 'رسوم', icon: Receipt, color: 'text-red-400' },
  admin_grant: { label: 'منحة إدارية', icon: Award, color: 'text-sultan' },
  refund_issued: { label: 'استرداد', icon: AlertTriangle, color: 'text-orange-400' },
  challenge_reward: { label: 'جائزة تحدي', icon: Award, color: 'text-sultan' },
  bounty_reward: { label: 'جائزة مهمة', icon: Gift, color: 'text-purple-400' },
  task_payment: { label: 'دفع مهمة', icon: TrendingUp, color: 'text-green-400' },
  power_earned: { label: 'قوة مكتسبة', icon: Activity, color: 'text-sultan' },
  grant_received: { label: 'منحة', icon: Gift, color: 'text-sultan' },
};

// ─── Custom Tooltip ──────────────────────────────────────────────────────────

function CustomBarTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-sultan/20 bg-royal-light px-3 py-2 text-xs shadow-lg">
      <p className="mb-1 text-sultan font-semibold">{label}</p>
      {payload.map((entry: any) => (
        <p key={entry.name} className="text-foreground/80">
          {entry.name}: <span className="font-bold text-sultan">{Number(entry.value).toLocaleString('ar-MA')}</span>
        </p>
      ))}
    </div>
  );
}

function CustomPieTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="rounded-lg border border-sultan/20 bg-royal-light px-3 py-2 text-xs shadow-lg">
      <p className="text-sultan font-semibold">{d.name}</p>
      <p className="text-foreground/80">
        {Number(d.value).toLocaleString('ar-MA')} ({((d.payload.percent ?? 0) * 100).toFixed(1)}%)
      </p>
    </div>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function EconomyOverview() {
  const {
    getEconomyStats,
    ledger,
    cashoutRequests,
    integrationStatus,
  } = useEconomyStore();

  const stats = useMemo(() => getEconomyStats(), [ledger, cashoutRequests]);

  // ─── Bar chart data ───────────────────────────────────────────────────────
  const barData = useMemo(
    () => [
      {
        name: 'مبيعات العملات',
        'مبيعات العملات': Math.abs(stats.totalCoinSales),
      },
      {
        name: 'المكافآت',
        'المكافآت': stats.rewardsGenerated,
      },
      {
        name: 'حجم السحوبات',
        'حجم السحوبات': stats.cashoutVolume,
      },
    ],
    [stats]
  );

  // ─── Pie chart data ───────────────────────────────────────────────────────
  const pieData = useMemo(() => {
    const supportSent = ledger
      .filter((t) => t.type === 'support_sent')
      .reduce((s, t) => s + Math.abs(t.amount), 0);
    const rewards = stats.rewardsGenerated;
    const cashouts = stats.cashoutVolume;
    const total = supportSent + rewards + cashouts || 1;
    return [
      { name: 'الدعم المُرسل', value: supportSent, percent: supportSent / total },
      { name: 'المكافآت', value: rewards, percent: rewards / total },
      { name: 'السحوبات', value: cashouts, percent: cashouts / total },
    ];
  }, [ledger, stats]);

  // ─── Recent transactions ──────────────────────────────────────────────────
  const recentTx = useMemo(() => ledger.slice(0, 10), [ledger]);

  // ─── Economy health metrics ───────────────────────────────────────────────
  const healthMetrics = useMemo(() => {
    const hasActivity = stats.totalCoinSales > 0 || stats.coinsCirculating > 0;
    const hasRewards = stats.rewardsGenerated > 0;
    const hasCashouts = stats.cashoutVolume > 0;
    const feeRatio =
      stats.coinsSpent > 0 ? (stats.fees / stats.coinsSpent) * 100 : 0;
    const pendingRatio =
      stats.rewardsGenerated > 0
        ? (stats.rewardsPending / stats.rewardsGenerated) * 100
        : 0;

    return [
      {
        label: 'نشاط الشراء',
        ok: hasActivity,
        detail: hasActivity
          ? `${Math.abs(stats.totalCoinSales).toLocaleString('ar-MA')} SC`
          : 'لا توجد مبيعات بعد',
      },
      {
        label: 'تداول العملات',
        ok: stats.coinsCirculating > 0,
        detail: `${stats.coinsCirculating.toLocaleString('ar-MA')} SC متداولة`,
      },
      {
        label: 'المكافآت',
        ok: hasRewards,
        detail: hasRewards
          ? `${stats.rewardsGenerated.toLocaleString('ar-MA')} SR مُنشأة`
          : 'لا توجد مكافآت بعد',
      },
      {
        label: 'السحوبات',
        ok: hasCashouts,
        detail: hasCashouts
          ? `${stats.cashoutVolume.toLocaleString('ar-MA')} SR مطلوبة`
          : 'لا توجد سحوبات بعد',
      },
      {
        label: 'نسبة الرسوم',
        ok: feeRatio <= 10,
        detail: `${feeRatio.toFixed(1)}%`,
      },
      {
        label: 'مكافآت معلّقة',
        ok: pendingRatio <= 50,
        detail: `${pendingRatio.toFixed(1)}% من الإجمالي`,
      },
    ];
  }, [stats]);

  // ─── Integration status entries ───────────────────────────────────────────
  const integrations = useMemo(
    () => [
      {
        key: 'payment',
        label: 'مزود الدفع',
        icon: CircleDollarSign,
      },
      {
        key: 'cashout',
        label: 'مزود السحوبات',
        icon: Banknote,
      },
      {
        key: 'kyc',
        label: 'مزود التحقق (KYC)',
        icon: Landmark,
      },
    ],
    []
  );

  // ─── Quick actions ────────────────────────────────────────────────────────
  const quickActions: { label: string; icon: LucideIcon; color: string; bg: string }[] = [
    { label: 'إدارة العملات', icon: Coins, color: 'text-sultan', bg: 'bg-sultan/10' },
    { label: 'إدارة المكافآت', icon: Gift, color: 'text-sultan', bg: 'bg-sultan/10' },
    { label: 'إدارة السحوبات', icon: ArrowDownLeft, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
    { label: 'إدارة الحملات', icon: Megaphone, color: 'text-orange-400', bg: 'bg-orange-400/10' },
    { label: 'إدارة المنح', icon: Award, color: 'text-green-400', bg: 'bg-green-400/10' },
    { label: 'إدارة الضمانات', icon: Receipt, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  ];

  // ─── Primary stat cards ───────────────────────────────────────────────────
  const primaryStats = [
    {
      label: 'إجمالي مبيعات العملات',
      value: Math.abs(stats.totalCoinSales).toLocaleString('ar-MA'),
      unit: 'SC',
      icon: ShoppingCart,
      color: 'text-sultan',
      bg: 'bg-sultan/10',
    },
    {
      label: 'عملات متداولة',
      value: stats.coinsCirculating.toLocaleString('ar-MA'),
      unit: 'SC',
      icon: Coins,
      color: 'text-sultan',
      bg: 'bg-sultan/10',
    },
    {
      label: 'مكافآت مُنشأة',
      value: stats.rewardsGenerated.toLocaleString('ar-MA'),
      unit: 'SR',
      icon: Gift,
      color: 'text-sultan',
      bg: 'bg-sultan/10',
    },
    {
      label: 'حجم السحوبات',
      value: stats.cashoutVolume.toLocaleString('ar-MA'),
      unit: 'SR',
      icon: ArrowDownLeft,
      color: 'text-cyan-400',
      bg: 'bg-cyan-400/10',
    },
  ];

  // ─── Secondary stat cards ─────────────────────────────────────────────────
  const secondaryStats = [
    {
      label: 'رسوم المنصة',
      value: stats.fees.toLocaleString('ar-MA'),
      unit: 'SC',
      icon: Receipt,
      color: 'text-orange-400',
      bg: 'bg-orange-400/10',
    },
    {
      label: 'المستخدمون الداعمون',
      value: stats.activeSupporters.toLocaleString('ar-MA'),
      unit: '',
      icon: Heart,
      color: 'text-pink-400',
      bg: 'bg-pink-400/10',
    },
    {
      label: 'المستخدمون المدعومون',
      value: stats.supportedUsers.toLocaleString('ar-MA'),
      unit: '',
      icon: Users,
      color: 'text-green-400',
      bg: 'bg-green-400/10',
    },
    {
      label: 'المكافآت المعلقة',
      value: stats.rewardsPending.toLocaleString('ar-MA'),
      unit: 'SR',
      icon: Clock,
      color: 'text-yellow-400',
      bg: 'bg-yellow-400/10',
    },
  ];

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <motion.div
      className="space-y-6"
      initial="initial"
      animate="animate"
      variants={stagger}
    >
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <motion.div variants={fadeUp} className="text-center">
        <h2 className="text-gradient-sultan text-2xl font-bold sm:text-3xl">
          اقتصاد سلطان
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          نظرة عامة على الاقتصاد الرقمي
        </p>
      </motion.div>

      {/* ── Primary Stat Cards (2×2 → 1 col mobile) ──────────────────────── */}
      <motion.div
        variants={stagger}
        className="grid grid-cols-1 gap-3 sm:grid-cols-2"
      >
        {primaryStats.map((s) => (
          <motion.div key={s.label} variants={fadeUp}>
            <Card className="border-white/5 bg-royal-light p-4">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${s.bg}`}>
                  <s.icon className={`h-5 w-5 ${s.color}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs text-muted-foreground">
                    {s.label}
                  </p>
                  <p className="text-lg font-bold text-foreground">
                    {s.value}
                    {s.unit && (
                      <span className="mr-1 text-xs font-normal text-muted-foreground">
                        {s.unit}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Secondary Stat Cards ──────────────────────────────────────────── */}
      <motion.div
        variants={stagger}
        className="grid grid-cols-1 gap-3 sm:grid-cols-2"
      >
        {secondaryStats.map((s) => (
          <motion.div key={s.label} variants={fadeUp}>
            <Card className="border-white/5 bg-royal-light p-4">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${s.bg}`}>
                  <s.icon className={`h-5 w-5 ${s.color}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs text-muted-foreground">
                    {s.label}
                  </p>
                  <p className="text-lg font-bold text-foreground">
                    {s.value}
                    {s.unit && (
                      <span className="mr-1 text-xs font-normal text-muted-foreground">
                        {s.unit}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Bar Chart ─────────────────────────────────────────────────────── */}
      <motion.div variants={fadeUp}>
        <Card className="border-white/5 bg-royal-light p-4 sm:p-6">
          <h3 className="mb-4 text-sm font-semibold text-foreground">
            المقارنة المالية
          </h3>
          <div className="h-56 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barData}
                margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
              >
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#9CA3AF', fontSize: 11 }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#9CA3AF', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) =>
                    v >= 1000
                      ? `${(v / 1000).toFixed(0)}k`
                      : v.toString()
                  }
                />
                <Tooltip content={<CustomBarTooltip />} />
                <Bar
                  dataKey="مبيعات العملات"
                  fill={CHART_GOLD}
                  radius={[6, 6, 0, 0]}
                  maxBarSize={48}
                />
                <Bar
                  dataKey="المكافآت"
                  fill={CHART_GOLD}
                  radius={[6, 6, 0, 0]}
                  maxBarSize={48}
                  opacity={0.75}
                />
                <Bar
                  dataKey="حجم السحوبات"
                  fill={CHART_GOLD}
                  radius={[6, 6, 0, 0]}
                  maxBarSize={48}
                  opacity={0.5}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </motion.div>

      {/* ── Pie Chart ─────────────────────────────────────────────────────── */}
      <motion.div variants={fadeUp}>
        <Card className="border-white/5 bg-royal-light p-4 sm:p-6">
          <h3 className="mb-4 text-sm font-semibold text-foreground">
            توزيع المعاملات
          </h3>
          <div className="flex flex-col items-center gap-4">
            <div className="h-52 w-full max-w-xs sm:h-60">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((_, i) => (
                      <Cell
                        key={`pie-${i}`}
                        fill={PIE_COLORS[i % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
              {pieData.map((entry, i) => (
                <div key={entry.name} className="flex items-center gap-1.5">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{
                      backgroundColor: PIE_COLORS[i % PIE_COLORS.length],
                    }}
                  />
                  <span className="text-muted-foreground">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* ── Economy Health ────────────────────────────────────────────────── */}
      <motion.div variants={fadeUp}>
        <Card className="border-white/5 bg-royal-light p-4 sm:p-6">
          <div className="mb-4 flex items-center gap-2">
            <Activity className="h-4 w-4 text-sultan" />
            <h3 className="text-sm font-semibold text-foreground">
              مؤشر صحة الاقتصاد
            </h3>
          </div>
          <div className="space-y-3">
            {healthMetrics.map((m) => (
              <div
                key={m.label}
                className="flex items-center justify-between rounded-lg border border-white/5 bg-royal-lighter/50 px-3 py-2.5"
              >
                <div className="flex items-center gap-2.5">
                  {m.ok ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-green-400" />
                  ) : (
                    <XCircle className="h-4 w-4 shrink-0 text-red-400" />
                  )}
                  <span className="text-sm text-foreground">{m.label}</span>
                </div>
                <span
                  className={`text-xs font-medium ${
                    m.ok ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {m.detail}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* ── Recent Transactions ───────────────────────────────────────────── */}
      <motion.div variants={fadeUp}>
        <Card className="border-white/5 bg-royal-light p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-sultan" />
              <h3 className="text-sm font-semibold text-foreground">
                آخر المعاملات
              </h3>
            </div>
            <Badge
              variant="outline"
              className="border-sultan/30 text-sultan text-[10px]"
            >
              {recentTx.length} معاملة
            </Badge>
          </div>

          {recentTx.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
              <Receipt className="mb-2 h-8 w-8 opacity-30" />
              <p className="text-sm">لا توجد معاملات بعد</p>
            </div>
          ) : (
            <div className="max-h-96 space-y-2 overflow-y-auto scrollbar-thin">
              {recentTx.map((tx) => {
                const typeInfo = TX_TYPE[tx.type] ?? {
                  label: tx.type,
                  icon: Receipt,
                  color: 'text-gray-400',
                };
                const statusInfo = TX_STATUS[tx.status] ?? {
                  label: tx.status,
                  color: 'text-gray-400',
                  bg: 'bg-gray-400/10',
                };
                const TypeIcon = typeInfo.icon;

                return (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between rounded-lg border border-white/5 bg-royal-lighter/50 px-3 py-2.5 transition-colors hover:border-sultan/10"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${
                          typeInfo.color === 'text-sultan'
                            ? 'bg-sultan/10'
                            : typeInfo.color === 'text-green-400'
                              ? 'bg-green-400/10'
                              : typeInfo.color === 'text-pink-400'
                                ? 'bg-pink-400/10'
                                : typeInfo.color === 'text-cyan-400'
                                  ? 'bg-cyan-400/10'
                                  : typeInfo.color === 'text-yellow-400'
                                    ? 'bg-yellow-400/10'
                                    : typeInfo.color === 'text-red-400'
                                      ? 'bg-red-400/10'
                                      : typeInfo.color === 'text-orange-400'
                                        ? 'bg-orange-400/10'
                                        : typeInfo.color === 'text-purple-400'
                                          ? 'bg-purple-400/10'
                                          : typeInfo.color === 'text-emerald-400'
                                            ? 'bg-emerald-400/10'
                                            : 'bg-gray-400/10'
                        }`}
                      >
                        <TypeIcon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-medium text-foreground">
                          {typeInfo.label}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {tx.createdAt
                            ? new Date(tx.createdAt).toLocaleDateString('ar-MA', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : '—'}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span
                        className={`text-xs font-bold ${
                          tx.amount >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        {tx.amount >= 0 ? '+' : ''}
                        {Math.abs(tx.amount).toLocaleString('ar-MA')}{' '}
                        {tx.currency}
                      </span>
                      <Badge
                        variant="outline"
                        className={`${statusInfo.color} ${statusInfo.bg} border-0 text-[10px] px-1.5`}
                      >
                        {statusInfo.label}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </motion.div>

      {/* ── Quick Actions ────────────────────────────────────────────────── */}
      <motion.div variants={fadeUp}>
        <Card className="border-white/5 bg-royal-light p-4 sm:p-6">
          <div className="mb-4 flex items-center gap-2">
            <Settings className="h-4 w-4 text-sultan" />
            <h3 className="text-sm font-semibold text-foreground">
              إجراءات سريعة
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {quickActions.map((action) => (
              <Button
                key={action.label}
                variant="outline"
                className="flex h-auto flex-col items-center gap-2 border-white/10 bg-royal-lighter/50 py-4 transition-colors hover:border-sultan/30 hover:bg-sultan/5"
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${action.bg}`}
                >
                  <action.icon className={`h-5 w-5 ${action.color}`} />
                </div>
                <span className="text-xs font-medium text-foreground">
                  {action.label}
                </span>
              </Button>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* ── Integration Status ────────────────────────────────────────────── */}
      <motion.div variants={fadeUp}>
        <Card className="border-white/5 bg-royal-light p-4 sm:p-6">
          <div className="mb-4 flex items-center gap-2">
            <Landmark className="h-4 w-4 text-sultan" />
            <h3 className="text-sm font-semibold text-foreground">
              حالة التكامل
            </h3>
          </div>
          <div className="space-y-3">
            {integrations.map((integ) => {
              const status = integrationStatus[integ.key];
              const configured = status?.configured ?? false;
              const mode = status?.mode ?? 'mock';
              const IntegIcon = integ.icon;

              return (
                <div
                  key={integ.key}
                  className="flex items-center justify-between rounded-lg border border-white/5 bg-royal-lighter/50 px-3 py-2.5"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${
                        configured ? 'bg-green-400/10' : 'bg-yellow-400/10'
                      }`}
                    >
                      <IntegIcon
                        className={`h-4 w-4 ${
                          configured ? 'text-green-400' : 'text-yellow-400'
                        }`}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {integ.label}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {status?.provider ?? 'غير محدد'}
                      </p>
                    </div>
                  </div>
                  {configured ? (
                    <Badge
                      variant="outline"
                      className="border-green-400/30 bg-green-400/10 text-green-400 text-[10px]"
                    >
                      <CheckCircle2 className="ml-1 h-3 w-3" />
                      {mode === 'production'
                        ? 'نشط'
                        : mode === 'development'
                          ? 'تطوير'
                          : 'تجريبي'}
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="border-yellow-400/30 bg-yellow-400/10 text-yellow-400 text-[10px]"
                    >
                      <AlertTriangle className="ml-1 h-3 w-3" />
                      قيد التكامل
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}

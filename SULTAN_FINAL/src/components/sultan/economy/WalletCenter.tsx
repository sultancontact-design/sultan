'use client';
import { useEffect, useState, useMemo } from 'react';
import { useSultanStore } from '@/lib/store';
import { useEconomyStore } from '@/lib/economy';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Wallet,
  Coins,
  Gift,
  Clock,
  Zap,
  ShoppingCart,
  Heart,
  TrendingUp,
  ArrowDownLeft,
  History,
  Shield,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Lock,
  Trophy,
  CircleDot,
  type LucideIcon,
} from 'lucide-react';

const fadeUp = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };

// ─── Transaction Type Labels ─────────────────────────────────────────────────

const TX_TYPE_LABELS: Record<string, { label: string; icon: LucideIcon; color: string; bg: string }> = {
  coin_purchase: { label: 'شراء', icon: ShoppingCart, color: 'text-sultan', bg: 'bg-sultan/10' },
  support_sent: { label: 'دعم', icon: Heart, color: 'text-pink-400', bg: 'bg-pink-400/10' },
  support_received: { label: 'دعم مُستلم', icon: Heart, color: 'text-green-400', bg: 'bg-green-400/10' },
  reward_earned: { label: 'مكافأة', icon: Gift, color: 'text-sultan', bg: 'bg-sultan/10' },
  reward_pending: { label: 'مكافأة معلّقة', icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  reward_available: { label: 'مكافأة متاحة', icon: Gift, color: 'text-green-400', bg: 'bg-green-400/10' },
  cashout_requested: { label: 'سحب', icon: ArrowDownLeft, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
  cashout_paid: { label: 'سحب مكتمل', icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  challenge_reward: { label: 'جائزة تحدي', icon: Trophy, color: 'text-sultan', bg: 'bg-sultan/10' },
  bounty_reward: { label: 'جائزة مهمة', icon: Gift, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  task_payment: { label: 'دفع مهمة', icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-400/10' },
  admin_grant: { label: 'منحة إدارية', icon: Shield, color: 'text-sultan', bg: 'bg-sultan/10' },
  refund_issued: { label: 'استرداد', icon: AlertCircle, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  power_earned: { label: 'قوة مكتسبة', icon: Zap, color: 'text-sultan', bg: 'bg-sultan/10' },
  grant_received: { label: 'منحة', icon: Gift, color: 'text-sultan', bg: 'bg-sultan/10' },
  commission_deducted: { label: 'رسوم', icon: XCircle, color: 'text-red-400', bg: 'bg-red-400/10' },
};

const TX_STATUS_MAP: Record<string, { label: string; cls: string; icon: LucideIcon }> = {
  completed: { label: 'مكتمل', cls: 'bg-green-500/10 text-green-400', icon: CheckCircle2 },
  pending: { label: 'قيد الانتظار', cls: 'bg-yellow-500/10 text-yellow-400', icon: Clock },
  failed: { label: 'فشل', cls: 'bg-red-500/10 text-red-400', icon: XCircle },
  frozen: { label: 'مجمد', cls: 'bg-blue-400/10 text-blue-300', icon: Lock },
  cancelled: { label: 'ملغى', cls: 'bg-gray-500/10 text-gray-400', icon: XCircle },
  reversed: { label: 'مرتجع', cls: 'bg-orange-400/10 text-orange-400', icon: AlertCircle },
};

// ─── History Filters ─────────────────────────────────────────────────────────

type HistoryFilter = 'all' | 'support' | 'purchase' | 'reward' | 'grant' | 'cashout';

const HISTORY_FILTERS: { key: HistoryFilter; label: string }[] = [
  { key: 'all', label: 'كل' },
  { key: 'support', label: 'دعم' },
  { key: 'purchase', label: 'شراء' },
  { key: 'reward', label: 'مكافأة' },
  { key: 'grant', label: 'منح' },
  { key: 'cashout', label: 'سحب' },
];

const FILTER_TYPE_MAP: Record<HistoryFilter, string[]> = {
  all: [],
  support: ['support_sent', 'support_received'],
  purchase: ['coin_purchase', 'boost_purchase', 'featured_purchase', 'promotion_purchase'],
  reward: ['reward_earned', 'reward_pending', 'reward_available', 'challenge_reward', 'bounty_reward', 'task_payment'],
  grant: ['grant_received', 'admin_grant'],
  cashout: ['cashout_requested', 'cashout_approved', 'cashout_paid'],
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function WalletCenter() {
  const { goBack, openSupportModal, navigate, addToast, currentProfile } = useSultanStore();
  const {
    wallet,
    initWallet,
    getWalletBalance,
    getAvailableBalance,
    getPendingBalance,
    getTransactionHistory,
    coinPackages,
    getCashoutEligibility,
    isFeatureEnabled,
  } = useEconomyStore();

  const [activeSection, setActiveSection] = useState<'balance' | 'history' | 'buy'>('balance');
  const [historyFilter, setHistoryFilter] = useState<HistoryFilter>('all');

  // ─── Initialize wallet ───────────────────────────────────────────────────
  useEffect(() => {
    if (currentProfile?.id) {
      initWallet(currentProfile.id);
    }
  }, [currentProfile?.id, initWallet]);

  // ─── Wallet data with fallback to profile ───────────────────────────────
  const coinsBalance = wallet?.coins.balance ?? currentProfile?.coinsBalance ?? 0;
  const coinsAvailable = wallet?.coins.available ?? currentProfile?.coinsBalance ?? 0;
  const coinsPending = wallet?.coins.pending ?? 0;
  const coinsLifetimeReceived = wallet?.coins.lifetimeReceived ?? 0;
  const coinsLifetimeGiven = wallet?.coins.lifetimeGiven ?? 0;

  const rewardsBalance = wallet?.rewards.balance ?? currentProfile?.rewardsBalance ?? 0;
  const rewardsAvailable = wallet?.rewards.available ?? currentProfile?.rewardsBalance ?? 0;
  const rewardsPending = wallet?.rewards.pending ?? 0;

  const pendingRewardsAmount = wallet?.pendingRewards.pending ?? currentProfile?.pendingRewards ?? 0;

  const powerBalance = wallet?.power.balance ?? currentProfile?.sultanPower ?? 0;
  const powerAvailable = wallet?.power.available ?? currentProfile?.sultanPower ?? 0;

  // Cashout eligibility — defaults to eligible if no cashout system enabled
  const cashoutEligibility = currentProfile ? getCashoutEligibility(currentProfile.id) : null;
  const withdrawableSR = cashoutEligibility?.eligible ? rewardsAvailable : 0;

  // ─── Transactions ───────────────────────────────────────────────────────
  const transactions = useMemo(() => {
    if (!currentProfile?.id) return [];
    if (historyFilter === 'all') {
      return getTransactionHistory(currentProfile.id, { limit: 20 });
    }
    const types = FILTER_TYPE_MAP[historyFilter];
    return types.flatMap((type) =>
      getTransactionHistory(currentProfile.id, { type, limit: 10 }),
    );
  }, [currentProfile?.id, historyFilter, getTransactionHistory]);

  // ─── Helpers ────────────────────────────────────────────────────────────
  const formatNum = (n: number) => n.toLocaleString('ar-MA');
  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString('ar-MA', {
        day: 'numeric',
        month: 'short',
      });
    } catch {
      return iso;
    }
  };

  const getTxTypeInfo = (type: string) => TX_TYPE_LABELS[type] ?? { label: type, icon: CircleDot, color: 'text-muted-foreground', bg: 'bg-muted' };
  const getTxStatusInfo = (status: string) => TX_STATUS_MAP[status] ?? { label: status, cls: 'bg-muted text-muted-foreground', icon: AlertCircle };

  // ─── Action Handlers ────────────────────────────────────────────────────
  const handleBuyCoins = () => {
    setActiveSection('buy');
  };

  const handleSupport = () => {
    openSupportModal();
  };

  const handleEarn = () => {
    addToast('فرص الربح متاحة عبر التحديات والمهام والمنح — قريباً بتفاصيل أكثر', 'info');
  };

  const handleWithdraw = () => {
    if (!isFeatureEnabled('cashout_enabled')) {
      addToast('خدمة السحب غير مفعّلة حالياً', 'info');
      return;
    }
    navigate('cashout');
  };

  const handleHistory = () => {
    setActiveSection('history');
  };

  const handleBuyPackage = (pkg: { id: string; label: string }) => {
    addToast(`حزمة ${pkg.label} — قيد التكامل مع مزود الدفع`, 'info');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pb-24">
      {/* ═══ Header ═══ */}
      <motion.div {...fadeUp} className="flex items-center gap-3 py-4">
        <button
          onClick={() => goBack()}
          className="p-2 rounded-lg hover:bg-secondary transition-colors"
          aria-label="رجوع"
        >
          <ArrowRight className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-bold">محفظة سلطان</h1>
        <Badge variant="outline" className="border-sultan/30 text-sultan text-xs flex items-center gap-1">
          <Wallet className="h-3 w-3" />
          مركز المحفظة
        </Badge>
      </motion.div>

      {/* ═══ Balance Cards ═══ */}
      {activeSection === 'balance' && (
        <>
          {/* SC — Sultan Coins */}
          <motion.div {...fadeUp} transition={{ delay: 0.05 }} className="rounded-2xl overflow-hidden mb-4 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-sultan/30 via-sultan/10 to-royal-light z-0" />
            <div className="absolute inset-0 zellige-pattern opacity-20" />
            <div className="relative z-10 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-sultan/20 flex items-center justify-center">
                    <Coins className="h-5 w-5 text-sultan" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">عملات سلطان</p>
                    <p className="text-[10px] text-muted-foreground">SC — عملات قابلة للشراء والإنفاق</p>
                  </div>
                </div>
                <Badge variant="outline" className="border-sultan/30 text-sultan text-[10px]">SC</Badge>
              </div>
              <div className="flex items-end gap-2 mb-3">
                <h2 className="text-3xl font-bold text-gradient-sultan">{formatNum(coinsBalance)}</h2>
                <span className="text-sm text-sultan/60 mb-1">SC</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-black/20 rounded-lg p-2.5">
                  <p className="text-[10px] text-muted-foreground mb-0.5">متاح للاستخدام</p>
                  <p className="text-sm font-bold text-green-400">{formatNum(coinsAvailable)}</p>
                </div>
                <div className="bg-black/20 rounded-lg p-2.5">
                  <p className="text-[10px] text-muted-foreground mb-0.5">معلّق</p>
                  <p className="text-sm font-bold text-yellow-400">{formatNum(coinsPending)}</p>
                </div>
                <div className="bg-black/20 rounded-lg p-2.5">
                  <p className="text-[10px] text-muted-foreground mb-0.5">مُستلَم مدى الحياة</p>
                  <p className="text-sm font-bold text-cyan-400">{formatNum(coinsLifetimeReceived)}</p>
                </div>
                <div className="bg-black/20 rounded-lg p-2.5">
                  <p className="text-[10px] text-muted-foreground mb-0.5">مُرسَل مدى الحياة</p>
                  <p className="text-sm font-bold text-orange-400">{formatNum(coinsLifetimeGiven)}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* SR — Sultan Rewards */}
          <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="rounded-xl bg-card border border-border/50 p-5 mb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Gift className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-bold">مكافآت سلطان</p>
                  <p className="text-[10px] text-muted-foreground">SR — مكافآت مكتسبة من النشاط</p>
                </div>
              </div>
              <Badge variant="outline" className="border-green-500/30 text-green-400 text-[10px]">SR</Badge>
            </div>
            <div className="flex items-end gap-2 mb-3">
              <h2 className="text-2xl font-bold text-green-400">{formatNum(rewardsBalance)}</h2>
              <span className="text-sm text-green-400/60 mb-0.5">SR</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-secondary/40 rounded-lg p-2.5">
                <p className="text-[10px] text-muted-foreground mb-0.5">متاح للاستخدام</p>
                <p className="text-sm font-bold text-green-400">{formatNum(rewardsAvailable)}</p>
              </div>
              <div className="bg-secondary/40 rounded-lg p-2.5">
                <p className="text-[10px] text-muted-foreground mb-0.5">معلّق</p>
                <p className="text-sm font-bold text-yellow-400">{formatNum(rewardsPending)}</p>
              </div>
              <div className="bg-secondary/40 rounded-lg p-2.5">
                <p className="text-[10px] text-muted-foreground mb-0.5">قابل للسحب</p>
                <p className="text-sm font-bold text-cyan-400">{formatNum(withdrawableSR)}</p>
              </div>
            </div>
          </motion.div>

          {/* Pending SR — Pending Rewards */}
          <motion.div {...fadeUp} transition={{ delay: 0.15 }} className="rounded-xl bg-card border border-yellow-500/20 p-5 mb-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">مكافآت معلّقة</p>
                    <p className="text-[10px] text-yellow-400/70">SR — غير متاحة حتى تكتمل فترة الانتظار</p>
                  </div>
                </div>
                <Badge className="bg-yellow-500/10 text-yellow-400 border-0 text-[10px] flex items-center gap-1">
                  <Lock className="h-3 w-3" />
                  معلّقة
                </Badge>
              </div>
              <div className="flex items-end gap-2">
                <h2 className="text-2xl font-bold text-yellow-400">{formatNum(pendingRewardsAmount)}</h2>
                <span className="text-sm text-yellow-400/60 mb-0.5">SR</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-2">ستتحول تلقائياً إلى مكافآت متاحة بعد انتهاء فترة الانتظار</p>
            </div>
          </motion.div>

          {/* SP — Sultan Power */}
          <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="rounded-xl bg-card border border-sultan/20 p-5 mb-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-sultan/5 to-transparent" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-sultan/10 flex items-center justify-center">
                    <Zap className="h-5 w-5 text-sultan" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">قوة سلطان</p>
                    <p className="text-[10px] text-muted-foreground">SP — مؤشر تأثير وليس عملة مالية</p>
                  </div>
                </div>
                <Badge variant="outline" className="border-sultan/20 text-sultan text-[10px]">SP</Badge>
              </div>
              <div className="flex items-end gap-2 mb-2">
                <h2 className="text-2xl font-bold text-sultan">{formatNum(powerBalance)}</h2>
                <span className="text-sm text-sultan/60 mb-0.5">SP</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-[10px]">
                  <Trophy className="h-3 w-3 ml-1 text-sultan" />
                  غير قابل للشراء أو السحب
                </Badge>
                <Badge variant="secondary" className="text-[10px]">
                  <Zap className="h-3 w-3 ml-1 text-sultan" />
                  يُكتسب بالنشاط والتأثير
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground mt-2">قوة سلطان تعكس مستوى تأثيرك ومصداقيتك في المجتمع. كلما زادت نقاطك، ارتفع مستواك وظهرت شاراتك.</p>
            </div>
          </motion.div>

          {/* ═══ Action Buttons ═══ */}
          <motion.div {...fadeUp} transition={{ delay: 0.25 }} className="mb-6">
            <h3 className="font-bold text-sm flex items-center gap-2 mb-4">
              <Zap className="h-4 w-4 text-sultan" />
              إجراءات سريعة
            </h3>
            <div className="grid grid-cols-5 gap-2 sm:gap-3">
              <button
                onClick={handleBuyCoins}
                className="flex flex-col items-center gap-2 p-3 rounded-xl bg-card border border-border/50 hover:border-sultan/30 hover:bg-secondary/50 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-sultan/10 flex items-center justify-center group-hover:bg-sultan/20 transition-colors">
                  <ShoppingCart className="h-5 w-5 text-sultan" />
                </div>
                <span className="text-[11px] font-medium text-muted-foreground group-hover:text-foreground transition-colors">شراء عملات</span>
              </button>

              <button
                onClick={handleSupport}
                className="flex flex-col items-center gap-2 p-3 rounded-xl bg-card border border-border/50 hover:border-pink-500/30 hover:bg-secondary/50 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center group-hover:bg-pink-500/20 transition-colors">
                  <Heart className="h-5 w-5 text-pink-400" />
                </div>
                <span className="text-[11px] font-medium text-muted-foreground group-hover:text-foreground transition-colors">ادعم</span>
              </button>

              <button
                onClick={handleEarn}
                className="flex flex-col items-center gap-2 p-3 rounded-xl bg-card border border-border/50 hover:border-green-500/30 hover:bg-secondary/50 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                  <TrendingUp className="h-5 w-5 text-green-400" />
                </div>
                <span className="text-[11px] font-medium text-muted-foreground group-hover:text-foreground transition-colors">اربح</span>
              </button>

              <button
                onClick={handleWithdraw}
                className="flex flex-col items-center gap-2 p-3 rounded-xl bg-card border border-border/50 hover:border-cyan-500/30 hover:bg-secondary/50 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                  <ArrowDownLeft className="h-5 w-5 text-cyan-400" />
                </div>
                <span className="text-[11px] font-medium text-muted-foreground group-hover:text-foreground transition-colors">اسحب</span>
              </button>

              <button
                onClick={handleHistory}
                className="flex flex-col items-center gap-2 p-3 rounded-xl bg-card border border-border/50 hover:border-sultan/30 hover:bg-secondary/50 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-sultan/10 flex items-center justify-center group-hover:bg-sultan/20 transition-colors">
                  <History className="h-5 w-5 text-sultan" />
                </div>
                <span className="text-[11px] font-medium text-muted-foreground group-hover:text-foreground transition-colors">السجل</span>
              </button>
            </div>
          </motion.div>

          {/* ═══ Recent Transactions Preview ═══ */}
          <motion.div {...fadeUp} transition={{ delay: 0.3 }} className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <History className="h-4 w-4 text-sultan" />
                آخر العمليات
              </h3>
              <button
                onClick={() => setActiveSection('history')}
                className="text-[11px] text-sultan hover:text-sultan/80 transition-colors"
              >
                عرض الكل
              </button>
            </div>
            {transactions.length === 0 ? (
              <div className="rounded-xl bg-card border border-border/50 p-8 text-center">
                <Wallet className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">لا توجد عمليات بعد</p>
                <p className="text-[11px] text-muted-foreground/60 mt-1">ستظهر هنا جميع معاملاتك المالية</p>
              </div>
            ) : (
              <div className="rounded-xl bg-card border border-border/50 divide-y divide-border/30 overflow-hidden max-h-80 overflow-y-auto scrollbar-thin">
                {transactions.slice(0, 5).map((tx) => {
                  const txInfo = getTxTypeInfo(tx.type);
                  const stInfo = getTxStatusInfo(tx.status);
                  const isPositive = tx.type.includes('received') || tx.type.includes('earned') || tx.type.includes('reward') || tx.type.includes('grant') || tx.type.includes('bounty') || tx.type.includes('refund');
                  return (
                    <div key={tx.id} className="flex items-center gap-3 p-3 hover:bg-secondary/30 transition-colors">
                      <div className={`w-9 h-9 rounded-lg ${txInfo.bg} flex items-center justify-center shrink-0`}>
                        <txInfo.icon className={`h-4 w-4 ${txInfo.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{txInfo.label}</p>
                        <div className="flex items-center gap-2">
                          <p className="text-[11px] text-muted-foreground">{formatDate(tx.createdAt)}</p>
                          {tx.status !== 'completed' && (
                            <Badge className={`${stInfo.cls} border-0 text-[9px] px-1.5`}>
                              <stInfo.icon className="h-2.5 w-2.5 ml-0.5" />
                              {stInfo.label}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-end shrink-0">
                        <p className={`text-sm font-bold ${isPositive ? 'text-green-400' : 'text-foreground'}`}>
                          {isPositive ? '+' : '-'}{formatNum(tx.amount)}
                          <span className="text-[10px] text-muted-foreground font-normal mr-1">{tx.currency}</span>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </>
      )}

      {/* ═══ History Section (Full) ═══ */}
      {activeSection === 'history' && (
        <>
          <motion.div {...fadeUp} className="mb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <History className="h-4 w-4 text-sultan" />
                سجل العمليات
              </h3>
              <button
                onClick={() => setActiveSection('balance')}
                className="text-[11px] text-sultan hover:text-sultan/80 transition-colors"
              >
                العودة للرصيد
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-4">
              {HISTORY_FILTERS.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setHistoryFilter(f.key)}
                  className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                    historyFilter === f.key
                      ? 'bg-sultan text-sultan-foreground'
                      : 'bg-secondary text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {transactions.length === 0 ? (
              <div className="rounded-xl bg-card border border-border/50 p-8 text-center">
                <History className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">لا توجد عمليات</p>
                <p className="text-[11px] text-muted-foreground/60 mt-1">
                  {historyFilter !== 'all' ? 'لا توجد عمليات من هذا النوع' : 'ستظهر هنا جميع معاملاتك المالية'}
                </p>
              </div>
            ) : (
              <div className="rounded-xl bg-card border border-border/50 divide-y divide-border/30 overflow-hidden max-h-[60vh] overflow-y-auto scrollbar-thin">
                {transactions.map((tx) => {
                  const txInfo = getTxTypeInfo(tx.type);
                  const stInfo = getTxStatusInfo(tx.status);
                  const isPositive = tx.type.includes('received') || tx.type.includes('earned') || tx.type.includes('reward') || tx.type.includes('grant') || tx.type.includes('bounty') || tx.type.includes('refund');
                  return (
                    <div key={tx.id} className="flex items-center gap-3 p-3 hover:bg-secondary/30 transition-colors">
                      <div className={`w-9 h-9 rounded-lg ${txInfo.bg} flex items-center justify-center shrink-0`}>
                        <txInfo.icon className={`h-4 w-4 ${txInfo.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {tx.metadata?.description || txInfo.label}
                        </p>
                        <div className="flex items-center gap-2">
                          <p className="text-[11px] text-muted-foreground">{formatDate(tx.createdAt)}</p>
                          <Badge className={`${stInfo.cls} border-0 text-[9px] px-1.5`}>
                            {tx.status === 'completed' ? null : <stInfo.icon className="h-2.5 w-2.5 ml-0.5" />}
                            {stInfo.label}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-end shrink-0">
                        <p className={`text-sm font-bold ${isPositive ? 'text-green-400' : 'text-foreground'}`}>
                          {isPositive ? '+' : '-'}{formatNum(tx.amount)}
                          <span className="text-[10px] text-muted-foreground font-normal mr-1">{tx.currency}</span>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </>
      )}

      {/* ═══ Buy Coins Section ═══ */}
      {activeSection === 'buy' && (
        <>
          <motion.div {...fadeUp}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Coins className="h-4 w-4 text-sultan" />
                شراء عملات سلطان
              </h3>
              <button
                onClick={() => setActiveSection('balance')}
                className="text-[11px] text-sultan hover:text-sultan/80 transition-colors"
              >
                العودة للرصيد
              </button>
            </div>

            {/* Pending Integration Notice */}
            <div className="rounded-xl bg-yellow-500/5 border border-yellow-500/20 p-3 mb-4 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-400 shrink-0" />
              <p className="text-[11px] text-yellow-400/80">
                خدمة الشراء في طور التكامل مع مزود دفع مرخّص. الأسعار المعروضة تقريبية.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {coinPackages.map((pkg) => (
                <button
                  key={pkg.id}
                  onClick={() => handleBuyPackage(pkg)}
                  className={`relative rounded-xl bg-card border p-4 text-center transition-all hover:border-sultan/30 hover:bg-secondary/30 group ${
                    pkg.popular ? 'border-sultan/40 ring-1 ring-sultan/20' : 'border-border/50'
                  }`}
                >
                  {pkg.popular && (
                    <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-sultan text-sultan-foreground text-[9px] px-2 border-0">
                      الأكثر شعبية
                    </Badge>
                  )}
                  <Coins className="h-8 w-8 text-sultan/60 mx-auto mb-2 group-hover:text-sultan transition-colors" />
                  <p className="text-base font-bold text-foreground mb-0.5">{formatNum(pkg.coins)}</p>
                  <p className="text-[10px] text-muted-foreground mb-2">عملة سلطان</p>
                  {pkg.bonus > 0 && (
                    <p className="text-[10px] text-green-400 font-medium mb-2">+{formatNum(pkg.bonus)} مجاناً</p>
                  )}
                  <Separator className="my-2 bg-border/30" />
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-base font-bold text-sultan">{pkg.priceMAD}</span>
                    <span className="text-[11px] text-muted-foreground">درهم</span>
                  </div>
                  <Badge variant="outline" className="border-yellow-500/30 text-yellow-400 text-[8px] mt-2">
                    قيد التكامل
                  </Badge>
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}

      {/* ═══ Architecture Note ═══ */}
      <motion.div {...fadeUp} className="rounded-xl bg-sultan/5 border border-sultan/20 p-4 flex items-start gap-3 mt-4">
        <Shield className="h-5 w-5 text-sultan mt-0.5 shrink-0" />
        <div>
          <p className="font-semibold text-sm text-sultan">ملاحظة معمارية</p>
          <p className="text-xs text-muted-foreground mt-1">هذا النظام مصمم للتكامل مع مزود دفع مرخص. لا يتم أي معالجة مالية فعلية في هذه النسخة التجريبية. جميع الأرقام بيانات توضيحية.</p>
        </div>
      </motion.div>
    </div>
  );
}

'use client';
import { useState, useEffect, useMemo } from 'react';
import { useSultanStore } from '@/lib/store';
import { useEconomyStore } from '@/lib/economy';
import { CASHOUT_STATUS_LABELS } from '@/lib/economy/constants';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Wallet,
  Clock,
  Shield,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Loader2,
  Info,
  Banknote,
  Timer,
  FileText,
  ArrowDownLeft,
  Lock,
  CircleDot,
  type LucideIcon,
} from 'lucide-react';

const fadeUp = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };

// ─── KYC Status Map ──────────────────────────────────────────────────────────

const KYC_STATUS_MAP: Record<string, { label: string; icon: LucideIcon; color: string; bg: string }> = {
  not_required: { label: 'غير مطلوب', icon: ShieldCheck, color: 'text-green-400', bg: 'bg-green-400/10' },
  required:    { label: 'مطلوب', icon: ShieldAlert, color: 'text-orange-400', bg: 'bg-orange-400/10' },
  pending:     { label: 'قيد المراجعة', icon: Shield, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  verified:    { label: 'مُوثّق', icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  rejected:    { label: 'مرفوض', icon: ShieldX, color: 'text-red-400', bg: 'bg-red-400/10' },
  expired:     { label: 'منتهي الصلاحية', icon: ShieldX, color: 'text-gray-400', bg: 'bg-gray-400/10' },
  review:      { label: 'مراجعة يدوية', icon: Shield, color: 'text-purple-400', bg: 'bg-purple-400/10' },
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function CashoutCenter() {
  const { goBack, currentProfile, addToast } = useSultanStore();
  const {
    wallet,
    initWallet,
    getAvailableBalance,
    getPendingBalance,
    getRule,
    getCashoutEligibility,
    requestCashout,
    isFeatureEnabled,
    cashoutRequests,
    integrationStatus,
  } = useEconomyStore();

  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ─── Initialize wallet ───────────────────────────────────────────────────
  useEffect(() => {
    if (currentProfile?.id) {
      initWallet(currentProfile.id);
    }
  }, [currentProfile?.id, initWallet]);

  // ─── Derived data ────────────────────────────────────────────────────────
  const cashoutEnabled = isFeatureEnabled('cashout_enabled');
  const cashoutIntegration = integrationStatus.cashout;
  const isCashoutConfigured = cashoutIntegration?.configured ?? false;

  const minCashoutRule = getRule('min_cashout_sr');
  const maxCashoutRule = getRule('max_cashout_sr');
  const processingDaysRule = getRule('cashout_frequency_days');
  const pendingPeriodRule = getRule('pending_period_days');
  const feeRule = getRule('platform_fee_percent');

  const minCashout = (minCashoutRule?.value as number) ?? 500;
  const maxCashout = (maxCashoutRule?.value as number) ?? 50000;
  const processingDays = (processingDaysRule?.value as number) ?? 7;
  const pendingDays = (pendingPeriodRule?.value as number) ?? 7;
  const feePercent = (feeRule?.value as number) ?? 0;

  const availableSR = currentProfile?.id ? getAvailableBalance('SR') : 0;
  const pendingSR = currentProfile?.id ? getPendingBalance('SR') : 0;

  const eligibility = currentProfile?.id
    ? getCashoutEligibility(currentProfile.id)
    : null;

  const numericAmount = parseInt(amount, 10) || 0;
  const calculatedFee = feePercent > 0 ? Math.round((numericAmount * feePercent) / 100) : 0;
  const netAmount = numericAmount - calculatedFee;

  const userCashouts = useMemo(() => {
    if (!currentProfile?.id) return [];
    return cashoutRequests
      .filter((r: { userId: string }) => r.userId === currentProfile.id)
      .sort((a: { requestedAt: string }, b: { requestedAt: string }) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());
  }, [cashoutRequests, currentProfile?.id]);

  // ─── Helpers ────────────────────────────────────────────────────────────
  const formatNum = (n: number) => n.toLocaleString('ar-MA');
  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString('ar-MA', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return iso;
    }
  };

  const getStatusBadge = (status: string) => {
    const info = CASHOUT_STATUS_LABELS[status];
    if (!info) return <Badge variant="outline" className="text-xs">{status}</Badge>;
    return (
      <Badge
        variant="outline"
        className={`text-xs border-transparent ${info.bgColor} ${info.color}`}
      >
        {info.label}
      </Badge>
    );
  };

  const getKycInfo = (kycStatus: string) => {
    return KYC_STATUS_MAP[kycStatus] ?? { label: kycStatus, icon: CircleDot, color: 'text-muted-foreground', bg: 'bg-muted' };
  };

  // ─── Submit handler ─────────────────────────────────────────────────────
  const handleSubmit = async () => {
    setError('');

    if (!currentProfile?.id) {
      setError('يرجى تسجيل الدخول أولاً');
      return;
    }

    if (numericAmount < minCashout) {
      setError(`الحد الأدنى للسحب ${formatNum(minCashout)} SR`);
      return;
    }

    if (numericAmount > availableSR) {
      setError('المبلغ يتجاوز الرصيد المتاح');
      return;
    }

    if (numericAmount > maxCashout) {
      setError(`الحد الأقصى للسحب في عملية واحدة ${formatNum(maxCashout)} SR`);
      return;
    }

    setLoading(true);
    try {
      // Simulate a small delay for UX
      await new Promise((r) => setTimeout(r, 600));
      const result = requestCashout(currentProfile.id, numericAmount);
      if (result.success) {
        addToast('تم تقديم طلب السحب بنجاح', 'success');
        setAmount('');
      } else {
        setError(result.error ?? 'حدث خطأ غير متوقع');
      }
    } catch {
      setError('حدث خطأ أثناء تقديم الطلب');
    } finally {
      setLoading(false);
    }
  };

  const isFormDisabled = !cashoutEnabled || !isCashoutConfigured || !eligibility?.eligible;

  // ─── Render ─────────────────────────────────────────────────────────────
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
        <h1 className="text-xl font-bold">سحب المكافآت</h1>
        <Badge variant="outline" className="border-sultan/30 text-sultan text-xs flex items-center gap-1">
          <Banknote className="h-3 w-3" />
          مركز السحب
        </Badge>
      </motion.div>

      {/* ═══ Integration Status Badge ═══ */}
      {!isCashoutConfigured && (
        <motion.div {...fadeUp} transition={{ delay: 0.03 }} className="mb-4">
          <div className="rounded-xl border border-orange-500/30 bg-orange-500/5 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
              <AlertCircle className="h-5 w-5 text-orange-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-bold text-orange-400">قيد التكامل</span>
                <Badge variant="outline" className="text-[10px] border-orange-500/30 text-orange-400">
                  Pending Integration
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                خدمة السحب لا تزال قيد التكامل مع مزود الدفع. لن تتم عمليات السحب الحقيقية حتى يتم التكامل.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* ═══ Feature Disabled Message ═══ */}
      {!cashoutEnabled && (
        <motion.div {...fadeUp} transition={{ delay: 0.05 }} className="mb-4">
          <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-6 flex flex-col items-center text-center gap-3">
            <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center">
              <Lock className="h-7 w-7 text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-red-400 mb-1">السحب غير مفعّل حالياً</h3>
              <p className="text-sm text-muted-foreground">
                تم تعطيل خدمة السحب مؤقتاً من قبل الإدارة. يرجى المتابعة لاحقاً.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* ═══ Balance Overview Card ═══ */}
      <motion.div {...fadeUp} transition={{ delay: 0.07 }} className="rounded-xl bg-card border border-border/50 p-5 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-9 h-9 rounded-lg bg-sultan/20 flex items-center justify-center">
            <Wallet className="h-5 w-5 text-sultan" />
          </div>
          <div>
            <p className="text-sm font-bold">نظرة عامة على الرصيد</p>
            <p className="text-[10px] text-muted-foreground">SR — مكافآت سلطان قابلة للسحب</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Available */}
          <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4">
            <div className="flex items-center gap-1.5 mb-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-green-400" />
              <p className="text-[11px] text-muted-foreground">الرصيد المتاح للسحب</p>
            </div>
            <p className="text-xl font-bold text-green-400">{formatNum(availableSR)}</p>
            <p className="text-[10px] text-green-400/60 mt-0.5">≈ {formatNum(availableSR)} MAD</p>
          </div>

          {/* Pending */}
          <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-4">
            <div className="flex items-center gap-1.5 mb-2">
              <Clock className="h-3.5 w-3.5 text-yellow-400" />
              <p className="text-[11px] text-muted-foreground">المكافآت المعلّقة</p>
            </div>
            <p className="text-xl font-bold text-yellow-400">{formatNum(pendingSR)}</p>
            <p className="text-[10px] text-yellow-400/60 mt-0.5">≈ {formatNum(pendingSR)} MAD</p>
          </div>
        </div>
      </motion.div>

      {/* ═══ Cashout Info Grid ═══ */}
      <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {/* Minimum Cashout */}
        <div className="bg-card border border-border/50 rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Banknote className="h-3.5 w-3.5 text-sultan" />
            <p className="text-[10px] text-muted-foreground">الحد الأدنى للسحب</p>
          </div>
          <p className="text-sm font-bold">{formatNum(minCashout)} <span className="text-sultan text-xs">SR</span></p>
          <p className="text-[10px] text-muted-foreground">≈ {formatNum(minCashout)} MAD</p>
        </div>

        {/* Maximum Cashout */}
        <div className="bg-card border border-border/50 rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Banknote className="h-3.5 w-3.5 text-sultan" />
            <p className="text-[10px] text-muted-foreground">الحد الأقصى للسحب</p>
          </div>
          <p className="text-sm font-bold">{formatNum(maxCashout)} <span className="text-sultan text-xs">SR</span></p>
          <p className="text-[10px] text-muted-foreground">≈ {formatNum(maxCashout)} MAD</p>
        </div>

        {/* Processing Time */}
        <div className="bg-card border border-border/50 rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Timer className="h-3.5 w-3.5 text-cyan-400" />
            <p className="text-[10px] text-muted-foreground">مدة المعالجة المتوقعة</p>
          </div>
          <p className="text-sm font-bold">{processingDays} - {processingDays + 3} <span className="text-cyan-400 text-xs">أيام</span></p>
          <p className="text-[10px] text-muted-foreground">أيام عمل</p>
        </div>

        {/* Pending Period */}
        <div className="bg-card border border-border/50 rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Clock className="h-3.5 w-3.5 text-orange-400" />
            <p className="text-[10px] text-muted-foreground">فترة انتظار المكافآت</p>
          </div>
          <p className="text-sm font-bold">{pendingDays} <span className="text-orange-400 text-xs">يوم</span></p>
          <p className="text-[10px] text-muted-foreground">قبل التوفير</p>
        </div>
      </motion.div>

      {/* ═══ Eligibility Card ═══ */}
      {currentProfile?.id && eligibility && (
        <motion.div {...fadeUp} transition={{ delay: 0.13 }} className="rounded-xl bg-card border border-border/50 p-5 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-lg bg-sultan/20 flex items-center justify-center">
              <Shield className="h-5 w-5 text-sultan" />
            </div>
            <p className="text-sm font-bold">حالة الأهلية</p>
          </div>

          <div className="space-y-3">
            {/* Eligibility Status */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">حالة الأهلية</span>
              {eligibility.eligible ? (
                <Badge className="bg-green-500/10 text-green-400 border-transparent text-xs flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  مؤهل للسحب
                </Badge>
              ) : (
                <Badge className="bg-red-500/10 text-red-400 border-transparent text-xs flex items-center gap-1">
                  <XCircle className="h-3 w-3" />
                  غير مؤهل
                </Badge>
              )}
            </div>

            {/* Reason (if not eligible) */}
            {!eligibility.eligible && eligibility.reason && (
              <div className="rounded-lg bg-red-500/5 border border-red-500/20 p-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-400">{eligibility.reason}</p>
                </div>
              </div>
            )}

            <Separator className="bg-border/50" />

            {/* KYC Status */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">حالة التحقق (KYC)</span>
              {(() => {
                const kycInfo = getKycInfo(eligibility.kycStatus);
                const KycIcon = kycInfo.icon;
                return (
                  <Badge variant="outline" className={`text-xs border-transparent ${kycInfo.bg} ${kycInfo.color} flex items-center gap-1`}>
                    <KycIcon className="h-3 w-3" />
                    {kycInfo.label}
                  </Badge>
                );
              })()}
            </div>

            {/* Risk Status */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">مستوى المخاطر</span>
              <Badge
                variant="outline"
                className={`text-xs border-transparent ${
                  eligibility.riskStatus === 'low'
                    ? 'bg-green-400/10 text-green-400'
                    : eligibility.riskStatus === 'medium'
                      ? 'bg-yellow-400/10 text-yellow-400'
                      : eligibility.riskStatus === 'high'
                        ? 'bg-orange-400/10 text-orange-400'
                        : 'bg-red-400/10 text-red-400'
                }`}
              >
                {eligibility.riskStatus === 'low'
                  ? 'منخفض'
                  : eligibility.riskStatus === 'medium'
                    ? 'متوسط'
                    : eligibility.riskStatus === 'high'
                      ? 'عالي'
                      : 'حرج'}
              </Badge>
            </div>

            {/* Tax/Fee Info */}
            {feePercent > 0 && (
              <>
                <Separator className="bg-border/50" />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">رسوم المنصة</span>
                  <span className="text-xs font-bold text-sultan">{feePercent}%</span>
                </div>
                <p className="text-[10px] text-muted-foreground">
                  تُخصم رسوم المنصة من مبلغ السحب. المبلغ الصافي هو ما يصل لحسابك البنكي.
                </p>
              </>
            )}
          </div>
        </motion.div>
      )}

      {/* ═══ Cashout Form ═══ */}
      <motion.div {...fadeUp} transition={{ delay: 0.16 }} className="rounded-xl bg-card border border-border/50 p-5 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-9 h-9 rounded-lg bg-sultan/20 flex items-center justify-center">
            <ArrowDownLeft className="h-5 w-5 text-sultan" />
          </div>
          <p className="text-sm font-bold">طلب سحب</p>
        </div>

        <div className="space-y-4">
          {/* Amount Input */}
          <div>
            <label className="text-xs text-muted-foreground mb-2 block">
              مبلغ السحب (SR)
            </label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setError('');
                }}
                placeholder={`الحد الأدنى ${formatNum(minCashout)}`}
                disabled={isFormDisabled}
                min={minCashout}
                max={Math.min(availableSR, maxCashout)}
                className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 text-sm font-bold text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-sultan/50 focus:ring-1 focus:ring-sultan/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                dir="ltr"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <span className="text-xs text-muted-foreground font-bold">SR</span>
              </div>
            </div>
          </div>

          {/* Quick Amount Buttons */}
          {!isFormDisabled && availableSR > 0 && (
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'الكل', value: Math.min(availableSR, maxCashout) },
                { label: 'نصف', value: Math.floor(Math.min(availableSR, maxCashout) / 2) },
                { label: formatNum(minCashout), value: minCashout },
              ].map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => setAmount(String(preset.value))}
                  className="px-3 py-1.5 rounded-lg bg-sultan/10 text-sultan text-xs font-bold hover:bg-sultan/20 transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          )}

          {/* Fees Breakdown */}
          {numericAmount > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="rounded-lg bg-background border border-border/30 p-4 space-y-2.5"
            >
              <p className="text-xs font-bold text-muted-foreground mb-3">تفاصيل السحب</p>

              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">المبلغ المطلوب</span>
                <span className="text-sm font-bold">{formatNum(numericAmount)} SR</span>
              </div>

              {calculatedFee > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">رسوم المنصة ({feePercent}%)</span>
                  <span className="text-sm font-bold text-red-400">-{formatNum(calculatedFee)} SR</span>
                </div>
              )}

              <Separator className="bg-border/50" />

              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">المبلغ الصافي</span>
                <span className="text-sm font-bold text-green-400">{formatNum(netAmount)} SR</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">سيُحوّل إلى</span>
                <span className="text-sm font-bold text-sultan">{formatNum(netAmount)} MAD</span>
              </div>
            </motion.div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 p-3"
            >
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
              <p className="text-xs text-red-400">{error}</p>
            </motion.div>
          )}

          {/* Confirm Button */}
          <button
            onClick={handleSubmit}
            disabled={isFormDisabled || loading || numericAmount <= 0}
            className="w-full py-3 rounded-xl bg-sultan text-black font-bold text-sm flex items-center justify-center gap-2 hover:bg-sultan/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>جاري التقديم...</span>
              </>
            ) : isFormDisabled ? (
              <>
                <Lock className="h-4 w-4" />
                <span>السحب غير متاح حالياً</span>
              </>
            ) : (
              <>
                <ArrowDownLeft className="h-4 w-4" />
                <span>تأكيد السحب — {formatNum(numericAmount)} MAD</span>
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* ═══ Cashout History ═══ */}
      <motion.div {...fadeUp} transition={{ delay: 0.19 }} className="rounded-xl bg-card border border-border/50 p-5 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-sultan/20 flex items-center justify-center">
              <FileText className="h-5 w-5 text-sultan" />
            </div>
            <p className="text-sm font-bold">سجل طلبات السحب</p>
          </div>
          {userCashouts.length > 0 && (
            <Badge variant="outline" className="text-[10px] text-muted-foreground">
              {userCashouts.length} طلب
            </Badge>
          )}
        </div>

        {userCashouts.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-3">
              <FileText className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">لا توجد طلبات سحب بعد</p>
            <p className="text-[10px] text-muted-foreground/60 mt-1">
              ستظهر طلبات السحب هنا بعد تقديم أول طلب
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
            {userCashouts.map((req) => (
              <motion.div
                key={req.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className="rounded-lg bg-background border border-border/30 p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-bold">{formatNum(req.amount)} <span className="text-sultan text-xs">SR</span></p>
                    <p className="text-[10px] text-muted-foreground">≈ {formatNum(req.amount)} MAD</p>
                  </div>
                  {getStatusBadge(req.status)}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground">
                      {formatDate(req.requestedAt)}
                    </span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    {req.method === 'bank_transfer' ? 'تحويل بنكي' : req.method}
                  </span>
                </div>

                {req.rejectionReason && (
                  <div className="mt-2 pt-2 border-t border-border/30">
                    <p className="text-[10px] text-red-400">{req.rejectionReason}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* ═══ Integration Note ═══ */}
      <motion.div {...fadeUp} transition={{ delay: 0.22 }}>
        <div className="rounded-xl border border-border/30 bg-muted/30 p-4">
          <div className="flex items-start gap-3">
            <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-muted-foreground mb-1">ملاحظة التكامل</p>
              <p className="text-[11px] text-muted-foreground/70 leading-relaxed">
                لا يوجد مزود سحب حقيقي مُهيأ حالياً. جميع عمليات السحب هي محاكاة لأغراض التطوير والاختبار.
                سيتم ربط مزود دفع حقيقي (مثل CIH Bank أو PayPal) عند اكتمال مرحلة التكامل.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

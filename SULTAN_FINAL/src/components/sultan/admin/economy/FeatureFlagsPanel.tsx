'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useEconomyStore } from '@/lib/economy';
import { useSultanStore } from '@/lib/store';
import {
  ToggleLeft,
  ToggleRight,
  AlertTriangle,
  Pause,
  Play,
  ShoppingCart,
  Heart,
  ArrowRightLeft,
  Gift,
  ArrowDownLeft,
  Megaphone,
  HandCoins,
  Shield,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';

// ─── Animation ──────────────────────────────────────────────────────────────

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.06 } },
};

// ─── Feature Category Config ───────────────────────────────────────────────

const FEATURE_CATEGORY_CONFIG: Record<
  string,
  { labelAr: string; icon: LucideIcon; color: string; bg: string }
> = {
  economy: { labelAr: 'الاقتصاد', icon: Zap, color: 'text-amber-400', bg: 'bg-amber-400/10' },
  support: { labelAr: 'الدعم', icon: Heart, color: 'text-rose-400', bg: 'bg-rose-400/10' },
  rewards: { labelAr: 'المكافآت', icon: Gift, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  cashout: { labelAr: 'السحب', icon: ArrowDownLeft, color: 'text-red-400', bg: 'bg-red-400/10' },
  grants: { labelAr: 'المنح', icon: HandCoins, color: 'text-violet-400', bg: 'bg-violet-400/10' },
  tasks: { labelAr: 'المهام', icon: Shield, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
  bounties: { labelAr: 'الجوائز', icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  challenges: { labelAr: 'التحديات', icon: Shield, color: 'text-orange-400', bg: 'bg-orange-400/10' },
  growth: { labelAr: 'النمو', icon: Megaphone, color: 'text-pink-400', bg: 'bg-pink-400/10' },
  news: { labelAr: 'الأخبار', icon: Zap, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  business: { labelAr: 'الأعمال', icon: ShoppingCart, color: 'text-teal-400', bg: 'bg-teal-400/10' },
  diaspora: { labelAr: 'المغاربة بالخارج', icon: ArrowRightLeft, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
};

// ─── Emergency Controls Config ─────────────────────────────────────────────

const EMERGENCY_CONTROLS = [
  { key: 'coin_purchases', labelAr: 'شراء العملات', icon: ShoppingCart },
  { key: 'support', labelAr: 'الدعم المالي', icon: Heart },
  { key: 'transfers', labelAr: 'التحويلات', icon: ArrowRightLeft },
  { key: 'rewards', labelAr: 'المكافآت', icon: Gift },
  { key: 'cashouts', labelAr: 'السحوبات', icon: ArrowDownLeft },
  { key: 'growth_campaigns', labelAr: 'حملات النمو', icon: Megaphone },
  { key: 'grants', labelAr: 'المنح', icon: HandCoins },
] as const;

// ─── Component ──────────────────────────────────────────────────────────────

export default function FeatureFlagsPanel() {
  const featureFlags = useEconomyStore((s) => s.featureFlags);
  const toggleFeature = useEconomyStore((s) => s.toggleFeature);
  const emergencyPauses = useEconomyStore((s) => s.emergencyPauses);
  const pauseFeature = useEconomyStore((s) => s.pauseFeature);
  const unpauseFeature = useEconomyStore((s) => s.unpauseFeature);
  const currentProfile = useSultanStore((s) => s.currentProfile);

  // ─── Check if any feature is paused ──────────────────────────────────────

  const hasPausedFeatures = useMemo(() => {
    return Object.values(emergencyPauses).some((v) => v === true);
  }, [emergencyPauses]);

  const pausedCount = useMemo(() => {
    return Object.values(emergencyPauses).filter((v) => v === true).length;
  }, [emergencyPauses]);

  // ─── Handlers ───────────────────────────────────────────────────────────

  const handleToggle = (key: string) => {
    toggleFeature(key, currentProfile?.id ?? 'admin-001');
  };

  const handlePauseToggle = (featureKey: string) => {
    if (emergencyPauses[featureKey]) {
      unpauseFeature(featureKey);
    } else {
      pauseFeature(featureKey);
    }
  };

  // ─── Render ─────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6" dir="rtl">
      {/* ─── Warning Banner ──────────────────────────────────────────────── */}
      {hasPausedFeatures && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-orange-500/20 bg-orange-500/10">
            <AlertTriangle className="w-5 h-5 text-orange-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-orange-300">
                بعض الميزات متوقفة مؤقتاً
              </p>
              <p className="text-xs text-orange-400/70 mt-0.5">
                {pausedCount} ميزة متوقفة حالياً — يمكن إعادتها من قسم التحكم الطارئ أدناه
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* ─── Header ──────────────────────────────────────────────────────── */}
      <motion.div {...fadeUp}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(212,175,55,0.15)' }}
              >
                <ToggleLeft className="w-5 h-5" style={{ color: '#D4AF37' }} />
              </div>
              ميزات النظام
            </h2>
            <p className="text-sm text-gray-400 mt-1 mr-13">
              تفعيل وإيقاف ميزات الاقتصاد
            </p>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3 mr-13 sm:mr-0">
            <div className="text-center px-3 py-1.5 rounded-lg bg-emerald-400/10">
              <p className="text-lg font-bold text-emerald-400">
                {featureFlags.filter((f) => f.enabled).length}
              </p>
              <p className="text-[10px] text-emerald-400/70">مفعّل</p>
            </div>
            <div className="text-center px-3 py-1.5 rounded-lg bg-red-400/10">
              <p className="text-lg font-bold text-red-400">
                {featureFlags.filter((f) => !f.enabled).length}
              </p>
              <p className="text-[10px] text-red-400/70">معطّل</p>
            </div>
          </div>
        </div>
      </motion.div>

      <Separator className="bg-white/5" />

      {/* ─── Feature Flags List ───────────────────────────────────────────── */}
      <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-3">
        {featureFlags.map((flag) => {
          const catConfig = FEATURE_CATEGORY_CONFIG[flag.category] ?? {
            labelAr: flag.category,
            icon: Zap,
            color: 'text-gray-400',
            bg: 'bg-gray-400/10',
          };
          const CatIcon = catConfig.icon;

          return (
            <motion.div key={flag.key} {...fadeUp}>
              <Card
                className="border-white/5 bg-white/[0.03] backdrop-blur-sm hover:border-white/10 transition-colors"
              >
                <div className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {/* Icon */}
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${catConfig.bg}`}
                      >
                        <CatIcon className={`w-4 h-4 ${catConfig.color}`} />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium text-white">
                            {flag.labelAr}
                          </span>
                          <Badge
                            variant="outline"
                            className={`${catConfig.color} ${catConfig.bg} border-0 text-[10px] px-1.5 py-0`}
                          >
                            {catConfig.labelAr}
                          </Badge>
                          {/* Paused override indicator */}
                          {emergencyPauses[flag.key] && (
                            <Badge
                              variant="outline"
                              className="text-orange-400 bg-orange-400/10 border-0 text-[10px] px-1.5 py-0 flex items-center gap-1"
                            >
                              <Pause className="w-2.5 h-2.5" />
                              متوقف طوارئ
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5 truncate">
                          {flag.description}
                        </p>
                      </div>
                    </div>

                    {/* Toggle */}
                    <div className="flex items-center gap-2 shrink-0">
                      {flag.enabled ? (
                        <span className="text-xs text-emerald-400 hidden sm:inline">مفعّل</span>
                      ) : (
                        <span className="text-xs text-red-400 hidden sm:inline">معطّل</span>
                      )}
                      <Switch
                        checked={flag.enabled}
                        onCheckedChange={() => handleToggle(flag.key)}
                        className="data-[state=checked]:bg-amber-500 data-[state=unchecked]:bg-gray-700"
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ─── Emergency Controls ───────────────────────────────────────────── */}
      <Separator className="bg-white/5" />

      <motion.div {...fadeUp}>
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(239,68,68,0.15)' }}
          >
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">التحكم الطارئ</h3>
            <p className="text-xs text-gray-500">إيقاف مؤقت لميزات محددة في حالات الطوارئ</p>
          </div>
        </div>
      </motion.div>

      <motion.div variants={stagger} initial="initial" animate="animate" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {EMERGENCY_CONTROLS.map((ctrl) => {
          const isPaused = emergencyPauses[ctrl.key] ?? false;
          const CtrlIcon = ctrl.icon;

          return (
            <motion.div key={ctrl.key} {...fadeUp}>
              <Card
                className={`border transition-colors ${
                  isPaused
                    ? 'border-orange-500/20 bg-orange-500/5'
                    : 'border-white/5 bg-white/[0.03]'
                }`}
              >
                <div className="p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                          isPaused ? 'bg-orange-400/15' : 'bg-white/5'
                        }`}
                      >
                        <CtrlIcon
                          className={`w-4 h-4 ${isPaused ? 'text-orange-400' : 'text-gray-400'}`}
                        />
                      </div>
                      <div className="min-w-0">
                        <p
                          className={`text-sm font-medium ${isPaused ? 'text-orange-300' : 'text-white'}`}
                        >
                          {ctrl.labelAr}
                        </p>
                        <p className="text-[11px] text-gray-600">
                          {isPaused ? 'متوقف مؤقتاً' : 'يعمل بشكل طبيعي'}
                        </p>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePauseToggle(ctrl.key)}
                      className={`h-8 w-8 p-0 shrink-0 ${
                        isPaused
                          ? 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10'
                          : 'text-orange-400 hover:text-orange-300 hover:bg-orange-400/10'
                      }`}
                    >
                      {isPaused ? (
                        <Play className="w-4 h-4" />
                      ) : (
                        <Pause className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Empty State */}
      {featureFlags.length === 0 && (
        <motion.div {...fadeUp} className="text-center py-16">
          <ToggleRight className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500">لا توجد ميزات حالياً</p>
        </motion.div>
      )}
    </div>
  );
}

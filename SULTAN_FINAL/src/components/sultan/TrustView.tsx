'use client';
import { useSultanStore } from '@/lib/store';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, ShieldCheck, ShieldAlert, ShieldX, Star, Users, Activity, Award, Flag, Eye, CheckCircle2, Clock, AlertTriangle, TrendingUp, FileWarning } from 'lucide-react';

const scores = [
  { label: 'التحقق من الهوية', score: 90, icon: ShieldCheck, color: 'text-green-400' },
  { label: 'السمعة', score: 78, icon: Star, color: 'text-sultan' },
  { label: 'النشاط', score: 85, icon: Activity, color: 'text-blue-400' },
  { label: 'التقييم كبائع', score: 92, icon: Award, color: 'text-purple-400' },
  { label: 'التقييم كمزود خدمة', score: 70, icon: Users, color: 'text-orange-400' },
];

const overallScore = 83;

const levels = [
  { key: 'unverified', label: 'غير موثق', icon: ShieldX, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
  { key: 'basic', label: 'تحقق أساسي', icon: Shield, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
  { key: 'verified', label: 'موثق', icon: ShieldCheck, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  { key: 'trusted', label: 'موثوق', icon: Award, color: 'text-sultan', bg: 'bg-sultan/10', border: 'border-sultan/20' },
];

const fraudIndicators = [
  { label: 'حسابات وهمية', status: 'منخفض', statusColor: 'text-green-400', score: 2 },
  { label: 'إعلانات مكررة', status: 'منخفض', statusColor: 'text-green-400', score: 5 },
  { label: 'تلاعب بالتقييمات', status: 'منخفض', statusColor: 'text-green-400', score: 1 },
  { label: 'محتوى مضلل', status: 'متوسط', statusColor: 'text-yellow-400', score: 12 },
];

const reviewMetrics = [
  { label: 'المراجعات الحقيقية', value: '94%', trend: '+2%' },
  { label: 'متوسط التقييم العام', value: '4.6/5', trend: '+0.1' },
  { label: 'المراجعات المحذوفة', value: '23', trend: '-5' },
  { label: 'حالات الاحتيال', value: '7', trend: '-3' },
];

const moderationQueue = [
  { id: 'mq-1', type: 'إعلان', desc: 'محتوى مشبوه — إلكترونيات', priority: 'عالي', time: 'منذ 5 دقائق' },
  { id: 'mq-2', type: 'مراجعة', desc: 'مراجعة سلبية متكررة', priority: 'متوسط', time: 'منذ 15 دقيقة' },
  { id: 'mq-3', type: 'حساب', desc: 'حساب جديد مشبوه', priority: 'عالي', time: 'منذ 22 دقيقة' },
];

const fadeUp = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };

export default function TrustView() {
  const { navigate, addToast } = useSultanStore();

  const scoreColor = (s: number) => s >= 80 ? 'text-green-400' : s >= 60 ? 'text-sultan' : s >= 40 ? 'text-yellow-400' : 'text-red-400';
  const priorityColors: Record<string, string> = { 'عالي': 'bg-red-500/10 text-red-400', 'متوسط': 'bg-yellow-500/10 text-yellow-400', 'منخفض': 'bg-green-500/10 text-green-400' };

  return (
    <div className="max-w-4xl mx-auto px-4 pb-20">
      {/* Header */}
      <div className="flex items-center gap-3 py-4">
        <button onClick={() => navigate('home')} className="p-2 rounded-lg hover:bg-secondary transition-colors"><ArrowRight className="h-5 w-5" /></button>
        <h1 className="text-xl font-bold">مركز الثقة والتحقق</h1>
        <Badge variant="outline" className="border-sultan/30 text-sultan text-xs">DEMO</Badge>
      </div>

      {/* Overall Score */}
      <motion.div {...fadeUp} className="rounded-2xl bg-card border border-sultan/20 p-6 mb-6 sultan-glow text-center">
        <p className="text-sm text-muted-foreground mb-3">معدل الثقة العام</p>
        <div className="relative w-36 h-36 mx-auto mb-4">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" className="text-secondary" strokeWidth="8" />
            <circle cx="60" cy="60" r="52" fill="none" stroke="url(#scoreGrad)" strokeWidth="8" strokeLinecap="round"
              strokeDasharray={`${(overallScore / 100) * 327} 327`} />
            <defs><linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#D4AF37" /><stop offset="100%" stopColor="#F0D060" /></linearGradient></defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-4xl font-bold ${scoreColor(overallScore)}`}>{overallScore}</span>
          </div>
        </div>
        <p className="text-sm font-medium text-sultan">مستوى: موثوق</p>
      </motion.div>

      {/* Score Breakdown */}
      <motion.div {...fadeUp} className="rounded-xl bg-card border border-border/50 p-5 mb-6">
        <h3 className="font-bold text-sm flex items-center gap-2 mb-4"><ShieldCheck className="h-4 w-4 text-sultan" />تفاصيل النقاط</h3>
        <div className="space-y-4">
          {scores.map(s => (
            <div key={s.label}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2 text-sm"><s.icon className={`h-4 w-4 ${s.color}`} />{s.label}</div>
                <span className={`text-sm font-bold ${s.color}`}>{s.score}%</span>
              </div>
              <Progress value={s.score} className="h-2" />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Verification Levels */}
      <motion.div {...fadeUp} className="mb-6">
        <h3 className="font-bold text-sm flex items-center gap-2 mb-3"><Shield className="h-4 w-4 text-sultan" />مستويات التحقق</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {levels.map(lvl => (
            <div key={lvl.key} className={`rounded-xl ${lvl.bg} border ${lvl.border} p-4 text-center`}>              <lvl.icon className={`h-6 w-6 mx-auto mb-2 ${lvl.color}`} />              <p className={`text-sm font-semibold ${lvl.color}`}>{lvl.label}</p>            </div>
          ))}
        </div>
      </motion.div>

      {/* Fraud Detection */}
      <motion.div {...fadeUp} className="rounded-xl bg-card border border-border/50 p-5 mb-6">
        <h3 className="font-bold text-sm flex items-center gap-2 mb-4"><ShieldAlert className="h-4 w-4 text-sultan" />مؤشرات كشف الاحتيال</h3>
        <div className="space-y-3">
          {fraudIndicators.map(f => (
            <div key={f.label} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
              <div className="flex items-center gap-2 text-sm"><AlertTriangle className="h-4 w-4 text-muted-foreground" />{f.label}</div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">{f.score}%</span>
                <Badge className={`${priorityColors[f.status]} border-0 text-[10px]`}>{f.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Review Integrity */}
      <motion.div {...fadeUp} className="rounded-xl bg-card border border-border/50 p-5 mb-6">
        <h3 className="font-bold text-sm flex items-center gap-2 mb-4"><Star className="h-4 w-4 text-sultan" />مقاييس سلامة المراجعات</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {reviewMetrics.map(m => (
            <div key={m.label} className="rounded-lg bg-secondary/30 p-3 text-center">
              <p className="text-lg font-bold">{m.value}</p>
              <p className="text-[11px] text-muted-foreground mt-1">{m.label}</p>
              <span className={`text-[10px] ${m.trend.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>{m.trend}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Reporting Tools */}
      <motion.div {...fadeUp} className="rounded-xl bg-card border border-border/50 p-5 mb-6">
        <h3 className="font-bold text-sm flex items-center gap-2 mb-4"><Flag className="h-4 w-4 text-sultan" />أدوات الإبلاغ</h3>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {['إبلاغ عن إعلان', 'إبلاغ عن مستخدم', 'إبلاغ عن مراجعة', 'إبلاغ عن محتوى', 'طلب وساطة', 'بلاغ احتيال'].map(label => (
            <Button key={label} variant="outline" className="h-auto py-3 text-xs hover:border-sultan/30 hover:text-sultan" onClick={() => addToast(`تم تقديم البلاغ [DEMO]`, 'info')}>
              <Flag className="h-3.5 w-3.5 me-2" />{label}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Moderation Queue */}
      <motion.div {...fadeUp} className="rounded-xl bg-card border border-border/50 p-5">
        <h3 className="font-bold text-sm flex items-center gap-2 mb-4"><FileWarning className="h-4 w-4 text-sultan" />طابور المراجعة</h3>
        <div className="space-y-2">
          {moderationQueue.map(item => (
            <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
              <Badge variant="secondary" className="text-[10px] shrink-0">{item.type}</Badge>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.desc}</p>
                <p className="text-[11px] text-muted-foreground">{item.time}</p>
              </div>
              <Badge className={`${priorityColors[item.priority]} border-0 text-[10px]`}>{item.priority}</Badge>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
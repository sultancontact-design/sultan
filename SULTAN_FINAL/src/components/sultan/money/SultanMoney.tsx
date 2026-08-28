'use client';
import { useSultanStore } from '@/lib/store';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, Wallet, Send, Download, CreditCard, QrCode, Zap, CheckCircle2, Clock, XCircle, Droplets, Zap as Bolt, Wifi, Shield, ArrowUpRight, ArrowDownLeft, Info } from 'lucide-react';

const transactions = [
  { id: 't-1', type: 'send', icon: ArrowUpRight, desc: 'تحويل إلى فاطمة الزهراء', amount: -200, date: '2026-08-19', status: 'completed' },
  { id: 't-2', type: 'receive', icon: ArrowDownLeft, desc: 'استقبال من يوسف بنعلي', amount: 500, date: '2026-08-19', status: 'completed' },
  { id: 't-3', type: 'payment', icon: CreditCard, desc: 'دفع لمتجر الإلكترونيات', amount: -350, date: '2026-08-18', status: 'completed' },
  { id: 't-4', type: 'receive', icon: ArrowDownLeft, desc: 'استرداد طلب إلغاء', amount: 120, date: '2026-08-18', status: 'completed' },
  { id: 't-5', type: 'send', icon: ArrowUpRight, desc: 'تحويل إلى حمزة الرباطي', amount: -150, date: '2026-08-17', status: 'pending' },
  { id: 't-6', type: 'payment', icon: QrCode, desc: 'دفع عبر QR - مقهى النخيل', amount: -45, date: '2026-08-17', status: 'completed' },
  { id: 't-7', type: 'receive', icon: ArrowDownLeft, desc: 'أرباح بيع هاتف سامسونغ', amount: 2800, date: '2026-08-16', status: 'completed' },
  { id: 't-8', type: 'send', icon: ArrowUpRight, desc: 'تبرع لحالة تضامن', amount: -50, date: '2026-08-16', status: 'completed' },
  { id: 't-9', type: 'payment', icon: CreditCard, desc: 'اشتراك سلطان برو', amount: -30, date: '2026-08-15', status: 'completed' },
  { id: 't-10', type: 'receive', icon: ArrowDownLeft, desc: 'كاشباك من راتب يوليو', amount: 2000, date: '2026-08-15', status: 'pending' },
];

const bills = [
  { id: 'b-1', label: 'الماء', icon: Droplets, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { id: 'b-2', label: 'الكهرباء', icon: Bolt, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  { id: 'b-3', label: 'الإنترنت', icon: Wifi, color: 'text-purple-400', bg: 'bg-purple-400/10' },
];

const statusMap: Record<string, { label: string; cls: string; icon: any }> = {
  completed: { label: 'مكتمل', cls: 'bg-green-500/10 text-green-400', icon: CheckCircle2 },
  pending: { label: 'قيد الانتظار', cls: 'bg-yellow-500/10 text-yellow-400', icon: Clock },
  failed: { label: 'فشل', cls: 'bg-red-500/10 text-red-400', icon: XCircle },
};

const fadeUp = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };

export default function SultanMoney() {
  const { goBack, addToast, currentProfile } = useSultanStore();

  return (
    <div className="max-w-4xl mx-auto px-4 pb-20">
      {/* Header */}
      <div className="flex items-center gap-3 py-4">
        <button onClick={() => goBack()} className="p-2 rounded-lg hover:bg-secondary transition-colors"><ArrowRight className="h-5 w-5" /></button>
        <h1 className="text-xl font-bold">محفظة سلطان</h1>
        <Badge variant="outline" className="border-sultan/30 text-sultan text-xs flex items-center gap-1"><Wallet className="h-3 w-3" />MAD</Badge>
      </div>

      {/* Balance Card */}
      <motion.div {...fadeUp} className="rounded-2xl overflow-hidden mb-6 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-sultan/30 via-sultan/10 to-royal-light z-0" />
        <div className="absolute inset-0 zellige-pattern opacity-20" />
        <div className="relative z-10 p-6">
          <p className="text-sm text-muted-foreground mb-1">الرصيد الحالي</p>
          <div className="flex items-end gap-2">
            <h2 className="text-4xl font-bold text-gradient-sultan">{currentProfile?.coinsBalance.toLocaleString() || '0'}</h2>
            <span className="text-lg text-sultan/70 mb-1">درهم</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">آخر تحديث: 19 أغسطس 2026 — [DEMO]</p>

          {/* Quick Actions */}
          <div className="grid grid-cols-4 gap-3 mt-6">
            {[
              { label: 'تحويل', icon: Send },
              { label: 'استقبال', icon: Download },
              { label: 'دفع', icon: CreditCard },
              { label: 'QR', icon: QrCode },
            ].map(action => (
              <button key={action.label} onClick={() => addToast(`${action.label} — قريبا [DEMO]`, 'info')}
                className="flex flex-col items-center gap-2 p-3 rounded-xl bg-black/20 hover:bg-black/30 transition-colors">
                <action.icon className="h-5 w-5 text-sultan" />
                <span className="text-xs font-medium">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Transaction History */}
      <motion.div {...fadeUp} className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-sm flex items-center gap-2"><Zap className="h-4 w-4 text-sultan" />آخر العمليات</h3>
          <Badge variant="secondary" className="text-[10px]">DEMO</Badge>
        </div>
        <div className="rounded-xl bg-card border border-border/50 divide-y divide-border/30 overflow-hidden">
          {transactions.map(tx => {
            const st = statusMap[tx.status];
            return (
              <div key={tx.id} className="flex items-center gap-3 p-3 hover:bg-secondary/30 transition-colors">
                <div className={`w-9 h-9 rounded-lg ${tx.amount > 0 ? 'bg-green-500/10' : 'bg-red-500/10'} flex items-center justify-center shrink-0`}>
                  <tx.icon className={`h-4 w-4 ${tx.amount > 0 ? 'text-green-400' : 'text-red-400'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{tx.desc}</p>
                  <p className="text-[11px] text-muted-foreground">{tx.date}</p>
                </div>
                <div className="text-end shrink-0">
                  <p className={`text-sm font-bold ${tx.amount > 0 ? 'text-green-400' : 'text-foreground'}`}>
                    {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()} <span className="text-[10px] text-muted-foreground font-normal">درهم</span>
                  </p>
                  <Badge className={`${st.cls} border-0 text-[9px] mt-0.5`}>{st.label}</Badge>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Merchant Payments — Coming Soon */}
      <motion.div {...fadeUp} className="rounded-xl bg-card border border-border/50 p-5 mb-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sultan/5 to-transparent" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm flex items-center gap-2"><CreditCard className="h-4 w-4 text-sultan" />مدفوعات التجار</h3>
            <Badge className="bg-sultan/10 text-sultan border-0 text-[10px]">قريبا</Badge>
          </div>
          <p className="text-xs text-muted-foreground mb-3">ادفع مباشرة عند التجار المعتمدين عبر مسح QR أو رقم الهاتف</p>
          <div className="grid grid-cols-3 gap-3">
            {['سوبر ماركت', 'صيدلية', 'مطعم'].map(label => (
              <div key={label} className="rounded-lg bg-secondary/30 p-3 text-center text-xs text-muted-foreground">
                <QrCode className="h-6 w-6 mx-auto mb-1 text-muted-foreground/40" />{label}
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Bills */}
      <motion.div {...fadeUp} className="rounded-xl bg-card border border-border/50 p-5 mb-6">
        <h3 className="font-bold text-sm flex items-center gap-2 mb-4"><CreditCard className="h-4 w-4 text-sultan" />الفواتير</h3>
        <div className="grid grid-cols-3 gap-3">
          {bills.map(bill => (
            <button key={bill.id} onClick={() => addToast(`دفع فاتورة ${bill.label} — قريبا [DEMO]`, 'info')}
              className="rounded-xl bg-secondary/30 p-4 text-center hover:bg-secondary/50 transition-colors group">
              <div className={`w-10 h-10 rounded-lg ${bill.bg} flex items-center justify-center mx-auto mb-2`}><bill.icon className={`h-5 w-5 ${bill.color}`} /></div>
              <p className="text-xs font-medium group-hover:text-sultan transition-colors">{bill.label}</p>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Architecture Note */}
      <motion.div {...fadeUp} className="rounded-xl bg-sultan/5 border border-sultan/20 p-4 flex items-start gap-3">
        <Shield className="h-5 w-5 text-sultan mt-0.5 shrink-0" />
        <div>
          <p className="font-semibold text-sm text-sultan">ملاحظة معمارية</p>
          <p className="text-xs text-muted-foreground mt-1">هذا النظام مصمم للتكامل مع مزود دفع مرخص. لا يتم أي معالجة مالية فعلية في هذه النسخة التجريبية. جميع الأرقام بيانات توضيحية [DEMO].</p>
        </div>
      </motion.div>
    </div>
  );
}
'use client';
import { useState } from 'react';
import { useSultanStore } from '@/lib/store';
import { adminStats, featureFlags } from '@/lib/seed-data';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, ShoppingBag, TrendingUp, DollarSign, Gavel, Wallet, Ticket, Activity, Settings, Shield, FileText, Megaphone, Brain, BarChart3, CheckCircle2, XCircle, AlertTriangle, Crown, LayoutDashboard, ArrowLeft } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { motion } from 'framer-motion';
import AdminCommandCenter from './admin/AdminCommandCenter';

export default function AdminView() {
  const { goBack, addToast } = useSultanStore();
  const [showAIOS, setShowAIOS] = useState(false);

  const chartData = Array.from({ length: 30 }, (_, i) => ({
    day: `${i + 1}`,
    users: Math.floor(200 + Math.random() * 150),
    listings: Math.floor(50 + Math.random() * 100),
    revenue: Math.floor(50000 + Math.random() * 100000),
  }));

  const kpis = [
    { label: 'إجمالي المستخدمين', value: adminStats.totalUsers.toLocaleString(), icon: Users, change: '+12.5%', color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'إجمالي الإعلانات', value: adminStats.totalListings.toLocaleString(), icon: ShoppingBag, change: '+8.3%', color: 'text-green-400', bg: 'bg-green-400/10' },
    { label: 'الإيرادات (درهم)', value: adminStats.totalRevenue.toLocaleString(), icon: DollarSign, change: '+15.2%', color: 'text-sultan', bg: 'bg-sultan/10' },
    { label: 'النمو الشهري', value: `${adminStats.monthlyGrowth}%`, icon: TrendingUp, change: '+2.1%', color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { label: 'المزادات النشطة', value: adminStats.activeAuctions.toString(), icon: Gavel, change: '+3', color: 'text-orange-400', bg: 'bg-orange-400/10' },
    { label: 'طلبات السحب المعلقة', value: adminStats.pendingCashouts.toString(), icon: Wallet, change: '-2', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
    { label: 'تذاكر الدعم', value: adminStats.openTickets.toString(), icon: Ticket, change: '+5', color: 'text-red-400', bg: 'bg-red-400/10' },
    { label: 'صحة الاقتصاد', value: `${adminStats.economyHealth}%`, icon: Activity, change: '+1', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  ];

  const quickActions = [
    { label: 'إدارة المستخدمين', icon: Users, desc: 'عرض وتعديل الحسابات' },
    { label: 'الإعلانات', icon: ShoppingBag, desc: 'مراجعة وإدارة الإعلانات' },
    { label: 'المالية', icon: DollarSign, desc: 'الإيرادات والمعاملات' },
    { label: 'المحتوى', icon: FileText, desc: 'الصفحات والبنرات' },
    { label: 'الإعلانات المدفوعة', icon: Megaphone, desc: 'الحملات التسويقية' },
    { label: 'الصلاحيات', icon: Shield, desc: 'RBAC والأدوار' },
    { label: 'الأعمال', icon: BarChart3, desc: 'إدارة الحسابات التجارية' },
    { label: 'الثقة', icon: CheckCircle2, desc: 'نظام الثقة والتحقق' },
  ];

  const recentAudit = [
    { action: 'حذف إعلان مخالف', admin: 'youssef_admin', time: 'منذ 5 دقائق', type: 'delete' },
    { action: 'موافقة على سحب 500 درهم', admin: 'youssef_admin', time: 'منذ 15 دقيقة', type: 'approve' },
    { action: 'تفعيل ميزة الزواج والتعارف', admin: 'super_admin', time: 'منذ ساعة', type: 'toggle' },
    { action: 'إيقاف حساب مخالف', admin: 'moderator_1', time: 'منذ ساعتين', type: 'ban' },
    { action: 'تعديل عمولة فئة الإلكترونيات', admin: 'super_admin', time: 'منذ 3 ساعات', type: 'edit' },
  ];

  if (showAIOS) {
    return <AdminCommandCenter onBack={() => setShowAIOS(false)} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 pb-20">
      <div className="flex items-center gap-2 py-4">
        <Button variant="ghost" size="icon" onClick={goBack}><ArrowRight className="h-5 w-5" /></Button>
        <div>
          <h1 className="text-xl font-bold">مركز القيادة — سلطان</h1>
          <p className="text-xs text-muted-foreground">لوحة تحكم سوبر أدمن</p>
        </div>
        <Badge variant="outline" className="ms-auto border-sultan/30 text-sultan">DEMO</Badge>
      </div>

      {/* Sultan AI OS Entry */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Card
          className="border-sultan/30 bg-gradient-to-l from-sultan/5 to-transparent cursor-pointer hover:border-sultan/50 transition-all sultan-glow"
          onClick={() => setShowAIOS(true)}
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl sultan-gradient flex items-center justify-center shadow-lg shadow-sultan/20">
                <Crown className="h-7 w-7 text-royal" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-gradient-sultan">SULTAN AI OS</h2>
                <p className="text-sm text-muted-foreground">نظام الذكاء الاصطناعي المتكامل — إدارة، مراقبة، تطوير، وأتمتة المنصة بالذكاء الاصطناعي</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="bg-sultan/20 text-sultan border-sultan/30 text-[10px]">13 وكيل ذكي</Badge>
                  <Badge className="bg-sultan/20 text-sultan border-sultan/30 text-[10px]">12 نموذج AI</Badge>
                  <Badge className="bg-sultan/20 text-sultan border-sultan/30 text-[10px]">9 مزودين</Badge>
                </div>
              </div>
              <Button className="sultan-gradient text-royal font-bold hover:opacity-90">
                دخول <ArrowLeft className="h-4 w-4 ms-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {kpis.map((kpi, i) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
            className="rounded-xl bg-card border border-border/50 p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`w-9 h-9 rounded-lg ${kpi.bg} flex items-center justify-center`}><kpi.icon className={`h-4 w-4 ${kpi.color}`} /></div>
              <span className={`text-xs font-medium ${kpi.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>{kpi.change}</span>
            </div>
            <p className="text-xl font-bold">{kpi.value}</p>
            <p className="text-[11px] text-muted-foreground">{kpi.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      <Card className="p-4 border-border/50 mb-6">
        <h3 className="font-semibold text-sm mb-4">النشاط خلال 30 يوم</h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={chartData}>
            <defs><linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} /><stop offset="95%" stopColor="#D4AF37" stopOpacity={0} /></linearGradient></defs>
            <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
            <Area type="monotone" dataKey="users" stroke="#D4AF37" fill="url(#colorUsers)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Quick Actions */}
        <Card className="p-4 border-border/50">
          <h3 className="font-semibold text-sm mb-3">إجراءات سريعة</h3>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map(a => (
              <button key={a.label} onClick={() => addToast(`${a.label} — قيد التطوير`, 'info')} className="flex items-center gap-2 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors text-start">
                <a.icon className="h-4 w-4 text-sultan shrink-0" />
                <div><p className="text-xs font-medium">{a.label}</p><p className="text-[10px] text-muted-foreground line-clamp-1">{a.desc}</p></div>
              </button>
            ))}
          </div>
        </Card>

        {/* Feature Flags */}
        <Card className="p-4 border-border/50">
          <h3 className="font-semibold text-sm mb-3">ميزات النظام</h3>
          <div className="space-y-2 max-h-72 overflow-y-auto scrollbar-thin">
            {featureFlags.map(f => (
              <div key={f.key} className="flex items-center justify-between py-1.5">
                <span className="text-sm">{f.label}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[9px]">{f.category}</Badge>
                  <div className={`w-8 h-4 rounded-full ${f.value ? 'bg-sultan' : 'bg-muted'} relative cursor-pointer`}>
                    <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${f.value ? 'start-0.5' : 'end-0.5'}`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Audit Log */}
      <Card className="p-4 border-border/50">
        <h3 className="font-semibold text-sm mb-3">سجل العمليات الأخيرة</h3>
        <div className="space-y-2">
          {recentAudit.map((log, i) => {
            const icons: Record<string, any> = { delete: XCircle, approve: CheckCircle2, toggle: Settings, ban: AlertTriangle };
            const colors: Record<string, string> = { delete: 'text-red-400', approve: 'text-green-400', toggle: 'text-blue-400', ban: 'text-orange-400' };
            const Icon = icons[log.type] || Settings;
            return (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-border/30 last:border-0">
                <Icon className={`h-4 w-4 ${colors[log.type] || 'text-muted-foreground'}`} />
                <div className="flex-1"><p className="text-sm">{log.action}</p><p className="text-[10px] text-muted-foreground">بواسطة {log.admin}</p></div>
                <span className="text-xs text-muted-foreground shrink-0">{log.time}</span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
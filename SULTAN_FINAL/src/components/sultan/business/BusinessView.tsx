'use client';
import { useSultanStore } from '@/lib/store';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, Star, MapPin, Users, Package, Wrench, TrendingUp, DollarSign, ShoppingBag, Sparkles, Eye, Clock, ChevronLeft, Bot, BarChart3 } from 'lucide-react';

const bizProfile = { name: 'مؤسسة سلطان تيك', category: 'تكنولوجيا المعلومات', city: 'الدار البيضاء', rating: 4.8, followers: 1240, verified: true, image: 'from-sultan/20 to-blue-900/40' };

const products = [
  { id: 'bp-1', title: 'حاسوب محمول HP ProBook', price: 8500, image: 'from-slate-700/60 to-slate-500/30', sold: 24 },
  { id: 'bp-2', title: 'شاشة Samsung 27 بوصة', price: 3200, image: 'from-blue-900/40 to-cyan-800/30', sold: 18 },
  { id: 'bp-3', title: 'لوحة مفاتيح ميكانيكية', price: 650, image: 'from-purple-900/40 to-indigo-800/30', sold: 42 },
  { id: 'bp-4', title: 'ماوس لاسلكي Logitech', price: 280, image: 'from-green-900/40 to-teal-800/30', sold: 67 },
];

const services = [
  { id: 'bs-1', title: 'صيانة حواسيب', price: 200, rating: 4.9, orders: 156 },
  { id: 'bs-2', title: 'إعداد شبكات', price: 1500, rating: 4.7, orders: 34 },
  { id: 'bs-3', title: 'تطوير مواقع', price: 5000, rating: 4.8, orders: 28 },
  { id: 'bs-4', title: 'استشارات تقنية', price: 300, rating: 4.6, orders: 89 },
];

const analytics = [
  { label: 'إجمالي الإيرادات', value: '284,000', unit: 'درهم', icon: DollarSign, change: '+12.5%', positive: true },
  { label: 'الطلبات', value: '1,240', unit: 'طلب', icon: ShoppingBag, change: '+8.3%', positive: true },
  { label: 'العملاء', value: '856', unit: 'عميل', icon: Users, change: '+15.2%', positive: true },
  { label: 'التقييم', value: '4.8', unit: '/5', icon: Star, change: '+0.2', positive: true },
];

const orders = [
  { id: 'o-1', customer: 'خديجة المراكشية', product: 'حاسوب محمول HP', amount: 8500, status: 'مكتمل', date: '2026-08-19' },
  { id: 'o-2', customer: 'عمر البيضاوي', product: 'ماوس لاسلكي', amount: 280, status: 'قيد التوصيل', date: '2026-08-19' },
  { id: 'o-3', customer: 'ليلى وجدية', product: 'تطوير موقع', amount: 5000, status: 'قيد التنفيذ', date: '2026-08-18' },
  { id: 'o-4', customer: 'سارة التطوانية', product: 'صيانة حاسوب', amount: 200, status: 'مكتمل', date: '2026-08-18' },
  { id: 'o-5', customer: 'حمزة الرباطي', product: 'شاشة Samsung', amount: 3200, status: 'ملغي', date: '2026-08-17' },
];

const aiSuggestions = [
  'زيادة ميزانية الإعلانات في فئة الإلكترونيات بنسبة 20% خلال الأسبوع القادم',
  'الطلب على لوحات المفاتيح ارتفع 35% — أضف مخزونا إضافيا',
  '3 طلبات م علقة تحتاج متابعة عاجلة',
];

const fadeUp = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };

export default function BusinessView() {
  const { navigate, addToast } = useSultanStore();
  const statusColors: Record<string, string> = { 'مكتمل': 'bg-green-500/10 text-green-400', 'قيد التوصيل': 'bg-blue-500/10 text-blue-400', 'قيد التنفيذ': 'bg-yellow-500/10 text-yellow-400', 'ملغي': 'bg-red-500/10 text-red-400' };

  return (
    <div className="max-w-5xl mx-auto px-4 pb-20">
      {/* Header */}
      <div className="flex items-center gap-3 py-4">
        <button onClick={() => navigate('home')} className="p-2 rounded-lg hover:bg-secondary transition-colors"><ArrowRight className="h-5 w-5" /></button>
        <h1 className="text-xl font-bold">لوحة الأعمال</h1>
        <Badge variant="outline" className="border-sultan/30 text-sultan text-xs">DEMO</Badge>
      </div>

      {/* Business Profile Card */}
      <motion.div {...fadeUp} className="rounded-2xl bg-card border border-border/50 overflow-hidden mb-6">
        <div className={`h-28 bg-gradient-to-r ${bizProfile.image} relative`} />
        <div className="p-4 -mt-8 relative">
          <div className="flex items-end gap-4">
            <div className="w-16 h-16 rounded-2xl sultan-gradient flex items-center justify-center text-royal font-bold text-xl shadow-lg">س</div>
            <div className="flex-1 min-w-0 pb-1">
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-lg truncate">{bizProfile.name}</h2>
                {bizProfile.verified && <Badge className="bg-sultan/10 text-sultan border-0 text-[10px]">موثق ✓</Badge>}
              </div>
              <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                <span>{bizProfile.category}</span>
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{bizProfile.city}</span>
                <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-sultan text-sultan" />{bizProfile.rating}</span>
                <span className="flex items-center gap-1"><Users className="h-3 w-3" />{bizProfile.followers.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {analytics.map((stat, i) => (
          <motion.div key={stat.label} {...fadeUp} transition={{ delay: i * 0.05 }}
            className="rounded-xl bg-card border border-border/50 p-4">
            <div className="flex items-center justify-between mb-2">
              <stat.icon className="h-4 w-4 text-sultan" />
              <span className={`text-[10px] font-semibold ${stat.positive ? 'text-green-400' : 'text-red-400'}`}>{stat.change}</span>
            </div>
            <p className="text-xl font-bold">{stat.value}</p>
            <p className="text-[11px] text-muted-foreground">{stat.unit} — {stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Products Grid */}
      <motion.div {...fadeUp} className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-sm flex items-center gap-2"><Package className="h-4 w-4 text-sultan" />المنتجات</h3>
          <button className="text-xs text-sultan flex items-center gap-1">عرض الكل <ChevronLeft className="h-3 w-3" /></button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {products.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="rounded-xl bg-card border border-border/50 overflow-hidden group hover:border-sultan/30 transition-all">
              <div className={`h-24 bg-gradient-to-br ${p.image}`} />
              <div className="p-3">
                <p className="text-xs font-medium line-clamp-1 group-hover:text-sultan transition-colors">{p.title}</p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-sultan font-bold text-sm">{p.price.toLocaleString()} <span className="text-[9px] text-muted-foreground font-normal">درهم</span></p>
                  <span className="text-[10px] text-muted-foreground">{p.sold} مبيعة</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Services List */}
      <motion.div {...fadeUp} className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-sm flex items-center gap-2"><Wrench className="h-4 w-4 text-sultan" />الخدمات</h3>
        </div>
        <div className="rounded-xl bg-card border border-border/50 divide-y divide-border/30 overflow-hidden">
          {services.map(s => (
            <div key={s.id} className="flex items-center gap-3 p-3 hover:bg-secondary/30 transition-colors">
              <div className="w-9 h-9 rounded-lg bg-sultan/10 flex items-center justify-center shrink-0"><Wrench className="h-4 w-4 text-sultan" /></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{s.title}</p>
                <p className="text-[11px] text-muted-foreground">{s.orders} طلب — <Star className="h-3 w-3 inline fill-sultan text-sultan" /> {s.rating}</p>
              </div>
              <p className="text-sultan font-bold text-sm">{s.price.toLocaleString()} <span className="text-[9px] text-muted-foreground font-normal">درهم</span></p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* AI Business Assistant */}
      <motion.div {...fadeUp} className="rounded-xl bg-card border border-sultan/20 p-5 mb-6 sultan-glow">
        <div className="flex items-center gap-2 mb-3">
          <Bot className="h-5 w-5 text-sultan" />
          <h3 className="font-bold text-sm">مساعد الأعمال الذكي</h3>
          <Badge className="bg-sultan/10 text-sultan border-0 text-[10px]">AI</Badge>
        </div>
        <div className="space-y-2">
          {aiSuggestions.map((s, i) => (
            <div key={i} className="flex items-start gap-2 p-3 rounded-lg bg-secondary/30 text-xs">
              <Sparkles className="h-3.5 w-3.5 text-sultan mt-0.5 shrink-0" />
              <p>{s}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Orders Table */}
      <motion.div {...fadeUp}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-sm flex items-center gap-2"><ShoppingBag className="h-4 w-4 text-sultan" />الطلبات الأخيرة</h3>
          <Badge variant="secondary" className="text-[10px]">{orders.length} طلب</Badge>
        </div>
        <div className="rounded-xl bg-card border border-border/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border/30 text-xs text-muted-foreground">
                <th className="text-start p-3 font-medium">العميل</th><th className="text-start p-3 font-medium">المنتج</th>
                <th className="text-start p-3 font-medium">المبلغ</th><th className="text-start p-3 font-medium">الحالة</th><th className="text-start p-3 font-medium">التاريخ</th>
              </tr></thead>
              <tbody className="divide-y divide-border/20">
                {orders.map(o => (
                  <tr key={o.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="p-3 text-xs font-medium">{o.customer}</td>
                    <td className="p-3 text-xs text-muted-foreground">{o.product}</td>
                    <td className="p-3 text-xs font-bold text-sultan">{o.amount.toLocaleString()} درهم</td>
                    <td className="p-3"><Badge className={`${statusColors[o.status]} border-0 text-[10px]`}>{o.status}</Badge></td>
                    <td className="p-3 text-xs text-muted-foreground">{o.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
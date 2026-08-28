'use client';
import { useSultanStore } from '@/lib/store';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, TrendingDown, Search, MapPin, Sparkles, Lightbulb, BarChart3, Flame, ArrowUpRight, Target, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const trendingCategories = [
  { name: 'إلكترونيات', score: 94, change: '+12%', period: 'هذا الأسبوع' },
  { name: 'السيارات', score: 87, change: '+8%', period: 'هذا الأسبوع' },
  { name: 'العقارات', score: 82, change: '+15%', period: 'هذا الشهر' },
  { name: 'الخدمات', score: 76, change: '+5%', period: 'هذا الأسبوع' },
  { name: 'الوظائف', score: 71, change: '+22%', period: 'هذا الشهر' },
];

const trendingCities = [
  { name: 'الدار البيضاء', score: 96, change: '+7%' },
  { name: 'مراكش', score: 89, change: '+14%' },
  { name: 'الرباط', score: 84, change: '+9%' },
  { name: 'فاس', score: 78, change: '+11%' },
  { name: 'طنجة', score: 75, change: '+18%' },
];

const trendingSearches = [
  { term: 'آيفون 16', volume: 12400, change: '+45%' },
  { term: 'شقة للبيع الدار البيضاء', volume: 8900, change: '+28%' },
  { term: 'سيارة اقتصادية', volume: 6700, change: '+67%' },
  { term: 'وظيفة برمجة عن بعد', volume: 5200, change: '+34%' },
  { term: 'أثاث مستعمل', volume: 4100, change: '-5%' },
];

const chartData = [
  { name: 'إلكترونيات', value: 420, prev: 375 },
  { name: 'سيارات', value: 310, prev: 287 },
  { name: 'عقارات', value: 280, prev: 243 },
  { name: 'خدمات', value: 195, prev: 186 },
  { name: 'وظائف', value: 165, prev: 135 },
  { name: 'أزياء', value: 140, prev: 130 },
  { name: 'حيوانات', value: 85, prev: 90 },
];

const heatmapCities = ['الدار البيضاء', 'الرباط', 'مراكش', 'فاس', 'طنجة', 'أكادير', 'مكناس', 'وجدة'];
const heatmapCats = ['إلكترونيات', 'سيارات', 'عقارات', 'خدمات', 'وظائف'];
const getHeat = (c: number, r: number) => Math.floor(Math.random() * 40 + 50);

const opportunities = [
  { title: 'الطلب على الحواسيب المحمولة ارتفع 45% في طنجة', impact: 'عالي', category: 'إلكترونيات' },
  { title: 'نقص عرض خدمات التصليح في فاس', impact: 'متوسط', category: 'خدمات' },
  { title: 'ارتفاع الطلب على الشقق الصغيرة في الرباط', impact: 'عالي', category: 'عقارات' },
  { title: 'فرصة لتقديم دورات البرمجة عن بعد', impact: 'مرتفع', category: 'وظائف' },
];

const aiInsights = [
  { title: 'فئة السيارات الاقتصادية', desc: 'المغاربة يبحثون أكثر عن سيارات بأسعار أقل من 80 ألف درهم، خاصة في مراكش وطنجة', icon: Target },
  { title: 'اتجاه العمل عن بعد', desc: 'طلبات الوظائف عن بعد ارتفعت 67% مقارنة بالشهر الماضي، مع طلب قوي على مطوري Flutter', icon: Zap },
  { title: 'موسم العقارات', desc: 'النصف الثاني من أغسطس يشهد طفرة في البحث عن الإيجارات الجامعية في المدن الكبرى', icon: BarChart3 },
];

const fadeUp = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };

export default function TrendsView() {
  const { navigate } = useSultanStore();

  return (
    <div className="max-w-5xl mx-auto px-4 pb-20">
      {/* Header */}
      <div className="flex items-center gap-3 py-4">
        <button onClick={() => navigate('home')} className="p-2 rounded-lg hover:bg-secondary transition-colors"><ArrowRight className="h-5 w-5" /></button>
        <h1 className="text-xl font-bold">محرك الاتجاهات</h1>
        <Badge variant="outline" className="border-sultan/30 text-sultan text-xs flex items-center gap-1"><Flame className="h-3 w-3" />Live</Badge>
        <Badge variant="secondary" className="text-[10px]">DEMO</Badge>
      </div>

      {/* Trending Categories */}
      <motion.div {...fadeUp} className="mb-6">
        <h3 className="font-bold text-sm flex items-center gap-2 mb-3"><TrendingUp className="h-4 w-4 text-sultan" />الفئات الرائجة</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {trendingCategories.map((cat, i) => (
            <motion.div key={cat.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="rounded-xl bg-card border border-border/50 p-4 hover:border-sultan/30 transition-all">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-sm">{cat.name}</h4>
                <span className={`text-xs font-bold ${cat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'} flex items-center gap-0.5`}>
                  {cat.change.startsWith('+') ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}{cat.change}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="h-2 rounded-full bg-secondary overflow-hidden"><div className="h-full rounded-full sultan-gradient" style={{ width: `${cat.score}%` }} /></div>
                </div>
                <span className="text-sultan font-bold text-sm ms-3">{cat.score}</span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1.5">{cat.period}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Category Growth Chart */}
      <motion.div {...fadeUp} className="rounded-xl bg-card border border-border/50 p-5 mb-6">
        <h3 className="font-bold text-sm flex items-center gap-2 mb-4"><BarChart3 className="h-4 w-4 text-sultan" />نمو الفئات (إعلانات جديدة)</h3>
        <div className="h-64" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barCategoryGap="20%">
              <XAxis dataKey="name" tick={{ fill: '#888', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#888', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1a2d50', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 8, fontSize: 12, color: '#fff' }}
                formatter={(val: number, name: string) => [`${val} إعلان`, name === 'value' ? 'هذا الأسبوع' : 'الأسبوع الماضي']} />
              <Bar dataKey="prev" fill="#1a2d50" radius={[4, 4, 0, 0]} />
              <Bar dataKey="value" fill="#D4AF37" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* City Activity Heatmap */}
      <motion.div {...fadeUp} className="rounded-xl bg-card border border-border/50 p-5 mb-6">
        <h3 className="font-bold text-sm flex items-center gap-2 mb-4"><MapPin className="h-4 w-4 text-sultan" />خريطة نشاط المدن</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead><tr>
              <th className="p-2 text-start text-muted-foreground font-medium"></th>
              {heatmapCats.map(c => <th key={c} className="p-2 text-center text-muted-foreground font-medium min-w-[80px]">{c}</th>)}
            </tr></thead>
            <tbody>
              {heatmapCities.map((city, ci) => (
                <tr key={city}>
                  <td className="p-2 font-medium">{city}</td>
                  {heatmapCats.map((_, ri) => {
                    const val = getHeat(ci, ri);
                    const opacity = val / 100;
                    return <td key={ri} className="p-1.5"><div className={`h-8 rounded-lg flex items-center justify-center text-[10px] font-bold ${val >= 80 ? 'text-royal' : 'text-foreground'}`} style={{ background: `rgba(212, 175, 55, ${opacity * 0.6})` }}>{val}</div></td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Trending Searches & Cities side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Search Terms */}
        <motion.div {...fadeUp} className="rounded-xl bg-card border border-border/50 p-5">
          <h3 className="font-bold text-sm flex items-center gap-2 mb-3"><Search className="h-4 w-4 text-sultan" />كلمات البحث الرائجة</h3>
          <div className="space-y-2">
            {trendingSearches.map((s, i) => (
              <div key={s.term} className="flex items-center gap-3 p-2.5 rounded-lg bg-secondary/30">
                <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold ${i < 3 ? 'bg-sultan/20 text-sultan' : 'bg-secondary text-muted-foreground'}`}>{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{s.term}</p>
                  <p className="text-[10px] text-muted-foreground">{s.volume.toLocaleString()} بحث</p>
                </div>
                <span className={`text-[11px] font-bold ${s.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>{s.change}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Trending Cities */}
        <motion.div {...fadeUp} className="rounded-xl bg-card border border-border/50 p-5">
          <h3 className="font-bold text-sm flex items-center gap-2 mb-3"><MapPin className="h-4 w-4 text-sultan" />المدن الأكثر نشاطا</h3>
          <div className="space-y-2">
            {trendingCities.map((city, i) => (
              <div key={city.name} className="flex items-center gap-3 p-2.5 rounded-lg bg-secondary/30">
                <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold ${i < 3 ? 'bg-sultan/20 text-sultan' : 'bg-secondary text-muted-foreground'}`}>{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{city.name}</p>
                  <div className="h-1.5 rounded-full bg-secondary mt-1 overflow-hidden"><div className="h-full rounded-full sultan-gradient" style={{ width: `${city.score}%` }} /></div>
                </div>
                <span className="text-[11px] font-bold text-green-400">{city.change}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Business Opportunities */}
      <motion.div {...fadeUp} className="rounded-xl bg-card border border-border/50 p-5 mb-6">
        <h3 className="font-bold text-sm flex items-center gap-2 mb-3"><ArrowUpRight className="h-4 w-4 text-sultan" />فرص الأعمال</h3>
        <div className="space-y-2">
          {opportunities.map(opp => (
            <div key={opp.title} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
              <Lightbulb className="h-4 w-4 text-sultan mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{opp.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-[10px]">{opp.category}</Badge>
                  <Badge className={`${opp.impact === 'عالي' || opp.impact === 'مرتفع' ? 'bg-sultan/10 text-sultan' : 'bg-blue-500/10 text-blue-400'} border-0 text-[10px]`}>{opp.impact}</Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* AI Insights */}
      <motion.div {...fadeUp} className="rounded-xl bg-card border border-sultan/20 p-5 sultan-glow">
        <h3 className="font-bold text-sm flex items-center gap-2 mb-3"><Sparkles className="h-4 w-4 text-sultan" />رؤى الذكاء الاصطناعي</h3>
        <div className="space-y-3">
          {aiInsights.map((insight, i) => (
            <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-secondary/30">
              <div className="w-9 h-9 rounded-lg bg-sultan/10 flex items-center justify-center shrink-0"><insight.icon className="h-4 w-4 text-sultan" /></div>
              <div>
                <p className="text-sm font-semibold text-sultan">{insight.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{insight.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
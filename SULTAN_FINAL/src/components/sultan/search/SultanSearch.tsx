'use client';
import { useSultanStore } from '@/lib/store';
import { listings, services, jobs, newsArticles } from '@/lib/seed-data';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';
import { Search, MapPin, Sparkles, Car, Briefcase, Building2, Newspaper, Wrench, Package, X, Brain, ArrowRight, Eye } from 'lucide-react';

const CATS = [
  { id: 'all', label: 'الكل', icon: Search },
  { id: 'products', label: 'منتجات', icon: Package },
  { id: 'services', label: 'خدمات', icon: Wrench },
  { id: 'works', label: 'أعمال', icon: Briefcase },
  { id: 'news', label: 'أخبار', icon: Newspaper },
  { id: 'realestate', label: 'عقارات', icon: Building2 },
  { id: 'cars', label: 'سيارات', icon: Car },
  { id: 'jobs', label: 'وظائف', icon: Briefcase },
];

const fadeUp = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };

export default function SultanSearch() {
  const { navigate, selectListing, locale } = useSultanStore();
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const showAI = query.includes('سيارة') || query.includes('أريد');

  const aiIntent = useMemo(() => {
    if (!showAI) return null;
    return [
      { key: 'النوع', value: 'سيارات', color: 'text-blue-400' },
      { key: 'السعر الأقصى', value: '80,000 درهم', color: 'text-green-400' },
      { key: 'المدينة', value: 'مراكش', color: 'text-purple-400' },
      { key: 'الشرط', value: 'اقتصادية', color: 'text-orange-400' },
    ];
  }, [showAI]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const all: any[] = [];
    if (activeTab === 'all' || activeTab === 'products') {
      listings.filter(l => l.title.includes(q) || l.description?.includes(q)).forEach(l => all.push({ ...l, _type: 'product' }));
    }
    if (activeTab === 'all' || activeTab === 'cars') {
      listings.filter(l => l.categoryId === 'c-motors' && (l.title.includes(q) || l.description?.includes(q))).forEach(l => all.push({ ...l, _type: 'car' }));
    }
    if (activeTab === 'all' || activeTab === 'services') {
      services.filter(s => s.title.includes(q) || s.provider.includes(q)).forEach(s => all.push({ ...s, _type: 'service', price: s.price, city: s.city, images: 'from-sultan/20 to-royal-light', viewsCount: 0 }));
    }
    if (activeTab === 'all' || activeTab === 'jobs') {
      jobs.filter(j => j.title.includes(q) || j.company.includes(q)).forEach(j => all.push({ ...j, _type: 'job', images: 'from-blue-900/40 to-royal-light', viewsCount: 0 }));
    }
    if (activeTab === 'all' || activeTab === 'news') {
      newsArticles.filter(n => n.title.includes(q)).forEach(n => all.push({ ...n, _type: 'news', price: 0, city: '', images: 'from-red-900/30 to-royal-light', viewsCount: 0 }));
    }
    if (activeTab === 'all' || activeTab === 'realestate') {
      listings.filter(l => l.categoryId === 'c-realestate' && (l.title.includes(q) || l.description?.includes(q))).forEach(l => all.push({ ...l, _type: 'realestate' }));
    }
    return all.slice(0, 12);
  }, [query, activeTab]);

  const typeIcon: Record<string, any> = { product: Package, car: Car, service: Wrench, job: Briefcase, news: Newspaper, realestate: Building2 };
  const typeLabel: Record<string, string> = { product: 'منتج', car: 'سيارة', service: 'خدمة', job: 'وظيفة', news: 'خبر', realestate: 'عقار' };

  return (
    <div className="max-w-4xl mx-auto px-4 pb-20">
      <div className="flex items-center gap-3 py-4">
        <button onClick={() => navigate('home')} className="p-2 rounded-lg hover:bg-secondary transition-colors"><ArrowRight className="h-5 w-5" /></button>
        <h1 className="text-xl font-bold">بحث سلطان</h1>
        <Badge variant="outline" className="border-sultan/30 text-sultan text-xs"><Sparkles className="h-3 w-3 me-1" />بحث ذكي</Badge>
      </div>

      {/* Search Input */}
      <motion.div {...fadeUp} className="relative mb-6">
        <Search className={`absolute top-1/2 -translate-y-1/2 ${locale === 'ar' || locale === 'darija' ? 'right-4' : 'left-4'} h-5 w-5 text-muted-foreground`} />
        <Input
          value={query} onChange={(e) => setQuery(e.target.value)} autoFocus
          placeholder="ابحث بالذكاء الاصطناعي... مثلاً: أريد سيارة اقتصادية أقل من 80 ألف درهم في مراكش"
          className={`${locale === 'ar' || locale === 'darija' ? 'pr-12 pl-10' : 'pl-12 pr-10'} h-14 text-base bg-card border-sultan/30 focus:border-sultan rounded-2xl backdrop-blur-sm`}
        />
        {query && (
          <button onClick={() => setQuery('')} className="absolute top-1/2 -translate-y-1/2 end-4 text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
        )}
      </motion.div>

      {/* Category Tabs */}
      <motion.div {...fadeUp} className="flex gap-2 overflow-x-auto scrollbar-hide pb-4 mb-4">
        {CATS.map(cat => {
          const Icon = cat.icon;
          return (
            <button key={cat.id} onClick={() => setActiveTab(cat.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-all ${activeTab === cat.id ? 'bg-sultan text-royal font-semibold' : 'bg-card border border-border/50 text-muted-foreground hover:border-sultan/30'}`}>
              <Icon className="h-4 w-4" />{cat.label}
            </button>
          );
        })}
      </motion.div>

      {/* AI Understanding */}
      <AnimatePresence>
        {showAI && aiIntent && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-6 overflow-hidden">
            <div className="rounded-xl bg-card border border-sultan/20 p-4 sultan-glow">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="h-5 w-5 text-sultan" />
                <span className="font-semibold text-sm">فهم الذكاء الاصطناعي</span>
                <Badge className="bg-sultan/10 text-sultan border-0 text-[10px]">AI</Badge>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {aiIntent.map(item => (
                  <div key={item.key} className="rounded-lg bg-secondary/50 p-3 text-center">
                    <p className="text-[11px] text-muted-foreground mb-1">{item.key}</p>
                    <p className={`font-bold text-sm ${item.color}`}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      {!query.trim() ? (
        <div className="text-center py-16">
          <Search className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground">ابدأ البحث</h3>
          <p className="text-sm text-muted-foreground/70 mt-1">اكتب ما تبحث عنه وسيقوم سلطان بالباقي</p>
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-16">
          <Sparkles className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground">لا توجد نتائج</h3>
          <p className="text-sm text-muted-foreground/70 mt-1">جرب كلمات بحث مختلفة</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((item, i) => {
            const Icon = typeIcon[item._type] || Package;
            return (
              <motion.div key={item.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                onClick={() => item._type === 'product' || item._type === 'car' || item._type === 'realestate' ? selectListing(item) : null}
                className="rounded-xl bg-card border border-border/50 overflow-hidden cursor-pointer group hover:border-sultan/30 transition-all">
                <div className={`h-32 bg-gradient-to-br ${item.images} relative`}>
                  <Badge className="absolute top-2 start-2 bg-black/60 text-white text-[10px] backdrop-blur-sm flex items-center gap-1"><Icon className="h-3 w-3" />{typeLabel[item._type]}</Badge>
                  <Badge className="absolute bottom-2 start-2 bg-black/60 text-white text-[9px] backdrop-blur-sm">DEMO</Badge>
                </div>
                <div className="p-3">
                  {item.price > 0 && <p className="text-sultan font-bold text-sm">{item.price?.toLocaleString()} <span className="text-[10px] text-muted-foreground font-normal">درهم</span></p>}
                  <p className="text-sm font-medium mt-1 line-clamp-1 group-hover:text-sultan transition-colors">{item.title}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    {item.city && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{item.city}</span>}
                    {item.viewsCount > 0 && <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{item.viewsCount}</span>}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
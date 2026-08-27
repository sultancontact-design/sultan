'use client';
import { useSultanStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import { categories, listings, auctions, charityCases, restaurants, services, jobs, newsArticles, cities } from '@/lib/seed-data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Search, MapPin, Star, Heart, Eye, ArrowLeft, Clock, TrendingUp, Users, Briefcase, Car, Building2, UtensilsCrossed, Wrench, Gavel, Newspaper, HeartHandshake, Zap, Crown, ChevronLeft, Flame, Store, Smartphone, Armchair, Shirt, PawPrint, Gamepad2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const categoryIcons: Record<string, any> = {
  Store, Car, Building2, UtensilsCrossed, Wrench, Briefcase, Gavel, Heart, Newspaper, HeartHandshake, Users, Smartphone, Armchair, Shirt, PawPrint, Gamepad2,
};

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 } };

function CountdownTimer({ endsAt }: { endsAt: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const calc = () => {
      const diff = new Date(endsAt).getTime() - Date.now();
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      return { days: Math.floor(diff / 86400000), hours: Math.floor((diff % 86400000) / 3600000), minutes: Math.floor((diff % 3600000) / 60000), seconds: Math.floor((diff % 60000) / 1000) };
    };
    setTimeLeft(calc());
    const i = setInterval(() => setTimeLeft(calc()), 1000);
    return () => clearInterval(i);
  }, [endsAt]);
  return (
    <div className="flex gap-1 text-xs font-mono">
      {Object.entries(timeLeft).map(([k, v]) => (
        <span key={k} className="bg-secondary/80 px-1.5 py-0.5 rounded text-foreground">
          {String(v).padStart(2, '0')}{k === 'days' ? 'ي' : k === 'hours' ? 'س' : k === 'minutes' ? 'د' : 'ث'}
        </span>
      ))}
    </div>
  );
}

export default function HomeView() {
  const { navigate, locale, setSelectedCategory, setSearchQuery, selectListing, searchQuery, openSupportModal } = useSultanStore();
  const [liked, setLiked] = useState<Set<string>>(new Set());

  const featuredListings = listings.filter(l => l.isFeatured).slice(0, 10);
  const recentListings = [...listings].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 8);
  const topCategories = categories.filter(c => !['c-marketplace', 'c-zawaj', 'c-social'].includes(c.id)).slice(0, 10);
  const categoryCount = (catId: string) => listings.filter(l => l.categoryId === catId).length;

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-royal via-royal-light to-background z-0" />
        <div className="absolute inset-0 zellige-pattern opacity-30 z-0" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 pt-12 pb-16 text-center">
          <motion.div {...fadeUp}>
            <Badge variant="outline" className="mb-4 border-sultan/30 text-sultan bg-sultan/5 text-xs">
              <Crown className="h-3 w-3 me-1" /> المنصة الرقمية المغربية الأولى
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="text-gradient-sultan">مرحبا بك في سلطان</span>
            </h1>
            <p className="text-muted-foreground text-base md:text-lg mb-8 max-w-2xl mx-auto">
              السوق، الخدمات، الوظائف، العقارات، الطعام، المزادات والتضامن — كل شيء في مكان واحد
            </p>
          </motion.div>
          <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.2 }}>
            <div className="relative max-w-2xl mx-auto">
              <Search className={`absolute top-1/2 -translate-y-1/2 ${locale === 'ar' || locale === 'darija' ? 'right-4' : 'left-4'} h-5 w-5 text-muted-foreground`} />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') navigate('marketplace'); }}
                placeholder="ابحث عن أي شيء... هاتف، شقة، سيارة، خدمة"
                className={`${locale === 'ar' || locale === 'darija' ? 'pr-12 pl-4' : 'pl-12 pr-4'} h-14 text-base bg-card/80 border-sultan/30 focus:border-sultan rounded-2xl backdrop-blur-sm shadow-xl shadow-black/20`}
              />
              <Button onClick={() => navigate('marketplace')} className="absolute top-1/2 -translate-y-1/2 end-1 h-10 px-6 rounded-xl bg-sultan text-royal hover:bg-sultan/90 font-semibold">
                بحث
              </Button>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {['آيفون', 'شقة في الدار البيضاء', 'وظيفة برمجة', 'طاجين'].map((q) => (
                <button key={q} onClick={() => { setSearchQuery(q); navigate('marketplace'); }} className="px-3 py-1 text-xs rounded-full bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                  {q}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Categories */}
      <section className="max-w-7xl mx-auto px-4 -mt-4 relative z-10 mb-10">
        <motion.div {...fadeUp} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {topCategories.map((cat, i) => {
            const Icon = categoryIcons[cat.icon] || Store;
            return (
              <motion.button
                key={cat.id}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => { setSelectedCategory(cat.id); navigate('marketplace'); }}
                className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border/50 hover:border-sultan/30 transition-all group"
              >
                <div className="w-11 h-11 rounded-xl bg-sultan/10 flex items-center justify-center shrink-0 group-hover:bg-sultan/20 transition-colors">
                  <Icon className="h-5 w-5 text-sultan" />
                </div>
                <div className="text-start min-w-0">
                  <p className="font-medium text-sm truncate">{cat.nameAr}</p>
                  <p className="text-xs text-muted-foreground">{categoryCount(cat.id)} إعلان</p>
                </div>
              </motion.button>
            );
          })}
        </motion.div>
      </section>

      {/* Featured Listings */}
      <section className="max-w-7xl mx-auto px-4 mb-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-sultan" />
            <h2 className="text-lg font-bold">إعلانات مميزة</h2>
          </div>
          <button onClick={() => navigate('marketplace')} className="text-sm text-sultan hover:underline flex items-center gap-1">
            عرض الكل <ChevronLeft className="h-4 w-4" />
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
          {featuredListings.map((listing, i) => (
            <motion.div
              key={listing.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              onClick={() => selectListing(listing)}
              className="shrink-0 w-56 rounded-xl bg-card border border-border/50 overflow-hidden cursor-pointer group hover:border-sultan/30 transition-all"
            >
              <div className={`h-36 bg-gradient-to-br ${listing.images} relative`}>
                {listing.isUrgent && (
                  <Badge className="absolute top-2 start-2 bg-red-500 text-white text-[10px]">عاجل</Badge>
                )}
                <button onClick={(e) => toggleLike(listing.id, e)} className="absolute top-2 end-2 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-colors">
                  <Heart className={`h-4 w-4 ${liked.has(listing.id) ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                </button>
                <Badge className="absolute bottom-2 start-2 bg-black/60 text-white text-[10px] backdrop-blur-sm">DEM0</Badge>
              </div>
              <div className="p-3">
                <p className="text-sultan font-bold text-base">{listing.price.toLocaleString()} <span className="text-xs text-muted-foreground font-normal">درهم</span></p>
                <p className="text-sm font-medium mt-1 line-clamp-1 group-hover:text-sultan transition-colors">{listing.title}</p>
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" /> {listing.city}
                  <Eye className="h-3 w-3" /> {listing.viewsCount}
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-sultan/20 flex items-center justify-center">
                      <span className="text-[8px] text-sultan font-bold">{listing.profile.displayName.charAt(0)}</span>
                    </div>
                    <span className="text-xs truncate max-w-20">{listing.profile.displayName}</span>
                  </div>
                  {listing.profile.isVerified && <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-sultan/30 text-sultan">موثق</Badge>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Auctions */}
      <section className="max-w-7xl mx-auto px-4 mb-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Gavel className="h-5 w-5 text-sultan" />
            <h2 className="text-lg font-bold">المزادات المباشرة</h2>
          </div>
          <button onClick={() => navigate('auctions')} className="text-sm text-sultan hover:underline flex items-center gap-1">
            عرض الكل <ChevronLeft className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {auctions.slice(0, 3).map((auction, i) => (
            <motion.div key={auction.id} {...fadeUp} transition={{ delay: i * 0.1 }}
              className="rounded-xl bg-card border border-sultan/20 overflow-hidden hover:border-sultan/40 transition-all group cursor-pointer"
              onClick={() => navigate('auctions')}
            >
              <div className={`h-40 bg-gradient-to-br ${auction.images} relative`}>
                <Badge className="absolute top-2 start-2 bg-sultan text-royal text-xs font-bold">مزاد مباشر</Badge>
                <div className="absolute bottom-2 start-2"><CountdownTimer endsAt={auction.endsAt} /></div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold line-clamp-1 group-hover:text-sultan transition-colors">{auction.title}</h3>
                <div className="flex items-center justify-between mt-3">
                  <div>
                    <p className="text-xs text-muted-foreground">المزايدة الحالية</p>
                    <p className="text-sultan font-bold text-lg">{auction.currentBid.toLocaleString()} <span className="text-xs font-normal">درهم</span></p>
                  </div>
                  <Badge variant="secondary" className="text-xs">{auction.bidCount} مزايدة</Badge>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Charity */}
      <section className="max-w-7xl mx-auto px-4 mb-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-400" />
            <h2 className="text-lg font-bold">التضامن</h2>
          </div>
          <button onClick={() => navigate('charity')} className="text-sm text-sultan hover:underline flex items-center gap-1">
            عرض الكل <ChevronLeft className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {charityCases.slice(0, 3).map((c, i) => {
            const pct = Math.round((c.collectedAmount / c.goalAmount) * 100);
            const urgencyColors: Record<string, string> = { critical: 'bg-red-500', high: 'bg-orange-500', medium: 'bg-yellow-500', low: 'bg-green-500' };
            const urgencyLabels: Record<string, string> = { critical: 'عاجل جدا', high: 'عاجل', medium: 'متوسط', low: 'عادي' };
            return (
              <motion.div key={c.id} {...fadeUp} transition={{ delay: i * 0.1 }}
                className="rounded-xl bg-card border border-border/50 overflow-hidden hover:border-red-400/30 transition-all"
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={`${urgencyColors[c.urgency]} text-white text-[10px]`}>{urgencyLabels[c.urgency]}</Badge>
                    <Badge variant="outline" className="text-[10px] border-border text-muted-foreground">DEM0</Badge>
                  </div>
                  <h3 className="font-semibold mb-2 line-clamp-1">{c.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{c.description}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">تم جمع</span>
                      <span className="font-semibold">{c.collectedAmount.toLocaleString()} / {c.goalAmount.toLocaleString()} درهم</span>
                    </div>
                    <Progress value={pct} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{pct}%</span>
                      <span>{c.donors} متبرع</span>
                    </div>
                  </div>
                  <Button onClick={(e) => { e.stopPropagation(); openSupportModal({ id: c.id, title: c.title, type: 'charity' }); }} className="w-full mt-3 bg-red-500 hover:bg-red-600 text-white rounded-lg h-9">
                    تبرع الآن
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Restaurants */}
      <section className="max-w-7xl mx-auto px-4 mb-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="h-5 w-5 text-sultan" />
            <h2 className="text-lg font-bold">مطاعم مميزة</h2>
          </div>
          <button onClick={() => navigate('food')} className="text-sm text-sultan hover:underline flex items-center gap-1">
            عرض الكل <ChevronLeft className="h-4 w-4" />
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
          {restaurants.filter(r => r.featured).map((r, i) => (
            <motion.div key={r.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              className="shrink-0 w-64 rounded-xl bg-card border border-border/50 p-4 hover:border-sultan/30 transition-all cursor-pointer group"
              onClick={() => navigate('food')}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm group-hover:text-sultan transition-colors">{r.name}</h3>
                <div className="flex items-center gap-1 text-xs text-sultan">
                  <Star className="h-3 w-3 fill-sultan" /> {r.rating}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-2">{r.cuisine}</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {r.deliveryTime} د</span>
                <span>الحد الأدنى: {r.minOrder} درهم</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><MapPin className="h-3 w-3" /> {r.city}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="max-w-7xl mx-auto px-4 mb-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-sultan" />
            <h2 className="text-lg font-bold">خدمات مطلوبة</h2>
          </div>
          <button onClick={() => navigate('services')} className="text-sm text-sultan hover:underline flex items-center gap-1">
            عرض الكل <ChevronLeft className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {services.slice(0, 4).map((s, i) => (
            <motion.div key={s.id} {...fadeUp} transition={{ delay: i * 0.05 }}
              className="rounded-xl bg-card border border-border/50 p-4 hover:border-sultan/30 transition-all cursor-pointer group"
              onClick={() => navigate('services')}
            >
              <Badge variant="secondary" className="text-[10px] mb-2">{s.category}</Badge>
              <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-sultan transition-colors">{s.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{s.provider}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-sultan font-bold text-sm">من {s.price} درهم</span>
                <div className="flex items-center gap-1 text-xs"><Star className="h-3 w-3 fill-sultan text-sultan" /> {s.rating}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Jobs */}
      <section className="max-w-7xl mx-auto px-4 mb-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-sultan" />
            <h2 className="text-lg font-bold">فرص عمل</h2>
          </div>
          <button onClick={() => navigate('jobs')} className="text-sm text-sultan hover:underline flex items-center gap-1">
            عرض الكل <ChevronLeft className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {jobs.slice(0, 4).map((job, i) => (
            <motion.div key={job.id} {...fadeUp} transition={{ delay: i * 0.05 }}
              className="rounded-xl bg-card border border-border/50 p-4 hover:border-sultan/30 transition-all cursor-pointer group"
              onClick={() => navigate('jobs')}
            >
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-sultan transition-colors">{job.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{job.company}</p>
                </div>
                <Badge variant={job.type === 'remote' ? 'default' : 'secondary'} className="text-[10px] shrink-0 ms-2">
                  {job.type === 'fulltime' ? 'دوام كامل' : job.type === 'parttime' ? 'دوام جزئي' : job.type === 'remote' ? 'عن بعد' : 'فريلانسر'}
                </Badge>
              </div>
              <p className="text-sultan font-semibold text-sm mt-2">{job.salary}</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1"><MapPin className="h-3 w-3" /> {job.city}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* News */}
      <section className="max-w-7xl mx-auto px-4 mb-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Newspaper className="h-5 w-5 text-sultan" />
            <h2 className="text-lg font-bold">آخر الأخبار</h2>
          </div>
          <button onClick={() => navigate('news')} className="text-sm text-sultan hover:underline flex items-center gap-1">
            عرض الكل <ChevronLeft className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {newsArticles.slice(0, 3).map((article, i) => (
            <motion.div key={article.id} {...fadeUp} transition={{ delay: i * 0.1 }}
              className="rounded-xl bg-card border border-border/50 p-4 hover:border-sultan/30 transition-all cursor-pointer group"
              onClick={() => navigate('news')}
            >
              <Badge variant="secondary" className="text-[10px] mb-2">{article.category}</Badge>
              <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-sultan transition-colors">{article.title}</h3>
              <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{article.excerpt}</p>
              <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                <span>{article.source}</span>
                <span>{article.date}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Cities Discover */}
      <section className="max-w-7xl mx-auto px-4 mb-10">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><MapPin className="h-5 w-5 text-sultan" /> استكشف حسب المدينة</h2>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          {cities.slice(0, 10).map((city) => {
            const count = listings.filter(l => l.city === city.nameAr).length;
            return (
              <button key={city.id} onClick={() => { useSultanStore.getState().setSelectedCity(city.nameAr); navigate('marketplace'); }}
                className="shrink-0 px-5 py-3 rounded-xl bg-card border border-border/50 hover:border-sultan/30 transition-all text-center group"
              >
                <p className="font-medium text-sm group-hover:text-sultan transition-colors">{city.nameAr}</p>
                <p className="text-xs text-muted-foreground">{count} إعلان</p>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

'use client';
import { useSultanStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import { categories, listings, cities } from '@/lib/seed-data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Grid3X3, List, SlidersHorizontal, X, Heart, Eye, MapPin, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';

export default function MarketplaceView() {
  const {
    currentView, locale, selectedCategory, setSelectedCategory, selectedCity, setSelectedCity,
    condition, setCondition, sortBy, setSortBy, searchQuery, priceRange,
    setPriceRange, clearFilters, selectListing, viewParams, goBack,
  } = useSultanStore();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [visibleCount, setVisibleCount] = useState(20);

  const viewCategories = currentView === 'motors' ? [categories.find(c => c.id === 'c-motors')!]
    : currentView === 'realestate' ? [categories.find(c => c.id === 'c-realestate')!]
    : categories.filter(c => !['c-marketplace', 'c-zawaj', 'c-social', 'c-news', 'c-charity'].includes(c.id));

  const activeCategory = currentView === 'motors' ? 'c-motors' : currentView === 'realestate' ? 'c-realestate' : selectedCategory;

  const filtered = useMemo(() => {
    let result = [...listings];
    if (activeCategory) result = result.filter(l => l.categoryId === activeCategory);
    if (selectedCity) result = result.filter(l => l.city === selectedCity);
    if (searchQuery) result = result.filter(l => l.title.includes(searchQuery) || l.description.includes(searchQuery));
    if (condition && condition !== 'all') result = result.filter(l => l.condition === condition);
    if (priceRange[0] > 0) result = result.filter(l => l.price >= priceRange[0]);
    if (priceRange[1] < 10000000) result = result.filter(l => l.price <= priceRange[1]);
    switch (sortBy) {
      case 'price_asc': result.sort((a, b) => a.price - b.price); break;
      case 'price_desc': result.sort((a, b) => b.price - a.price); break;
      case 'popular': result.sort((a, b) => b.viewsCount - a.viewsCount); break;
      default: result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return result;
  }, [activeCategory, selectedCity, searchQuery, condition, priceRange, sortBy]);

  const visible = filtered.slice(0, visibleCount);
  const viewTitles: Record<string, string> = {
    marketplace: 'السوق', motors: 'السيارات', realestate: 'العقارات', food: 'الطعام', services: 'الخدمات', jobs: 'الوظائف', auctions: 'المزادات',
  };

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const hasActiveFilters = activeCategory || selectedCity || searchQuery || (condition && condition !== 'all');

  return (
    <div className="max-w-7xl mx-auto px-4 pb-20">
      {/* Header */}
      <div className="flex items-center gap-3 py-4">
        <Button variant="ghost" size="icon" onClick={goBack} className="shrink-0"><ArrowRight className="h-5 w-5" /></Button>
        <h1 className="text-xl font-bold">{viewTitles[currentView] || 'السوق'}</h1>
        <Badge variant="secondary" className="ms-auto">{filtered.length} إعلان</Badge>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-2 mb-4 pb-4 border-b border-border/50">
        <Select value={activeCategory || 'all'} onValueChange={(v) => setSelectedCategory(v === 'all' ? null : v)}>
          <SelectTrigger className="w-36 h-9 text-xs"><SelectValue placeholder="الفئة" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">كل الفئات</SelectItem>
            {viewCategories.map(c => <SelectItem key={c.id} value={c.id}>{c.nameAr}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={selectedCity || 'all'} onValueChange={(v) => setSelectedCity(v === 'all' ? null : v)}>
          <SelectTrigger className="w-36 h-9 text-xs"><SelectValue placeholder="المدينة" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">كل المدن</SelectItem>
            {cities.map(c => <SelectItem key={c.id} value={c.nameAr}>{c.nameAr}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={condition || 'all'} onValueChange={(v) => setCondition(v === 'all' ? null : v)}>
          <SelectTrigger className="w-32 h-9 text-xs"><SelectValue placeholder="الحالة" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">الكل</SelectItem>
            <SelectItem value="new">جديد</SelectItem>
            <SelectItem value="used">مستعمل</SelectItem>
            <SelectItem value="likeNew">كالجديد</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-32 h-9 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">الأحدث</SelectItem>
            <SelectItem value="price_asc">السعر: تصاعدي</SelectItem>
            <SelectItem value="price_desc">السعر: تنازلي</SelectItem>
            <SelectItem value="popular">الأكثر مشاهدة</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-1 ms-auto">
          <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-sultan/20 text-sultan' : 'text-muted-foreground'}`}><Grid3X3 className="h-4 w-4" /></button>
          <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-sultan/20 text-sultan' : 'text-muted-foreground'}`}><List className="h-4 w-4" /></button>
        </div>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {activeCategory && <Badge variant="secondary" className="gap-1">{viewCategories.find(c => c.id === activeCategory)?.nameAr} <button onClick={() => setSelectedCategory(null)}><X className="h-3 w-3" /></button></Badge>}
          {selectedCity && <Badge variant="secondary" className="gap-1">{selectedCity} <button onClick={() => setSelectedCity(null)}><X className="h-3 w-3" /></button></Badge>}
          {searchQuery && <Badge variant="secondary" className="gap-1">&quot;{searchQuery}&quot; <button onClick={() => useSultanStore.getState().setSearchQuery('')}><X className="h-3 w-3" /></button></Badge>}
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs text-destructive">مسح الكل</Button>
        </div>
      )}

      {/* Grid/List View */}
      {visible.length === 0 ? (
        <div className="text-center py-20">
          <SlidersHorizontal className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">لا توجد نتائج</h3>
          <p className="text-sm text-muted-foreground mb-4">جرب تغيير معايير البحث</p>
          <Button variant="outline" onClick={clearFilters}>مسح الفلاتر</Button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {visible.map((listing, i) => (
            <motion.div key={listing.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.03, 0.3) }}
              whileHover={{ y: -3 }}
              onClick={() => selectListing(listing)}
              className="rounded-xl bg-card border border-border/50 overflow-hidden cursor-pointer group hover:border-sultan/30 transition-all"
            >
              <div className={`aspect-[4/3] bg-gradient-to-br ${listing.images} relative`}>
                {listing.isUrgent && <Badge className="absolute top-2 start-2 bg-red-500 text-white text-[10px]">عاجل</Badge>}
                {listing.isFeatured && <Badge className="absolute top-2 end-2 bg-sultan text-royal text-[10px]">مميز</Badge>}
                <button onClick={(e) => toggleLike(listing.id, e)} className="absolute bottom-2 end-2 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-colors">
                  <Heart className={`h-4 w-4 ${liked.has(listing.id) ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                </button>
              </div>
              <div className="p-3">
                <div className="flex items-start justify-between">
                  <p className="text-sultan font-bold">{listing.price.toLocaleString()} <span className="text-xs text-muted-foreground font-normal">درهم</span></p>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <Eye className="h-3 w-3" />{listing.viewsCount}
                  </div>
                </div>
                <p className="text-sm font-medium mt-1 line-clamp-1 group-hover:text-sultan transition-colors">{listing.title}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{listing.city}</span>
                  <Badge variant="outline" className="text-[9px]">{listing.condition === 'new' ? 'جديد' : listing.condition === 'used' ? 'مستعمل' : 'كالجديد'}</Badge>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/30">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-sultan/20 flex items-center justify-center"><span className="text-[8px] text-sultan font-bold">{listing.profile.displayName.charAt(0)}</span></div>
                    <span className="text-[11px] truncate max-w-24">{listing.profile.displayName}</span>
                  </div>
                  {listing.profile.isVerified && <Badge className="text-[8px] px-1 py-0 bg-sultan/10 text-sultan border-0">موثق</Badge>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map((listing, i) => (
            <motion.div key={listing.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }}
              onClick={() => selectListing(listing)}
              className="flex gap-4 rounded-xl bg-card border border-border/50 p-3 cursor-pointer hover:border-sultan/30 transition-all group"
            >
              <div className={`w-28 h-28 sm:w-36 sm:h-28 rounded-lg bg-gradient-to-br ${listing.images} shrink-0 relative`}>
                {listing.isUrgent && <Badge className="absolute top-1 start-1 bg-red-500 text-white text-[9px]">عاجل</Badge>}
              </div>
              <div className="flex-1 min-w-0 py-1">
                <p className="text-sultan font-bold">{listing.price.toLocaleString()} درهم</p>
                <h3 className="font-semibold text-sm mt-1 line-clamp-1 group-hover:text-sultan transition-colors">{listing.title}</h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{listing.description}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{listing.city}</span>
                  <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{listing.viewsCount}</span>
                  <Badge variant="outline" className="text-[9px]">{listing.condition === 'new' ? 'جديد' : 'مستعمل'}</Badge>
                  {listing.negotiation && <Badge variant="outline" className="text-[9px]">قابل للتفاوض</Badge>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Load More */}
      {visibleCount < filtered.length && (
        <div className="text-center mt-8">
          <Button variant="outline" onClick={function() { setVisibleCount(function(prev) { return prev + 20; }); }} className="rounded-xl">تحميل المزيد</Button>
        </div>
      )}
    </div>
  );
}
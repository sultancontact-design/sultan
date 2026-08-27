'use client';
import { useSultanStore } from '@/lib/store';
import { ArrowRight, Heart, Share2, Flag, MessageCircle, Phone, MapPin, Eye, Shield, Star, Clock, Truck, BadgeCheck, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { listings } from '@/lib/seed-data';
import { useState } from 'react';

export default function ListingDetail() {
  const { selectedListing, goBack, navigate, openSupportModal, addToast } = useSultanStore();
  const [liked, setLiked] = useState(false);
  const listing = selectedListing || (listings.length > 0 ? listings[0] : null);
  if (!listing) return <div className="text-center py-20"><p>لم يتم العثور على الإعلان</p><Button onClick={goBack} variant="outline" className="mt-4">العودة</Button></div>;

  const similar = listings.filter(l => l.categoryId === listing.categoryId && l.id !== listing.id).slice(0, 4);
  const condLabels: Record<string, string> = { new: 'جديد', used: 'مستعمل', likeNew: 'كالجديد' };

  return (
    <div className="max-w-4xl mx-auto px-4 pb-20">
      {/* Back + Actions */}
      <div className="flex items-center gap-2 py-4">
        <Button variant="ghost" size="icon" onClick={goBack}><ArrowRight className="h-5 w-5" /></Button>
        <div className="flex items-center gap-1 ms-auto">
          <Button variant="ghost" size="icon" onClick={() => { setLiked(!liked); addToast(liked ? 'تم إزالته من المفضلة' : 'تمت إضافته إلى المفضلة', 'success'); }}>
            <Heart className={`h-5 w-5 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => { navigator.clipboard?.writeText(window.location.href); addToast('تم نسخ الرابط', 'success'); }}><Share2 className="h-5 w-5" /></Button>
          <Button variant="ghost" size="icon" onClick={() => addToast('تم الإبلاغ عن الإعلان', 'info')}><Flag className="h-5 w-5" /></Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Image */}
        <div className="lg:col-span-3">
          <div className={`aspect-[4/3] rounded-2xl bg-gradient-to-br ${listing.images} relative overflow-hidden`}>
            {listing.isUrgent && <Badge className="absolute top-4 start-4 bg-red-500 text-white">عاجل</Badge>}
            {listing.isFeatured && <Badge className="absolute top-4 end-4 bg-sultan text-royal">مميز</Badge>}
            <Badge className="absolute bottom-4 start-4 bg-black/60 text-white backdrop-blur-sm">DEM0</Badge>
          </div>
        </div>

        {/* Info */}
        <div className="lg:col-span-2 space-y-4">
          <div>
            <h1 className="text-xl font-bold leading-tight">{listing.title}</h1>
            <p className="text-2xl font-bold text-sultan mt-2">{listing.price.toLocaleString()} <span className="text-sm text-muted-foreground font-normal">درهم</span></p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs">{condLabels[listing.condition] || listing.condition}</Badge>
            {listing.negotiation && <Badge variant="outline" className="text-xs flex items-center gap-1"><Zap className="h-3 w-3" /> قابل للتفاوض</Badge>}
            {listing.delivery && <Badge variant="outline" className="text-xs flex items-center gap-1"><Truck className="h-3 w-3" /> توصيل</Badge>}
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{listing.city}</span>
            <span className="flex items-center gap-1"><Eye className="h-4 w-4" />{listing.viewsCount} مشاهدة</span>
            <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{new Date(listing.createdAt).toLocaleDateString('ar')}</span>
          </div>

          {/* Seller Card */}
          <div className="rounded-xl bg-secondary/30 border border-border/50 p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sultan/40 to-sultan/20 flex items-center justify-center">
                <span className="text-sultan font-bold">{listing.profile.displayName.charAt(0)}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm">{listing.profile.displayName}</p>
                  {listing.profile.isVerified && <BadgeCheck className="h-4 w-4 text-sultan" />}
                </div>
                <p className="text-xs text-muted-foreground">عضو منذ 2024 · {listing.profile.city}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center gap-1"><Shield className="h-3 w-3 text-green-500" /> <span>مستوى الثقة: {listing.profile.trustScore}%</span></div>
              {listing.profile.isRising && <Badge className="text-[9px] bg-sultan/10 text-sultan border-0">صاعد</Badge>}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={() => navigate('messages')} className="h-9 text-xs"><MessageCircle className="h-3.5 w-3.5 me-1" /> رسالة</Button>
              <Button variant="outline" onClick={() => openSupportModal({ id: listing.profile.id, title: listing.profile.displayName, type: 'user' })} className="h-9 text-xs border-sultan/30 text-sultan hover:bg-sultan/10">ادعم</Button>
            </div>
          </div>

          {/* Price Intelligence */}
          <div className="rounded-xl bg-sultan/5 border border-sultan/20 p-3">
            <p className="text-xs text-sultan font-medium flex items-center gap-1"><Star className="h-3 w-3" /> سعر جيد مقارنة بالسوق</p>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mt-6 rounded-xl bg-card border border-border/50 p-6">
        <h2 className="font-bold mb-3">الوصف</h2>
        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{listing.description}</p>
      </div>

      {/* Similar */}
      {similar.length > 0 && (
        <div className="mt-8">
          <h2 className="font-bold mb-4">إعلانات مشابهة</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {similar.map(s => {
              const handleSimilarClick = function() { useSultanStore.getState().selectListing(s); window.scrollTo({ top: 0, behavior: 'smooth' }); };
              return (
              <div key={s.id} onClick={handleSimilarClick}
                className="rounded-xl bg-card border border-border/50 overflow-hidden cursor-pointer hover:border-sultan/30 transition-all"
              >
                <div className={"h-24 bg-gradient-to-br " + s.images} />
                <div className="p-2">
                  <p className="text-sultan font-bold text-sm">{s.price.toLocaleString()} <span className="text-[10px] font-normal text-muted-foreground">درهم</span></p>
                  <p className="text-xs line-clamp-1 mt-0.5">{s.title}</p>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
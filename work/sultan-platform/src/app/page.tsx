'use client';
import { useEffect, useRef, useState } from 'react';
import { useSultanStore } from '@/lib/store';
import TopNav from '@/components/sultan/TopNav';
import BottomNav from '@/components/sultan/BottomNav';
import HomeView from '@/components/sultan/HomeView';
import MarketplaceView from '@/components/sultan/MarketplaceView';
import AuctionsView from '@/components/sultan/AuctionsView';
import CharityView from '@/components/sultan/CharityView';
import FoodView from '@/components/sultan/FoodView';
import ServicesView from '@/components/sultan/ServicesView';
import JobsView from '@/components/sultan/JobsView';
import NewsView from '@/components/sultan/NewsView';
import ProfileView from '@/components/sultan/ProfileView';
import AdminView from '@/components/sultan/AdminView';
import ListingDetail from '@/components/sultan/ListingDetail';
import PlaceholderView from '@/components/sultan/PlaceholderView';
import SupportModal from '@/components/sultan/SupportModal';
import PublishWizard from '@/components/sultan/PublishWizard';

// Fallback: import static seed data in case API is unavailable
import { listings as fallbackListings } from '@/lib/seed-data';

export default function Page() {
  const { currentView, isRTL, locale, setListings } = useSultanStore();
  const initialized = useRef(false);
  const [loading, setLoading] = useState(true);

  useEffect(function() {
    if (!initialized.current) {
      initialized.current = true;

      // Fetch real listings from API (Supabase)
      fetch('/api/listings?limit=100')
        .then(res => res.json())
        .then(data => {
          if (data.listings && data.listings.length > 0) {
            // Map API data to store format
            const mapped = data.listings.map((l: any) => ({
              id: l.id,
              title: l.title,
              description: l.description,
              price: l.price,
              currency: l.currency || 'MAD',
              category: l.category?.nameAr || l.categoryId || '',
              categoryId: l.categoryId,
              condition: l.condition,
              city: l.city,
              region: l.region,
              views: l.viewsCount,
              likes: l.likesCount,
              isFeatured: l.isFeatured,
              isUrgent: l.isUrgent,
              negotiation: l.negotiation,
              delivery: l.delivery,
              images: typeof l.images === 'string' ? JSON.parse(l.images || '[]') : (l.images || []),
              createdAt: l.createdAt,
              seller: l.profile ? {
                id: l.profile.id,
                name: l.profile.displayName,
                avatar: l.profile.avatar,
                city: l.profile.city,
                verified: l.profile.isVerified,
                trust: l.profile.trustScore,
              } : null,
            }));
            setListings(mapped);
            console.log('[SULTAN] Loaded ' + mapped.length + ' listings from Supabase');
          } else {
            // Fallback to static data
            setListings(fallbackListings);
            console.log('[SULTAN] Using fallback static data');
          }
          setLoading(false);
        })
        .catch(err => {
          console.error('[SULTAN] API fetch error, using fallback:', err);
          setListings(fallbackListings);
          setLoading(false);
        });
    }
  }, []);

  useEffect(function() {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = locale;
  }, [isRTL, locale]);

  function renderView() {
    switch (currentView) {
      case 'home':
        return <HomeView />;
      case 'marketplace':
      case 'motors':
      case 'realestate':
        return <MarketplaceView />;
      case 'auctions':
        return <AuctionsView />;
      case 'charity':
        return <CharityView />;
      case 'food':
        return <FoodView />;
      case 'services':
        return <ServicesView />;
      case 'jobs':
        return <JobsView />;
      case 'news':
        return <NewsView />;
      case 'profile':
        return <ProfileView />;
      case 'admin':
        return <AdminView />;
      case 'listing':
        return <ListingDetail />;
      case 'messages':
        return <PlaceholderView title="الرسائل" description="محادثاتك مع البائعين والمشترين ستظهر هنا" />;
      case 'zawaj':
        return <PlaceholderView title="الزواج والتعارف" description="هذه الميزة ستكون متاحة قريباً" />;
      default:
        return <HomeView />;
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black" dir="rtl">
        <div className="text-center">
          <div className="text-4xl mb-4" style={{color:'#D4AF37'}}>
            <svg className="animate-spin h-12 w-12 mx-auto" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#D4AF37" strokeWidth="3"/>
              <path className="opacity-75" fill="#D4AF37" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
          </div>
          <p className="text-lg" style={{color:'#D4AF37'}}>سلطان | SULTAN</p>
          <p className="text-sm text-zinc-500 mt-2">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopNav />\n      <main className="flex-1">{renderView()}</main>
      <BottomNav />
      <SupportModal />
      <PublishWizard />
    </div>
  );
}

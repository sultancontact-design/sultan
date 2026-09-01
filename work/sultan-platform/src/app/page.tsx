'use client';
import { useEffect } from 'react';
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

export default function Page() {
  const { currentView, isRTL, locale, isDataLoaded, initializeApp } = useSultanStore();

  // Initialize app data from API endpoints on first mount
  useEffect(function() {
    initializeApp();
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

  if (!isDataLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black" dir="rtl">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 mx-auto" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#D4AF37" strokeWidth="3"/>
            <path className="opacity-75" fill="#D4AF37" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          <p className="text-lg mt-4" style={{color:'#D4AF37'}}>سلطان | SULTAN</p>
          <p className="text-sm text-zinc-500 mt-2">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopNav />
      <main className="flex-1">{renderView()}</main>
      <BottomNav />
      <SupportModal />
      <PublishWizard />
    </div>
  );
}
'use client';
import { useEffect, useRef } from 'react';
import { useSultanStore } from '@/lib/store';
import { listings } from '@/lib/seed-data';
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
  const { currentView, isRTL, locale, setListings } = useSultanStore();
  const initialized = useRef(false);

  useEffect(function() {
    if (!initialized.current) {
      setListings(listings);
      initialized.current = true;
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

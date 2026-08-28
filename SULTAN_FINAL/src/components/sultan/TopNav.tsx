'use client';
import { useSultanStore } from '@/lib/store';
import { t, langMeta } from '@/lib/i18n';
import { Search, Bell, MessageCircle, Sun, Moon, Globe, Menu, X, User, LogOut, Settings, Wallet, ChevronDown, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TopNav() {
  const { locale, setLocale, theme, toggleTheme, isRTL, navigate, toggleSearch, notificationCount, messageCount, currentProfile, isAuthenticated, toggleMobileMenu, isMobileMenuOpen, setSearchQuery, searchQuery } = useSultanStore();
  const [showNotifs, setShowNotifs] = useState(false);
  const langs = langMeta;

  const navItems = [
    { key: 'home', label: t('home', locale) },
    { key: 'marketplace', label: t('marketplace', locale) },
    { key: 'motors', label: t('motors', locale) },
    { key: 'realestate', label: t('realestate', locale) },
    { key: 'food', label: t('food', locale) },
    { key: 'services', label: t('services', locale) },
    { key: 'jobs', label: t('jobs', locale) },
    { key: 'auctions', label: t('auctions', locale) },
  ];

  const demoNotifications = [
    { id: 1, text: 'انخفض سعر سيارة كنت تشاهدها بـ 5000 درهم', time: 'منذ 5 دقائق', read: false },
    { id: 2, text: 'تم قبول عرضك على إعلان الطابعات', time: 'منذ ساعة', read: false },
    { id: 3, text: 'حصلت على 50 عملة سلطان كمكافأة', time: 'منذ 3 ساعات', read: true },
    { id: 4, text: 'قام @كريم بمتابعتك', time: 'أمس', read: true },
  ];

  return (
    <header className="sticky top-0 z-50 glass border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-3">
        {/* Logo */}
        <button onClick={() => navigate('home')} className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg sultan-gradient flex items-center justify-center">
            <span className="text-royal font-bold text-sm">S</span>
          </div>
          <span className="hidden sm:block text-gradient-sultan font-bold text-lg">سلطان</span>
        </button>

        {/* Search Bar - Desktop */}
        <div className="hidden md:flex flex-1 max-w-xl mx-4">
          <div className="relative w-full">
            <Search className="absolute top-1/2 -translate-y-1/2 end-3 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { navigate('marketplace'); } }}
              placeholder={t('searchPlaceholder', locale)}
              className="ps-4 pe-10 h-10 bg-secondary/50 border-sultan/30 focus:border-sultan rounded-full"
            />
          </div>
        </div>

        {/* Nav Links - Desktop */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.slice(0, 6).map((item) => (
            <button
              key={item.key}
              onClick={() => navigate(item.key)}
              className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-colors"
            >
              {item.label}
            </button>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-colors flex items-center gap-1">
                المزيد <ChevronDown className="h-3 w-3" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isRTL ? 'start' : 'end'}>
              {navItems.slice(6).map((item) => (
                <DropdownMenuItem key={item.key} onClick={() => navigate(item.key)}>{item.label}</DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('charity')}>{t('charity', locale)}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('news')}>{t('news', locale)}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('zawaj')}>{t('zawaj', locale)}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1 ms-auto">
          {/* Mobile Search Toggle */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleSearch}>
            <Search className="h-5 w-5" />
          </Button>

          {/* Notifications */}
          <div className="relative">
            <Button variant="ghost" size="icon" onClick={() => setShowNotifs(!showNotifs)}>
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <span className="absolute -top-0.5 -end-0.5 h-4 min-w-4 px-1 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">
                  {notificationCount}
                </span>
              )}
            </Button>
            <AnimatePresence>
              {showNotifs && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className={`absolute top-full mt-2 ${isRTL ? 'right-0' : 'left-0'} w-80 rounded-xl border border-border bg-card p-2 shadow-2xl z-50`}
                >
                  <div className="p-2 border-b border-border mb-1">
                    <h3 className="font-semibold text-sm">الإشعارات</h3>
                  </div>
                  {demoNotifications.map((n) => (
                    <button key={n.id} className={`w-full text-start p-2 rounded-lg hover:bg-secondary/50 transition-colors ${!n.read ? 'bg-sultan/5' : ''}`}>
                      <p className="text-xs leading-relaxed">{n.text}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">{n.time}</p>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Messages */}
          <Button variant="ghost" size="icon" onClick={() => navigate('messages')}>
            <MessageCircle className="h-5 w-5" />
            {messageCount > 0 && (
              <span className="absolute -top-0.5 -end-0.5 h-4 min-w-4 px-1 rounded-full bg-sultan text-royal text-[10px] flex items-center justify-center font-bold">
                {messageCount}
              </span>
            )}
          </Button>

          {/* Language */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Globe className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isRTL ? 'start' : 'end'}>
              {(Object.keys(langs) as Array<keyof typeof langs>).map((lang) => (
                <DropdownMenuItem key={lang} onClick={() => setLocale(lang as any)} className="gap-2">
                  <span>{langs[lang].flag}</span>
                  <span>{langs[lang].name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme */}
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {/* Mobile Menu Toggle */}
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          {/* User Avatar - Desktop */}
          {isAuthenticated && currentProfile && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="hidden md:flex items-center gap-2 px-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sultan/40 to-sultan/20 flex items-center justify-center">
                    <span className="text-sultan font-bold text-xs">{currentProfile.displayName.charAt(0)}</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={isRTL ? 'start' : 'end'} className="w-56">
                <div className="p-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sultan/40 to-sultan/20 flex items-center justify-center">
                      <span className="text-sultan font-bold">{currentProfile.displayName.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{currentProfile.displayName}</p>
                      <p className="text-xs text-muted-foreground">@{currentProfile.username}</p>
                    </div>
                  </div>
                </div>
                <DropdownMenuItem onClick={() => navigate('profile')} className="gap-2"><User className="h-4 w-4" /> الملف الشخصي</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('profile', { tab: 'wallet' })} className="gap-2"><Wallet className="h-4 w-4" /> المحفظة</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('admin')} className="gap-2"><Shield className="h-4 w-4" /> لوحة التحكم</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('profile', { tab: 'settings' })} className="gap-2"><Settings className="h-4 w-4" /> الإعدادات</DropdownMenuItem>
                <DropdownMenuItem className="gap-2 text-destructive"><LogOut className="h-4 w-4" /> تسجيل الخروج</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Mobile Search Bar */}
      <AnimatePresence>
        {useSultanStore.getState().isSearchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-border overflow-hidden"
          >
            <div className="p-3">
              <div className="relative">
                <Search className="absolute top-1/2 -translate-y-1/2 end-3 h-4 w-4 text-muted-foreground" />
                <Input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { navigate('marketplace'); toggleSearch(); } }}
                  placeholder={t('searchPlaceholder', locale)}
                  className="ps-4 pe-10 bg-secondary/50 border-sultan/30 rounded-full"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black z-40 lg:hidden" onClick={toggleMobileMenu} />
            <motion.div
              initial={{ x: isRTL ? 300 : -300 }}
              animate={{ x: 0 }}
              exit={{ x: isRTL ? 300 : -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`fixed top-0 ${isRTL ? 'right-0' : 'left-0'} w-72 h-full bg-card border-s z-50 lg:hidden overflow-y-auto`}
            >
              <div className="p-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sultan/40 to-sultan/20 flex items-center justify-center">
                    <span className="text-sultan font-bold text-lg">{currentProfile?.displayName.charAt(0) || 'م'}</span>
                  </div>
                  <div>
                    <p className="font-semibold">{currentProfile?.displayName || 'زائر'}</p>
                    <p className="text-xs text-muted-foreground">{currentProfile?.city || ''}</p>
                  </div>
                </div>
              </div>
              <nav className="p-2">
                {navItems.map((item) => (
                  <button key={item.key} onClick={() => { navigate(item.key); toggleMobileMenu(); }} className="w-full text-start px-4 py-3 rounded-lg hover:bg-secondary/50 transition-colors text-sm">
                    {item.label}
                  </button>
                ))}
                <div className="border-t border-border my-2" />
                <button onClick={() => { navigate('charity'); toggleMobileMenu(); }} className="w-full text-start px-4 py-3 rounded-lg hover:bg-secondary/50 transition-colors text-sm">{t('charity', locale)}</button>
                <button onClick={() => { navigate('news'); toggleMobileMenu(); }} className="w-full text-start px-4 py-3 rounded-lg hover:bg-secondary/50 transition-colors text-sm">{t('news', locale)}</button>
                <button onClick={() => { navigate('zawaj'); toggleMobileMenu(); }} className="w-full text-start px-4 py-3 rounded-lg hover:bg-secondary/50 transition-colors text-sm">{t('zawaj', locale)}</button>
                <button onClick={() => { navigate('admin'); toggleMobileMenu(); }} className="w-full text-start px-4 py-3 rounded-lg hover:bg-secondary/50 transition-colors text-sm">لوحة التحكم</button>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
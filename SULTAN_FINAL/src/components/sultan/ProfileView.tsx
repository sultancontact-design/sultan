'use client';
import { useSultanStore } from '@/lib/store';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, Wallet, Star, Users, ShoppingBag, Shield, Crown, TrendingUp, Coins, Gift, Zap, Settings, Moon, Sun, Globe, Bell, Lock, Clock } from 'lucide-react';
import { walletHistory, listings } from '@/lib/seed-data';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function ProfileView() {
  const { currentProfile, isAuthenticated, login, locale, setLocale, theme, toggleTheme, navigate, goBack, viewParams, addToast, openSupportModal } = useSultanStore();
  const [tab, setTab] = useState(viewParams?.tab || 'listings');
  const profile = currentProfile;

  // ── Auth gate: show login page if not authenticated ──
  if (!isAuthenticated || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm space-y-6">
          {/* Logo & Heading */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl sultan-gradient mb-3">
              <span className="text-royal font-bold text-3xl">S</span>
            </div>
            <h1 className="text-2xl font-bold">مرحباً بك في سلطان</h1>
            <p className="text-sm text-muted-foreground">سجّل دخولك للمتابعة</p>
          </div>

          {/* Login Card */}
          <div className="bg-card border border-border/50 rounded-2xl p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">البريد الإلكتروني</label>
              <Input
                type="email"
                placeholder="example@email.com"
                className="h-11 bg-white/5 border border-white/10 rounded-xl"
                dir="ltr"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">كلمة المرور</label>
              <Input
                type="password"
                placeholder="••••••••"
                className="h-11 bg-white/5 border border-white/10 rounded-xl"
                dir="ltr"
              />
            </div>
            <Button
              className="w-full h-11 bg-gradient-to-r from-amber-600 to-yellow-500 text-royal font-bold rounded-xl hover:opacity-90 transition-opacity"
              onClick={() => login()}
            >
              تسجيل الدخول
            </Button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">أو</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Google login */}
            <Button
              variant="outline"
              className="w-full h-11 rounded-xl border-white/10 hover:bg-white/5"
              onClick={() => login()}
            >
              <svg className="h-5 w-5 me-2" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              تسجيل بحساب Google
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              ليس لديك حساب؟{' '}
              <button className="text-sultan hover:underline font-medium">سجّل الآن</button>
            </p>
          </div>

          {/* Guest browse */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-2">للتجربة كضيف</p>
            <Button
              variant="ghost"
              className="text-sm text-muted-foreground hover:text-foreground"
              onClick={() => navigate('home')}
            >
              تصفح كضيف
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const myListings = listings.slice(0, 8);

  const tabs = [
    { key: 'listings', label: 'إعلاناتي', icon: ShoppingBag },
    { key: 'wallet', label: 'المحفظة', icon: Wallet },
    { key: 'settings', label: 'الإعدادات', icon: Settings },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 pb-20">
      <div className="flex items-center gap-2 py-4">
        <Button variant="ghost" size="icon" onClick={goBack}><ArrowRight className="h-5 w-5" /></Button>
        <h1 className="text-xl font-bold">الملف الشخصي</h1>
      </div>

      {/* Profile Header */}
      <Card className="p-6 border-border/50">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-sultan/40 to-sultan/20 flex items-center justify-center shrink-0">
            <span className="text-sultan font-bold text-2xl">{profile.displayName.charAt(0)}</span>
          </div>
          <div className="text-center sm:text-start flex-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-bold">{profile.displayName}</h2>
              {profile.isVerified && <Shield className="h-5 w-5 text-sultan" />}
              {profile.isRising && <Badge className="bg-sultan/10 text-sultan border-0"><Crown className="h-3 w-3 me-1" /> صاعد</Badge>}
            </div>
            <p className="text-sm text-muted-foreground">@{profile.username} · {profile.city}</p>
            <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
              <Star className="h-3 w-3 text-sultan" /> مستوى الثقة: {profile.trustScore}%
            </div>
          </div>
          <Button variant="outline" onClick={() => openSupportModal({ id: profile.id, title: profile.displayName, type: 'user' })} className="border-sultan/30 text-sultan hover:bg-sultan/10">
            ادعم
          </Button>
        </div>

        <div className="grid grid-cols-4 gap-3 mt-6">
          {[
            { label: 'الإعلانات', value: String(profile.listingCount), icon: ShoppingBag },
            { label: 'المتابعون', value: String(profile.followerCount), icon: Users },
            { label: 'قوة سلطان', value: profile.sultanPower.toLocaleString(), icon: Zap },
            { label: 'المتابَعين', value: String(profile.followingCount), icon: Users },
          ].map((s) => (
            <div key={s.label} className="text-center p-3 rounded-xl bg-secondary/30">
              <s.icon className="h-4 w-4 text-sultan mx-auto mb-1" />
              <p className="font-bold text-lg">{s.value}</p>
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex gap-1 mt-6 p-1 bg-secondary/30 rounded-xl w-fit">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t.key ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {/* Listings Tab */}
        {tab === 'listings' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {myListings.map(l => (
              <div key={l.id} onClick={() => { useSultanStore.getState().selectListing(l); }} className="flex gap-3 rounded-xl bg-card border border-border/50 p-3 cursor-pointer hover:border-sultan/30 transition-all">
                <div className={`w-20 h-20 rounded-lg bg-gradient-to-br ${l.images} shrink-0`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sultan font-bold text-sm">{l.price.toLocaleString()} درهم</p>
                  <p className="text-sm line-clamp-1 mt-0.5">{l.title}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <Badge variant={l.status === 'active' ? 'default' : 'secondary'} className="text-[9px]">{l.status === 'active' ? 'نشط' : 'غير نشط'}</Badge>
                    <span>{l.city}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Wallet Tab */}
        {tab === 'wallet' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'عملات سلطان', value: profile.coinsBalance, icon: Coins, color: 'text-sultan', bg: 'bg-sultan/10' },
                { label: 'المكافآت', value: profile.rewardsBalance, icon: Gift, color: 'text-green-400', bg: 'bg-green-400/10' },
                { label: 'قيد الانتظار', value: profile.pendingRewards, icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
                { label: 'قوة سلطان', value: profile.sultanPower, icon: Zap, color: 'text-purple-400', bg: 'bg-purple-400/10' },
              ].map(w => (
                <Card key={w.label} className="p-4 border-border/50">
                  <w.icon className={`h-5 w-5 ${w.color} mb-2`} />
                  <p className="text-xl font-bold">{w.value.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{w.label}</p>
                </Card>
              ))}
            </div>
            <div className="flex gap-2">
              <Button className="flex-1 bg-sultan text-royal hover:bg-sultan/90" onClick={() => addToast('شراء العملات غير متاح في النسخة التجريبية', 'info')}>شراء عملات</Button>
              <Button variant="outline" className="flex-1" onClick={() => addToast('السحب غير متاح في النسخة التجريبية', 'info')}>سحب</Button>
            </div>
            <Card className="border-border/50">
              <h3 className="font-semibold p-4 pb-2">سجل المعاملات</h3>
              <div className="divide-y divide-border/30">
                {walletHistory.map(w => (
                  <div key={w.id} className="flex items-center justify-between p-4">
                    <div>
                      <p className="text-sm">{w.description}</p>
                      <p className="text-xs text-muted-foreground">{w.date}</p>
                    </div>
                    <div className="text-end">
                      <p className={`font-semibold text-sm ${w.amount < 0 ? 'text-red-400' : 'text-green-400'}`}>{w.amount > 0 ? '+' : ''}{w.amount}</p>
                      <Badge variant={w.status === 'completed' ? 'default' : 'secondary'} className="text-[9px]">{w.status === 'completed' ? 'مكتمل' : 'قيد الانتظار'}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Settings Tab */}
        {tab === 'settings' && (
          <Card className="p-6 border-border/50 space-y-6">
            <h3 className="font-semibold">الإعدادات</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3"><Moon className="h-5 w-5 text-muted-foreground" /><div><p className="text-sm font-medium">الوضع الداكن</p><p className="text-xs text-muted-foreground">تبديل بين الوضع الفاتح والداكن</p></div></div>
                <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3"><Globe className="h-5 w-5 text-muted-foreground" /><div><p className="text-sm font-medium">اللغة</p><p className="text-xs text-muted-foreground">اختر لغة الواجهة</p></div></div>
                <select value={locale} onChange={(e) => setLocale(e.target.value as any)} className="bg-secondary/50 border border-border rounded-lg px-3 py-1.5 text-sm">
                  <option value="ar">العربية</option>
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                  <option value="darija">الدارجة</option>
                </select>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3"><Bell className="h-5 w-5 text-muted-foreground" /><div><p className="text-sm font-medium">الإشعارات</p><p className="text-xs text-muted-foreground">تلقي إشعارات وتحديثات</p></div></div>
                <Switch defaultChecked onCheckedChange={(v) => addToast(v ? 'تم تفعيل الإشعارات' : 'تم إيقاف الإشعارات', 'success')} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3"><Lock className="h-5 w-5 text-muted-foreground" /><div><p className="text-sm font-medium">الأمان</p><p className="text-xs text-muted-foreground">كلمة المرور والتحقق بخطوتين</p></div></div>
                <Button variant="outline" size="sm" onClick={() => addToast('إعادة تعيين كلمة المرور غير متاحة في النسخة التجريبية', 'info')}>تغيير</Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

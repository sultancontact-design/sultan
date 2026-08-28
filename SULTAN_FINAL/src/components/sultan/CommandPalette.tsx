'use client'

import { useMemo } from 'react'
import {
  CommandDialog, CommandInput, CommandList, CommandEmpty,
  CommandGroup, CommandItem, CommandSeparator,
} from '@/components/ui/command'
import { useSultanStore } from '@/lib/store'
import { t } from '@/lib/i18n'
import { categories, cities } from '@/lib/seed-data'
import {
  Home, Store, Car, Building2, UtensilsCrossed, Wrench,
  Briefcase, Gavel, Heart, Newspaper, Users, Crown,
  Sun, Moon, Plus, User, Shield,
} from 'lucide-react'

const NAV_COMMANDS = [
  { key: 'home', view: 'home', icon: Home },
  { key: 'marketplace', view: 'marketplace', icon: Store },
  { key: 'motors', view: 'motors', icon: Car },
  { key: 'realestate', view: 'realestate', icon: Building2 },
  { key: 'food', view: 'food', icon: UtensilsCrossed },
  { key: 'services', view: 'services', icon: Wrench },
  { key: 'jobs', view: 'jobs', icon: Briefcase },
  { key: 'auctions', view: 'auctions', icon: Gavel },
  { key: 'charity', view: 'charity', icon: Heart },
  { key: 'news', view: 'news', icon: Newspaper },
  { key: 'profile', view: 'profile', icon: User },
  { key: 'admin', view: 'admin', icon: Shield },
]

export default function CommandPalette() {
  const {
    isCommandPaletteOpen, toggleCommandPalette, navigate,
    setSelectedCategory, setSelectedCity, toggleTheme,
    openPublishModal, locale, theme, addToast,
  } = useSultanStore()

  const isRTL = locale === 'ar' || locale === 'darija'

  function handleSelect(view: string, params?: Record<string, any>) {
    toggleCommandPalette()
    navigate(view, params)
  }

  return (
    <CommandDialog
      open={isCommandPaletteOpen}
      onOpenChange={toggleCommandPalette}
      title={t('commandPalette', locale)}
      description=""
      className={isRTL ? '[&_>*]:direction:rtl' : ''}
    >
      <CommandInput placeholder={t('searchPlaceholder', locale)} dir={isRTL ? 'rtl' : 'ltr'} />
      <CommandList>
        <CommandEmpty>لا توجد نتائج</CommandEmpty>

        <CommandGroup heading="التنقل">
          {NAV_COMMANDS.map(cmd => (
            <CommandItem
              key={cmd.key}
              onSelect={() => handleSelect(cmd.view)}
              className={isRTL ? 'flex-row-reverse justify-end' : ''}
            >
              <cmd.icon className="h-4 w-4 me-2" />
              <span>{t(cmd.key, locale)}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="الأقسام">
          {categories.filter(c => c.order > 0 && c.order <= 11).map(cat => (
            <CommandItem
              key={cat.id}
              onSelect={() => {
                setSelectedCategory(cat.id)
                toggleCommandPalette()
                navigate('marketplace')
              }}
              className={isRTL ? 'flex-row-reverse justify-end' : ''}
            >
              <Store className="h-4 w-4 me-2" />
              <span>{cat.nameAr}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="المدن">
          {cities.slice(0, 8).map(city => (
            <CommandItem
              key={city.id}
              onSelect={() => {
                setSelectedCity(city.nameAr)
                toggleCommandPalette()
                navigate('marketplace')
              }}
              className={isRTL ? 'flex-row-reverse justify-end' : ''}
            >
              <span className="h-4 w-4 me-2 text-center">📍</span>
              <span>{city.nameAr}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="إجراءات">
          <CommandItem
            onSelect={() => { openPublishModal(); toggleCommandPalette() }}
            className={isRTL ? 'flex-row-reverse justify-end' : ''}
          >
            <Plus className="h-4 w-4 me-2" />
            <span>{t('publish', locale)}</span>
          </CommandItem>
          <CommandItem
            onSelect={() => { toggleTheme(); toggleCommandPalette() }}
            className={isRTL ? 'flex-row-reverse justify-end' : ''}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4 me-2" /> : <Moon className="h-4 w-4 me-2" />}
            <span>{theme === 'dark' ? t('lightMode', locale) : t('darkMode', locale)}</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}

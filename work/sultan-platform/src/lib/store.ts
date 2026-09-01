import { create } from 'zustand'

// ─── Types ───────────────────────────────────────────────────────────────────

export interface UserProfile {
  id: string
  username: string
  displayName: string
  avatar: string
  city: string
  coinsBalance: number
  rewardsBalance: number
  pendingRewards: number
  sultanPower: number
  trustScore: number
  isVerified: boolean
  isBusiness: boolean
  isSultanSupported: boolean
  isRising: boolean
  isFeatured: boolean
}

export interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

export interface SultanState {
  // ─── Navigation ────────────────────────────────────────────────────────
  currentView: string
  previousView: string | null
  viewParams: Record<string, any>
  isMobileMenuOpen: boolean
  isCommandPaletteOpen: boolean
  isSearchOpen: boolean
  navigate: (view: string, params?: Record<string, any>) => void
  goBack: () => void
  toggleMobileMenu: () => void
  toggleCommandPalette: () => void
  toggleSearch: () => void
  closeAllModals: () => void

  // ─── Auth ─────────────────────────────────────────────────────────────
  isAuthenticated: boolean
  currentProfile: UserProfile | null
  login: () => void
  logout: () => void

  // ─── Theme ─────────────────────────────────────────────────────────────
  theme: 'dark' | 'light'
  toggleTheme: () => void

  // ─── Language ──────────────────────────────────────────────────────────
  locale: 'ar' | 'fr' | 'en' | 'darija'
  setLocale: (locale: 'ar' | 'fr' | 'en' | 'darija') => void
  isRTL: boolean

  // ─── API Data ────────────────────────────────────────────────────────
  apiCategories: any[]
  apiAuctions: any[]
  apiCharity: any[]
  apiStats: any
  isDataLoaded: boolean
  initializeApp: () => Promise<void>

  // ─── Listings ──────────────────────────────────────────────────────────
  listings: any[]
  filteredListings: any[]
  selectedListing: any | null
  setListings: (items: any[]) => void
  searchQuery: string
  selectedCategory: string | null
  selectedCity: string | null
  priceRange: [number, number]
  condition: string | null
  sortBy: string
  setSearchQuery: (q: string) => void
  setSelectedCategory: (c: string | null) => void
  setSelectedCity: (c: string | null) => void
  setPriceRange: (r: [number, number]) => void
  setCondition: (c: string | null) => void
  setSortBy: (s: string) => void
  selectListing: (l: any | null) => void
  clearFilters: () => void

  // ─── UI ────────────────────────────────────────────────────────────────
  isPublishModalOpen: boolean
  isSupportModalOpen: boolean
  supportTarget: any | null
  notificationCount: number
  messageCount: number
  toasts: Toast[]
  openPublishModal: () => void
  closePublishModal: () => void
  openSupportModal: (target?: any) => void
  closeSupportModal: () => void
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void
  removeToast: (id: string) => void
}

// ─── Demo Profile ────────────────────────────────────────────────────────────

const DEMO_PROFILE: UserProfile = {
  id: 'demo-001',
  username: 'youssef_sultan',
  displayName: 'يوسف بنعلي',
  avatar: '',
  city: 'الدار البيضاء',
  coinsBalance: 2500,
  rewardsBalance: 750,
  pendingRewards: 200,
  sultanPower: 1200,
  trustScore: 85,
  isVerified: true,
  isBusiness: false,
  isSultanSupported: false,
  isRising: true,
  isFeatured: false,
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function computeFilteredListings(
  listings: any[],
  searchQuery: string,
  selectedCategory: string | null,
  selectedCity: string | null,
  priceRange: [number, number],
  condition: string | null,
  sortBy: string,
): any[] {
  let result = [...listings]

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase()
    result = result.filter(
      (item) =>
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.description && item.description.toLowerCase().includes(q)),
    )
  }

  if (selectedCategory) {
    result = result.filter(
      (item) => item.category === selectedCategory,
    )
  }

  if (selectedCity) {
    result = result.filter(
      (item) => item.city === selectedCity,
    )
  }

  if (priceRange[0] > 0 || priceRange[1] < Infinity) {
    result = result.filter(
      (item) =>
        item.price >= priceRange[0] && item.price <= priceRange[1],
    )
  }

  if (condition) {
    result = result.filter(
      (item) => item.condition === condition,
    )
  }

  switch (sortBy) {
    case 'price-asc':
      result.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      result.sort((a, b) => b.price - a.price)
      break
    case 'newest':
      result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime(),
      )
      break
    case 'oldest':
      result.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime(),
      )
      break
    case 'popular':
      result.sort((a, b) => (b.views ?? 0) - (a.views ?? 0))
      break
    default:
      break
  }

  return result
}

// ─── Store ───────────────────────────────────────────────────────────────────

export const useSultanStore = create<SultanState>()((set, get) => ({
  // ─── Navigation ────────────────────────────────────────────────────────
  currentView: 'home',
  previousView: null,
  viewParams: {},
  isMobileMenuOpen: false,
  isCommandPaletteOpen: false,
  isSearchOpen: false,

  navigate: (view: string, params?: Record<string, any>) => {
    set((state) => ({
      previousView: state.currentView,
      currentView: view,
      viewParams: params || {},
    }))
  },

  goBack: () => {
    const state = get()
    if (state.previousView) {
      set({
        currentView: state.previousView,
        previousView: null,
        viewParams: {},
      })
    }
  },

  toggleMobileMenu: () =>
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),

  toggleCommandPalette: () =>
    set((state) => ({
      isCommandPaletteOpen: !state.isCommandPaletteOpen,
    })),

  toggleSearch: () =>
    set((state) => ({ isSearchOpen: !state.isSearchOpen })),

  closeAllModals: () =>
    set({
      isMobileMenuOpen: false,
      isCommandPaletteOpen: false,
      isSearchOpen: false,
      isPublishModalOpen: false,
      isSupportModalOpen: false,
    }),

  // ─── Auth ─────────────────────────────────────────────────────────────
  isAuthenticated: true,
  currentProfile: { ...DEMO_PROFILE },

  login: () =>
    set({ isAuthenticated: true, currentProfile: { ...DEMO_PROFILE } }),

  logout: () =>
    set({ isAuthenticated: false, currentProfile: null }),

  // ─── Theme ─────────────────────────────────────────────────────────────
  theme: 'dark',

  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === 'dark' ? 'light' : 'dark',
    })),

  // ─── Language ──────────────────────────────────────────────────────────
  locale: 'ar',
  isRTL: true,

  setLocale: (newLocale) => set({ locale: newLocale, isRTL: newLocale === 'ar' || newLocale === 'darija' }),

  // ─── API Data ────────────────────────────────────────────────────────
  apiCategories: [],
  apiAuctions: [],
  apiCharity: [],
  apiStats: null,
  isDataLoaded: false,

  initializeApp: async () => {
    if (get().isDataLoaded) return
    try {
      const [catRes, listRes, aucRes, charRes, statsRes] = await Promise.all([
        fetch('/api/categories').then(r => r.json()).catch(() => ({ categories: [] })),
        fetch('/api/listings?limit=100').then(r => r.json()).catch(() => ({ listings: [] })),
        fetch('/api/auctions').then(r => r.json()).catch(() => ({ auctions: [] })),
        fetch('/api/charity').then(r => r.json()).catch(() => ({ cases: [] })),
        fetch('/api/stats').then(r => r.json()).catch(() => ({})),
      ])
      const cats = catRes.categories || []
      const lists = listRes.listings || []
      const aucs = aucRes.auctions || []
      const chars = charRes.cases || []
      set({
        apiCategories: cats,
        apiAuctions: aucs,
        apiCharity: chars,
        apiStats: statsRes,
        isDataLoaded: true,
      })
      get().setListings(lists)
    } catch (e) {
      console.error('Failed to initialize app data:', e)
    }
  },

  // ─── Listings ──────────────────────────────────────────────────────────
  filteredListings: [],
  setListings: (items) => {
    set({ listings: items, filteredListings: computeFilteredListings(items, get().searchQuery, get().selectedCategory, get().selectedCity, get().priceRange, get().condition, get().sortBy) })
  },
  selectedListing: null,
  searchQuery: '',
  selectedCategory: null,
  selectedCity: null,
  priceRange: [0, 999999999],
  condition: null,
  sortBy: 'newest',

  setSearchQuery: (q) => {
    set({ searchQuery: q })
    const s = get()
    set({
      filteredListings: computeFilteredListings(
        s.listings,
        q,
        s.selectedCategory,
        s.selectedCity,
        s.priceRange,
        s.condition,
        s.sortBy,
      ),
    })
  },

  setSelectedCategory: (c) => {
    set({ selectedCategory: c })
    const s = get()
    set({
      filteredListings: computeFilteredListings(
        s.listings,
        s.searchQuery,
        c,
        s.selectedCity,
        s.priceRange,
        s.condition,
        s.sortBy,
      ),
    })
  },

  setSelectedCity: (c) => {
    set({ selectedCity: c })
    const s = get()
    set({
      filteredListings: computeFilteredListings(
        s.listings,
        s.searchQuery,
        s.selectedCategory,
        c,
        s.priceRange,
        s.condition,
        s.sortBy,
      ),
    })
  },

  setPriceRange: (r) => {
    set({ priceRange: r })
    const s = get()
    set({
      filteredListings: computeFilteredListings(
        s.listings,
        s.searchQuery,
        s.selectedCategory,
        s.selectedCity,
        r,
        s.condition,
        s.sortBy,
      ),
    })
  },

  setCondition: (c) => {
    set({ condition: c })
    const s = get()
    set({
      filteredListings: computeFilteredListings(
        s.listings,
        s.searchQuery,
        s.selectedCategory,
        s.selectedCity,
        s.priceRange,
        c,
        s.sortBy,
      ),
    })
  },

  setSortBy: (sortBy) => {
    set({ sortBy })
    const s = get()
    set({
      filteredListings: computeFilteredListings(
        s.listings,
        s.searchQuery,
        s.selectedCategory,
        s.selectedCity,
        s.priceRange,
        s.condition,
        sortBy,
      ),
    })
  },

  selectListing: (l) => set({ selectedListing: l, currentView: 'listing', previousView: get().currentView }),

  clearFilters: () => {
    set({
      searchQuery: '',
      selectedCategory: null,
      selectedCity: null,
      priceRange: [0, 999999999],
      condition: null,
      sortBy: 'newest',
    })
    const { listings } = get()
    set({ filteredListings: [...listings] })
  },

  // ─── UI ────────────────────────────────────────────────────────────────
  isPublishModalOpen: false,
  isSupportModalOpen: false,
  supportTarget: null,
  notificationCount: 7,
  messageCount: 3,
  toasts: [],

  openPublishModal: () => set({ isPublishModalOpen: true }),
  closePublishModal: () => set({ isPublishModalOpen: false }),

  openSupportModal: (target) =>
    set({ isSupportModalOpen: true, supportTarget: target ?? null }),
  closeSupportModal: () =>
    set({ isSupportModalOpen: false, supportTarget: null }),

  addToast: (message, type = 'info') => {
    const id = crypto.randomUUID()
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }],
    }))
    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      get().removeToast(id)
    }, 4000)
  },

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}))

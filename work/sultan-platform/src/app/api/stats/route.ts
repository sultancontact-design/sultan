import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const runtime = 'edge'

export async function GET() {
  try {
    const [
      usersRes,
      listingsRes,
      activeListingsRes,
      auctionsRes,
      activeAuctionsRes,
      charityRes,
      recentUsersRes,
    ] = await Promise.all([
      supabase.from('Profile').select('id', { count: 'exact', head: true }),
      supabase.from('Listing').select('id', { count: 'exact', head: true }),
      supabase.from('Listing').select('id', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('Auction').select('id', { count: 'exact', head: true }),
      supabase.from('Auction').select('id', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('CharityCase').select('id', { count: 'exact', head: true }),
      supabase.from('Profile').select('*').order('createdAt', { ascending: false }).limit(5),
    ])

    // Total revenue from all listings
    const { data: revenueData } = await supabase
      .from('Listing')
      .select('price')

    const totalRevenue = (revenueData || []).reduce((sum: number, l: any) => sum + (l.price || 0), 0)

    // Listings by category
    const { data: categories } = await supabase
      .from('Category')
      .select('nameAr')
      .eq('isActive', true)
      .order('order', { ascending: true })

    let listingsByCategory: { name: string; count: number }[] = []
    if (categories && categories.length > 0) {
      const categoryIds = categories.map((c: any) => c.nameAr)
      const { data: listingCounts } = await supabase
        .from('Listing')
        .select('categoryId, status')
        .eq('status', 'active')

      const countMap: Record<string, number> = {}
      const catNameMap: Record<string, string> = {}
      for (const c of categories) {
        catNameMap[c.nameAr] = c.nameAr
        countMap[c.nameAr] = 0
      }

      // Get category id to name mapping
      const { data: catMap } = await supabase
        .from('Category')
        .select('id, nameAr')

      const idToName: Record<string, string> = {}
      if (catMap) {
        for (const c of catMap) {
          idToName[c.id] = c.nameAr
        }
      }

      if (listingCounts) {
        for (const l of listingCounts) {
          const name = idToName[l.categoryId]
          if (name && countMap[name] !== undefined) {
            countMap[name]++
          }
        }
      }

      listingsByCategory = Object.entries(countMap).map(([name, count]) => ({ name, count }))
    }

    // User growth over last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const { data: recentUsers } = await supabase
      .from('Profile')
      .select('createdAt')
      .gte('createdAt', thirtyDaysAgo)
      .order('createdAt', { ascending: true })

    const userGrowthMap: Record<string, number> = {}
    if (recentUsers) {
      for (const u of recentUsers) {
        const date = new Date(u.createdAt).toISOString().split('T')[0]
        userGrowthMap[date] = (userGrowthMap[date] || 0) + 1
      }
    }
    const userGrowth = Object.entries(userGrowthMap).map(([date, count]) => ({ date, count }))

    return NextResponse.json({
      totalUsers: usersRes.count || 0,
      totalListings: listingsRes.count || 0,
      activeListings: activeListingsRes.count || 0,
      totalAuctions: auctionsRes.count || 0,
      activeAuctions: activeAuctionsRes.count || 0,
      totalCharity: charityRes.count || 0,
      recentUsers: recentUsersRes.data || [],
      totalRevenue,
      listingsByCategory,
      userGrowth,
    })
  } catch (error: any) {
    console.error('Stats API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

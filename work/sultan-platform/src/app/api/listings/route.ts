import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const runtime = 'edge'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const city = searchParams.get('city')
    const search = searchParams.get('search')
    const condition = searchParams.get('condition')
    const sortBy = searchParams.get('sort') || 'newest'
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    let query = supabase
      .from('Listing')
      .select(
        '*, profile:Profile(id, displayName, avatar, city, isVerified, trustScore), category:Category(id, nameAr, slug, icon)',
        { count: 'exact' }
      )
      .eq('status', 'active')

    if (category && category !== 'all') {
      query = query.eq('categoryId', category)
    }
    if (city && city !== 'all') {
      query = query.eq('city', city)
    }
    if (condition && condition !== 'all') {
      query = query.eq('condition', condition)
    }
    if (minPrice) {
      query = query.gte('price', parseFloat(minPrice))
    }
    if (maxPrice) {
      query = query.lte('price', parseFloat(maxPrice))
    }
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }

    switch (sortBy) {
      case 'price_asc':
        query = query.order('price', { ascending: true })
        break
      case 'price_desc':
        query = query.order('price', { ascending: false })
        break
      case 'popular':
        query = query.order('viewsCount', { ascending: false })
        break
      default:
        query = query.order('createdAt', { ascending: false })
    }

    const from = (page - 1) * limit
    query = query.range(from, from + limit - 1)

    const { data: listings, count: total, error } = await query

    if (error) throw error

    return NextResponse.json({
      listings: listings || [],
      total: total || 0,
      page,
      totalPages: Math.ceil((total || 0) / limit),
    })
  } catch (error: any) {
    console.error('Listings API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

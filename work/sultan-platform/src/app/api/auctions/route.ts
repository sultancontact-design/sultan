import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const runtime = 'edge'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'active'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    let query = supabase
      .from('Auction')
      .select('*', { count: 'exact' })
      .order('createdAt', { ascending: false })

    if (status !== 'all') {
      query = query.eq('status', status)
    }

    const from = (page - 1) * limit
    query = query.range(from, from + limit - 1)

    const { data: auctions, count: total, error } = await query

    if (error) throw error

    return NextResponse.json({
      auctions: auctions || [],
      total: total || 0,
      page,
      totalPages: Math.ceil((total || 0) / limit),
    })
  } catch (error: any) {
    console.error('Auctions API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const runtime = 'edge'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const city = searchParams.get('city')
    const role = searchParams.get('role')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    let query = supabase
      .from('Profile')
      .select('*, listings(count)', { count: 'exact' })
      .order('createdAt', { ascending: false })

    if (search) {
      query = query.or(`displayName.ilike.%${search}%,username.ilike.%${search}%,email.ilike.%${search}%`)
    }
    if (city) {
      query = query.eq('city', city)
    }
    if (role) {
      query = query.eq('role', role)
    }

    const from = (page - 1) * limit
    query = query.range(from, from + limit - 1)

    const { data: profiles, count: total, error } = await query

    if (error) throw error

    return NextResponse.json({
      profiles: profiles || [],
      total: total || 0,
      page,
      totalPages: Math.ceil((total || 0) / limit),
    })
  } catch (error: any) {
    console.error('Profiles API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

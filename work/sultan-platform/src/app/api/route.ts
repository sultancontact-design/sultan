import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const runtime = 'edge'

export async function GET() {
  try {
    const [userRes, listingRes, categoryRes] = await Promise.all([
      supabase.from('Profile').select('id', { count: 'exact', head: true }),
      supabase.from('Listing').select('id', { count: 'exact', head: true }),
      supabase.from('Category').select('id', { count: 'exact', head: true }),
    ])

    if (userRes.error) throw userRes.error

    return NextResponse.json({
      name: 'سلطان | SULTAN',
      version: '2.0.0',
      status: 'operational',
      database: 'connected',
      stats: {
        users: userRes.count || 0,
        listings: listingRes.count || 0,
        categories: categoryRes.count || 0,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      { name: 'سلطان | SULTAN', status: 'error', database: 'disconnected' },
      { status: 503 }
    )
  }
}

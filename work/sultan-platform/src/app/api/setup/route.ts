import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const runtime = 'edge'

export async function GET() {
  try {
    const [profileRes, listingRes, categoryRes] = await Promise.all([
      supabase.from('Profile').select('id', { count: 'exact', head: true }),
      supabase.from('Listing').select('id', { count: 'exact', head: true }),
      supabase.from('Category').select('id', { count: 'exact', head: true }),
    ])

    return NextResponse.json({
      database: 'connected',
      profiles: profileRes.count || 0,
      listings: listingRes.count || 0,
      categories: categoryRes.count || 0,
    })
  } catch (error: any) {
    return NextResponse.json({ database: 'error', error: error.message }, { status: 503 })
  }
}

export async function POST() {
  try {
    const { count } = await supabase
      .from('Profile')
      .select('id', { count: 'exact', head: true })

    if ((count || 0) > 0) {
      return NextResponse.json({
        success: true,
        message: 'Database already set up',
        profiles: count,
      })
    }

    return NextResponse.json({
      success: false,
      message: 'Database is empty. Run seed script locally: npx tsx prisma/seed.ts',
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

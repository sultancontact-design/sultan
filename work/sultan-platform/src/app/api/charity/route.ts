import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const runtime = 'edge'

export async function GET() {
  try {
    const { data: cases, error } = await supabase
      .from('CharityCase')
      .select('*')
      .eq('status', 'active')
      .order('createdAt', { ascending: false })

    if (error) throw error

    return NextResponse.json({ cases: cases || [] })
  } catch (error: any) {
    console.error('Charity API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

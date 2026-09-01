import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const runtime = 'edge'

export async function GET() {
  try {
    const { data: categories, error } = await supabase
      .from('Category')
      .select('*, children:Category!CategoryHierarchy_children(*)')
      .eq('isActive', true)
      .is('parentId', null)
      .order('order', { ascending: true })

    if (error) throw error

    return NextResponse.json({ categories: categories || [] })
  } catch (error: any) {
    console.error('Categories API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

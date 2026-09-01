import { createClient } from '@supabase/supabase-js'

// Browser-safe Supabase client (uses anon key, not service role)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ltdbaylnuivqnlthduhu.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_u20v6MgAdrjOxILqc14Tqw_cOMOMSlN'

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey)

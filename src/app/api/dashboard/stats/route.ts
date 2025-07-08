import { supabaseAdmin } from '@/lib/supabase-admin'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Get subscriber count
    const { count: subscriberCount } = await supabaseAdmin
      .from('subscribers')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)

    // Get newsletter counts
    const { count: totalNewsletters } = await supabaseAdmin
      .from('newsletters')
      .select('*', { count: 'exact', head: true })

    const { count: publishedNewsletters } = await supabaseAdmin
      .from('newsletters')
      .select('*', { count: 'exact', head: true })
      .eq('is_published', true)

    const { count: draftNewsletters } = await supabaseAdmin
      .from('newsletters')
      .select('*', { count: 'exact', head: true })
      .eq('is_published', false)

    // Calculate average open rate (mock data for now)
    const openRate = '24.5%'

    return NextResponse.json({
      subscriberCount: subscriberCount || 0,
      totalNewsletters: totalNewsletters || 0,
      publishedNewsletters: publishedNewsletters || 0,
      draftNewsletters: draftNewsletters || 0,
      openRate
    })
  } catch (error: any) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
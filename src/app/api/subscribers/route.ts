import { supabaseAdmin } from '@/lib/supabase-admin'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { data: subscribers, error } = await supabaseAdmin
      .from('subscribers')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json({ subscribers: subscribers || [] })
  } catch (error: any) {
    console.error('Fetch subscribers error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
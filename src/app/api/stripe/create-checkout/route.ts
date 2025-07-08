import { createServerSupabaseClientFromRequest } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, tier } = await request.json()

    if (!email || !tier) {
      return NextResponse.json({ error: 'Email and tier are required' }, { status: 400 })
    }

    const { supabase } = createServerSupabaseClientFromRequest(request)

    const { data: subscriber } = await supabase
      .from('subscribers')
      .select('id')
      .eq('email', email)
      .single()

    if (!subscriber) {
      return NextResponse.json({ error: 'Subscriber not found' }, { status: 404 })
    }

    const checkoutUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/checkout?email=${encodeURIComponent(email)}&tier=${tier}`

    return NextResponse.json({ url: checkoutUrl })
  } catch (error: any) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
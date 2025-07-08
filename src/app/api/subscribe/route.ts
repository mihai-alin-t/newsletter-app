import { supabaseAdmin } from '@/lib/supabase-admin'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const { data: existingSubscriber } = await supabaseAdmin
      .from('subscribers')
      .select('id, is_active')
      .eq('email', email)
      .single()

    if (existingSubscriber) {
      if (existingSubscriber.is_active) {
        return NextResponse.json({ error: 'Email already subscribed' }, { status: 400 })
      } else {
        const { error } = await supabaseAdmin
          .from('subscribers')
          .update({ is_active: true, updated_at: new Date().toISOString() })
          .eq('id', existingSubscriber.id)

        if (error) throw error
        return NextResponse.json({ message: 'Successfully resubscribed!' })
      }
    }

    const { error } = await supabaseAdmin
      .from('subscribers')
      .insert([{ email, name, is_active: true }])

    if (error) throw error

    return NextResponse.json({ message: 'Successfully subscribed!' })
  } catch (error: any) {
    console.error('Subscribe error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
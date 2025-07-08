import { supabaseAdmin } from '@/lib/supabase-admin'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { newsletterId } = await request.json()

    if (!newsletterId) {
      return NextResponse.json({ error: 'Newsletter ID is required' }, { status: 400 })
    }

    // Get the newsletter
    const { data: newsletter, error: newsletterError } = await supabaseAdmin
      .from('newsletters')
      .select('*')
      .eq('id', newsletterId)
      .single()

    if (newsletterError || !newsletter) {
      return NextResponse.json({ error: 'Newsletter not found' }, { status: 404 })
    }

    if (!newsletter.is_published) {
      return NextResponse.json({ error: 'Newsletter must be published first' }, { status: 400 })
    }

    // Get active subscribers
    const { data: subscribers, error: subscribersError } = await supabaseAdmin
      .from('subscribers')
      .select('id, email, name, subscription_tier')
      .eq('is_active', true)

    if (subscribersError) {
      return NextResponse.json({ error: 'Failed to fetch subscribers' }, { status: 500 })
    }

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({ error: 'No active subscribers found' }, { status: 400 })
    }

    // Filter subscribers based on newsletter tier
    const eligibleSubscribers = newsletter.is_premium 
      ? subscribers.filter(s => s.subscription_tier === 'pro')
      : subscribers

    if (eligibleSubscribers.length === 0) {
      return NextResponse.json({ 
        error: newsletter.is_premium 
          ? 'No pro subscribers found for this premium newsletter' 
          : 'No subscribers found'
      }, { status: 400 })
    }

    // Create newsletter send records
    const sendRecords = eligibleSubscribers.map(subscriber => ({
      newsletter_id: newsletterId,
      subscriber_id: subscriber.id,
      sent_at: new Date().toISOString()
    }))

    const { error: sendRecordsError } = await supabaseAdmin
      .from('newsletter_sends')
      .insert(sendRecords)

    if (sendRecordsError) {
      console.error('Error creating send records:', sendRecordsError)
    }

    // TODO: Integrate with actual email service (Resend, SendGrid, etc.)
    // For now, we'll simulate sending emails
    console.log(`Simulating email send to ${eligibleSubscribers.length} subscribers:`)
    eligibleSubscribers.forEach(subscriber => {
      console.log(`📧 Sending "${newsletter.title}" to ${subscriber.email}`)
    })

    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    return NextResponse.json({ 
      message: 'Newsletter sent successfully',
      sentCount: eligibleSubscribers.length,
      newsletterTitle: newsletter.title
    })

  } catch (error: any) {
    console.error('Send newsletter error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import NewsletterEditor from '../../newsletter-editor'
import DashboardLayout from '@/components/dashboard-layout'

export default function EditNewsletterPage() {
  const [loading, setLoading] = useState(true)
  const [newsletter, setNewsletter] = useState(null)
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  useEffect(() => {
    const checkAuthAndFetchNewsletter = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        
        if (error || !user) {
          console.log('No user found, redirecting to login')
          router.push('/auth/login')
          return
        }

        console.log('User found in edit newsletter page:', user.email)

        // Fetch the newsletter
        const { data: newsletter, error: newsletterError } = await supabase
          .from('newsletters')
          .select('*')
          .eq('id', id)
          .eq('author_id', user.id) // Ensure user can only edit their own newsletters
          .single()

        if (newsletterError || !newsletter) {
          console.error('Newsletter not found or access denied:', newsletterError)
          router.push('/dashboard/newsletters')
          return
        }

        setNewsletter(newsletter)

      } catch (error) {
        console.error('Edit newsletter page error:', error)
        router.push('/auth/login')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      checkAuthAndFetchNewsletter()
    }
  }, [router, id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading newsletter...</div>
      </div>
    )
  }

  if (!newsletter) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Newsletter not found</div>
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div className="bg-gray-50 min-h-screen">
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <h1 className="text-2xl font-bold text-gray-900">Edit Newsletter</h1>
              <p className="text-gray-600">Update your newsletter content</p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <NewsletterEditor newsletter={newsletter} />
        </div>
      </div>
    </DashboardLayout>
  )
}
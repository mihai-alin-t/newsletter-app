'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import DashboardLayout from '@/components/dashboard-layout'
import { 
  PencilIcon, 
  EyeIcon, 
  CalendarIcon,
  UserIcon,
  TagIcon
} from '@heroicons/react/24/outline'

export default function ViewNewsletterPage() {
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

        console.log('User found in view newsletter page:', user.email)

        // Fetch the newsletter
        const { data: newsletter, error: newsletterError } = await supabase
          .from('newsletters')
          .select('*')
          .eq('id', id)
          .single()

        if (newsletterError || !newsletter) {
          console.error('Newsletter not found:', newsletterError)
          router.push('/dashboard/newsletters')
          return
        }

        setNewsletter(newsletter)

      } catch (error) {
        console.error('View newsletter page error:', error)
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
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{newsletter.title}</h1>
                <p className="text-gray-600">Newsletter Details</p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.push(`/dashboard/newsletters/${id}/edit`)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <PencilIcon className="h-5 w-5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => router.push('/dashboard/newsletters')}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Back to Newsletters
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Newsletter Info */}
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Newsletter Information</h3>
            </div>
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-3">
                  <TagIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <p className="text-sm text-gray-900">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        newsletter.is_published 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {newsletter.is_published ? 'Published' : 'Draft'}
                      </span>
                      {newsletter.is_premium && (
                        <span className="ml-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          Premium
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <CalendarIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {newsletter.is_published ? 'Published' : 'Created'}
                    </p>
                    <p className="text-sm text-gray-900">
                      {new Date(newsletter.published_at || newsletter.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <EyeIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Views</p>
                    <p className="text-sm text-gray-900">{newsletter.view_count || 0}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Type</p>
                    <p className="text-sm text-gray-900">
                      {newsletter.is_premium ? 'Premium Content' : 'Free Content'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter Content */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Content Preview</h3>
            </div>
            <div className="px-6 py-4">
              {newsletter.excerpt && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Excerpt</h4>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                    {newsletter.excerpt}
                  </p>
                </div>
              )}
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Full Content</h4>
                <div className="prose max-w-none bg-gray-50 p-6 rounded-lg">
                  <div className="whitespace-pre-wrap text-gray-900">
                    {newsletter.content}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  PlusIcon, 
  DocumentTextIcon, 
  EyeIcon, 
  PencilIcon, 
  TrashIcon 
} from '@heroicons/react/24/outline'
import { supabase } from '@/lib/supabase'

interface Newsletter {
  id: string
  title: string
  content: string
  excerpt: string
  is_published: boolean
  is_premium: boolean
  published_at: string | null
  created_at: string
  view_count: number
}

interface NewslettersClientProps {
  newsletters: Newsletter[]
}

export default function NewslettersClient({ newsletters: initialNewsletters }: NewslettersClientProps) {
  const [newsletters, setNewsletters] = useState(initialNewsletters)
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this newsletter?')) return

    setLoading(id)
    try {
      const { error } = await supabase
        .from('newsletters')
        .delete()
        .eq('id', id)

      if (error) throw error

      setNewsletters(newsletters.filter(n => n.id !== id))
    } catch (error) {
      console.error('Delete error:', error)
    } finally {
      setLoading(null)
    }
  }

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    setLoading(id)
    try {
      const { error } = await supabase
        .from('newsletters')
        .update({ 
          is_published: !currentStatus,
          published_at: !currentStatus ? new Date().toISOString() : null
        })
        .eq('id', id)

      if (error) throw error

      setNewsletters(newsletters.map(n => 
        n.id === id 
          ? { ...n, is_published: !currentStatus, published_at: !currentStatus ? new Date().toISOString() : null }
          : n
      ))
    } catch (error) {
      console.error('Publish error:', error)
    } finally {
      setLoading(null)
    }
  }

  const handleSendNewsletter = async (id: string) => {
    if (!confirm('Are you sure you want to send this newsletter to all subscribers?')) return

    setLoading(id)
    try {
      const response = await fetch('/api/newsletters/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newsletterId: id }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send newsletter')
      }

      alert(`Newsletter sent successfully to ${result.sentCount} subscribers!`)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
      console.error('Send error:', error)
      alert(`Error sending newsletter: ${errorMessage}`)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Newsletters</h1>
              <p className="text-gray-600">Manage your newsletter content</p>
            </div>
            <button
              onClick={() => router.push('/dashboard/newsletters/new')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <PlusIcon className="h-5 w-5" />
              <span>New Newsletter</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {newsletters.length === 0 ? (
          <div className="text-center py-12">
            <DocumentTextIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No newsletters yet</h3>
            <p className="text-gray-500 mb-6">Create your first newsletter to get started</p>
            <button
              onClick={() => router.push('/dashboard/newsletters/new')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Newsletter
            </button>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <ul className="divide-y divide-gray-200">
              {newsletters.map((newsletter) => (
                <li key={newsletter.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {newsletter.title}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            newsletter.is_published 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {newsletter.is_published ? 'Published' : 'Draft'}
                          </span>
                          {newsletter.is_premium && (
                            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                              Premium
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {newsletter.excerpt || 'No excerpt available'}
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        {newsletter.is_published ? 'Published' : 'Created'} {new Date(newsletter.published_at || newsletter.created_at).toLocaleDateString()}
                        {newsletter.is_published && (
                          <span className="ml-2">• {newsletter.view_count} views</span>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => router.push(`/dashboard/newsletters/${newsletter.id}`)}
                        className="text-gray-400 hover:text-gray-600 p-1 rounded"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => router.push(`/dashboard/newsletters/${newsletter.id}/edit`)}
                        className="text-gray-400 hover:text-gray-600 p-1 rounded"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleTogglePublish(newsletter.id, newsletter.is_published)}
                        disabled={loading === newsletter.id}
                        className={`px-3 py-1 text-sm font-medium rounded ${
                          newsletter.is_published
                            ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                        } transition-colors mr-2`}
                      >
                        {loading === newsletter.id ? 'Loading...' : newsletter.is_published ? 'Unpublish' : 'Publish'}
                      </button>
                      
                      {newsletter.is_published && (
                        <button
                          onClick={() => handleSendNewsletter(newsletter.id)}
                          disabled={loading === newsletter.id}
                          className="px-3 py-1 text-sm font-medium rounded bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors mr-2"
                        >
                          Send to Subscribers
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(newsletter.id)}
                        disabled={loading === newsletter.id}
                        className="text-red-400 hover:text-red-600 p-1 rounded"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
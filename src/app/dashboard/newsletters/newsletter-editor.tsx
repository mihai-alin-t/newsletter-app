'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface NewsletterData {
  id: string
  title: string
  content: string
  excerpt?: string
  is_premium: boolean
}

interface NewsletterEditorProps {
  newsletter?: NewsletterData
}

export default function NewsletterEditor({ newsletter }: NewsletterEditorProps) {
  const [title, setTitle] = useState(newsletter?.title || '')
  const [content, setContent] = useState(newsletter?.content || '')
  const [excerpt, setExcerpt] = useState(newsletter?.excerpt || '')
  const [isPremium, setIsPremium] = useState(newsletter?.is_premium || false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSave = async (publish = false) => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const newsletterData = {
        title,
        content,
        excerpt,
        is_premium: isPremium,
        is_published: publish,
        published_at: publish ? new Date().toISOString() : null,
        author_id: user.id
      }

      let result
      if (newsletter) {
        result = await supabase
          .from('newsletters')
          .update(newsletterData)
          .eq('id', newsletter.id)
      } else {
        result = await supabase
          .from('newsletters')
          .insert([newsletterData])
      }

      if (result.error) throw result.error

      router.push('/dashboard/newsletters')
    } catch (error) {
      console.error('Save error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Newsletter Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
            placeholder="Enter newsletter title..."
          />
        </div>

        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
            Excerpt (Preview)
          </label>
          <textarea
            id="excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={3}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
            placeholder="Brief description of this newsletter..."
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={20}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-mono text-sm text-gray-900 bg-white"
            placeholder="Write your newsletter content here..."
          />
        </div>

        <div className="flex items-center">
          <input
            id="is_premium"
            type="checkbox"
            checked={isPremium}
            onChange={(e) => setIsPremium(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="is_premium" className="ml-2 block text-sm text-gray-900">
            Premium content (Pro subscribers only)
          </label>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={() => router.push('/dashboard/newsletters')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => handleSave(false)}
            disabled={loading || !title || !content}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={loading || !title || !content}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>
    </div>
  )
}
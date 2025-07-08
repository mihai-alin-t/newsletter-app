'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import NewslettersClient from './newsletters-client'
import DashboardLayout from '@/components/dashboard-layout'

interface Newsletter {
  id: string
  title: string
  content: string
  excerpt: string
  is_published: boolean
  is_premium: boolean
  created_at: string
  published_at: string | null
  view_count: number
}

export default function NewslettersWrapper() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        
        if (error || !user) {
          console.log('No user found, redirecting to login')
          router.push('/auth/login')
          return
        }

        console.log('User found in newsletters page:', user.email)

        // Fetch newsletters
        const { data: newsletters } = await supabase
          .from('newsletters')
          .select('*')
          .order('created_at', { ascending: false })

        setNewsletters(newsletters || [])

      } catch (error) {
        console.error('Newsletters page error:', error)
        router.push('/auth/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuthAndFetchData()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading newsletters...</div>
      </div>
    )
  }

  return (
    <DashboardLayout>
      <NewslettersClient newsletters={newsletters} />
    </DashboardLayout>
  )
}
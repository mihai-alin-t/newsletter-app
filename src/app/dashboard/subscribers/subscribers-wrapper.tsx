'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import SubscribersClient from './subscribers-client'
import DashboardLayout from '@/components/dashboard-layout'

export default function SubscribersWrapper() {
  const [subscribers, setSubscribers] = useState([])
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

        console.log('User found in subscribers page:', user.email)

        // Fetch subscribers using the API
        const response = await fetch('/api/subscribers')
        if (response.ok) {
          const data = await response.json()
          setSubscribers(data.subscribers || [])
        }

      } catch (error) {
        console.error('Subscribers page error:', error)
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
        <div className="text-lg">Loading subscribers...</div>
      </div>
    )
  }

  return (
    <DashboardLayout>
      <SubscribersClient subscribers={subscribers} />
    </DashboardLayout>
  )
}
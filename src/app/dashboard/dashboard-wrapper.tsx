'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import DashboardClient from './dashboard-client'
import DashboardLayout from '@/components/dashboard-layout'
import type { User } from '@supabase/supabase-js'

interface Profile {
  id: string
  email: string
  name?: string
  subscription_tier?: string
  role?: string
}

interface Newsletter {
  id: string
  title: string
  is_published: boolean
  is_premium: boolean
  created_at: string
  published_at?: string
}

export default function DashboardWrapper() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [newsletters, setNewsletters] = useState<Newsletter[]>([])
  const [subscriberCount, setSubscriberCount] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        
        if (error || !user) {
          console.log('No user found, redirecting to login')
          router.push('/auth/login')
          return
        }

        console.log('User found:', user.email)
        setUser(user)

        // Fetch profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (!profile) {
          console.log('No profile found, creating one...')
          // Try to create profile if it doesn't exist
          const { data: newProfile, error: profileError } = await supabase
            .from('profiles')
            .insert([{
              id: user.id,
              email: user.email || '',
              name: user.user_metadata?.name || '',
              role: 'subscriber'
            }])
            .select()
            .single()

          if (profileError) {
            console.error('Error creating profile:', profileError)
          } else {
            setProfile(newProfile)
          }
        } else {
          setProfile(profile)
        }

        // Fetch newsletters
        const { data: newsletters } = await supabase
          .from('newsletters')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10)

        setNewsletters(newsletters || [])

        // Fetch dashboard stats from API
        const response = await fetch('/api/dashboard/stats')
        if (response.ok) {
          const stats = await response.json()
          setSubscriberCount(stats.subscriberCount)
        }

      } catch (error) {
        console.error('Dashboard error:', error)
        router.push('/auth/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Redirecting...</div>
      </div>
    )
  }

  return (
    <DashboardLayout>
      <DashboardClient
        user={user}
        profile={profile}
        newsletters={newsletters}
        subscriberCount={subscriberCount}
      />
    </DashboardLayout>
  )
}
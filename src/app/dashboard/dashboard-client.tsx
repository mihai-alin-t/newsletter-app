'use client'

import { useRouter } from 'next/navigation'
import { 
  PlusIcon, 
  UsersIcon, 
  DocumentTextIcon, 
  ChartBarIcon
} from '@heroicons/react/24/outline'

interface DashboardClientProps {
  user: any
  profile: any
  newsletters: any[]
  subscriberCount: number
}

export default function DashboardClient({ 
  user, 
  profile, 
  newsletters, 
  subscriberCount 
}: DashboardClientProps) {
  const router = useRouter()

  const stats = [
    {
      name: 'Total Subscribers',
      value: subscriberCount.toLocaleString(),
      icon: UsersIcon,
      color: 'text-blue-600'
    },
    {
      name: 'Newsletters Sent',
      value: newsletters.filter(n => n.is_published).length.toString(),
      icon: DocumentTextIcon,
      color: 'text-green-600'
    },
    {
      name: 'Draft Newsletters',
      value: newsletters.filter(n => !n.is_published).length.toString(),
      icon: DocumentTextIcon,
      color: 'text-yellow-600'
    },
    {
      name: 'Open Rate',
      value: '24.5%',
      icon: ChartBarIcon,
      color: 'text-purple-600'
    }
  ]

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back, {profile.name || user.email}</p>
            </div>
            <div className="flex items-center space-x-4">
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
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.name}
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stat.value}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Recent Newsletters
              </h3>
              <button
                onClick={() => router.push('/dashboard/newsletters')}
                className="text-blue-600 hover:text-blue-500 text-sm font-medium"
              >
                View all
              </button>
            </div>
            
            {newsletters.length === 0 ? (
              <div className="text-center py-8">
                <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No newsletters yet</p>
                <button
                  onClick={() => router.push('/dashboard/newsletters/new')}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create your first newsletter
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {newsletters.slice(0, 5).map((newsletter) => (
                  <div
                    key={newsletter.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => router.push(`/dashboard/newsletters/${newsletter.id}`)}
                  >
                    <div>
                      <h4 className="font-medium text-gray-900">{newsletter.title}</h4>
                      <p className="text-sm text-gray-500">
                        {newsletter.is_published ? 'Published' : 'Draft'} • 
                        {new Date(newsletter.created_at).toLocaleDateString()}
                      </p>
                    </div>
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
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
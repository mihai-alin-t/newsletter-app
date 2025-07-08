'use client'

import { useState } from 'react'
import { ArrowRightIcon, CheckIcon } from '@heroicons/react/24/outline'
import { TrendingUp, UsersIcon, DollarSignIcon } from 'lucide-react'

export default function Home() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to subscribe')
      }

      setMessage(data.message)
      setEmail('')
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="py-8">
          <nav className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">AI Business Newsletter</span>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/auth/login" className="text-gray-600 hover:text-gray-900 transition-colors">
                Sign In
              </a>
              <a href="/auth/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Get Started
              </a>
            </div>
          </nav>
        </header>

        <section className="py-20 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Stay Ahead with AI Insights for 
            <span className="text-blue-600"> Business Professionals</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Get curated AI and tech insights delivered to your inbox. Join thousands of business leaders 
            who rely on our newsletter for strategic decision-making.
          </p>
          <form onSubmit={handleSubscribe} className="flex justify-center items-center space-x-4 mb-12">
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="px-6 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80 text-gray-900 bg-white"
            />
            <button 
              type="submit" 
              disabled={loading}
              className="bg-blue-600 text-white px-8 py-3 text-lg rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              <span>{loading ? 'Subscribing...' : 'Subscribe'}</span>
              <ArrowRightIcon className="h-5 w-5" />
            </button>
          </form>
          
          {message && (
            <div className="text-green-600 text-center mb-4">{message}</div>
          )}
          {error && (
            <div className="text-red-600 text-center mb-4">{error}</div>
          )}
          
          <p className="text-gray-500">Free weekly newsletter • 15,000+ subscribers • No spam</p>
        </section>

        <section className="py-16">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <div className="bg-blue-100 rounded-lg p-3 w-fit mb-4">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Latest AI Trends</h3>
              <p className="text-gray-600">
                Stay updated with the latest AI developments, tools, and technologies that matter to your business.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <div className="bg-green-100 rounded-lg p-3 w-fit mb-4">
                <UsersIcon className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Expert Insights</h3>
              <p className="text-gray-600">
                Get actionable insights from industry experts and thought leaders in AI and business strategy.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <div className="bg-purple-100 rounded-lg p-3 w-fit mb-4">
                <DollarSignIcon className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Business Impact</h3>
              <p className="text-gray-600">
                Learn how to leverage AI for competitive advantage and business growth in your industry.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50 rounded-2xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
            <p className="text-xl text-gray-600">Get the insights you need to stay competitive</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
              <p className="text-gray-600 mb-6">Perfect for getting started</p>
              <div className="text-3xl font-bold text-gray-900 mb-6">$0<span className="text-lg font-normal text-gray-500">/month</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center space-x-3">
                  <CheckIcon className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">Weekly newsletter</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckIcon className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">Basic AI insights</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckIcon className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">Community access</span>
                </li>
              </ul>
              <button 
                onClick={() => window.open('/api/subscribe', '_blank')}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Start Free
              </button>
            </div>
            
            <div className="bg-blue-600 text-white rounded-xl p-8 shadow-sm relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <p className="text-blue-100 mb-6">For serious business professionals</p>
              <div className="text-3xl font-bold mb-6">$49<span className="text-lg font-normal text-blue-200">/month</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center space-x-3">
                  <CheckIcon className="h-5 w-5 text-blue-200" />
                  <span>Everything in Free</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckIcon className="h-5 w-5 text-blue-200" />
                  <span>Daily AI briefings</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckIcon className="h-5 w-5 text-blue-200" />
                  <span>Industry-specific insights</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckIcon className="h-5 w-5 text-blue-200" />
                  <span>Expert interviews</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckIcon className="h-5 w-5 text-blue-200" />
                  <span>Ad-free experience</span>
                </li>
              </ul>
              <button 
                onClick={() => window.location.href = '/checkout?email=demo@example.com&tier=pro'}
                className="w-full bg-white text-blue-600 py-3 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
              >
                Start Pro Trial
              </button>
            </div>
          </div>
        </section>

        <footer className="py-12 text-center text-gray-500">
          <p>&copy; 2025 AI Business Newsletter. All rights reserved.</p>
        </footer>
      </div>
    </main>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckIcon, CreditCardIcon } from '@heroicons/react/24/outline'

export default function CheckoutPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  const tier = searchParams.get('tier')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleUpgrade = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      setSuccess(true)
    } catch (error) {
      console.error('Payment error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <CheckIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600 mb-6">
            Welcome to Pro! Your subscription has been activated.
          </p>
          <a
            href="/dashboard"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Upgrade to Pro
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Get premium AI insights and exclusive content
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Pro Subscription</h3>
            <div className="text-3xl font-bold text-gray-900 mb-4">
              $49<span className="text-lg font-normal text-gray-500">/month</span>
            </div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center">
                <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
                Daily AI briefings
              </li>
              <li className="flex items-center">
                <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
                Industry-specific insights
              </li>
              <li className="flex items-center">
                <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
                Expert interviews
              </li>
              <li className="flex items-center">
                <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
                Ad-free experience
              </li>
            </ul>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email || ''}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method
            </label>
            <div className="border border-gray-300 rounded-md p-3 bg-gray-50">
              <div className="flex items-center text-gray-500">
                <CreditCardIcon className="h-5 w-5 mr-2" />
                <span>Demo Mode - No actual payment required</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? (
              <span>Processing...</span>
            ) : (
              <span>Upgrade to Pro - $49/month</span>
            )}
          </button>

          <p className="mt-4 text-xs text-gray-500 text-center">
            This is a demo. No actual payment will be processed.
          </p>
        </div>
      </div>
    </div>
  )
}
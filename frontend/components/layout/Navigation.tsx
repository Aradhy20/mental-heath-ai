'use client'

import React from 'react'
import Link from 'next/link'
import { useUserStore } from '@/lib/store'

const Navigation = () => {
  const { user, logout } = useUserStore()

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-primary">
                MentalHealth<span className="text-secondary">App</span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/" className="border-b-2 border-primary text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium">
                Dashboard
              </Link>
              <Link href="/dashboard" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 text-sm font-medium">
                Enhanced Dashboard
              </Link>
              <Link href="/chat" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 text-sm font-medium relative">
                AI Chat
                <span className="ml-1 px-1.5 py-0.5 text-xs bg-blue-100 text-blue-800 rounded">New</span>
              </Link>
              <Link href="/wellness" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 text-sm font-medium relative">
                Wellness
                <span className="ml-1 px-1.5 py-0.5 text-xs bg-green-100 text-green-800 rounded">New</span>
              </Link>
              <Link href="/analysis" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 text-sm font-medium">
                Analysis
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <div className="flex items-center">
                <span className="text-sm text-gray-700 mr-4">Hi, {user.name || user.username}</span>
                <button
                  onClick={logout}
                  className="text-sm text-gray-700 hover:text-gray-900"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link href="/login" className="text-sm text-gray-700 hover:text-gray-900">
                  Login
                </Link>
                <Link href="/register" className="text-sm text-gray-700 hover:text-gray-900">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
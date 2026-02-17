'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface Tab {
  id: string
  label: string
  content: React.ReactNode
}

interface AnimatedTabsProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (tabId: string) => void
  className?: string
}

const AnimatedTabs: React.FC<AnimatedTabsProps> = ({ 
  tabs, 
  activeTab, 
  onTabChange,
  className = ''
}: AnimatedTabsProps) => {
  return (
    <div className={className}>
      {/* Tab Headers */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab: Tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  layoutId="tabIndicator"
                />
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="py-6">
        {tabs.map((tab: Tab) => (
          <motion.div
            key={tab.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: activeTab === tab.id ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className={activeTab === tab.id ? 'block' : 'hidden'}
          >
            {tab.content}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default AnimatedTabs
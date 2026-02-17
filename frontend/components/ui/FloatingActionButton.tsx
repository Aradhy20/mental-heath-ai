'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface FloatingActionButtonProps {
  actions: {
    id: string
    label: string
    icon: React.ReactNode
    onClick: () => void
  }[]
  mainIcon: React.ReactNode
  mainLabel?: string
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  actions,
  mainIcon,
  mainLabel = 'Actions'
}) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-16 right-0 space-y-3"
          >
            {actions.map((action, index) => (
              <motion.button
                key={action.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  action.onClick()
                  setIsOpen(false)
                }}
                className="flex items-center w-48 px-4 py-3 bg-white rounded-2xl shadow-lg glass-card hover:shadow-xl transition-all duration-200"
              >
                <span className="text-purple-600 mr-3">{action.icon}</span>
                <span className="text-sm font-medium text-gray-700">{action.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-all duration-200"
        aria-label={mainLabel}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.svg
              key="close"
              initial={{ rotate: 0 }}
              animate={{ rotate: 90 }}
              exit={{ rotate: 0 }}
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </motion.svg>
          ) : (
            <motion.span
              key="main"
              initial={{ rotate: -90 }}
              animate={{ rotate: 0 }}
              exit={{ rotate: -90 }}
            >
              {mainIcon}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  )
}

export default FloatingActionButton
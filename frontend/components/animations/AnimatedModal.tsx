'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface AnimatedModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  className?: string
}

const AnimatedModal: React.FC<AnimatedModalProps> = ({ 
  isOpen, 
  onClose, 
  children, 
  title,
  className = ''
}: AnimatedModalProps) => {
  // Close modal on escape key press
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${className}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 25 }}
          >
            <div 
              className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
            >
              {title && (
                <div className="border-b border-gray-200 px-6 py-4">
                  <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                </div>
              )}
              <div className="p-6">
                {children}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default AnimatedModal
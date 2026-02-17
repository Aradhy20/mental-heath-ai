'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface AnimatedToggleProps {
  isChecked: boolean
  onChange: (checked: boolean) => void
  label?: string
  className?: string
}

const AnimatedToggle: React.FC<AnimatedToggleProps> = ({ 
  isChecked, 
  onChange, 
  label,
  className = ''
}: AnimatedToggleProps) => {
  return (
    <div className={`flex items-center ${className}`}>
      <motion.button
        type="button"
        role="switch"
        aria-checked={isChecked}
        onClick={() => onChange(!isChecked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
          isChecked ? 'bg-primary' : 'bg-gray-300'
        }`}
        whileTap={{ scale: 0.95 }}
        animate={{ backgroundColor: isChecked ? '#6366f1' : '#d1d5db' }}
      >
        <motion.span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            isChecked ? 'translate-x-6' : 'translate-x-1'
          }`}
          layout
          transition={{ type: 'spring', stiffness: 700, damping: 30 }}
        />
      </motion.button>
      {label && (
        <span 
          className="ml-3 text-sm font-medium text-gray-700"
          onClick={() => onChange(!isChecked)}
        >
          {label}
        </span>
      )}
    </div>
  )
}

export default AnimatedToggle
'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface AnimatedSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: string
  className?: string
}

const AnimatedSpinner: React.FC<AnimatedSpinnerProps> = ({ 
  size = 'md',
  color = 'text-primary',
  className = ''
}: AnimatedSpinnerProps) => {
  // Define size styles
  const sizeClasses: Record<string, string> = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  return (
    <motion.div 
      className={`${sizeClasses[size]} ${color} ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.svg
        className="animate-spin"
        viewBox="0 0 24 24"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ 
          duration: 1, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </motion.svg>
    </motion.div>
  )
}

export default AnimatedSpinner
'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface AnimatedButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  className?: string
  type?: 'button' | 'submit' | 'reset'
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({ 
  children, 
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  type = 'button'
}: AnimatedButtonProps) => {
  // Define variant styles
  const variantStyles: Record<string, string> = {
    primary: 'bg-primary hover:bg-indigo-600 text-white',
    secondary: 'bg-secondary hover:bg-violet-600 text-white',
    outline: 'bg-white border border-primary text-primary hover:bg-primary hover:text-white'
  }

  // Define size styles
  const sizeStyles: Record<string, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variantStyles[variant]} 
        ${sizeStyles[size]} 
        rounded-md font-medium transition-colors
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.button>
  )
}

export default AnimatedButton
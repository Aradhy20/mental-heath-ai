'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface AnimatedProgressBarProps {
  value: number
  max: number
  label: string
  color?: string
  className?: string
}

const AnimatedProgressBar: React.FC<AnimatedProgressBarProps> = ({ 
  value, 
  max, 
  label, 
  color = 'bg-primary',
  className = ''
}) => {
  const percentage = (value / max) * 100

  return (
    <motion.div 
      className={className}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-medium text-gray-700">{Math.round(percentage)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <motion.div 
          className={`h-2.5 rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  )
}

export default AnimatedProgressBar
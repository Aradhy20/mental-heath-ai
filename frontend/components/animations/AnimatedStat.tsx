'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface AnimatedStatProps {
  value: number
  label: string
  prefix?: string
  suffix?: string
  duration?: number
  className?: string
}

const AnimatedStat: React.FC<AnimatedStatProps> = ({ 
  value, 
  label, 
  prefix = '', 
  suffix = '', 
  duration = 2,
  className = ''
}) => {
  const [displayValue, setDisplayValue] = React.useState(0)

  React.useEffect(() => {
    let start = 0
    const increment = value / (duration * 60)
    
    const timer = setInterval(() => {
      start += increment
      if (start >= value) {
        setDisplayValue(value)
        clearInterval(timer)
      } else {
        setDisplayValue(Math.floor(start))
      }
    }, 1000 / 60) // ~60fps

    return () => clearInterval(timer)
  }, [value, duration])

  return (
    <motion.div 
      className={className}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      whileHover={{ scale: 1.05 }}
    >
      <div className="text-3xl font-bold text-primary">
        {prefix}{displayValue}{suffix}
      </div>
      <div className="text-sm text-gray-600 mt-1">
        {label}
      </div>
    </motion.div>
  )
}

export default AnimatedStat
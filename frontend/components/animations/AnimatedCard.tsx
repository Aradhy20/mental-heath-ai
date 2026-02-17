'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface AnimatedCardProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({ 
  children, 
  className = '',
  delay = 0 
}: AnimatedCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default AnimatedCard
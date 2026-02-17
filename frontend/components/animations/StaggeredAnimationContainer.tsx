'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface StaggeredAnimationContainerProps {
  children: React.ReactNode
  className?: string
  staggerDelay?: number
}

const StaggeredAnimationContainer: React.FC<StaggeredAnimationContainerProps> = ({ 
  children,
  className = '',
  staggerDelay = 0.1
}: StaggeredAnimationContainerProps) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 1 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default StaggeredAnimationContainer
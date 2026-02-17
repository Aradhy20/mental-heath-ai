'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface FloatingCardProps {
    children: React.ReactNode
    className?: string
    delay?: number
    hoverScale?: number
    hoverY?: number
}

const FloatingCard = ({
    children,
    className,
    delay = 0,
    hoverScale = 1.02,
    hoverY = -8,
}: FloatingCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay, ease: 'easeOut' }}
            whileHover={{
                y: hoverY,
                scale: hoverScale,
                boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.15)',
            }}
            className={cn(
                'glass-panel rounded-3xl p-6 transition-colors shimmer-hover backdrop-blur-xl',
                className
            )}
        >
            {children}
        </motion.div>
    )
}

export default FloatingCard

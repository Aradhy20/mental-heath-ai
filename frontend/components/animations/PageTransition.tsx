/**
 * Page Transition Wrapper
 * Smooth transitions between routes
 */

'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { pageVariants } from '@/lib/animations/config'

interface PageTransitionProps {
    children: React.ReactNode
    className?: string
}

export default function PageTransition({ children, className = "" }: PageTransitionProps) {
    const pathname = usePathname()

    // Custom transitions based on route
    const getTransitionVariant = (path: string) => {
        if (path.includes('/meditation')) {
            return {
                ...pageVariants,
                animate: {
                    ...pageVariants.animate,
                    transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] } // Zen transition
                }
            }
        }

        if (path.includes('/chat')) {
            return {
                initial: { opacity: 0, x: -20 },
                animate: { opacity: 1, x: 0, transition: { duration: 0.4 } },
                exit: { opacity: 0, x: 20, transition: { duration: 0.3 } }
            }
        }

        return pageVariants
    }

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={pathname}
                variants={getTransitionVariant(pathname)}
                initial="initial"
                animate="animate"
                exit="exit"
                className={className}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    )
}

// Export individual transition components

export function FadeTransition({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            {children}
        </motion.div>
    )
}

export function SlideTransition({
    children,
    direction = 'right'
}: {
    children: React.ReactNode
    direction?: 'left' | 'right' | 'up' | 'down'
}) {
    const variants = {
        right: { initial: { x: -20 }, animate: { x: 0 }, exit: { x: 20 } },
        left: { initial: { x: 20 }, animate: { x: 0 }, exit: { x: -20 } },
        up: { initial: { y: 20 }, animate: { y: 0 }, exit: { y: -20 } },
        down: { initial: { y: -20 }, animate: { y: 0 }, exit: { y: 20 } },
    }

    return (
        <motion.div
            initial={{ ...variants[direction].initial, opacity: 0 }}
            animate={{ ...variants[direction].animate, opacity: 1 }}
            exit={{ ...variants[direction].exit, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        >
            {children}
        </motion.div>
    )
}

export function ScaleTransition({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
        >
            {children}
        </motion.div>
    )
}

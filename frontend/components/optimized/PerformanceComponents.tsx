'use client'

import React, { Suspense, lazy } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { fadeIn, scaleIn } from '@/lib/animations/presets'

// Lazy load heavy components for better performance
const MoodWheel = lazy(() => import('@/components/anti-gravity/MoodWheel'))
const BreathingExercise = lazy(() => import('@/components/anti-gravity/BreathingExercise'))
const DynamicWellnessCard = lazy(() => import('@/components/animations/DynamicWellnessCard'))

// Loading skeleton component
const LoadingSkeleton = () => (
    <div className="animate-pulse">
        <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-3xl"></div>
    </div>
)

interface LazyComponentProps {
    children: React.ReactNode
    fallback?: React.ReactNode
}

export const LazyComponent: React.FC<LazyComponentProps> = ({
    children,
    fallback = <LoadingSkeleton />
}) => {
    return (
        <Suspense fallback={fallback}>
            {children}
        </Suspense>
    )
}

// Optimized card wrapper with reduced animations
export const FastCard: React.FC<{
    children: React.ReactNode
    className?: string
    delay?: number
}> = ({ children, className = '', delay = 0 }) => {
    return (
        <motion.div
            {...fadeIn}
            transition={{ ...fadeIn.transition, delay }}
            className={`glass-panel rounded-3xl p-6 ${className}`}
        >
            {children}
        </motion.div>
    )
}

// Optimized tab switcher
export const FastTabs: React.FC<{
    tabs: string[]
    activeTab: string
    onChange: (tab: string) => void
}> = ({ tabs, activeTab, onChange }) => {
    return (
        <div className="flex gap-2 p-1 bg-white/50 dark:bg-black/20 rounded-2xl backdrop-blur-sm">
            {tabs.map((tab) => (
                <button
                    key={tab}
                    onClick={() => onChange(tab)}
                    className={`flex-1 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${activeTab === tab
                            ? 'bg-white dark:bg-white/10 shadow-sm'
                            : 'hover:bg-white/50 dark:hover:bg-white/5'
                        }`}
                >
                    {tab}
                </button>
            ))}
        </div>
    )
}

export { MoodWheel, BreathingExercise, DynamicWellnessCard }

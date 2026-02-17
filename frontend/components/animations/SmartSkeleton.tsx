/**
 * Smart Skeleton Loader
 * Premium loading states with shimmer effect
 */

'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface SmartSkeletonProps {
    variant?: 'text' | 'circular' | 'rectangular' | 'card'
    width?: string | number
    height?: string | number
    className?: string
    count?: number
    animate?: boolean
}

export default function SmartSkeleton({
    variant = 'rectangular',
    width,
    height,
    className = "",
    count = 1,
    animate = true
}: SmartSkeletonProps) {
    const baseClass = "bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800"

    const getVariantClass = () => {
        switch (variant) {
            case 'text':
                return 'rounded h-4'
            case 'circular':
                return 'rounded-full'
            case 'card':
                return 'rounded-2xl'
            default:
                return 'rounded-lg'
        }
    }

    const getVariantStyle = () => {
        const style: React.CSSProperties = {}

        if (width) style.width = typeof width === 'number' ? `${width}px` : width
        if (height) style.height = typeof height === 'number' ? `${height}px` : height

        // Default sizes
        if (!width && variant === 'text') style.width = '100%'
        if (!height && variant === 'text') style.height = '16px'
        if (!width && variant === 'circular') style.width = '48px'
        if (!height && variant === 'circular') style.height = '48px'

        return style
    }

    const Skeleton = () => (
        <motion.div
            className={`${baseClass} ${getVariantClass()} ${className} relative overflow-hidden`}
            style={getVariantStyle()}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            {animate && (
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{
                        x: ['-100%', '100%']
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
            )}
        </motion.div>
    )

    if (count > 1) {
        return (
            <div className="space-y-3">
                {Array.from({ length: count }).map((_, i) => (
                    <Skeleton key={i} />
                ))}
            </div>
        )
    }

    return <Skeleton />
}

// Preset Skeleton Components

export function SkeletonCard({ className = "" }: { className?: string }) {
    return (
        <div className={`p-6 space-y-4 ${className}`}>
            <div className="flex items-center gap-4">
                <SmartSkeleton variant="circular" width={48} height={48} />
                <div className="flex-1 space-y-2">
                    <SmartSkeleton variant="text" width="60%" />
                    <SmartSkeleton variant="text" width="40%" />
                </div>
            </div>
            <SmartSkeleton variant="rectangular" height={120} />
            <SmartSkeleton variant="text" count={3} />
        </div>
    )
}

export function SkeletonDashboard() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="space-y-3">
                <SmartSkeleton variant="text" width="40%" height={40} />
                <SmartSkeleton variant="text" width="25%" height={20} />
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
            </div>
        </div>
    )
}

export function SkeletonChat() {
    return (
        <div className="space-y-4">
            {/* Messages */}
            {[1, 2, 3].map((i) => (
                <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                    <div className="flex gap-3 max-w-md">
                        {i % 2 !== 0 && <SmartSkeleton variant="circular" width={40} height={40} />}
                        <div className="space-y-2 flex-1">
                            <SmartSkeleton variant="rectangular" height={60} />
                            <SmartSkeleton variant="text" width="30%" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export function SkeletonList({ count = 5 }: { count?: number }) {
    return (
        <div className="space-y-4">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                    <SmartSkeleton variant="circular" width={56} height={56} />
                    <div className="flex-1 space-y-2">
                        <SmartSkeleton variant="text" width="70%" />
                        <SmartSkeleton variant="text" width="40%" />
                        <SmartSkeleton variant="text" width="50%" />
                    </div>
                </div>
            ))}
        </div>
    )
}

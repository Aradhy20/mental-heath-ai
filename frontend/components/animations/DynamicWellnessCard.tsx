/**
 * Dynamic Wellness Card with Animated Progress
 * Shows wellness score with smooth counter and progress ring
 */

'use client'

import React, { useEffect, useState } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { Activity, TrendingUp, TrendingDown } from 'lucide-react'
import { animationPresets } from '@/lib/animations/config'

interface DynamicWellnessCardProps {
    score: number // 0-100
    previousScore?: number
    label?: string
    subtitle?: string
    className?: string
}

export default function DynamicWellnessCard({
    score,
    previousScore = 0,
    label = "Wellness Score",
    subtitle = "Keep up the great work!",
    className = ""
}: DynamicWellnessCardProps) {
    const [displayScore, setDisplayScore] = useState(0)
    const motionScore = useMotionValue(0)

    // Calculate score change
    const scoreChange = score - previousScore
    const isImproving = scoreChange > 0

    // Determine color based on score
    const getScoreColor = (value: number) => {
        if (value >= 80) return 'from-green-500 to-emerald-600'
        if (value >= 60) return 'from-blue-500 to-cyan-600'
        if (value >= 40) return 'from-yellow-500 to-orange-600'
        return 'from-orange-500 to-red-600'
    }

    // Animate score counter
    useEffect(() => {
        const controls = animate(motionScore, score, {
            duration: 1.5,
            ease: "easeOut",
            onUpdate: (latest) => setDisplayScore(Math.round(latest))
        })

        return controls.stop
    }, [score, motionScore])

    // SVG circle progress
    const radius = 70
    const circumference = 2 * Math.PI * radius
    const progress = useTransform(motionScore, [0, 100], [0, circumference])

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={animationPresets.spring.smooth}
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${getScoreColor(score)} p-6 text-white shadow-lg ${className}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
            </div>

            <div className="relative z-10">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                        <Activity size={24} />
                    </div>

                    {previousScore > 0 && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-1 text-xs font-medium bg-white/20 px-3 py-1.5 rounded-lg backdrop-blur-sm"
                        >
                            {isImproving ? (
                                <>
                                    <TrendingUp size={14} />
                                    <span>+{scoreChange}</span>
                                </>
                            ) : (
                                <>
                                    <TrendingDown size={14} />
                                    <span>{scoreChange}</span>
                                </>
                            )}
                        </motion.div>
                    )}
                </div>

                {/* Score Display with SVG Progress Ring */}
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="text-lg font-semibold mb-2 opacity-90">{label}</h4>

                        <div className="flex items-end gap-2">
                            <motion.div
                                className="text-5xl font-display font-bold"
                                key={displayScore}
                            >
                                {displayScore}
                            </motion.div>
                            <span className="text-2xl opacity-80 mb-1">/100</span>
                        </div>

                        <p className="text-sm opacity-90 mt-3">{subtitle}</p>
                    </div>

                    {/* Progress Ring */}
                    <div className="relative">
                        <svg width="160" height="160" className="transform -rotate-90">
                            {/* Background Circle */}
                            <circle
                                cx="80"
                                cy="80"
                                r={radius}
                                fill="none"
                                stroke="rgba(255, 255, 255, 0.2)"
                                strokeWidth="12"
                            />

                            {/* Progress Circle */}
                            <motion.circle
                                cx="80"
                                cy="80"
                                r={radius}
                                fill="none"
                                stroke="white"
                                strokeWidth="12"
                                strokeLinecap="round"
                                strokeDasharray={circumference}
                                strokeDashoffset={useTransform(progress, (v) => circumference - v)}
                                initial={{ strokeDashoffset: circumference }}
                            />
                        </svg>

                        {/* Center Score */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <motion.div
                                className="text-2xl font-bold"
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                            >
                                {displayScore}%
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Animated glow effect */}
            <motion.div
                className="absolute bottom-0 left-0 right-0 h-1 bg-white"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: score / 100 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                style={{ transformOrigin: "left" }}
            />
        </motion.div>
    )
}

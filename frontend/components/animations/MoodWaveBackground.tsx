/**
 * Mood Wave Background
 * Animated SVG waves that respond to user's mood
 */

'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { emotionColors } from '@/lib/animations/config'

type MoodType = 'joy' | 'calm' | 'sadness' | 'anxiety' | 'neutral'

interface MoodWaveBackgroundProps {
    mood?: MoodType
    intensity?: number // 0-1
    className?: string
}

export default function MoodWaveBackground({
    mood = 'calm',
    intensity = 0.5,
    className = ""
}: MoodWaveBackgroundProps) {
    const [waveOffset, setWaveOffset] = useState(0)
    const colors = emotionColors[mood]

    useEffect(() => {
        const interval = setInterval(() => {
            setWaveOffset(prev => (prev + 1) % 1000)
        }, 50)
        return () => clearInterval(interval)
    }, [])

    // Wave speed based on mood
    const getWaveSpeed = () => {
        switch (mood) {
            case 'joy': return 2
            case 'calm': return 0.5
            case 'anxiety': return 4
            case 'sadness': return 0.8
            default: return 1
        }
    }

    // Wave amplitude based on intensity
    const amplitude = 20 + (intensity * 40)
    const speed = getWaveSpeed()

    return (
        <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                transition={{ duration: 1 }}
                className="absolute inset-0"
            >
                <svg
                    className="absolute bottom-0 w-full h-full"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1440 320"
                    preserveAspectRatio="none"
                >
                    <defs>
                        <linearGradient id={`gradient-${mood}`} x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor={colors.from} stopOpacity="0.4" />
                            <stop offset="50%" stopColor={colors.to} stopOpacity="0.6" />
                            <stop offset="100%" stopColor={colors.from} stopOpacity="0.4" />
                        </linearGradient>
                    </defs>

                    {/* Wave 1 */}
                    <motion.path
                        animate={{
                            d: [
                                `M0,${160 + Math.sin(waveOffset * speed * 0.01) * amplitude}L48,${176 + Math.sin((waveOffset + 100) * speed * 0.01) * amplitude}C96,${192 + Math.sin((waveOffset + 200) * speed * 0.01) * amplitude},192,${224 + Math.sin((waveOffset + 300) * speed * 0.01) * amplitude},288,${224 + Math.sin((waveOffset + 400) * speed * 0.01) * amplitude}C384,${224 + Math.sin((waveOffset + 500) * speed * 0.01) * amplitude},480,${192 + Math.sin((waveOffset + 600) * speed * 0.01) * amplitude},576,${192 + Math.sin((waveOffset + 700) * speed * 0.01) * amplitude}C672,${192 + Math.sin((waveOffset + 800) * speed * 0.01) * amplitude},768,${224 + Math.sin((waveOffset + 900) * speed * 0.01) * amplitude},864,${224 + Math.sin((waveOffset + 1000) * speed * 0.01) * amplitude}C960,${224 + Math.sin((waveOffset + 1100) * speed * 0.01) * amplitude},1056,${192 + Math.sin((waveOffset + 1200) * speed * 0.01) * amplitude},1152,${192 + Math.sin((waveOffset + 1300) * speed * 0.01) * amplitude}C1248,${192 + Math.sin((waveOffset + 1400) * speed * 0.01) * amplitude},1344,${224 + Math.sin((waveOffset + 1500) * speed * 0.01) * amplitude},1392,${224 + Math.sin((waveOffset + 1600) * speed * 0.01) * amplitude}L1440,${240 + Math.sin((waveOffset + 1700) * speed * 0.01) * amplitude}L1440,320L0,320Z`
                            ]
                        }}
                        transition={{
                            duration: 0.05,
                            ease: "linear"
                        }}
                        fill={`url(#gradient-${mood})`}
                    />

                    {/* Wave 2 (slower) */}
                    <motion.path
                        animate={{
                            d: [
                                `M0,${192 + Math.sin(waveOffset * speed * 0.007) * (amplitude * 0.7)}L48,${208 + Math.sin((waveOffset + 150) * speed * 0.007) * (amplitude * 0.7)}C96,${224 + Math.sin((waveOffset + 250) * speed * 0.007) * (amplitude * 0.7)},192,${256 + Math.sin((waveOffset + 350) * speed * 0.007) * (amplitude * 0.7)},288,${256 + Math.sin((waveOffset + 450) * speed * 0.007) * (amplitude * 0.7)}C384,${256 + Math.sin((waveOffset + 550) * speed * 0.007) * (amplitude * 0.7)},480,${224 + Math.sin((waveOffset + 650) * speed * 0.007) * (amplitude * 0.7)},576,${224 + Math.sin((waveOffset + 750) * speed * 0.007) * (amplitude * 0.7)}C672,${224 + Math.sin((waveOffset + 850) * speed * 0.007) * (amplitude * 0.7)},768,${256 + Math.sin((waveOffset + 950) * speed * 0.007) * (amplitude * 0.7)},864,${256 + Math.sin((waveOffset + 1050) * speed * 0.007) * (amplitude * 0.7)}C960,${256 + Math.sin((waveOffset + 1150) * speed * 0.007) * (amplitude * 0.7)},1056,${224 + Math.sin((waveOffset + 1250) * speed * 0.007) * (amplitude * 0.7)},1152,${224 + Math.sin((waveOffset + 1350) * speed * 0.007) * (amplitude * 0.7)}C1248,${224 + Math.sin((waveOffset + 1450) * speed * 0.007) * (amplitude * 0.7)},1344,${256 + Math.sin((waveOffset + 1550) * speed * 0.007) * (amplitude * 0.7)},1392,${256 + Math.sin((waveOffset + 1650) * speed * 0.007) * (amplitude * 0.7)}L1440,${272 + Math.sin((waveOffset + 1750) * speed * 0.007) * (amplitude * 0.7)}L1440,320L0,320Z`
                            ]
                        }}
                        transition={{
                            duration: 0.05,
                            ease: "linear"
                        }}
                        fill={colors.to}
                        fillOpacity="0.2"
                    />
                </svg>
            </motion.div>

            {/* Gradient overlay */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5 }}
                className="absolute inset-0"
                style={{
                    background: `radial-gradient(circle at 50% 120%, ${colors.from}20 0%, transparent 50%)`
                }}
            />
        </div>
    )
}

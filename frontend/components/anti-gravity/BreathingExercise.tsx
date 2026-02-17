'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import LottieWrapper from './LottieWrapper'
// Placeholder Lottie JSON URL - In production, replace with local JSON
const breathingAnimationUrl = "https://lottie.host/embed/9864201a-8f1a-450d-8867-6e67d6c5c022/2K4K4K4K4K.json"

const BreathingExercise = () => {
    const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale')
    const [timeLeft, setTimeLeft] = useState(4)

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    if (phase === 'Inhale') {
                        setPhase('Hold')
                        return 4
                    } else if (phase === 'Hold') {
                        setPhase('Exhale')
                        return 4
                    } else {
                        setPhase('Inhale')
                        return 4
                    }
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [phase])

    return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="relative w-64 h-64 mb-8">
                <motion.div
                    animate={{
                        scale: phase === 'Inhale' ? 1.5 : phase === 'Exhale' ? 1 : 1.5,
                        opacity: phase === 'Hold' ? 0.8 : 1
                    }}
                    transition={{ duration: 4, ease: "easeInOut" }}
                    className="absolute inset-0 bg-serenity-300/30 dark:bg-aurora-500/20 rounded-full blur-3xl"
                />

                <div className="absolute inset-0 flex items-center justify-center">
                    {/* Placeholder for Lottie - Using a simple circle for now if Lottie fails */}
                    <motion.div
                        className="w-32 h-32 rounded-full bg-gradient-to-br from-serenity-400 to-serenity-600 dark:from-aurora-400 dark:to-aurora-600 shadow-glow flex items-center justify-center text-white text-4xl font-bold"
                        animate={{
                            scale: phase === 'Inhale' ? 1.2 : phase === 'Exhale' ? 0.8 : 1.2,
                        }}
                        transition={{ duration: 4, ease: "easeInOut" }}
                    >
                        {timeLeft}
                    </motion.div>
                </div>
            </div>

            <h3 className="text-2xl font-bold mb-2 transition-all duration-500">{phase}</h3>
            <p className="text-muted-foreground">Follow the rhythm to relax</p>
        </div>
    )
}

export default BreathingExercise

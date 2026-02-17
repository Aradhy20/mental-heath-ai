/**
 * Celebration Effect Component
 * Confetti and particle celebration for achievements
 */

'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ConfettiPiece {
    id: number
    x: number
    y: number
    rotation: number
    color: string
    size: number
    velocityX: number
    velocityY: number
}

interface CelebrationEffectProps {
    trigger: boolean
    onComplete?: () => void
    duration?: number
    particleCount?: number
}

const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE']

export default function CelebrationEffect({
    trigger,
    onComplete,
    duration = 3000,
    particleCount = 50
}: CelebrationEffectProps) {
    const [confetti, setConfetti] = useState<ConfettiPiece[]>([])
    const [isActive, setIsActive] = useState(false)

    useEffect(() => {
        if (trigger && !isActive) {
            setIsActive(true)

            // Generate confetti
            const newConfetti: ConfettiPiece[] = []
            for (let i = 0; i < particleCount; i++) {
                newConfetti.push({
                    id: i,
                    x: Math.random() * window.innerWidth,
                    y: -20,
                    rotation: Math.random() * 360,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    size: Math.random() * 10 + 5,
                    velocityX: (Math.random() - 0.5) * 10,
                    velocityY: Math.random() * 5 + 5
                })
            }
            setConfetti(newConfetti)

            // Clear after duration
            setTimeout(() => {
                setConfetti([])
                setIsActive(false)
                onComplete?.()
            }, duration)
        }
    }, [trigger, isActive, duration, particleCount, onComplete])

    return (
        <AnimatePresence>
            {isActive && (
                <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
                    {confetti.map((piece) => (
                        <motion.div
                            key={piece.id}
                            className="absolute"
                            initial={{
                                x: piece.x,
                                y: piece.y,
                                rotate: piece.rotation,
                                opacity: 1
                            }}
                            animate={{
                                y: window.innerHeight + 100,
                                x: piece.x + piece.velocityX * 50,
                                rotate: piece.rotation + 360,
                                opacity: 0
                            }}
                            transition={{
                                duration: duration / 1000,
                                ease: "easeIn"
                            }}
                            style={{
                                width: piece.size,
                                height: piece.size,
                                backgroundColor: piece.color,
                                borderRadius: Math.random() > 0.5 ? '50%' : '0'
                            }}
                        />
                    ))}
                </div>
            )}
        </AnimatePresence>
    )
}

// Achievement celebration variant
export function AchievementCelebration({
    show,
    title,
    onClose
}: {
    show: boolean
    title: string
    onClose: () => void
}) {
    return (
        <AnimatePresence>
            {show && (
                <>
                    <CelebrationEffect trigger={show} onComplete={onClose} />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: -50 }}
                        className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
                    >
                        <div className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white px-8 py-6 rounded-2xl shadow-2xl pointer-events-auto">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                className="text-6xl mb-4 text-center"
                            >
                                🎉
                            </motion.div>
                            <h2 className="text-2xl font-bold text-center mb-2">Achievement Unlocked!</h2>
                            <p className="text-center text-lg">{title}</p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

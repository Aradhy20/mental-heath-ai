'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Smile, Frown, Meh, CloudRain, Sun } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/lib/store/auth-store'

const moods = [
    { icon: Sun, label: 'Radiant', color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/30' },
    { icon: Smile, label: 'Happy', color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30' },
    { icon: Meh, label: 'Neutral', color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { icon: Frown, label: 'Sad', color: 'text-indigo-500', bg: 'bg-indigo-100 dark:bg-indigo-900/30' },
    { icon: CloudRain, label: 'Stormy', color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30' },
]

const MoodWheel = () => {
    const { user } = useAuthStore()
    const [selectedMood, setSelectedMood] = useState<number | null>(null)
    const [isSaving, setIsSaving] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)

    const handleMoodSelect = async (index: number) => {
        if (isSaving) return
        setSelectedMood(index)
        setIsSaving(true)
        setShowSuccess(false)

        try {
            const mood = moods[index]
            const score = 5 - (index / (moods.length - 1)) * 4
            const moodUrl = process.env.NEXT_PUBLIC_MOOD_JOURNAL_URL || 'http://localhost:5000/api/mood';
            const authStore = useAuthStore.getState();

            const response = await fetch(moodUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authStore.token}`
                },
                body: JSON.stringify({
                    mood_label: mood.label,
                    score: score,
                    notes: `Logged via MoodWheel at ${new Date().toLocaleTimeString()}`
                })
            })

            if (response.ok) {
                setShowSuccess(true)
                setTimeout(() => setShowSuccess(false), 3000)
            }
        } catch (error) {
            console.error('Failed to log mood:', error)
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="relative w-full max-w-md mx-auto aspect-square flex items-center justify-center">
            {/* Central Circle */}
            <motion.div
                className="absolute inset-0 rounded-full border-2 border-dashed border-serenity-200 dark:border-aurora-700"
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            />

            <div className="relative z-10 grid grid-cols-3 gap-4">
                {moods.map((mood, index) => {
                    const isSelected = selectedMood === index

                    return (
                        <motion.button
                            key={mood.label}
                            onClick={() => handleMoodSelect(index)}
                            disabled={isSaving}
                            className={cn(
                                "flex flex-col items-center justify-center w-24 h-24 rounded-full transition-all duration-300",
                                isSelected ? `${mood.bg} shadow-glow scale-110` : "bg-white/50 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10",
                                isSaving && "opacity-50 cursor-not-allowed"
                            )}
                            whileHover={{ scale: 1.05, y: -5 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <mood.icon
                                size={32}
                                className={cn(
                                    "mb-2 transition-colors",
                                    isSelected ? mood.color : "text-muted-foreground"
                                )}
                            />
                            <span className={cn(
                                "text-xs font-medium",
                                isSelected ? "text-foreground" : "text-muted-foreground"
                            )}>
                                {mood.label}
                            </span>
                        </motion.button>
                    )
                })}
            </div>

            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg pointer-events-none"
                    >
                        <p className="font-bold flex items-center gap-2">
                            <Sun size={18} /> Mood Logged!
                        </p>
                    </motion.div>
                )}

                {selectedMood !== null && !showSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="absolute -bottom-16 left-0 right-0 text-center"
                    >
                        <p className="text-lg font-medium text-serenity-700 dark:text-aurora-300">
                            You're feeling <span className="font-bold">{moods[selectedMood].label}</span> today
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default MoodWheel

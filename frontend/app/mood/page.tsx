'use client'

import React from 'react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import FloatingCard from '@/components/anti-gravity/FloatingCard'
import { TrendingUp, Calendar as LucideCalendar } from 'lucide-react'

// Dynamic imports for productivity
const AnimatedCalendar = dynamic(() => import('@/components/anti-gravity/AnimatedCalendar'), {
    ssr: false,
    loading: () => <div className="h-[300px] w-full bg-black/5 animate-pulse rounded-3xl" />
})
const MoodWheel = dynamic(() => import('@/components/anti-gravity/MoodWheel'), {
    ssr: false,
    loading: () => <div className="h-[200px] w-[200px] bg-black/5 animate-pulse rounded-full" />
})

export default function MoodPage() {
    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">Mood Tracker</h1>
                <p className="text-muted-foreground">Visualize your emotional journey.</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Calendar Section */}
                <div className="lg:col-span-8">
                    <FloatingCard className="h-full">
                        <div className="flex items-center gap-2 mb-6">
                            <LucideCalendar className="text-serenity-500 dark:text-aurora-400" />
                            <h2 className="text-xl font-semibold">Monthly Overview</h2>
                        </div>
                        <AnimatedCalendar />
                    </FloatingCard>
                </div>

                {/* Stats & Quick Log */}
                <div className="lg:col-span-4 space-y-6">
                    <FloatingCard delay={0.1} className="bg-gradient-to-br from-serenity-50 to-white dark:from-aurora-900/50 dark:to-black/50">
                        <h3 className="font-semibold mb-4">Log Today's Mood</h3>
                        <div className="scale-90 origin-top-left -ml-4">
                            <MoodWheel />
                        </div>
                    </FloatingCard>

                    <FloatingCard delay={0.2}>
                        <div className="flex items-center gap-2 mb-4">
                            <TrendingUp className="text-green-500" />
                            <h3 className="font-semibold">Weekly Trend</h3>
                        </div>
                        <div className="h-32 flex items-end gap-2 px-2">
                            {[40, 60, 45, 70, 85, 65, 80].map((h, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h}%` }}
                                    transition={{ delay: i * 0.1, duration: 0.3 }}
                                    className="flex-1 bg-serenity-400/50 dark:bg-aurora-500/50 rounded-t-lg hover:bg-serenity-500 dark:hover:bg-aurora-400 transition-colors"
                                />
                            ))}
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                            <span>Mon</span>
                            <span>Sun</span>
                        </div>
                    </FloatingCard>
                </div>
            </div>
        </div>
    )
}

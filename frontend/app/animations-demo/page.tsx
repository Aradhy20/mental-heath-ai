/**
 * Animation Components Demo Page
 * Showcase all animation components
 */

'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Loader2, Heart } from 'lucide-react'

// Import all animation components
import DynamicWellnessCard from '@/components/animations/DynamicWellnessCard'
import EmotionParticles from '@/components/animations/EmotionParticles'
import MoodWaveBackground from '@/components/animations/MoodWaveBackground'
import AnimatedButton, { PrimaryButton, SecondaryButton, OutlineButton, SuccessButton } from '@/components/animations/AnimatedButton'
import SmartSkeleton, { SkeletonCard, SkeletonDashboard, SkeletonChat } from '@/components/animations/SmartSkeleton'
import FloatingCard from '@/components/anti-gravity/FloatingCard'

type EmotionType = 'joy' | 'calm' | 'sadness' | 'anxiety' | 'neutral'

export default function AnimationsDemo() {
    const [emotion, setEmotion] = useState<EmotionType>('calm')
    const [score, setScore] = useState(75)
    const [loading, setLoading] = useState(false)
    const [showSkeleton, setShowSkeleton] = useState(false)

    return (
        <div className="relative min-h-screen p-6">
            {/* Background */}
            <MoodWaveBackground mood={emotion} intensity={0.5} />

            <div className="relative z-10 max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    <h1 className="text-5xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-serenity-600 to-purple-600 mb-4">
                        Premium Animation Components
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Showcase of all animation components in your mental health app
                    </p>
                </motion.div>

                {/* Emotion Particles Demo */}
                <FloatingCard>
                    <h2 className="text-2xl font-bold mb-4">Emotion Particles System</h2>
                    <p className="text-muted-foreground mb-4">
                        Dynamic particle system that responds to detected emotions
                    </p>

                    <div className="flex gap-2 mb-4">
                        {(['joy', 'calm', 'sadness', 'anxiety', 'neutral'] as EmotionType[]).map((e) => (
                            <AnimatedButton
                                key={e}
                                size="sm"
                                variant={emotion === e ? 'primary' : 'outline'}
                                onClick={() => setEmotion(e)}
                            >
                                {e}
                            </AnimatedButton>
                        ))}
                    </div>

                    <div className="relative h-64 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                        <EmotionParticles emotion={emotion} intensity={0.7} particleCount={40} />
                    </div>
                </FloatingCard>

                {/* Dynamic Wellness Card Demo */}
                <FloatingCard>
                    <h2 className="text-2xl font-bold mb-4">Dynamic Wellness Card</h2>
                    <p className="text-muted-foreground mb-4">
                        Animated progress ring and counter with score trending
                    </p>

                    <div className="flex gap-2 mb-4">
                        {[50, 65, 75, 85, 95].map((s) => (
                            <AnimatedButton
                                key={s}
                                size="sm"
                                variant={score === s ? 'primary' : 'outline'}
                                onClick={() => setScore(s)}
                            >
                                {s}
                            </AnimatedButton>
                        ))}
                    </div>

                    <DynamicWellnessCard
                        score={score}
                        previousScore={score - 7}
                        label="Wellness Score"
                        subtitle="Great progress this week!"
                    />
                </FloatingCard>

                {/* Animated Buttons Demo */}
                <FloatingCard>
                    <h2 className="text-2xl font-bold mb-4">Animated Buttons</h2>
                    <p className="text-muted-foreground mb-4">
                        Premium buttons with ripple effects, icons, and loading states
                    </p>

                    <div className="space-y-4">
                        <div className="flex flex-wrap gap-3">
                            <PrimaryButton>Primary Button</PrimaryButton>
                            <SecondaryButton>Secondary</SecondaryButton>
                            <OutlineButton>Outline</OutlineButton>
                            <SuccessButton>Success</SuccessButton>
                            <AnimatedButton variant="danger">Danger</AnimatedButton>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <PrimaryButton icon={<Sparkles size={16} />} iconPosition="left">
                                With Icon
                            </PrimaryButton>
                            <PrimaryButton
                                icon={<Heart size={16} />}
                                iconPosition="right"
                            >
                                Icon Right
                            </PrimaryButton>
                            <AnimatedButton
                                variant="primary"
                                loading={loading}
                                onClick={() => {
                                    setLoading(true)
                                    setTimeout(() => setLoading(false), 2000)
                                }}
                            >
                                {loading ? 'Loading...' : 'Click to Load'}
                            </AnimatedButton>
                        </div>

                        <div>
                            <PrimaryButton fullWidth>Full Width Button</PrimaryButton>
                        </div>
                    </div>
                </FloatingCard>

                {/* Smart Skeleton Demo */}
                <FloatingCard>
                    <h2 className="text-2xl font-bold mb-4">Smart Skeleton Loaders</h2>
                    <p className="text-muted-foreground mb-4">
                        Premium loading states with shimmer animations
                    </p>

                    <AnimatedButton
                        variant="primary"
                        onClick={() => {
                            setShowSkeleton(true)
                            setTimeout(() => setShowSkeleton(false), 3000)
                        }}
                        className="mb-4"
                    >
                        Show Skeleton Demo (3s)
                    </AnimatedButton>

                    {showSkeleton ? (
                        <div className="space-y-6">
                            <SkeletonCard />
                            <SmartSkeleton variant="rectangular" height={100} />
                            <div className="flex gap-4">
                                <SmartSkeleton variant="circular" width={60} height={60} />
                                <div className="flex-1">
                                    <SmartSkeleton variant="text" count={3} />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-serenity-50 to-purple-50 dark:from-serenity-950 dark:to-purple-950">
                            <div className="flex gap-4">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-serenity-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                    ✓
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">Content Loaded!</h3>
                                    <p className="text-muted-foreground">This is the actual content after loading completes.</p>
                                    <p className="text-sm text-muted-foreground mt-2">Click the button above to see skeleton animation again.</p>
                                </div>
                            </div>
                        </div>
                    )}
                </FloatingCard>

                {/* Background Waves Demo */}
                <FloatingCard>
                    <h2 className="text-2xl font-bold mb-4">Mood Wave Background</h2>
                    <p className="text-muted-foreground mb-4">
                        Animated waves that change based on detected emotion
                    </p>

                    <div className="relative h-96 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800">
                        <MoodWaveBackground mood={emotion} intensity={0.8} />
                        <div className="relative z-10 flex items-center justify-center h-full">
                            <div className="text-center">
                                <h3 className="text-3xl font-bold mb-2 capitalize">{emotion}</h3>
                                <p className="text-muted-foreground">Current mood visualization</p>
                            </div>
                        </div>
                    </div>
                </FloatingCard>

                {/* Footer */}
                <div className="text-center text-muted-foreground py-8">
                    <p>All components are optimized for 60fps performance</p>
                    <p className="text-sm mt-2">Built with Framer Motion & React</p>
                </div>
            </div>
        </div>
    )
}

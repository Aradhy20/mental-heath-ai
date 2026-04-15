'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
    Brain, PenTool, Sparkles, ArrowRight, Activity, Zap,
    Heart, Target, Users, Calendar, TrendingUp, Award,
    Clock, Star, CheckCircle, Play, ShieldAlert, Wind
} from 'lucide-react'
import FloatingCard from '@/components/anti-gravity/FloatingCard'
import { useAuthStore } from '@/lib/store/auth-store'
import { analysisAPI } from '@/lib/api'

const features = [
    {
        title: 'Daily Mood Tracker',
        description: 'Log your emotional state with AI-powered insights and pattern recognition.',
        icon: Activity,
        href: '/mood',
        color: 'bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-amber-600 border-amber-500/30',
        stats: 'Active logs: 128',
        benefits: ['Pattern recognition', 'AI insights', 'Trend analysis']
    },
    {
        title: 'Guided Journaling',
        description: 'Express your thoughts with AI-curated prompts and emotional analysis.',
        icon: PenTool,
        href: '/journal',
        color: 'bg-gradient-to-br from-blue-500/20 to-indigo-500/20 text-blue-600 border-blue-500/30',
        stats: 'Total entries: 45',
        benefits: ['AI prompts', 'Emotion analysis', 'Progress tracking']
    },
    {
        title: 'Mindfulness & Breathing',
        description: 'Access guided meditations, breathing exercises, and coping strategies.',
        icon: Zap,
        href: '/meditation',
        color: 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 text-green-600 border-green-500/30',
        stats: 'Minutes today: 15',
        benefits: ['Guided sessions', 'Progress tracking', 'Custom exercises']
    },
    {
        title: 'Personal Goals',
        description: 'Set and track personalized wellness goals with AI recommendations.',
        icon: Target,
        href: '/goals',
        color: 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-purple-600 border-purple-500/30',
        stats: 'Goals completed: 8',
        benefits: ['AI suggestions', 'Progress tracking', 'Milestone rewards']
    },
    {
        title: 'Community Support',
        description: 'Connect with others on similar wellness journeys (coming soon).',
        icon: Users,
        href: '/community',
        color: 'bg-gradient-to-br from-teal-500/20 to-cyan-500/20 text-teal-600 border-teal-500/30',
        stats: 'Members: 1,247',
        benefits: ['Peer support', 'Shared experiences', 'Group challenges']
    },
    {
        title: 'Anakskit (Anxiety Hub)',
        description: 'Crisis support and cognitive reframing tools for high-anxiety moments.',
        icon: ShieldAlert,
        href: '/anakskit',
        color: 'bg-gradient-to-br from-rose-500/20 to-orange-500/20 text-rose-600 border-rose-500/30',
        stats: 'Emergency ready',
        benefits: ['Thought reframing', 'Grounding 5-4-3-2-1', 'Crisis contact']
    },
    {
        title: 'Serenity Breathing',
        description: 'Interactive breathing guides to rapidly stabilize your physiological state.',
        icon: Wind,
        href: '/anakskit', // Also accessible here
        color: 'bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-600 border-emerald-500/30',
        stats: 'Instant calm',
        benefits: ['Box breathing', '4-7-8 pattern', 'Visual guidance']
    },
    {
        title: 'Professional Insights',
        description: 'Advanced analytics and professional-grade wellness assessments.',
        icon: Brain,
        href: '/insights',
        color: 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-600 border-indigo-500/30',
        stats: 'Reports generated: 23',
        benefits: ['Advanced analytics', 'Risk assessment', 'Progress reports']
    }
]

const quickActions = [
    { icon: Heart, label: 'Wellness Check', desc: 'Quick assessment', color: 'bg-red-500' },
    { icon: Clock, label: 'Daily Reminder', desc: 'Set check-in time', color: 'bg-blue-500' },
    { icon: Star, label: 'Achievements', desc: 'View progress', color: 'bg-yellow-500' },
    { icon: Calendar, label: 'Schedule', desc: 'Plan activities', color: 'bg-green-500' }
]

export default function WellnessPage() {
    const { user } = useAuthStore()
    const [wellnessScore, setWellnessScore] = useState(75)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        // Load current wellness score
        const loadWellnessScore = async () => {
            try {
                const response = await analysisAPI.getWellnessScore({
                    mood_score: 7,
                    anxiety_level: 30,
                    stress_level: 25,
                    sleep_quality: 75,
                    exercise_frequency: 60,
                    social_interaction: 70,
                    medication_adherence: 90,
                    therapy_attendance: 85,
                    meditation_practice: 40,
                    journaling_frequency: 50,
                    substance_use: 5,
                    self_harm_thoughts: 0
                })
                if (response.data?.result?.overall_score) {
                    setWellnessScore(response.data.result.overall_score)
                }
            } catch (error) {
                console.error('Failed to load wellness score:', error)
            }
        }
        loadWellnessScore()
    }, [])

    const runWellnessCheck = async () => {
        setIsLoading(true)
        try {
            const response = await analysisAPI.getWellnessScore({
                mood_score: Math.floor(Math.random() * 10) + 1,
                anxiety_level: Math.floor(Math.random() * 50),
                stress_level: Math.floor(Math.random() * 50),
                sleep_quality: Math.floor(Math.random() * 100),
                exercise_frequency: Math.floor(Math.random() * 100),
                social_interaction: Math.floor(Math.random() * 100),
                medication_adherence: 90,
                therapy_attendance: 85,
                meditation_practice: Math.floor(Math.random() * 100),
                journaling_frequency: Math.floor(Math.random() * 100),
                substance_use: Math.floor(Math.random() * 20),
                self_harm_thoughts: 0
            })

            if (response.data?.result) {
                const result = response.data.result
                setWellnessScore(result.overall_score)
                alert(`Wellness Assessment Complete!\n\nScore: ${result.overall_score}/100\nTrend: ${result.trend}\n\nKey Recommendations:\n${result.recommendations.slice(0, 3).join('\n')}`)
            }
        } catch (error) {
            console.error('Wellness check failed:', error)
            alert('Failed to run wellness assessment. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4">
            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-6 max-w-3xl mx-auto mt-8"
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-serenity-500/10 to-aurora-500/10 text-serenity-600 rounded-full text-sm font-bold tracking-wider mb-2 border border-serenity-500/20">
                    <Sparkles size={16} />
                    YOUR PERSONAL WELLNESS CENTER
                </div>

                <div className="space-y-4">
                    <h1 className="text-5xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-400">
                        Nurture Your Mind & Body
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Discover a comprehensive suite of AI-enhanced tools designed to support your complete wellbeing journey with personalized insights and guidance.
                    </p>
                </div>

                {/* Wellness Score Display */}
                <div className="flex items-center justify-center gap-8 py-6">
                    <div className="text-center">
                        <div className="text-4xl font-bold text-serenity-600 mb-2">{wellnessScore}</div>
                        <div className="text-sm text-muted-foreground">Wellness Score</div>
                    </div>
                    <div className="w-32 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-serenity-500 to-aurora-500 rounded-full transition-all duration-1000"
                            style={{ width: `${wellnessScore}%` }}
                        ></div>
                    </div>
                    <button
                        onClick={runWellnessCheck}
                        disabled={isLoading}
                        className="px-6 py-3 bg-serenity-600 text-white rounded-xl font-bold hover:bg-serenity-700 transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Analyzing...
                            </>
                        ) : (
                            <>
                                <Play size={16} />
                                Quick Check
                            </>
                        )}
                    </button>
                </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
                {quickActions.map((action, i) => (
                    <div
                        key={i}
                        className="p-4 rounded-2xl bg-white/5 dark:bg-white/5 border border-white/10 hover:border-white/20 transition-all cursor-pointer group"
                    >
                        <div className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                            <action.icon size={20} className="text-white" />
                        </div>
                        <div className="font-semibold text-sm mb-1">{action.label}</div>
                        <div className="text-xs text-muted-foreground">{action.desc}</div>
                    </div>
                ))}
            </motion.div>

            {/* Main Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
                {features.map((feature, i) => (
                    <Link href={feature.href} key={i}>
                        <FloatingCard className="h-full hover:scale-[1.02] transition-all cursor-pointer group" delay={i * 0.1}>
                            <div className={`p-4 rounded-2xl w-fit ${feature.color} mb-6 group-hover:scale-110 transition-transform`}>
                                <feature.icon size={32} />
                            </div>

                            <h3 className="text-xl font-bold mb-3 group-hover:text-serenity-600 transition-colors">
                                {feature.title}
                            </h3>

                            <p className="text-muted-foreground mb-6 leading-relaxed">
                                {feature.description}
                            </p>

                            {/* Benefits */}
                            <div className="mb-6">
                                <div className="flex flex-wrap gap-2">
                                    {feature.benefits.map((benefit, j) => (
                                        <span
                                            key={j}
                                            className="px-2 py-1 bg-green-500/10 text-green-600 rounded-full text-xs font-medium"
                                        >
                                            ✓ {benefit}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-sm font-medium">
                                <span className="text-muted-foreground">{feature.stats}</span>
                                <span className="flex items-center gap-2 text-serenity-600 group-hover:gap-3 transition-all">
                                    Explore <ArrowRight size={16} />
                                </span>
                            </div>
                        </FloatingCard>
                    </Link>
                ))}
            </div>

            {/* AI Insights Section */}
            <FloatingCard className="max-w-5xl mx-auto bg-gradient-to-r from-serenity-600/5 to-aurora-600/5 border-serenity-500/20 mt-16" delay={0.6}>
                <div className="flex flex-col lg:flex-row items-center gap-8 py-6">
                    <div className="p-8 bg-gradient-to-br from-serenity-500/10 to-aurora-500/10 rounded-3xl shadow-xl">
                        <Brain size={64} className="text-serenity-500" />
                    </div>

                    <div className="flex-1 space-y-4 text-center lg:text-left">
                        <h3 className="text-3xl font-bold">Unlock Advanced AI Insights</h3>
                        <p className="text-muted-foreground text-lg">
                            Connect your tracking data to our advanced AI engine to receive personalized recommendations,
                            predictive analytics, and comprehensive wellness assessments.
                        </p>

                        <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                            <Link href="/insights">
                                <span className="inline-block px-8 py-4 bg-gradient-to-r from-serenity-600 to-aurora-600 text-white rounded-xl font-bold hover:from-serenity-700 hover:to-aurora-700 transition-all cursor-pointer shadow-lg hover:shadow-xl">
                                    View Full Analytics
                                </span>
                            </Link>

                            <Link href="/goals">
                                <span className="inline-block px-8 py-4 bg-white/10 border border-white/20 text-white rounded-xl font-bold hover:bg-white/20 transition-all cursor-pointer">
                                    Set Personal Goals
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            </FloatingCard>

            {/* Progress Overview */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
                {[
                    { label: 'This Week', value: '12 entries', icon: Calendar, color: 'text-blue-500' },
                    { label: 'Streak', value: '7 days', icon: TrendingUp, color: 'text-green-500' },
                    { label: 'Achievements', value: '5 unlocked', icon: Award, color: 'text-yellow-500' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white/5 dark:bg-white/5 rounded-2xl p-6 border border-white/10">
                        <div className="flex items-center gap-3 mb-3">
                            <stat.icon size={24} className={stat.color} />
                            <div className="font-semibold">{stat.label}</div>
                        </div>
                        <div className="text-2xl font-bold">{stat.value}</div>
                    </div>
                ))}
            </motion.div>
        </div>
    )
}

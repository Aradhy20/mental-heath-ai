'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Brain, PenTool, Sparkles, ArrowRight, Activity, Zap } from 'lucide-react'
import FloatingCard from '@/components/anti-gravity/FloatingCard'

const features = [
    {
        title: 'Mood Tracker',
        description: 'Log your emotional state and track patterns over time.',
        icon: Activity,
        href: '/mood',
        color: 'bg-amber-500/10 text-amber-600',
        stats: 'Active logs: 128'
    },
    {
        title: 'Daily Journal',
        description: 'Reflect on your day and discover personal insights.',
        icon: PenTool,
        href: '/journal',
        color: 'bg-serenity-500/10 text-serenity-600',
        stats: 'Total entries: 45'
    },
    {
        title: 'Meditation Room',
        description: 'Mindfulness exercises and AI-curated coping kits.',
        icon: Zap,
        href: '/meditation',
        color: 'bg-purple-500/10 text-purple-600',
        stats: 'Minutes today: 15'
    }
]

export default function WellnessPage() {
    return (
        <div className="space-y-12 pb-20 max-w-7xl mx-auto px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4 max-w-2xl mx-auto mt-12"
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-serenity-500/10 text-serenity-600 rounded-full text-sm font-bold tracking-wider mb-2">
                    <Sparkles size={16} />
                    YOUR WELLNESS CENTER
                </div>
                <h1 className="text-5xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-400">
                    Nurture Your Mind
                </h1>
                <p className="text-xl text-muted-foreground">
                    Discover a suite of AI-enhanced tools designed to support your mental wellbeing journey.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                {features.map((feature, i) => (
                    <Link href={feature.href} key={i}>
                        <FloatingCard className="h-full hover:scale-[1.02] transition-all cursor-pointer group" delay={i * 0.1}>
                            <div className={`p-4 rounded-2xl w-fit ${feature.color} mb-6`}>
                                <feature.icon size={28} />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                            <p className="text-muted-foreground mb-8 leading-relaxed">
                                {feature.description}
                            </p>
                            <div className="pt-6 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-sm font-medium">
                                <span className="text-muted-foreground">{feature.stats}</span>
                                <span className="flex items-center gap-2 text-serenity-600 group-hover:gap-3 transition-all">
                                    Open Tools <ArrowRight size={16} />
                                </span>
                            </div>
                        </FloatingCard>
                    </Link>
                ))}
            </div>

            <FloatingCard className="max-w-4xl mx-auto bg-gradient-to-r from-serenity-600/5 to-aurora-600/5 border-serenity-500/20 mt-16" delay={0.4}>
                <div className="flex flex-col md:flex-row items-center gap-8 py-4">
                    <div className="p-6 bg-white dark:bg-white/10 rounded-3xl shadow-xl">
                        <Brain size={48} className="text-serenity-500" />
                    </div>
                    <div className="flex-1 space-y-4 text-center md:text-left">
                        <h3 className="text-2xl font-bold">Unlock Personal AI Insights</h3>
                        <p className="text-muted-foreground">
                            Connect your tracking data to our AI engine to receive personalized recommendations and trend analysis.
                        </p>
                        <Link href="/insights">
                            <span className="inline-block px-6 py-3 bg-serenity-600 text-white rounded-xl font-bold hover:bg-serenity-700 transition-all cursor-pointer">
                                View Full Analytics
                            </span>
                        </Link>
                    </div>
                </div>
            </FloatingCard>
        </div>
    )
}

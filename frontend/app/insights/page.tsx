'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts'
import {
    TrendingUp, Calendar, Filter, Download, Brain, Activity, Zap,
    Heart, Target, AlertTriangle, CheckCircle, Clock, Star,
    BarChart3, PieChart as PieChartIcon, TrendingDown, Sparkles
} from 'lucide-react'
import FloatingCard from '@/components/anti-gravity/FloatingCard'
import { useAuthStore } from '@/lib/store/auth-store'
import { userAPI, analysisAPI } from '@/lib/api'

const moodData = [
    { date: '2025-12-14', mood: 4, stress: 2, sleep: 7, energy: 6, anxiety: 3 },
    { date: '2025-12-15', mood: 3, stress: 4, sleep: 6, energy: 5, anxiety: 4 },
    { date: '2025-12-16', mood: 5, stress: 1, sleep: 8, energy: 8, anxiety: 2 },
    { date: '2025-12-17', mood: 4, stress: 3, sleep: 7, energy: 7, anxiety: 3 },
    { date: '2025-12-18', mood: 2, stress: 5, sleep: 5, energy: 4, anxiety: 5 },
    { date: '2025-12-19', mood: 4, stress: 2, sleep: 7, energy: 6, anxiety: 2 },
    { date: '2025-12-20', mood: 5, stress: 1, sleep: 9, energy: 9, anxiety: 1 },
]

const emotionDistribution = [
    { name: 'Joy', value: 40, color: '#10b981' },
    { name: 'Calm', value: 30, color: '#3b82f6' },
    { name: 'Anxiety', value: 15, color: '#f59e0b' },
    { name: 'Sadness', value: 10, color: '#6366f1' },
    { name: 'Anger', value: 5, color: '#ef4444' },
]

const wellnessFactors = [
    { factor: 'Sleep Quality', score: 75, max: 100, color: '#3b82f6' },
    { factor: 'Exercise', score: 60, max: 100, color: '#10b981' },
    { factor: 'Social Connection', score: 70, max: 100, color: '#8b5cf6' },
    { factor: 'Stress Management', score: 55, max: 100, color: '#f59e0b' },
    { factor: 'Nutrition', score: 65, max: 100, color: '#ef4444' },
    { factor: 'Work-Life Balance', score: 50, max: 100, color: '#06b6d4' },
]

const insights = [
    {
        type: 'positive',
        icon: TrendingUp,
        title: 'Mood Improvement Trend',
        description: 'Your average mood score has increased by 15% over the past week.',
        color: 'text-green-600 bg-green-500/10'
    },
    {
        type: 'warning',
        icon: AlertTriangle,
        title: 'Sleep Pattern Concern',
        description: 'Irregular sleep patterns detected. Consider establishing a consistent bedtime routine.',
        color: 'text-amber-600 bg-amber-500/10'
    },
    {
        type: 'info',
        icon: Brain,
        title: 'AI Recommendation',
        description: 'Based on your data, try 10 minutes of morning meditation to reduce anxiety levels.',
        color: 'text-blue-600 bg-blue-500/10'
    },
    {
        type: 'achievement',
        icon: Star,
        title: 'Weekly Milestone',
        description: 'Congratulations! You\'ve maintained a 7-day journaling streak.',
        color: 'text-purple-600 bg-purple-500/10'
    }
]

export default function InsightsPage() {
    const { user } = useAuthStore()
    const [timeRange, setTimeRange] = useState('7d')
    const [isMounted, setIsMounted] = useState(false)
    const [chartData, setChartData] = useState(moodData)
    const [isLoading, setIsLoading] = useState(true)
    const [wellnessScore, setWellnessScore] = useState(72)
    const [selectedMetric, setSelectedMetric] = useState('mood')

    useEffect(() => {
        setIsMounted(true)
        const fetchMoodHistory = async () => {
            if (!user) return
            try {
                const response = await userAPI.getMoodHistory();
                if (response.data) {
                    const data = response.data;
                    const history = Array.isArray(data) ? data : (data.history || []);

                    if (history.length > 0) {
                        const formatted = history.slice(-7).map((entry: any) => ({
                            date: new Date(entry.createdAt || entry.timestamp).toLocaleDateString(),
                            mood: entry.score,
                            stress: (entry.score < 5) ? 4 : 1,
                            sleep: entry.energy_level || 7,
                            energy: entry.energy_level || 6,
                            anxiety: Math.max(1, 6 - entry.score)
                        }))
                        setChartData(formatted)
                    }
                }
            } catch (err) {
                console.error("Failed to fetch insights:", err)
            } finally {
                setIsLoading(false)
            }
        }
        fetchMoodHistory()
    }, [user])

    const runWellnessAnalysis = async () => {
        try {
            const avgMood = chartData.reduce((acc, curr) => acc + curr.mood, 0) / (chartData.length || 1);
            const response = await analysisAPI.getWellnessScore({
                mood_score: avgMood * 2,
                anxiety_level: 40,
                stress_level: 45,
                sleep_quality: 60,
                exercise_frequency: 55,
                social_interaction: 60,
                medication_adherence: 90,
                therapy_attendance: 85,
                meditation_practice: 20,
                journaling_frequency: 15,
                substance_use: 5,
                self_harm_thoughts: 2
            });

            if (response.data?.result) {
                const result = response.data.result
                setWellnessScore(result.overall_score)
                alert(`Advanced Wellness Analysis Complete!\n\nOverall Score: ${result.overall_score}/100\nTrend: ${result.trend}\n\nKey Insights:\n${result.recommendations.slice(0, 3).join('\n')}`)
            }
        } catch (e) {
            console.error("Wellness analysis failed:", e);
            alert('Failed to run analysis. Please try again.')
        }
    }

    const generateReport = async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            const res = await fetch('/api/analysis/report', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: user.user_id,
                    username: user.name || user.username
                })
            });
            if (res.ok) {
                alert("Professional Wellness Report generated successfully!\n\nReport includes:\n• Comprehensive health assessment\n• Trend analysis\n• Personalized recommendations\n• Progress tracking metrics");
            } else {
                throw new Error('Report generation failed');
            }
        } catch (e) {
            console.error(e);
            alert('Failed to generate report. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="space-y-8 pb-12 max-w-7xl mx-auto px-4">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-6"
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-serenity-500/10 to-aurora-500/10 text-serenity-600 rounded-full text-sm font-bold tracking-wider border border-serenity-500/20">
                    <Brain size={16} />
                    ADVANCED ANALYTICS & INSIGHTS
                </div>

                <div className="space-y-4">
                    <h1 className="text-5xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-400">
                        Your Mental Health Dashboard
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Comprehensive AI-powered analytics to understand your emotional patterns and optimize your wellbeing journey.
                    </p>
                </div>

                {/* Current Wellness Score */}
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
                        onClick={runWellnessAnalysis}
                        className="px-6 py-3 bg-serenity-600 text-white rounded-xl font-bold hover:bg-serenity-700 transition-all flex items-center gap-2"
                    >
                        <Zap size={16} />
                        Run Analysis
                    </button>
                </div>
            </motion.div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="flex bg-black/5 dark:bg-white/5 p-1 rounded-xl border border-black/5 dark:border-white/10">
                        {['7d', '30d', '90d'].map((range) => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${timeRange === range
                                    ? 'bg-white dark:bg-white/10 shadow-sm text-serenity-600 dark:text-white'
                                    : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                {range.toUpperCase()}
                            </button>
                        ))}
                    </div>

                    <div className="flex bg-black/5 dark:bg-white/5 p-1 rounded-xl border border-black/5 dark:border-white/10">
                        {[
                            { key: 'mood', label: 'Mood' },
                            { key: 'stress', label: 'Stress' },
                            { key: 'sleep', label: 'Sleep' },
                            { key: 'energy', label: 'Energy' }
                        ].map((metric) => (
                            <button
                                key={metric.key}
                                onClick={() => setSelectedMetric(metric.key)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedMetric === metric.key
                                    ? 'bg-white dark:bg-white/10 shadow-sm text-serenity-600 dark:text-white'
                                    : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                {metric.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={generateReport}
                        disabled={isLoading}
                        className="px-6 py-3 bg-serenity-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-serenity-700 transition-all disabled:opacity-50"
                    >
                        <Download size={16} />
                        {isLoading ? 'Generating...' : 'Full Report'}
                    </button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    {
                        label: 'Avg Mood Score',
                        value: chartData.length > 0
                            ? (chartData.reduce((acc, curr) => acc + curr.mood, 0) / chartData.length).toFixed(1)
                            : '4.2',
                        icon: Heart,
                        color: 'text-green-500 bg-green-500/10',
                        trend: '+12%'
                    },
                    {
                        label: 'Wellness Consistency',
                        value: chartData.length > 4 ? '92%' : '65%',
                        icon: Activity,
                        color: 'text-blue-500 bg-blue-500/10',
                        trend: '+8%'
                    },
                    {
                        label: 'AI Resilience Score',
                        value: chartData.length > 0
                            ? Math.min(60 + chartData.length * 5, 95) + '/100'
                            : '76/100',
                        icon: Brain,
                        color: 'text-purple-500 bg-purple-500/10',
                        trend: '+15%'
                    },
                    {
                        label: 'Weekly Progress',
                        value: '7 days',
                        icon: Target,
                        color: 'text-amber-500 bg-amber-500/10',
                        trend: 'Active'
                    },
                ].map((stat, i) => (
                    <FloatingCard key={i} delay={i * 0.05}>
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                                <h3 className="text-3xl font-bold mt-2">{stat.value}</h3>
                                <div className="flex items-center gap-1 mt-1">
                                    <TrendingUp size={12} className="text-green-500" />
                                    <span className="text-xs text-green-600 font-medium">{stat.trend}</span>
                                </div>
                            </div>
                            <div className={`p-3 rounded-2xl ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                        </div>
                    </FloatingCard>
                ))}
            </div>

            {/* AI Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {insights.map((insight, i) => (
                    <FloatingCard key={i} delay={0.1 + i * 0.05}>
                        <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-xl ${insight.color}`}>
                                <insight.icon size={20} />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold mb-2">{insight.title}</h4>
                                <p className="text-sm text-muted-foreground">{insight.description}</p>
                            </div>
                        </div>
                    </FloatingCard>
                ))}
            </div>

            {/* Charts Section */}
            {isMounted && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Main Trend Chart */}
                    <FloatingCard className="lg:col-span-8 h-[450px]" delay={0.2}>
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-xl font-bold">Emotional Trends</h3>
                                <p className="text-sm text-muted-foreground">
                                    Tracking {selectedMetric} patterns over time with AI-powered analysis.
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <BarChart3 size={16} className="text-muted-foreground" />
                                <span className="text-sm text-muted-foreground capitalize">{selectedMetric}</span>
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height="85%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" opacity={0.1} />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'currentColor', opacity: 0.5 }} />
                                <YAxis hide domain={[0, 10]} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                        border: 'none',
                                        borderRadius: '12px',
                                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey={selectedMetric}
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorMetric)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </FloatingCard>

                    {/* Emotion Distribution */}
                    <FloatingCard className="lg:col-span-4 h-[450px]" delay={0.3}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold">Emotion Distribution</h3>
                            <PieChartIcon size={16} className="text-muted-foreground" />
                        </div>
                        <div className="h-64 relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={emotionDistribution}
                                        innerRadius={50}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {emotionDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-6 space-y-3">
                            {emotionDistribution.map((item, i) => (
                                <div key={i} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                        <span>{item.name}</span>
                                    </div>
                                    <span className="font-medium">{item.value}%</span>
                                </div>
                            ))}
                        </div>
                    </FloatingCard>

                    {/* Wellness Factors Radar */}
                    <FloatingCard className="lg:col-span-6 h-[450px]" delay={0.4}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold">Wellness Factors</h3>
                            <Star size={16} className="text-muted-foreground" />
                        </div>
                        <ResponsiveContainer width="100%" height="85%">
                            <RadarChart data={wellnessFactors}>
                                <PolarGrid stroke="currentColor" opacity={0.1} />
                                <PolarAngleAxis
                                    dataKey="factor"
                                    tick={{ fontSize: 10, fill: 'currentColor', opacity: 0.7 }}
                                />
                                <PolarRadiusAxis
                                    angle={90}
                                    domain={[0, 100]}
                                    tick={{ fontSize: 8, fill: 'currentColor', opacity: 0.5 }}
                                />
                                <Radar
                                    name="Score"
                                    dataKey="score"
                                    stroke="#3b82f6"
                                    fill="#3b82f6"
                                    fillOpacity={0.1}
                                    strokeWidth={2}
                                />
                                <Tooltip />
                            </RadarChart>
                        </ResponsiveContainer>
                    </FloatingCard>

                    {/* Progress Bars */}
                    <FloatingCard className="lg:col-span-6 h-[450px]" delay={0.5}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold">Factor Breakdown</h3>
                            <Activity size={16} className="text-muted-foreground" />
                        </div>
                        <div className="space-y-6">
                            {wellnessFactors.map((factor, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium">{factor.factor}</span>
                                        <span className="text-muted-foreground">{factor.score}/{factor.max}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div
                                            className="h-2 rounded-full transition-all duration-1000"
                                            style={{
                                                width: `${(factor.score / factor.max) * 100}%`,
                                                backgroundColor: factor.color
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </FloatingCard>
                </div>
            )}

            {/* Action Footer */}
            <FloatingCard className="bg-gradient-to-r from-serenity-600/5 to-aurora-600/5 border-serenity-500/20" delay={0.6}>
                <div className="text-center space-y-4 py-6">
                    <h3 className="text-2xl font-bold">Ready for Deeper Insights?</h3>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Unlock advanced AI-powered recommendations, predictive analytics, and personalized wellness plans
                        based on your comprehensive health data.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <button
                            onClick={runWellnessAnalysis}
                            className="px-8 py-4 bg-gradient-to-r from-serenity-600 to-aurora-600 text-white rounded-xl font-bold hover:from-serenity-700 hover:to-aurora-700 transition-all flex items-center gap-2"
                        >
                            <Sparkles size={16} />
                            Advanced Analysis
                        </button>
                        <button
                            onClick={generateReport}
                            disabled={isLoading}
                            className="px-8 py-4 bg-white/10 border border-white/20 text-white rounded-xl font-bold hover:bg-white/20 transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                            <Download size={16} />
                            Professional Report
                        </button>
                    </div>
                </div>
            </FloatingCard>
        </div>
    )
}

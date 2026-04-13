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
    BarChart3, PieChart as PieChartIcon, TrendingDown, Sparkles, ChevronDown
} from 'lucide-react'
import { useAuthStore } from '@/lib/store/auth-store'

const API_BASE = process.env.NEXT_PUBLIC_AUTH_URL || 'http://localhost:8001'

// ─── Dummy Data ─────────────────────────────────────────────────────────────
const moodData = [
    { date: 'Mon', mood: 4, stress: 2, sleep: 7, energy: 6 },
    { date: 'Tue', mood: 3, stress: 4, sleep: 6, energy: 5 },
    { date: 'Wed', mood: 5, stress: 1, sleep: 8, energy: 8 },
    { date: 'Thu', mood: 4, stress: 3, sleep: 7, energy: 7 },
    { date: 'Fri', mood: 2, stress: 5, sleep: 5, energy: 4 },
    { date: 'Sat', mood: 4, stress: 2, sleep: 7, energy: 6 },
    { date: 'Sun', mood: 5, stress: 1, sleep: 9, energy: 9 },
]

const emotionDistribution = [
    { name: 'Joy', value: 40, color: '#10b981' },
    { name: 'Calm', value: 30, color: '#3b82f6' },
    { name: 'Anxiety', value: 15, color: '#f59e0b' },
    { name: 'Sad', value: 15, color: '#6366f1' },
]

const wellnessFactors = [
    { factor: 'Sleep', score: 75 },
    { factor: 'Focus', score: 60 },
    { factor: 'Social', score: 70 },
    { factor: 'Stress', score: 55 },
    { factor: 'Energy', score: 65 },
]

// ─── Components ──────────────────────────────────────────────────────────────

const Card = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white dark:bg-[#0f1629] border border-slate-200 dark:border-white/[0.06] rounded-[2rem] p-6 shadow-sm ${className}`}>
     {children}
  </div>
)

const Metric = ({ label, value, trend, icon: Icon, color }: any) => (
  <Card className="flex flex-col gap-3">
     <div className="flex items-center justify-between">
        <div className={`w-10 h-10 rounded-xl ${color} bg-opacity-10 flex items-center justify-center`}>
           <Icon size={20} className={color.replace('bg-', 'text-')} />
        </div>
        <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">{trend}</span>
     </div>
     <div>
        <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{label}</p>
     </div>
  </Card>
)

// ─── MAIN PAGE ──────────────────────────────────────────────────────────────

export default function InsightsPage() {
    const { user } = useAuthStore()
    const [timeRange, setTimeRange] = useState('7d')
    const [isLoading, setIsLoading] = useState(false)
    const [wellnessScore, setWellnessScore] = useState(82)

    return (
        <div className="min-h-full bg-slate-50 dark:bg-[#0a0d1a] p-6 lg:p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Wellness Insights</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Advanced analytics to track your mental trajectory.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <select className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm font-semibold outline-none text-slate-700 dark:text-slate-300">
                             <option>Last 7 Days</option>
                             <option>Last 30 Days</option>
                             <option>Last 3 Months</option>
                        </select>
                        <button className="btn-primary gap-2 shadow-violet-500/20 py-2.5">
                            <Download size={16} /> Export Data
                        </button>
                    </div>
                </div>

                {/* Main Wellness Score Banner */}
                <Card className="bg-gradient-to-br from-violet-600 to-indigo-700 text-white relative overflow-hidden border-none p-10">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[100px] -mr-48 -mt-48" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                         <div className="max-w-md space-y-4">
                             <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-bold uppercase tracking-widest border border-white/20">
                                <Activity size={12} /> Live Index
                             </div>
                             <h2 className="text-4xl font-bold">Your Wellness Score is {wellnessScore}</h2>
                             <p className="text-violet-100/80 leading-relaxed text-sm">
                                Based on your mood history, AI chat tone, and facial markers over the last week, your overall mental health index has improved by 4%.
                             </p>
                             <button className="flex items-center gap-2 px-5 py-2.5 bg-white text-violet-700 rounded-xl text-sm font-bold hover:bg-violet-50 transition-all">
                                <Sparkles size={16} /> Run Deeper AI Scan
                             </button>
                         </div>
                         <div className="relative">
                             <svg width="160" height="160" viewBox="0 0 160 160">
                                <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="12" />
                                <circle cx="80" cy="80" r="70" fill="none" stroke="white" strokeWidth="12" strokeDasharray={`${(wellnessScore/100) * 440} 440`} strokeLinecap="round" transform="rotate(-90 80 80)" />
                                <text x="80" y="80" textAnchor="middle" dy="0.35em" fill="white" fontSize="32" fontWeight="bold">{wellnessScore}</text>
                             </svg>
                         </div>
                    </div>
                </Card>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                   <Metric label="Avg Mood" value="4.2/5" trend="+12%" icon={Heart} color="bg-emerald-500" />
                   <Metric label="Stress Avg" value="2.8/5" trend="-15%" icon={Brain} color="bg-rose-500" />
                   <Metric label="AI Sessions" value="12" trend="+3" icon={Target} color="bg-violet-500" />
                   <Metric label="Consistency" value="88%" trend="+5%" icon={Zap} color="bg-amber-500" />
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Emotional Trend Line */}
                    <Card className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Emotional Trend</h3>
                                <p className="text-xs text-slate-400">Past 7 days performance</p>
                            </div>
                            <BarChart3 size={18} className="text-slate-300" />
                        </div>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={moodData}>
                                    <defs>
                                        <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15}/>
                                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.03)" />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                                    <YAxis hide domain={[0, 10]} />
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                                    <Area type="monotone" dataKey="mood" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorMood)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    {/* Emotion Distribution Pie */}
                    <Card>
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Distribution</h3>
                            <PieChartIcon size={18} className="text-slate-300" />
                        </div>
                        <div className="h-48 relative">
                             <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={emotionDistribution} innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                                        {emotionDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                             </ResponsiveContainer>
                        </div>
                        <div className="mt-4 space-y-3">
                             {emotionDistribution.map(e => (
                                <div key={e.name} className="flex items-center justify-between">
                                   <div className="flex items-center gap-2">
                                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: e.color }} />
                                      <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{e.name}</span>
                                   </div>
                                   <span className="text-xs font-bold text-slate-900 dark:text-white">{e.value}%</span>
                                </div>
                             ))}
                        </div>
                    </Card>

                    {/* Wellness Factors Radar */}
                    <Card className="lg:col-span-1">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Wellness Core</h3>
                            <Star size={18} className="text-slate-300" />
                        </div>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart data={wellnessFactors}>
                                    <PolarGrid stroke="rgba(0,0,0,0.05)" />
                                    <PolarAngleAxis dataKey="factor" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                                    <Radar name="Score" dataKey="score" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.1} strokeWidth={2} />
                                    <Tooltip />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    {/* Key Insights List */}
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                           { title: "Sleep Cycle Shift", level: "Improvement", text: "Consistency in your sleep schedule improved by 12% since last Tuesday.", icon: Clock, color: "text-emerald-500", bg: "bg-emerald-50" },
                           { title: "Stress Peak Detected", level: "Warning", text: "Heavy stress markers identified during Wednesday's voice analysis.", icon: AlertTriangle, color: "text-rose-500", bg: "bg-rose-50" },
                        ].map((ins, i) => (
                           <div key={i} className="p-5 rounded-2xl bg-white dark:bg-[#0f1629] border border-slate-200 dark:border-white/[0.06] shadow-sm flex items-start gap-4">
                              <div className={`p-2.5 rounded-xl ${ins.bg} dark:bg-opacity-10`}>
                                 <ins.icon size={20} className={ins.color} />
                              </div>
                              <div>
                                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{ins.level}</p>
                                 <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{ins.title}</p>
                                 <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{ins.text}</p>
                              </div>
                           </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    )
}

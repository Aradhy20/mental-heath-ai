'use client'

import React, { useState, useEffect } from 'react'
import { motion, animate } from 'framer-motion'
import {
  TrendingUp, Smile, Brain, Wind, Sparkles, BookOpen,
  MessageCircle, MapPin, ArrowUpRight, ArrowDownRight,
  Activity, Calendar, ChevronRight, Zap, Star
} from 'lucide-react'
import { useAuthStore, getStoredToken } from '@/lib/store/auth-store'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import Link from 'next/link'
import AICompanion from '@/components/dashboard/AICompanion'


const API_BASE = process.env.NEXT_PUBLIC_AUTH_URL || 'http://localhost:8000'

// ─── Animated counter ────────────────────────────────────────────────────────
function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    const c = animate(0, to, { duration: 1.5, ease: [0.16, 1, 0.3, 1], onUpdate: v => setVal(Math.round(v)) })
    return () => c.stop()
  }, [to])
  return <span>{val}{suffix}</span>
}

// ─── Mood Emoji ─────────────────────────────────────────────────────────────
const moodEmoji = (score: number) => {
  if (score >= 4.5) return '🤩'
  if (score >= 3.5) return '😊'
  if (score >= 2.5) return '😐'
  if (score >= 1.5) return '😔'
  return '😞'
}

// ─── Metric Card ────────────────────────────────────────────────────────────
function MetricCard({ label, value, suffix, delta, icon: Icon, color, href }: {
  label: string; value: number; suffix?: string; delta?: string;
  icon: React.ElementType; color: string; href?: string;
}) {
  const isPositive = delta?.startsWith('+')
  const card = (
    <div className="bg-white dark:bg-[#0f1629] rounded-2xl border border-slate-200 dark:border-white/[0.06] p-5 hover:shadow-md transition-all group cursor-pointer">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center`}>
          <Icon size={17} className="text-white" />
        </div>
        {delta && (
          <span className={`flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-lg ${
            isPositive ? 'text-emerald-700 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-500/15' : 'text-rose-700 bg-rose-100 dark:text-rose-400 dark:bg-rose-500/15'
          }`}>
            {isPositive ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
            {delta}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
        <Counter to={value} suffix={suffix} />
      </p>
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  )
  return href ? <Link href={href}>{card}</Link> : card
}

// ─── Quick Actions ───────────────────────────────────────────────────────────
const QUICK_ACTIONS = [
  { label: 'Log My Mood',       href: '/mood',       icon: Smile,         color: 'from-violet-500 to-purple-500', desc: 'How are you feeling?' },
  { label: 'Talk to AI',        href: '/chat',       icon: MessageCircle, color: 'from-blue-500 to-cyan-500',    desc: 'Instant support' },
  { label: 'Write in Journal',  href: '/journal',    icon: BookOpen,      color: 'from-indigo-500 to-violet-500', desc: 'Private thoughts' },
  { label: 'Breathe & Relax',   href: '/meditation', icon: Wind,          color: 'from-teal-500 to-emerald-500',  desc: 'Guided breathing' },
]

// ─── Weekly Mood Data (demo) ─────────────────────────────────────────────────
const WEEK_DATA = [
  { day: 'Mon', mood: 3, sessions: 1 },
  { day: 'Tue', mood: 4, sessions: 2 },
  { day: 'Wed', mood: 2, sessions: 0 },
  { day: 'Thu', mood: 4, sessions: 1 },
  { day: 'Fri', mood: 5, sessions: 3 },
  { day: 'Sat', mood: 4, sessions: 2 },
  { day: 'Sun', mood: 4, sessions: 1 },
]

const wellnessFactors = [
  { factor: 'Sleep', score: 75 },
  { factor: 'Focus', score: 60 },
  { factor: 'Social', score: 70 },
  { factor: 'Stress', score: 55 },
  { factor: 'Energy', score: 65 },
]

// ─── Custom Tooltip ──────────────────────────────────────────────────────────
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  const emojis = ['', '😞', '😔', '😐', '😊', '🤩']
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 shadow-lg text-xs">
      <p className="font-semibold text-slate-500 mb-1">{label}</p>
      <p className="font-bold text-slate-900 dark:text-white">{emojis[payload[0].value]} Mood {payload[0].value}/5</p>
    </div>
  )
}

// ─── Insight Item ────────────────────────────────────────────────────────────
function InsightItem({ emoji, title, desc, type }: { emoji: string; title: string; desc: string; type: 'good' | 'info' | 'warn' }) {
  const colors = {
    good: 'border-emerald-200 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/[0.06]',
    info: 'border-blue-200 dark:border-blue-500/20 bg-blue-50 dark:bg-blue-500/[0.06]',
    warn: 'border-amber-200 dark:border-amber-500/20 bg-amber-50 dark:bg-amber-500/[0.06]',
  }
  return (
    <div className={`flex items-start gap-3 p-3.5 rounded-xl border ${colors[type]}`}>
      <span className="text-xl mt-0.5">{emoji}</span>
      <div>
        <p className="text-sm font-semibold text-slate-900 dark:text-white">{title}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}

// ─── MAIN PAGE ──────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { user } = useAuthStore()
  const [stats, setStats] = useState<any>(null)
  const [twin, setTwin] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  useEffect(() => {
    const fetch_stats = async () => {
      try {
        const [statsRes, twinRes] = await Promise.all([
            fetch(`${API_BASE}/api/v1/dashboard/stats`),
            fetch(`${API_BASE}/api/v1/profile/twin`, {
                headers: { ...(getStoredToken() ? { Authorization: `Bearer ${getStoredToken()}` } : {}) }
            })
        ])
        if (statsRes.ok) setStats(await statsRes.json())
        if (twinRes.ok) setTwin(await twinRes.json())
      } catch (_) {
        // use defaults
      } finally {
        setLoading(false)
      }
    }
    fetch_stats()
  }, [])

  const data = stats || {
    wellness_score: 82,
    stress_index: 0.24,
    sleep_quality: '72%',
    active_sessions: 12,
    timeline: WEEK_DATA.map(d => ({ time: d.day, mood: d.mood })),
    emotion_distribution: [
      { name: 'Happy', value: 35, color: '#10b981' },
      { name: 'Anxious', value: 25, color: '#8b5cf6' },
      { name: 'Sad', value: 20, color: '#3b82f6' },
      { name: 'Neutral', value: 20, color: '#94a3b8' },
    ],
    insights: []
  }

  return (
    <div className="min-h-full bg-slate-50 dark:bg-[#0a0d1a] p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-7">

        {/* ── Header with AI Companion ── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="flex-1">
            <p className="text-sm font-medium text-violet-600 dark:text-violet-400 mb-1">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              {greeting}, {user?.username?.split(' ')[0] || 'there'} 👋
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 mb-6">
              Here's your wellness snapshot for today.
            </p>
            <Link href="/mood" className="btn-primary inline-flex gap-2">
              <Sparkles size={15} /> Daily Check-in
            </Link>
          </div>

          {/* Animated Companion */}
          <div className="flex justify-center lg:justify-end">
            <AICompanion userName={user?.username?.split(' ')[0] || 'there'} />
          </div>
        </motion.div>

        {/* ── Digital Twin Profile (New) ── */}
        {twin && twin.status !== 'guest_mode' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 text-white shadow-xl shadow-indigo-500/20 overflow-hidden relative"
          >
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-400/20 rounded-full -ml-10 -mb-10 blur-2xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1 border-r border-white/10 pr-4">
                <div className="flex items-center gap-2 mb-3">
                  <Brain size={18} className="text-indigo-200" />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-100">Digital Twin Profile</h3>
                </div>
                <p className="text-3xl font-extrabold mb-1">Resilience: {Math.round(twin.resilience_index)}%</p>
                <p className="text-xs text-indigo-100/70">Based on your activity patterns and emotional recovery rate.</p>
              </div>

              <div className="md:col-span-1 border-r border-white/10 pr-4">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-indigo-200 mb-3">Top Emotional Triggers</h4>
                <div className="flex flex-wrap gap-2">
                  {twin.top_triggers?.map(([t]: any) => (
                    <span key={t} className="px-2.5 py-1 rounded-full bg-white/15 text-[10px] font-bold border border-white/10 capitalize">
                      {t}
                    </span>
                  )) || <span className="text-xs italic text-white/50">Collecting data...</span>}
                </div>
              </div>

              <div className="md:col-span-1">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-indigo-200 mb-2">Vulnerability Window</h4>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-white/15 border border-white/10">
                    <Calendar size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{twin.vulnerability_window}</p>
                    <p className="text-[10px] text-indigo-200">Daily peak stress window identified.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Main Wellness Score Banner (from Insights) ── */}
        <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-violet-600 to-indigo-700 text-white rounded-3xl relative overflow-hidden shadow-sm p-8 lg:p-10"
        >
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[100px] -mr-48 -mt-48" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                 <div className="max-w-md space-y-4">
                     <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-bold uppercase tracking-widest border border-white/20">
                        <Activity size={12} /> Live Index
                     </div>
                     <h2 className="text-4xl font-bold">Your Wellness Score is {data.wellness_score}</h2>
                     <p className="text-violet-100/80 leading-relaxed text-sm">
                        Based on your mood history, AI chat tone, and facial markers over the last week, your overall mental health index has dynamically adjusted.
                     </p>
                     <button className="flex items-center gap-2 px-5 py-2.5 bg-white text-violet-700 rounded-xl text-sm font-bold hover:bg-violet-50 transition-all">
                        <Sparkles size={16} /> Run Deeper AI Scan
                     </button>
                 </div>
                 <div className="relative flex-shrink-0">
                     <svg width="160" height="160" viewBox="0 0 160 160">
                        <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="12" />
                        <circle cx="80" cy="80" r="70" fill="none" stroke="white" strokeWidth="12" strokeDasharray={`${(data.wellness_score/100) * 440} 440`} strokeLinecap="round" transform="rotate(-90 80 80)" />
                        <text x="80" y="80" textAnchor="middle" dy="0.35em" fill="white" fontSize="32" fontWeight="bold">{data.wellness_score}</text>
                     </svg>
                 </div>
            </div>
        </motion.div>

        {/* ── Metric Row ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <MetricCard label="Wellness Score"    value={data.wellness_score} suffix="/100" delta="+5"  icon={Activity}  color="bg-violet-500"  href="/insights" />
          <MetricCard label="Stress Level"      value={Math.round(data.stress_index * 100)} suffix="%" delta="-12%" icon={Brain}    color="bg-rose-500"    href="/analysis" />
          <MetricCard label="Sleep Quality"     value={72}                  suffix="%"     delta="+8"  icon={Wind}      color="bg-blue-500"   />
          <MetricCard label="AI Conversations"  value={data.active_sessions}               delta="+3"  icon={MessageCircle} color="bg-emerald-500" href="/chat" />
        </motion.div>

        {/* ── Quick Actions ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {QUICK_ACTIONS.map(action => {
              const Icon = action.icon
              return (
                <Link key={action.href} href={action.href}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group p-4 rounded-2xl bg-white dark:bg-[#0f1629] border border-slate-200 dark:border-white/[0.06] hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 shadow-sm group-hover:scale-105 transition-transform`}>
                      <Icon size={18} className="text-white" />
                    </div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{action.label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{action.desc}</p>
                  </motion.div>
                </Link>
              )
            })}
          </div>
        </motion.div>

        {/* ── Main Grid: Chart + Insights ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Mood Chart */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="lg:col-span-2 bg-white dark:bg-[#0f1629] rounded-2xl border border-slate-200 dark:border-white/[0.06] shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-semibold text-slate-900 dark:text-white">Mood This Week</h2>
                <p className="text-xs text-slate-400 mt-0.5">7-day emotional trajectory</p>
              </div>
              <Link href="/mood" className="flex items-center gap-1 text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline">
                View all <ChevronRight size={12} />
              </Link>
            </div>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={WEEK_DATA} margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
                  <defs>
                    <linearGradient id="moodFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#8b5cf6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[1, 5]} tick={false} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="mood"
                    stroke="#8b5cf6"
                    fill="url(#moodFill)"
                    strokeWidth={2.5}
                    dot={{ fill: '#8b5cf6', strokeWidth: 0, r: 4 }}
                    activeDot={{ r: 6, fill: '#8b5cf6', stroke: 'white', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Day summary */}
            <div className="flex gap-2 mt-4 flex-wrap">
              {WEEK_DATA.map(d => (
                <div key={d.day} className="flex-1 min-w-[36px] text-center">
                  <span className="text-base">{moodEmoji(d.mood)}</span>
                  <p className="text-[9px] text-slate-400 mt-1 font-medium">{d.day}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* AI Insights panel */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-[#0f1629] rounded-2xl border border-slate-200 dark:border-white/[0.06] shadow-sm p-6 flex flex-col"
          >
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center">
                <Sparkles size={13} className="text-white" />
              </div>
              <h2 className="font-semibold text-slate-900 dark:text-white text-sm">AI Insights</h2>
            </div>

            <div className="space-y-3 flex-1">
              <InsightItem emoji="🌟" title="Great streak!" desc="You've logged your mood 7 days in a row. Consistency builds self-awareness." type="good" />
              <InsightItem emoji="😴" title="Sleep matters" desc="Your mood is 28% lower on days with poor sleep. Try a consistent sleep schedule." type="info" />
              <InsightItem emoji="⚡" title="Stress spike" desc="Wednesday showed elevated stress. Consider a breathing session next time." type="warn" />
            </div>

            <Link href="/chat" className="mt-5 flex items-center justify-center gap-2 p-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold hover:brightness-110 transition-all shadow-md shadow-violet-500/25">
              <MessageCircle size={15} /> Talk to MindfulAI
            </Link>
          </motion.div>

          {/* New: Emotion Distribution */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25 }}
            className="bg-white dark:bg-[#0f1629] rounded-2xl border border-slate-200 dark:border-white/[0.06] shadow-sm p-6"
          >
            <h2 className="font-semibold text-slate-900 dark:text-white mb-6">Emotion Distribution</h2>
            <div className="h-64 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.emotion_distribution}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.emotion_distribution.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold text-slate-900 dark:text-white">74%</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Balanced</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
               {data.emotion_distribution.map((entry: any) => (
                 <div key={entry.name} className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                   <span className="text-[10px] font-semibold text-slate-500">{entry.name}</span>
                 </div>
               ))}
            </div>
          </motion.div>

          {/* New: Wellness Factors Radar (from Insights) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-[#0f1629] rounded-2xl border border-slate-200 dark:border-white/[0.06] shadow-sm p-6 lg:col-span-1"
          >
            <div className="flex items-center justify-between mb-8">
                <h2 className="font-semibold text-slate-900 dark:text-white">Wellness Core</h2>
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
          </motion.div>

        </div>

        {/* ── Bottom Row: Recent Activity + Find Therapist ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Recent Journal */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white dark:bg-[#0f1629] rounded-2xl border border-slate-200 dark:border-white/[0.06] shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen size={16} className="text-violet-500" /> Recent Journal
              </h2>
              <Link href="/journal" className="text-xs text-violet-600 dark:text-violet-400 font-semibold hover:underline flex items-center gap-1">
                View all <ChevronRight size={12} />
              </Link>
            </div>
            <div className="space-y-3">
              {[
                { title: 'Feeling overwhelmed 😔', date: 'Yesterday', mood: 'Processing', color: 'text-rose-500' },
                { title: 'Setting better boundaries 💪', date: '2 days ago', mood: 'Positive', color: 'text-emerald-500' },
                { title: 'Gratitude list 🙏', date: '4 days ago', mood: 'Positive', color: 'text-emerald-500' },
              ].map((e, i) => (
                <Link key={i} href="/journal">
                  <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-all group">
                    <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-500/15 flex items-center justify-center shrink-0">
                      <BookOpen size={13} className="text-violet-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-violet-600 transition-colors truncate">{e.title}</p>
                      <p className="text-xs text-slate-400">{e.date} · <span className={e.color}>{e.mood}</span></p>
                    </div>
                    <ChevronRight size={14} className="text-slate-300 dark:text-slate-600 group-hover:text-violet-400 transition-colors shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Find Support */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-[#0f1629] rounded-2xl border border-slate-200 dark:border-white/[0.06] shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <MapPin size={16} className="text-rose-500" /> Find Nearby Support
              </h2>
              <Link href="/therapists" className="text-xs text-violet-600 dark:text-violet-400 font-semibold hover:underline flex items-center gap-1">
                Open Map <ChevronRight size={12} />
              </Link>
            </div>

            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Therapists, psychiatrists, yoga centers and crisis support lines near you.</p>

            <div className="space-y-2 mb-4">
              {[
                { name: 'iCall by TISS', type: 'Counseling', rating: 4.8, free: true },
                { name: 'Vandrevala Foundation', type: 'Crisis Helpline', rating: 4.9, free: true },
                { name: 'NIMHANS Bangalore', type: 'Psychiatry', rating: 4.9, free: false },
              ].map((r, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.04]">
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{r.name}</p>
                    <p className="text-xs text-slate-400">{r.type} · ⭐ {r.rating}</p>
                  </div>
                  {r.free && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">FREE</span>}
                </div>
              ))}
            </div>

            <Link href="/therapists" className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-violet-200 dark:border-violet-500/30 text-violet-600 dark:text-violet-400 text-sm font-semibold hover:bg-violet-50 dark:hover:bg-violet-500/10 transition-all">
              <MapPin size={14} /> Find More Near Me
            </Link>
          </motion.div>
        </div>

        {/* Safety Disclaimer */}
        <div className="mt-12 py-8 border-t border-slate-200 dark:border-white/[0.05] text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed max-w-2xl mx-auto italic">
              "MindfulAI provides mental wellness support and is not a substitute for licensed professionals. 
              If you are in a crisis, please seek immediate help from emergency services or listed helplines."
            </p>
        </div>

      </div>
    </div>
  )
}
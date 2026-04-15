'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Smile, Frown, Meh, Laugh, Cloud, Sun, CloudRain, 
  CheckCircle, TrendingUp, TrendingDown, Plus, Sparkles,
  Calendar, Activity, Wind, ChevronRight, Loader2
} from 'lucide-react'
import { useAuthStore } from '@/lib/store/auth-store'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const API_BASE = process.env.NEXT_PUBLIC_AUTH_URL || 'http://localhost:8000'

// ─── Mood Config ────────────────────────────────────────────────────────────
const MOODS = [
  { value: 1, label: 'Terrible',  emoji: '😞', color: '#ef4444', bg: 'bg-red-100 dark:bg-red-500/15',    border: 'border-red-300 dark:border-red-500/40',     ring: 'ring-red-300 dark:ring-red-500/40' },
  { value: 2, label: 'Bad',       emoji: '😔', color: '#f97316', bg: 'bg-orange-100 dark:bg-orange-500/15', border: 'border-orange-300 dark:border-orange-500/40', ring: 'ring-orange-300 dark:ring-orange-500/40' },
  { value: 3, label: 'Okay',      emoji: '😐', color: '#eab308', bg: 'bg-yellow-100 dark:bg-yellow-500/15', border: 'border-yellow-300 dark:border-yellow-500/40', ring: 'ring-yellow-300 dark:ring-yellow-500/40' },
  { value: 4, label: 'Good',      emoji: '😊', color: '#22c55e', bg: 'bg-green-100 dark:bg-green-500/15',  border: 'border-green-300 dark:border-green-500/40',   ring: 'ring-green-300 dark:ring-green-500/40' },
  { value: 5, label: 'Great',     emoji: '🤩', color: '#8b5cf6', bg: 'bg-violet-100 dark:bg-violet-500/15', border: 'border-violet-300 dark:border-violet-500/40', ring: 'ring-violet-300 dark:ring-violet-500/40' },
]

const FEELINGS = [
  'Anxious', 'Calm', 'Sad', 'Happy', 'Tired', 'Energetic',
  'Stressed', 'Grateful', 'Lonely', 'Connected', 'Focused', 'Distracted',
  'Hopeful', 'Frustrated', 'Content', 'Overwhelmed'
]

const ACTIVITIES = [
  { label: 'Exercise', emoji: '🏃' },
  { label: 'Sleep', emoji: '😴' },
  { label: 'Work', emoji: '💼' },
  { label: 'Social', emoji: '👥' },
  { label: 'Nature', emoji: '🌿' },
  { label: 'Meditation', emoji: '🧘' },
  { label: 'Food', emoji: '🥗' },
  { label: 'Reading', emoji: '📚' },
]

// ─── Mock weekly data ────────────────────────────────────────────────────────
const WEEKLY_DATA = [
  { day: 'Mon', mood: 3, label: 'Okay' },
  { day: 'Tue', mood: 4, label: 'Good' },
  { day: 'Wed', mood: 2, label: 'Bad' },
  { day: 'Thu', mood: 4, label: 'Good' },
  { day: 'Fri', mood: 5, label: 'Great' },
  { day: 'Sat', mood: 4, label: 'Good' },
  { day: 'Sun', mood: 4, label: 'Good' },
]

// ─── Chart Tooltip ──────────────────────────────────────────────────────────
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  const mood = MOODS.find(m => m.value === payload[0].value) || MOODS[2]
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 shadow-lg">
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      <p className="text-sm font-bold" style={{ color: mood.color }}>{mood.emoji} {mood.label}</p>
    </div>
  )
}

// ─── MAIN PAGE ──────────────────────────────────────────────────────────────
export default function MoodPage() {
  const { user } = useAuthStore()

  // Check-in state
  const [selectedMood, setSelectedMood] = useState<number | null>(null)
  const [selectedFeelings, setSelectedFeelings] = useState<string[]>([])
  const [selectedActivities, setSelectedActivities] = useState<string[]>([])
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [step, setStep] = useState<'mood' | 'feelings' | 'note' | 'done'>('mood')

  // Weekly data
  const avgMood = (WEEKLY_DATA.reduce((a, b) => a + b.mood, 0) / WEEKLY_DATA.length).toFixed(1)
  const todayMood = MOODS.find(m => m.value === 4)
  const trend = '+0.3 vs last week'

  const toggleFeeling = (f: string) => setSelectedFeelings(prev =>
    prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]
  )
  const toggleActivity = (a: string) => setSelectedActivities(prev =>
    prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]
  )

  const handleSave = async () => {
    if (!selectedMood) return
    setSaving(true)
    try {
      await fetch(`${API_BASE}/api/v1/mood`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          score: selectedMood,
          feelings: selectedFeelings,
          activities: selectedActivities,
          note,
          user_id: user?.id || 'guest'
        })
      })
    } catch (_) {}
    setSaving(false)
    setStep('done')
    setSaved(true)
  }

  return (
    <div className="min-h-full bg-slate-50 dark:bg-[#0a0d1a] p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* ── Header ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Mood Check-in</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-3 px-4 py-2.5 bg-white dark:bg-white/[0.04] rounded-xl border border-slate-200 dark:border-white/[0.06] shadow-sm">
            <div className="text-2xl">{todayMood?.emoji}</div>
            <div>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">7-day Avg</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">{avgMood} / 5</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Check-In Panel ── */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-[#0f1629] rounded-2xl border border-slate-200 dark:border-white/[0.06] shadow-sm overflow-hidden">

              {/* Progress bar */}
              <div className="h-1 bg-slate-100 dark:bg-white/5">
                <motion.div
                  className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full"
                  animate={{ width: step === 'mood' ? '25%' : step === 'feelings' ? '60%' : step === 'note' ? '85%' : '100%' }}
                  transition={{ duration: 0.4 }}
                />
              </div>

              <div className="p-6">
                <AnimatePresence mode="wait">

                  {/* Step 1: Mood selection */}
                  {step === 'mood' && (
                    <motion.div key="mood" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">How are you feeling right now?</h2>
                      <p className="text-sm text-slate-400 mb-6">Be honest — this is only for you.</p>

                      <div className="grid grid-cols-5 gap-3 mb-6">
                        {MOODS.map(mood => (
                          <motion.button
                            key={mood.value}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setSelectedMood(mood.value)}
                            className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all ${
                              selectedMood === mood.value
                                ? `${mood.bg} ${mood.border} ring-2 ${mood.ring} shadow-md`
                                : 'border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-white/[0.02] hover:border-slate-300 dark:hover:border-white/10'
                            }`}
                          >
                            <span className="text-3xl">{mood.emoji}</span>
                            <span className="text-[10px] font-semibold" style={{ color: selectedMood === mood.value ? mood.color : undefined }}>
                              {mood.label}
                            </span>
                          </motion.button>
                        ))}
                      </div>

                      <button
                        disabled={!selectedMood}
                        onClick={() => setStep('feelings')}
                        className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md shadow-violet-500/25 hover:brightness-110 transition-all"
                      >
                        Continue <ChevronRight size={16} />
                      </button>
                    </motion.div>
                  )}

                  {/* Step 2: Feelings & Activities */}
                  {step === 'feelings' && (
                    <motion.div key="feelings" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">What's influencing your mood?</h2>
                      <p className="text-sm text-slate-400 mb-5">Select all that apply</p>

                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Feelings</p>
                        <div className="flex flex-wrap gap-2 mb-6">
                          {FEELINGS.map(f => (
                            <button
                              key={f}
                              onClick={() => toggleFeeling(f)}
                              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                                selectedFeelings.includes(f)
                                  ? 'bg-violet-600 text-white border-violet-600 shadow-sm'
                                  : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-violet-300 dark:hover:border-violet-500/40 hover:text-violet-600 dark:hover:text-violet-300'
                              }`}
                            >
                              {f}
                            </button>
                          ))}
                        </div>

                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Activities Today</p>
                        <div className="grid grid-cols-4 gap-2 mb-6">
                          {ACTIVITIES.map(a => (
                            <button
                              key={a.label}
                              onClick={() => toggleActivity(a.label)}
                              className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border text-center transition-all ${
                                selectedActivities.includes(a.label)
                                  ? 'bg-violet-50 dark:bg-violet-500/10 border-violet-300 dark:border-violet-500/40 shadow-sm'
                                  : 'border-slate-200 dark:border-white/[0.06] hover:border-violet-200 dark:hover:border-violet-500/20'
                              }`}
                            >
                              <span className="text-xl">{a.emoji}</span>
                              <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400">{a.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button onClick={() => setStep('mood')} className="px-4 py-2.5 text-sm font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">← Back</button>
                        <button onClick={() => setStep('note')} className="flex-1 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-violet-500/25 hover:brightness-110 transition-all">
                          Continue <ChevronRight size={16} />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Note */}
                  {step === 'note' && (
                    <motion.div key="note" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">Add a note (optional)</h2>
                      <p className="text-sm text-slate-400 mb-5">What's on your mind? It'll stay private.</p>
                      <textarea
                        value={note}
                        onChange={e => setNote(e.target.value)}
                        placeholder="Write anything — a thought, a memory, or just how your day went..."
                        className="w-full h-28 p-4 text-sm rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 transition-all resize-none"
                      />
                      <div className="flex gap-3 mt-4">
                        <button onClick={() => setStep('feelings')} className="px-4 py-2.5 text-sm font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">← Back</button>
                        <button
                          onClick={handleSave}
                          disabled={saving}
                          className="flex-1 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-violet-500/25 hover:brightness-110 transition-all disabled:opacity-60"
                        >
                          {saving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                          {saving ? 'Saving...' : 'Save Check-in'}
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Done */}
                  {step === 'done' && (
                    <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                        className="text-6xl mb-4"
                      >
                        {MOODS.find(m => m.value === selectedMood)?.emoji}
                      </motion.div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Check-in saved! ✨</h2>
                      <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                        You're feeling <strong className="text-slate-700 dark:text-white">{MOODS.find(m => m.value === selectedMood)?.label}</strong> today.
                        {selectedFeelings.length > 0 && ` Feeling ${selectedFeelings.slice(0, 2).join(' & ')}.`}
                      </p>
                      <button
                        onClick={() => { setStep('mood'); setSelectedMood(null); setSelectedFeelings([]); setSelectedActivities([]); setNote(''); setSaved(false) }}
                        className="px-6 py-2.5 text-sm font-semibold text-violet-600 hover:text-violet-700 border border-violet-200 dark:border-violet-500/30 rounded-xl hover:bg-violet-50 dark:hover:bg-violet-500/10 transition-all"
                      >
                        Log Another
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* ── Right: Stats & History ── */}
          <div className="flex flex-col gap-4">

            {/* Weekly trend chart */}
            <div className="bg-white dark:bg-[#0f1629] rounded-2xl border border-slate-200 dark:border-white/[0.06] shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm text-slate-900 dark:text-white">7-Day Trend</h3>
                <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <TrendingUp size={12} /> {trend}
                </span>
              </div>
              <div className="h-28">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={WEEKLY_DATA} margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
                    <defs>
                      <linearGradient id="moodGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" vertical={false} />
                    <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis domain={[1, 5]} tick={false} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="mood"
                      stroke="#8b5cf6"
                      fill="url(#moodGrad)"
                      strokeWidth={2.5}
                      dot={{ fill: '#8b5cf6', strokeWidth: 0, r: 3 }}
                      activeDot={{ r: 5, fill: '#8b5cf6' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Stats summary */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Streak', value: '7 days', icon: Activity, color: 'text-violet-600' },
                { label: 'Best Day', value: 'Friday', icon: Sun, color: 'text-amber-500' },
                { label: 'Lowest', value: 'Wednesday', icon: CloudRain, color: 'text-blue-500' },
                { label: 'Avg Mood', value: `${avgMood}/5`, icon: Smile, color: 'text-emerald-500' },
              ].map(stat => (
                <div key={stat.label} className="bg-white dark:bg-[#0f1629] rounded-xl border border-slate-200 dark:border-white/[0.06] p-3 shadow-sm">
                  <stat.icon size={16} className={`${stat.color} mb-1.5`} />
                  <p className="text-lg font-bold text-slate-900 dark:text-white">{stat.value}</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Today's entries */}
            <div className="bg-white dark:bg-[#0f1629] rounded-2xl border border-slate-200 dark:border-white/[0.06] shadow-sm p-5">
              <h3 className="font-semibold text-sm text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <Calendar size={14} className="text-violet-500" /> Today's History
              </h3>
              {saved ? (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20">
                  <span className="text-2xl">{MOODS.find(m => m.value === selectedMood)?.emoji}</span>
                  <div>
                    <p className="text-xs font-semibold text-slate-900 dark:text-white">{MOODS.find(m => m.value === selectedMood)?.label}</p>
                    <p className="text-[10px] text-slate-400">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-400 text-center py-4">No check-ins yet today</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

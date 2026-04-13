'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Play, Clock, Wind, Zap, Brain, Shield, Heart, 
  Sparkles, RotateCcw, ChevronRight, Volume2, VolumeX, Pause
} from 'lucide-react'
import { useAuthStore } from '@/lib/store/auth-store'

// ─── Breathing Exercise Component ────────────────────────────────────────────

function BreathingOrb() {
  const [state, setState] = useState<'inhale' | 'hold' | 'exhale'>('inhale')
  
  useEffect(() => {
    let timer: NodeJS.Timeout
    const sequence = async () => {
      setState('inhale')
      await new Promise(r => setTimeout(r, 4000))
      setState('hold')
      await new Promise(r => setTimeout(r, 7000))
      setState('exhale')
      await new Promise(r => setTimeout(r, 8000))
      sequence()
    }
    sequence()
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="relative flex flex-col items-center justify-center">
      <motion.div
        animate={{
          scale: state === 'inhale' ? 1.5 : state === 'hold' ? 1.5 : 0.8,
          opacity: state === 'inhale' ? 0.8 : state === 'hold' ? 1 : 0.4,
        }}
        transition={{ duration: state === 'inhale' ? 4 : state === 'hold' ? 7 : 8, ease: "easeInOut" }}
        className="w-48 h-48 rounded-full bg-gradient-to-br from-violet-400/30 to-indigo-500/30 blur-2xl absolute"
      />
      <motion.div
        animate={{
          scale: state === 'inhale' ? 1.2 : state === 'hold' ? 1.2 : 0.9,
          borderColor: state === 'inhale' ? 'rgba(139, 92, 246, 0.5)' : state === 'hold' ? 'rgba(99, 102, 241, 0.7)' : 'rgba(148, 163, 184, 0.3)',
        }}
        transition={{ duration: state === 'inhale' ? 4 : state === 'hold' ? 7 : 8, ease: "easeInOut" }}
        className="w-56 h-56 rounded-full border-2 border-dashed flex items-center justify-center relative z-10"
      >
        <div className="text-center">
          <p className="text-2xl font-bold text-slate-900 dark:text-white capitalize tracking-tight">{state}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-widest font-bold">
            {state === 'inhale' ? '4s' : state === 'hold' ? '7s' : '8s'}
          </p>
        </div>
      </motion.div>
    </div>
  )
}

// ─── MAIN PAGE ──────────────────────────────────────────────────────────────

export default function MeditationPage() {
  const { token } = useAuthStore()
  const [strategy, setStrategy] = useState("Focus on your breath. Let thoughts pass like clouds in the sky.")
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('anxiety')
  const [isMuted, setIsMuted] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  const fetchStrategy = async (cat: string) => {
    setIsLoading(true)
    setActiveTab(cat)
    try {
      const res = await fetch(`http://localhost:8001/api/v1/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: `Give me 1 short, soothing mental wellness tip for ${cat}. Max 20 words.` })
      })
      if (res.ok) {
        const data = await res.json()
        setStrategy(data.response)
      }
    } catch {
      setStrategy("Take a deep breath and find stillness in this moment. You are doing well.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { fetchStrategy('anxiety') }, [])

  return (
    <div className="min-h-full bg-slate-50 dark:bg-[#0a0d1a] p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center justify-center gap-3">
             Take a Breath <Wind size={24} className="text-violet-500" />
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto">Guided breathing and AI coping strategies to help you find your center.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Breathing Orb Panel */}
          <div className="lg:col-span-2 bg-white dark:bg-[#0f1629] rounded-[2.5rem] border border-slate-200 dark:border-white/[0.06] shadow-sm p-8 md:p-12 flex flex-col items-center justify-center min-h-[500px] relative overflow-hidden">
            <div className="absolute top-8 left-8">
               <span className="flex items-center gap-1.5 px-3 py-1 bg-violet-100 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 rounded-full text-[10px] font-bold uppercase tracking-widest border border-violet-200 dark:border-violet-500/20">
                 <Activity size={12} /> Live Session
               </span>
            </div>
            
            <div className="absolute top-8 right-8">
               <button onClick={() => setIsMuted(!isMuted)} className="p-2 rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-violet-500 transition-colors">
                 {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
               </button>
            </div>

            <BreathingOrb />

            <div className="mt-12 text-center max-w-sm">
               <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed italic">
                 "Inhale peace, exhale tension. Let your body settle into the rhythm of the moment."
               </p>
            </div>
          </div>

          {/* Quick Sessions & AI Strategy */}
          <div className="flex flex-col gap-6">
            
            {/* Session Cards */}
            <div className="space-y-4">
               <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1">Guided Protocols</h3>
               {[
                 { title: "Box Breathing", desc: "For instant focus", duration: "4 min", icon: Zap, color: "text-amber-500", bg: "bg-amber-500/10" },
                 { title: "Sleep Inducer", desc: "Pre-sleep routine", duration: "10 min", icon: Heart, color: "text-rose-500", bg: "bg-rose-500/10" },
                 { title: "Zen Reset", desc: "Mid-day grounding", duration: "5 min", icon: Brain, color: "text-violet-500", bg: "bg-violet-500/10" },
               ].map((s, i) => (
                 <button key={i} className="group w-full flex items-center justify-between p-4 bg-white dark:bg-[#0f1629] rounded-2xl border border-slate-200 dark:border-white/[0.06] hover:border-violet-400/50 hover:shadow-md transition-all">
                    <div className="flex items-center gap-4">
                       <div className={`w-11 h-11 rounded-xl ${s.bg} flex items-center justify-center`}>
                          <s.icon size={20} className={s.color} />
                       </div>
                       <div className="text-left">
                          <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-violet-600 transition-colors">{s.title}</p>
                          <p className="text-[10px] text-slate-500">{s.desc} · {s.duration}</p>
                       </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-violet-600 group-hover:text-white transition-all">
                       <Play size={12} fill="currentColor" className="ml-0.5" />
                    </div>
                 </button>
               ))}
            </div>

            {/* AI Insight */}
            <div className="flex-1 bg-white dark:bg-[#0f1629] rounded-[2rem] border border-slate-200 dark:border-white/[0.06] shadow-sm p-6 flex flex-col">
               <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">AI Prescriptions</h3>
                  <Sparkles size={14} className="text-violet-500" />
               </div>

               <div className="flex gap-1.5 mb-5 overflow-x-auto pb-2 scrollbar-none">
                  {['anxiety', 'sadness', 'stress', 'focus'].map(c => (
                    <button 
                      key={c} 
                      onClick={() => fetchStrategy(c)}
                      className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${
                        activeTab === c 
                          ? 'bg-violet-600 border-violet-600 text-white' 
                          : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500 hover:border-violet-300'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
               </div>

               <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.04] rounded-2xl p-6 text-center italic relative">
                  {isLoading ? (
                    <div className="flex flex-col items-center gap-3">
                       <RotateCcw size={20} className="text-violet-500 animate-spin" />
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Generating Insight...</span>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-serif">
                      "{strategy}"
                    </p>
                  )}
               </div>

               <button className="w-full mt-4 p-2.5 rounded-xl border border-violet-200 dark:border-violet-500/30 text-violet-600 dark:text-violet-400 text-xs font-bold flex items-center justify-center gap-2 hover:bg-violet-50 dark:hover:bg-violet-500/10 transition-all">
                  Browse Meditation Library <ChevronRight size={12} />
               </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
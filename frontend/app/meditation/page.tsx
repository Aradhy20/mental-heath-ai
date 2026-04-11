'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import { useAuthStore } from '@/lib/store/auth-store'
import { Play, Clock, Wind, Zap, Brain, Shield, Heart, Fingerprint } from 'lucide-react'

// Dynamic import for client components
const BreathingExercise = dynamic(() => import('@/components/anti-gravity/BreathingExercise'), {
   ssr: false,
   loading: () => <div className="h-[300px] w-[300px] bg-slate-800/50 animate-pulse rounded-full" />
})

export default function MeditationPage() {
  const { token } = useAuthStore()
  const [copingCategory, setCopingCategory] = useState('general')
  const [strategy, setStrategy] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const fetchStrategy = async (category: string) => {
    setIsLoading(true)
    setCopingCategory(category)
    try {
      const authToken = token || (typeof window !== 'undefined' ? localStorage.getItem('token') : null)
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      }
      if (authToken) {
        headers.Authorization = `Bearer ${authToken}`
      }

      const prompt = `Provide practical coping strategies for ${category}. Keep the advice gentle, supportive, and suitable for a wellness app user.`
      const response = await fetch('/api/analysis/text/contextual', {
        method: 'POST',
        headers,
        body: JSON.stringify({ text: prompt, user_id: 1 })
      })

      if (response.ok) {
        const data = await response.json()
        const contextual = data?.result?.contextual_response || ''
        const recommendations = Array.isArray(data?.result?.recommendations)
          ? data.result.recommendations.join(' ')
          : ''
        setStrategy(contextual || recommendations || data?.message || 'Embrace the stillness within. Keep breathing deeply.')
      } else {
        console.error('AI strategy fetch failed:', response.statusText)
        setStrategy('Connect within. Breathe deeply and observe the present moment without judgement.')
      }
    } catch (err) {
      console.error('Failed to fetch strategy:', err)
      setStrategy('Connect within. Breathe deeply and observe the present moment without judgement.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStrategy('general')
  }, [])

  return (
    <div className="min-h-screen bg-[#030014] text-slate-200 selection:bg-cyan-500/30 flex justify-center pb-20 pt-10 px-4 md:px-6">
      
      {/* Zen Ambient Layers */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center">
        <div className="absolute w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-emerald-500/5 rounded-full blur-[120px] mix-blend-screen pulse-slow pointer-events-none"></div>
        <div className="absolute w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] bg-cyan-500/5 rounded-full blur-[100px] mix-blend-screen pulse-slow delay-1000 pointer-events-none"></div>
      </div>

      <div className="w-full max-w-[1400px] relative z-10 space-y-12">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-white/10 bg-white/5 mb-6 text-emerald-400 backdrop-blur-md shadow-[0_0_30px_rgba(52,211,153,0.2)]">
             <Fingerprint size={24} />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-sans tracking-tighter text-white mb-6 font-bold mix-blend-luminosity">
            Return to Center
          </h1>
          <p className="text-slate-400 text-lg md:text-xl font-serif italic tracking-wide">
             The mind is just a reflection. Calm the water to see the sky.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Breathing Orb (8 cols) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-8 h-full"
          >
            <div className="bg-slate-900/30 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-12 relative overflow-hidden flex flex-col items-center justify-center min-h-[600px] shadow-[0_0_80px_rgba(0,0,0,0.5)]">
              <div className="absolute top-8 left-8 flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-bold uppercase tracking-widest border border-emerald-500/20">
                  <Wind size={14} /> Somatic Guide
                </div>
              </div>
              
              <div className="relative z-10 w-full flex items-center justify-center transform scale-125">
                 <BreathingExercise />
              </div>

              <div className="absolute bottom-8 left-0 right-0 text-center">
                 <p className="text-sm text-slate-500 font-medium">Breathe in sync with the expanding halo.</p>
              </div>
            </div>
          </motion.div>

          {/* Quick Sessions (4 cols) */}
          <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.2 }}
             className="lg:col-span-4 space-y-6"
          >
            <div className="flex items-center justify-between px-2 mb-2">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Zap size={18} className="text-amber-400" /> Focus Protocols
              </h3>
              <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Library</span>
            </div>

            {[
              { title: "Neuro-clipping", desc: "Reset attention span", duration: "5 min", icon: Brain, bg: "from-orange-500/20 to-transparent", text: "text-orange-400", border: 'hover:border-orange-500/50' },
              { title: "Parasympathetic Shift", desc: "For extreme anxiety", duration: "15 min", icon: Heart, bg: "from-blue-500/20 to-transparent", text: "text-blue-400", border: 'hover:border-blue-500/50' },
              { title: "Theta Wave Entrainment", desc: "Pre-sleep routine", duration: "20 min", icon: Shield, bg: "from-indigo-500/20 to-transparent", text: "text-indigo-400", border: 'hover:border-indigo-500/50' },
            ].map((session, i) => (
              <div 
                 key={i} 
                 className={`group flex items-center justify-between bg-slate-900/60 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 cursor-pointer hover:bg-slate-800 transition-all ${session.border}`}
              >
                <div className="flex items-center gap-5">
                  <div className={`w-14 h-14 rounded-[1.25rem] bg-gradient-to-br ${session.bg} flex items-center justify-center border border-white/5`}>
                    <session.icon size={24} className={session.text} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-white mb-0.5 group-hover:text-amber-100 transition-colors">{session.title}</h4>
                    <p className="text-xs text-slate-400">{session.desc}</p>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-slate-500 tracking-widest mt-2">
                      <Clock size={12} /> {session.duration}
                    </div>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full border border-white/5 bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-black group-hover:border-white transition-all transform group-hover:scale-110">
                  <Play size={18} fill="currentColor" className="ml-1" />
                </div>
              </div>
            ))}
          </motion.div>

        </div>

        {/* AI Synthesis Section */}
        <motion.div 
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.3 }}
           className="mt-16 pt-16 border-t border-white/10 space-y-8"
        >
          <div className="text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6 px-4">
             <div>
                <h3 className="text-2xl font-bold text-white tracking-tight mb-2">Cognitive Prescriptions</h3>
                <p className="text-slate-400 text-sm">GPT-4 synthesized coping mechanisms based on clinical practices.</p>
             </div>
             
             <div className="flex flex-wrap justify-center gap-3">
                {['anxiety', 'stress', 'sadness', 'general'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => fetchStrategy(cat)}
                    className={`px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                        copingCategory === cat
                        ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 shadow-[0_0_20px_rgba(52,211,153,0.4)] border-none'
                        : 'bg-slate-900/60 border border-white/10 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
             </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={copingCategory + (isLoading ? 'loading' : 'ready')}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="bg-gradient-to-br from-slate-900/60 to-slate-950/80 backdrop-blur-2xl border border-emerald-500/10 rounded-[2.5rem] p-8 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex items-center min-h-[250px]">
                {isLoading ? (
                  <div className="w-full flex flex-col items-center justify-center gap-6 text-emerald-500">
                    <div className="relative">
                       <Brain size={48} className="relative z-10" />
                       <div className="absolute inset-0 bg-emerald-500 blur-[20px] opacity-40 animate-pulse"></div>
                    </div>
                    <p className="text-xs font-bold uppercase tracking-widest animate-pulse">Synthesizing Neuro-Protocol...</p>
                  </div>
                ) : (
                  <div className="w-full flex flex-col md:flex-row items-center gap-10">
                    <div className="w-20 h-20 shrink-0 rounded-[2rem] bg-emerald-500/10 border border-emerald-500/20 flex flex-col items-center justify-center gap-2">
                       <Shield size={24} className="text-emerald-400" />
                    </div>
                    <p className="flex-1 text-xl md:text-2xl font-serif italic text-slate-200 leading-relaxed text-center md:text-left">
                      "{strategy}"
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

      </div>
    </div>
  )
}
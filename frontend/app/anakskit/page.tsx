'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
    Shield, ShieldAlert, Sparkles, Brain, 
    ArrowRight, MessageCircle, Heart, Zap,
    AlertCircle, CheckCircle2, RefreshCcw
} from 'lucide-react'
import SerenityBreather from '@/components/wellness/SerenityBreather'
import FloatingCard from '@/components/anti-gravity/FloatingCard'

const THINKING_TRAPS = [
    { id: 'catastrophizing', name: 'Catastrophizing', desc: 'Predicting the worst possible outcome.' },
    { id: 'black-white', name: 'All-or-Nothing', desc: 'Seeing things in extremes (fail vs perfect).' },
    { id: 'mind-reading', name: 'Mind Reading', desc: 'Assuming others have negative thoughts about you.' },
    { id: 'shoulds', name: 'Should Statements', desc: 'Using rigid rules for yourself or others.' },
]

export default function AnxietyHub() {
    const [thought, setThought] = useState('')
    const [reframed, setReframed] = useState<string | null>(null)
    const [isReframing, setIsReframing] = useState(false)
    const [selectedTraps, setSelectedTraps] = useState<string[]>([])

    const handleReframe = () => {
        if (!thought) return
        setIsReframing(true)
        // Simulate AI logic for reframing
        setTimeout(() => {
            setReframed("This thought is a common cognitive distortion. While it feels real, there is no evidence yet that the worst will happen. I can handle challenges one step at a time.")
            setIsReframing(false)
        }, 1500)
    }

    const toggleTrap = (id: string) => {
        setSelectedTraps(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id])
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0a0d1a] py-12 px-4">
            <div className="max-w-6xl mx-auto space-y-12">
                
                {/* Header */}
                <header className="text-center space-y-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20 text-xs font-bold tracking-widest uppercase"
                    >
                        <Shield size={14} />
                        Anakskit: Resilience Hub
                    </motion.div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white">
                        Let's find some <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-500">calm</span> together.
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                        Anxiety is a physical signal, not a prophecy. Use these clinical tools to ground yourself and reframe your perspective.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    
                    {/* LEFT: The Reframer Tool */}
                    <div className="space-y-6">
                        <FloatingCard>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-rose-500/10 text-rose-500 rounded-xl">
                                    <Brain size={20} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Thought Reframer</h3>
                            </div>
                            <div className="space-y-6">
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                                    What's weighting on your mind right now? Write it out exactly as it feels.
                                </p>
                                <textarea
                                    value={thought}
                                    onChange={(e) => setThought(e.target.value)}
                                    placeholder="I'm afraid that if I fail this meeting, my career is over..."
                                    className="w-full h-32 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/5 outline-none focus:border-rose-500/50 focus:ring-4 focus:ring-rose-500/5 transition-all text-sm resize-none"
                                />

                                <div className="space-y-3">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Identify Distortions (Optional)</p>
                                    <div className="flex flex-wrap gap-2">
                                        {THINKING_TRAPS.map(t => (
                                            <button
                                                key={t.id}
                                                onClick={() => toggleTrap(t.id)}
                                                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${
                                                    selectedTraps.includes(t.id)
                                                        ? 'bg-rose-500 text-white border-rose-500'
                                                        : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                                                }`}
                                            >
                                                {t.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={handleReframe}
                                    disabled={!thought || isReframing}
                                    className="w-full py-4 bg-gradient-to-r from-rose-600 to-orange-600 text-white rounded-2xl font-bold shadow-lg shadow-rose-500/20 hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                                >
                                    {isReframing ? <RefreshCcw className="animate-spin" size={18} /> : <><Sparkles size={18} /> Reframe with MindfulAI</>}
                                </button>
                            </div>
                        </FloatingCard>

                        <AnimatePresence>
                            {reframed && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="p-6 rounded-[2rem] bg-emerald-500/10 border border-emerald-500/20"
                                >
                                    <div className="flex items-center gap-2 mb-3 text-emerald-500">
                                        <CheckCircle2 size={18} />
                                        <span className="text-xs font-bold uppercase tracking-widest">Balanced Perspective</span>
                                    </div>
                                    <p className="text-sm text-emerald-900 dark:text-emerald-100 leading-relaxed italic">
                                        "{reframed}"
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* RIGHT: Immediate Grounding */}
                    <div className="space-y-6">
                        <SerenityBreather />

                        <div className="p-6 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 shadow-xl">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500">
                                    <Zap size={18} />
                                </div>
                                <h4 className="font-bold text-slate-800 dark:text-white text-sm">The 5-4-3-2-1 Grounding</h4>
                            </div>
                            <div className="grid grid-cols-5 gap-2">
                                {[5,4,3,2,1].map(num => (
                                    <div key={num} className="aspect-square rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center font-black text-xl text-slate-300 dark:text-slate-700">
                                        {num}
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-4 py-3 rounded-xl border border-indigo-500/30 text-indigo-500 text-xs font-bold hover:bg-indigo-500/10 transition-all">
                                Start Grounding Session
                            </button>
                        </div>
                    </div>

                </div>

                {/* Footer Resources */}
                <footer className="pt-12 border-t border-slate-200 dark:border-white/5 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-white/5">
                        <ShieldAlert className="text-rose-500" />
                        <div>
                            <p className="text-xs font-bold text-slate-800 dark:text-white uppercase">Crisis Support</p>
                            <p className="text-[10px] text-slate-400">Call 988 for immediate help</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-white/5">
                        <MessageCircle className="text-violet-500" />
                        <div>
                            <p className="text-xs font-bold text-slate-800 dark:text-white uppercase">Talk to AI</p>
                            <p className="text-[10px] text-slate-400">Open MindfulAI Chat</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-white/5">
                        <Heart className="text-emerald-500" />
                        <div>
                            <p className="text-xs font-bold text-slate-800 dark:text-white uppercase">Daily Check-in</p>
                            <p className="text-[10px] text-slate-400">Track your progress</p>
                        </div>
                    </div>
                </footer>

            </div>
        </div>
    )
}

'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wind, Play, Pause, RotateCcw, ChevronDown } from 'lucide-react'

// ── Breathing Patterns ──────────────────────────────────────────────────────
const PATTERNS = {
    box:    { name: 'Box Breathing',  inhale: 4, hold1: 4, exhale: 4, hold2: 4, desc: 'Great for instant stress reduction.' },
    calm:   { name: '4-7-8 Relax',    inhale: 4, hold1: 7, exhale: 8, hold2: 0, desc: 'Natural tranquilizer for the nervous system.' },
    equal:  { name: 'Equal Breath',   inhale: 5, hold1: 0, exhale: 5, hold2: 0, desc: 'Balances the mind and body.' },
}

type PatternKey = keyof typeof PATTERNS

export default function SerenityBreather() {
    const [isActive, setIsActive] = useState(false)
    const [pattern, setPattern] = useState<PatternKey>('box')
    const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Pause'>('Pause')
    const [count, setCount] = useState(0)

    const currentPattern = PATTERNS[pattern]

    useEffect(() => {
        let timer: NodeJS.Timeout
        if (isActive) {
            timer = setInterval(() => {
                setCount(prev => prev + 1)
            }, 1000)
        }
        return () => clearInterval(timer)
    }, [isActive])

    useEffect(() => {
        if (!isActive) {
            setPhase('Pause')
            setCount(0)
            return
        }

        const { inhale, hold1, exhale, hold2 } = currentPattern

        if (phase === 'Pause' || phase === 'Exhale' && count >= exhale && hold2 === 0) {
           setPhase('Inhale')
           setCount(0)
        } else if (phase === 'Inhale' && count >= inhale) {
           setPhase(hold1 > 0 ? 'Hold' : 'Exhale')
           setCount(0)
        } else if (phase === 'Hold' && count >= hold1) {
           setPhase('Exhale')
           setCount(0)
        } else if (phase === 'Exhale' && count >= exhale) {
           if (hold2 > 0) {
               setPhase('Hold') // Second hold in box breathing
           } else {
               setPhase('Inhale')
           }
           setCount(0)
        }
    }, [count, isActive, phase, currentPattern])

    const toggle = () => setIsActive(!isActive)
    const reset = () => { setIsActive(false); setPhase('Pause'); setCount(0); }

    return (
        <div className="flex flex-col items-center justify-center p-8 rounded-[2.5rem] bg-white/5 dark:bg-slate-900/50 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden relative">
            
            {/* Background Glow */}
            <div className={`absolute inset-0 bg-gradient-to-br from-violet-500/10 to-emerald-500/10 transition-opacity duration-1000 ${isActive ? 'opacity-100' : 'opacity-0'}`} />

            <div className="relative z-10 text-center space-y-8">
                <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center justify-center gap-2">
                        <Wind className={isActive ? 'animate-pulse text-emerald-400' : 'text-slate-400'} size={24} />
                        Serenity Breather
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">{currentPattern.desc}</p>
                </div>

                {/* Main Animation Circle */}
                <div className="relative w-64 h-64 flex items-center justify-center">
                    {/* Pulsing Outer Ring */}
                    <AnimatePresence>
                        {isActive && (
                            <motion.div
                                className="absolute inset-0 rounded-full border-2 border-emerald-500/20"
                                animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            />
                        )}
                    </AnimatePresence>

                    {/* The Breathing Circle */}
                    <motion.div
                        className="w-48 h-48 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 shadow-[0_0_50px_rgba(52,211,153,0.3)] flex flex-col items-center justify-center text-white"
                        animate={{ 
                            scale: phase === 'Inhale' ? 1.4 : phase === 'Exhale' ? 1 : 1.4 
                        }}
                        transition={{ duration: phase === 'Inhale' ? currentPattern.inhale : currentPattern.exhale, ease: "easeInOut" }}
                    >
                        <span className="text-sm font-bold uppercase tracking-widest opacity-80">{isActive ? phase : 'Ready?'}</span>
                        <span className="text-5xl font-black">{isActive ? (count === 0 ? 1 : count) : '0'}</span>
                    </motion.div>
                </div>

                {/* Controls */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-center gap-4">
                        <button
                            onClick={toggle}
                            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-lg ${
                                isActive 
                                    ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' 
                                    : 'bg-emerald-500 text-white hover:bg-emerald-600 hover:scale-105 active:scale-95'
                            }`}
                        >
                            {isActive ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
                        </button>
                        <button
                            onClick={reset}
                            className="w-14 h-14 rounded-2xl bg-white/10 text-slate-400 hover:bg-white/20 hover:text-white transition-all"
                        >
                            <RotateCcw size={20} />
                        </button>
                    </div>

                    <div className="flex gap-2">
                        {(Object.keys(PATTERNS) as PatternKey[]).map(k => (
                            <button
                                key={k}
                                onClick={() => { setPattern(k); reset(); }}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                                    pattern === k 
                                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                                        : 'bg-transparent text-slate-500 border-slate-200 dark:border-white/5 hover:border-emerald-500/30'
                                }`}
                            >
                                {PATTERNS[k].name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

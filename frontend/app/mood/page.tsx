'use client'

import React from 'react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { TrendingUp, Calendar as LucideCalendar, Activity, Sparkles, BrainCircuit } from 'lucide-react'

// Dynamic imports for productivity
const AnimatedCalendar = dynamic(() => import('@/components/anti-gravity/AnimatedCalendar'), {
    ssr: false,
    loading: () => <div className="h-[300px] w-full bg-slate-800/50 animate-pulse rounded-[2rem]" />
})
const MoodWheel = dynamic(() => import('@/components/anti-gravity/MoodWheel'), {
    ssr: false,
    loading: () => <div className="h-[200px] w-[200px] mx-auto bg-slate-800/50 animate-pulse rounded-full" />
})

export default function MoodPage() {
    return (
        <div className="min-h-screen bg-[#030014] text-slate-200 selection:bg-cyan-500/30 flex justify-center pb-20 pt-6 px-4 md:px-6">
            
            {/* Ambient Background Layers */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[10%] -left-[10%] w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.1),transparent_70%)] blur-[80px] pointer-events-none"></div>
                <div className="absolute top-[40%] right-[0%] w-[500px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.1),transparent_70%)] blur-[100px] pointer-events-none mix-blend-screen opacity-50"></div>
            </div>

            <div className="w-full max-w-[1600px] relative z-10 space-y-8">
                
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                    <div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-violet-500/10 border border-violet-500/20 w-fit rounded-full mb-4">
                            <Sparkles className="text-violet-400" size={14} />
                            <span className="text-xs uppercase font-bold tracking-widest text-violet-300">Your Vibe Check</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold font-sans tracking-tight text-white mb-2">How Are You Feeling? 💭</h1>
                        <p className="text-slate-400 text-lg">Track your mood and see how it changes over time.</p>
                    </div>

                    <div className="flex items-center bg-slate-900/50 border border-white/5 backdrop-blur-md rounded-2xl p-4 gap-4 pr-8">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-500 flex items-center justify-center text-white shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                            <Sparkles size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Right now you're feeling</p>
                            <p className="text-lg font-bold text-white tracking-tight">Pretty Balanced ✨</p>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Calendar Section (Span 8) */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-8 flex flex-col bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-[2rem] overflow-hidden relative shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                    >
                        <div className="p-8 border-b border-white/5 flex items-center justify-between relative z-10 shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center">
                                    <LucideCalendar className="text-cyan-400" size={18} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">Temporal Overview</h2>
                                    <p className="text-xs text-slate-500">A heat-map of your affective resonance</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-8 flex-1 relative z-10">
                            <AnimatedCalendar />
                        </div>
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(6,182,212,0.05),transparent_50%)] pointer-events-none"></div>
                    </motion.div>

                    {/* Stats & Quick Log (Span 4) */}
                    <div className="lg:col-span-4 flex flex-col gap-8">
                        
                        {/* Wheel Module */}
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-gradient-to-br from-slate-900/60 to-slate-950 border border-white/10 rounded-[2rem] backdrop-blur-xl p-8 relative overflow-hidden flex flex-col items-center"
                        >
                            <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 blur-[50px] pointer-events-none"></div>
                            
                            <div className="w-full text-center mb-6 z-10">
                                <h3 className="text-lg font-bold text-white">Affect Circumplex</h3>
                                <p className="text-xs text-slate-400">Map your immediate state</p>
                            </div>
                            
                            <div className="h-48 flex items-center justify-center -ml-2 scale-[1.15] z-10">
                                <MoodWheel />
                            </div>
                        </motion.div>

                        {/* Trend Module */}
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex-1 bg-slate-900/40 border border-white/10 rounded-[2rem] backdrop-blur-xl p-8 relative overflow-hidden flex flex-col justify-between"
                        >
                            <div className="flex items-center justify-between mb-8 z-10">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <TrendingUp className="text-green-400" size={16} />
                                        <h3 className="font-bold text-white">Velocity Trend</h3>
                                    </div>
                                    <p className="text-xs text-slate-400">Past 7 days trajectory</p>
                                </div>
                                <div className="text-green-400 text-xs font-bold px-2 py-1 bg-green-500/10 rounded-lg border border-green-500/20">
                                    +12% Base
                                </div>
                            </div>
                            
                            <div className="flex-1 min-h-[140px] flex items-end gap-2 z-10">
                                {[40, 60, 45, 70, 85, 65, 80].map((h, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-3">
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: `${h}%` }}
                                            transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
                                            className="w-full bg-gradient-to-t from-cyan-500/20 to-blue-500/60 rounded-lg relative group transition-colors"
                                        >
                                            <div className="absolute inset-x-0 bottom-0 py-1 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-500/20 rounded-md ring-1 ring-blue-400/50"></div>
                                        </motion.div>
                                        <span className="text-[10px] text-slate-500 font-medium uppercase">
                                            {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i]}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-[40px] pointer-events-none"></div>
                        </motion.div>

                    </div>
                </div>
            </div>
        </div>
    )
}

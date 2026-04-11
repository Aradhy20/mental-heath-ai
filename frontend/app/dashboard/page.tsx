'use client'

import React, { useState, useEffect } from 'react'
import { motion, useSpring, useTransform, animate } from 'framer-motion'
import { Activity, Smile, Book, Wind, Target, Brain, TrendingUp, Sparkles, AlertCircle, ArrowUpRight, BarChart3, Plus, Zap } from 'lucide-react'
import { useAuthStore } from '@/lib/store/auth-store'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts'
import * as Tabs from '@radix-ui/react-tabs'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

// ─── Component: Animated Number ──────────────────────────────────────────────
function AnimatedNumber({ value }: { value: string }) {
  const [displayValue, setDisplayValue] = useState(0)
  const isPercent = value.includes('%')
  const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''))

  useEffect(() => {
    const controls = animate(0, numericValue, {
      duration: 2,
      ease: [0.16, 1, 0.3, 1], // premium ease
      onUpdate(value) {
        setDisplayValue(value)
      },
    })
    return () => controls.stop()
  }, [numericValue])

  return (
    <span>
      {isPercent ? `${displayValue.toFixed(0)}%` : displayValue.toFixed(2)}
    </span>
  )
}

// ─── Component: Wellness Score Ring ──────────────────────────────────────────
function WellnessRing({ score }: { score: number }) {
  const radius = 70
  const stroke = 12
  const normalizedRadius = radius - stroke * 2
  const circumference = normalizedRadius * 2 * Math.PI
  const strokeDashoffset = circumference - (score / 100) * circumference

  return (
    <div className="relative flex items-center justify-center">
      <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
        <circle
          stroke="rgba(255,255,255,0.05)"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <motion.circle
          stroke="url(#gradient)"
          fill="transparent"
          strokeDasharray={circumference + ' ' + circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 2, ease: "easeOut" }}
          strokeWidth={stroke}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="text-4xl font-black text-white"
        >
          {score}
        </motion.span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Stability</span>
      </div>
    </div>
  )
}

// Heavy mock data for Recharts testing
const timelineData = [
  { time: 'Mon', text: 30, voice: 40, face: 45 },
  { time: 'Tue', text: 40, voice: 35, face: 50 },
  { time: 'Wed', text: 25, voice: 20, face: 30 },
  { time: 'Thu', text: 60, voice: 55, face: 65 },
  { time: 'Fri', text: 45, voice: 50, face: 40 },
  { time: 'Sat', text: 20, voice: 15, face: 25 },
  { time: 'Sun', text: 35, voice: 30, face: 35 },
];

export default function EnterpriseDashboard() {
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState("overview")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null;

  return (
    <div className="p-8 max-w-[1600px] w-full mx-auto space-y-8">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
         <div>
            <h1 className="text-4xl font-black tracking-tight text-white flex items-center gap-3">
               <span>Hey {user?.username?.split(' ')[0] || 'there'} 👋</span>
            </h1>
            <p className="text-slate-400 mt-1 font-medium">Your week in preview: <span className="text-violet-400">Deep clarity active.</span></p>
         </div>
         <div className="flex items-center gap-3">
             <button className="px-5 py-2.5 bg-slate-900 border border-white/5 rounded-xl text-sm text-slate-300 font-bold hover:bg-slate-800 transition shadow-lg">
                 Share Logs
             </button>
             <button className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 rounded-xl text-sm font-black text-white flex items-center gap-2 transition shadow-xl shadow-violet-500/20 active:scale-95">
                 <Zap size={16} fill="currentColor" /> Refresh Core Engine
             </button>
         </div>
      </div>

      <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
         <Tabs.List className="flex gap-8 border-b border-white/5 mb-8">
            <Tabs.Trigger value="overview" className={`pb-4 text-xs font-black uppercase tracking-[0.2em] transition-all border-b-2 ${activeTab === 'overview' ? 'border-violet-400 text-violet-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>
                System Pulse
            </Tabs.Trigger>
            <Tabs.Trigger value="modalities" className={`pb-4 text-xs font-black uppercase tracking-[0.2em] transition-all border-b-2 ${activeTab === 'modalities' ? 'border-violet-400 text-violet-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>
                Neural Mapping
            </Tabs.Trigger>
         </Tabs.List>

         <Tabs.Content value="overview" className="space-y-6">
            
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                
                {/* ─── Wellness Score Ring Card ─── */}
                <motion.div 
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="bg-slate-900/50 border border-white/5 rounded-[2rem] p-8 shadow-2xl backdrop-blur-xl flex flex-col items-center justify-center col-span-1"
                >
                    <WellnessRing score={82} />
                    <div className="mt-6 text-center">
                        <p className="text-slate-300 font-bold">Mind Fusion Level</p>
                        <p className="text-xs text-slate-500 mt-1">Excellent stability across all inputs.</p>
                    </div>
                </motion.div>

                {/* ─── Stats Grid ─── */}
                <div className="xl:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        { label: "Global Stress Index", value: "0.24", diff: "-12%", bad: false, i: Target, color: "text-rose-400" },
                        { label: "Vocal Complexity", value: "0.45", diff: "+4%", bad: true, i: Activity, color: "text-cyan-400" },
                        { label: "Affect Intensity", value: "0.19", diff: "-5%", bad: false, i: Smile, color: "text-amber-400" },
                        { label: "Cognitive Load", value: "0.33", diff: "-2%", bad: false, i: Brain, color: "text-violet-400" },
                        { label: "System Uptime", value: "99%", diff: "Stable", bad: false, i: Sparkles, color: "text-emerald-400" },
                        { label: "Sleep Quality", value: "72%", diff: "+8%", bad: false, i: Wind, color: "text-blue-400" },
                    ].map((stat, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-slate-900/30 border border-white/5 rounded-2xl p-6 shadow-xl hover:border-white/10 transition-colors group"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">{stat.label}</span>
                                <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
                                    <stat.i size={18} />
                                </div>
                            </div>
                            <div className="flex items-end gap-3">
                                <span className="text-4xl font-black text-white">
                                    <AnimatedNumber value={stat.value} />
                                </span>
                                {stat.diff !== "Stable" && (
                                    <span className={`text-[10px] font-black px-2 py-1 rounded-lg flex items-center gap-1 ${stat.bad ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                                        {stat.bad ? <TrendingUp size={10}/> : <ArrowUpRight size={10} className="rotate-90"/>}
                                        {stat.diff}
                                    </span>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Main Area Chart */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-2 bg-slate-900/40 border border-white/5 rounded-[2rem] p-8 shadow-2xl h-[450px] flex flex-col"
                >
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                           <h3 className="text-xl font-black text-white">Neural Synchrony</h3>
                           <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-bold">Aggregated Stress Telemetry</p>
                        </div>
                        <div className="flex gap-2">
                           <button className="px-4 py-1.5 bg-white/5 border border-white/5 rounded-full text-[10px] font-black uppercase text-slate-400 hover:text-white transition-colors">Daily</button>
                           <button className="px-4 py-1.5 bg-violet-600 rounded-full text-[10px] font-black uppercase text-white shadow-lg shadow-violet-500/20">Weekly</button>
                        </div>
                    </div>
                    <div className="flex-1 w-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                           <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                             <defs>
                                <linearGradient id="colorText" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorFace" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                                </linearGradient>
                             </defs>
                             <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                             <XAxis dataKey="time" stroke="#ffffff20" fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} />
                             <YAxis stroke="#ffffff20" fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} />
                             <Tooltip 
                                contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', backdropFilter: 'blur(10px)' }}
                                itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                             />
                             <Legend iconType="circle" />
                             <Area type="monotone" dataKey="text" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorText)" strokeWidth={4} name="Linguistic Insight" />
                             <Area type="monotone" dataKey="face" stroke="#06b6d4" fillOpacity={1} fill="url(#colorFace)" strokeWidth={4} name="Facial Geometry" />
                           </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Right Panel Alert Board */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-slate-900 border border-white/5 rounded-[2rem] p-8 shadow-2xl flex flex-col h-[450px]"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="bg-amber-500/10 p-2 rounded-lg"><AlertCircle size={20} className="text-amber-500" /></div>
                            <h3 className="text-xl font-black text-white">Insight Log</h3>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-2">
                        {[
                            { title: "Anomaly Detected", time: "12m ago", desc: "Slight tremor picked up in voice frequency. Rest is advised.", type: "warning", color: "bg-amber-500" },
                            { title: "Peak Resilience", time: "2h ago", desc: "Your cognitive load capacity is at an all-time high today.", type: "success", color: "bg-emerald-500" },
                            { title: "Routine Check", time: "1d ago", desc: "Morning meditation sequence completed perfectly.", type: "info", color: "bg-blue-500" },
                        ].map((alert, i) => (
                            <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-sm text-white group-hover:text-violet-400 transition-colors">{alert.title}</h4>
                                    <span className="text-[10px] font-bold text-slate-500">{alert.time}</span>
                                </div>
                                <p className="text-xs text-slate-400 leading-relaxed">{alert.desc}</p>
                            </div>
                        ))}
                    </div>
                    
                    <button className="mt-8 w-full py-4 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-white/10 hover:text-white transition-all">
                        View Full History
                    </button>
                </motion.div>
            </div>
         </Tabs.Content>

         <Tabs.Content value="modalities" className="h-[600px] flex items-center justify-center">
             <div className="text-center">
                 <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                    <FlaskConical size={32} className="text-slate-600" />
                 </div>
                 <h3 className="text-xl font-bold text-white mb-2">Neural Workspace Locked</h3>
                 <p className="text-slate-500 max-w-sm mx-auto">We are currently calibrating your modal baseline. Detailed raw telemetry will appear here after 3 more sessions.</p>
             </div>
         </Tabs.Content>
      </Tabs.Root>

    </div>
  )
}

function FlaskConical({ size, className }: { size: number, className: string }) {
  return <Sparkles size={size} className={className} />
}
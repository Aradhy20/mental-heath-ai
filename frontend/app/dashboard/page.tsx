'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Activity, Smile, Book, Wind, Target, TrendingUp, Sparkles, AlertCircle, ArrowUpRight, BarChart3, Plus } from 'lucide-react'
import { useAuthStore } from '@/lib/store/auth-store'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts'
import * as Tabs from '@radix-ui/react-tabs'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

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
            <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
               <span>Hey {user?.username?.split(' ')[0] || 'there'} 👋</span>
            </h1>
            <p className="text-slate-400 mt-1">Here's how your mind has been doing this week.</p>
         </div>
         <div className="flex items-center gap-3">
             <button className="px-4 py-2 bg-slate-800 border border-white/10 rounded-lg text-sm text-slate-300 font-medium hover:bg-slate-700 transition">
                 Share My Progress
             </button>
             <button className="px-4 py-2 bg-violet-600 hover:bg-violet-500 rounded-lg text-sm font-medium text-white flex items-center gap-2 transition shadow-[0_0_15px_rgba(139,92,246,0.4)]">
                 <Plus size={16} /> Log a Session
             </button>
         </div>
      </div>

      <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
         <Tabs.List className="flex gap-6 border-b border-white/10 mb-6">
            <Tabs.Trigger value="overview" className={`pb-3 text-sm font-medium uppercase tracking-wider transition-all border-b-2 ${activeTab === 'overview' ? 'border-violet-400 text-violet-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>
                My Week
            </Tabs.Trigger>
            <Tabs.Trigger value="modalities" className={`pb-3 text-sm font-medium uppercase tracking-wider transition-all border-b-2 ${activeTab === 'modalities' ? 'border-violet-400 text-violet-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>
                Mind Breakdown
            </Tabs.Trigger>
         </Tabs.List>

         <Tabs.Content value="overview" className="space-y-6 animate-in fade-in duration-500">
            {/* KPI Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Global Fusion Score", value: "0.24", diff: "-12%", bad: false, i: Target },
                    { label: "Vocal Tension", value: "0.45", diff: "+4%", bad: true, i: Activity },
                    { label: "Facial Affect", value: "0.19", diff: "-5%", bad: false, i: Smile },
                    { label: "Cognitive Load", value: "0.33", diff: "-2%", bad: false, i: Brain },
                ].map((stat, idx) => (
                    <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-slate-900 border border-white/5 rounded-xl p-5 shadow-lg relative overflow-hidden"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-slate-400 font-medium text-sm">{stat.label}</span>
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-500">
                                <stat.i size={16} />
                            </div>
                        </div>
                        <div className="flex items-end gap-3">
                            <span className="text-3xl font-bold text-white">{stat.value}</span>
                            <span className={`text-xs font-bold px-1.5 py-0.5 rounded flex items-center gap-1 ${stat.bad ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                                {stat.bad ? <TrendingUp size={12}/> : <ArrowUpRight size={12} className="rotate-90"/>}
                                {stat.diff}
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Dense Chart Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Main Area Chart */}
                <div className="lg:col-span-2 bg-slate-900 border border-white/5 rounded-xl p-6 shadow-lg h-[400px] flex flex-col">
                    <div className="mb-6 flex items-center justify-between">
                        <h3 className="font-semibold text-white">Tri-Modal Stress Variance</h3>
                        <DropdownMenu.Root>
                           <DropdownMenu.Trigger className="text-xs font-medium text-slate-400 hover:text-white px-3 py-1.5 bg-white/5 rounded-md flex items-center gap-2">
                              7 Days <TrendingUp size={12} />
                           </DropdownMenu.Trigger>
                        </DropdownMenu.Root>
                    </div>
                    <div className="flex-1 w-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                           <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                             <defs>
                                <linearGradient id="colorText" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorFace" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                                </linearGradient>
                             </defs>
                             <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                             <XAxis dataKey="time" stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                             <YAxis stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                             <Tooltip 
                                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                                itemStyle={{ color: '#e2e8f0' }}
                             />
                             <Legend iconType="circle" />
                             <Area type="monotone" dataKey="text" stroke="#ec4899" fillOpacity={1} fill="url(#colorText)" strokeWidth={2} name="Text Analysis" />
                             <Area type="monotone" dataKey="face" stroke="#06b6d4" fillOpacity={1} fill="url(#colorFace)" strokeWidth={2} name="Face Analysis" />
                           </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Right Panel Urgent Alerts */}
                <div className="bg-slate-900 border border-white/5 rounded-xl p-6 shadow-lg flex flex-col h-[400px]">
                    <div className="flex items-center gap-2 mb-6 text-amber-500">
                        <AlertCircle size={18} />
                        <h3 className="font-semibold text-white">Actionable Insights</h3>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-2">
                        {[
                            { title: "Vocal Stress Spike", time: "2 hours ago", desc: "Your speech cadence indicated high tension during the latest chat.", type: "warning" },
                            { title: "Cognitive Consistency", time: "1 day ago", desc: "Text analysis shows sustained improvement in positive sentiment mapping.", type: "success" },
                            { title: "Sleep Deficit Pattern", time: "2 days ago", desc: "Facial exhaustion markers elevated by 14%.", type: "warning" },
                        ].map((alert, i) => (
                            <div key={i} className={`p-4 rounded-xl border ${alert.type === 'warning' ? 'bg-amber-500/5 border-amber-500/20' : 'bg-green-500/5 border-green-500/20'}`}>
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className={`text-sm font-semibold ${alert.type === 'warning' ? 'text-amber-400' : 'text-green-400'}`}>{alert.title}</h4>
                                    <span className="text-[10px] text-slate-500">{alert.time}</span>
                                </div>
                                <p className="text-xs text-slate-400 leading-relaxed">{alert.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
         </Tabs.Content>

         <Tabs.Content value="modalities" className="animate-in fade-in duration-500 h-96 flex items-center justify-center border border-white/5 rounded-xl bg-slate-900 shadow-xl">
             <div className="text-slate-500flex flex-col items-center">
                 <BarChart3 size={32} className="mb-4 text-slate-700" />
                 <p className="text-slate-500 text-sm font-medium">Detailed Modality Data Views Coming Soon.</p>
             </div>
         </Tabs.Content>
      </Tabs.Root>

    </div>
  )
}
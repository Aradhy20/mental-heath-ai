'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Smile, 
  TrendingUp, 
  MessageSquare, 
  Activity,
  Plus,
  Brain,
  Sparkles,
  Target,
  ShieldCheck,
  LayoutDashboard
} from 'lucide-react'
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts'
import { INSIGHTS_DATA, DASHBOARD_STATS } from '@/lib/static-data'
import { wellnessAPI, insightsAPI } from '@/lib/api'

const DashboardStatCard = ({ title, value, sub, icon: Icon, color, delay, trend }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="p-8 bg-card rounded-3xl border border-border shadow-sm hover:shadow-md transition-all group"
  >
    <div className="flex justify-between items-start mb-6">
      <div className={`p-4 rounded-2xl ${color} bg-opacity-10`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      {trend && (
        <span className="text-xs font-bold text-emerald-500 flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-lg">
          <TrendingUp size={12} /> {trend}
        </span>
      )}
    </div>
    
    <h3 className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-1">{title}</h3>
    <div className="flex items-baseline gap-2">
      <span className="text-3xl font-black text-foreground tracking-tight">{value}</span>
      <span className="text-sm font-bold text-muted-foreground">{sub}</span>
    </div>
  </motion.div>
)

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(DASHBOARD_STATS)
  const [insights, setInsights] = useState<any>(INSIGHTS_DATA)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [sData, iData] = await Promise.all([
           wellnessAPI.dashboard(),
           insightsAPI.get()
        ])
        setStats(sData)
        setInsights(iData)
      } catch (err) {
        console.error("Dashboard fetch failed, using fallback.", err)
      } finally {
        setLoading(false)
      }
    }
    setTimeout(fetchData, 600)
  }, [])


  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
         <motion.div 
           animate={{ scale: [1, 1.1, 1] }} 
           transition={{ duration: 2, repeat: Infinity }}
           className="p-6 bg-primary/10 rounded-3xl border border-primary/20"
         >
            <Brain className="text-primary w-10 h-10" />
         </motion.div>
         <p className="text-sm font-bold text-primary animate-pulse">Syncing your neural profile...</p>
      </div>
    )
  }

  const moodData = (insights?.mood_history ?? []).map((h: any) => ({
    day: new Date(h.date).toLocaleDateString('en-US', { weekday: 'short' }),
    score: h.score
  }))

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-4xl font-black tracking-tight text-foreground mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-muted-foreground font-medium">
            Your emotional wellness is looking <span className="text-primary font-bold">improving today.</span>
          </p>
        </motion.div>
        
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all"
        >
          <Plus size={20} /> New Check-in
        </motion.button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <DashboardStatCard 
          title="Average Mood"
          value={`${insights?.weekly_summary?.avg_mood ?? '-'}`}
          sub="/ 5.0"
          trend="+12%"
          icon={Smile}
          color="text-primary"
          delay={0}
        />
        <DashboardStatCard 
          title="Wellness Score"
          value={stats.wellness_score}
          sub="Stable"
          trend="-5%"
          icon={Brain}
          color="text-indigo-400"
          delay={0.1}
        />
        <DashboardStatCard 
          title="Dominant Emotion"
          value={insights?.weekly_summary?.dominant_emotion ?? '-'}
          sub="Calm"
          icon={Activity}
          color="text-teal-400"
          delay={0.2}
        />
        <DashboardStatCard 
          title="Chat Sessions"
          value={stats.active_sessions}
          sub="Today"
          trend="+3"
          icon={MessageSquare}
          color="text-orange-400"
          delay={0.3}
        />
      </div>

      {/* Analytics & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-8 p-10 bg-card rounded-[2.5rem] border border-border shadow-sm"
        >
          <div className="flex items-center justify-between mb-10">
             <h3 className="text-xl font-bold text-foreground tracking-tight">Emotional Journey</h3>
             <div className="flex bg-muted p-1 rounded-xl">
               {['Week', 'Month'].map((t) => (
                 <button key={t} className={`px-5 py-2 text-xs font-bold rounded-lg transition-all ${t === 'Week' ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground'}`}>
                   {t}
                 </button>
               ))}
             </div>
          </div>
          
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={moodData}>
                <defs>
                  <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A78BFA" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#A78BFA" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#9CA3AF', fontSize: 12, fontWeight: 600}} 
                  dy={15}
                />
                <YAxis hide domain={[0, 6]} />
                <Tooltip 
                  contentStyle={{
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 30px rgba(0,0,0,0.05)', 
                    padding: '15px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#A78BFA" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#moodGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Sidebar Cards */}
        <div className="lg:col-span-4 space-y-10">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="p-8 bg-primary rounded-[2.5rem] text-white shadow-xl shadow-primary/20 relative overflow-hidden"
          >
            <Sparkles className="absolute top-6 right-6 text-white/20 w-12 h-12" />
            <div className="flex items-center gap-3 mb-6">
              <Target size={20} className="text-white/80" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Insight of the Day</span>
            </div>
            <p className="text-lg font-bold leading-relaxed mb-6">
              "Your linguistic patterns suggest a significant shift toward resilience."
            </p>
            <button className="text-sm font-bold text-white/80 hover:text-white transition-colors flex items-center gap-2">
              View details <Plus size={14} />
            </button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="p-8 bg-card rounded-[2.5rem] border border-border shadow-sm"
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-foreground">Risk Assessment</h3>
              <ShieldCheck size={20} className="text-emerald-500" />
            </div>
            
            <div className="space-y-6">
              <div className="w-full bg-muted h-3 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[20%] transition-all duration-1000" />
              </div>
              <p className="text-xs font-medium text-muted-foreground leading-relaxed">
                All biometric signals are within nominal safety thresholds. Encryption active.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

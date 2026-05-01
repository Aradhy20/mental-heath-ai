"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { 
  Smile, 
  Frown, 
  TrendingUp, 
  Calendar, 
  Clock, 
  MessageSquare, 
  Activity,
  Plus,
  ArrowUpRight,
  Brain
} from 'lucide-react'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts'

const moodData = [
  { day: 'Mon', score: 3 },
  { day: 'Tue', score: 4 },
  { day: 'Wed', score: 2 },
  { day: 'Thu', score: 5 },
  { day: 'Fri', score: 4 },
  { day: 'Sat', score: 4 },
  { day: 'Sun', score: 5 },
]

const StatCard = ({ title, value, sub, icon: Icon, color }: any) => (
  <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl ${color} bg-opacity-10`}>
        <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
      </div>
      <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">LAST 7 DAYS</span>
    </div>
    <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
    <div className="flex items-baseline gap-2">
      <span className="text-2xl font-bold text-slate-900">{value}</span>
      <span className="text-xs font-bold text-emerald-500">{sub}</span>
    </div>
  </div>
)

export default function DashboardPage() {
  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome back, Alex! 👋</h1>
          <p className="text-slate-500 font-medium">Your emotional wellness is looking stable today.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
          <Plus className="w-5 h-5" /> New Check-in
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Average Mood"
          value="4.2 / 5"
          sub="+12%"
          icon={Smile}
          color="bg-emerald-500"
        />
        <StatCard 
          title="Stress Level"
          value="Low"
          sub="-5%"
          icon={Brain}
          color="bg-indigo-500"
        />
        <StatCard 
          title="Sleep Quality"
          value="7.5 hrs"
          sub="+0.8"
          icon={Clock}
          color="bg-blue-500"
        />
        <StatCard 
          title="Chat Sessions"
          value="12"
          sub="+3"
          icon={MessageSquare}
          color="bg-purple-500"
        />
      </div>

      {/* Charts & Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Mood Trend Chart */}
        <div className="lg:col-span-2 p-8 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-900">Emotional Journey</h3>
            <select className="bg-slate-50 border-none rounded-xl px-4 py-2 text-sm font-bold text-slate-600 outline-none">
              <option>Weekly View</option>
              <option>Monthly View</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={moodData}>
                <defs>
                  <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} 
                  dy={10}
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                  cursor={{stroke: '#6366F1', strokeWidth: 2}}
                />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#6366F1" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorMood)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Insights Card */}
        <div className="space-y-6">
          <div className="p-8 bg-indigo-600 rounded-3xl text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
            <Sparkles className="absolute -top-4 -right-4 w-24 h-24 text-white opacity-10" />
            <h3 className="text-xl font-bold mb-4">Mindful Tip</h3>
            <p className="text-indigo-100 mb-6 leading-relaxed">
              "Your sleep and mood are highly correlated this week. Try to maintain your 11 PM bedtime to sustain this positive trend."
            </p>
            <button className="flex items-center gap-2 text-sm font-bold bg-white text-indigo-600 px-4 py-2 rounded-xl">
              Explore Insights <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Upcoming Goal</h3>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                <Activity className="text-emerald-500 w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800">10min Meditation</h4>
                <p className="text-sm text-slate-400 font-medium">Daily Streak: 4 days</p>
              </div>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 w-[70%] h-full rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

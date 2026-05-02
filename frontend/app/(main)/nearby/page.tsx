"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MapPin, 
  Search, 
  Stethoscope, 
  Zap, 
  Heart, 
  Navigation, 
  Star,
  Activity,
  Globe,
  Dumbbell,
  Wind
} from 'lucide-react'
import { cn } from '@/lib/utils'

const CATEGORIES = [
  { id: 'all', label: 'All Resources', icon: Globe },
  { id: 'mental', label: 'Mental Health', icon: Stethoscope },
  { id: 'yoga', label: 'Yoga & Zen', icon: Wind },
  { id: 'fitness', label: 'Neuro-Fitness', icon: Dumbbell }
]

const RESOURCES = [
  {
    id: 1,
    name: "Neon Zen Yoga Collective",
    category: "yoga",
    address: "42 Market St, San Francisco, CA",
    rating: 4.9,
    distance: "0.4 miles",
    specialization: "Hatha & Neural Grounding",
    status: "Open Now",
    image: "/assets/yoga-mock.jpg"
  },
  {
    id: 2,
    name: "Summit Mindful Psychiatry",
    category: "mental",
    address: "101 California St, San Francisco, CA",
    rating: 5.0,
    distance: "1.2 miles",
    specialization: "CBT & Biofeedback",
    status: "Available",
    image: "/assets/doctor-mock.jpg"
  },
  {
    id: 3,
    name: "Silicon Neuro-Gym",
    category: "fitness",
    address: "500 Howard St, San Francisco, CA",
    rating: 4.8,
    distance: "0.8 miles",
    specialization: "Stress-Release HIIT",
    status: "Busy",
    image: "/assets/gym-mock.jpg"
  },
  {
    id: 4,
    name: "Aradhy Wellness Annex",
    category: "mental",
    address: "Mission District, San Francisco, CA",
    rating: 5.0,
    distance: "2.1 miles",
    specialization: "Clinical AI Integration",
    status: "MindfulAI Partner",
    image: "/assets/annex-mock.jpg"
  },
    {
    id: 5,
    name: "Flow State Mindfulness",
    category: "yoga",
    address: " Hayes Valley, San Francisco, CA",
    rating: 4.7,
    distance: "1.5 miles",
    specialization: "Pranayama & Flow",
    status: "Closing Soon",
    image: "/assets/flow-mock.jpg"
  }
]

export default function NearbySupportPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredResources = RESOURCES.filter(res => {
    const matchesCategory = activeCategory === 'all' || res.category === activeCategory
    const matchesSearch = res.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         res.specialization.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      {/* Header & Search */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <h1 className="text-5xl font-black tracking-tight leading-none uppercase">
            Nearby <span className="text-primary italic">Support</span>
          </h1>
          <p className="text-muted-foreground text-lg font-medium max-w-md">
            Bridging the gap between AI guidance and <span className="text-foreground">physical-world healing centers.</span>
          </p>
        </motion.div>

        <div className="w-full lg:w-[400px]">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search local resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/5 border border-black/5 rounded-3xl pl-12 pr-6 py-5 text-sm outline-none focus:border-primary/50 transition-all font-bold tracking-tight shadow-xl"
            />
          </div>
        </div>
      </div>

      {/* Category Selection */}
      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              "flex items-center gap-3 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap border shadow-lg",
              activeCategory === cat.id 
                ? "bg-primary border-primary/50 text-white shadow-primary/20 scale-105" 
                : "bg-black/5 border-black/5 text-muted-foreground hover:bg-black/10"
            )}
          >
            <cat.icon size={16} />
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Resource List */}
        <div className="lg:col-span-2 space-y-8">
          <AnimatePresence mode="popLayout">
            {filteredResources.map((res, i) => (
              <motion.div
                key={res.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.1 }}
                className="group relative glass rounded-[2.5rem] border border-black/5 p-8 hover:border-primary/30 transition-all cursor-pointer overflow-hidden shadow-2xl"
              >
                <div className="absolute top-0 right-0 p-8">
                   <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl text-primary group-hover:scale-110 transition-transform">
                      <Navigation size={22} />
                   </div>
                </div>

                <div className="flex gap-8 items-center">
                   <div className={cn(
                     "w-24 h-24 rounded-3xl flex items-center justify-center text-white shadow-2xl shrink-0 transition-transform group-hover:rotate-6",
                     res.category === 'mental' ? "bg-gradient-to-br from-emerald-400 to-teal-600" :
                     res.category === 'yoga' ? "bg-gradient-to-br from-violet-400 to-indigo-600" :
                     "bg-gradient-to-br from-orange-400 to-rose-600"
                   )}>
                      {res.category === 'mental' ? <Stethoscope size={40} /> :
                       res.category === 'yoga' ? <Wind size={40} /> :
                       <Dumbbell size={40} />}
                   </div>

                   <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                         <h3 className="text-2xl font-black tracking-tight">{res.name}</h3>
                         <span className="px-3 py-1 bg-black/5 border border-black/5 rounded-full text-[10px] font-black uppercase tracking-tighter">{res.status}</span>
                      </div>
                      <p className="text-muted-foreground text-sm flex items-center gap-2">
                        <MapPin size={14} className="text-primary" /> {res.address}
                      </p>
                      
                      <div className="flex gap-4 pt-2">
                         <div className="flex items-center gap-2 text-xs font-black uppercase text-amber-400">
                            <Star size={14} fill="currentColor" /> {res.rating}
                         </div>
                         <div className="flex items-center gap-2 text-xs font-black uppercase text-muted-foreground">
                            <Activity size={14} className="text-primary" /> {res.distance}
                         </div>
                         <div className="flex items-center gap-2 text-xs font-black uppercase text-primary">
                            <Zap size={14} /> {res.specialization}
                         </div>
                      </div>
                   </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Decorative Neural Map */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-12 glass rounded-[3rem] border border-black/5 p-10 space-y-8 shadow-2xl relative overflow-hidden">
             <div className="absolute inset-0 bg-primary/5 blur-[80px] rounded-full -translate-y-1/2" />
             
             <div className="relative z-10 space-y-6">
                <div className="flex justify-between items-center">
                   <h3 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">Neural Geography</h3>
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>

                <div className="aspect-square bg-zinc-950/50 rounded-[2rem] border border-black/5 flex items-center justify-center relative overflow-hidden group">
                   <div className="absolute inset-0 opacity-10">
                      {/* Neural Grid Placeholder */}
                      <svg width="100%" height="100%">
                         <defs>
                            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                               <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
                             </pattern>
                         </defs>
                         <rect width="100%" height="100%" fill="url(#grid)" />
                      </svg>
                   </div>
                   
                   <Globe size={120} className="text-primary/20 group-hover:scale-110 transition-transform duration-700" />
                   
                   {/* Mock Location Markers */}
                   <motion.div 
                     animate={{ y: [0, -10, 0] }}
                     transition={{ duration: 3, repeat: Infinity }}
                     className="absolute top-1/3 left-1/4"
                   >
                      <MapPin className="text-primary" size={24} />
                      <div className="p-2 bg-primary/20 rounded-lg border border-primary/30 text-[8px] font-black absolute top-8 -left-4 whitespace-nowrap shadow-xl">
                         NEURONAL CENTER
                      </div>
                   </motion.div>
                   
                   <motion.div 
                     animate={{ y: [0, 10, 0] }}
                     transition={{ duration: 4, repeat: Infinity }}
                     className="absolute bottom-1/4 right-1/3"
                   >
                      <MapPin className="text-rose-500" size={24} />
                      <div className="p-2 bg-rose-500/20 rounded-lg border border-rose-500/30 text-[8px] font-black absolute top-8 -left-2 whitespace-nowrap shadow-xl">
                         ACTIVE INTERVENTION
                      </div>
                   </motion.div>
                </div>

                <div className="space-y-6">
                   <div className="p-6 rounded-[1.5rem] bg-emerald-500/10 border border-emerald-500/20">
                      <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-2">Network Status</p>
                      <p className="text-xs font-bold text-emerald-100">All MindfulAI clinical partners are currently synchronized with your biometric telemetry.</p>
                   </div>
                   
                   <button className="w-full py-5 bg-black/5 border border-black/5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-black/10 transition-all flex items-center justify-center gap-3 group">
                      Sync To Wearable <Zap size={14} className="group-hover:text-primary transition-colors" />
                   </button>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FloatingCard from '@/components/anti-gravity/FloatingCard'
import BreathingExercise from '@/components/anti-gravity/BreathingExercise'
import { Play, Clock, Wind, Zap, Brain, Shield, Heart } from 'lucide-react'

export default function MeditationPage() {
  const [copingCategory, setCopingCategory] = useState('general')
  const [strategy, setStrategy] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const fetchStrategy = async (category: string) => {
    setIsLoading(true)
    setCopingCategory(category)
    try {
      const response = await fetch('http://localhost:8010/v1/coping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category })
      })
      if (response.ok) {
        const data = await response.json()
        setStrategy(data.strategies)
      }
    } catch (err) {
      console.error('Failed to fetch strategy:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStrategy('general')
  }, [])

  return (
    <div className="space-y-12 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-2xl mx-auto"
      >
        <h1 className="text-3xl md:text-5xl font-black mb-4 bg-gradient-to-r from-serenity-600 to-aurora-600 bg-clip-text text-transparent">
          Find Your Center
        </h1>
        <p className="text-muted-foreground text-lg font-medium">Take a moment to breathe and reconnect with yourself.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Breathing Exercise - Hero 8 columns */}
        <div className="lg:col-span-12 xl:col-span-8">
          <FloatingCard className="h-full flex flex-col items-center justify-center min-h-[500px] bg-gradient-to-br from-serenity-50 to-white dark:from-aurora-900/10 dark:to-black/30 border-none shadow-[0_20px_50px_rgba(100,100,250,0.1)]">
            <div className="absolute top-8 left-8 flex items-center gap-2 px-3 py-1.5 bg-serenity-500/10 text-serenity-600 rounded-full text-[10px] font-black uppercase tracking-tighter">
              <Wind size={12} />
              Live Guide
            </div>
            <BreathingExercise />
          </FloatingCard>
        </div>

        {/* Guided Sessions - 4 columns */}
        <div className="lg:col-span-12 xl:col-span-4 space-y-6">
          <h3 className="text-xl font-bold px-2 flex items-center gap-2">
            <Zap size={20} className="text-amber-500" />
            Quick Boosts
          </h3>

          {[
            { title: "Morning Clarity", duration: "5 min", icon: Brain, color: "bg-orange-100 dark:bg-orange-900/30 text-orange-600" },
            { title: "Deep Relaxation", duration: "15 min", icon: Heart, color: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600" },
            { title: "Sleep Aid", duration: "20 min", icon: Shield, color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600" },
          ].map((session, i) => (
            <FloatingCard key={i} delay={i * 0.1} className="flex items-center justify-between group cursor-pointer hover:bg-white dark:hover:bg-white/5 border-transparent hover:border-serenity-500/20 transition-all">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${session.color}`}>
                  <session.icon size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg">{session.title}</h4>
                  <div className="flex items-center gap-1 text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                    <Clock size={12} />
                    <span>{session.duration}</span>
                  </div>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-serenity-100 dark:bg-white/10 flex items-center justify-center text-serenity-600 dark:text-white opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all">
                <Play size={20} fill="currentColor" />
              </div>
            </FloatingCard>
          ))}
        </div>
      </div>

      {/* Coping Strategy Section - Dynamic from AI */}
      <div className="space-y-6">
        <h3 className="text-2xl font-black px-2">Your AI Coping Kit</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {['anxiety', 'stress', 'sadness', 'general'].map((cat, i) => (
            <button
              key={cat}
              onClick={() => fetchStrategy(cat)}
              className={`p-4 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all ${copingCategory === cat
                  ? 'bg-serenity-600 text-white shadow-lg shadow-serenity-600/30'
                  : 'bg-white/50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={copingCategory + strategy}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
          >
            <FloatingCard className="bg-gradient-to-br from-serenity-600/5 to-transparent border-serenity-600/10 min-h-[200px] flex items-center">
              {isLoading ? (
                <div className="w-full flex flex-col items-center gap-4 py-8">
                  <Brain className="animate-pulse text-serenity-600" size={40} />
                  <p className="text-sm font-black uppercase tracking-widest text-serenity-600">Consulting AI Knowledge Base...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-serenity-600">
                    <Shield size={20} />
                    <span className="text-xs font-black uppercase tracking-widest">AI Recommendation</span>
                  </div>
                  <p className="text-xl md:text-2xl font-medium leading-relaxed italic text-foreground/80">
                    "{strategy || "Loading specialized techniques for you..."}"
                  </p>
                </div>
              )}
            </FloatingCard>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
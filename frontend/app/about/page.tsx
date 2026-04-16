'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Shield, Heart, Brain, Wind } from 'lucide-react'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0d1a] py-20 px-6">
      <div className="max-w-4xl mx-auto space-y-16">
        
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center mx-auto shadow-2xl mb-8">
            <Sparkles size={32} className="text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white">Mindful<span className="text-violet-600">AI</span> Methodology</h1>
          <p className="text-xl text-slate-500 dark:text-slate-400">Where empathy meets behavioral science.</p>
        </motion.div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { icon: Shield, title: "Clinical Grade Safety", desc: "Our Risk & Safety Monitor works 24/7 to detect high-sensitivity signals, ensuring professional help is always a click away." },
            { icon: Brain, title: "Multi-Agent Intelligence", desc: "Generic chatbots are not enough. We use a swarm of specialized clinical agents that collaborate to analyze your mental state." },
            { icon: Heart, title: "Radical Empathy", desc: "Our AI is trained on thousands of therapeutic dialogues to provide warmth, validation, and a non-judgmental space." },
            { icon: Wind, title: "Temporal Resilience", desc: "By tracking sleep and energy windows, we help you predict and manage instability before it becomes overwhelming." }
          ].map((pill, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} className="p-8 rounded-[2rem] bg-white dark:bg-[#0f1629] border border-slate-200 dark:border-white/5 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-violet-600/10 flex items-center justify-center text-violet-600 mb-6">
                <pill.icon size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{pill.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">{pill.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} className="p-12 rounded-[3rem] bg-gradient-to-br from-violet-600 to-indigo-700 text-white text-center shadow-3xl">
          <h2 className="text-3xl font-bold mb-6">Ready to see the difference?</h2>
          <Link href="/register" className="inline-flex px-10 py-5 bg-white text-violet-700 rounded-2xl font-black text-xl hover:bg-violet-50 transition-all shadow-2xl">
            Start Your Journey
          </Link>
        </motion.div>

        <div className="text-center pt-8">
           <Link href="/" className="text-sm font-bold text-slate-400 hover:text-violet-600 transition-colors">← Back to Home</Link>
        </div>
      </div>
    </div>
  )
}

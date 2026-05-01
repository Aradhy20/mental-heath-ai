"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Palette, Sparkles, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const COLORS = [
  { name: 'Calm', hex: '#60a5fa', desc: 'Serene, peaceful, steady' },
  { name: 'Creative', hex: '#c084fc', desc: 'Inspired, flow, vibrant' },
  { name: 'Focused', hex: '#fbbf24', desc: 'Sharp, alert, productive' },
  { name: 'Energetic', hex: '#f87171', desc: 'Driven, loud, active' },
  { name: 'Melancholy', hex: '#94a3b8', desc: 'Quiet, heavy, reflective' },
  { name: 'Grounded', hex: '#34d399', desc: 'Balanced, earth, rooted' },
]

export default function ColorPickerPage() {
  const router = useRouter()
  const [selected, setSelected] = useState<number | null>(null)

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <header className="flex justify-between items-center text-muted-foreground">
        <button onClick={() => router.back()} className="flex items-center gap-2 hover:text-white transition-colors">
          <ArrowLeft size={20} /> Back
        </button>
        <span className="text-[10px] font-black uppercase tracking-widest">Subconscious Mapping v1.0</span>
      </header>

      <div className="space-y-4">
        <h1 className="text-6xl font-black tracking-tighter">Choose your <span className="text-primary italic">Aura</span></h1>
        <p className="text-muted-foreground text-xl">Don't think. Let your subconscious choose the color that matches your energy right now.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {COLORS.map((color, i) => (
          <motion.button
            key={i}
            whileHover={{ y: -10 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelected(i)}
            className={cn(
              "group relative p-8 rounded-[3rem] border transition-all overflow-hidden aspect-square",
              selected === i ? "border-white/40 ring-4 ring-white/10" : "border-white/5 hover:border-white/20"
            )}
          >
            <div 
              className="absolute inset-0 opacity-20 blur-3xl transition-opacity group-hover:opacity-40" 
              style={{ backgroundColor: color.hex }} 
            />
            
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div 
                className="w-12 h-12 rounded-2xl shadow-xl transition-transform group-hover:scale-110" 
                style={{ backgroundColor: color.hex }} 
              />
              <div className="text-left">
                <h3 className="text-xl font-bold mb-1">{color.name}</h3>
                <p className="text-xs text-muted-foreground leading-tight">{color.desc}</p>
              </div>
            </div>

            {selected === i && (
              <div className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white text-black flex items-center justify-center">
                <Check size={16} />
              </div>
            )}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {selected !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 glass rounded-[3rem] border border-white/10 bg-gradient-to-r from-primary/5 to-transparent flex flex-col md:flex-row items-center justify-between gap-8"
          >
            <div className="flex items-center gap-6">
               <div 
                 className="w-16 h-16 rounded-full blur-xl animate-pulse" 
                 style={{ backgroundColor: COLORS[selected].hex }} 
               />
               <div>
                  <h3 className="text-2xl font-bold italic">Refining with {COLORS[selected].name} perspective...</h3>
                  <p className="text-sm text-muted-foreground">Your dashboard experience will temporarily pivot to match this energy.</p>
               </div>
            </div>
            <button 
              onClick={() => router.push('/dashboard')}
              className="px-10 py-5 bg-white text-black font-bold rounded-2xl flex items-center gap-2 hover:scale-105 transition-all shadow-2xl"
            >
              Apply Aura <Sparkles size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

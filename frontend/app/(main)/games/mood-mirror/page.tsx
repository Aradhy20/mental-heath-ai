"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Camera, 
  Eye, 
  User, 
  Sparkles,
  ChevronRight,
  Check
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function MoodMirrorPage() {
  const router = useRouter()
  const [activeStep, setActiveStep] = useState(0)

  const steps = [
    { title: "Eye Contact", desc: "Look directly into the mirror for 10 seconds. Notice any tightness in your expression." },
    { title: "The Smile Test", desc: "Try a gentle smile. Does it feel authentic, forced, or distant?" },
    { title: "Inner Voice", desc: "What would the version of you in the mirror say to the version of you in reality?" }
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <header className="flex justify-between items-center">
        <button 
          onClick={() => router.back()}
          className="p-4 text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
        >
          <ArrowLeft size={20} /> Back to Hub
        </button>
        <span className="text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-4 py-2 rounded-full">
          Session ID: {Math.random().toString(36).substr(2, 6).toUpperCase()}
        </span>
      </header>

      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-black leading-tight">Mood <span className="text-primary">Mirror</span></h1>
            <p className="text-muted-foreground text-lg italic">"The face is the soul's primary interface."</p>
          </div>

          <div className="space-y-4">
            {steps.map((s, i) => (
              <div 
                key={i} 
                className={cn(
                  "p-6 rounded-[2rem] border transition-all cursor-pointer",
                  activeStep === i 
                    ? "bg-white/5 border-primary/40 shadow-lg" 
                    : "bg-transparent border-white/5 opacity-50 grayscale hover:opacity-100"
                )}
                onClick={() => setActiveStep(i)}
              >
                <div className="flex items-center gap-4 mb-2">
                  <div className={cn(
                    "w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs",
                    activeStep === i ? "bg-primary text-white" : "bg-white/10 text-muted-foreground"
                  )}>
                    {i + 1}
                  </div>
                  <h3 className="font-bold">{s.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed pl-12">{s.desc}</p>
              </div>
            ))}
          </div>

          <button 
             onClick={() => router.push('/dashboard')}
             className="w-full py-5 bg-white text-black font-bold rounded-2xl flex items-center justify-center gap-3 hover:scale-105 transition-all"
          >
             Log Realignment <Sparkles size={20} />
          </button>
        </div>

        <div className="relative group">
          <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full group-hover:bg-primary/30 transition-all" />
          <div className="relative glass rounded-[4rem] border border-white/20 aspect-[3/4] flex items-center justify-center overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
             <div className="text-center space-y-6 relative z-10">
                <div className="w-32 h-32 rounded-full border-4 border-primary/50 border-dashed animate-spin-slow flex items-center justify-center">
                   <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                      <User size={40} />
                   </div>
                </div>
                <div className="space-y-2">
                   <p className="text-sm font-bold uppercase tracking-widest text-primary">Scan Active</p>
                   <p className="text-xs text-muted-foreground">Self-reflection calibration in progress...</p>
                </div>
             </div>
             
             {/* Micro-animations */}
             <motion.div 
               animate={{ x: [-100, 100], y: [-50, 50] }}
               transition={{ duration: 10, repeat: Infinity, repeatType: "mirror" }}
               className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/10 blur-3xl rounded-full"
             />
          </div>
          
          <div className="absolute -bottom-6 -right-6 glass p-6 rounded-3xl border border-white/10 shadow-2xl">
             <p className="text-[10px] font-black uppercase text-muted-foreground mb-4">Detected Micro-expressions</p>
             <div className="space-y-3">
                {[
                  { label: 'Muscle Tension', val: 'Low' },
                  { label: 'Gaze Duration', val: '0.8s' },
                  { label: 'Symmetry', val: '94%' },
                ].map((stat, i) => (
                  <div key={i} className="flex justify-between items-center gap-8">
                     <span className="text-[10px] font-bold">{stat.label}</span>
                     <span className="text-[10px] text-primary font-mono">{stat.val}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}

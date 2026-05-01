"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Brain, 
  HelpCircle, 
  ChevronRight, 
  CheckCircle2, 
  Sparkles,
  ArrowRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

const TRAPS = [
  { id: 'catastrophizing', title: 'Catastrophizing', desc: 'Predicting the worst possible outcome.' },
  { id: 'all-or-nothing', title: 'All-or-Nothing', desc: 'Seeing things in black and white.' },
  { id: 'mind-reading', title: 'Mind Reading', desc: 'Assuming others are thinking negatively of you.' },
  { id: 'emotional-reasoning', title: 'Emotional Reasoning', desc: 'Believing your feelings are absolute facts.' },
]

export default function ThoughtChallengePage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [thought, setThought] = useState('')
  const [selectedTraps, setSelectedTraps] = useState<string[]>([])
  const [reframed, setReframed] = useState('')

  const toggleTrap = (id: string) => {
    setSelectedTraps(prev => 
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <header className="flex justify-between items-center">
        <button 
          onClick={() => router.back()}
          className="p-4 text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
        >
          <ArrowLeft size={20} /> Back to Games
        </button>
        <div className="flex gap-2">
          {[1, 2, 3].map(i => (
            <div key={i} className={cn(
              "h-1 w-12 rounded-full transition-all duration-500",
              step >= i ? "bg-primary" : "bg-white/10"
            )} />
          ))}
        </div>
      </header>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-primary/20 flex items-center justify-center text-primary mb-6">
                <Brain size={32} />
              </div>
              <h1 className="text-4xl font-bold">Catch the <span className="text-primary italic">Thought</span></h1>
              <p className="text-muted-foreground text-lg">What is currently weighing on your mind? Be as specific and honest as possible.</p>
            </div>

            <div className="relative">
              <textarea 
                value={thought}
                onChange={(e) => setThought(e.target.value)}
                placeholder="Example: 'I'll never be good at this job because I messed up that presentation...'"
                className="w-full h-48 bg-white/5 border border-white/10 rounded-[2rem] p-8 text-xl outline-none focus:border-primary/50 transition-all resize-none"
              />
              <div className="absolute bottom-6 right-8 text-xs text-muted-foreground font-mono">
                {thought.length} characters
              </div>
            </div>

            <button 
              disabled={!thought.trim()}
              onClick={() => setStep(2)}
              className="w-full py-5 bg-primary text-white font-bold rounded-2xl flex items-center justify-center gap-2 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20"
            >
              Identify Traps <ChevronRight size={20} />
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-12"
          >
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">Identify the <span className="text-amber-400">Thinking Traps</span></h2>
              <p className="text-muted-foreground">Our minds often play tricks on us. Which of these patterns do you notice in your thought?</p>
            </div>

            <div className="p-6 bg-white/5 border border-white/5 rounded-3xl italic text-muted-foreground">
              "{thought}"
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {TRAPS.map((trap) => (
                <button
                  key={trap.id}
                  onClick={() => toggleTrap(trap.id)}
                  className={cn(
                    "p-6 rounded-3xl border text-left transition-all group",
                    selectedTraps.includes(trap.id) 
                      ? "bg-primary/10 border-primary shadow-lg shadow-primary/10" 
                      : "bg-white/5 border-white/5 hover:border-white/20"
                  )}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className={cn("font-bold", selectedTraps.includes(trap.id) ? "text-primary" : "text-foreground")}>
                      {trap.title}
                    </h4>
                    {selectedTraps.includes(trap.id) && <CheckCircle2 size={16} className="text-primary" />}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{trap.desc}</p>
                </button>
              ))}
            </div>

            <button 
              disabled={selectedTraps.length === 0}
              onClick={() => setStep(3)}
              className="w-full py-5 bg-primary text-white font-bold rounded-2xl flex items-center justify-center gap-2 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Challenge It <ChevronRight size={20} />
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div 
            key="step3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">Reframe with <span className="text-emerald-400">Balance</span></h2>
              <p className="text-muted-foreground text-lg">Now, try to write a more balanced version of this thought. What are the actual facts?</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-rose-400 font-bold text-xs uppercase tracking-widest">
                <HelpCircle size={14} /> Distorted Thought
                <div className="h-px flex-1 bg-rose-400/20" />
              </div>
              <div className="p-6 bg-rose-500/5 border border-rose-500/10 rounded-2xl text-rose-200/60 line-through decoration-rose-500/50">
                "{thought}"
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-3 text-emerald-400 font-bold text-xs uppercase tracking-widest">
                <Sparkles size={14} /> Balanced Truth
                <div className="h-px flex-1 bg-emerald-400/20" />
              </div>
              <textarea 
                value={reframed}
                onChange={(e) => setReframed(e.target.value)}
                placeholder="Example: 'I found one presentation difficult, but overall my team values my work and I am improving every day...'"
                className="w-full h-48 bg-emerald-500/5 border border-emerald-500/20 rounded-[2rem] p-8 text-xl outline-none focus:border-emerald-500/50 transition-all resize-none"
              />
            </div>

            <button 
              disabled={!reframed.trim()}
              onClick={() => setStep(4)}
              className="w-full py-5 bg-emerald-500 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-emerald-500/20"
            >
              Complete Challenge <CheckCircle2 size={20} />
            </button>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div 
            key="step4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-12 py-12"
          >
            <div className="relative">
               <motion.div 
                 initial={{ scale: 0 }}
                 animate={{ scale: 1 }}
                 transition={{ type: "spring", bounce: 0.5 }}
                 className="w-24 h-24 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto"
               >
                 <CheckCircle2 size={48} />
               </motion.div>
               <motion.div 
                 animate={{ scale: [1, 1.2, 1], opacity: [0, 1, 0] }}
                 transition={{ repeat: Infinity, duration: 2 }}
                 className="absolute inset-0 bg-emerald-500/20 rounded-full blur-2xl"
               />
            </div>

            <div className="space-y-4">
              <h2 className="text-4xl font-bold">Resilience <span className="text-emerald-400">Grown</span></h2>
              <p className="text-muted-foreground text-lg max-w-sm mx-auto">
                You successfully reframed a cognitive distortion. This activity has been logged to your digital twin's cognitive profile.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <div className="p-4 glass rounded-2xl border border-white/5">
                <p className="text-[10px] uppercase font-black text-muted-foreground mb-1">XP Earned</p>
                <p className="text-xl font-bold text-primary">+150</p>
              </div>
              <div className="p-4 glass rounded-2xl border border-white/5">
                <p className="text-[10px] uppercase font-black text-muted-foreground mb-1">Clarity Boost</p>
                <p className="text-xl font-bold text-emerald-400">+12%</p>
              </div>
            </div>

            <div className="flex gap-4 justify-center pt-8">
              <button 
                onClick={() => setStep(1)}
                className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold hover:bg-white/10 transition-all"
              >
                Continue Playing
              </button>
              <button 
                onClick={() => router.push('/dashboard')}
                className="px-10 py-4 bg-primary text-white rounded-2xl font-bold hover:scale-105 transition-all shadow-xl shadow-primary/20"
              >
                Back to Dashboard
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

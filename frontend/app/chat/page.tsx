'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Webcam from 'react-webcam'
import {
  Send, Mic, Video, VideoOff, Heart, Brain, Briefcase,
  Compass, Stethoscope, ChevronDown, RefreshCw, Shield,
  Sparkles, X, AlertTriangle, BookOpen, Phone
} from 'lucide-react'
import { useAuthStore, getStoredToken } from '@/lib/store/auth-store'

const API_BASE = process.env.NEXT_PUBLIC_AUTH_URL || 'http://localhost:8001'

// ─── Persona Definitions ───────────────────────────────────────────────────────
const PERSONAS = [
  {
    id: 'companion',
    label: 'Mia',
    role: 'Emotional Companion',
    icon: Heart,
    gradient: 'from-pink-500 to-rose-500',
    glow: 'shadow-pink-500/30',
    border: 'border-pink-500/30',
    bg: 'bg-pink-500/10',
    ring: 'ring-pink-500/40',
    dot: 'bg-pink-400',
    badge: 'bg-pink-500/20 text-pink-300',
    description: 'Warm, judgment-free emotional support',
    greeting: "Hey there 💙 I'm Mia, your personal companion. I'm here to listen without judgment. How are you feeling right now?",
    tags: ['Emotional Support', 'Active Listening', 'Empathy']
  },
  {
    id: 'psychologist',
    label: 'Dr. Priya',
    role: 'Virtual Psychologist',
    icon: Stethoscope,
    gradient: 'from-violet-500 to-purple-600',
    glow: 'shadow-violet-500/30',
    border: 'border-violet-500/30',
    bg: 'bg-violet-500/10',
    ring: 'ring-violet-500/40',
    dot: 'bg-violet-400',
    badge: 'bg-violet-500/20 text-violet-300',
    description: 'Evidence-based therapeutic guidance',
    greeting: "Hello, I'm Dr. Priya 🧠 I use evidence-based psychological techniques — CBT, DBT, and mindfulness — to help you understand and work through what you're experiencing. This is a safe, confidential space. What's brought you here today?",
    tags: ['CBT', 'DBT', 'Mindfulness', 'Trauma-Informed']
  },
  {
    id: 'guide',
    label: 'Arya',
    role: 'Mindfulness Guide',
    icon: Compass,
    gradient: 'from-emerald-500 to-teal-500',
    glow: 'shadow-emerald-500/30',
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-500/10',
    ring: 'ring-emerald-500/40',
    dot: 'bg-emerald-400',
    badge: 'bg-emerald-500/20 text-emerald-300',
    description: 'Mindfulness, clarity & personal growth',
    greeting: "Welcome 🌿 I'm Arya, your mindfulness and personal growth guide. Let's find clarity together. What's on your mind today?",
    tags: ['Meditation', 'Journaling', 'Grounding']
  },
  {
    id: 'neurologist',
    label: 'Dr. Ravi',
    role: 'Neuroscience Expert',
    icon: Brain,
    gradient: 'from-cyan-500 to-blue-600',
    glow: 'shadow-cyan-500/30',
    border: 'border-cyan-500/30',
    bg: 'bg-cyan-500/10',
    ring: 'ring-cyan-500/40',
    dot: 'bg-cyan-400',
    badge: 'bg-cyan-500/20 text-cyan-300',
    description: 'Brain science explained simply',
    greeting: "Hello 🧠 I'm Dr. Ravi. I can help explain the neuroscience behind what you're experiencing — anxiety, stress, mood patterns and more. What would you like to understand?",
    tags: ['Neuroscience', 'Anxiety', 'Sleep', 'Stress Biology']
  },
  {
    id: 'career',
    label: 'Alex',
    role: 'Career Counselor',
    icon: Briefcase,
    gradient: 'from-amber-500 to-orange-500',
    glow: 'shadow-amber-500/30',
    border: 'border-amber-500/30',
    bg: 'bg-amber-500/10',
    ring: 'ring-amber-500/40',
    dot: 'bg-amber-400',
    badge: 'bg-amber-500/20 text-amber-300',
    description: 'Burnout, purpose & career mental health',
    greeting: "Hey! I'm Alex 🚀 Your career counselor. Whether it's burnout, career pivots, or finding your purpose — I'm here to help you navigate. What's going on professionally?",
    tags: ['Burnout', 'Purpose', 'Career Anxiety']
  }
]

const CRISIS_RESOURCES = [
  { name: 'iCall Helpline (India)', number: '9152987821', flag: '🇮🇳' },
  { name: 'Vandrevala Foundation', number: '1860-2662-345', flag: '🇮🇳' },
  { name: 'Crisis Text Line (US)', number: 'Text HOME to 741741', flag: '🇺🇸' },
  { name: 'Samaritans (UK)', number: '116 123', flag: '🇬🇧' },
]

const QUICK_PROMPTS: Record<string, string[]> = {
  companion:    ["I'm feeling overwhelmed lately", "I feel really lonely", "I've been anxious all day", "I don't know how to cope"],
  psychologist: ["I think I have anxiety", "I can't stop negative thoughts", "I had a panic attack", "I'm struggling with my self-worth"],
  guide:        ["I need a grounding exercise", "Help me start journaling", "I want to meditate", "I feel disconnected from myself"],
  neurologist:  ["Why does anxiety feel physical?", "How does stress affect the brain?", "Why can't I sleep well?", "What is cortisol doing to me?"],
  career:       ["I'm burned out at work", "I don't know what career to choose", "I feel like an imposter", "Work is affecting my mental health"],
}

// ─── Typing Bubble ─────────────────────────────────────────────────────────────
function TypingBubble({ color }: { color: string }) {
  return (
    <div className="flex gap-1.5 px-5 py-4">
      {[0, 120, 240].map(delay => (
        <span key={delay} className={`w-2 h-2 rounded-full ${color} animate-bounce`} style={{ animationDelay: `${delay}ms` }} />
      ))}
    </div>
  )
}

// ─── Crisis Banner ─────────────────────────────────────────────────────────────
function CrisisBanner({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
      className="absolute top-0 left-0 right-0 z-50 bg-red-950/95 border-b border-red-500/30 backdrop-blur-xl p-4"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className="text-red-400 shrink-0" size={20} />
          <div>
            <p className="text-red-300 font-bold text-sm">If you are in crisis, please reach out immediately</p>
            <div className="flex flex-wrap gap-3 mt-2">
              {CRISIS_RESOURCES.map(r => (
                <span key={r.name} className="text-xs text-red-200 bg-red-900/50 px-3 py-1 rounded-full border border-red-500/20">
                  {r.flag} {r.name}: <strong>{r.number}</strong>
                </span>
              ))}
            </div>
          </div>
        </div>
        <button onClick={onClose} className="text-red-400 hover:text-red-300 shrink-0 mt-0.5">
          <X size={16} />
        </button>
      </div>
    </motion.div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function VirtualPsychologist() {
  const { token } = useAuthStore()
  const [activePersona, setActivePersona] = useState(PERSONAS[1]) // Dr. Priya default
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string; time: string }[]>([
    { role: 'assistant', content: PERSONAS[1].greeting, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ])
  const [input, setInput] = useState('')
  const [isVideoActive, setIsVideoActive] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [showCrisis, setShowCrisis] = useState(false)
  const [showPersonaPanel, setShowPersonaPanel] = useState(false)
  const [sessionCount, setSessionCount] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  useEffect(() => { scrollToBottom() }, [messages, isTyping])

  const switchPersona = (persona: typeof PERSONAS[0]) => {
    setActivePersona(persona)
    setMessages([{
      role: 'assistant',
      content: persona.greeting,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }])
    setShowPersonaPanel(false)
    setSessionCount(0)
    inputRef.current?.focus()
  }

  const handleSend = async (overrideText?: string) => {
    const userText = (overrideText || input).trim()
    if (!userText || isTyping) return

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const newMessages = [...messages, { role: 'user' as const, content: userText, time: now }]
    setMessages(newMessages)
    setInput('')
    setIsTyping(true)
    setSessionCount(c => c + 1)

    // Crisis keyword detection
    const crisisWords = ['suicide', 'kill myself', 'end my life', 'want to die', 'self harm', 'hurt myself', 'no reason to live']
    if (crisisWords.some(w => userText.toLowerCase().includes(w))) {
      setShowCrisis(true)
    }

    const authToken = getStoredToken()
    try {
      const res = await fetch(`${API_BASE}/api/v1/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
        },
        body: JSON.stringify({
          prompt: userText,
          persona: activePersona.id,
          history: newMessages.slice(-10).map(m => ({ role: m.role, content: m.content }))
        })
      })

      if (res.ok) {
        const data = await res.json()
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.response,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }])
      } else {
        throw new Error(`API ${res.status}`)
      }
    } catch {
      // Graceful offline fallback
      const fallback = activePersona.id === 'psychologist'
        ? "I'm here with you 🧠 It seems there was a brief connection issue. What you're sharing matters — please try again, I'm listening."
        : "Connection hiccup! I'm still here for you 💙 Please try again."
      setMessages(prev => [...prev, { role: 'assistant', content: fallback, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }])
    } finally {
      setIsTyping(false)
    }
  }

  const Icon = activePersona.icon

  return (
    <div className="flex h-[calc(100vh-5rem)] gap-4 mt-4 overflow-hidden px-1">

      {/* ── Left Panel ── */}
      <div className="hidden lg:flex w-72 shrink-0 flex-col gap-3">

        {/* Persona List */}
        <div className="bg-slate-900/80 border border-white/5 rounded-2xl p-3 flex flex-col gap-1.5 backdrop-blur-xl shadow-2xl">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-2 pb-1">Your AI Team</p>
          {PERSONAS.map(p => {
            const PIcon = p.icon
            const isActive = p.id === activePersona.id
            return (
              <button
                key={p.id}
                onClick={() => switchPersona(p)}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left group ${
                  isActive ? `${p.bg} ${p.border} border shadow-lg ${p.glow}` : 'border-transparent hover:bg-white/5'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${p.gradient} flex items-center justify-center shrink-0 shadow-lg`}>
                  <PIcon size={15} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold truncate ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>{p.label}</p>
                  <p className="text-[10px] text-slate-500 truncate">{p.role}</p>
                </div>
                {isActive && <span className={`w-2 h-2 rounded-full ${p.dot} animate-pulse shrink-0`} />}
              </button>
            )
          })}
        </div>

        {/* Session Info */}
        <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-4 backdrop-blur-xl">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">Session</p>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400">Exchanges</span>
              <span className="text-xs font-bold text-white">{sessionCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400">Specialist</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${activePersona.badge}`}>{activePersona.label}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400">Techniques</span>
              <span className="text-xs text-slate-300">{activePersona.tags[0]}</span>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-1">
            {activePersona.tags.map(tag => (
              <span key={tag} className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${activePersona.badge}`}>{tag}</span>
            ))}
          </div>
        </div>

        {/* Webcam */}
        <div className="flex-1 bg-slate-900/60 border border-white/5 rounded-2xl overflow-hidden flex flex-col relative shadow-xl min-h-0">
          <div className="absolute top-2 left-2 right-2 flex justify-between z-10 pointer-events-none">
            <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
              <span className={`w-1.5 h-1.5 rounded-full ${isVideoActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-[9px] font-bold uppercase tracking-wider text-white">Face Track</span>
            </div>
            <button onClick={() => setIsVideoActive(!isVideoActive)} className="pointer-events-auto bg-black/60 backdrop-blur-md p-1.5 rounded-full border border-white/10 hover:bg-white/10 text-white transition">
              {isVideoActive ? <Video size={12} /> : <VideoOff size={12} />}
            </button>
          </div>
          {isVideoActive ? (
            <div className="relative w-full h-full bg-black flex-1">
              <Webcam audio={false} className="object-cover w-full h-full opacity-70" />
              <div className="absolute inset-x-6 top-8 bottom-8 border border-cyan-500/30 rounded-xl pointer-events-none">
                <div className="absolute top-0 w-full h-0.5 bg-cyan-400/60 shadow-[0_0_10px_#22d3ee] animate-scan" />
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center bg-slate-950/50 text-slate-600 py-8">
              <VideoOff size={24} className="mb-2 opacity-40" />
              <p className="text-[10px] font-medium uppercase tracking-widest">Camera Off</p>
              <p className="text-[9px] text-slate-700 mt-1">Enable for mood detection</p>
            </div>
          )}
        </div>

        {/* Crisis Button */}
        <button
          onClick={() => setShowCrisis(true)}
          className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-500/20 bg-red-950/30 text-red-400 text-xs font-bold hover:bg-red-950/50 transition"
        >
          <Phone size={12} /> Crisis Resources
        </button>
      </div>

      {/* ── Main Chat Panel ── */}
      <div className="flex-1 bg-[#080f1f] border border-white/5 rounded-2xl shadow-2xl flex flex-col overflow-hidden relative">

        <AnimatePresence>
          {showCrisis && <CrisisBanner onClose={() => setShowCrisis(false)} />}
        </AnimatePresence>

        {/* Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-white/5 bg-slate-900/60 backdrop-blur-xl shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${activePersona.gradient} flex items-center justify-center shadow-lg ${activePersona.glow}`}>
              <Icon size={18} className="text-white" />
            </div>
            <div>
              <h2 className="font-black text-white text-sm leading-none">{activePersona.label}</h2>
              <p className="text-[11px] text-slate-400 mt-0.5">{activePersona.role}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile: persona switcher */}
            <button
              onClick={() => setShowPersonaPanel(!showPersonaPanel)}
              className="lg:hidden flex items-center gap-1.5 text-[10px] font-bold text-slate-400 bg-white/5 border border-white/5 px-3 py-2 rounded-lg hover:bg-white/10 transition"
            >
              Switch <ChevronDown size={12} />
            </button>
            <button
              onClick={() => switchPersona(activePersona)}
              className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 bg-white/5 border border-white/5 px-3 py-2 rounded-lg hover:bg-white/10 transition"
              title="New session"
            >
              <RefreshCw size={11} /> New
            </button>
            <div className="flex items-center gap-1.5 bg-slate-950/80 border border-white/5 px-3 py-2 rounded-lg">
              <span className={`w-1.5 h-1.5 rounded-full ${activePersona.dot} animate-pulse`} />
              <span className="text-[10px] font-bold text-slate-400">Online</span>
            </div>
          </div>
        </div>

        {/* Mobile persona panel */}
        <AnimatePresence>
          {showPersonaPanel && (
            <motion.div
              initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="lg:hidden border-b border-white/5 bg-slate-900/80 overflow-hidden"
            >
              <div className="flex gap-2 p-3 overflow-x-auto">
                {PERSONAS.map(p => {
                  const PIcon = p.icon
                  return (
                    <button key={p.id} onClick={() => switchPersona(p)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold whitespace-nowrap transition shrink-0 ${
                        p.id === activePersona.id ? `${p.bg} ${p.border} text-white` : 'border-white/10 text-slate-400 hover:text-white'
                      }`}>
                      <PIcon size={12} /> {p.label}
                    </button>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4 min-h-0" style={{ scrollbarWidth: 'thin', scrollbarColor: '#1e293b transparent' }}>
          
          {/* Disclaimer for psychologist */}
          {activePersona.id === 'psychologist' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 px-4 py-2 bg-violet-950/40 border border-violet-500/20 rounded-xl text-violet-300 text-xs">
              <Shield size={13} className="shrink-0" />
              <span>This is an AI support tool, not a substitute for professional medical care. In emergencies, contact a crisis line.</span>
            </motion.div>
          )}

          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i} layout
                initial={{ opacity: 0, y: 16, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3, type: 'spring', stiffness: 220, damping: 22 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2.5`}
              >
                {msg.role === 'assistant' && (
                  <div className={`w-7 h-7 rounded-xl bg-gradient-to-br ${activePersona.gradient} flex items-center justify-center shrink-0 shadow-md`}>
                    <Icon size={13} className="text-white" />
                  </div>
                )}
                <div className="flex flex-col gap-1 max-w-[75%]">
                  <div className={`px-4 py-3 rounded-2xl text-[14px] leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-sm'
                      : `bg-slate-800/90 text-slate-100 border border-white/5 rounded-bl-sm`
                  }`}>
                    {msg.content}
                  </div>
                  <span className={`text-[10px] text-slate-600 ${msg.role === 'user' ? 'text-right' : 'text-left'} px-1`}>{msg.time}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start items-end gap-2.5">
              <div className={`w-7 h-7 rounded-xl bg-gradient-to-br ${activePersona.gradient} flex items-center justify-center shrink-0 shadow-md`}>
                <Icon size={13} className="text-white" />
              </div>
              <div className="bg-slate-800/90 rounded-2xl rounded-bl-sm border border-white/5">
                <TypingBubble color={activePersona.dot} />
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        <div className="px-5 py-2 border-t border-white/5 flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          <Sparkles size={13} className="text-slate-600 shrink-0 mt-0.5" />
          {(QUICK_PROMPTS[activePersona.id] || []).map(prompt => (
            <button key={prompt} onClick={() => handleSend(prompt)}
              className="text-[11px] font-medium text-slate-400 bg-white/5 border border-white/5 px-3 py-1.5 rounded-full whitespace-nowrap hover:bg-white/10 hover:text-white transition shrink-0">
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-slate-900/80 border-t border-white/5 backdrop-blur-xl">
          <div className={`flex items-center gap-3 bg-slate-950/80 border rounded-2xl p-2 transition-all ${
            input ? `${activePersona.border} ring-1 ${activePersona.ring}` : 'border-white/10'
          }`}>
            <button className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 text-slate-500 rounded-xl transition">
              <Mic size={17} />
            </button>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder={`Talk to ${activePersona.label}...`}
              className="flex-1 bg-transparent border-none outline-none text-white placeholder-slate-600 px-1 text-[14px]"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              className={`px-5 h-10 bg-gradient-to-tr ${activePersona.gradient} rounded-xl text-white font-bold text-sm transition-all disabled:opacity-30 disabled:pointer-events-none flex items-center gap-2 shadow-lg`}
            >
              <Send size={14} />
            </button>
          </div>
          <p className="text-center text-[10px] text-slate-600 mt-2 flex items-center justify-center gap-1">
            <BookOpen size={10} /> AI support only — not a medical diagnosis. All conversations are private.
          </p>
        </div>
      </div>
    </div>
  )
}
'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Webcam from 'react-webcam'
import { Send, Mic, Video, VideoOff, Heart, Brain, Briefcase, Compass } from 'lucide-react'
import { useAuthStore } from '@/lib/store/auth-store'

const PERSONAS = [
    {
        id: 'companion',
        label: 'Mia',
        sublabel: 'Companion',
        icon: Heart,
        color: 'from-pink-500 to-rose-500',
        glow: 'shadow-pink-500/20',
        border: 'border-pink-500/40',
        bg: 'bg-pink-500/10',
        dot: 'bg-pink-400',
        greeting: "Hey there 💙 I'm Mia, your personal companion. I'm here to listen without judgment. How are you feeling right now?"
    },
    {
        id: 'guide',
        label: 'Arya',
        sublabel: 'Mindfulness Guide',
        icon: Compass,
        color: 'from-emerald-500 to-teal-500',
        glow: 'shadow-emerald-500/20',
        border: 'border-emerald-500/40',
        bg: 'bg-emerald-500/10',
        dot: 'bg-emerald-400',
        greeting: "Welcome 🌿 I'm Arya, your mindfulness and personal growth guide. Let's find clarity together. What's on your mind today?"
    },
    {
        id: 'neurologist',
        label: 'Dr. Ravi',
        sublabel: 'Neuroscience Expert',
        icon: Brain,
        color: 'from-violet-500 to-purple-600',
        glow: 'shadow-violet-500/20',
        border: 'border-violet-500/40',
        bg: 'bg-violet-500/10',
        dot: 'bg-violet-400',
        greeting: "Hello 🧠 I'm Dr. Ravi. I can help explain the neuroscience behind what you're experiencing — anxiety, stress, mood patterns and more. What would you like to understand?"
    },
    {
        id: 'career',
        label: 'Alex',
        sublabel: 'Career Counselor',
        icon: Briefcase,
        color: 'from-amber-500 to-orange-500',
        glow: 'shadow-amber-500/20',
        border: 'border-amber-500/40',
        bg: 'bg-amber-500/10',
        dot: 'bg-amber-400',
        greeting: "Hey! I'm Alex 🚀 Your career counselor. Whether it's burnout, career pivots, or finding your purpose — I'm here to help you navigate. What's going on professionally?"
    }
]

export default function EnterpriseChat() {
    const { token } = useAuthStore()
    const [activePersona, setActivePersona] = useState(PERSONAS[0])
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
        { role: 'assistant', content: PERSONAS[0].greeting }
    ])
    const [input, setInput] = useState('')
    const [isVideoActive, setIsVideoActive] = useState(false)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
    useEffect(() => { scrollToBottom() }, [messages])

    const switchPersona = (persona: typeof PERSONAS[0]) => {
        setActivePersona(persona)
        setMessages([{ role: 'assistant', content: persona.greeting }])
    }

    const handleSend = async () => {
        if (!input.trim() || isAnalyzing) return

        const userText = input.trim()
        const newHistory = [...messages, { role: 'user' as const, content: userText }]
        setMessages(newHistory)
        setInput('')
        setIsAnalyzing(true)

        try {
            const res = await fetch('http://localhost:8000/api/v1/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
                },
                body: JSON.stringify({
                    prompt: userText,
                    persona: activePersona.id,
                    history: messages.slice(-8).map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content }))
                })
            })

            if (res.ok) {
                const data = await res.json()
                setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
            } else {
                throw new Error('API Error')
            }
        } catch {
            // Smart fallback per persona when backend is unavailable
            const fallbacks: Record<string, string> = {
                companion: "I'm having a little glitch but I'm still here 💙 You were saying something important — please go on.",
                guide: "Let's pause and breathe for a moment 🌿 Whatever you're working through, awareness is the first step. Try again in a moment?",
                neurologist: "There seems to be a brief network disruption. While cortical processing reconnects — remember: a few slow, deep breaths directly activate your vagus nerve and calm the nervous system.",
                career: "Brief tech hiccup! But here's a thought while we reconnect — every challenge you're facing right now is building resilience. Try again?"
            }
            setMessages(prev => [...prev, { role: 'assistant', content: fallbacks[activePersona.id] || fallbacks.companion }])
        } finally {
            setIsAnalyzing(false)
        }
    }

    const Icon = activePersona.icon

    return (
        <div className="flex h-[calc(100vh-5rem)] gap-4 mt-4 overflow-hidden">

            {/* Left Panel: Persona selector + Webcam */}
            <div className="hidden lg:flex w-72 flex-col gap-4 shrink-0">

                {/* Persona Switcher */}
                <div className="bg-slate-900 border border-white/5 rounded-2xl p-4 shadow-xl flex flex-col gap-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Choose Your AI Guide</p>
                    {PERSONAS.map(p => {
                        const PIcon = p.icon
                        const isActive = p.id === activePersona.id
                        return (
                            <button
                                key={p.id}
                                onClick={() => switchPersona(p)}
                                className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${isActive ? `${p.bg} ${p.border} border` : 'border-transparent hover:bg-white/5'}`}
                            >
                                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${p.color} flex items-center justify-center shrink-0 shadow-lg ${isActive ? p.glow : ''}`}>
                                    <PIcon size={15} className="text-white" />
                                </div>
                                <div>
                                    <p className={`text-sm font-bold ${isActive ? 'text-white' : 'text-slate-300'}`}>{p.label}</p>
                                    <p className="text-[10px] text-slate-500">{p.sublabel}</p>
                                </div>
                                {isActive && <span className={`ml-auto w-2 h-2 rounded-full ${p.dot} animate-pulse`} />}
                            </button>
                        )
                    })}
                </div>

                {/* Webcam Module */}
                <div className="flex-1 bg-slate-900 border border-white/5 rounded-2xl overflow-hidden flex flex-col relative shadow-xl">
                    <div className="absolute top-3 flex justify-between w-full px-3 z-10 pointer-events-none">
                        <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                            <span className={`w-2 h-2 rounded-full ${isVideoActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-white">Face Track</span>
                        </div>
                        <button onClick={() => setIsVideoActive(!isVideoActive)} className="pointer-events-auto bg-black/50 backdrop-blur-md p-2 rounded-full border border-white/10 hover:bg-white/10 text-white transition">
                            {isVideoActive ? <Video size={13} /> : <VideoOff size={13} />}
                        </button>
                    </div>
                    {isVideoActive ? (
                        <div className="relative w-full h-full bg-black">
                            <Webcam audio={false} className="object-cover w-full h-full opacity-70" />
                            <div className="absolute inset-x-8 top-10 bottom-10 border border-cyan-500/30 rounded-xl pointer-events-none">
                                <div className="absolute top-0 w-full h-0.5 bg-cyan-400/60 shadow-[0_0_10px_#22d3ee] animate-scan"></div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center bg-slate-950 text-slate-500">
                            <VideoOff size={28} className="mb-2 opacity-40" />
                            <p className="text-xs font-medium uppercase tracking-widest">Camera Off</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Chat Panel */}
            <div className="flex-1 bg-[#0f172a] border border-white/5 rounded-2xl shadow-2xl flex flex-col overflow-hidden">

                {/* Chat Header */}
                <div className={`h-16 flex items-center justify-between px-6 border-b border-white/5 bg-gradient-to-r ${activePersona.color} bg-opacity-5 relative`}>
                    <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" />
                    <div className="relative flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${activePersona.color} flex items-center justify-center shadow-lg`}>
                            <Icon size={16} className="text-white" />
                        </div>
                        <div>
                            <h2 className="font-bold text-white text-sm leading-none">Your AI Guide ✨</h2>
                            <p className="text-[10px] text-slate-400 mt-0.5">{activePersona.sublabel}</p>
                        </div>
                    </div>
                    <div className="relative flex items-center gap-2">
                        <span className={`flex items-center gap-1.5 text-[11px] font-mono font-bold text-slate-400 bg-slate-950 border border-white/5 px-3 py-1.5 rounded-lg`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${activePersona.dot} animate-pulse`}></span>
                            Active
                        </span>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5" style={{ scrollbarWidth: 'thin' }}>
                    <AnimatePresence initial={false}>
                        {messages.map((msg, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.25 }}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-3`}
                            >
                                {msg.role === 'assistant' && (
                                    <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${activePersona.color} flex items-center justify-center shrink-0 shadow`}>
                                        <Icon size={13} className="text-white" />
                                    </div>
                                )}
                                <div className={`max-w-[72%] px-5 py-3.5 rounded-2xl text-[15px] leading-relaxed whitespace-pre-wrap ${
                                    msg.role === 'user'
                                        ? 'bg-indigo-600 text-white rounded-br-sm'
                                        : `bg-slate-800 text-slate-100 border border-white/5 rounded-bl-sm`
                                }`}>
                                    {msg.content}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {isAnalyzing && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start items-end gap-3">
                            <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${activePersona.color} flex items-center justify-center shrink-0 shadow`}>
                                <Icon size={13} className="text-white" />
                            </div>
                            <div className="px-5 py-4 bg-slate-800 rounded-2xl rounded-bl-sm border border-white/5 flex gap-1.5">
                                <span className={`w-2 h-2 rounded-full ${activePersona.dot} animate-bounce`} style={{ animationDelay: '0ms' }}></span>
                                <span className={`w-2 h-2 rounded-full ${activePersona.dot} animate-bounce`} style={{ animationDelay: '120ms' }}></span>
                                <span className={`w-2 h-2 rounded-full ${activePersona.dot} animate-bounce`} style={{ animationDelay: '240ms' }}></span>
                            </div>
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Bar */}
                <div className="p-4 bg-slate-900 border-t border-white/5">
                    {/* Mobile persona switcher */}
                    <div className="flex lg:hidden gap-2 mb-3 overflow-x-auto pb-1">
                        {PERSONAS.map(p => {
                            const PIcon = p.icon
                            return (
                                <button
                                    key={p.id}
                                    onClick={() => switchPersona(p)}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold whitespace-nowrap transition ${p.id === activePersona.id ? `${p.bg} ${p.border} text-white` : 'border-white/10 text-slate-400'}`}
                                >
                                    <PIcon size={12} /> {p.label}
                                </button>
                            )
                        })}
                    </div>
                    <div className="flex items-center gap-3 bg-slate-950 border border-white/10 rounded-2xl p-2 focus-within:border-indigo-500/50 transition-colors">
                        <button className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 text-slate-400 rounded-xl transition">
                            <Mic size={18} />
                        </button>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder={`Talk to ${activePersona.label}...`}
                            className="flex-1 bg-transparent border-none outline-none text-white placeholder-slate-600 px-2 text-[15px]"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isAnalyzing}
                            className={`px-5 h-10 bg-gradient-to-tr ${activePersona.color} rounded-xl text-white font-bold text-sm transition-all disabled:opacity-40 disabled:pointer-events-none flex items-center gap-2 shadow-lg`}
                        >
                            <Send size={14} /> Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
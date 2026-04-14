'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send, Mic, Video, VideoOff, Brain,
  Sparkles, AlertTriangle, Phone, Activity, Zap,
  X, RotateCcw, Loader2, ChevronDown, Copy, Check
} from 'lucide-react'
import { useAuthStore, getStoredToken } from '@/lib/store/auth-store'
import FaceDetector from '@/components/ai/FaceDetector'

const API_BASE = process.env.NEXT_PUBLIC_AUTH_URL || 'http://localhost:8001'

// ─── Types ──────────────────────────────────────────────────────────────────
interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  time: string
  emotion?: string
  mode?: string
  risk?: string
  action?: string
}

// ─── Quick prompts ───────────────────────────────────────────────────────────
const QUICK_PROMPTS = [
  "I'm feeling anxious today 😟",
  "Help me calm down",
  "I need some motivation",
  "I'm having trouble sleeping",
  "How do I deal with stress?",
]

// ─── Crisis resources ────────────────────────────────────────────────────────
const CRISIS_LINES = [
  { name: 'iCall by TISS',           number: '9152987821',    desc: 'Free counseling (Mon–Sat 8am–10pm)' },
  { name: 'Vandrevala Foundation',   number: '1860-2662-345', desc: '24/7 free mental health support' },
  { name: 'SNEHI Helpline',          number: '044-24640050',  desc: 'Emotionally distressed individuals' },
]

// ─── Message bubble ──────────────────────────────────────────────────────────
function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === 'user'
  const [copied, setCopied] = useState(false)

  const copy = useCallback(() => {
    navigator.clipboard.writeText(msg.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [msg.content])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className={`flex gap-3 group ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-0.5 ${
        isUser
          ? 'bg-gradient-to-br from-violet-500 to-indigo-500 text-white text-xs font-bold'
          : 'bg-gradient-to-br from-emerald-400 to-teal-500 shadow-md'
      }`}>
        {isUser ? 'U' : <Sparkles size={13} className="text-white" />}
      </div>

      <div className={`max-w-[72%] flex flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white rounded-tr-md'
            : 'bg-white dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-white/[0.08] rounded-tl-md shadow-sm'
        }`}>
          {msg.content}
        </div>
        <div className={`flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
          <span className="text-[10px] text-slate-400">{msg.time}</span>
          {!isUser && (
            <button onClick={copy} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              {copied ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ─── Typing indicator ────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className="flex items-center gap-3"
    >
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shrink-0">
        <Sparkles size={13} className="text-white" />
      </div>
      <div className="px-4 py-3 rounded-2xl rounded-tl-md bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-white/[0.08] shadow-sm">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map(i => (
            <motion.span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// ─── Crisis Modal ────────────────────────────────────────────────────────────
function CrisisModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 16 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden"
      >
        <div className="p-5 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-red-500 flex items-center justify-center">
                <AlertTriangle size={16} className="text-white" />
              </div>
              <div>
                <h2 className="font-bold text-red-800 dark:text-red-200">Crisis Support</h2>
                <p className="text-xs text-red-600 dark:text-red-400">You're not alone. Help is available right now.</p>
              </div>
            </div>
            <button onClick={onClose} className="text-red-400 hover:text-red-600 transition-colors">
              <X size={18} />
            </button>
          </div>
        </div>
        <div className="p-5 space-y-3">
          {CRISIS_LINES.map(r => (
            <div key={r.name} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.06]">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{r.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{r.desc}</p>
              </div>
              <a
                href={`tel:${r.number.replace(/-/g, '')}`}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
              >
                <Phone size={11} /> {r.number}
              </a>
            </div>
          ))}
          <p className="text-xs text-center text-slate-400 pt-2">
            If you're in immediate danger, call <strong>112</strong> (Emergency) or visit your nearest hospital.
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── MAIN PAGE ──────────────────────────────────────────────────────────────
export default function ChatPage() {
  const { token } = useAuthStore()
  const [messages, setMessages] = useState<Message[]>([{
    id: '0',
    role: 'assistant',
    content: "Hello 💜 I'm MindfulAI, your personal mental wellness companion. I'm here to listen, support, and help you navigate how you're feeling. What's on your mind today?",
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isVideoActive, setIsVideoActive] = useState(false)
  const [showCrisis, setShowCrisis] = useState(false)
  const [sessionCount, setSessionCount] = useState(0)
  const [showQuickPrompts, setShowQuickPrompts] = useState(true)
  const [mentalState, setMentalState] = useState<any>(null)
  const [lastAction, setLastAction] = useState<string | null>(null)
  const [detectedEmotion, setDetectedEmotion] = useState<string | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  // Auto-play voice audio when received
  const playVoice = useCallback((base64Audio: string) => {
    if (!isVoiceEnabled || !base64Audio) return
    if (audioRef.current) {
      audioRef.current.src = base64Audio
      audioRef.current.play().catch(e => console.log("Audio play blocked/failed:", e))
    }
  }, [isVoiceEnabled])

  // Voice Interaction Logic
  const toggleRecording = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop()
      setIsRecording(false)
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const mediaRecorder = new MediaRecorder(stream)
        mediaRecorderRef.current = mediaRecorder
        audioChunksRef.current = []

        mediaRecorder.ondataavailable = (e) => audioChunksRef.current.push(e.data)
        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
          const formData = new FormData()
          formData.append('audio', audioBlob)

          setIsTyping(true)
          try {
            const res = await fetch(`${API_BASE}/api/v1/voice`, {
              method: 'POST',
              headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
              body: formData
            })
            const data = await res.json()
            if (data.transcript) {
               handleSend(data.transcript, true)
            }
          } catch (e) {
            console.error("Voice upload failed:", e)
            setIsTyping(false)
          }
        }

        mediaRecorder.start()
        setIsRecording(true)
      } catch (err) {
        console.error("Mic access denied:", err)
        alert("Please allow microphone access to use voice features.")
      }
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSend = useCallback(async (text?: string, isVoice = false) => {
    const userText = (text || input).trim()
    if (!userText && !isVoice) return
    if (isTyping) return

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: userText || "🎤 [Voice Message]", time: now }

    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)
    setShowQuickPrompts(false)
    setSessionCount(c => c + 1)

    try {
      const res = await fetch(`${API_BASE}/api/v1/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ 
          message: userText, 
          use_voice_features: true,
          history: messages.slice(-4).map(m => ({ role: m.role, content: m.content }))
        })
      })

      const data = res.ok ? await res.json() : null
      
      if (data) {
        setMentalState({
            emotion: data.emotion,
            risk: data.risk_level,
            state: data.mental_state,
            contribution: data.modality_contribution
        })
        setLastAction(data.recommended_action)
        if (data.voice_audio) playVoice(data.voice_audio)
      }

      const replyContent = data?.message || "I'm here with you. Could you tell me a bit more about how you're feeling?"

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: replyContent,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        emotion: data?.emotion || undefined,
        mode: data?.mode || undefined,
        action: data?.recommended_action || undefined
      }])
    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm having a small connection issue, but I'm still here for you. Please try again in a moment. 💜",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }])
    } finally {
      setIsTyping(false)
    }
  }, [input, isTyping, token, playVoice, messages])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const resetChat = () => {
    setMessages([{
      id: '0',
      role: 'assistant',
      content: "Hello again 💜 I'm ready to listen. What would you like to talk about?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }])
    setSessionCount(0)
    setShowQuickPrompts(true)
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-slate-50 dark:bg-[#0a0d1a] overflow-hidden">

      {/* ── LEFT SIDEBAR: AI info + Face Tracker ── */}
      <div className="hidden lg:flex w-72 shrink-0 flex-col gap-4 p-4 bg-white dark:bg-[#0f1629] border-r border-slate-200 dark:border-white/[0.06] overflow-y-auto">

        {/* AI Persona card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-500/10 dark:to-indigo-500/10 border border-violet-200 dark:border-violet-500/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center shadow-md">
              <Sparkles size={18} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-sm text-slate-900 dark:text-white">MindfulAI</p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">Online · SmolLM2</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            An empathetic AI wellness companion — trained to listen, support, and guide you through difficult moments.
          </p>
        </div>

        {/* Session stats */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.06] text-center">
            <p className="text-xl font-bold text-slate-900 dark:text-white">{sessionCount}</p>
            <p className="text-[9px] text-slate-400 uppercase tracking-wider font-medium">Messages</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.06] text-center">
            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 capitalize">{mentalState?.emotion || 'Neutral'}</p>
            <p className="text-[9px] text-slate-400 uppercase tracking-wider font-medium">Emotion</p>
          </div>
        </div>

        {/* AI Insight Card */}
        {mentalState && (
          <motion.div 
            initial={{ opacity: 0, y: 5 }} 
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-violet-600 text-white shadow-lg"
          >
            <div className="flex items-center gap-2 mb-2">
              <Activity size={14} />
              <p className="text-[10px] font-bold uppercase tracking-widest">Mental State</p>
            </div>
            <p className="text-sm font-bold capitalize mb-1">{mentalState.state}</p>
            <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-white h-full transition-all duration-1000" 
                  style={{ width: `${(mentalState.contribution?.text || 0.5) * 100}%` }} 
                />
            </div>
          </motion.div>
        )}

        {/* Recommended Action */}
        {lastAction && (
          <motion.div 
            initial={{ opacity: 0, x: -5 }} 
            animate={{ opacity: 1, x: 0 }}
            className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20"
          >
            <div className="flex items-center gap-2 mb-2 text-emerald-700 dark:text-emerald-400">
                <Zap size={14} />
                <p className="text-[10px] font-bold uppercase tracking-widest">Suggested Action</p>
            </div>
            <p className="text-xs font-medium text-slate-700 dark:text-slate-300 italic">
                "{lastAction}"
            </p>
          </motion.div>
        )}

        {/* Face Detector */}
        <div className="flex-1 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Face Tracking</p>
            <button
              onClick={() => setIsVideoActive(v => !v)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all border ${
                isVideoActive
                  ? 'bg-rose-100 dark:bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/30'
                  : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:border-violet-300 hover:text-violet-600'
              }`}
            >
              {isVideoActive ? <><VideoOff size={10} /> Stop</> : <><Video size={10} /> Enable</>}
            </button>
          </div>
          <div className="h-48 rounded-2xl overflow-hidden">
            <FaceDetector isActive={isVideoActive} onEmotionDetected={(e) => setDetectedEmotion(e)} />
          </div>
          {!isVideoActive && (
            <p className="text-[10px] text-slate-400 text-center leading-relaxed">
              Enable camera for real-time emotion detection to help MindfulAI understand you better.
            </p>
          )}
        </div>

        {/* Crisis button */}
        <button
          onClick={() => setShowCrisis(true)}
          className="flex items-center gap-2.5 p-3 rounded-xl bg-red-50 dark:bg-red-500/[0.08] border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/15 transition-all text-left w-full"
        >
          <AlertTriangle size={15} className="shrink-0" />
          <div>
            <p className="text-xs font-bold leading-none">Need immediate help?</p>
            <p className="text-[10px] mt-0.5 opacity-70">View crisis helplines</p>
          </div>
        </button>
      </div>

      {/* ── MAIN CHAT ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Chat header */}
        <div className="h-14 flex items-center justify-between px-5 bg-white dark:bg-[#0f1629] border-b border-slate-200 dark:border-white/[0.06] shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center">
                <Sparkles size={14} className="text-white" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">MindfulAI</p>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Online · Here for you
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCrisis(true)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/20 text-xs font-semibold"
            >
              <Phone size={12} /> Crisis
            </button>
            <button
              onClick={resetChat}
              title="Start new conversation"
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
            >
              <RotateCcw size={15} />
            </button>
          </div>
        </div>

        {/* Messages area */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto custom-scrollbar px-5 py-6 space-y-5"
        >
          <AnimatePresence initial={false}>
            {messages.map(msg => <MessageBubble key={msg.id} msg={msg} />)}
          </AnimatePresence>

          <AnimatePresence>
            {isTyping && <TypingIndicator />}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>

        {/* Quick prompts */}
        <AnimatePresence>
          {showQuickPrompts && messages.length <= 1 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-5 pb-3"
            >
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-2.5">Quick starters</p>
              <div className="flex flex-wrap gap-2">
                {QUICK_PROMPTS.map(p => (
                  <button
                    key={p}
                    onClick={() => handleSend(p)}
                    className="px-3 py-1.5 rounded-full text-xs font-medium border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:border-violet-300 dark:hover:border-violet-500/40 hover:text-violet-600 dark:hover:text-violet-300 hover:bg-violet-50 dark:hover:bg-violet-500/10 transition-all"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input bar */}
        <div className="px-5 pb-5 shrink-0">
          <div className="flex items-end gap-3 bg-white dark:bg-[#0f1629] border border-slate-200 dark:border-white/[0.08] rounded-2xl shadow-sm px-4 py-3 focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-400/15 transition-all">
            <button
               onClick={toggleRecording}
               className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all shrink-0 ${
                 isRecording 
                   ? 'bg-red-500 text-white animate-pulse' 
                   : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
               }`}
            >
               <Mic size={18} />
            </button>
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={e => {
                setInput(e.target.value)
                e.target.style.height = 'auto'
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
              }}
              onKeyDown={handleKeyDown}
              placeholder={isRecording ? "Listening..." : "Share how you're feeling..."}
              className="flex-1 bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 resize-none outline-none max-h-[120px] leading-relaxed"
              disabled={isTyping || isRecording}
            />
            <button
               onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
               className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all shrink-0 ${
                  isVoiceEnabled ? 'text-violet-500' : 'text-slate-300'
               }`}
               title={isVoiceEnabled ? "Mute AI Voice" : "Unmute AI Voice"}
            >
               <Activity size={16} />
            </button>
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping || isRecording}
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white shrink-0 disabled:opacity-40 hover:brightness-110 active:scale-95 transition-all shadow-md shadow-violet-500/25"
            >
              {isTyping ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
            </button>
          </div>
          <p className="text-center text-[10px] text-slate-400 mt-2">
            MindfulAI is an AI assistant — not a substitute for professional mental health care
          </p>
        </div>
      </div>

      {/* Crisis modal */}
      <AnimatePresence>
        {showCrisis && <CrisisModal onClose={() => setShowCrisis(false)} />}
      </AnimatePresence>
    </div>
  )
}
"use client"

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Send, 
  Mic, 
  Video, 
  MoreHorizontal, 
  Heart,
  Bot,
  User,
  Loader2,
  Sparkles,
  Shield,
  Zap,
  Brain,
  History,
  Info
} from 'lucide-react'
import { streamChat, type ChatChunk } from '@/lib/api'
import { AnimatedCompanion } from '@/components/animated-companion'

interface Message {
  role: 'ai' | 'user'
  content: string
  time: string
  emotion?: string
}

const MessageBubble = ({ role, content, time, emotion }: Message) => {
  const isAI = role === 'ai'
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex ${isAI ? 'justify-start' : 'justify-end'} mb-8`}
    >
      <div className={`flex gap-4 max-w-[85%] ${isAI ? 'flex-row' : 'flex-row-reverse'}`}>
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${isAI ? 'bg-primary text-white' : 'bg-black/5 text-muted-foreground border border-black/5'}`}>
          {isAI ? <Bot size={22} /> : <User size={22} />}
        </div>
        <div className={`space-y-2 ${isAI ? 'items-start' : 'items-end'}`}>
          <div className={`relative px-6 py-4 rounded-[2rem] text-sm leading-relaxed font-medium ${
            isAI 
              ? 'glass border border-white/10 text-foreground rounded-tl-none shadow-xl' 
              : 'bg-primary text-white shadow-2xl shadow-primary/20 rounded-tr-none'
          }`}>
            {content}
            {emotion && isAI && (
              <div className="mt-3 flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md text-white rounded-full text-[9px] font-black uppercase tracking-wider w-fit border border-white/10">
                <Sparkles size={10} />
                {emotion}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 px-2">
            <span suppressHydrationWarning className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-60">{time}</span>
            {isAI && <span className="text-[9px] font-black text-primary uppercase tracking-widest">Verified Support</span>}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: "Welcome to MindfulAI. I'm your dedicated neural companion. How can I support your emotional architecture today?", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isTyping) return

    const userMessage: Message = {
      role: 'user',
      content: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    const aiMessage: Message = {
      role: 'ai',
      content: '',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    setMessages(prev => [...prev, aiMessage])

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }))
      const stream = streamChat(input, history)
      
      let fullContent = ''
      for await (const chunk of stream) {
        if (chunk.type === 'token' && chunk.content) {
          fullContent += chunk.content
          setMessages(prev => {
            const newMessages = [...prev]
            const last = newMessages[newMessages.length - 1]
            if (last && last.role === 'ai') {
              last.content = fullContent
            }
            return newMessages
          })
        } else if (chunk.type === 'metadata' && chunk.emotion) {
          setMessages(prev => {
            const newMessages = [...prev]
            const last = newMessages[newMessages.length - 1]
            if (last && last.role === 'ai') {
              last.emotion = chunk.emotion
            }
            return newMessages
          })
        }
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="h-[calc(100vh-40px)] flex overflow-hidden m-4 gap-6">
      {/* Main Chat Interface */}
      <div className="flex-1 flex flex-col min-w-0 glass rounded-[3.5rem] border border-white/10 shadow-2xl relative overflow-hidden">
        {/* Animated Background Element */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.03] -z-10">
           <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#7e22ce_0%,transparent_50%)]" />
        </div>

        {/* Premium Header */}
        <div className="px-10 py-6 border-b border-divider flex items-center justify-between bg-white/40 backdrop-blur-xl z-10">
          <div className="flex items-center gap-5">
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse group-hover:bg-primary/40 transition-colors" />
              <div className="w-14 h-14 bg-gradient-to-br from-primary to-violet-600 rounded-[1.5rem] flex items-center justify-center border border-white/20 relative z-10 shadow-xl">
                <Brain className="text-white w-8 h-8" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-4 border-background rounded-full z-20 shadow-lg"></div>
            </div>
            <div>
              <h2 className="text-xl font-black text-foreground tracking-tighter leading-none mb-1">AI Therapist Alpha</h2>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">
                  {isTyping ? 'Synthesizing Response...' : 'Neural Link Active'}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="hidden md:flex gap-1.5 mr-4">
                <div className="p-2.5 glass rounded-xl border border-white/20 text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                   <History size={18} />
                </div>
                <div className="p-2.5 glass rounded-xl border border-white/20 text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                   <Info size={18} />
                </div>
             </div>
            <button className="p-3 hover:bg-black/5 rounded-2xl transition-all">
              <MoreHorizontal className="text-muted-foreground" size={24} />
            </button>
          </div>
        </div>

        {/* Scrollable Messages Area */}
        <div className="flex-1 overflow-y-auto p-10 scroll-smooth no-scrollbar">
          <div className="max-w-4xl mx-auto">
             <div className="text-center mb-12 opacity-40">
                <span suppressHydrationWarning className="px-4 py-1.5 glass rounded-full text-[9px] font-black uppercase tracking-[0.3em] border border-divider">
                   Session Started — {new Date().toLocaleDateString()}
                </span>
             </div>
            {messages.map((msg, idx) => (
              <MessageBubble key={idx} {...msg} />
            ))}
            {isTyping && (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start mb-8 ml-14">
                  <div className="glass px-6 py-4 rounded-[2rem] rounded-tl-none border border-white/10 flex gap-2 items-center">
                     <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                     <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                     <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
               </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Advanced Input Terminal */}
        <div className="p-10 bg-white/40 backdrop-blur-xl border-t border-divider">
          <div className="max-w-4xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-violet-400/20 rounded-[2.5rem] blur opacity-0 group-focus-within:opacity-100 transition duration-1000" />
            <div className="relative">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-3">
                <button className="p-3 text-muted-foreground hover:text-primary glass rounded-2xl transition-all hover:scale-110 active:scale-95 border border-white/20">
                  <Mic size={20} />
                </button>
                <button className="p-3 text-muted-foreground hover:text-primary glass rounded-2xl transition-all hover:scale-110 active:scale-95 border border-white/20">
                  <Video size={20} />
                </button>
              </div>
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Synchronize your thoughts..."
                disabled={isTyping}
                className="w-full pl-36 pr-20 py-6 bg-white border border-black/5 rounded-[2.5rem] outline-none text-foreground placeholder-muted-foreground/50 font-bold text-base focus:shadow-2xl focus:shadow-primary/5 transition-all disabled:opacity-50"
              />
              <button 
                onClick={handleSend}
                disabled={isTyping}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-primary text-white rounded-[1.8rem] shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
              >
                {isTyping ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} />}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-center gap-8 mt-6 opacity-40">
             <div className="flex items-center gap-2">
                <Shield size={12} className="text-emerald-500" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em]">Neural Shield Active</span>
             </div>
             <div className="flex items-center gap-2">
                <Zap size={12} className="text-primary" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em]">Quantum Encryption</span>
             </div>
          </div>
        </div>
      </div>

      {/* Intelligent Diagnostic Sidebar */}
      <div className="hidden lg:flex w-[400px] flex-col gap-6">
         <div className="glass flex-1 rounded-[3.5rem] border border-white/10 p-10 flex flex-col items-center text-center">
            <div className="relative mb-10">
               <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
               <AnimatedCompanion />
            </div>
            
            <div className="space-y-4 mb-10">
              <h3 className="text-2xl font-black text-foreground tracking-tighter">Neural Profile</h3>
              <p className="text-sm font-bold text-muted-foreground leading-relaxed opacity-70">
                Real-time synchronization with your emotional architecture. 
              </p>
            </div>

            <div className="w-full space-y-4">
              <div className="p-6 glass border border-white/10 rounded-[2rem] text-left group hover:border-primary/30 transition-all cursor-pointer">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Sparkles size={16} className="text-primary" />
                  </div>
                  <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Dominant State</span>
                </div>
                <p className="text-lg font-black text-foreground tracking-tight">Neutral Stability</p>
                <p className="text-[10px] font-bold text-muted-foreground mt-1">Confidence Index: 92%</p>
              </div>

              <div className="p-6 glass border border-white/10 rounded-[2rem] text-left group hover:border-emerald-500/30 transition-all cursor-pointer">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-emerald-500/10 rounded-lg">
                    <Heart size={16} className="text-emerald-500" />
                  </div>
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">Wellness Quotient</span>
                </div>
                <p className="text-lg font-black text-foreground tracking-tight">Recovering Momentum</p>
                <div className="w-full bg-black/5 h-1.5 rounded-full mt-3 overflow-hidden">
                   <div className="h-full bg-emerald-500 w-3/4 rounded-full" />
                </div>
              </div>
            </div>

            <div className="mt-auto pt-10 w-full">
               <div className="p-6 bg-primary/5 border border-primary/10 rounded-[2rem] text-left relative overflow-hidden group">
                  <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                     <Brain size={100} className="text-primary" />
                  </div>
                  <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-3">AI Synthesis</h4>
                  <p className="text-xs font-bold text-muted-foreground leading-relaxed italic opacity-80">
                    "Your linguistic patterns display increased structural integrity. Continue with reflective journaling."
                  </p>
               </div>
            </div>
         </div>
      </div>
    </div>
  )
}

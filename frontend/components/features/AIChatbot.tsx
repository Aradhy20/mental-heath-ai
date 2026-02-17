'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User as UserIcon, Sparkles, BrainCircuit, Terminal, Info } from 'lucide-react'
import { analysisAPI } from '@/lib/api'
import { useAuthStore } from '@/lib/store/auth-store'

interface Message {
  id: string
  content: string
  sender: 'user' | 'ai'
  timestamp: Date
  analysis?: any
}

const AIChatbot = () => {
  const { user } = useAuthStore()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `Identity verified. Greetings, ${user?.full_name || 'Seeker'}. I am your Neural Nexus assistant. How may I assist your mental clarity today?`,
      sender: 'ai',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (inputValue.trim() === '') return

    const userMsg: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMsg])
    setInputValue('')
    setIsTyping(true)

    try {
      const response = await analysisAPI.analyzeTextContextual(userMsg.content, user?.user_id || '1')
      const aiText = response.data.result?.contextual_response || "Analysis complete. I've logged your current state for further insight."

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        content: aiText,
        sender: 'ai',
        timestamp: new Date(),
        analysis: response.data.result?.emotion_analysis
      }

      setMessages(prev => [...prev, aiMsg])
    } catch (error) {
      console.error("Neural link error:", error)
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        content: "Signal interference detected. My neural link is momentarily unstable. Please resend your transmission.",
        sender: 'ai',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-full glass-panel border-indigo-500/20 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/5 bg-slate-900/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
            <BrainCircuit size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-widest uppercase">Neural Nexus v2.0</h2>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Active Connection</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-white/5 rounded-lg text-slate-500 transition-colors">
            <Terminal size={18} />
          </button>
          <button className="p-2 hover:bg-white/5 rounded-lg text-slate-500 transition-colors">
            <Info size={18} />
          </button>
        </div>
      </div>

      {/* Chat Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, x: message.sender === 'user' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[85%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${message.sender === 'user' ? 'bg-slate-800' : 'bg-indigo-600'
                  }`}>
                  {message.sender === 'user' ? <UserIcon size={16} className="text-slate-400" /> : <Bot size={16} className="text-white" />}
                </div>

                <div className="space-y-2">
                  <div className={`px-4 py-3 rounded-2xl ${message.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-slate-800/80 text-slate-200 border border-white/5 rounded-tl-none'
                    }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>

                    {message.analysis && (
                      <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-2">
                        <Sparkles size={12} className="text-indigo-400" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">
                          Detected: {message.analysis.emotion_label} ({(message.analysis.emotion_score * 100).toFixed(0)}%)
                        </span>
                      </div>
                    )}
                  </div>
                  <p className={`text-[10px] font-bold text-slate-500 uppercase tracking-widest ${message.sender === 'user' ? 'text-right' : 'text-left'
                    }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start gap-3"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Bot size={16} className="text-white" />
            </div>
            <div className="bg-slate-800/80 px-4 py-3 rounded-2xl rounded-tl-none flex gap-1 items-center">
              <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1, repeat: Infinity }} className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
              <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2 }} className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
              <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1, repeat: Infinity, delay: 0.4 }} className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-white/5 bg-slate-900/50">
        <div className="flex items-end gap-2 bg-slate-800 rounded-2xl p-2 border border-white/5 focus-within:border-indigo-500/50 transition-colors">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Log your thoughts here..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-slate-200 text-sm py-2 px-3 min-h-[44px] max-h-32 resize-none placeholder:text-slate-600 placeholder:font-bold placeholder:uppercase placeholder:tracking-widest placeholder:text-[10px]"
            rows={1}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={inputValue.trim() === '' || isTyping}
            className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all"
          >
            <Send size={18} />
          </motion.button>
        </div>
        <p className="text-[9px] text-slate-600 text-center mt-3 font-bold uppercase tracking-[0.2em]">
          Encrypted Neural Transmission • HIPAA Compliant Nodes
        </p>
      </div>
    </div>
  )
}

export default AIChatbot

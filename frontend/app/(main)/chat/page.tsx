"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Send, 
  Mic, 
  Video, 
  MoreHorizontal, 
  Paperclip,
  Smile,
  Bot,
  User,
  Heart
} from 'lucide-react'

const MessageBubble = ({ role, content, time }: any) => {
  const isAI = role === 'ai'
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex ${isAI ? 'justify-start' : 'justify-end'} mb-6`}
    >
      <div className={`flex gap-3 max-w-[80%] ${isAI ? 'flex-row' : 'flex-row-reverse'}`}>
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${isAI ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
          {isAI ? <Bot size={18} /> : <User size={18} />}
        </div>
        <div className={`space-y-1 ${isAI ? 'items-start' : 'items-end'}`}>
          <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
            isAI 
              ? 'bg-white border border-slate-100 text-slate-800 shadow-sm rounded-tl-none' 
              : 'bg-indigo-600 text-white shadow-md shadow-indigo-100 rounded-tr-none'
          }`}>
            {content}
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase">{time}</span>
        </div>
      </div>
    </motion.div>
  )
}

export default function ChatPage() {
  const [messages] = useState([
    { role: 'ai', content: "Hi Alex! I'm your MindfulAI companion. How are you feeling today?", time: '10:00 AM' },
    { role: 'user', content: "I've been feeling a bit overwhelmed with work lately.", time: '10:01 AM' },
    { role: 'ai', content: "I hear you. It's completely normal to feel that way when things pile up. Based on your recent check-ins, you've been working late. Would you like to try a 2-minute breathing exercise?", time: '10:02 AM' },
  ])

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col bg-slate-50">
      {/* Chat Header */}
      <div className="px-8 py-4 bg-white border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-10 h-10 bg-indigo-100 rounded-2xl flex items-center justify-center">
              <Heart className="text-indigo-600 w-6 h-6" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
          </div>
          <div>
            <h2 className="font-bold text-slate-900">Supportive Intelligence</h2>
            <p className="text-xs font-bold text-emerald-500 uppercase tracking-wider">Online & Listening</p>
          </div>
        </div>
        <button className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
          <MoreHorizontal className="text-slate-400" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-8 scroll-smooth">
        <div className="max-w-4xl mx-auto">
          {messages.map((msg, idx) => (
            <MessageBubble key={idx} {...msg} />
          ))}
        </div>
      </div>

      {/* Input Bar */}
      <div className="p-8 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
              <Mic size={20} />
            </button>
            <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
              <Video size={20} />
            </button>
          </div>
          <input 
            type="text" 
            placeholder="Type your message or use voice check-in..."
            className="w-full pl-28 pr-16 py-4 bg-slate-50 border-none rounded-2xl outline-none text-slate-700 placeholder-slate-400 font-medium focus:ring-2 focus:ring-indigo-100 transition-all"
          />
          <button className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
            <Send size={20} />
          </button>
        </div>
        <p className="text-center mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          End-to-End Encrypted & Private
        </p>
      </div>
    </div>
  )
}

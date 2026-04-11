'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Save, Plus, Search, Calendar, ChevronRight, PenTool, Sparkles, X, Focus, History, SortDesc, Filter } from 'lucide-react'
import { useAuthStore } from '@/lib/store/auth-store'
import api from '@/lib/api'
import * as Tabs from '@radix-ui/react-tabs'
import * as Select from '@radix-ui/react-select'

interface JournalEntry {
    id: string
    _id?: string
    title: string
    content: string
    created_at?: string
    createdAt?: string
}

export default function EnterpriseJournal() {
    const { user } = useAuthStore()
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [entries, setEntries] = useState<JournalEntry[]>([])
    const [isSaving, setIsSaving] = useState(false)
    const [activeId, setActiveId] = useState<string | null>(null)
    const [viewMode, setViewMode] = useState<"write" | "review">("write")

    useEffect(() => {
        setEntries([
             { id: '1', title: 'Feeling overwhelmed today 😔', content: 'Had a really tough day. Everything felt too much at once. But I got through it.', createdAt: new Date(Date.now() - 86400000).toISOString() },
             { id: '2', title: 'Setting better boundaries 💪', content: 'Decided to stop replying to messages after 9pm. My mental health comes first.', createdAt: new Date(Date.now() - 186400000).toISOString() }
        ])
    }, [])

    return (
        <div className="flex w-full h-[calc(100vh-5rem)] bg-[#0f172a] rounded-[2rem] border border-white/5 shadow-2xl overflow-hidden mt-4">
            
            {/* Left Pane - History & Lists */}
            <div className="w-[380px] bg-slate-900 border-r border-white/5 flex flex-col shrink-0">
               <div className="h-16 flex items-center justify-between px-6 border-b border-white/5 bg-slate-950">
                   <h2 className="font-bold text-white flex items-center gap-2"><History size={18} className="text-violet-400" /> My Past Entries</h2>
                   <button className="w-8 h-8 rounded-md bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-300">
                      <Plus size={16} />
                   </button>
               </div>
               
               <div className="p-4 border-b border-white/5">
                   <div className="relative mb-3">
                       <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                       <input 
                          disabled
                          placeholder="Search entries (mocked)..."
                          className="w-full bg-slate-800 rounded-md py-1.5 pl-9 pr-3 text-sm text-white placeholder-slate-500 border border-transparent focus:border-purple-500 outline-none"
                       />
                   </div>
                   <div className="flex items-center justify-between text-xs text-slate-400 font-medium pb-2 border-b border-white/5">
                       <div className="flex items-center gap-3">
                           <button className="flex items-center gap-1 hover:text-white"><SortDesc size={12}/> Date</button>
                           <button className="flex items-center gap-1 hover:text-white"><Filter size={12}/> Emotion</button>
                       </div>
                   </div>
               </div>

               <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                   {entries.map((entry) => (
                       <div 
                         key={entry.id} 
                         onClick={() => { setActiveId(entry.id); setTitle(entry.title); setContent(entry.content); }}
                         className={`p-4 rounded-xl cursor-pointer border transition-all ${
                             activeId === entry.id 
                             ? 'bg-purple-500/10 border-purple-500/30' 
                             : 'bg-white/5 border-transparent hover:border-white/10'
                         }`}
                       >
                           <h4 className={`font-semibold text-sm mb-1 ${activeId === entry.id ? 'text-purple-300' : 'text-slate-200'}`}>{entry.title}</h4>
                           <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{entry.content}</p>
                           <div className="text-[10px] text-slate-400 font-mono mt-3 opacity-60">
                               {new Date(entry.createdAt!).toLocaleDateString()}
                           </div>
                       </div>
                   ))}
               </div>
            </div>

            {/* Right Pane - Rich Editor */}
            <div className="flex-1 flex flex-col relative bg-slate-950">
               {/* Editor Toolbar */}
               <div className="h-16 flex items-center justify-between px-8 border-b border-white/5 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10 shrink-0">
                  <Tabs.Root value={viewMode} onValueChange={(val: any) => setViewMode(val)} className="flex items-center bg-slate-800 rounded-lg p-1 border border-white/5">
                      <Tabs.List className="flex">
                         <Tabs.Trigger value="write" className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === 'write' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}>Write</Tabs.Trigger>
                         <Tabs.Trigger value="review" className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all border border-transparent ${viewMode === 'review' ? 'bg-slate-700 text-white shadow-sm border-white/10' : 'text-slate-400 hover:text-white'}`}>RoBERTa Review</Tabs.Trigger>
                      </Tabs.List>
                  </Tabs.Root>

                  <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-slate-500">Auto-saved to Vault</span>
                      <button className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-bold shadow-[0_0_15px_rgba(168,85,247,0.4)] flex items-center gap-2">
                         <Save size={14} /> Commit Entry
                      </button>
                  </div>
               </div>

               {/* Editor Canvas */}
               <div className="flex-1 overflow-y-auto px-16 py-12 custom-scrollbar">
                   <div className="max-w-3xl mx-auto flex flex-col h-full">
                       {viewMode === 'write' ? (
                           <>
                              <input
                                  type="text"
                                  value={title}
                                  onChange={(e) => setTitle(e.target.value)}
                                  placeholder="Entry Title..."
                                  className="text-4xl font-bold bg-transparent border-none outline-none text-white placeholder:text-slate-700 mb-6 font-serif tracking-tight"
                              />
                              <textarea
                                  value={content}
                                  onChange={(e) => setContent(e.target.value)}
                                  placeholder="Begin typing to engage cognitive processing..."
                                  className="flex-1 w-full bg-transparent border-none outline-none resize-none text-lg leading-loose font-sans text-slate-300 placeholder:text-slate-700/50"
                              />
                           </>
                       ) : (
                           <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-4">
                               <Sparkles size={32} className="text-purple-500" />
                               <h3 className="text-xl font-bold text-white">Analysis Pending</h3>
                               <p className="text-sm">Click "Commit Entry" to dispatch this text back to the FastAPI RoBERTa engine for emotional parsing.</p>
                           </div>
                       )}
                   </div>
               </div>
            </div>
            
        </div>
    )
}

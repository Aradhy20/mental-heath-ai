'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FloatingCard from '@/components/anti-gravity/FloatingCard'
import { Save, PenTool, Mic, Trash2, History, ChevronRight, Sparkles, Plus } from 'lucide-react'
import { useAuthStore } from '@/lib/store/auth-store'

interface JournalEntry {
    id: string
    title: string
    content: string
    created_at: string
}

export default function JournalPage() {
    const { user } = useAuthStore()
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [entries, setEntries] = useState<JournalEntry[]>([])
    const [isSaving, setIsSaving] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [showHistory, setShowHistory] = useState(false)

    const fetchEntries = useCallback(async () => {
        const authStore = useAuthStore.getState();
        if (!authStore.token) return
        try {
            const journalUrl = process.env.NEXT_PUBLIC_MOOD_JOURNAL_URL || 'http://localhost:5000/api/journal';
            const response = await fetch(journalUrl, {
                headers: { 'Authorization': `Bearer ${authStore.token}` }
            })
            if (response.ok) {
                const data = await response.json()
                setEntries(data.entries)
            }
        } catch (error) {
            console.error('Failed to fetch entries:', error)
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchEntries()
    }, [fetchEntries])

    const handleSave = async () => {
        if (!content.trim()) return
        const authStore = useAuthStore.getState();
        if (!authStore.token) return
        setIsSaving(true)

        try {
            const journalUrl = process.env.NEXT_PUBLIC_MOOD_JOURNAL_URL || 'http://localhost:5000/api/journal';
            const response = await fetch(journalUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authStore.token}`
                },
                body: JSON.stringify({
                    title: title || 'Untitled Entry',
                    content: content,
                    is_private: true
                })
            })

            if (response.ok) {
                setTitle('')
                setContent('')
                fetchEntries()
            }
        } catch (error) {
            console.error('Failed to save entry:', error)
        } finally {
            setIsSaving(false)
        }
    }

    const deleteEntry = async (id: string) => {
        const authStore = useAuthStore.getState();
        if (!authStore.token) return
        try {
            const journalUrl = process.env.NEXT_PUBLIC_MOOD_JOURNAL_URL || 'http://localhost:5000/api/journal';
            const response = await fetch(`${journalUrl}/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${authStore.token}` }
            })
            if (response.ok) {
                setEntries(prev => prev.filter(e => (e as any)._id !== id))
            }
        } catch (error) {
            console.error('Failed to delete:', error)
        }
    }

    return (
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 h-[calc(100vh-140px)]">
            {/* Sidebar History - Desktop */}
            <div className="hidden md:flex flex-col w-72 h-full space-y-4">
                <div className="flex items-center justify-between px-2">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <History size={20} className="text-serenity-500" />
                        History
                    </h2>
                    <button
                        onClick={() => { setTitle(''); setContent(''); }}
                        className="p-2 bg-serenity-500/10 text-serenity-600 rounded-xl hover:bg-serenity-500/20 transition-all"
                    >
                        <Plus size={18} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
                    {entries.map((entry) => (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            key={(entry as any)._id || entry.id}
                            onClick={() => { setTitle(entry.title); setContent(entry.content); }}
                            className="p-4 rounded-2xl bg-white/50 dark:bg-white/5 border border-transparent hover:border-serenity-500/30 cursor-pointer group transition-all"
                        >
                            <div className="flex justify-between items-start">
                                <h4 className="font-bold text-sm truncate pr-2">{entry.title}</h4>
                                <button
                                    onClick={(e) => { e.stopPropagation(); deleteEntry((entry as any)._id || entry.id); }}
                                    className="opacity-0 group-hover:opacity-100 text-red-500 p-1 hover:bg-red-50 rounded-lg transition-all"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                            <p className="text-[10px] text-muted-foreground mt-1">
                                {new Date((entry as any).createdAt || entry.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </p>
                        </motion.div>
                    ))}
                    {entries.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground text-sm italic">
                            No entries yet. Start writing!
                        </div>
                    )}
                </div>
            </div>

            {/* Main Editor */}
            <div className="flex-1 flex flex-col space-y-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">Daily Journal</h1>
                        <p className="text-muted-foreground text-sm">Be honest with yourself.</p>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={isSaving || !content.trim()}
                        className="p-3 px-6 bg-serenity-600 text-white rounded-2xl font-bold shadow-lg shadow-serenity-600/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        {isSaving ? <Sparkles className="animate-spin" size={20} /> : <Save size={20} />}
                        Save Entry
                    </button>
                </div>

                <FloatingCard className="flex-1 relative overflow-hidden bg-[#fdfbf7] dark:bg-[#121212] border-none shadow-2xl p-0">
                    {/* Paper texture and lines overlay */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
                        style={{
                            backgroundImage: 'linear-gradient(#000 1.5px, transparent 1.5px)',
                            backgroundSize: '100% 2.2rem',
                            marginTop: '4rem'
                        }}
                    />

                    <div className="relative z-10 flex flex-col h-full p-8 md:p-12">
                        <div className="flex items-center gap-4 mb-8">
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Give this moment a title..."
                                className="text-2xl md:text-3xl font-black bg-transparent border-none outline-none placeholder:text-muted-foreground/30 w-full"
                            />
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-black/5 dark:bg-white/5 rounded-full text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                <PenTool size={12} />
                                Writing
                            </div>
                        </div>

                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="How are you really feeling? Talk about your wins, your fears, or just let it flow..."
                            className="flex-1 w-full bg-transparent border-none outline-none resize-none text-lg md:text-xl leading-[2.2rem] font-serif text-foreground/80 placeholder:text-muted-foreground/20 italic"
                        />

                        <div className="mt-8 flex items-center justify-between pt-6 border-t border-black/5 dark:border-white/5">
                            <div className="flex gap-4">
                                <button className="p-3 bg-black/5 dark:bg-white/5 rounded-2xl text-muted-foreground hover:bg-serenity-500/10 hover:text-serenity-600 transition-all">
                                    <Mic size={20} />
                                </button>
                            </div>
                            <div className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground flex items-center gap-2">
                                <Sparkles size={14} className="text-serenity-500" />
                                Your safe space
                            </div>
                        </div>
                    </div>
                </FloatingCard>
            </div>
        </div>
    )
}

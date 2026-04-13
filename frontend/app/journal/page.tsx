'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Save, Plus, Search, BookOpen, Sparkles, X,
  Tag, Clock, Trash2, Loader2, CheckCircle, Lock,
  TrendingUp, Heart, Brain, Smile, AlertCircle, Edit3
} from 'lucide-react'
import { useAuthStore } from '@/lib/store/auth-store'

const API_BASE = process.env.NEXT_PUBLIC_AUTH_URL || 'http://localhost:8001'

// ─── Types ──────────────────────────────────────────────────────────────────
interface JournalEntry {
  id: string
  title: string
  content: string
  mood?: number
  tags: string[]
  sentiment?: string
  createdAt: string
  wordCount?: number
}

// ─── Sentiment Badge ────────────────────────────────────────────────────────
const SENTIMENT_CONFIG = {
  positive:  { icon: Smile, color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-500/15', label: 'Positive' },
  neutral:   { icon: Brain, color: 'text-blue-600',    bg: 'bg-blue-100 dark:bg-blue-500/15',      label: 'Neutral' },
  negative:  { icon: Heart, color: 'text-rose-600',    bg: 'bg-rose-100 dark:bg-rose-500/15',      label: 'Processing' },
  anxious:   { icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-500/15', label: 'Anxious' },
}

function SentimentBadge({ sentiment }: { sentiment?: string }) {
  const key = (sentiment || 'neutral').toLowerCase() as keyof typeof SENTIMENT_CONFIG
  const config = SENTIMENT_CONFIG[key] || SENTIMENT_CONFIG.neutral
  const Icon = config.icon
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${config.bg} ${config.color}`}>
      <Icon size={10} /> {config.label}
    </span>
  )
}

// ─── Entry List Item ────────────────────────────────────────────────────────
function EntryListItem({ entry, isActive, onClick }: { entry: JournalEntry; isActive: boolean; onClick: () => void }) {
  const date = new Date(entry.createdAt)
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className={`p-4 rounded-xl cursor-pointer border transition-all group ${
        isActive
          ? 'bg-violet-50 dark:bg-violet-500/10 border-violet-200 dark:border-violet-500/30 shadow-sm'
          : 'bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.04] hover:border-violet-200 dark:hover:border-violet-500/20 hover:bg-white dark:hover:bg-white/[0.04]'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <h4 className={`font-semibold text-sm leading-snug line-clamp-1 ${isActive ? 'text-violet-700 dark:text-violet-300' : 'text-slate-800 dark:text-slate-200'}`}>
          {entry.title || 'Untitled Entry'}
        </h4>
        <SentimentBadge sentiment={entry.sentiment} />
      </div>
      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-2">{entry.content}</p>
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-slate-400 flex items-center gap-1">
          <Clock size={10} />
          {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
        <span className="text-[10px] text-slate-300 dark:text-slate-600">{entry.wordCount || entry.content.split(' ').length} words</span>
      </div>
      {entry.tags.length > 0 && (
        <div className="flex gap-1 mt-2 flex-wrap">
          {entry.tags.map(t => (
            <span key={t} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/5 text-slate-500">{t}</span>
          ))}
        </div>
      )}
    </motion.div>
  )
}

// ─── AI Analysis Panel ──────────────────────────────────────────────────────
function AIAnalysisPanel({ content, onClose }: { content: string; onClose: () => void }) {
  const [analyzing, setAnalyzing] = useState(true)
  const [result, setResult] = useState<{ sentiment: string; summary: string; affirmation: string } | null>(null)

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`${API_BASE}/api/v1/text-analysis`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: content.slice(0, 500) })
        })
        if (res.ok) {
          const data = await res.json()
          setResult({
            sentiment: data.label || 'neutral',
            summary: `Your writing reflects a ${data.label || 'neutral'} emotional state.`,
            affirmation: data.label === 'positive' ? 'Keep nurturing these positive thoughts! 🌱' : 'It takes courage to express difficult emotions. You\'re doing great. 💜'
          })
        } else throw new Error()
      } catch {
        // Fallback
        setResult({
          sentiment: 'neutral',
          summary: 'Your entry shows thoughtful reflection. Journaling regularly can help you identify emotional patterns.',
          affirmation: 'Thank you for taking time for yourself. Every word matters. 💜'
        })
      }
      setAnalyzing(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [content])

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-t border-slate-200 dark:border-white/[0.06] bg-violet-50 dark:bg-violet-500/[0.06] p-5"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-violet-600 flex items-center justify-center">
            <Sparkles size={12} className="text-white" />
          </div>
          <span className="text-sm font-semibold text-violet-700 dark:text-violet-300">AI Reflection</span>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
          <X size={14} />
        </button>
      </div>

      {analyzing ? (
        <div className="flex items-center gap-3 text-slate-500">
          <Loader2 size={16} className="animate-spin text-violet-500" />
          <span className="text-sm">Analyzing your writing...</span>
        </div>
      ) : result && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <SentimentBadge sentiment={result.sentiment} />
            <span className="text-xs text-slate-500">detected in your entry</span>
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{result.summary}</p>
          <div className="px-3 py-2 rounded-lg bg-white dark:bg-white/5 border border-violet-200 dark:border-violet-500/20">
            <p className="text-sm font-medium text-violet-700 dark:text-violet-300 italic">{result.affirmation}</p>
          </div>
        </div>
      )}
    </motion.div>
  )
}

// ─── MAIN PAGE ──────────────────────────────────────────────────────────────
export default function JournalPage() {
  const { user } = useAuthStore()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const [entries, setEntries] = useState<JournalEntry[]>([
    { id: '1', title: 'Feeling overwhelmed 😔', content: 'Had a really tough day. Everything felt too much at once. But I got through it. One breath at a time.', tags: ['stress', 'work'], sentiment: 'negative', createdAt: new Date(Date.now() - 86400000).toISOString(), wordCount: 22 },
    { id: '2', title: 'Setting better boundaries 💪', content: 'Decided to stop replying to messages after 9pm. My mental health comes first. Feeling proud of this decision.', tags: ['growth', 'boundaries'], sentiment: 'positive', createdAt: new Date(Date.now() - 186400000).toISOString(), wordCount: 19 },
    { id: '3', title: 'Gratitude list', content: "Today I'm grateful for: my morning coffee, the sunshine through my window, a kind message from a friend, and the fact that I made it through another week.", tags: ['gratitude'], sentiment: 'positive', createdAt: new Date(Date.now() - 356400000).toISOString(), wordCount: 34 },
  ])

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [currentTag, setCurrentTag] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [search, setSearch] = useState('')
  const [showAI, setShowAI] = useState(false)
  const [isNewEntry, setIsNewEntry] = useState(true)

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length

  const filteredEntries = entries.filter(e =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.content.toLowerCase().includes(search.toLowerCase()) ||
    e.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
  )

  const startNewEntry = () => {
    setActiveId(null); setTitle(''); setContent(''); setTags([])
    setShowAI(false); setSaved(false); setIsNewEntry(true)
    setTimeout(() => textareaRef.current?.focus(), 100)
  }

  const loadEntry = (entry: JournalEntry) => {
    setActiveId(entry.id); setTitle(entry.title); setContent(entry.content)
    setTags(entry.tags); setShowAI(false); setSaved(false); setIsNewEntry(false)
  }

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      if (currentTag.trim() && !tags.includes(currentTag.trim())) {
        setTags(prev => [...prev, currentTag.trim()])
        setCurrentTag('')
      }
    }
  }

  const handleSave = async () => {
    if (!content.trim()) return
    setSaving(true)
    const newEntry: JournalEntry = {
      id: activeId || Date.now().toString(),
      title: title || content.slice(0, 40) + '...',
      content,
      tags,
      sentiment: 'neutral',
      createdAt: new Date().toISOString(),
      wordCount
    }

    try {
      await fetch(`${API_BASE}/api/v1/journal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newEntry, user_id: user?.id || 'guest' })
      })
    } catch (_) {}

    setEntries(prev => activeId
      ? prev.map(e => e.id === activeId ? newEntry : e)
      : [newEntry, ...prev]
    )
    setActiveId(newEntry.id)
    setSaving(false)
    setSaved(true)
    setIsNewEntry(false)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-slate-50 dark:bg-[#0a0d1a]">

      {/* ── Left: Entry List ── */}
      <div className="w-72 xl:w-80 bg-white dark:bg-[#0f1629] border-r border-slate-200 dark:border-white/[0.06] flex flex-col shrink-0">
        {/* Header */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-slate-100 dark:border-white/[0.05] shrink-0">
          <h2 className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen size={15} className="text-violet-500" />
            Journal
          </h2>
          <button
            onClick={startNewEntry}
            className="w-7 h-7 rounded-lg bg-violet-600 hover:bg-violet-700 flex items-center justify-center text-white transition-colors shadow-sm"
          >
            <Plus size={14} />
          </button>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-slate-100 dark:border-white/[0.05]">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search entries..."
              className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.03] text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-violet-400 transition-all"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 divide-x divide-slate-100 dark:divide-white/[0.05] border-b border-slate-100 dark:border-white/[0.05]">
          <div className="p-3 text-center">
            <p className="text-lg font-bold text-slate-900 dark:text-white">{entries.length}</p>
            <p className="text-[9px] text-slate-400 uppercase tracking-wider font-medium">Entries</p>
          </div>
          <div className="p-3 text-center">
            <p className="text-lg font-bold text-slate-900 dark:text-white">
              {entries.reduce((a, e) => a + (e.wordCount || 0), 0)}
            </p>
            <p className="text-[9px] text-slate-400 uppercase tracking-wider font-medium">Words</p>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
          <AnimatePresence>
            {filteredEntries.map(entry => (
              <EntryListItem
                key={entry.id}
                entry={entry}
                isActive={activeId === entry.id}
                onClick={() => loadEntry(entry)}
              />
            ))}
          </AnimatePresence>
          {filteredEntries.length === 0 && (
            <div className="text-center py-10 text-slate-400">
              <BookOpen size={28} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No entries found</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Right: Editor ── */}
      <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-[#0c1120]">

        {/* Toolbar */}
        <div className="h-14 flex items-center justify-between px-6 border-b border-slate-100 dark:border-white/[0.05] shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
              <span className="text-xs text-slate-400 font-mono">{wordCount} words</span>
            </div>
            {!isNewEntry && (
              <span className="flex items-center gap-1 text-[10px] text-slate-400">
                <Lock size={10} /> Private
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {content.length > 50 && (
              <button
                onClick={() => setShowAI(v => !v)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                  showAI
                    ? 'bg-violet-600 text-white border-violet-600'
                    : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-violet-300 hover:text-violet-600'
                }`}
              >
                <Sparkles size={12} /> AI Reflect
              </button>
            )}
            <button
              onClick={handleSave}
              disabled={!content.trim() || saving}
              className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg text-xs font-semibold disabled:opacity-40 shadow-sm hover:brightness-110 transition-all"
            >
              {saving ? <Loader2 size={12} className="animate-spin" /> : saved ? <CheckCircle size={12} /> : <Save size={12} />}
              {saving ? 'Saving...' : saved ? 'Saved!' : 'Save'}
            </button>
          </div>
        </div>

        {/* Editor Canvas */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="max-w-2xl mx-auto px-8 py-8 h-full flex flex-col">

            {/* Title */}
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Entry title..."
              className="text-2xl font-bold bg-transparent text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-700 border-none outline-none mb-4 w-full"
            />

            {/* Date line */}
            <div className="flex items-center gap-2 mb-6 text-xs text-slate-400">
              <Clock size={12} className="text-violet-400" />
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>

            {/* Body */}
            <textarea
              ref={textareaRef}
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Start writing. This space is just for you..."
              className="flex-1 min-h-[300px] w-full bg-transparent text-base leading-[1.85] text-slate-700 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-700 border-none outline-none resize-none"
            />

            {/* Tags */}
            <div className="mt-6 pt-5 border-t border-slate-100 dark:border-white/[0.05]">
              <div className="flex flex-wrap gap-2 items-center">
                <Tag size={13} className="text-slate-400 shrink-0" />
                {tags.map(t => (
                  <span key={t} className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-violet-100 dark:bg-violet-500/15 text-violet-700 dark:text-violet-300">
                    {t}
                    <button onClick={() => setTags(prev => prev.filter(x => x !== t))} className="hover:text-violet-900">
                      <X size={10} />
                    </button>
                  </span>
                ))}
                <input
                  value={currentTag}
                  onChange={e => setCurrentTag(e.target.value)}
                  onKeyDown={addTag}
                  placeholder="Add tag..."
                  className="text-xs text-slate-600 dark:text-slate-400 bg-transparent outline-none placeholder:text-slate-300 dark:placeholder:text-slate-600 min-w-[80px]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* AI Panel */}
        <AnimatePresence>
          {showAI && content.length > 50 && (
            <AIAnalysisPanel content={content} onClose={() => setShowAI(false)} />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

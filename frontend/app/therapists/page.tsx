'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, MapPin, Phone, Star, ExternalLink, Navigation,
  Filter, X, SlidersHorizontal, AlertTriangle, Heart,
  Dumbbell, Brain, Leaf, ChevronDown, Loader2, Clock,
  CheckCircle, Globe
} from 'lucide-react'

// ─── Types ──────────────────────────────────────────────────────────────────
interface Resource {
  id: string
  name: string
  type: ResourceType
  address: string
  phone?: string
  distance?: string
  distanceKm?: number
  rating: number
  reviews?: number
  isOpen?: boolean
  tags: string[]
  lat?: number
  lng?: number
  website?: string
}

type ResourceType = 'Therapist' | 'Psychiatrist' | 'Psychologist' | 'Yoga Studio' | 'Gym' | 'Meditation Center' | 'Crisis Center'

// ─── Static Resources (India-focused) ───────────────────────────────────────
const STATIC_RESOURCES: Resource[] = [
  {
    id: '1',
    name: 'Vandrevala Foundation',
    type: 'Crisis Center',
    address: 'National Helpline – All India',
    phone: '1860-2662-345',
    distance: 'Call Anytime',
    rating: 4.9,
    reviews: 2840,
    isOpen: true,
    tags: ['24/7', 'Free', 'Crisis', 'Hindi'],
    website: 'https://www.vandrevalafoundation.com'
  },
  {
    id: '2',
    name: 'iCall by TISS',
    type: 'Therapist',
    address: 'Tata Institute of Social Sciences, Mumbai',
    phone: '9152987821',
    distance: 'Call / Chat',
    rating: 4.8,
    reviews: 1920,
    isOpen: true,
    tags: ['Youth', 'Free', 'Counseling', 'Online'],
    website: 'https://icallhelpline.org'
  },
  {
    id: '3',
    name: 'Mindful Care Clinic',
    type: 'Psychiatrist',
    address: 'Indiranagar, Bengaluru, Karnataka 560038',
    phone: '+91 98765 43210',
    distance: '2.4 km',
    rating: 4.7,
    reviews: 340,
    isOpen: true,
    tags: ['In-person', 'OPD', 'CBT', 'Insurance'],
    lat: 12.9784,
    lng: 77.6408
  },
  {
    id: '4',
    name: 'Serenity Wellness Center',
    type: 'Therapist',
    address: 'Greater Kailash II, New Delhi 110048',
    phone: '+91 99887 76655',
    distance: '3.8 km',
    rating: 4.6,
    reviews: 210,
    isOpen: false,
    tags: ['Online', 'CBT', 'Anxiety', 'Depression'],
    lat: 28.5480,
    lng: 77.2270
  },
  {
    id: '5',
    name: 'NIMHANS (National Institute)',
    type: 'Psychiatrist',
    address: 'Hosur Road, Bengaluru, Karnataka 560029',
    phone: '080-46110007',
    distance: '6.2 km',
    rating: 4.9,
    reviews: 5400,
    isOpen: true,
    tags: ['Govt', 'Free OPD', 'Research', 'Expert'],
    website: 'https://nimhans.ac.in',
    lat: 12.9428,
    lng: 77.5963
  },
  {
    id: '6',
    name: 'Satyananda Yoga Centre',
    type: 'Yoga Studio',
    address: 'Koramangala, Bengaluru 560034',
    phone: '+91 80 4128 4567',
    distance: '1.1 km',
    rating: 4.5,
    reviews: 480,
    isOpen: true,
    tags: ['Yoga', 'Meditation', 'Wellness', 'Morning'],
    lat: 12.9344,
    lng: 77.6100
  },
  {
    id: '7',
    name: 'Cult.fit Wellness Hub',
    type: 'Gym',
    address: 'HSR Layout, Bengaluru 560102',
    phone: '+91 80 4567 8900',
    distance: '3.5 km',
    rating: 4.4,
    reviews: 1230,
    isOpen: true,
    tags: ['Gym', 'Functional', 'Zumba', 'Mental Wellness'],
    lat: 12.9116,
    lng: 77.6374
  },
  {
    id: '8',
    name: 'The Mind Research Foundation',
    type: 'Psychologist',
    address: 'R.A. Puram, Chennai 600028',
    phone: '+91 44 2467 3456',
    distance: '9.7 km',
    rating: 4.8,
    reviews: 290,
    isOpen: true,
    tags: ['Research', 'CBT', 'Family Therapy', 'Child'],
    website: 'https://mindfoundation.org.in',
    lat: 13.0141,
    lng: 80.2676
  }
]

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// ─── Type Config ───────────────────────────────────────────────────────────
const TYPE_CONFIG: Record<ResourceType, { icon: React.ElementType; color: string; bg: string }> = {
  'Therapist':         { icon: Brain,    color: 'text-violet-600', bg: 'bg-violet-100 dark:bg-violet-500/15' },
  'Psychiatrist':      { icon: Heart,    color: 'text-rose-600',   bg: 'bg-rose-100 dark:bg-rose-500/15' },
  'Psychologist':      { icon: Brain,    color: 'text-indigo-600', bg: 'bg-indigo-100 dark:bg-indigo-500/15' },
  'Yoga Studio':       { icon: Leaf,     color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-500/15' },
  'Gym':               { icon: Dumbbell, color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-500/15' },
  'Meditation Center': { icon: Leaf,     color: 'text-teal-600',   bg: 'bg-teal-100 dark:bg-teal-500/15' },
  'Crisis Center':     { icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-500/15' },
}

// ─── Resource Card ─────────────────────────────────────────────────────────
function ResourceCard({ r, isSelected, onSelect }: { r: Resource; isSelected: boolean; onSelect: () => void }) {
  const config = TYPE_CONFIG[r.type] || TYPE_CONFIG['Therapist']
  const Icon = config.icon

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      onClick={onSelect}
      className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 group ${
        isSelected
          ? 'border-violet-400 bg-violet-50 dark:bg-violet-500/10 dark:border-violet-500/50 shadow-md'
          : 'border-slate-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] hover:border-violet-200 dark:hover:border-violet-500/30 hover:shadow-sm'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center shrink-0 mt-0.5`}>
          <Icon size={18} className={config.color} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-sm text-slate-900 dark:text-white leading-tight">{r.name}</h3>
            <div className="flex items-center gap-0.5 shrink-0">
              <Star size={11} className="text-amber-400 fill-amber-400" />
              <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">{r.rating}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${config.bg} ${config.color}`}>
              {r.type}
            </span>
            {r.isOpen !== undefined && (
              <span className={`flex items-center gap-1 text-[10px] font-medium ${r.isOpen ? 'text-emerald-600' : 'text-slate-400'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${r.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                {r.isOpen ? 'Open' : 'Closed'}
              </span>
            )}
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-1 mb-1.5">
            <MapPin size={11} className="mt-0.5 shrink-0" />
            <span className="line-clamp-1">{r.address}</span>
          </p>

          {r.distance && (
            <p className="text-[11px] text-slate-400 flex items-center gap-1 mb-2">
              <Navigation size={11} className="shrink-0" />
              {r.distance}
            </p>
          )}

          <div className="flex flex-wrap gap-1 mb-3">
            {r.tags.slice(0, 3).map(tag => (
              <span key={tag} className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            {r.phone && (
              <a
                href={`tel:${r.phone}`}
                onClick={e => e.stopPropagation()}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-[11px] font-semibold transition-colors"
              >
                <Phone size={11} /> Call
              </a>
            )}
            {r.website && (
              <a
                href={r.website}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="flex items-center justify-center gap-1.5 px-3 py-1.5 border border-slate-200 dark:border-white/10 rounded-lg text-[11px] font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
              >
                <Globe size={11} /> Website
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────
export default function TherapistsPage() {
  const [search, setSearch] = useState('')
  const [activeType, setActiveType] = useState<string>('All')
  const [sortBy, setSortBy] = useState<'distance' | 'rating'>('rating')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [mapQuery, setMapQuery] = useState('mental health clinics India')
  const [showFilters, setShowFilters] = useState(false)
  const [resources, setResources] = useState<Resource[]>(STATIC_RESOURCES)
  const [isLoading, setIsLoading] = useState(false)

  const fetchResources = useCallback(async () => {
    setIsLoading(true)
    try {
        const typeMap: any = { 'Therapist': 'mental_health', 'Psychiatrist': 'hospital', 'Psychologist': 'mental_health', 'Yoga Studio': 'yoga', 'Gym': 'gym' }
        const queryType = typeMap[activeType] || 'mental_health'
        
        // Use Indian coordinates (Bangalore) as default base for finding resources
        const res = await fetch(`${API_BASE}/api/v1/nearby-resources?type=${queryType}&lat=12.9716&lon=77.5946&radius=10000`)
        if (res.ok) {
            const data = await res.json()
            const mapped = data.results.map((r: any) => ({
                ...r,
                lng: r.lon, // map backend 'lon' to frontend 'lng'
                rating: r.rating || 4.5,
                tags: r.tags || ['Verified'],
                type: r.type || activeType
            }))
            setResources(mapped)
        }
    } catch (e) {
        console.error("Failed to fetch resources", e)
    } finally {
        setIsLoading(false)
    }
  }, [activeType])

  useEffect(() => {
    fetchResources()
  }, [fetchResources])

  const types = ['All', 'Therapist', 'Psychiatrist', 'Psychologist', 'Yoga Studio', 'Gym', 'Crisis Center']

  const filtered = resources.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.address.toLowerCase().includes(search.toLowerCase()) ||
      r.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
    const matchType = activeType === 'All' || r.type === activeType
    return matchSearch && matchType
  }).sort((a, b) => sortBy === 'rating' ? b.rating - a.rating : (a.distanceKm || 99) - (b.distanceKm || 99))

  // Update iframe map when search changes
  const handleSearchMap = useCallback(() => {
    const q = search || (activeType !== 'All' ? activeType : 'mental health support')
    setMapQuery(`${q} India`)
  }, [search, activeType])

  useEffect(() => {
    const t = setTimeout(handleSearchMap, 600)
    return () => clearTimeout(t)
  }, [handleSearchMap])

  const selectedResource = resources.find(r => r.id === selectedId)

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-slate-50 dark:bg-[#0a0d1a]">

      {/* ── Header ── */}
      <div className="px-6 py-5 bg-white dark:bg-[#0f1629] border-b border-slate-200 dark:border-white/[0.06] shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin size={20} className="text-violet-600" /> Find Nearby Support
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Therapists, psychiatrists, wellness centers & crisis lines — all in one place.
            </p>
          </div>

          {/* Emergency card */}
          <div className="flex items-center gap-3 px-4 py-2.5 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl">
            <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center shrink-0">
              <AlertTriangle size={14} className="text-white" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider">Emergency (24/7)</p>
              <a href="tel:9152987821" className="text-base font-bold text-red-700 dark:text-red-300 hover:underline">9152987821</a>
            </div>
          </div>
        </div>

        {/* Search & Filter bar */}
        <div className="mt-4 flex items-center gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search 'Therapist in Mumbai'..."
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 transition-all"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X size={14} />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(v => !v)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${showFilters ? 'bg-violet-600 text-white border-violet-600' : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-violet-300'}`}
          >
            <SlidersHorizontal size={15} /> Filters
          </button>
        </div>

        {/* Filter chips */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-3 flex items-center gap-2 flex-wrap">
                <span className="text-xs text-slate-400 font-medium">Type:</span>
                {types.map(t => (
                  <button
                    key={t}
                    onClick={() => setActiveType(t)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      activeType === t
                        ? 'bg-violet-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-violet-100 dark:hover:bg-violet-500/10 hover:text-violet-700 dark:hover:text-violet-300'
                    }`}
                  >
                    {t}
                  </button>
                ))}
                <div className="ml-auto flex items-center gap-2">
                  <span className="text-xs text-slate-400">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as any)}
                    className="text-xs font-medium py-1.5 px-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-700 dark:text-slate-300 outline-none"
                  >
                    <option value="rating">Best Rated</option>
                    <option value="distance">Nearest</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Main Content ── */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 overflow-hidden">

        {/* Left: Map */}
        <div className="lg:col-span-3 relative overflow-hidden bg-slate-200 dark:bg-slate-800">
          <iframe
            key={mapQuery}
            title="Therapist Map"
            width="100%"
            height="100%"
            frameBorder="0"
            src={`https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed&z=12`}
            className="w-full h-full"
            loading="lazy"
          />

          {/* Map overlay gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-50/60 dark:from-slate-900/60 to-transparent pointer-events-none" />

          {/* Map results count */}
          <div className="absolute top-4 left-4 bg-white dark:bg-slate-900 rounded-xl px-3 py-2 border border-slate-200 dark:border-white/10 shadow-md">
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span className="text-violet-600 font-bold">{filtered.length}</span> centers found
            </p>
          </div>
        </div>

        {/* Right: Listings */}
        <div className="lg:col-span-2 overflow-y-auto custom-scrollbar bg-slate-50 dark:bg-[#0a0d1a]">
          <div className="p-4 space-y-3">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider px-1">
              {filtered.length} Result{filtered.length !== 1 ? 's' : ''} · {activeType === 'All' ? 'All Types' : activeType}
            </p>
            <AnimatePresence mode="popLayout">
              {filtered.map(r => (
                <ResourceCard
                  key={r.id}
                  r={r}
                  isSelected={selectedId === r.id}
                  onSelect={() => setSelectedId(prev => prev === r.id ? null : r.id)}
                />
              ))}
            </AnimatePresence>
            {filtered.length === 0 && (
              <div className="text-center py-16 text-slate-400">
                <MapPin size={32} className="mx-auto mb-3 opacity-30" />
                <p className="font-medium">No results found</p>
                <p className="text-sm mt-1">Try a different search or filter</p>
                <button onClick={() => { setSearch(''); setActiveType('All') }} className="mt-4 text-violet-600 text-sm font-medium hover:underline">
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

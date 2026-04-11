'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, MapPin, Phone, Clock, Star, ExternalLink, ShieldAlert, Navigation } from 'lucide-react'

// Dummy data for verified centers
const CLINICS = [
    {
        id: 1,
        name: "Vandrevala Foundation",
        type: "Crisis Center",
        address: "Mumbai, India (National Helpline)",
        phone: "1860-2662-345",
        distance: "Online / National",
        rating: 4.9,
        isOpen: true,
        tags: ["24/7", "Free", "Crisis"]
    },
    {
        id: 2,
        name: "iCall By TISS",
        type: "Counseling",
        address: "Tata Institute of Social Sciences, Mumbai",
        phone: "9152987821",
        distance: "Call/Chat",
        rating: 4.8,
        isOpen: true,
        tags: ["Youth", "Counseling", "Free"]
    },
    {
        id: 3,
        name: "Mindful Care Clinic",
        type: "Psychiatrist",
        address: "Indiranagar, Bangalore",
        phone: "+91 98765 43210",
        distance: "2.4 km away",
        rating: 4.6,
        isOpen: true,
        tags: ["In-person", "Therapy"]
    },
    {
        id: 4,
        name: "Serenity Wellness",
        type: "Therapist",
        address: "Greater Kailash, New Delhi",
        phone: "+91 99887 76655",
        distance: "4.1 km away",
        rating: 4.5,
        isOpen: false,
        tags: ["Online", "CBT", "Anxiety"]
    }
]

export default function FindDoctorPage() {
    const [search, setSearch] = useState('')
    const [activeFilter, setActiveFilter] = useState('All')

    const filters = ['All', 'Therapist', 'Psychiatrist', 'Crisis Center', 'Counseling']

    const filteredClinics = CLINICS.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.address.toLowerCase().includes(search.toLowerCase())
        const matchesFilter = activeFilter === 'All' || c.type === activeFilter
        return matchesSearch && matchesFilter
    })

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col h-full gap-6 p-2"
        >
            {/* Header & Emergency Banner */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-2">
                        <MapPin className="text-rose-500" /> Find Support Near You
                    </h1>
                    <p className="text-slate-400 mt-1">Discover verified mental health professionals and crisis centers.</p>
                </div>
                {/* Emergency Card */}
                <motion.div 
                    animate={{ scale: [1, 1.02, 1] }} 
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 flex items-center gap-4 max-w-sm"
                >
                    <div className="bg-rose-500 p-3 rounded-full text-white">
                        <ShieldAlert size={20} />
                    </div>
                    <div>
                        <p className="text-xs text-rose-400 font-bold uppercase tracking-wider">Emergency Help (24/7)</p>
                        <p className="text-white font-black text-lg">9152987821</p>
                    </div>
                </motion.div>
            </div>

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-14rem)]">
                
                {/* Left Side: Map Container */}
                <div className="lg:col-span-2 rounded-3xl overflow-hidden border border-white/10 relative shadow-2xl bg-slate-900 filter group">
                    <div className="absolute top-4 left-4 right-4 z-10 flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="text"
                                placeholder="Search 'Psychiatrist in Mumbai'..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-slate-950/80 backdrop-blur-md border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500/50 focus:ring-2 ring-indigo-500/20 transition-all shadow-xl"
                            />
                        </div>
                    </div>
                    {/* Free Google Maps Embed without API Key - Defaults to querying "mental health clinics" combined with the search term */}
                    <iframe 
                        width="100%" 
                        height="100%" 
                        frameBorder="0" 
                        scrolling="no" 
                        marginHeight={0} 
                        marginWidth={0} 
                        className="grayscale-[30%] opacity-90 transition-all duration-500 group-hover:grayscale-0 group-hover:opacity-100"
                        src={`https://maps.google.com/maps?q=mental+health+clinics+${search || 'india'}&output=embed`}
                    ></iframe>
                </div>

                {/* Right Side: Listings */}
                <div className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
                    {/* Filters */}
                    <div className="flex flex-wrap gap-2 sticky top-0 bg-slate-950/80 backdrop-blur-xl py-2 z-10">
                        {filters.map(f => (
                            <button
                                key={f}
                                onClick={() => setActiveFilter(f)}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${activeFilter === f ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-slate-900 border border-white/5 text-slate-400 hover:text-white hover:bg-slate-800'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>

                    <AnimatePresence mode="popLayout">
                        {filteredClinics.map((clinic, index) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                                transition={{ duration: 0.2, delay: index * 0.05 }}
                                key={clinic.id}
                                className="bg-slate-900 border border-white/5 rounded-2xl p-5 hover:border-indigo-500/30 transition-all group"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] uppercase font-black tracking-widest text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">{clinic.type}</span>
                                            {clinic.isOpen ? (
                                                <span className="flex items-center gap-1 text-[10px] text-emerald-400"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div> Open</span>
                                            ) : (
                                                <span className="text-[10px] text-slate-500">Closed</span>
                                            )}
                                        </div>
                                        <h3 className="text-whit font-bold text-lg">{clinic.name}</h3>
                                    </div>
                                    <div className="flex items-center gap-1 text-amber-400 bg-amber-400/10 px-2 py-1 rounded-lg">
                                        <Star size={12} className="fill-amber-400" />
                                        <span className="text-xs font-bold text-amber-500">{clinic.rating}</span>
                                    </div>
                                </div>

                                <div className="space-y-2 text-sm text-slate-400 mb-4">
                                    <p className="flex items-center gap-2"><MapPin size={14} className="text-slate-500" /> {clinic.address}</p>
                                    <p className="flex items-center gap-2"><Navigation size={14} className="text-slate-500" /> {clinic.distance}</p>
                                </div>

                                <div className="flex items-center gap-2 mt-4">
                                    <button className="flex-1 bg-white/5 hover:bg-white/10 text-white rounded-xl py-2 flex items-center justify-center gap-2 transition-colors text-sm font-bold">
                                        <Phone size={14} /> Contact
                                    </button>
                                    <button className="w-10 h-10 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl flex items-center justify-center transition-all shadow-lg shadow-indigo-500/20 group-hover:scale-105">
                                        <ExternalLink size={16} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                        {filteredClinics.length === 0 && (
                            <motion.div className="text-center py-10 opacity-50">
                                <Search className="mx-auto mb-2 opacity-50" />
                                <p>No matching centers found.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
            {/* Custom scrollbar styles included locally if needed, but globals.css typically handles it */}
        </motion.div>
    )
}

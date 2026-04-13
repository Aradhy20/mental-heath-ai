'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Video, Calendar, Clock, Star, MessageCircle, CheckCircle2, ChevronRight, X, User, Phone, ShieldCheck } from 'lucide-react'

const EXPERTS = [
    {
        id: 'dr-ravi',
        name: "Dr. Ravi Sharma",
        title: "Senior Psychiatrist",
        exp: "15+ years",
        rating: 4.9,
        reviews: 420,
        price: "$120",
        img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop",
        tags: ["Anxiety", "ADHD", "Clinical"],
        live: true,
    },
    {
        id: 'sarah',
        name: "Dr. Sarah Jenkins",
        title: "CBT Specialist",
        exp: "8 years",
        rating: 4.8,
        reviews: 215,
        price: "$95",
        img: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop",
        tags: ["CBT", "Trauma", "Depression"],
        live: false,
    },
    {
        id: 'dr-lee',
        name: "Dr. Amanda Lee",
        title: "Neuropsychologist",
        exp: "12 years",
        rating: 5.0,
        reviews: 188,
        price: "$150",
        img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop",
        tags: ["Burnout", "Sleep", "Stress"],
        live: true,
    },
    {
        id: 'michael',
        name: "Michael Chen",
        title: "Holistic Health Coach",
        exp: "6 years",
        rating: 4.7,
        reviews: 95,
        price: "$75",
        img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
        tags: ["Mindfulness", "Life Balance"],
        live: true,
    }
]

export default function VirtualConsultPage() {
    const [selectedExpert, setSelectedExpert] = useState<typeof EXPERTS[0] | null>(null)
    const [bookingStep, setBookingStep] = useState(1) // 1: list, 2: details, 3: success

    const handleBook = (expert: typeof EXPERTS[0]) => {
        setSelectedExpert(expert)
        setBookingStep(2)
    }

    return (
        <div className="min-h-full bg-slate-50 dark:bg-[#0a0d1a] p-6 lg:p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                           Virtual Consult <Video size={24} className="text-violet-500" />
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Professional 1-on-1 sessions with verified mental health experts.</p>
                    </div>
                    <div className="flex items-center gap-4 bg-white dark:bg-white/5 px-4 py-2 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
                         <div className="flex -space-x-2">
                             {EXPERTS.slice(0, 3).map(e => <img key={e.id} src={e.img} className="w-8 h-8 rounded-full border-2 border-white dark:border-[#0f1629]" />)}
                         </div>
                         <p className="text-xs font-bold text-slate-600 dark:text-slate-300">12 Specialists Live</p>
                    </div>
                </div>

                {/* Info Card */}
                <div className="bg-gradient-to-r from-violet-600/5 to-indigo-600/5 border border-violet-500/10 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6">
                     <div className="w-12 h-12 rounded-2xl bg-white dark:bg-white/10 flex items-center justify-center text-violet-600 dark:text-violet-400 shadow-sm">
                        <ShieldCheck size={24} />
                     </div>
                     <div className="flex-1 text-center md:text-left">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">HIPAA-Compliant & Private</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">All sessions are end-to-end encrypted. Your identity is shared only with your therapist.</p>
                     </div>
                     <button className="text-xs font-bold text-violet-600 dark:text-violet-400 p-2 hover:underline">How it works</button>
                </div>

                {/* Experts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {EXPERTS.map((expert, idx) => (
                        <motion.div 
                            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
                            key={expert.id} 
                            className="bg-white dark:bg-[#0f1629] border border-slate-200 dark:border-white/[0.06] rounded-[2rem] p-6 shadow-sm flex flex-col hover:border-violet-300 dark:hover:border-violet-500/30 transition-all group"
                        >
                            <div className="relative mb-6 self-center">
                                <img src={expert.img} className="w-24 h-24 rounded-full border-4 border-slate-50 dark:border-white/5 object-cover" />
                                {expert.live && (
                                    <div className="absolute bottom-1 right-1 px-2 py-0.5 bg-emerald-500 text-white text-[8px] font-black uppercase tracking-tighter rounded-full border-2 border-white dark:border-[#0f1629]">Online</div>
                                )}
                            </div>
                            
                            <div className="text-center mb-6">
                                <h3 className="font-bold text-slate-900 dark:text-white text-lg">{expert.name}</h3>
                                <p className="text-xs text-violet-600 dark:text-violet-400 font-bold mt-0.5">{expert.title}</p>
                                <div className="flex items-center justify-center gap-2 mt-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    <span className="flex items-center gap-1"><Star size={10} className="text-amber-400 fill-amber-400" /> {expert.rating}</span>
                                    <span>•</span>
                                    <span>{expert.reviews} Reviews</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-1.5 justify-center mb-6">
                                {expert.tags.map(t => (
                                    <span key={t} className="px-2 py-1 bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 text-[9px] font-bold border border-slate-100 dark:border-white/5 rounded-lg">{t}</span>
                                ))}
                            </div>

                            <div className="mt-auto border-t border-slate-50 dark:border-white/5 pt-4 flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Starting at</p>
                                    <p className="font-bold text-slate-900 dark:text-white">{expert.price}<span className="text-[10px] font-normal text-slate-500">/session</span></p>
                                </div>
                                <button onClick={() => handleBook(expert)} className="w-10 h-10 rounded-xl bg-violet-600 text-white flex items-center justify-center hover:bg-violet-700 transition-all shadow-lg shadow-violet-500/20">
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Booking Modal */}
                <AnimatePresence>
                    {bookingStep > 1 && selectedExpert && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setBookingStep(1)} className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" />
                            <motion.div 
                                initial={{ scale: 0.95, opacity: 0, y: 15 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 15 }}
                                className="relative bg-white dark:bg-[#0f1629] rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-2xl w-full max-w-lg overflow-hidden"
                            >
                                <button onClick={() => setBookingStep(1)} className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-slate-800 transition-all"><X size={18} /></button>
                                
                                {bookingStep === 2 && (
                                    <div className="p-8 md:p-10">
                                        <div className="flex items-center gap-5 mb-8">
                                             <img src={selectedExpert.img} className="w-16 h-16 rounded-2xl object-cover" />
                                             <div>
                                                 <h3 className="text-xl font-bold text-slate-900 dark:text-white">{selectedExpert.name}</h3>
                                                 <p className="text-sm font-bold text-violet-600 dark:text-violet-400">{selectedExpert.title}</p>
                                             </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Choose Format</p>
                                                <div className="grid grid-cols-2 gap-4">
                                                     <div className="p-4 rounded-2xl border-2 border-violet-600 bg-violet-50 dark:bg-violet-500/10 cursor-pointer">
                                                         <Video size={20} className="text-violet-600" />
                                                         <p className="font-bold text-slate-900 dark:text-white text-sm mt-2">Video Call</p>
                                                         <p className="text-[10px] text-slate-500">45 Minutes</p>
                                                     </div>
                                                     <div className="p-4 rounded-2xl border-2 border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/5 opacity-50 cursor-not-allowed">
                                                         <MessageCircle size={20} className="text-slate-400" />
                                                         <p className="font-bold text-slate-400 text-sm mt-2">Text Therapy</p>
                                                         <p className="text-[10px] text-slate-500">24/7 Access</p>
                                                     </div>
                                                </div>
                                            </div>

                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Next Availability</p>
                                                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <Calendar size={18} className="text-slate-400" />
                                                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Tomorrow, 10:30 AM</p>
                                                    </div>
                                                    <button className="text-[10px] font-bold text-violet-600 uppercase">Change</button>
                                                </div>
                                            </div>
                                        </div>

                                        <button onClick={() => setBookingStep(3)} className="w-full mt-10 btn-primary shadow-violet-500/25 py-4">
                                            Confirm Booking • {selectedExpert.price}
                                        </button>
                                    </div>
                                )}

                                {bookingStep === 3 && (
                                    <div className="p-12 text-center flex flex-col items-center">
                                         <div className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-6 shadow-xl shadow-emerald-500/10">
                                            <CheckCircle2 size={40} />
                                         </div>
                                         <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Session Confirmed</h3>
                                         <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs mx-auto">
                                            We've sent the details and calendar invite to your email. See you tomorrow with <strong>{selectedExpert.name}</strong>.
                                         </p>
                                         <button onClick={() => setBookingStep(1)} className="mt-10 px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-sm font-bold">Back to Experts</button>
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    )
}

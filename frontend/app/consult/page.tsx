'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Video, Calendar, Clock, Star, MessageSquare, CheckCircle2, ChevronRight, X } from 'lucide-react'

const EXPERTS = [
    {
        id: 'dr-ravi',
        name: "Dr. Ravi Sharma",
        title: "Clinical Psychiatrist",
        exp: "12 yrs exp",
        rating: 4.9,
        reviews: 342,
        price: "$80 / session",
        img: "https://i.pravatar.cc/150?u=ravi",
        tags: ["Anxiety", "Depression", "Medication"],
        live: true,
    },
    {
        id: 'sarah',
        name: "Sarah Jenkins, PsyD",
        title: "CBT Therapist",
        exp: "8 yrs exp",
        rating: 4.8,
        reviews: 215,
        price: "$65 / session",
        img: "https://i.pravatar.cc/150?u=sarah",
        tags: ["Stress", "Relationships", "CBT"],
        live: false,
    },
    {
        id: 'dr-lee',
        name: "Dr. Amanda Lee",
        title: "Career Psychologist",
        exp: "10 yrs exp",
        rating: 5.0,
        reviews: 188,
        price: "$90 / session",
        img: "https://i.pravatar.cc/150?u=lee",
        tags: ["Burnout", "Career Switch", "ADHD"],
        live: true,
    },
    {
        id: 'michael',
        name: "Michael Chen",
        title: "Holistic Life Coach",
        exp: "5 yrs exp",
        rating: 4.7,
        reviews: 95,
        price: "$50 / session",
        img: "https://i.pravatar.cc/150?u=michael",
        tags: ["Mindfulness", "Life Goals", "Nutrition"],
        live: true,
    }
]

export default function VirtualConsultPage() {
    const [selectedExpert, setSelectedExpert] = useState<typeof EXPERTS[0] | null>(null)
    const [bookingStep, setBookingStep] = useState(1) // 1: expert list, 2: details, 3: success

    const handleBook = (expert: typeof EXPERTS[0]) => {
        setSelectedExpert(expert)
        setBookingStep(2)
    }

    const confirmBooking = () => {
        setBookingStep(3)
        // Auto close after 3 seconds
        setTimeout(() => {
            setBookingStep(1)
            setSelectedExpert(null)
        }, 3000)
    }

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col h-full gap-6 p-2 relative"
        >
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-3">
                        <Video className="text-cyan-400" /> Talk to a Real Expert 💬
                    </h1>
                    <p className="text-slate-400 mt-2 text-lg">Book a verified 1-on-1 video or text consultation securely.</p>
                </div>
            </div>

            {/* EXPERT GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-4">
                {EXPERTS.map((expert, idx) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={expert.id} 
                        className="bg-slate-900 border border-white/5 rounded-3xl p-6 relative overflow-hidden group hover:border-cyan-500/30 transition-colors shadow-xl"
                    >
                        {expert.live && (
                            <div className="absolute top-4 right-4 flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-full z-10">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Online Now</span>
                            </div>
                        )}
                        
                        <div className="flex flex-col items-center mt-4 text-center">
                            <div className="relative mb-4">
                                <img src={expert.img} alt={expert.name} className="w-24 h-24 rounded-full border-4 border-slate-800 object-cover" />
                                {expert.live && <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-900 rounded-full"></div>}
                            </div>
                            <h3 className="text-xl font-black text-white mb-1">{expert.name}</h3>
                            <p className="text-cyan-400 text-sm font-bold mb-3">{expert.title}</p>
                            
                            <div className="flex items-center gap-4 text-xs font-bold text-slate-400 mb-4 bg-slate-950 px-4 py-2 rounded-xl border border-white/5">
                                <span className="flex items-center gap-1"><Star size={12} className="text-amber-400 fill-amber-400" /> {expert.rating}</span>
                                <span>•</span>
                                <span>{expert.reviews} reviews</span>
                            </div>

                            <div className="flex flex-wrap gap-2 justify-center mb-6">
                                {expert.tags.map(tag => (
                                    <span key={tag} className="text-[10px] uppercase tracking-widest font-bold bg-white/5 text-slate-300 px-2 py-1 rounded-md">{tag}</span>
                                ))}
                            </div>
                        </div>

                        <div className="mt-auto">
                            <div className="flex justify-between items-center mb-4 text-xs font-bold text-slate-500">
                                <span>{expert.exp}</span>
                                <span>{expert.price}</span>
                            </div>
                            <button 
                                onClick={() => handleBook(expert)}
                                className="w-full bg-cyan-500 hover:bg-cyan-600 shadow-lg shadow-cyan-500/20 text-slate-950 font-black py-3 rounded-xl transition-all flex justify-center items-center gap-2 group-hover:scale-[1.02]"
                            >
                                Book Session <ChevronRight size={16} />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* FLOW - MODAL */}
            <AnimatePresence>
                {bookingStep > 1 && selectedExpert && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                            onClick={() => setBookingStep(1)}
                        />
                        <motion.div 
                            layoutId={`expert-${selectedExpert.id}`}
                            initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-lg z-10 shadow-2xl overflow-hidden relative flex flex-col"
                        >
                            <button onClick={() => setBookingStep(1)} className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-full text-slate-400 transition-colors z-20">
                                <X size={20} />
                            </button>

                            {bookingStep === 2 && (
                                <div className="p-6">
                                    <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/5">
                                        <img src={selectedExpert.img} alt={selectedExpert.name} className="w-16 h-16 rounded-full" />
                                        <div>
                                            <h3 className="text-xl font-bold text-white">{selectedExpert.name}</h3>
                                            <p className="text-sm text-cyan-400 font-bold">{selectedExpert.title}</p>
                                        </div>
                                    </div>
                                    
                                    <h4 className="font-bold text-white mb-4">Select Session Type</h4>
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="border-2 border-cyan-500 bg-cyan-500/10 p-4 rounded-xl cursor-pointer">
                                            <Video className="text-cyan-400 mb-2" size={24} />
                                            <p className="font-bold text-white text-sm">Video Call</p>
                                            <p className="text-xs text-slate-400 mt-1">45 mins • Secure</p>
                                        </div>
                                        <div className="border-2 border-white/5 bg-slate-950 p-4 rounded-xl cursor-pointer hover:border-white/20 transition-colors opacity-60">
                                            <MessageSquare className="text-slate-400 mb-2" size={24} />
                                            <p className="font-bold text-white text-sm">Text Chat</p>
                                            <p className="text-xs text-slate-500 mt-1">1 hr • Async</p>
                                        </div>
                                    </div>

                                    <h4 className="font-bold text-white mb-4">Next Available Slot</h4>
                                    <div className="bg-slate-950 border border-white/5 p-4 rounded-xl flex justify-between items-center mb-8">
                                        <div className="flex items-center gap-3 text-slate-300">
                                            <div className="bg-white/5 p-2 rounded-lg">
                                                <Calendar className="text-slate-400" size={18} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm">Tomorrow, 10:00 AM</p>
                                            </div>
                                        </div>
                                        <span className="text-xs font-bold text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded-md">Change</span>
                                    </div>

                                    <button 
                                        onClick={confirmBooking}
                                        className="w-full bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-black py-4 rounded-xl transition-all"
                                    >
                                        Confirm Booking • {selectedExpert.price}
                                    </button>
                                </div>
                            )}

                            {bookingStep === 3 && (
                                <div className="p-10 flex flex-col items-center justify-center text-center">
                                    <motion.div 
                                        initial={{ scale: 0 }} 
                                        animate={{ scale: 1 }} 
                                        transition={{ type: "spring", bounce: 0.5, delay: 0.1 }}
                                        className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20"
                                    >
                                        <CheckCircle2 size={40} className="text-emerald-950" />
                                    </motion.div>
                                    <h3 className="text-2xl font-black text-white mb-2">Session Confirmed!</h3>
                                    <p className="text-slate-400">Your session with <strong>{selectedExpert.name}</strong> is scheduled for Tomorrow at 10:00 AM.</p>
                                    <p className="text-xs font-bold text-emerald-400 mt-6 uppercase tracking-widest animate-pulse">Check your email for the link</p>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

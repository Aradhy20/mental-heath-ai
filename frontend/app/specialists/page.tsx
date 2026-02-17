'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, MapPin, Sparkles, Navigation } from 'lucide-react'
import SpecialistGrid from '@/components/anti-gravity/SpecialistGrid'

export default function SpecialistsPage() {
    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 rounded-[2.5rem] bg-gradient-to-br from-serenity-500/10 via-purple-500/5 to-transparent border border-white/5 relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <ShieldCheck size={160} />
                </div>

                <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                    <div className="w-24 h-24 rounded-3xl bg-serenity-600 flex items-center justify-center text-white shadow-2xl shadow-serenity-600/40">
                        <MapPin size={48} />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-serenity-500/10 border border-serenity-500/20 text-serenity-600 dark:text-serenity-400 text-[10px] font-bold tracking-widest uppercase mb-3">
                            <Sparkles size={12} />
                            Precision Care Network
                        </div>
                        <h1 className="text-5xl font-display font-bold text-white tracking-tight">Expert Specialists</h1>
                        <p className="text-slate-400 mt-2 max-w-2xl font-medium">
                            Our proprietary algorithm matches you with the highest-rated mental health professionals in your immediate vicinity using real-time geolocation.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-center backdrop-blur-md">
                            <span className="block text-[10px] text-slate-500 uppercase font-bold tracking-widest">Network Status</span>
                            <span className="text-2xl font-display font-bold text-emerald-400 flex items-center gap-2">
                                <Navigation size={20} className="animate-pulse" /> Verified
                            </span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Specialist Section */}
            <div className="glass-panel p-8 rounded-[2rem] border-white/5 bg-white/5 dark:bg-black/20 backdrop-blur-xl">
                <SpecialistGrid />
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-8 rounded-3xl bg-white/5 border border-white/5"
                >
                    <h3 className="text-xl font-bold mb-4">India Hub Support</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                        We have established a robust network across major Indian metropolitan areas including Mumbai, Delhi, Bangalore, and Hyderabad. Our database is verified for clinical excellence.
                    </p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="p-8 rounded-3xl bg-white/5 border border-white/5"
                >
                    <h3 className="text-xl font-bold mb-4">Emergency Protocols</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                        If you are experiencing a crisis, please use the red emergency button on the dashboard for immediate local assistance and toll-free helpline connection.
                    </p>
                </motion.div>
            </div>
        </div>
    )
}

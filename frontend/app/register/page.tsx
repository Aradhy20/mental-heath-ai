'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, Phone, ArrowRight, Loader2, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { authAPI } from '@/lib/api';

export default function RegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        full_name: '',
        phone: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await authAPI.register(formData);
            router.push('/login?registered=true');
        } catch (err: any) {
            const detailMsg = err.response?.data?.detail;
            const errMsg = Array.isArray(detailMsg) ? detailMsg[0].msg : detailMsg;
            setError(err.response?.data?.message || errMsg || 'Registration failed. Please check your details.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex bg-[#030014] overflow-hidden selection:bg-teal-500/30">
            {/* LEFT PANEL - BRANDING & VISUALS */}
            <div className="hidden lg:flex w-1/2 relative items-center justify-center p-12 overflow-hidden bg-gradient-to-br from-[#030014] to-[#0a0026]">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_20%_80%,rgba(45,212,191,0.2),rgba(255,255,255,0))]"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[120px] mix-blend-screen opacity-60 animate-pulse"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-fuchsia-500/10 rounded-full blur-[100px] mix-blend-screen opacity-50" style={{ animationDelay: '1.5s' }}></div>
                
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="relative z-10 w-full max-w-lg"
                >
                    <Link href="/" className="inline-flex items-center gap-2 mb-12 group cursor-pointer hover:opacity-80 transition-opacity">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-400 to-emerald-400 flex items-center justify-center text-slate-900 font-bold text-xl shadow-[0_0_20px_rgba(45,212,191,0.4)] group-hover:scale-105 transition-transform">
                            M
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-white">MindfulAI</span>
                    </Link>
                    
                    <h1 className="text-5xl font-medium tracking-tight text-white leading-[1.15] mb-6">
                        Begin your journey to<br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">emotional mastery.</span>
                    </h1>
                    <p className="text-lg text-slate-400 leading-relaxed mb-10">
                        Join an exclusive platform blending cutting-edge AI with deep psychological insights. Uncover patterns, reflect daily, and elevate your mental well-being.
                    </p>

                    <div className="space-y-6">
                        {[
                            { title: 'Encrypted Journals', desc: 'Zero-knowledge architecture keeps your thoughts yours.' },
                            { title: 'AI-Powered Insights', desc: 'Predictive wellness based on subtle daily shifts.' },
                            { title: 'Global Community', desc: 'Anonymous support from people who understand.' }
                        ].map((feature, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: i * 0.1 + 0.3 }}
                                className="flex items-start gap-4"
                            >
                                <div className="mt-1 shrink-0 p-1 rounded-full bg-teal-500/10 text-teal-400">
                                    <CheckCircle2 size={18} />
                                </div>
                                <div>
                                    <h3 className="text-white font-medium mb-1">{feature.title}</h3>
                                    <p className="text-sm text-slate-500">{feature.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* RIGHT PANEL - AUTH FORM */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-10 overflow-y-auto">
                <div className="absolute inset-0 lg:hidden bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(45,212,191,0.15),rgba(255,255,255,0))] pointer-events-none"></div>
                
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-[480px] relative mt-10 md:mt-0"
                >
                    <div className="glass-panel rounded-3xl p-8 sm:p-10 border border-white/[0.05] shadow-[0_8px_32px_rgba(0,0,0,0.5)] bg-slate-900/60 backdrop-blur-2xl">
                        
                        <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-teal-400 to-emerald-400 flex items-center justify-center text-slate-900 font-bold shadow-[0_0_20px_rgba(45,212,191,0.4)]">
                                M
                            </div>
                            <span className="text-xl font-bold text-white">MindfulAI</span>
                        </div>

                        <div className="mb-8">
                            <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-white/[0.05] border border-white/[0.05] text-xs font-medium text-teal-400">
                                <Sparkles size={14} /> Create your account
                            </div>
                            <h2 className="text-3xl font-semibold text-white tracking-tight mb-2">Join the future of wellness</h2>
                            <p className="text-slate-400 text-sm">Takes less than 60 seconds to get started.</p>
                        </div>

                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mb-6 overflow-hidden"
                                >
                                    <div className="p-3 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                                        {error}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-teal-400 transition-colors" size={18} />
                                    <input
                                        type="text"
                                        required
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        placeholder="Username"
                                        className="w-full bg-white/[0.03] border border-white/[0.1] rounded-2xl py-4 pl-12 pr-4 text-white placeholder-slate-500 focus:bg-white/[0.05] focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50 transition-all outline-none"
                                    />
                                </div>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-teal-400 transition-colors" size={18} opacity={0.5} />
                                    <input
                                        type="text"
                                        required
                                        value={formData.full_name}
                                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                        placeholder="Full Name"
                                        className="w-full bg-white/[0.03] border border-white/[0.1] rounded-2xl py-4 pl-11 pr-4 text-white placeholder-slate-500 focus:bg-white/[0.05] focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50 transition-all outline-none"
                                    />
                                </div>
                            </div>

                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-teal-400 transition-colors" size={18} />
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="Email address"
                                    className="w-full bg-white/[0.03] border border-white/[0.1] rounded-2xl py-4 pl-12 pr-4 text-white placeholder-slate-500 focus:bg-white/[0.05] focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50 transition-all outline-none"
                                />
                            </div>

                            <div className="relative group">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-teal-400 transition-colors" size={18} />
                                <input
                                    type="tel"
                                    required
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="Phone number (+91 9876543210)"
                                    className="w-full bg-white/[0.03] border border-white/[0.1] rounded-2xl py-4 pl-12 pr-4 text-white placeholder-slate-500 focus:bg-white/[0.05] focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50 transition-all outline-none"
                                />
                            </div>

                            <div className="relative group pt-2">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-teal-400 transition-colors" size={18} />
                                <input
                                    type="password"
                                    required
                                    minLength={8}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="Create a strong password"
                                    className="w-full bg-white/[0.03] border border-white/[0.1] rounded-2xl py-4 pl-12 pr-4 text-white placeholder-slate-500 focus:bg-white/[0.05] focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50 transition-all outline-none"
                                />
                            </div>

                            <div className="mt-8 pt-4">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-white text-[#030014] rounded-2xl py-4 font-semibold hover:bg-slate-200 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                                >
                                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Create Account'}
                                    {!isLoading && <ArrowRight size={18} className="text-[#030014]/60 group-hover:translate-x-1 transition-transform" />}
                                </button>
                            </div>
                        </form>

                        <div className="mt-8 text-center text-sm text-slate-400">
                            Already have an account?{' '}
                            <Link href="/login" className="text-white hover:text-teal-400 transition-colors font-semibold border-b border-transparent hover:border-teal-400/30 pb-0.5">
                                Sign in instead
                            </Link>
                        </div>
                        
                    </div>

                    <div className="mt-6 text-center">
                        <div className="inline-flex items-center gap-1.5 text-xs text-slate-500 bg-white/[0.02] border border-white/[0.02] px-3 py-1.5 rounded-full">
                            <ShieldCheck size={14} className="text-green-400/80" />
                            Your data is strictly confidential
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

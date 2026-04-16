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
        <div className="min-h-screen w-full flex bg-slate-50 dark:bg-[#0a0d1a] overflow-hidden">
            
            {/* Left Branding Panel */}
            <div className="hidden lg:flex w-[450px] bg-white dark:bg-[#0f1629] border-r border-slate-200 dark:border-white/5 p-12 flex-col justify-between overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/5 rounded-full blur-[80px] -mr-32 -mt-32" />
                
                <Link href="/" className="flex items-center gap-2.5 relative z-10">
                    <div className="w-9 h-9 rounded-xl overflow-hidden bg-white dark:bg-white/10 flex items-center justify-center shadow-lg border border-slate-200 dark:border-white/10">
                        <img src="/logo.png" alt="MindfulAI Logo" className="w-full h-full object-cover" />
                    </div>
                    <span className="font-bold text-2xl tracking-tight text-slate-900 dark:text-white">MindfulAI</span>
                </Link>

                <div className="relative z-10">
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white leading-[1.15] mb-6">
                        Start your journey to <span className="text-violet-600">wellness.</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-10">
                        Join 50,000+ others who trust MindfulAI for their mental health journey. Clinical insights, AI support, and ultimate privacy.
                    </p>

                    <div className="space-y-6">
                        {[
                            { title: 'Zero-Knowledge Privacy', desc: 'Your data is encrypted. Even we can\'t read it.' },
                            { title: 'AI-Driven Insights', desc: 'Clinical patterns identified from your daily logs.' },
                            { title: 'Safe Anonymous Spaces', desc: 'Connect with a supportive community.' }
                        ].map((f, i) => (
                            <div key={i} className="flex gap-4">
                                <div className="mt-1 shrink-0 w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                    <CheckCircle2 size={14} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{f.title}</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{f.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative z-10 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    Enterprise Health Solutions
                </div>
            </div>

            {/* Auth Form Column */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative overflow-y-auto">
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none" />
                
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-[480px]">
                    <div className="bg-white dark:bg-[#0f1629] rounded-[2.5rem] border border-slate-200 dark:border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-10 relative z-10">
                        
                        <div className="lg:hidden mb-10 text-center">
                            <div className="inline-flex items-center gap-2.5 mx-auto">
                                <div className="w-8 h-8 rounded-lg overflow-hidden bg-white dark:bg-white/10 flex items-center justify-center text-white border border-slate-200 dark:border-white/10">
                                    <img src="/logo.png" alt="MindfulAI" className="w-full h-full object-cover" />
                                </div>
                                <span className="font-bold text-xl text-slate-900 dark:text-white">MindfulAI</span>
                            </div>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Create Account</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Takes less than a minute to secure your sanctuary.</p>
                        </div>

                        {error && <div className="mb-6 p-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-medium flex items-center gap-2">{error}</div>}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500" size={16} />
                                    <input type="text" required value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} placeholder="Username" className="w-full bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-slate-900 dark:text-white outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-500/5 transition-all" />
                                </div>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500" size={16} />
                                    <input type="text" required value={formData.full_name} onChange={e => setFormData({ ...formData, full_name: e.target.value })} placeholder="Full Name" className="w-full bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-slate-900 dark:text-white outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-500/5 transition-all" />
                                </div>
                            </div>

                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="Email address" className="w-full bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-slate-900 dark:text-white outline-none focus:border-violet-400 transition-all" />
                            </div>

                            <div className="relative group">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input type="tel" required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="Phone number" className="w-full bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-slate-900 dark:text-white outline-none focus:border-violet-400 transition-all" />
                            </div>

                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input type="password" required minLength={8} value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} placeholder="Secure Password" className="w-full bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-slate-900 dark:text-white outline-none focus:border-violet-400 transition-all" />
                            </div>

                            <button type="submit" disabled={isLoading} className="w-full btn-primary py-4 shadow-violet-500/20 mt-6 flex items-center justify-center gap-2">
                                {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Create Account'}
                                {!isLoading && <ArrowRight size={18} />}
                            </button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-sm text-slate-500">Already a member? <Link href="/login" className="text-violet-600 font-bold hover:underline">Sign in</Link></p>
                        </div>
                    </div>

                    <div className="mt-10 flex flex-col items-center gap-4">
                        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-widest border border-emerald-500/10 rounded-full">
                            <ShieldCheck size={14} /> Strict HIPAA & GDPR Compliance
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

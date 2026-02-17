'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Phone, ArrowRight, Loader2, Star, ShieldCheck } from 'lucide-react';
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
            setError(err.response?.data?.message || 'Registration failed. Please check your details.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#0A0A0F]">

            {/* Professional Gradient Background */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] -z-10" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-xl"
            >
                <div className="glass-panel p-8 md:p-12 rounded-[2rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative">

                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-purple-400 mb-6">
                            <ShieldCheck size={14} /> SECURE_ENROLLMENT_V2
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">Create Professional Identity</h1>
                        <p className="text-gray-400">Join the elite MindfulAI mental wellness network.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center font-medium"
                            >
                                {error}
                            </motion.div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Unique Username</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-purple-400 transition-colors" size={18} />
                                    <input
                                        type="text"
                                        placeholder="e.g. aradhy_jains"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        className="w-full pl-11 pr-4 py-4 rounded-2xl glass-input focus:outline-none text-sm"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Full Legal Name</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-teal-400 transition-colors" size={18} />
                                    <input
                                        type="text"
                                        placeholder="e.g. Aradhy Jain"
                                        value={formData.full_name}
                                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                        className="w-full pl-11 pr-4 py-4 rounded-2xl glass-input focus:outline-none text-sm"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Official Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-400 transition-colors" size={18} />
                                    <input
                                        type="email"
                                        placeholder="aradhy@domain.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full pl-11 pr-4 py-4 rounded-2xl glass-input focus:outline-none text-sm"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Mobile Number (India)</label>
                                <div className="relative group">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-pink-400 transition-colors" size={18} />
                                    <input
                                        type="tel"
                                        placeholder="+91-XXXXX-XXXXX"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full pl-11 pr-4 py-4 rounded-2xl glass-input focus:outline-none text-sm"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Access Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-indigo-400 transition-colors" size={18} />
                                <input
                                    type="password"
                                    placeholder="At least 8 characters"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full pl-11 pr-4 py-4 rounded-2xl glass-input focus:outline-none text-sm"
                                    required
                                    minLength={8}
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-5 rounded-2xl bg-white text-black font-black text-lg hover:bg-gray-200 active:scale-95 transition-all flex items-center justify-center gap-3 group shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                            >
                                {isLoading ? <Loader2 className="animate-spin" /> : 'AUTHENTICATE & REGISTER'}
                                {!isLoading && <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />}
                            </button>
                        </div>
                    </form>

                    <div className="mt-10 text-center text-sm text-gray-500">
                        Already have professional access?{' '}
                        <Link href="/login" className="text-white hover:text-purple-400 transition-colors font-bold border-b border-white/10 pb-0.5">
                            Protocol Sign In
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

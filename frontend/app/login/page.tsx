'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Loader2, ShieldCheck, Mail, Lock, Phone } from 'lucide-react';
import { authAPI } from '@/lib/api';
import { useAuthStore } from '@/lib/store/auth-store';

const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function saveTokenCookie(token: string) {
  if (typeof window === 'undefined') return;
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `token=${token};path=/;max-age=${COOKIE_MAX_AGE};SameSite=Lax${secure}`;
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((state) => state.login);

  const [loginMode, setLoginMode] = useState<'password' | 'otp'>('password');
  const [otpMode, setOtpMode] = useState<'email' | 'phone'>('email');
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [emailData, setEmailData] = useState({ email: '', password: '' });
  const [contact, setContact] = useState('');
  const [otp, setOtp] = useState('');

  const redirectPath = searchParams?.get('redirect') || '/dashboard';

  const handleLoginSuccess = (user: any, token: string) => {
    setAuth(user, token);
    saveTokenCookie(token);
    router.push(redirectPath);
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await authAPI.login(emailData);
      handleLoginSuccess(response.data.user, response.data.token);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const payload = otpMode === 'email' ? { email: contact } : { phone: contact };
      const response = await authAPI.requestOTP(payload);

      if (response.data.debug_otp) {
        console.log('Debug OTP:', response.data.debug_otp);
      }
      setStep(2);
    } catch (err: any) {
      setError(err.response?.data?.message || `Failed to send OTP to ${contact}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const payload = otpMode === 'email' ? { email: contact, otp } : { phone: contact, otp };
      const response = await authAPI.verifyOTP(payload);
      handleLoginSuccess(response.data.user, response.data.token);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#030014] overflow-hidden selection:bg-purple-500/30">
      {/* LEFT PANEL - BRANDING & VISUALS */}
      <div className="hidden lg:flex w-1/2 relative items-center justify-center p-12 overflow-hidden">
        {/* Glows */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px] mix-blend-screen opacity-50 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-cyan-400/20 rounded-full blur-[100px] mix-blend-screen opacity-40" style={{ animationDelay: '1s' }}></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="relative z-10 w-full max-w-lg"
        >
          <Link href="/" className="inline-flex items-center gap-2 mb-12 group cursor-pointer hover:opacity-80 transition-opacity">
             <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 to-cyan-400 flex items-center justify-center text-white font-bold text-xl shadow-[0_0_20px_rgba(168,85,247,0.4)] group-hover:scale-105 transition-transform">
                M
             </div>
             <span className="text-2xl font-bold tracking-tight text-white">MindfulAI</span>
          </Link>
          
          <h1 className="text-5xl font-medium tracking-tight text-white leading-[1.1] mb-6">
            Your sanctuary for<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">mental clarity.</span>
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed mb-12">
            Secure, encrypted access to your personal AI wellness companion. Track, reflect, and grow in a space designed for your peace of mind.
          </p>

          <div className="space-y-6">
            <div className="flex items-center gap-4 text-slate-300">
              <div className="flex -space-x-4">
                {[1,2,3].map((i) => (
                  <div key={i} className={`w-12 h-12 rounded-full border-2 border-[#030014] bg-slate-800 flex items-center justify-center text-xs overflow-hidden`}>
                    <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${i * 10}`} alt="avatar" />
                  </div>
                ))}
              </div>
              <p className="text-sm">
                Join <span className="text-white font-semibold flex-shrink-0">10,000+</span> professionals maintaining their edge.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* RIGHT PANEL - AUTH FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-10">
        <div className="absolute inset-0 lg:hidden bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.2),rgba(255,255,255,0))] pointer-events-none"></div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[440px] relative"
        >
          {/* Form Container */}
          <div className="glass-panel rounded-3xl p-8 sm:p-10 border border-white/[0.05] shadow-[0_8px_32px_rgba(0,0,0,0.5)] bg-slate-900/60 backdrop-blur-2xl">
            
            <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
               <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-500 to-cyan-400 flex items-center justify-center text-white font-bold shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                  M
               </div>
               <span className="text-xl font-bold text-white">MindfulAI</span>
            </div>

            <div className="mb-8">
              <h2 className="text-3xl font-semibold text-white tracking-tight mb-2">Welcome back</h2>
              <p className="text-slate-400 text-sm">Enter your credentials to access your dashboard.</p>
            </div>

            {/* Login Toggle */}
            <div className="flex p-1 mb-8 bg-white/[0.03] rounded-2xl border border-white/[0.05]">
              <button
                type="button"
                onClick={() => { setLoginMode('password'); setStep(1); setError(''); }}
                className={`flex-1 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 ${loginMode === 'password' ? 'bg-white/10 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Password
              </button>
              <button
                type="button"
                onClick={() => { setLoginMode('otp'); setStep(1); setError(''); }}
                className={`flex-1 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 ${loginMode === 'otp' ? 'bg-white/10 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Passcode (OTP)
              </button>
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

            <form onSubmit={loginMode === 'password' ? handlePasswordLogin : step === 1 ? handleRequestOTP : handleVerifyOTP}>
              <AnimatePresence mode="wait">
                {loginMode === 'password' ? (
                  <motion.div
                    key="password-form"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors" size={18} />
                      <input
                        type="email"
                        required
                        value={emailData.email}
                        onChange={(e) => setEmailData({ ...emailData, email: e.target.value })}
                        placeholder="Email address"
                        className="w-full bg-white/[0.03] border border-white/[0.1] rounded-2xl py-4 pl-12 pr-4 text-white placeholder-slate-500 focus:bg-white/[0.05] focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all outline-none"
                      />
                    </div>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors" size={18} />
                      <input
                        type="password"
                        required
                        value={emailData.password}
                        onChange={(e) => setEmailData({ ...emailData, password: e.target.value })}
                        placeholder="Password"
                        className="w-full bg-white/[0.03] border border-white/[0.1] rounded-2xl py-4 pl-12 pr-4 text-white placeholder-slate-500 focus:bg-white/[0.05] focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all outline-none"
                      />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="otp-form"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    {step === 1 ? (
                      <>
                        <div className="flex gap-2 p-1 bg-white/[0.02] rounded-xl mb-4 border border-white/[0.05]">
                          <button
                            type="button"
                            onClick={() => setOtpMode('email')}
                            className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${otpMode === 'email' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                          >
                            Use Email
                          </button>
                          <button
                            type="button"
                            onClick={() => setOtpMode('phone')}
                            className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${otpMode === 'phone' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                          >
                            Use Phone
                          </button>
                        </div>
                        <div className="relative group">
                          {otpMode === 'email' ? (
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors" size={18} />
                          ) : (
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors" size={18} />
                          )}
                          <input
                            type={otpMode === 'email' ? 'email' : 'tel'}
                            required
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                            placeholder={otpMode === 'email' ? 'Email address' : 'Phone number'}
                            className="w-full bg-white/[0.03] border border-white/[0.1] rounded-2xl py-4 pl-12 pr-4 text-white placeholder-slate-500 focus:bg-white/[0.05] focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all outline-none"
                          />
                        </div>
                      </>
                    ) : (
                      <div className="space-y-4">
                        <div className="text-sm text-slate-400 text-center mb-4">
                          Code sent to <span className="text-white font-medium">{contact}</span>
                          <button type="button" onClick={() => setStep(1)} className="ml-2 text-purple-400 hover:text-purple-300 underline underline-offset-4">Change</button>
                        </div>
                        <div className="relative group">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors" size={18} />
                          <input
                            type="text"
                            required
                            maxLength={6}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                            placeholder="Enter 6-digit OTP"
                            className="w-full bg-white/[0.03] border border-white/[0.1] rounded-2xl py-4 pl-12 pr-4 text-white placeholder-slate-500 focus:bg-white/[0.05] focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all outline-none font-mono tracking-widest text-center"
                          />
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-8">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-white text-[#030014] rounded-2xl py-4 font-semibold hover:bg-slate-200 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                >
                  {isLoading ? <Loader2 className="animate-spin" size={20} /> : loginMode === 'password' ? 'Sign in to Continue' : step === 1 ? 'Send verification code' : 'Verify Securely'}
                  {!isLoading && <ArrowRight size={18} className="text-[#030014]/60 group-hover:translate-x-1 transition-transform" />}
                </button>
              </div>
            </form>

            <div className="mt-8 text-center text-sm text-slate-400">
              Don't have an account?{' '}
              <Link href="/register" className="text-white hover:text-purple-400 transition-colors font-semibold border-b border-transparent hover:border-purple-400/30 pb-0.5">
                Create one now
              </Link>
            </div>
            
          </div>
          
          <div className="mt-6 text-center">
             <div className="inline-flex items-center gap-1.5 text-xs text-slate-500 bg-white/[0.02] border border-white/[0.02] px-3 py-1.5 rounded-full">
                <ShieldCheck size={14} className="text-green-400/80" />
                End-to-end encrypted connection
             </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

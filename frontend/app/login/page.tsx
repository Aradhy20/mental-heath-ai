'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Loader2, ShieldCheck, Mail, Lock, Phone, Sparkles } from 'lucide-react';
import { authAPI } from '@/lib/api';
import { useAuthStore } from '@/lib/store/auth-store';

const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function saveTokenCookie(token: string) {
  if (typeof window === 'undefined') return;
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `token=${token};path=/;max-age=${COOKIE_MAX_AGE};SameSite=Lax${secure}`;
}

function LoginContent() {
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
      if (response.data.debug_otp) console.log('Debug OTP:', response.data.debug_otp);
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
    <div className="min-h-screen w-full flex bg-slate-50 dark:bg-[#0a0d1a] overflow-hidden">
      
      {/* Branding Column */}
      <div className="hidden lg:flex w-[450px] bg-white dark:bg-[#0f1629] border-r border-slate-200 dark:border-white/5 relative p-12 flex-col justify-between overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/5 rounded-full blur-[80px] -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[80px] -ml-32 -mb-32" />

        <Link href="/" className="flex items-center gap-2.5 relative z-10 hover:opacity-80 transition-opacity">
          <div className="w-9 h-9 rounded-xl overflow-hidden bg-white dark:bg-white/10 flex items-center justify-center shadow-lg border border-slate-200 dark:border-white/10">
            <img src="/logo.png" alt="MindfulAI" className="w-full h-full object-cover" />
          </div>
          <span className="font-bold text-2xl tracking-tight text-slate-900 dark:text-white">MindfulAI</span>
        </Link>
        
        <div className="relative z-10">
           <h1 className="text-4xl font-bold text-slate-900 dark:text-white leading-[1.1] mb-6">
              Welcome back to your <span className="text-violet-600">safe space.</span>
           </h1>
           <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-10">
              Access your clinical wellness markers, private journals, and empathetic AI chat in a secure, end-to-end encrypted environment.
           </p>
           
           <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.05]">
                 <p className="text-xl font-bold text-slate-900 dark:text-white">50k+</p>
                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Active Users</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.05]">
                 <p className="text-xl font-bold text-slate-900 dark:text-white">4.9/5</p>
                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">App Rating</p>
              </div>
           </div>
        </div>

        <div className="relative z-10 text-[10px] text-slate-400 font-medium tracking-wide">
           © 2026 MINDFULAI WELLNESS SAAS
        </div>
      </div>

      {/* Auth Column */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/5 rounded-full blur-[100px] pointer-events-none" />
        
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-[420px]">
          <div className="bg-white dark:bg-[#0f1629] rounded-[2.5rem] border border-slate-200 dark:border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-10 flex flex-col relative z-10">
            
            <div className="lg:hidden mb-10 text-center">
                 <div className="inline-flex items-center gap-2.5 mx-auto">
                    <div className="w-8 h-8 rounded-lg overflow-hidden bg-white dark:bg-white/10 flex items-center justify-center text-white border border-slate-200 dark:border-white/10">
                        <img src="/logo.png" alt="MindfulAI" className="w-full h-full object-cover" />
                    </div>
                    <span className="font-bold text-xl text-slate-900 dark:text-white">MindfulAI</span>
                 </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Sign In</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Welcome back. Your peace of mind starts here.</p>
            </div>

            {/* Mode Toggle */}
            <div className="flex bg-slate-100 dark:bg-white/[0.04] p-1 rounded-2xl mb-8 border border-slate-200 dark:border-white/5">
                <button onClick={() => { setLoginMode('password'); setStep(1); setError(''); }} className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${loginMode === 'password' ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>PASSWORD</button>
                <button onClick={() => { setLoginMode('otp'); setStep(1); setError(''); }} className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${loginMode === 'otp' ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>PASSCODE</button>
            </div>

            {error && <div className="mb-6 p-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-medium flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-rose-500 shrink-0" />{error}</div>}

            <form onSubmit={loginMode === 'password' ? handlePasswordLogin : step === 1 ? handleRequestOTP : handleVerifyOTP} className="space-y-4">
               {loginMode === 'password' ? (
                 <>
                    <div className="relative group">
                       <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500" size={16} />
                       <input type="email" required value={emailData.email} onChange={e => setEmailData({ ...emailData, email: e.target.value })} placeholder="Email address" className="w-full bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-slate-900 dark:text-white outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-500/5 transition-all" />
                    </div>
                    <div className="relative group">
                       <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500" size={16} />
                       <input type="password" required value={emailData.password} onChange={e => setEmailData({ ...emailData, password: e.target.value })} placeholder="Password" className="w-full bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-slate-900 dark:text-white outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-500/5 transition-all" />
                    </div>
                 </>
               ) : (
                 <>
                    {step === 1 ? (
                      <>
                        <div className="flex gap-2 p-1 bg-slate-50 dark:bg-white/[0.04] rounded-xl mb-4 border border-slate-200 dark:border-white/10">
                          <button type="button" onClick={() => setOtpMode('email')} className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all ${otpMode === 'email' ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm' : 'text-slate-400'}`}>EMAIL</button>
                          <button type="button" onClick={() => setOtpMode('phone')} className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all ${otpMode === 'phone' ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm' : 'text-slate-400'}`}>PHONE</button>
                        </div>
                        <div className="relative group">
                           {otpMode === 'email' ? <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} /> : <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />}
                           <input type={otpMode === 'email' ? 'email' : 'tel'} required value={contact} onChange={e => setContact(e.target.value)} placeholder={otpMode === 'email' ? 'Email address' : 'Phone number'} className="w-full bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-slate-900 dark:text-white outline-none focus:border-violet-400 transition-all" />
                        </div>
                      </>
                    ) : (
                      <div className="space-y-4">
                         <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input type="text" required maxLength={6} value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))} placeholder="6-digit OTP" className="w-full bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-slate-900 dark:text-white outline-none font-mono tracking-widest text-center" />
                         </div>
                         <button type="button" onClick={() => setStep(1)} className="w-full text-[10px] font-bold text-violet-600 uppercase">Change contact details</button>
                      </div>
                    )}
                 </>
               )}

               <button type="submit" disabled={isLoading} className="w-full btn-primary py-4 shadow-violet-500/20 mt-6 flex items-center justify-center gap-2">
                  {isLoading ? <Loader2 className="animate-spin" size={20} /> : loginMode === 'password' ? 'Sign in' : step === 1 ? 'Get Code' : 'Verify Now'}
                  {!isLoading && <ArrowRight size={18} />}
               </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-slate-500">New to MindfulAI? <Link href="/register" className="text-violet-600 font-bold hover:underline">Create an account</Link></p>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center gap-4">
             <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-widest border border-emerald-500/10 rounded-full">
                <ShieldCheck size={14} /> HIPAA-Ready & Encrypted
             </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0a0d1a]">
        <div className="w-8 h-8 rounded-full border-4 border-violet-500 border-t-transparent animate-spin" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}

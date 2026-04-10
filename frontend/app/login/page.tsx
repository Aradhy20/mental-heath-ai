'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Smartphone, ArrowRight, Loader2, KeyRound, ShieldCheck, Lock } from 'lucide-react';
import { authAPI } from '@/lib/api';
import { useAuthStore } from '@/lib/store/auth-store';

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.login);

  const [loginMode, setLoginMode] = useState<'password' | 'otp'>('password');
  const [otpMode, setOtpMode] = useState<'email' | 'phone'>('email');
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [emailData, setEmailData] = useState({ email: '', password: '' });
  const [contact, setContact] = useState('');
  const [otp, setOtp] = useState('');

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await authAPI.login(emailData);
      setAuth(response.data.user, response.data.token);
      router.push('/dashboard');
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
      setAuth(response.data.user, response.data.token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.16),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(34,211,238,0.14),_transparent_22%)]" />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid w-full gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel flex flex-col justify-between rounded-[2rem] border border-white/10 p-10 shadow-glow"
          >
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 shadow-sm">
                <ShieldCheck size={18} className="text-cyan-300" />
                MindfulAI Secure Access
              </div>
              <div className="space-y-4">
                <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">Welcome to your wellness control center</p>
                <h1 className="text-5xl font-semibold tracking-tight text-white sm:text-6xl">Sign in to continue your journey</h1>
                <p className="max-w-xl text-base text-slate-300 sm:text-lg">
                  A calm, modern experience for logging your mood, journaling thoughts, and connecting with mental health tools powered by AI.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { icon: '💡', title: 'Smart insights', description: 'Personalized suggestions and mood trends.' },
                  { icon: '🔒', title: 'Secure access', description: 'Encrypted login with OTP and password protection.' },
                  { icon: '🌙', title: 'Relaxing UI', description: 'Soft gradients and effortless navigation.' },
                  { icon: '⚡', title: 'Fast startup', description: 'Instant access to AI support and wellness tools.' },
                ].map((item) => (
                  <div key={item.title} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                    <p className="mb-3 text-3xl">{item.icon}</p>
                    <h3 className="font-semibold text-white">{item.title}</h3>
                    <p className="mt-2 text-sm text-slate-400">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-10 rounded-3xl border border-white/10 bg-slate-900/80 p-6 text-slate-300 shadow-xl shadow-slate-950/40">
              <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Ready when you are</h2>
              <p className="mt-3 text-sm leading-6 text-slate-400">Your personalized wellness dashboard is one login away. Use the secure access form to continue.</p>
            </div>
          </motion.section>

          <motion.article
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel rounded-[2rem] border border-white/10 p-8 shadow-glow"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/80">Login Method</p>
                <h2 className="mt-3 text-3xl font-semibold text-white">Secure Sign In</h2>
              </div>
              <div className="rounded-full bg-slate-900/80 px-4 py-2 text-sm text-slate-300 ring-1 ring-white/10">
                {loginMode === 'password' ? 'Password' : 'One-time PIN'}
              </div>
            </div>

            <div className="mt-8 grid gap-3 rounded-3xl bg-slate-900/90 p-2 ring-1 ring-white/10">
              <button
                type="button"
                onClick={() => { setLoginMode('password'); setStep(1); setError(''); }}
                className={`rounded-3xl px-4 py-3 text-sm font-semibold transition ${loginMode === 'password' ? 'bg-gradient-to-r from-purple-500 to-cyan-400 text-slate-950 shadow-glow' : 'text-slate-300 hover:text-white'}`}
              >
                Password
              </button>
              <button
                type="button"
                onClick={() => { setLoginMode('otp'); setStep(1); setError(''); setContact(''); setOtp(''); }}
                className={`rounded-3xl px-4 py-3 text-sm font-semibold transition ${loginMode === 'otp' ? 'bg-gradient-to-r from-purple-500 to-cyan-400 text-slate-950 shadow-glow' : 'text-slate-300 hover:text-white'}`}
              >
                OTP Login
              </button>
            </div>

            {error ? (
              <div className="mt-6 rounded-3xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
                {error}
              </div>
            ) : null}

            <form
              onSubmit={loginMode === 'password' ? handlePasswordLogin : step === 1 ? handleRequestOTP : handleVerifyOTP}
              className="mt-8 space-y-6"
            >
              <div className="grid gap-5">
                <label className="block text-sm font-semibold text-slate-200">
                  Email address
                  <input
                    type="email"
                    value={loginMode === 'password' ? emailData.email : otpMode === 'email' ? contact : contact}
                    onChange={(e) => {
                      if (loginMode === 'password') {
                        setEmailData({ ...emailData, email: e.target.value });
                      } else {
                        setContact(e.target.value);
                      }
                    }}
                    placeholder="you@domain.com"
                    className="mt-3 w-full rounded-3xl border border-white/10 px-5 py-4 text-sm text-white outline-none glass-input"
                    required
                  />
                </label>

                {loginMode === 'password' ? (
                  <label className="block text-sm font-semibold text-slate-200">
                    Password
                    <input
                      type="password"
                      value={emailData.password}
                      onChange={(e) => setEmailData({ ...emailData, password: e.target.value })}
                      placeholder="Enter password"
                      className="mt-3 w-full rounded-3xl border border-white/10 px-5 py-4 text-sm text-white outline-none glass-input"
                      required
                    />
                  </label>
                ) : step === 2 ? (
                  <label className="block text-sm font-semibold text-slate-200">
                    Verification Code
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="6-digit OTP"
                      maxLength={6}
                      className="mt-3 w-full rounded-3xl border border-white/10 px-5 py-4 text-sm text-white outline-none glass-input font-mono tracking-[0.2em]"
                      required
                    />
                  </label>
                ) : null}
              </div>

              {loginMode === 'otp' ? (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex gap-3 rounded-3xl bg-slate-900/80 p-3 text-sm text-slate-400 ring-1 ring-white/10">
                    <button
                      type="button"
                      onClick={() => { setOtpMode('email'); setContact(''); }}
                      className={`rounded-full px-4 py-2 transition ${otpMode === 'email' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                      Email
                    </button>
                    <button
                      type="button"
                      onClick={() => { setOtpMode('phone'); setContact(''); }}
                      className={`rounded-full px-4 py-2 transition ${otpMode === 'phone' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                      Phone
                    </button>
                  </div>
                  {step === 2 ? (
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-sm text-slate-400 hover:text-white transition"
                    >
                      Change method
                    </button>
                  ) : null}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full justify-center py-4 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : loginMode === 'password' ? 'Login Securely' : step === 1 ? 'Send OTP' : 'Verify & Enter'}
                <ArrowRight size={18} />
              </button>
            </form>

            <div className="mt-8 border-t border-white/10 pt-6 text-center text-sm text-slate-400">
              <p className="mb-3">Need a new account?</p>
              <Link href="/register" className="btn-secondary inline-flex w-full justify-center py-3 sm:w-auto">
                Create Account
              </Link>
            </div>
          </motion.article>
        </div>
      </div>
    </div>
  );
}

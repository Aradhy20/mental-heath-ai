'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Mail, Lock, User, ArrowRight, Loader2, AlertCircle } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { PrimaryButton } from '@/components/ui/primary-button'

export default function AuthPage() {
  const router  = useRouter()
  const searchParams = useSearchParams()
  const { login, register } = useAuthStore()

  const initialMode = searchParams.get('authMode') === 'register' ? 'register' : 'login'
  const [mode,     setMode]     = useState<'login' | 'register'>(initialMode)
  const [username, setUsername] = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'login') {
        await login(email, password)
      } else {
        await register(username, email, password)
      }
      router.push('/dashboard')
    } catch (err: any) {
      setError(err?.message ?? 'Authentication failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090B] relative overflow-hidden px-4">
      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-violet-800/8 blur-[80px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <motion.div
            className="inline-flex p-4 bg-violet-600/20 border border-violet-500/30 rounded-3xl mb-6 shadow-xl shadow-violet-500/10"
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <Brain size={36} className="text-violet-400" />
          </motion.div>
          <h1 className="text-3xl font-black tracking-tight text-white">MindfulAI</h1>
          <p className="text-zinc-500 text-sm mt-2 font-medium">Your AI-powered mental health companion</p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-white/5 border border-white/8 rounded-2xl p-1 mb-8">
          {(['login', 'register'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => { setMode(tab); setError('') }}
              className={cn(
                'flex-1 py-3 rounded-xl text-sm font-bold capitalize transition-all duration-300',
                mode === tab
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30'
                  : 'text-zinc-400 hover:text-zinc-200'
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence>
            {mode === 'register' && (
              <motion.div
                key="username"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
              >
                <div className="relative">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required={mode === 'register'}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 pl-11 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-violet-500/60 focus:bg-violet-500/5 transition-all"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative">
            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 pl-11 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-violet-500/60 focus:bg-violet-500/5 transition-all"
            />
          </div>

          <div className="relative">
            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 pl-11 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-violet-500/60 focus:bg-violet-500/5 transition-all"
            />
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm"
              >
                <AlertCircle size={16} className="shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <PrimaryButton
            type="submit"
            loading={loading}
            className="w-full mt-2"
          >
            {mode === 'login' ? 'Sign In' : 'Create Account'}
            <ArrowRight size={18} />
          </PrimaryButton>
        </form>

        <p className="text-center text-zinc-600 text-xs mt-8">
          By continuing, you agree to our{' '}
          <span className="text-violet-400 cursor-pointer hover:underline">Terms</span> &amp;{' '}
          <span className="text-violet-400 cursor-pointer hover:underline">Privacy Policy</span>
        </p>
      </motion.div>
    </div>
  )
}

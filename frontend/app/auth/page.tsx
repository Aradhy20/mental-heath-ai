'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, User, ArrowRight, Loader2, AlertCircle } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/ui/logo'

export default function AuthPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, register } = useAuthStore()

  const initialMode = searchParams.get('authMode') === 'register' ? 'register' : 'login'
  const [mode, setMode] = useState<'login' | 'register'>(initialMode)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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
      setError(err?.message ?? 'Neural link failed. Please retry synchronization.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] relative overflow-hidden px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Branding */}
        <div className="flex flex-col items-center mb-12">
          <Logo className="mb-6 scale-110" withText={false} />
          <h1 className="text-4xl font-black tracking-tight text-foreground mb-2">MindfulAI</h1>
          <p className="text-muted-foreground font-semibold text-sm">Your AI-powered mental health companion</p>
        </div>

        {/* Demo Access Box */}
        <div className="bg-gradient-to-r from-primary/10 to-violet-500/10 border border-primary/20 rounded-2xl p-5 mb-10">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-2">🎓 Demo Access Credentials</p>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-foreground">Email: <span className="text-primary font-mono">demo@mindful.ai</span></p>
              <p className="text-xs font-bold text-foreground mt-0.5">Password: <span className="text-primary font-mono">Demo@2026</span></p>
            </div>
            <button
              type="button"
              onClick={() => { setEmail('demo@mindful.ai'); setPassword('Demo@2026'); setMode('login') }}
              className="shrink-0 px-4 py-2 bg-primary text-white text-xs font-black rounded-xl hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
            >
              Use Demo
            </button>
          </div>
        </div>

        {/* Auth Interface */}
        <div className="space-y-8">
          {/* Tab Toggle */}
          <div className="flex items-center bg-[#EAEAF0]/50 p-1.5 rounded-[2rem] border border-[#E0E0E8]">
            {(['login', 'register'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => { setMode(tab); setError('') }}
                className={cn(
                  'flex-1 py-4 rounded-[1.8rem] text-sm font-bold capitalize transition-all duration-300',
                  mode === tab
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {mode === 'register' && (
                <motion.div
                  key="username"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <div className="relative group">
                    <User size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                      type="text"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required={mode === 'register'}
                      className="w-full bg-[#EAEAF0]/50 border border-[#E0E0E8] rounded-2xl px-6 py-5 pl-14 text-sm font-bold text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 focus:bg-white transition-all"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative group">
              <Mail size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#EAEAF0]/50 border border-[#E0E0E8] rounded-2xl px-6 py-5 pl-14 text-sm font-bold text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 focus:bg-white transition-all"
              />
            </div>

            <div className="relative group">
              <Lock size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full bg-[#EAEAF0]/50 border border-[#E0E0E8] rounded-2xl px-6 py-5 pl-14 text-sm font-bold text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 focus:bg-white transition-all"
              />
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-bold"
                >
                  <AlertCircle size={16} className="shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-primary text-white rounded-[2.5rem] font-black text-lg shadow-xl shadow-primary/30 hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-3 mt-4"
            >
              {loading ? <Loader2 size={24} className="animate-spin" /> : (
                <>
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={22} />
                </>
              )}
            </motion.button>
          </form>

          <p className="text-center text-muted-foreground font-semibold text-xs mt-8">
            By continuing, you agree to our <span className="text-primary cursor-pointer">Terms</span> & <span className="text-primary cursor-pointer">Privacy Policy</span>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

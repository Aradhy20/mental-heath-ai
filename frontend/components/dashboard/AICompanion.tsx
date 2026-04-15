'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import { Sparkles, Brain, Heart, MessageCircle } from 'lucide-react'
import Link from 'next/link'

// ─── Floating Particle ──────────────────────────────────────────────────────
function Particle({ delay, x, y, size, color }: {
  delay: number; x: number; y: number; size: number; color: string
}) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ width: size, height: size, background: color, left: `${x}%`, top: `${y}%` }}
      animate={{
        y: [-8, 8, -8],
        x: [-4, 4, -4],
        opacity: [0.4, 0.9, 0.4],
        scale: [0.8, 1.2, 0.8],
      }}
      transition={{ duration: 3 + delay, repeat: Infinity, delay, ease: 'easeInOut' }}
    />
  )
}

// ─── Breathing Ring ──────────────────────────────────────────────────────────
function BreathingRing({ radius, delay, color }: { radius: number; delay: number; color: string }) {
  return (
    <motion.div
      className="absolute inset-0 m-auto rounded-full border"
      style={{ width: radius * 2, height: radius * 2, borderColor: color, marginTop: 'auto', marginBottom: 'auto', marginLeft: 'auto', marginRight: 'auto' }}
      animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.7, 0.3] }}
      transition={{ duration: 4, repeat: Infinity, delay, ease: 'easeInOut' }}
    />
  )
}

// ─── Eye ─────────────────────────────────────────────────────────────────────
function Eye({ x = 0, y = 0 }: { x?: number; y?: number }) {
  return (
    <div className="relative w-5 h-4 bg-white rounded-full overflow-hidden flex items-center justify-center shadow-inner">
      <motion.div
        className="w-3 h-3 bg-indigo-900 rounded-full relative"
        animate={{
          x: x * 2,
          y: y * 1.5,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-white rounded-full opacity-80" />
      </motion.div>
    </div>
  )
}

// ─── Face expressions ─────────────────────────────────────────────────────────
const EXPRESSIONS = [
  { mouth: 'M 6,12 Q 12,16 18,12', label: 'happy' },
  { mouth: 'M 6,14 Q 12,10 18,14', label: 'calm' },
  { mouth: 'M 6,13 L 18,13',       label: 'neutral' },
]

// ─── Main AI Companion Component ─────────────────────────────────────────────
export default function AICompanion({ userName = 'there' }: { userName?: string }) {
  const [expression, setExpression] = useState(0)
  const [isBlinking, setIsBlinking] = useState(false)
  const [isTalking, setIsTalking] = useState(false)
  const [message, setMessage] = useState('')
  const [showMessage, setShowMessage] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const MESSAGES = [
    `Hey ${userName} 👋 — I noticed you haven't checked in today!`,
    'Take a deep breath with me. Inhale… exhale… 🌬️',
    'Your resilience score is looking good this week! 🌟',
    'Want to talk about how you\'re feeling? I\'m here 💜',
    'Remember: small steps lead to big changes. Keep going! 🚀',
    'Have you tried journaling today? It really helps 📖',
  ]

  // Auto-blink
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true)
      setTimeout(() => setIsBlinking(false), 180)
    }, 3500)
    return () => clearInterval(blinkInterval)
  }, [])

  // Rotate expressions
  useEffect(() => {
    const exprInterval = setInterval(() => {
      setExpression(e => (e + 1) % EXPRESSIONS.length)
    }, 5000)
    return () => clearInterval(exprInterval)
  }, [])

  // Auto pop up a message
  useEffect(() => {
    const msgTimeout = setTimeout(() => {
      const idx = Math.floor(Math.random() * MESSAGES.length)
      setMessage(MESSAGES[idx])
      setShowMessage(true)
      setIsTalking(true)
      setTimeout(() => { setShowMessage(false); setIsTalking(false) }, 5000)
    }, 2500)
    return () => clearTimeout(msgTimeout)
  }, [])

  // Track mouse for eye tracking
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2
      setMousePos({
        x: Math.max(-1, Math.min(1, (e.clientX - cx) / cx)),
        y: Math.max(-1, Math.min(1, (e.clientY - cy) / cy)),
      })
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  const handleClick = () => {
    const idx = Math.floor(Math.random() * MESSAGES.length)
    setMessage(MESSAGES[idx])
    setShowMessage(true)
    setIsTalking(true)
    setTimeout(() => { setShowMessage(false); setIsTalking(false) }, 5000)
  }

  return (
    <div className="relative flex flex-col items-center justify-center gap-5">

      {/* ── Floating particles around companion ── */}
      <div className="relative w-52 h-52 flex items-center justify-center">
        {/* Ambient rings */}
        <BreathingRing radius={90} delay={0}   color="rgba(139, 92, 246, 0.15)" />
        <BreathingRing radius={75} delay={1}   color="rgba(99, 102, 241, 0.2)" />
        <BreathingRing radius={60} delay={2}   color="rgba(167, 139, 250, 0.25)" />

        {/* Floating particles */}
        <Particle delay={0}   x={10}  y={20}  size={6}  color="rgba(139, 92, 246, 0.6)" />
        <Particle delay={0.7} x={80}  y={15}  size={5}  color="rgba(99, 102, 241, 0.5)" />
        <Particle delay={1.4} x={85}  y={70}  size={7}  color="rgba(167, 139, 250, 0.5)" />
        <Particle delay={2.1} x={15}  y={75}  size={5}  color="rgba(168, 85, 247, 0.45)" />
        <Particle delay={0.3} x={50}  y={5}   size={4}  color="rgba(59, 130, 246, 0.5)" />
        <Particle delay={1.8} x={45}  y={90}  size={6}  color="rgba(16, 185, 129, 0.4)" />

        {/* Companion body */}
        <motion.button
          onClick={handleClick}
          className="relative z-10 w-28 h-28 select-none focus:outline-none"
          animate={{
            y: [-5, 5, -5],
            rotate: [-1, 1, -1],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Shadow */}
          <motion.div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-4 bg-violet-500/20 rounded-full blur-sm"
            animate={{ scaleX: [1, 0.85, 1], opacity: [0.4, 0.2, 0.4] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Main orb */}
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-violet-500 via-indigo-500 to-purple-600 shadow-2xl shadow-violet-500/50 flex items-center justify-center relative overflow-hidden">
            {/* Inner glow */}
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/20 to-transparent" />

            {/* Talking pulse */}
            <AnimatePresence>
              {isTalking && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-violet-400/30"
                  initial={{ scale: 1, opacity: 0.5 }}
                  animate={{ scale: 1.08, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                />
              )}
            </AnimatePresence>

            {/* Face */}
            <div className="relative z-10 flex flex-col items-center gap-1.5">
              {/* Eyes row */}
              <div className="flex gap-3 items-center">
                <motion.div
                  animate={{ scaleY: isBlinking ? 0.05 : 1 }}
                  transition={{ duration: 0.1 }}
                >
                  <Eye x={mousePos.x} y={mousePos.y} />
                </motion.div>
                <motion.div
                  animate={{ scaleY: isBlinking ? 0.05 : 1 }}
                  transition={{ duration: 0.1 }}
                >
                  <Eye x={mousePos.x} y={mousePos.y} />
                </motion.div>
              </div>

              {/* Mouth (SVG animated) */}
              <svg width="24" height="12" viewBox="0 0 24 20">
                <motion.path
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                  animate={{ d: EXPRESSIONS[expression].mouth }}
                  transition={{ duration: 0.6, ease: 'easeInOut' }}
                />
              </svg>
            </div>
          </div>
        </motion.button>
      </div>

      {/* ── Chat bubble ── */}
      <AnimatePresence>
        {showMessage && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.9 }}
            className="absolute -top-4 left-1/2 -translate-x-1/2 w-64 bg-white dark:bg-[#1a1f36] rounded-2xl rounded-bl-none shadow-xl border border-violet-100 dark:border-violet-500/20 px-4 py-3 z-20"
          >
            <p className="text-xs font-medium text-slate-700 dark:text-slate-200 leading-relaxed">{message}</p>
            {/* Triangle pointer */}
            <div className="absolute -bottom-2 left-6 w-4 h-2 overflow-hidden">
              <div className="w-3 h-3 bg-white dark:bg-[#1a1f36] border-r border-b border-violet-100 dark:border-violet-500/20 rotate-45 -translate-y-1.5 translate-x-0.5" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Label + CTA ── */}
      <div className="text-center space-y-1">
        <div className="flex items-center justify-center gap-1.5">
          <motion.span
            className="w-2 h-2 rounded-full bg-emerald-400"
            animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <p className="text-xs font-bold text-slate-600 dark:text-slate-300">MindfulAI Companion</p>
        </div>
        <p className="text-[10px] text-slate-400 dark:text-slate-500">Click me to say hi!</p>
      </div>

      {/* ── Quick action pills ── */}
      <div className="flex gap-2 flex-wrap justify-center">
        {[
          { icon: MessageCircle, label: 'Chat', href: '/chat', color: 'from-violet-500 to-indigo-500' },
          { icon: Heart,         label: 'Breathe', href: '/anakskit', color: 'from-teal-500 to-emerald-500' },
          { icon: Brain,         label: 'Assess', href: '/assessment', color: 'from-blue-500 to-cyan-500' },
        ].map(({ icon: Icon, label, href, color }) => (
          <Link key={label} href={href}>
            <motion.div
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r ${color} text-white text-[11px] font-bold shadow-lg cursor-pointer`}
            >
              <Icon size={11} /> {label}
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  )
}

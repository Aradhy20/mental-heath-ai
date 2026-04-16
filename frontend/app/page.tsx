'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Sparkles, Brain, Heart, Wind, Shield, Check, 
  ArrowRight, MessageCircle, Activity, Star,
  Zap, MapPin, Globe, Lock
} from 'lucide-react'

// ── Components ──────────────────────────────────────────────────────────────

const Nav = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-white/5">
    <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center shadow-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10">
          <img src="/logo.png" alt="MindfulAI Logo" className="w-full h-full object-cover" />
        </div>
        <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">MindfulAI</span>
      </div>
      
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-400">
        <a href="#features" className="hover:text-violet-600 transition-colors">Features</a>
        <a href="#how-it-works" className="hover:text-violet-600 transition-colors">How it Works</a>
      </div>

      <div className="flex items-center gap-4">
        <Link href="/login" className="text-sm font-bold text-slate-700 dark:text-white hover:text-violet-600 transition-colors">Login</Link>
        <Link href="/register" className="px-6 py-2.5 bg-violet-600 hover:bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-violet-500/25 transition-all">
          Get Started
        </Link>
      </div>
    </div>
  </nav>
)

const Hero = () => (
  <section className="relative pt-32 pb-20 overflow-hidden bg-slate-50 dark:bg-[#0a0d1a]">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
      <div className="absolute top-20 left-10 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-700" />
    </div>

    <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-100 dark:bg-violet-500/15 text-violet-700 dark:text-violet-400 text-xs font-bold mb-8 border border-violet-200 dark:border-violet-500/20"
      >
        <Sparkles size={12} />
        <span>AI-powered Mental Wellness for the Next Gen</span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white leading-[1.1] mb-8"
      >
        Your feelings, <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">finally understood.</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
      >
        MindfulAI combines deep empathy with clinical science. 
        Track your mood, journal with AI reflection, and speak to an AI companion who truly listens.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-4"
      >
        <Link href="/register" className="w-full sm:w-auto px-8 py-4 bg-violet-600 hover:bg-violet-700 text-white rounded-2xl text-lg font-bold shadow-xl shadow-violet-500/25 transition-all flex items-center justify-center gap-2">
          Start Free Journey <ArrowRight size={20} />
        </Link>
        <Link href="/about" className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-2xl text-lg font-bold hover:bg-slate-50 transition-all">
          How it Works
        </Link>
      </motion.div>

      {/* Hero Image Mockup Area */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="mt-20 relative px-4"
      >
        <div className="max-w-5xl mx-auto rounded-3xl bg-white dark:bg-[#0f1629] border border-slate-200 dark:border-white/[0.08] shadow-2xl p-4 overflow-hidden">
          <div className="bg-slate-50 dark:bg-[#0a0d1a] rounded-2xl h-64 md:h-[480px] flex items-center justify-center overflow-hidden relative">
             <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-indigo-600/5" />
             <div className="grid grid-cols-12 gap-4 p-8 w-full h-full opacity-60">
                <div className="col-span-3 h-full bg-slate-200 dark:bg-white/5 rounded-xl border border-dashed border-slate-300 dark:border-white/10" />
                <div className="col-span-9 space-y-4">
                   <div className="h-20 w-full bg-slate-200 dark:bg-white/5 rounded-xl border border-dashed border-slate-300 dark:border-white/10" />
                   <div className="grid grid-cols-3 gap-4 h-32">
                      <div className="bg-slate-200 dark:bg-white/5 rounded-xl border border-dashed border-slate-300 dark:border-white/10" />
                      <div className="bg-slate-200 dark:bg-white/5 rounded-xl border border-dashed border-slate-300 dark:border-white/10" />
                      <div className="bg-slate-200 dark:bg-white/5 rounded-xl border border-dashed border-slate-300 dark:border-white/10" />
                   </div>
                   <div className="h-44 w-full bg-slate-200 dark:bg-white/5 rounded-xl border border-dashed border-slate-300 dark:border-white/10" />
                </div>
             </div>
             <p className="absolute text-slate-400 font-bold uppercase tracking-widest text-sm pointer-events-none">MindfulAI Dashboard Preview</p>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
)

const FEATURES = [
  { icon: Brain, title: "Multi-Agent Intelligence", desc: "A swarm of specialized AI agents (Therapists, Coaches, Analysts) collaborate to understand your unique mental state.", color: "text-blue-500", bg: "bg-blue-500/10" },
  { icon: Shield, title: "Clinical Risk Protocols", desc: "Strict safety-first overrides monitor for high-risk signals and provide immediate emergency resources when needed.", color: "text-rose-500", bg: "bg-rose-500/10" },
  { icon: Activity, title: "Predictive Forecasting", desc: "Our Temporal Engine projects your anxiety and burnout instability windows 48h in advance using your behavioral data.", color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { icon: Lock, title: "Local Privacy (Ollama)", desc: "Optional local model support ensures your clinical conversations never leave your device. Private by design.", color: "text-slate-500", bg: "bg-slate-500/10" },
  { icon: MapPin, title: "Wellness Map", desc: "Find nearby Yoga, Gyms, and clinical facilities instantly with integrated OSM navigation.", color: "text-indigo-500", bg: "bg-indigo-500/10" },
  { icon: Heart, title: "Data-Driven CBT", desc: "Experience Cognitive Behavioral Therapy justified by your real-world sleep and stress metrics, not just generic advice.", color: "text-violet-500", bg: "bg-violet-500/10" },
]

const Features = () => (
  <section id="features" className="py-24 bg-white dark:bg-[#0f1629]">
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-20">
        <h2 className="text-sm font-bold text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-3">Capabilities</h2>
        <p className="text-4xl font-bold text-slate-900 dark:text-white">Built for more than just tracking.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {FEATURES.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className="p-8 rounded-3xl border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02] hover:shadow-xl hover:shadow-violet-500/5 transition-all group"
          >
            <div className={`w-14 h-14 rounded-2xl ${f.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              <f.icon className={f.color} size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{f.title}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
)

const STATS = [
  { label: "Active Users", value: "50k+" },
  { label: "Journals Written", value: "1.2M" },
  { label: "Stress Reduced", value: "35%" },
  { label: "App Rating", value: "4.9/5" },
]

const Footer = () => (
  <footer className="py-20 bg-slate-900 text-white">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-2 space-y-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg overflow-hidden bg-white dark:bg-white/10 flex items-center justify-center shadow-sm border border-white/20">
              <img src="/logo.png" alt="MindfulAI" className="w-full h-full object-cover" />
            </div>
            <span className="font-bold text-xl tracking-tight">MindfulAI</span>
          </div>
          <p className="text-slate-400 max-w-sm">
            Empowering the next generation with AI-driven mental health support. Private, empathetic, and clinical-grade insights.
          </p>
        </div>
        <div>
          <h4 className="font-bold mb-6">Product</h4>
          <ul className="space-y-4 text-slate-400 text-sm">
            <li><Link href="/features">Features</Link></li>
            <li><Link href="/pricing">Pricing</Link></li>
            <li><Link href="/chat">AI Therapy</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-6">Support</h4>
          <ul className="space-y-4 text-slate-400 text-sm">
            <li><Link href="/help">Help Center</Link></li>
            <li><Link href="/privacy">Privacy Policy</Link></li>
            <li><Link href="/contact">Contact Us</Link></li>
          </ul>
        </div>
      </div>
      <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-slate-500 text-xs font-medium">
        <p>© 2026 MindfulAI SaaS Platform. All rights reserved.</p>
        <div className="flex items-center gap-6">
           <a href="#">Twitter</a>
           <a href="#">Instagram</a>
           <a href="#">LinkedIn</a>
        </div>
      </div>
    </div>
  </footer>
)

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Nav />
      <Hero />
      <Features />
      
      {/* Testimonial / Social Proof */}
      <section className="py-24 bg-slate-50 dark:bg-[#0a0d1a]">
        <div className="max-w-4xl mx-auto px-6 text-center">
           <div className="flex justify-center gap-1 mb-8">
              {[1,2,3,4,5].map(i => <Star key={i} size={24} className="text-amber-400 fill-amber-400" />)}
           </div>
           <p className="text-2xl md:text-3xl font-medium text-slate-800 dark:text-slate-200 italic mb-10 leading-relaxed">
             "MindfulAI is the first wellness app that actually feels like it knows me. The AI chat isn't generic — it's warm, supportive, and remarkably insightful."
           </p>
           <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-white/10" />
              <div className="text-left">
                <p className="font-bold text-slate-900 dark:text-white">Sarah Jenkins</p>
                <p className="text-sm text-slate-500">Wellness Blogger & Beta User</p>
              </div>
           </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white dark:bg-[#0f1629]">
        <div className="max-w-5xl mx-auto px-6 pt-20">
          <div className="relative rounded-[3rem] bg-gradient-to-br from-violet-600 to-indigo-700 p-12 overflow-hidden text-center text-white">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.8),transparent)]" />
            <h2 className="text-4xl md:text-5xl font-bold mb-6 relative z-10">Start your journey to calm.</h2>
            <p className="text-violet-100 text-lg mb-10 max-w-xl mx-auto relative z-10">Join 50,000+ others finding clarity and peace with MindfulAI.</p>
            <Link href="/register" className="inline-flex items-center gap-2 px-10 py-5 bg-white text-violet-700 rounded-2xl text-xl font-bold hover:bg-violet-50 transition-all shadow-xl relative z-10">
              Get MindfulAI Free <ArrowRight size={24} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
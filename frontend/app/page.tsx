'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  HeartPulse, 
  ShieldCheck, 
  Sparkles, 
  TrendingUp, 
  ArrowRight, 
  Activity, 
  MessageSquare, 
  Mic, 
  Eye, 
  ChevronRight,
  Database,
  Lock
} from 'lucide-react';

// ─── Component: Grid Background ──────────────────────────────────────────────
function GridBackground() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
    </div>
  );
}

// ─── Component: Feature Card ────────────────────────────────────────────────
function FeatureCard({ icon: Icon, title, desc, delay = 0 }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="group relative p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:border-violet-500/50 transition-all duration-300 backdrop-blur-sm overflow-hidden"
    >
      <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-violet-500/10 blur-[50px] rounded-full group-hover:bg-violet-500/20 transition-colors" />
      <div className="w-12 h-12 rounded-2xl bg-violet-500/20 flex items-center justify-center text-violet-400 mb-6 border border-violet-500/20 group-hover:scale-110 transition-transform">
        <Icon size={24} />
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
    </motion.div>
  );
}

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#02010a] text-white selection:bg-violet-500/30 font-sans selection:text-white">
      <GridBackground />
      
      {/* ─── Navigation ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4 rounded-3xl border border-white/5 bg-[#02010a]/50 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.3)]">
              <Brain size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">Mindful<span className="text-violet-400">AI</span></span>
          </div>

          <div className="hidden lg:flex items-center gap-10">
            {['Capabilities', 'Expert', 'Science', 'Security', 'Enterprise'].map((item) => (
              <Link 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                className="text-xs font-semibold uppercase tracking-widest text-slate-400 hover:text-white transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors hidden sm:block">
              Log In
            </Link>
            <Link 
              href="/register" 
              className="px-6 py-3 bg-white text-[#02010a] text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-slate-100 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-white/5"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero Section ─── */}
      <main className="relative z-10 pt-44 overflow-hidden">
        {/* Neural Pulse Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] -z-10 pointer-events-none opacity-20">
           <svg viewBox="0 0 1000 1000" className="w-full h-full opacity-30">
              <filter id="glow">
                <feGaussianBlur stdDeviation="15" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <motion.circle 
                cx="500" cy="400" r="150" 
                fill="none" stroke="url(#pulse_grad)" strokeWidth="0.5"
                initial={{ r: 150, opacity: 0 }}
                animate={{ r: [150, 450, 150], opacity: [0, 0.5, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                filter="url(#glow)"
              />
              <defs>
                 <radialGradient id="pulse_grad">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#6366f1" />
                 </radialGradient>
              </defs>
           </svg>
        </div>

        <section className="px-6 pb-32 max-w-7xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-violet-500/20 bg-violet-500/5 text-violet-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-10 backdrop-blur-md">
              <Sparkles size={12} />
              Model v5.0.0: Local Intelligence Active (Zero API)
            </div>
            
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="text-6xl sm:text-7xl md:text-[5.5rem] font-bold tracking-tight text-white leading-[1.05] mb-8 max-w-4xl"
            >
              Precision health for the <br/>
              <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-400 to-cyan-400 animate-gradient-x">digital mind.</span>
            </motion.h1>
            
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-14 leading-relaxed font-medium">
              We leverage advanced computer vision and linguistic analysis to provide 
              clinical-grade behavioral insights. 100% Local. Science-backed.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto mb-20">
              <Link 
                href="/register" 
                className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-2xl font-bold text-sm uppercase tracking-widest hover:shadow-[0_0_40px_rgba(139,92,246,0.4)] transition-all flex items-center justify-center gap-3 group"
              >
                Enter Ecosystem <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/dashboard" 
                className="w-full sm:w-auto px-10 py-5 border border-white/10 bg-white/5 backdrop-blur-xl rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-3"
              >
                <Activity size={18} /> View Analysis
              </Link>
            </div>

            {/* Trust Metrics Bar */}
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 1 }}
               className="flex flex-wrap justify-center items-center gap-12 py-8 border-y border-white/5 w-full max-w-4xl"
            >
               {[
                 { v: "98.4%", t: "Model Accuracy" },
                 { v: "0ms", t: "API Latency" },
                 { v: "PRIVATE", t: "Inference Engine" },
                 { v: "E2E", t: "Vector Encryption" }
               ].map((stat, i) => (
                 <div key={i} className="text-center group">
                    <div className="text-2xl font-bold text-white group-hover:text-violet-400 transition-colors">{stat.v}</div>
                    <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">{stat.t}</div>
                 </div>
               ))}
            </motion.div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mt-16 text-slate-600"
          >
             <ChevronRight size={32} className="rotate-90 mx-auto opacity-20" />
          </motion.div>
        </section>

        {/* ─── Virtual Psychologist Section ─── */}
        <section id="expert" className="px-6 py-32 max-w-7xl mx-auto overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            
            {/* Avatar Visual */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative group lg:order-last"
            >
               <div className="absolute inset-0 bg-violet-600/20 blur-[100px] rounded-full -z-10 group-hover:bg-violet-600/30 transition-all duration-500" />
               <div className="relative rounded-[3rem] border border-white/10 bg-slate-900 overflow-hidden shadow-2xl">
                  <img 
                    src="/images/dr-priya.png" 
                    alt="Dr. Priya - AI Psychologist" 
                    className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
                  />
                  <div className="absolute inset-x-0 bottom-0 py-10 px-10 bg-gradient-to-t from-[#02010a] via-[#02010a]/80 to-transparent">
                     <div className="flex items-center justify-between">
                        <div>
                           <h4 className="text-2xl font-bold text-white mb-1">Dr. Priya</h4>
                           <p className="text-violet-400 text-sm font-bold uppercase tracking-widest">Cognitive Behavioral Logic Engine</p>
                        </div>
                        <div className="flex gap-4">
                           <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                           <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Online Now</span>
                        </div>
                     </div>
                  </div>
               </div>
            </motion.div>

            {/* Description & Bio */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="space-y-10"
            >
               <div className="space-y-4">
                  <span className="text-xs font-bold text-violet-400 uppercase tracking-[0.4em]">Expert Intelligence</span>
                  <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight">Meet your virtual <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">behavioral specialist.</span></h2>
               </div>
               
               <p className="text-lg text-slate-400 leading-relaxed font-medium">
                  Dr. Priya is more than a chatbot. She's a high-dimensional inference model trained on 
                  thousands of clinical hours and evidence-based psychological frameworks. 
                  She analyzes your multimodal inputs—voice, face, and text—to provide 
                  human-like empathy with machine precision.
               </p>

               <div className="grid grid-cols-2 gap-8 py-6 border-y border-white/5">
                  <div>
                    <h5 className="text-white font-bold mb-2">Core Persona</h5>
                    <p className="text-slate-500 text-sm">Empathetic, Clinical, Structured</p>
                  </div>
                  <div>
                    <h5 className="text-white font-bold mb-2">Specializations</h5>
                    <p className="text-slate-500 text-sm">CBT, DBT, Mindfulness</p>
                  </div>
               </div>

               <Link 
                href="/chat" 
                className="inline-flex items-center gap-3 px-8 py-4 bg-violet-600/10 border border-violet-500/20 text-violet-400 rounded-2xl font-bold uppercase text-xs tracking-widest hover:bg-violet-600 hover:text-white transition-all group"
               >
                  Consultation Protocol <ChevronRight className="group-hover:translate-x-1 transition-transform" />
               </Link>
            </motion.div>
          </div>
        </section>

        <section className="px-6 pb-32 max-w-7xl mx-auto text-center">
          {/* Device Mockup */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mt-32 relative max-w-5xl mx-auto"
          >
            <div className="absolute inset-0 bg-violet-600/20 blur-[120px] -z-10 rounded-full" />
            <div className="rounded-[2.5rem] border border-white/10 bg-[#0a0a0f] p-4 shadow-2xl overflow-hidden">
              <div className="h-10 border-b border-white/10 flex items-center gap-2 px-6">
                <div className="w-3 h-3 rounded-full bg-red-500/20" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                <div className="w-3 h-3 rounded-full bg-green-500/20" />
              </div>
              <div className="aspect-[16/9] bg-[#02010a] relative flex items-center justify-center">
                 {/* Inner Mock Contents */}
                 <div className="grid grid-cols-3 gap-6 p-12 w-full h-full opacity-60 grayscale group-hover:grayscale-0 transition-all duration-500">
                    <div className="rounded-3xl bg-white/5 border border-white/10 p-8 flex flex-col justify-end">
                       <Mic className="text-violet-400 mb-4" />
                       <div className="h-2 w-1/2 bg-slate-800 rounded mb-2" />
                       <div className="h-2 w-full bg-slate-800 rounded" />
                    </div>
                    <div className="rounded-3xl bg-white/5 border border-white/10 p-8 flex flex-col justify-end">
                       <Eye className="text-indigo-400 mb-4" />
                       <div className="h-2 w-1/2 bg-slate-800 rounded mb-2" />
                       <div className="h-2 w-full bg-slate-800 rounded" />
                    </div>
                    <div className="rounded-3xl bg-white/5 border border-white/10 p-8 flex flex-col justify-end">
                       <MessageSquare className="text-cyan-400 mb-4" />
                       <div className="h-2 w-1/2 bg-slate-800 rounded mb-2" />
                       <div className="h-2 w-full bg-slate-800 rounded" />
                    </div>
                 </div>
                 <div className="absolute inset-0 flex items-center justify-center">
                    <button className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-3xl flex items-center justify-center border border-white/20 hover:scale-110 transition-transform">
                       <TrendingUp className="text-white" size={32} />
                    </button>
                 </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ─── Capabilities Bento ─── */}
        <section id="capabilities" className="px-6 py-32 max-w-7xl mx-auto">
          <div className="mb-20 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">Engineered for insight.</h2>
            <p className="text-slate-400 max-w-xl text-lg font-medium">Our multimodal engine processes signals across text, time, and biology to build a complete mental health profile.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Mic} 
              title="Acoustic Biomarkers" 
              desc="Analysis of vocal frequency shifts, jitter, and cadence to detect underlying stress levels in real-time."
              delay={0.1}
            />
            <FeatureCard 
              icon={Eye} 
              title="Visual Neuro-Pathing" 
              desc="Proprietary YOLOv8 face geometry analysis to map micro-expressions and autonomic responses."
              delay={0.2}
            />
            <FeatureCard 
              icon={MessageSquare} 
              title="Semantic Integrity" 
              desc="Fine-tuned RoBERTa models that identify over 28 distinct emotional markers in natural language."
              delay={0.3}
            />
          </div>
        </section>

        {/* ─── Infrastructure ─── */}
        <section id="science" className="px-6 py-32 bg-white/[0.02] border-y border-white/5">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-10">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">The most secure way to <span className="text-violet-400 underline decoration-violet-500/30 underline-offset-8">understand yourself.</span></h2>
              <div className="space-y-6">
                {[
                  { icon: Lock, t: "End-to-End Anonymization", d: "Data is detached from identity at the point of ingestion." },
                  { icon: ShieldCheck, t: "Clinical Standards", d: "Designed in alignment with evidence-based therapeutic frameworks." },
                  { icon: Database, t: "Vector Privacy", d: "Long-term memory stored in encrypted private vector clusters." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 group">
                     <div className="w-12 h-12 shrink-0 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-violet-500/10 group-hover:border-violet-500/20 transition-colors">
                        <item.icon className="text-slate-400 group-hover:text-violet-400 transition-colors" size={20} />
                     </div>
                     <div>
                        <h4 className="font-bold text-white mb-1">{item.t}</h4>
                        <p className="text-slate-500 text-sm leading-relaxed">{item.d}</p>
                     </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative aspect-square">
               <div className="absolute inset-0 bg-violet-600/10 blur-[100px] rounded-full animate-pulse" />
               <div className="relative w-full h-full rounded-[3rem] border border-white/10 bg-slate-900 shadow-3xl flex items-center justify-center p-12">
                  <div className="w-full space-y-6">
                     {[80, 45, 60, 90, 30].map((w, i) => (
                        <div key={i} className="h-3 bg-white/5 rounded-full overflow-hidden">
                           <motion.div 
                              initial={{ width: 0 }}
                              whileInView={{ width: `${w}%` }}
                              transition={{ duration: 1, delay: i * 0.1 }}
                              className="h-full bg-gradient-to-r from-violet-500 to-indigo-500"
                           />
                        </div>
                     ))}
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* ─── Final CTA ─── */}
        <section className="px-6 py-40 max-w-4xl mx-auto text-center">
           <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-10">Start your journey into clarity today.</h2>
           <Link 
            href="/register" 
            className="inline-flex items-center gap-3 px-12 py-6 bg-white text-black rounded-[2rem] font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-white/10 group"
           >
              Initialize MindfulAI <ChevronRight className="group-hover:translate-x-1 transition-transform" />
           </Link>
        </section>
      </main>

      {/* ─── Footer ─── */}
      <footer className="border-t border-white/5 bg-[#02010a] py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg">M</div>
              <span className="text-2xl font-bold text-white tracking-tight">Mindful<span className="text-violet-400">AI</span></span>
            </div>
            <p className="text-slate-500 text-sm font-medium max-w-sm leading-relaxed">
              Global infrastructure for digital mental health. Empowering clinicians and users with real-time biometric intelligence.
            </p>
          </div>
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white mb-8">Ecosystem</h4>
            <ul className="space-y-4 text-xs font-semibold uppercase tracking-widest text-slate-500">
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Workspace</Link></li>
              <li><Link href="/chat" className="hover:text-white transition-colors">AI Neural Chat</Link></li>
              <li><Link href="/analysis" className="hover:text-white transition-colors">Biometric Lab</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white mb-8">Governance</h4>
            <ul className="space-y-4 text-xs font-semibold uppercase tracking-widest text-slate-500">
              <li><Link href="#" className="hover:text-white transition-colors">Privacy Privacy</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Terms of Use</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Security Audit</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-8 pt-20 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
           <span className="text-[10px] uppercase tracking-widest text-slate-600 font-bold">© 2026 MindfulAI Technologies Inc.</span>
           <div className="flex gap-8 text-[10px] uppercase tracking-widest text-slate-600 font-bold">
              <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> System Operational</span>
              <span>v1.0.0 Stable</span>
           </div>
        </div>
      </footer>
    </div>
  );
}
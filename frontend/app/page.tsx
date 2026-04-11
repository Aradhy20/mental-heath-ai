'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Brain, HeartPulse, ShieldCheck, Sparkles, TrendingUp, Users, ArrowRight, Activity, MessageCircle, Zap } from 'lucide-react';

// ─── Component: Floating Particles ──────────────────────────────────────────
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-violet-400/20 rounded-full"
          initial={{
            x: Math.random() * 100 + '%',
            y: Math.random() * 100 + '%',
            scale: Math.random() * 2,
          }}
          animate={{
            y: [null, '-20%', '120%'],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: 'linear',
            delay: Math.random() * 10,
          }}
        />
      ))}
    </div>
  )
}

// ─── Component: Word Reveal ──────────────────────────────────────────────
function WordReveal({ text, className }: { text: string, className?: string }) {
  const words = text.split(' ')
  
  return (
    <h1 className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: i * 0.1,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="inline-block mr-[0.2em]"
        >
          {word}
        </motion.span>
      ))}
    </h1>
  )
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#030014] overflow-x-hidden selection:bg-purple-500/30 font-sans">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]"></div>
        <div className="absolute top-[10%] left-[5%] w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[120px] mix-blend-screen animate-pulse"></div>
        <div className="absolute top-[30%] right-[5%] w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] mix-blend-screen" style={{ animationDelay: '3s' }}></div>
        <FloatingParticles />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-8 max-w-7xl mx-auto backdrop-blur-xl bg-[#030014]/30 border-b border-white border-opacity-5">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-[0_0_30px_rgba(139,92,246,0.3)]">
              C
           </div>
           <span className="text-2xl font-black tracking-tighter text-white">Calm<span className="text-violet-400">Space</span></span>
        </div>
        <div className="hidden lg:flex gap-10 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
           <Link href="#features" className="hover:text-white transition-colors">Features</Link>
           <Link href="#science" className="hover:text-white transition-colors">Neural Hub</Link>
           <Link href="#pricing" className="hover:text-white transition-colors">Membership</Link>
        </div>
        <div className="flex items-center gap-6">
           <Link href="/login" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors hidden sm:block">Log In</Link>
           <Link href="/register" className="px-6 py-3 bg-white text-[#030014] text-xs font-black uppercase tracking-widest rounded-xl hover:bg-slate-200 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 shadow-xl shadow-white/10">
             Start Engine <Zap size={14} fill="currentColor" />
           </Link>
        </div>
      </nav>

      <main className="relative z-10 pt-48 pb-20">
        
        {/* HERO SECTION */}
        <section className="relative px-6 pt-20 pb-40 max-w-7xl mx-auto text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-5xl flex flex-col items-center"
          >
            <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-violet-500/20 bg-violet-500/5 text-violet-400 text-[10px] font-black uppercase tracking-[0.2em] mb-12 backdrop-blur-md"
            >
              <Sparkles size={14} className="text-violet-400" />
              MindfulAI 3.0 Real-time Inference Active
            </motion.div>
            
            <WordReveal 
              text="Clarity is not found. It is engineered." 
              className="text-6xl sm:text-7xl md:text-9xl font-black tracking-tighter text-white leading-[0.9] mb-12"
            />
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="text-lg md:text-2xl text-slate-500 font-medium max-w-2xl mb-16 leading-relaxed"
            >
              The world's most advanced behavioral analysis engine. 
              Built with <span className="text-white">Gen-Z in mind</span>, powered by clinical data.
            </motion.p>

            <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto">
               <Link href="/register" className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-violet-500/20 flex items-center justify-center gap-3 group">
                 Launch Platform <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
               </Link>
               <Link href="/dashboard" className="w-full sm:w-auto px-10 py-5 border border-white/5 text-white bg-white/5 backdrop-blur-xl rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-white/10 transition-colors flex items-center justify-center gap-3">
                 <Activity size={18} /> Experience Demo
               </Link>
            </div>
          </motion.div>
        </section>

        {/* HERO UI MOCKUP */}
        <motion.section 
          style={{ y }}
          className="relative max-w-7xl mx-auto px-6 mb-40"
        >
           <div className="relative rounded-[3rem] border border-white/5 bg-slate-900/40 backdrop-blur-3xl overflow-hidden shadow-[0_0_150px_rgba(139,92,246,0.1)] p-3">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-[1px] bg-gradient-to-r from-transparent via-violet-500 to-transparent"></div>
              
              {/* UI Header */}
              <div className="flex items-center gap-2 px-6 pt-5 pb-5 border-b border-white/5 bg-white/5">
                 <div className="w-3 h-3 rounded-full bg-rose-500/40"></div>
                 <div className="w-3 h-3 rounded-full bg-amber-500/40"></div>
                 <div className="w-3 h-3 rounded-full bg-emerald-500/40"></div>
                 <div className="ml-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">core.calmspace.ai / dashboard</div>
              </div>

              {/* UI Content Sidebar + Main */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-10 bg-black/20">
                 
                 {/* Sidebar Mock */}
                 <div className="hidden lg:flex flex-col gap-4">
                    {[...Array(6)].map((_, i) => (
                       <div key={i} className={`h-12 rounded-xl border border-white/5 flex items-center px-4 gap-3 ${i === 0 ? 'bg-violet-500/10 border-violet-500/20' : ''}`}>
                          <div className={`w-5 h-5 rounded-md ${i === 0 ? 'bg-violet-500' : 'bg-slate-800'}`}></div>
                          <div className={`h-2 rounded-full ${i === 0 ? 'bg-violet-400 w-20' : 'bg-slate-700 w-16'}`}></div>
                       </div>
                    ))}
                 </div>

                 {/* Main Content Mock */}
                 <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="rounded-3xl bg-white/5 border border-white/5 p-8 flex flex-col justify-between h-80 relative overflow-hidden group">
                       <div className="absolute -right-20 -top-20 w-60 h-60 bg-violet-600/10 blur-[100px] rounded-full group-hover:bg-violet-600/20 transition-colors"></div>
                       <div>
                          <div className="w-12 h-12 rounded-2xl bg-violet-500/20 flex items-center justify-center text-violet-400 mb-6 border border-violet-500/20">
                             <TrendingUp size={24} />
                          </div>
                          <h3 className="text-xl font-black text-white mb-2">Biotic Synchrony</h3>
                          <p className="text-sm text-slate-500 font-medium">Your stress-cadence is 24% more stable today. The evening mediation loop is operational.</p>
                       </div>
                    </div>

                    <div className="rounded-3xl bg-white/5 border border-white/5 p-8 flex flex-col justify-between h-80 relative overflow-hidden group">
                       <div className="absolute -left-20 -bottom-20 w-60 h-60 bg-cyan-600/10 blur-[100px] rounded-full"></div>
                       <div>
                          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 mb-6 border border-cyan-500/20">
                             <MessageCircle size={24} />
                          </div>
                          <h3 className="text-xl font-black text-white mb-2">Neural Whisper</h3>
                          <p className="text-sm text-slate-500 font-medium">AI analysis suggests your journaling focus has shifted towards creative growth. Calibration optimal.</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </motion.section>

        {/* FEATURES BENTO GRID */}
        <section id="features" className="max-w-7xl mx-auto px-8 py-40">
           <div className="mb-24">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-violet-400 mb-4 block">Engine Components</span>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-none">Designed for the<br/>hyper-speed generation.</h2>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              <motion.div whileHover={{ y: -5 }} className="md:col-span-2 rounded-[3rem] bg-slate-900 border border-white/5 p-12 relative overflow-hidden group shadow-2xl">
                 <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/5 rounded-full blur-[120px] group-hover:bg-violet-600/10 transition-colors"></div>
                 <Brain className="w-14 h-14 text-violet-500 mb-10" />
                 <h3 className="text-3xl font-black text-white mb-4 italic">Modal Intelligence</h3>
                 <p className="text-lg text-slate-500 font-medium max-w-xl">We don't do surveys. We analyze voice frequency, facial geometry, and linguistic micro-patterns to discover the truth of your state.</p>
              </motion.div>

              <motion.div whileHover={{ y: -5 }} className="rounded-[3rem] bg-slate-900 border border-white/5 p-12 relative overflow-hidden group shadow-2xl">
                 <HeartPulse className="w-14 h-14 text-rose-500 mb-10" />
                 <h3 className="text-3xl font-black text-white mb-4 italic">Biotic Shield</h3>
                 <p className="text-lg text-slate-500 font-medium">High-fidelity encryption that detaches your data from your ID entirely.</p>
              </motion.div>

           </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/5 bg-[#030014] py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-16">
           <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-8">
                 <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-lg">C</div>
                 <span className="text-2xl font-black text-white tracking-tighter italic">CalmSpace</span>
              </div>
              <p className="text-slate-500 text-sm font-medium max-w-sm leading-relaxed">Structural foundations for digital mental clarity. Built for the era of noise, designed to be the silence.</p>
           </div>
           <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white mb-8">Core Routes</h4>
              <ul className="space-y-4 text-xs font-black uppercase tracking-widest text-slate-500">
                 <li><Link href="/dashboard" className="hover:text-violet-400 transition-colors">Neural Hub</Link></li>
                 <li><Link href="/chat" className="hover:text-violet-400 transition-colors">AI Whisper</Link></li>
                 <li><Link href="/analysis" className="hover:text-violet-400 transition-colors">Biotic Check</Link></li>
              </ul>
           </div>
           <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white mb-8">Protocols</h4>
              <ul className="space-y-4 text-xs font-black uppercase tracking-widest text-slate-500">
                 <li><Link href="#" className="hover:text-violet-400 transition-colors">Privacy Alpha</Link></li>
                 <li><Link href="#" className="hover:text-violet-400 transition-colors">Terms of Flow</Link></li>
                 <li><Link href="#" className="hover:text-violet-400 transition-colors">Ethics Core</Link></li>
              </ul>
           </div>
        </div>
      </footer>
    </div>
  );
}
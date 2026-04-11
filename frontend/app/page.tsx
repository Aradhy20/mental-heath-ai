'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Brain, HeartPulse, ShieldCheck, Sparkles, TrendingUp, Users, ArrowRight, Activity, MessageCircle } from 'lucide-react';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#030014] overflow-x-hidden selection:bg-purple-500/30">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]"></div>
        <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] mix-blend-screen animate-pulse"></div>
        <div className="absolute top-[40%] right-[10%] w-[400px] h-[400px] bg-cyan-400/10 rounded-full blur-[120px] mix-blend-screen" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto backdrop-blur-md bg-[#030014]/50 border-b border-white border-opacity-5">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 to-cyan-400 flex items-center justify-center text-white font-bold text-xl shadow-[0_0_20px_rgba(168,85,247,0.4)]">
              M
           </div>
           <span className="text-xl font-bold tracking-tight text-white drop-shadow-md">MindfulAI</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-slate-300">
           <Link href="#features" className="hover:text-white transition-colors">Features</Link>
           <Link href="#science" className="hover:text-white transition-colors">The Science</Link>
           <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
        </div>
        <div className="flex items-center gap-4">
           <Link href="/login" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors hidden sm:block">Sign In</Link>
           <Link href="/register" className="px-5 py-2.5 bg-white text-slate-900 text-sm font-semibold rounded-full hover:bg-slate-200 transition-transform hover:scale-105 active:scale-95 flex items-center gap-2">
             Start Free Trial <ArrowRight size={16} />
           </Link>
        </div>
      </nav>

      <main className="relative z-10 pt-32 pb-20">
        
        {/* HERO SECTION */}
        <section className="relative px-6 pt-20 pb-32 max-w-7xl mx-auto text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl flex flex-col items-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-sm font-medium mb-8">
              <Sparkles size={16} className="text-purple-400" />
              Introducing MindfulAI 2.0 Engine
            </div>
            
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-medium tracking-tight text-white leading-[1.1] mb-8">
              Mental Clarity.<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-cyan-400 pb-2">
                Engineered for you.
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-2xl mb-12">
              The world's most advanced behavioral analysis engine, combining GPT-4 with clinical psychology to unlock deep insights into your mental well-being.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
               <Link href="/register" className="w-full sm:w-auto px-8 py-4 bg-white text-[#030014] rounded-full font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] flex items-center justify-center gap-2">
                 Get Early Access
               </Link>
               <Link href="/dashboard" className="w-full sm:w-auto px-8 py-4 border border-white/10 text-white bg-white/5 backdrop-blur-md rounded-full font-bold text-lg hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                 <Activity size={20} /> View Live Demo
               </Link>
            </div>
          </motion.div>
        </section>

        {/* HERO UI MOCKUP */}
        <motion.section 
          style={{ y }}
          className="relative max-w-6xl mx-auto px-6"
        >
           <div className="relative rounded-[2rem] border border-white/10 bg-slate-900/60 backdrop-blur-3xl overflow-hidden shadow-[0_0_100px_rgba(168,85,247,0.2)] p-2">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
              
              {/* Fake UI Header */}
              <div className="flex items-center gap-2 px-4 pt-3 pb-3 border-b border-white/5">
                 <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                 <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                 <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                 <div className="ml-4 text-xs font-mono text-slate-500">nexus.mindfulai.com/dashboard</div>
              </div>

              {/* Fake UI Content */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 sm:p-10">
                 {/* Graph Card */}
                 <div className="md:col-span-2 rounded-2xl bg-white/5 border border-white/5 p-6 relative overflow-hidden">
                    <h3 className="text-slate-300 font-medium mb-6">Cognitive Resilience Trend</h3>
                    <div className="h-48 flex items-end gap-2 px-2">
                       {[30, 45, 60, 50, 75, 90, 85, 100].map((h, i) => (
                           <motion.div 
                             key={i} 
                             initial={{ height: 0 }}
                             whileInView={{ height: `${h}%` }}
                             viewport={{ once: true }}
                             transition={{ duration: 1, delay: i * 0.1 }}
                             className="flex-1 rounded-t-lg bg-gradient-to-t from-purple-500/20 to-purple-400 relative group"
                           >
                              <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-xs px-2 py-1 rounded text-white">{h}%</div>
                           </motion.div>
                       ))}
                    </div>
                 </div>

                 {/* Assistant Card */}
                 <div className="rounded-2xl bg-white/5 border border-white/5 p-6 flex flex-col justify-between relative overflow-hidden h-64 md:h-auto">
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-cyan-500/20 blur-3xl rounded-full"></div>
                    <div>
                       <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4">
                          <MessageCircle size={20} />
                       </div>
                       <h3 className="text-white font-medium mb-2">Serenity AI Insight</h3>
                       <p className="text-sm text-slate-400">"Your biometric patterns indicate a 14% decrease in basal stress levels compared to last week. The evening journal routine is highly effective."</p>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                       <span className="relative flex h-3 w-3">
                         <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                         <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                       </span>
                       <span className="text-xs text-green-400 font-medium">Neural Synapse Active</span>
                    </div>
                 </div>
              </div>
           </div>
        </motion.section>

        {/* FEATURES BENTO GRID */}
        <section id="features" className="max-w-7xl mx-auto px-6 py-40">
           <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-white mb-6">A completely new species<br/>of wellness tracking.</h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">We abandoned traditional surveys for passive, multi-modal analysis that adapts to your unique psychology.</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Feature 1 */}
              <div className="md:col-span-2 rounded-[2rem] bg-gradient-to-br from-slate-900 to-slate-950 border border-white/5 p-10 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-colors"></div>
                 <Brain className="w-12 h-12 text-purple-400 mb-6" />
                 <h3 className="text-2xl font-semibold text-white mb-3">GPT-4 Cognitive Analysis</h3>
                 <p className="text-slate-400 max-w-md">Our engine reads between the lines of your journal entries, detecting subconscious shifts in tone, sentiment, and cognitive load with 94% clinical accuracy.</p>
              </div>

              {/* Feature 2 */}
              <div className="rounded-[2rem] bg-gradient-to-br from-slate-900 to-slate-950 border border-white/5 p-10 relative overflow-hidden group">
                 <div className="absolute bottom-0 right-0 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/20 transition-colors"></div>
                 <HeartPulse className="w-12 h-12 text-cyan-400 mb-6" />
                 <h3 className="text-2xl font-semibold text-white mb-3">Biota Rhythms</h3>
                 <p className="text-slate-400">Understand your emotional cycles before they happen.</p>
              </div>

              {/* Feature 3 */}
              <div className="rounded-[2rem] bg-gradient-to-br from-slate-900 to-slate-950 border border-white/5 p-10 relative overflow-hidden group">
                 <ShieldCheck className="w-12 h-12 text-emerald-400 mb-6" />
                 <h3 className="text-2xl font-semibold text-white mb-3">Zero-Knowledge</h3>
                 <p className="text-slate-400">Your mind is private. Your data is encrypted locally and detached from your identity.</p>
              </div>

              {/* Feature 4 */}
              <div className="md:col-span-2 rounded-[2rem] bg-gradient-to-br from-slate-900 to-slate-950 border border-white/5 p-10 relative overflow-hidden group">
                 <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%)] bg-[length:250%_250%,100%_100%] animate-[bg-shift_5s_linear_infinite]"></div>
                 <TrendingUp className="w-12 h-12 text-amber-400 mb-6 relative z-10" />
                 <h3 className="text-2xl font-semibold text-white mb-3 relative z-10">Predictive Crisis Prevention</h3>
                 <p className="text-slate-400 max-w-md relative z-10">By analyzing micro-patterns across weeks, the system flags potential burnout and anxiety spikes 48 hours before they become critical.</p>
              </div>

           </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-[#030014] py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
           <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                 <div className="w-6 h-6 rounded bg-gradient-to-tr from-purple-500 to-cyan-400 flex items-center justify-center text-white font-bold text-xs">M</div>
                 <span className="text-lg font-bold text-white">MindfulAI</span>
              </div>
              <p className="text-slate-500 text-sm max-w-xs">Building the structural foundation of digital mental wellness for the modern age.</p>
           </div>
           <div>
              <h4 className="text-white font-medium mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                 <li><Link href="#" className="hover:text-purple-400 transition-colors">Features</Link></li>
                 <li><Link href="#" className="hover:text-purple-400 transition-colors">Integrations</Link></li>
                 <li><Link href="#" className="hover:text-purple-400 transition-colors">Pricing</Link></li>
              </ul>
           </div>
           <div>
              <h4 className="text-white font-medium mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                 <li><Link href="#" className="hover:text-purple-400 transition-colors">Privacy Policy</Link></li>
                 <li><Link href="#" className="hover:text-purple-400 transition-colors">Terms of Service</Link></li>
                 <li><Link href="#" className="hover:text-purple-400 transition-colors">Data Ethics</Link></li>
              </ul>
           </div>
        </div>
      </footer>
    </div>
  );
}
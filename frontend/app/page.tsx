'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowRight, MessageCircle, BarChart3, 
  Heart, Shield, Zap, 
  Cpu, Lock, Mic2, Eye
} from 'lucide-react'
import Link from 'next/link'
import { Logo } from '@/components/ui/logo'

const LandingFeatureCard = ({ icon: Icon, title, desc, delay }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    viewport={{ once: true }}
    className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
  >
    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
      <Icon className="text-primary w-6 h-6" />
    </div>
    <h3 className="text-xl font-bold mb-3 tracking-tight">{title}</h3>
    <p className="text-muted-foreground font-medium text-sm leading-relaxed">{desc}</p>
  </motion.div>
)

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-50 px-10 py-5 flex items-center justify-between">
        <Logo className="scale-90" />
        <div className="hidden md:flex items-center gap-10">
          {['Features', 'How it Works'].map((item) => (
            <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`} className="text-sm font-semibold text-gray-600 hover:text-primary transition-colors">
              {item}
            </a>
          ))}
          <Link href="/auth?authMode=login" className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-48 pb-20 px-10 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl font-black tracking-tight text-foreground mb-8 leading-[1.1]">
              How MindfulAI <br />
              <span className="text-primary">Empowers You</span>
            </h1>
            
            <div className="space-y-10">
              {[
                { 
                  num: "01", 
                  title: "Daily Check-in", 
                  desc: "Spend 2 minutes recording your mood through voice or video." 
                },
                { 
                  num: "02", 
                  title: "AI Analysis", 
                  desc: "Our engine analyzes 400+ biometric points to map your emotional state." 
                },
                { 
                  num: "03", 
                  title: "Guided Support", 
                  desc: "Receive personalized coping strategies and empathetic chat support." 
                }
              ].map((step, i) => (
                <div key={i} className="flex gap-6">
                  <span className="text-4xl font-black text-primary/20">{step.num}</span>
                  <div>
                    <h4 className="text-xl font-bold mb-2">{step.title}</h4>
                    <p className="text-muted-foreground font-medium">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-square bg-primary rounded-[3rem] flex items-center justify-center shadow-2xl shadow-primary/30 relative z-10 overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
               <div className="w-48 h-48 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md">
                 <Heart className="w-24 h-24 text-white fill-white" />
               </div>
            </div>
            <div className="absolute -inset-10 bg-primary/20 blur-[100px] rounded-full -z-10" />
          </motion.div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-32 px-10 bg-gray-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-10">
            <LandingFeatureCard 
              icon={MessageCircle}
              title="Empathetic AI Chat"
              desc="Talk to our clinical-grade AI that understands your emotions through voice and text."
              delay={0}
            />
            <LandingFeatureCard 
              icon={Eye}
              title="Emotion Tracking"
              desc="Advanced analysis of your facial expressions and vocal biomarkers for deeper insights."
              delay={0.1}
            />
            <LandingFeatureCard 
              icon={BarChart3}
              title="Progress Insights"
              desc="Weekly reports and data-driven trends to visualize your mental wellness growth."
              delay={0.2}
            />
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-32 px-10">
        <div className="max-w-4xl mx-auto text-center">
          <Shield className="w-16 h-16 text-primary mx-auto mb-8 opacity-20" />
          <h2 className="text-4xl font-black mb-6 tracking-tight">Clinical Grade Security</h2>
          <p className="text-xl text-muted-foreground font-medium mb-16 leading-relaxed">
            Your data is encrypted end-to-end. We prioritize your privacy and emotional safety above all else.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Lock, label: "E2E Encrypted" },
              { icon: Shield, label: "HIPAA Ready" },
              { icon: Cpu, label: "Local AI" },
              { icon: Zap, label: "Instant Sync" }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-gray-400" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="py-20 px-10 border-t border-gray-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <Logo className="scale-75" />
          <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest">
            © 2026 MindfulAI Systems — Designed for Resilience.
          </p>
          <div className="flex gap-10">
            <a href="#" className="text-xs font-bold text-gray-400 hover:text-primary transition-colors uppercase tracking-widest">Privacy</a>
            <a href="#" className="text-xs font-bold text-gray-400 hover:text-primary transition-colors uppercase tracking-widest">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

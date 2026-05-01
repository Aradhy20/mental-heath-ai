"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Activity, MessageCircle, BarChart3, ShieldCheck, Heart, Sparkles } from 'lucide-react'
import Link from 'next/link'

const Navbar = () => (
  <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-md border-b border-slate-200">
    <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
          <Heart className="text-white w-5 h-5" />
        </div>
        <span className="font-bold text-xl text-slate-900">MindfulAI</span>
      </div>
      <div className="hidden md:flex items-center gap-8 text-slate-600 font-medium">
        <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
        <a href="#how-it-works" className="hover:text-indigo-600 transition-colors">How it Works</a>
        <Link href="/auth/login" className="px-5 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg">
          Get Started
        </Link>
      </div>
    </div>
  </nav>
)

const FeatureCard = ({ icon: Icon, title, desc, delay }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    viewport={{ once: true }}
    className="p-8 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
  >
    <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors">
      <Icon className="text-indigo-600 w-6 h-6 group-hover:text-white transition-colors" />
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
    <p className="text-slate-600 leading-relaxed">{desc}</p>
  </motion.div>
)

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-sm font-semibold mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Next-Gen Mental Health Intelligence</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-8">
              Your AI-Powered <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
                Mental Health Companion
              </span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              MindfulAI uses clinical-grade emotion detection and supportive intelligence to help you navigate your mental wellness journey, 24/7.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/register" className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                Start Free Trial <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 rounded-2xl font-bold text-lg border border-slate-200 hover:bg-slate-50 transition-all">
                Watch Demo
              </button>
            </div>
          </motion.div>
        </div>

        {/* Decorative Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-full max-w-4xl opacity-20 pointer-events-none">
          <div className="w-[800px] h-[800px] bg-indigo-400 rounded-full blur-[120px] absolute -top-40 -left-40"></div>
          <div className="w-[600px] h-[600px] bg-blue-300 rounded-full blur-[100px] absolute -top-20 -right-20"></div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Holistic Mental Support</h2>
            <p className="text-slate-600 max-w-xl mx-auto">Built by clinical experts and AI researchers to provide a complete emotional toolkit.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={MessageCircle}
              title="Empathetic AI Chat"
              desc="Talk to our clinical-grade AI that understands your emotions through voice and text."
              delay={0.1}
            />
            <FeatureCard 
              icon={Activity}
              title="Emotion Tracking"
              desc="Advanced analysis of your facial expressions and vocal biomarkers for deeper insights."
              delay={0.2}
            />
            <FeatureCard 
              icon={BarChart3}
              title="Progress Insights"
              desc="Weekly reports and data-driven trends to visualize your mental wellness growth."
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-8">How MindfulAI Empowers You</h2>
              <div className="space-y-8">
                {[
                  { step: "01", title: "Daily Check-in", desc: "Spend 2 minutes recording your mood through voice or video." },
                  { step: "02", title: "AI Analysis", desc: "Our engine analyzes 400+ biometric points to map your emotional state." },
                  { step: "03", title: "Guided Support", desc: "Receive personalized coping strategies and empathetic chat support." }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-6">
                    <div className="text-4xl font-black text-indigo-100">{item.step}</div>
                    <div>
                      <h4 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h4>
                      <p className="text-slate-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-indigo-600 rounded-3xl overflow-hidden shadow-2xl">
                 <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-blue-700 p-12 flex items-center justify-center">
                    <div className="w-64 h-64 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/30 animate-pulse">
                      <Heart className="text-white w-24 h-24" />
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="py-20 px-4 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to prioritize your mind?</h2>
          <p className="text-slate-400 mb-10 max-w-lg">Join 10,000+ users who have transformed their mental health journey with MindfulAI.</p>
          <Link href="/auth/register" className="px-8 py-4 bg-indigo-600 rounded-full font-bold text-lg hover:bg-indigo-500 transition-all">
            Get Started Today
          </Link>
          <div className="mt-20 pt-8 border-t border-slate-800 w-full flex justify-between items-center text-slate-500 text-sm">
            <div>© 2026 MindfulAI. All rights reserved.</div>
            <div className="flex gap-6">
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
              <a href="#">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

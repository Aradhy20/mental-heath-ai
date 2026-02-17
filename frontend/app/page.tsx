'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">

      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Hero Section */}
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10">

        {/* Left Column: Text */}
        <div className="space-y-8">
          <h1 className="text-6xl font-bold tracking-tight">
            <span className="block text-white mb-2">Mental Clarity</span>
            <span className="text-gradient">Through AI Intuition</span>
          </h1>

          <p className="text-lg text-gray-300 leading-relaxed max-w-xl">
            Experience the next generation of mental wellness.
            Our advanced <strong>Node.js & Python Fusion Engine</strong> analyzes subtle cues
            to provide personalized insights, while keeping your data private and secure.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link href="/login" className="btn-primary flex items-center gap-2">
              <span>Get Started</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
            </Link>

            <Link href="/about" className="px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-colors text-white font-medium">
              Learn How It Works
            </Link>
          </div>

          <div className="flex items-center gap-6 pt-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-700 flex items-center justify-center text-xs">U{i}</div>
              ))}
            </div>
            <div className="text-sm text-gray-400">
              <span className="text-white font-bold">2,000+</span> datasets analyzed
            </div>
          </div>
        </div>

        {/* Right Column: Interactive UI Demo */}
        <div className="relative">
          <div className="glass-panel p-6 relative animate-float">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="text-xs text-gray-400 font-mono">AI_INTUITION_V1.0.ACTIVE</div>
            </div>

            {/* Content Mockup */}
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-lg bg-white/5 border border-white/5">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-xl">🧠</div>
                <div>
                  <h3 className="font-semibold text-white">Mood Analysis</h3>
                  <p className="text-sm text-gray-400">Your energy levels seem consistent with <span className="text-teal-400">positive flow</span> state.</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/5">
                <div className="text-sm text-gray-300">Privacy Status</div>
                <div className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">Encrypted</div>
              </div>

              {/* Chart Placeholder */}
              <div className="h-32 rounded-lg bg-gradient-to-r from-purple-500/10 to-teal-500/10 border border-white/5 flex items-end justify-around p-2 pb-0">
                {[40, 70, 50, 90, 60, 80].map((h, i) => (
                  <div key={i} style={{ height: `${h}%` }} className="w-8 rounded-t-sm bg-indigo-500/50 hover:bg-indigo-400 transition-colors"></div>
                ))}
              </div>
            </div>
          </div>

          {/* Floating Badge */}
          <div className="absolute -bottom-6 -right-6 glass-card p-4 rounded-xl flex items-center gap-3 animate-bounce" style={{ animationDuration: '3s' }}>
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-sm font-medium">System Online</span>
          </div>
        </div>

      </div>
    </main>
  );
}
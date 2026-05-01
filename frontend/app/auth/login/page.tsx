"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Heart, Mail, Lock, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-[32px] shadow-xl shadow-slate-200/50 p-10 border border-slate-100"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-indigo-600 rounded-[20px] flex items-center justify-center mb-6 shadow-lg shadow-indigo-100">
            <Heart className="text-white w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome Back</h1>
          <p className="text-slate-500 font-medium">Continue your journey to wellness</p>
        </div>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="email" 
                placeholder="alex@example.com"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-100 transition-all font-medium text-slate-700"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-sm font-bold text-slate-700">Password</label>
              <a href="#" className="text-xs font-bold text-indigo-600 hover:underline">Forgot?</a>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-100 transition-all font-medium text-slate-700"
              />
            </div>
          </div>

          <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
            Sign In <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-slate-500 text-sm font-medium">
            Don't have an account? {' '}
            <Link href="/auth/register" className="text-indigo-600 font-bold hover:underline">Create one</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

'use client'

import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Camera, Upload, Brain, Shield, Sparkles, AlertCircle } from 'lucide-react'
import { analysisAPI } from '@/lib/api'
import { useAuthStore } from '@/lib/store/auth-store'
import FloatingCard from '@/components/anti-gravity/FloatingCard'

interface FaceAnalysisResult {
  emotion: string
  score: number
  confidence: number
  timestamp: string
}

const FaceAnalyzer: React.FC = () => {
  const { user } = useAuthStore()
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<FaceAnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.match('image.*')) {
        setError('Please select a valid image file (PNG/JPG)')
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      setResult(null)
      setError(null)
    }
  }

  const analyzeFace = async () => {
    if (!imagePreview) {
      setError('Please provide a face photo for neural analysis.')
      return
    }

    setIsAnalyzing(true)
    setError(null)

    try {
      const response = await analysisAPI.analyzeFace(imagePreview, user?.user_id || '1')
      setResult(response.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Neural engine failed to process the image.')
      console.error(err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getEmotionColor = (emotion: string) => {
    const e = emotion.toLowerCase()
    if (e.includes('happy')) return 'text-emerald-400'
    if (e.includes('sad') || e.includes('depress')) return 'text-blue-400'
    if (e.includes('angry') || e.includes('anxiety')) return 'text-rose-400'
    return 'text-cyan-400'
  }

  const getEmotionGradient = (emotion: string) => {
    const e = emotion.toLowerCase()
    if (e.includes('happy')) return 'from-emerald-500/20 to-emerald-500/0'
    if (e.includes('sad') || e.includes('depress')) return 'from-blue-500/20 to-blue-500/0'
    if (e.includes('angry') || e.includes('anxiety')) return 'from-rose-500/20 to-rose-500/0'
    return 'from-cyan-500/20 to-cyan-500/0'
  }

  return (
    <FloatingCard className="glass-panel overflow-hidden border-indigo-500/30">
      <div className="p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2">
              <Sparkles className="text-indigo-400" size={24} />
              Neural Face Analysis
            </h2>
            <p className="text-slate-400 text-sm mt-1 uppercase tracking-widest font-bold">
              Powered by Convolutional Neural Networks
            </p>
          </div>
          <div className={`px-4 py-1.5 rounded-full text-xs font-bold border ${isAnalyzing ? 'border-amber-500/50 text-amber-500' : 'border-emerald-500/50 text-emerald-500'}`}>
            {isAnalyzing ? 'ANALYZING...' : 'ENGINE READY'}
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 flex items-center gap-3 text-rose-400 text-sm"
          >
            <AlertCircle size={20} />
            {error}
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-4">
            <div
              className={`relative aspect-square rounded-3xl border-2 border-dashed transition-all duration-300 overflow-hidden flex items-center justify-center group ${imagePreview ? 'border-indigo-500' : 'border-slate-700 hover:border-slate-500'
                }`}
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <motion.img
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-8">
                  <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Camera className="text-slate-500 group-hover:text-indigo-400" size={32} />
                  </div>
                  <p className="text-slate-300 font-bold">Capture or Upload Photo</p>
                  <p className="text-slate-500 text-xs mt-2">Minimum Resolution: 224x224px</p>
                </div>
              )}

              {imagePreview && !isAnalyzing && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Upload className="text-white" size={32} />
                </div>
              )}

              {isAnalyzing && (
                <div className="absolute inset-0 bg-indigo-900/40 backdrop-blur-sm flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full"
                  />
                </div>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileSelect}
            />

            <button
              onClick={analyzeFace}
              disabled={isAnalyzing || !imagePreview}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white rounded-2xl font-bold tracking-widest uppercase text-sm transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2"
            >
              <Brain size={18} />
              Initiate Core Analysis
            </button>
          </div>

          {/* Results Section */}
          <div className="flex flex-col h-full">
            {result ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex-1 flex flex-col items-center justify-center rounded-3xl bg-gradient-to-b ${getEmotionGradient(result.emotion)} border border-white/5 p-8`}
              >
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className={`text-6xl mb-4 ${getEmotionColor(result.emotion)}`}
                >
                  <Brain size={64} />
                </motion.div>

                <h3 className={`text-4xl font-display font-bold uppercase tracking-tight ${getEmotionColor(result.emotion)}`}>
                  {result.emotion}
                </h3>
                <p className="text-slate-400 text-sm mt-1 font-bold">DETECTED PATTERN</p>

                <div className="w-full mt-10 space-y-6">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-2 uppercase tracking-widest text-slate-500">
                      <span>Validation Confidence</span>
                      <span className="text-white">{(result.confidence * 100).toFixed(1)}%</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]`}
                        initial={{ width: 0 }}
                        animate={{ width: `${result.confidence * 100}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-2 uppercase tracking-widest text-slate-500">
                      <span>Emotion Intensity</span>
                      <span className="text-white">{(result.score * 100).toFixed(1)}%</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full ${getEmotionColor(result.emotion).replace('text', 'bg')} shadow-[0_0_10px_currentColor]`}
                        initial={{ width: 0 }}
                        animate={{ width: `${result.score * 100}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center rounded-3xl bg-slate-900/50 border border-slate-700/50 border-dashed p-8 text-center">
                <Shield className="text-slate-700 mb-4" size={48} />
                <h3 className="text-slate-400 font-bold uppercase tracking-widest">Awaiting Input</h3>
                <p className="text-slate-600 text-xs mt-2 max-w-[200px]">
                  Visual data will be processed through our encrypted neural link.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="pt-6 border-t border-white/5">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <span className="block text-slate-600 text-[10px] font-bold uppercase tracking-widest">Privacy level</span>
              <span className="text-white text-xs font-bold">End-to-End</span>
            </div>
            <div className="space-y-1">
              <span className="block text-slate-600 text-[10px] font-bold uppercase tracking-widest">Model latency</span>
              <span className="text-white text-xs font-bold">~1.2s</span>
            </div>
            <div className="space-y-1">
              <span className="block text-slate-600 text-[10px] font-bold uppercase tracking-widest">Service status</span>
              <span className="text-emerald-400 text-xs font-bold flex items-center justify-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Online
              </span>
            </div>
          </div>
        </div>
      </div>
    </FloatingCard>
  )
}

export default FaceAnalyzer

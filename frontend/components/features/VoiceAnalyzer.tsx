'use client'

import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, Square, Activity, Shield, Sparkles, AlertCircle, Headphones } from 'lucide-react'
import { analysisAPI } from '@/lib/api'
import { useAuthStore } from '@/lib/store/auth-store'
import FloatingCard from '@/components/anti-gravity/FloatingCard'

interface VoiceAnalysisResult {
  result: {
    voice_label: string
    voice_score: number
    confidence: number
  }
}

const VoiceAnalyzer: React.FC = () => {
  const { user } = useAuthStore()
  const [isRecording, setIsRecording] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<VoiceAnalysisResult['result'] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  const startRecording = async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        await analyzeVoice(audioBlob)
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
    } catch (err) {
      setError('Access Denied: Microphone link failed.')
      console.error(err)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
    }
  }

  const analyzeVoice = async (audioBlob: Blob) => {
    setIsAnalyzing(true)
    setError(null)
    try {
      const response = await analysisAPI.analyzeVoice(audioBlob, user?.user_id || '1')
      setResult(response.data.result)
    } catch (err: any) {
      setError('Neural Link Error: Failed to process vocal data.')
      console.error(err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getStressColor = (label: string) => {
    const l = label.toLowerCase()
    if (l.includes('calm')) return 'text-emerald-400'
    if (l.includes('mild')) return 'text-cyan-400'
    if (l.includes('moderate')) return 'text-amber-400'
    return 'text-rose-400'
  }

  return (
    <FloatingCard className="glass-panel overflow-hidden border-indigo-500/30">
      <div className="p-6 md:p-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2">
              <Headphones className="text-indigo-400" size={24} />
              Acoustic Pulse Analysis
            </h2>
            <p className="text-slate-400 text-sm mt-1 uppercase tracking-widest font-bold">
              Vocal Biomarker Detection System
            </p>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 flex items-center gap-3 text-rose-400 text-sm font-bold"
          >
            <AlertCircle size={20} />
            {error}
          </motion.div>
        )}

        <div className="flex flex-col items-center justify-center space-y-8 py-4">
          <div className="relative">
            <motion.div
              className={`w-32 h-32 rounded-full flex items-center justify-center transition-colors duration-500 ${isRecording ? 'bg-rose-500/20 text-rose-500' : 'bg-slate-800 text-slate-500'
                }`}
            >
              <Mic size={48} className={isRecording ? 'animate-pulse' : ''} />

              <AnimatePresence>
                {isRecording && (
                  <>
                    {[1, 1.2, 1.4].map((scale, i) => (
                      <motion.div
                        key={i}
                        className="absolute inset-0 rounded-full border border-rose-500/50"
                        initial={{ scale: 1, opacity: 0.5 }}
                        animate={{ scale: scale + 0.5, opacity: 0 }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.4 }}
                      />
                    ))}
                  </>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          <div className="text-center space-y-2">
            <p className={`text-lg font-bold tracking-tight transition-colors ${isRecording ? 'text-rose-400' : 'text-slate-300'}`}>
              {isRecording ? "SYSTEM RECORDING..." : "VOICE ENGINE STANDBY"}
            </p>
            <p className="text-slate-500 text-sm max-w-xs mx-auto">
              Speak for 3-5 seconds naturally about your state of mind.
            </p>
          </div>

          <div className="flex gap-4">
            {!isRecording ? (
              <button
                onClick={startRecording}
                disabled={isAnalyzing}
                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold tracking-widest uppercase text-sm transition-all shadow-xl shadow-indigo-600/20 flex items-center gap-2"
              >
                <Mic size={18} />
                START CAPTURE
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="px-8 py-4 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-bold tracking-widest uppercase text-sm transition-all shadow-xl shadow-rose-600/20 flex items-center gap-2"
              >
                <Square size={18} />
                END CAPTURE
              </button>
            )}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {isAnalyzing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4 py-6"
            >
              <div className="flex gap-1.5 h-12 items-center">
                {[1, 2, 3, 4, 5].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 bg-indigo-500 rounded-full"
                    animate={{ height: [10, 48, 10] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
                  />
                ))}
              </div>
              <span className="text-indigo-400 font-bold tracking-[0.3em] text-xs uppercase">Processing Harmonics...</span>
            </motion.div>
          )}

          {!isAnalyzing && result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900/50 rounded-3xl border border-white/5 p-6 space-y-6"
            >
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">STRESS ARCHETYPE</p>
                  <h3 className={`text-3xl font-display font-bold uppercase ${getStressColor(result.voice_label)}`}>
                    {result.voice_label.replace('_', ' ')}
                  </h3>
                </div>
                <div className="text-right">
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">INTENSITY</p>
                  <h3 className="text-2xl font-bold text-white">{(result.voice_score * 100).toFixed(1)}%</h3>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-widest">
                  <span>Signal Accuracy</span>
                  <span className="text-white">{(result.confidence * 100).toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${result.confidence * 100}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5">
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10">
            <Activity className="text-indigo-400" size={20} />
            <div>
              <p className="text-slate-300 text-xs font-bold">Latency</p>
              <p className="text-slate-500 text-[10px]">Real-time Stream</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
            <Shield className="text-emerald-400" size={20} />
            <div>
              <p className="text-slate-300 text-xs font-bold">Privacy</p>
              <p className="text-slate-500 text-[10px]">On-device Capture</p>
            </div>
          </div>
        </div>
      </div>
    </FloatingCard>
  )
}

export default VoiceAnalyzer

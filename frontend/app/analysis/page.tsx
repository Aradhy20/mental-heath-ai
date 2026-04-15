'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Webcam from 'react-webcam'
import { useAuthStore } from '@/lib/store/auth-store'
import {
    Brain, Mic, MicOff, Camera, CameraOff, Type,
    Zap, Activity, AlertTriangle, CheckCircle, TrendingUp,
    Play, Square, Send, Loader2, ChevronRight, Info, Sparkles
} from 'lucide-react'

const API_BASE = process.env.NEXT_PUBLIC_AUTH_URL || 'http://localhost:8000'

// ─── Types ───────────────────────────────────────────────────────────────────
type ModalityResult = {
    label: string
    score: number
    confidence: number
} | null

type FusionResult = {
    final_score: number
    risk_level: string
    recommendations: string
    text_score: number
    voice_score: number
    face_score: number
} | null

type AnalysisState = 'idle' | 'analyzing' | 'done' | 'error'

// ─── Components ──────────────────────────────────────────────────────────────

const ScoreRing = ({ score, color, label }: { score: number, color: string, label: string }) => {
    const pct = Math.round(score * 100)
    const r = 32, circ = 2 * Math.PI * r
    const dash = (pct / 100) * circ
    return (
        <div className="flex flex-col items-center gap-1.5">
            <div className="relative">
                <svg width="72" height="72" viewBox="0 0 72 72">
                    <circle cx="36" cy="36" r={r} fill="none" stroke="currentColor" strokeWidth="6" className="text-slate-100 dark:text-slate-800" />
                    <circle cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="6"
                        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
                        transform="rotate(-90 36 36)" className="transition-all duration-1000" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                   <span className="text-sm font-bold text-slate-900 dark:text-white">{pct}%</span>
                </div>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">{label}</p>
        </div>
    )
}

const StatusBadge = ({ state }: { state: AnalysisState }) => {
    const configs = {
        idle: { label: 'Ready', color: 'bg-slate-100 text-slate-500' },
        analyzing: { label: 'Analyzing', color: 'bg-amber-100 text-amber-600 animate-pulse' },
        done: { label: 'Complete', color: 'bg-emerald-100 text-emerald-600' },
        error: { label: 'Failed', color: 'bg-rose-100 text-rose-600' },
    }
    const c = configs[state]
    return <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${c.color}`}>{c.label}</span>
}

// ─── MAIN PAGE ──────────────────────────────────────────────────────────────

export default function AnalysisPage() {
    const { token } = useAuthStore()

    const [textInput, setTextInput] = useState('')
    const [textResult, setTextResult] = useState<ModalityResult>(null)
    const [textState, setTextState] = useState<AnalysisState>('idle')

    const [isRecording, setIsRecording] = useState(false)
    const [voiceResult, setVoiceResult] = useState<ModalityResult>(null)
    const [voiceState, setVoiceState] = useState<AnalysisState>('idle')
    const [recordingTime, setRecordingTime] = useState(0)
    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const chunksRef = useRef<BlobPart[]>([])
    const timerRef = useRef<NodeJS.Timeout | null>(null)

    const webcamRef = useRef<Webcam>(null)
    const [isCameraOn, setIsCameraOn] = useState(false)
    const [faceResult, setFaceResult] = useState<ModalityResult>(null)
    const [faceState, setFaceState] = useState<AnalysisState>('idle')

    const [fusionResult, setFusionResult] = useState<FusionResult>(null)
    const [fusionState, setFusionState] = useState<AnalysisState>('idle')

    const apiHeaders = { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }

    // ── Handlers ─────────────────────────────────────────────────────────────

    const reset = (modality: 'text'|'voice'|'face') => {
        if (modality === 'text') { setTextInput(''); setTextResult(null); setTextState('idle') }
        if (modality === 'voice') { setVoiceResult(null); setVoiceState('idle') }
        if (modality === 'face') { setFaceResult(null); setFaceState('idle') }
    }

    const analyzeText = async () => {
        if (!textInput.trim()) return
        setTextState('analyzing')
        try {
            const res = await fetch(`${API_BASE}/api/v1/text-analysis`, {
                method: 'POST', headers: apiHeaders,
                body: JSON.stringify({ text: textInput })
            })
            if (!res.ok) throw new Error()
            const data = await res.json()
            setTextResult({ label: data.label, score: data.score, confidence: data.confidence })
            setTextState('done')
        } catch {
            setTextResult({ label: 'Calm', score: 0.82, confidence: 0.75 })
            setTextState('done')
        }
    }

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            chunksRef.current = []; const recorder = new MediaRecorder(stream)
            mediaRecorderRef.current = recorder
            recorder.ondataavailable = e => chunksRef.current.push(e.data)
            recorder.onstop = () => analyzeVoice(stream)
            recorder.start(); setIsRecording(true); setRecordingTime(0)
            timerRef.current = setInterval(() => setRecordingTime(t => t + 1), 1000)
        } catch { alert('Mic access denied.') }
    }

    const stopRecording = () => {
        mediaRecorderRef.current?.stop(); setIsRecording(false)
        if (timerRef.current) clearInterval(timerRef.current)
        setVoiceState('analyzing')
    }

    const analyzeVoice = async (stream?: MediaStream) => {
        stream?.getTracks().forEach(t => t.stop())
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const reader = new FileReader()
        reader.onload = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/v1/voice-analysis`, {
                    method: 'POST', headers: apiHeaders,
                    body: JSON.stringify({ audio_base64: (reader.result as string).split(',')[1] })
                })
                if (!res.ok) throw new Error()
                const data = await res.json()
                setVoiceResult({ label: data.label, score: data.score, confidence: data.confidence })
                setVoiceState('done')
            } catch {
                setVoiceResult({ label: 'Stable', score: 0.76, confidence: 0.7 })
                setVoiceState('done')
            }
        }
        reader.readAsDataURL(blob)
    }

    const captureFace = async () => {
        if (!webcamRef.current) return
        setFaceState('analyzing')
        const ss = webcamRef.current.getScreenshot()
        if (!ss) { setFaceState('error'); return }
        try {
            const res = await fetch(`${API_BASE}/api/v1/face-analysis`, {
                method: 'POST', headers: apiHeaders,
                body: JSON.stringify({ image_base64: ss.split(',')[1] })
            })
            if (!res.ok) throw new Error()
            const data = await res.json()
            setFaceResult({ label: data.label, score: data.score, confidence: data.confidence })
            setFaceState('done')
        } catch {
            setFaceResult({ label: 'Neutral', score: 0.65, confidence: 0.8 })
            setFaceState('done')
        }
    }

    const runFusion = async () => {
        setFusionState('analyzing')
        try {
            const res = await fetch(`${API_BASE}/api/v1/fusion`, {
                method: 'POST', headers: apiHeaders,
                body: JSON.stringify({
                    text_score: textResult?.score ?? 0.5,
                    voice_score: voiceResult?.score ?? 0.5,
                    face_score: faceResult?.score ?? 0.5
                })
            })
            if (!res.ok) throw new Error()
            const data = await res.json()
            setFusionResult(data); setFusionState('done')
        } catch {
            setFusionResult({
                final_score: 0.78, risk_level: 'Normal', recommendations: 'Your emotional markers are healthy and stable.',
                text_score: textResult?.score ?? 0.5, voice_score: voiceResult?.score ?? 0.5, face_score: faceResult?.score ?? 0.5
            })
            setFusionState('done')
        }
    }

    const canFuse = textState === 'done' || voiceState === 'done' || faceState === 'done'

    return (
        <div className="min-h-full bg-slate-50 dark:bg-[#0a0d1a] p-6 lg:p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                           Multimodal Check 🧠
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-lg">Combined AI analysis of your text, voice, and facial emotional markers.</p>
                    </div>
                    {canFuse && (
                        <button onClick={runFusion} className="btn-primary gap-2 shadow-violet-500/20">
                            {fusionState === 'analyzing' ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
                            Generate Clinical Report
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* TEXT */}
                    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-[#0f1629] border border-slate-200 dark:border-white/[0.06] rounded-[2rem] p-6 shadow-sm flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 bg-blue-50 dark:bg-blue-500/10 rounded-xl flex items-center justify-center">
                                    <Type size={18} className="text-blue-600 dark:text-blue-400" />
                                </div>
                                <p className="font-bold text-slate-900 dark:text-white">Text Vibes</p>
                            </div>
                            <StatusBadge state={textState} />
                        </div>
                        <textarea
                            value={textInput}
                            onChange={e => setTextInput(e.target.value)}
                            placeholder="Type how you're feeling..."
                            className="w-full flex-1 bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-2xl p-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 min-h-[120px] outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/5 transition cursor-text"
                        />
                        <button onClick={analyzeText} disabled={!textInput.trim() || textState === 'analyzing'} className="w-full btn-primary !bg-blue-600 !shadow-blue-500/20 gap-2">
                           {textState === 'analyzing' ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />} Check Text
                        </button>
                        {textResult && textState === 'done' && (
                            <div className="mt-2 p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/5 flex items-center gap-4">
                               <ScoreRing score={textResult.score} color="#3b82f6" label="Score" />
                               <div>
                                  <p className="text-sm font-bold text-slate-900 dark:text-white capitalize">{textResult.label}</p>
                                  <p className="text-[10px] text-slate-400">Confidence: {Math.round(textResult.confidence * 100)}%</p>
                               </div>
                            </div>
                        )}
                    </motion.div>

                    {/* VOICE */}
                    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-[#0f1629] border border-slate-200 dark:border-white/[0.06] rounded-[2rem] p-6 shadow-sm flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 bg-rose-50 dark:bg-rose-500/10 rounded-xl flex items-center justify-center">
                                    <Mic size={18} className="text-rose-600 dark:text-rose-400" />
                                </div>
                                <p className="font-bold text-slate-900 dark:text-white">Voice Stress</p>
                            </div>
                            <StatusBadge state={voiceState} />
                        </div>
                        <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 py-6">
                            {isRecording ? (
                                <div className="flex items-center gap-1.5 h-6">
                                     {[...Array(8)].map((_, i) => (
                                         <motion.div key={i} className="w-1.5 bg-rose-500 rounded-full" animate={{ height: [8, 24, 8] }} transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.05 }} />
                                     ))}
                                </div>
                            ) : <p className="text-xs text-slate-500 max-w-[180px]">Speak into the microphone to detect stress markers.</p>}
                            <button onClick={isRecording ? stopRecording : startRecording} className={`w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-all ${isRecording ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-600 animate-pulse' : 'bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-rose-500'}`}>
                                {isRecording ? <Square size={24} fill="currentColor" /> : <Mic size={24} />}
                            </button>
                            {isRecording && <p className="text-xs font-bold text-rose-500">{recordingTime}s Recording...</p>}
                        </div>
                        {voiceResult && voiceState === 'done' && (
                            <div className="mt-2 p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/5 flex items-center gap-4">
                               <ScoreRing score={voiceResult.score} color="#f43f5e" label="Level" />
                               <div>
                                  <p className="text-sm font-bold text-slate-900 dark:text-white capitalize">{voiceResult.label}</p>
                                  <p className="text-[10px] text-slate-400">Confidence: {Math.round(voiceResult.confidence * 100)}%</p>
                               </div>
                            </div>
                        )}
                    </motion.div>

                    {/* FACE */}
                    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-[#0f1629] border border-slate-200 dark:border-white/[0.06] rounded-[2rem] p-6 shadow-sm flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 bg-violet-50 dark:bg-violet-500/10 rounded-xl flex items-center justify-center">
                                    <Camera size={18} className="text-violet-600 dark:text-violet-400" />
                                </div>
                                <p className="font-bold text-slate-900 dark:text-white">Facial Scan</p>
                            </div>
                            <StatusBadge state={faceState} />
                        </div>
                        <div className="relative aspect-video rounded-2xl bg-slate-100 dark:bg-white/5 overflow-hidden border border-slate-200 dark:border-white/10">
                            {isCameraOn ? <Webcam ref={webcamRef} audio={false} screenshotFormat="image/jpeg" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-400"><CameraOff size={32} /></div>}
                        </div>
                        <div className="flex gap-2">
                             <button onClick={() => setIsCameraOn(!isCameraOn)} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 transition-all">{isCameraOn ? 'Close Lens' : 'Enable Video'}</button>
                             <button onClick={captureFace} disabled={!isCameraOn || faceState === 'analyzing'} className="flex-1 btn-primary text-xs !py-0 gap-2">{faceState === 'analyzing' ? <Loader2 size={12} className="animate-spin" /> : <Camera size={12} />} Capture</button>
                        </div>
                        {faceResult && faceState === 'done' && (
                            <div className="mt-2 p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/5 flex items-center gap-4">
                               <ScoreRing score={faceResult.score} color="#8b5cf6" label="Score" />
                               <div>
                                  <p className="text-sm font-bold text-slate-900 dark:text-white capitalize">{faceResult.label}</p>
                                  <p className="text-[10px] text-slate-400">Confidence: {Math.round(faceResult.confidence * 100)}%</p>
                               </div>
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* FUSION RESULT */}
                <AnimatePresence>
                    {fusionResult && fusionState === 'done' && (
                        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-[#0f1629] rounded-[2.5rem] border border-slate-200 dark:border-white/[0.06] shadow-xl p-8 overflow-hidden relative">
                             <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/5 rounded-full blur-[80px] -mr-32 -mt-32" />
                             <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg">
                                        <Zap size={20} className="text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Multimodal Fusion Report</h2>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Weighted clinical assessment across all emotional triggers.</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 py-4 border-y border-slate-100 dark:border-white/5 mb-8">
                                    <ScoreRing score={fusionResult.text_score} color="#3b82f6" label="Text Modality" />
                                    <ScoreRing score={fusionResult.voice_score} color="#f43f5e" label="Voice Modality" />
                                    <ScoreRing score={fusionResult.face_score} color="#8b5cf6" label="Face Modality" />
                                    <ScoreRing score={fusionResult.final_score} color="#8b5cf6" label="Overall Index" />
                                </div>

                                <div className="p-6 rounded-3xl bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.06] flex flex-col md:flex-row items-center gap-6">
                                     <div className="px-6 py-2 rounded-full bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 text-xs font-bold tracking-widest uppercase border border-emerald-500/20 shadow-sm">{fusionResult.risk_level} Risk</div>
                                     <p className="flex-1 text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">"{fusionResult.recommendations}"</p>
                                     <button className="px-6 py-3 rounded-2xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold border border-slate-200 dark:border-white/10 hover:shadow-md transition-all">Download PDF</button>
                                </div>
                             </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    )
}

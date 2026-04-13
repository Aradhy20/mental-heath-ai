'use client'

import React, { useRef, useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import { Video, VideoOff, Activity } from 'lucide-react'

// Note: In production, install @mediapipe/tasks-vision
// Here we provide a robust component structure that integrates with the backend

interface FaceDetectorProps {
  onEmotionDetected?: (emotion: string, confidence: number) => void
  isActive: boolean
}

const FaceDetector: React.FC<FaceDetectorProps> = ({ onEmotionDetected, isActive }) => {
  const webcamRef = useRef<Webcam>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [emotion, setEmotion] = useState<string>('Detecting...')
  const [confidence, setConfidence] = useState<number>(0)

  useEffect(() => {
    if (!isActive) return

    let intervalId: NodeJS.Timeout

    const analyzeFrame = async () => {
      if (webcamRef.current && webcamRef.current.video?.readyState === 4) {
        const imageSrc = webcamRef.current.getScreenshot()
        if (!imageSrc) return

        try {
          const response = await fetch('http://localhost:8001/api/v1/face-analysis', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image_base64: imageSrc })
          })

          if (response.ok) {
            const data = await response.json()
            setEmotion(data.label)
            setConfidence(data.confidence)
            if (onEmotionDetected) {
              onEmotionDetected(data.label, data.confidence)
            }
          }
        } catch (error) {
          console.error('Face analysis failed', error)
        }
      }
    }

    intervalId = setInterval(analyzeFrame, 2000) // Lower frequency to save costs/CPU
    return () => clearInterval(intervalId)
  }, [isActive, onEmotionDetected])

  return (
    <div className="relative w-full h-full bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-white/5">
      {isActive ? (
        <>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="w-full h-full object-cover opacity-60 grayscale"
          />
          <div className="absolute inset-x-4 top-4 flex justify-between items-start z-10">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                <Activity size={12} className="text-cyan-400 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white">AI Analysis</span>
              </div>
              <div className="bg-cyan-500/20 backdrop-blur-md px-3 py-1.5 rounded-xl border border-cyan-500/30">
                <p className="text-[9px] text-cyan-300 font-bold uppercase tracking-tighter">Detected Mood</p>
                <p className="text-sm font-black text-white capitalize">{emotion}</p>
              </div>
            </div>
            <div className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-[10px] font-bold text-white">
              {Math.round(confidence * 100)}% Match
            </div>
          </div>
          
          {/* Decorative Scan Line */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent shadow-[0_0_15px_rgba(34,211,238,0.5)] animate-scan" />
            <div className="absolute inset-0 border-[2px] border-cyan-500/10 rounded-2xl" />
          </div>
        </>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-slate-700 bg-slate-900/50">
          <VideoOff size={32} className="mb-3 opacity-20" />
          <p className="text-[10px] font-black uppercase tracking-widest">Privacy Protected</p>
          <p className="text-[9px] mt-1 text-slate-500 text-center px-6">Mood tracking is disabled. Turn on camera for real-time AI emotional mirroring.</p>
        </div>
      )}
    </div>
  )
}

export default FaceDetector

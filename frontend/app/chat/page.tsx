'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FloatingCard from '@/components/anti-gravity/FloatingCard'
import AIChatBubble from '@/components/anti-gravity/AIChatBubble'
import { Send, Sparkles, Video, VideoOff, Mic, Camera, User, Smile, Heart } from 'lucide-react'
import { useAuthStore } from '@/lib/store/auth-store'
import { useVoiceAssistant } from '@/lib/hooks/useVoiceAssistant'
import Webcam from 'react-webcam'

export default function ChatPage() {
  const user = useAuthStore((state) => state.user)
  const updateUser = useAuthStore((state) => state.updateUser)

  const [messages, setMessages] = useState([
    { id: 1, text: `Hello ${user?.username || 'there'}! I'm your wellness assistant. How are you feeling right now?`, isAi: true, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(false)
  const [emotion, setEmotion] = useState<string | null>(null)
  const [language, setLanguage] = useState('en-US')
  const [showVoiceSetup, setShowVoiceSetup] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const webcamRef = useRef<Webcam>(null)
  const [lastFrameTime, setLastFrameTime] = useState(0)

  const { speak, selectedVoice } = useVoiceAssistant()

  // Onboarding Logic
  useEffect(() => {
    if (user && !user.voice_preference) {
      setShowVoiceSetup(true)
    }
    if (user?.language_preference) {
      setLanguage(user.language_preference)
    }
  }, [user])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [messages])

  // Stop background processing when leaving page
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel()
      setIsVideoOn(false)
    }
  }, [])

  const handleVoiceConfirm = (voiceType: 'male' | 'female', lang: string) => {
    updateUser({
      voice_preference: voiceType,
      language_preference: lang
    })
    setLanguage(lang)
    setShowVoiceSetup(false)

    const greeting = voiceType === 'female'
      ? `Sweet! I've set up my voice for you. I'll be your supportive companion.`
      : `Great! I'm ready to help. I'll be your supportive assistant.`

    speak(greeting, lang)
    setMessages(prev => [...prev, {
      id: Date.now(),
      text: greeting,
      isAi: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }])
  }

  // Face Analysis Loop with performance guard
  const captureAndAnalyze = useCallback(async () => {
    if (!isVideoOn || !webcamRef.current || document.hidden) return

    const now = Date.now()
    if (now - lastFrameTime < 4000) return

    const imageSrc = webcamRef.current.getScreenshot()
    if (!imageSrc) return

    setLastFrameTime(now)

    try {
      const response = await fetch('http://localhost:8004/v1/analyze/face', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user?.user_id || "anonymous",
          image: imageSrc
        })
      })

      if (response.ok) {
        const data = await response.json()
        setEmotion(data.emotion)
      }
    } catch (error) {
      console.error("Face analysis failed:", error)
    }
  }, [isVideoOn, lastFrameTime, user?.user_id])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isVideoOn) {
      interval = setInterval(captureAndAnalyze, 1000)
    }
    return () => clearInterval(interval)
  }, [isVideoOn, captureAndAnalyze])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = {
      id: Date.now(),
      text: input,
      isAi: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    try {
      const userId = user?.user_id ? parseInt(user.user_id.toString()) : 1
      const enhancedInput = emotion ? `[User Emotion: ${emotion}] ${input}` : input

      const response = await fetch('http://localhost:8010/v1/mood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: isNaN(userId) ? 1 : userId,
          mood_input: enhancedInput
        })
      })

      if (!response.ok) throw new Error('Service error')

      const data = await response.json()
      const aiResponseText = `${data.message} ${data.follow_up || ''}`

      const aiMessage = {
        id: Date.now() + 1,
        text: aiResponseText,
        isAi: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }

      setMessages(prev => [...prev, aiMessage])
      speak(aiResponseText, language)

      if (emotion) {
        fetch('http://localhost:8005/v1/analyze/fusion', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: userId,
            text_emotion: data.dominant_emotion || "neutral",
            face_emotion: emotion,
            face_score: 0.8
          })
        }).catch(() => { })
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "I'm having a little trouble connecting. Can you try again?",
        isAi: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-5xl mx-auto relative px-4">
      {/* Voice Setup Modal */}
      <AnimatePresence>
        {showVoiceSetup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
          >
            <FloatingCard className="max-w-md w-full p-8 text-center space-y-6 shadow-2xl border-white/20">
              <div className="w-20 h-20 bg-gradient-to-br from-serenity-400 to-serenity-600 rounded-full flex items-center justify-center text-white mx-auto shadow-xl shadow-serenity-500/20">
                <Sparkles size={40} />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Personalize Your Assistant</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Hi {user?.name || 'Aradhy'}! To make our journey together more comfortable, how would you like me to sound?
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <button
                  onClick={() => handleVoiceConfirm('female', language)}
                  className="flex flex-col items-center gap-3 p-4 rounded-2xl border-2 border-transparent hover:border-pink-500 bg-white/5 dark:bg-white/5 transition-all text-sm font-bold"
                >
                  <div className="p-3 bg-pink-500/10 text-pink-500 rounded-full">
                    <Smile size={24} />
                  </div>
                  Polite Girl Voice
                </button>
                <button
                  onClick={() => handleVoiceConfirm('male', language)}
                  className="flex flex-col items-center gap-3 p-4 rounded-2xl border-2 border-transparent hover:border-blue-500 bg-white/5 dark:bg-white/5 transition-all text-sm font-bold"
                >
                  <div className="p-3 bg-blue-500/10 text-blue-500 rounded-full">
                    <User size={24} />
                  </div>
                  Gentle Boy Voice
                </button>
              </div>

              <div className="pt-4 text-left">
                <p className="text-xs text-muted-foreground mb-2 font-bold uppercase tracking-wider">Your Language:</p>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full p-3 rounded-xl bg-white/5 dark:bg-white/5 border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-serenity-500"
                >
                  <option value="en-US">English (US)</option>
                  <option value="en-GB">English (UK)</option>
                  <option value="hi-IN">Hindi</option>
                  <option value="fr-FR">French</option>
                </select>
              </div>
            </FloatingCard>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col gap-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-serenity-500 to-serenity-700 rounded-2xl text-white shadow-lg">
              <Sparkles size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">AI Companion</h1>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Active Listening</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsVideoOn(!isVideoOn)}
              className={`p-3 rounded-2xl border transition-all ${isVideoOn ? 'bg-red-500/10 border-red-500/20 text-red-500 shadow-lg' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
            >
              {isVideoOn ? <VideoOff size={20} /> : <Video size={20} />}
            </button>
          </div>
        </div>

        {/* Chat window */}
        <FloatingCard className="flex-1 overflow-hidden p-0 flex flex-col bg-white/40 dark:bg-black/20 border-white/10">
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
            {messages.map((msg) => (
              <AIChatBubble key={msg.id} message={msg.text} isAi={msg.isAi} timestamp={msg.timestamp} />
            ))}
            {isTyping && (
              <div className="flex items-center gap-2 text-muted-foreground ml-2">
                <div className="flex gap-1.5">
                  <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input container */}
          <div className="p-4 bg-white/20 dark:bg-white/5 backdrop-blur-xl border-t border-white/10">
            <div className="flex items-center gap-3 bg-white/50 dark:bg-black/30 rounded-3xl p-2 pr-3 focus-within:ring-2 ring-serenity-500/30 transition-all">
              <button className="p-3 text-muted-foreground hover:text-serenity-600 transition-colors">
                <Mic size={22} />
              </button>
              <input
                type="text"
                placeholder="Share your thoughts..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 bg-transparent border-none outline-none text-sm font-medium px-2"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="p-3 bg-serenity-600 text-white rounded-2xl shadow-lg shadow-serenity-600/30 disabled:opacity-50 transition-all hover:scale-105 active:scale-95"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </FloatingCard>
      </div>

      {/* Floating Webcam Overlay */}
      {isVideoOn && (
        <motion.div
          layout
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed bottom-28 right-8 w-44 h-32 md:w-56 md:h-40 rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl z-50 group transition-all"
        >
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[10px] text-white font-bold uppercase tracking-widest drop-shadow-lg">
                {emotion || 'Analyzing Emotion...'}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
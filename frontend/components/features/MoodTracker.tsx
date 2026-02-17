'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '@/lib/api'

interface MoodOption {
  id: number
  emoji: string
  label: string
  color: string
  description: string
}

const MoodTracker = () => {
  const [selectedMood, setSelectedMood] = useState<number | null>(null)
  const [notes, setNotes] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const moodOptions: MoodOption[] = [
    { id: 1, emoji: '😢', label: 'Sad', color: 'bg-blue-100 text-blue-800', description: 'Feeling down or upset' },
    { id: 2, emoji: '😠', label: 'Angry', color: 'bg-red-100 text-red-800', description: 'Feeling irritated or frustrated' },
    { id: 3, emoji: '😰', label: 'Anxious', color: 'bg-yellow-100 text-yellow-800', description: 'Feeling worried or nervous' },
    { id: 4, emoji: '😐', label: 'Neutral', color: 'bg-gray-100 text-gray-800', description: 'Feeling balanced or indifferent' },
    { id: 5, emoji: '😊', label: 'Happy', color: 'bg-green-100 text-green-800', description: 'Feeling pleased or satisfied' },
    { id: 6, emoji: '😄', label: 'Excited', color: 'bg-purple-100 text-purple-800', description: 'Feeling enthusiastic or eager' },
    { id: 7, emoji: '😌', label: 'Calm', color: 'bg-indigo-100 text-indigo-800', description: 'Feeling peaceful or relaxed' }
  ]

  const handleSubmit = async () => {
    if (selectedMood !== null) {
      try {
        const mood = moodOptions.find(m => m.id === selectedMood)
        if (!mood) return

        // Approximate score mapping
        const scores: { [key: number]: number } = {
          1: 0.2, // Sad
          2: 0.1, // Angry
          3: 0.3, // Anxious
          4: 0.5, // Neutral
          5: 0.8, // Happy
          6: 0.9, // Excited
          7: 0.9  // Calm
        }

        await api.logMood(
          '1', // Hardcoded user ID for now
          mood.label,
          scores[selectedMood] || 0.5,
          notes
        )

        setIsSubmitted(true)

        // Reset after 3 seconds
        setTimeout(() => {
          setIsSubmitted(false)
          setSelectedMood(null)
          setNotes('')
        }, 3000)
      } catch (error) {
        console.error("Failed to log mood:", error)
      }
    }
  }

  return (
    <div className="glass-card rounded-3xl p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">How are you feeling today?</h2>

      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3">
              {moodOptions.map((mood) => (
                <motion.button
                  key={mood.id}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedMood(mood.id)}
                  className={`flex flex-col items-center p-3 rounded-2xl transition-all duration-200 ${selectedMood === mood.id
                      ? `${mood.color} ring-2 ring-offset-2 ring-opacity-50 scale-105`
                      : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                >
                  <span className="text-2xl">{mood.emoji}</span>
                  <span className="text-xs font-medium mt-1">{mood.label}</span>
                </motion.button>
              ))}
            </div>

            {selectedMood && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <div>
                  <label htmlFor="mood-notes" className="block text-sm font-medium text-gray-700 mb-2">
                    Add notes (optional)
                  </label>
                  <textarea
                    id="mood-notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="What's contributing to how you feel?"
                    className="w-full input-field min-h-[100px]"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all"
                >
                  Save Mood Entry
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-center py-8"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Mood Saved!</h3>
            <p className="text-gray-600">Thank you for tracking your mood today.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MoodTracker
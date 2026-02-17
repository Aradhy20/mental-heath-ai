'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Recommendation {
  id: string
  title: string
  description: string
  type: 'activity' | 'resource' | 'tip' | 'challenge'
  icon: string
  duration?: string
  difficulty?: 'easy' | 'medium' | 'hard'
}

const RecommendationCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  const recommendations: Recommendation[] = [
    {
      id: '1',
      title: 'Morning Mindfulness',
      description: 'Start your day with a 5-minute mindfulness meditation to set a positive tone.',
      type: 'activity',
      icon: '🌅',
      duration: '5 mins',
      difficulty: 'easy'
    },
    {
      id: '2',
      title: 'Gratitude Journal',
      description: 'Write down three things you\'re grateful for each day to cultivate positivity.',
      type: 'activity',
      icon: '📖',
      duration: '10 mins',
      difficulty: 'easy'
    },
    {
      id: '3',
      title: 'Deep Breathing Exercise',
      description: 'Practice the 4-7-8 breathing technique to reduce anxiety and promote relaxation.',
      type: 'activity',
      icon: '💨',
      duration: '5 mins',
      difficulty: 'easy'
    },
    {
      id: '4',
      title: 'Nature Walk Challenge',
      description: 'Take a 20-minute walk in nature to boost your mood and reduce stress.',
      type: 'challenge',
      icon: '🌳',
      duration: '20 mins',
      difficulty: 'medium'
    },
    {
      id: '5',
      title: 'Sleep Hygiene Tips',
      description: 'Learn evidence-based strategies to improve your sleep quality and duration.',
      type: 'resource',
      icon: '😴',
      duration: 'Read',
      difficulty: 'easy'
    },
    {
      id: '6',
      title: 'Positive Affirmations',
      description: 'Replace negative self-talk with empowering affirmations to build self-confidence.',
      type: 'tip',
      icon: '💪',
      duration: '2 mins',
      difficulty: 'easy'
    }
  ]

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'activity': return 'bg-blue-100 text-blue-800'
      case 'resource': return 'bg-green-100 text-green-800'
      case 'tip': return 'bg-purple-100 text-purple-800'
      case 'challenge': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600'
      case 'medium': return 'text-yellow-600'
      case 'hard': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const nextRecommendation = () => {
    setDirection(1)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % recommendations.length)
  }

  const prevRecommendation = () => {
    setDirection(-1)
    setCurrentIndex((prevIndex) => (prevIndex - 1 + recommendations.length) % recommendations.length)
  }

  // Auto-rotate every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextRecommendation()
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity
  }

  return (
    <div className="glass-card rounded-3xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Personalized Recommendations</h2>
        <div className="text-sm text-gray-500">
          {currentIndex + 1} of {recommendations.length}
        </div>
      </div>

      <div className="relative h-64 overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={{
              enter: (direction: number) => ({
                x: direction > 0 ? 1000 : -1000,
                opacity: 0
              }),
              center: {
                zIndex: 1,
                x: 0,
                opacity: 1
              },
              exit: (direction: number) => ({
                zIndex: 0,
                x: direction < 0 ? 1000 : -1000,
                opacity: 0
              })
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x)
              if (swipe < -10000) {
                nextRecommendation()
              } else if (swipe > 10000) {
                prevRecommendation()
              }
            }}
            className="absolute inset-0 flex flex-col justify-between p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(recommendations[currentIndex].type)}`}>
                  {recommendations[currentIndex].type.charAt(0).toUpperCase() + recommendations[currentIndex].type.slice(1)}
                </span>
                {recommendations[currentIndex].difficulty && (
                  <span className={`ml-2 text-xs font-medium ${getDifficultyColor(recommendations[currentIndex].difficulty!)}`}>
                    {recommendations[currentIndex].difficulty}
                  </span>
                )}
              </div>
              <div className="text-3xl">{recommendations[currentIndex].icon}</div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {recommendations[currentIndex].title}
              </h3>
              <p className="text-gray-700 mb-4">
                {recommendations[currentIndex].description}
              </p>
            </div>

            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {recommendations[currentIndex].duration && (
                  <span>⏱️ {recommendations[currentIndex].duration}</span>
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-medium text-sm"
              >
                Try Now
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={prevRecommendation}
          className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          aria-label="Previous recommendation"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex space-x-2">
          {recommendations.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-purple-500' : 'bg-gray-300'
              }`}
              aria-label={`Go to recommendation ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={nextRecommendation}
          className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          aria-label="Next recommendation"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default RecommendationCarousel
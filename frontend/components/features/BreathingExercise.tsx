'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type BreathingPhase = 'inhale' | 'hold' | 'exhale' | 'rest'

const BreathingExercise = () => {
  const [phase, setPhase] = useState<BreathingPhase>('inhale')
  const [isActive, setIsActive] = useState(false)
  const [timeLeft, setTimeLeft] = useState(4)
  const [cycleCount, setCycleCount] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const phaseConfig = {
    inhale: { duration: 4, text: 'Breathe In', color: 'from-green-400 to-blue-500' },
    hold: { duration: 4, text: 'Hold', color: 'from-blue-500 to-purple-500' },
    exhale: { duration: 6, text: 'Breathe Out', color: 'from-purple-500 to-pink-500' },
    rest: { duration: 2, text: 'Rest', color: 'from-pink-500 to-green-400' }
  }

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Move to next phase
            setPhase(prevPhase => {
              const phases: BreathingPhase[] = ['inhale', 'hold', 'exhale', 'rest']
              const currentIndex = phases.indexOf(prevPhase)
              const nextIndex = (currentIndex + 1) % phases.length
              
              if (phases[nextIndex] === 'inhale') {
                setCycleCount(count => count + 1)
              }
              
              return phases[nextIndex]
            })
            return phaseConfig[phase].duration
          }
          return prev - 1
        })
      }, 1000)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isActive, phase])

  const startExercise = () => {
    setIsActive(true)
    setPhase('inhale')
    setTimeLeft(phaseConfig.inhale.duration)
    setCycleCount(0)
  }

  const pauseExercise = () => {
    setIsActive(false)
  }

  const resetExercise = () => {
    setIsActive(false)
    setPhase('inhale')
    setTimeLeft(phaseConfig.inhale.duration)
    setCycleCount(0)
  }

  const getCircleScale = () => {
    const totalDuration = phaseConfig[phase].duration
    const progress = (totalDuration - timeLeft) / totalDuration
    
    switch (phase) {
      case 'inhale':
        return 0.8 + 0.4 * progress
      case 'hold':
        return 1.2
      case 'exhale':
        return 1.2 - 0.4 * progress
      case 'rest':
        return 0.8
      default:
        return 1
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-64 h-64 mb-8">
        <motion.div
          className={`absolute inset-0 rounded-full bg-gradient-to-br ${phaseConfig[phase].color} opacity-20`}
          animate={{
            scale: getCircleScale() * 1.2,
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: 'reverse'
          }}
        />
        
        <motion.div
          className={`absolute inset-4 rounded-full bg-gradient-to-br ${phaseConfig[phase].color} flex items-center justify-center shadow-xl`}
          animate={{
            scale: getCircleScale()
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 20
          }}
        >
          <div className="text-center">
            <motion.p
              key={phase}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-white text-lg font-medium"
            >
              {phaseConfig[phase].text}
            </motion.p>
            <motion.p
              key={`${phase}-${timeLeft}`}
              initial={{ scale: 1.5 }}
              animate={{ scale: 1 }}
              className="text-white text-3xl font-bold mt-2"
            >
              {timeLeft}
            </motion.p>
          </div>
        </motion.div>
      </div>

      <div className="text-center mb-6">
        <p className="text-gray-600">Cycle: {cycleCount}</p>
        <p className="text-sm text-gray-500 mt-1">
          {phase === 'inhale' && 'Slowly breathe in through your nose'}
          {phase === 'hold' && 'Hold your breath gently'}
          {phase === 'exhale' && 'Slowly breathe out through your mouth'}
          {phase === 'rest' && 'Rest and prepare for the next cycle'}
        </p>
      </div>

      <div className="flex space-x-4">
        {!isActive ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startExercise}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all"
          >
            Start Breathing
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={pauseExercise}
            className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all"
          >
            Pause
          </motion.button>
        )}
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={resetExercise}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-2xl font-medium hover:bg-gray-300 transition-all"
        >
          Reset
        </motion.button>
      </div>

      <div className="mt-8 w-full max-w-md">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>Inhale (4s)</span>
          <span>Hold (4s)</span>
          <span>Exhale (6s)</span>
          <span>Rest (2s)</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-green-400 via-blue-500 via-purple-500 to-pink-500"
            initial={{ width: '0%' }}
            animate={{ 
              width: isActive 
                ? `${((cycleCount * 16 + (phaseConfig[phase].duration - timeLeft)) / 16) * 100}%` 
                : '0%' 
            }}
            transition={{ duration: 1 }}
          />
        </div>
      </div>
    </div>
  )
}

export default BreathingExercise
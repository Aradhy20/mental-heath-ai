'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AnimatedButton from '@/components/animations/AnimatedButton'

interface BreathingExerciseProps {
  className?: string
}

const BreathingExercise: React.FC<BreathingExerciseProps> = ({ className = '' }) => {
  const [isActive, setIsActive] = useState(false)
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale')
  const [count, setCount] = useState(4)
  const [cycle, setCycle] = useState(1)
  const [totalCycles, setTotalCycles] = useState(5)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Breathing phases with durations (in seconds)
  const phases = {
    inhale: { duration: 4, text: 'Breathe In', color: 'bg-blue-400' },
    hold: { duration: 4, text: 'Hold', color: 'bg-purple-400' },
    exhale: { duration: 6, text: 'Breathe Out', color: 'bg-green-400' },
    rest: { duration: 2, text: 'Rest', color: 'bg-yellow-400' }
  }

  // Start/stop the breathing exercise
  const toggleExercise = () => {
    if (isActive) {
      // Stop the exercise
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      setIsActive(false)
    } else {
      // Start the exercise
      setIsActive(true)
      setPhase('inhale')
      setCount(phases.inhale.duration)
      setCycle(1)
    }
  }

  // Handle the countdown and phase transitions
  useEffect(() => {
    if (!isActive) return

    intervalRef.current = setInterval(() => {
      setCount(prevCount => {
        if (prevCount > 1) {
          return prevCount - 1
        } else {
          // Move to next phase
          let nextPhase: 'inhale' | 'hold' | 'exhale' | 'rest'
          let nextCycle = cycle

          switch (phase) {
            case 'inhale':
              nextPhase = 'hold'
              break
            case 'hold':
              nextPhase = 'exhale'
              break
            case 'exhale':
              nextPhase = 'rest'
              break
            case 'rest':
              nextPhase = 'inhale'
              nextCycle = cycle + 1
              if (nextCycle > totalCycles) {
                // Exercise complete
                if (intervalRef.current) {
                  clearInterval(intervalRef.current)
                }
                return 0
              }
              break
            default:
              nextPhase = 'inhale'
          }

          setPhase(nextPhase)
          setCycle(nextCycle)
          return phases[nextPhase].duration
        }
      })
    }, 1000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isActive, phase, cycle, totalCycles, phases])

  // Reset the exercise
  const resetExercise = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    setIsActive(false)
    setPhase('inhale')
    setCount(4)
    setCycle(1)
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Breathing circle */}
      <div className="relative mb-8">
        <motion.div
          className={`w-64 h-64 rounded-full ${phases[phase].color} flex items-center justify-center shadow-lg`}
          animate={{
            scale: isActive ? 
              phase === 'inhale' ? [1, 1.2] : 
              phase === 'exhale' ? [1.2, 1] : 
              1 : 
              1
          }}
          transition={{
            duration: phases[phase].duration,
            ease: "easeInOut"
          }}
        >
          <div className="text-center text-white">
            <div className="text-2xl font-bold">{phases[phase].text}</div>
            <div className="text-4xl font-bold mt-2">{count}</div>
          </div>
        </motion.div>
        
        {/* Pulsing effect when active */}
        {isActive && (
          <motion.div
            className={`absolute inset-0 rounded-full ${phases[phase].color} opacity-30`}
            animate={{ scale: [1, 1.5], opacity: [0.3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </div>

      {/* Exercise info */}
      <div className="text-center mb-6">
        <div className="text-lg font-medium text-gray-700">
          Cycle {cycle} of {totalCycles}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
          <motion.div 
            className="bg-primary h-2.5 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(cycle - 1) / totalCycles * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 justify-center">
        <AnimatedButton
          onClick={toggleExercise}
          variant={isActive ? "outline" : "primary"}
          size="lg"
        >
          {isActive ? 'Stop' : 'Start'} Breathing Exercise
        </AnimatedButton>
        
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <AnimatedButton
                onClick={resetExercise}
                variant="secondary"
                size="lg"
              >
                Reset
              </AnimatedButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Instructions */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg max-w-md">
        <h3 className="font-medium text-gray-900 mb-2">How to use:</h3>
        <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
          <li>Find a comfortable position</li>
          <li>Place one hand on your chest and one on your belly</li>
          <li>Follow the breathing phases and countdown</li>
          <li>Focus on slow, deep breaths</li>
        </ul>
      </div>
    </div>
  )
}

export default BreathingExercise
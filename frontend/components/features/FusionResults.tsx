'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import AnimatedCard from '@/components/animations/AnimatedCard'
import AnimatedStat from '@/components/animations/AnimatedStat'
import AnimatedProgressBar from '@/components/animations/AnimatedProgressBar'

interface ModalityData {
  label: string
  score: number
  confidence: number
  emotion: string
}

interface FusionResult {
  final_score: number
  risk_level: string
  confidence: number
  discrepancy_detected: boolean
}

const FusionResults: React.FC = () => {
  const [modalityData, setModalityData] = useState<ModalityData[]>([
    { label: 'Text', score: 0.65, confidence: 0.85, emotion: 'Concerned' },
    { label: 'Voice', score: 0.72, confidence: 0.78, emotion: 'Stressed' },
    { label: 'Face', score: 0.58, confidence: 0.92, emotion: 'Anxious' }
  ])

  const [fusionResult, setFusionResult] = useState<FusionResult>({
    final_score: 0.65,
    risk_level: 'medium',
    confidence: 0.85,
    discrepancy_detected: true
  })

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-500'
      case 'medium': return 'bg-yellow-500'
      case 'high': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getRiskLabel = (level: string) => {
    switch (level) {
      case 'low': return 'Low Risk'
      case 'medium': return 'Medium Risk'
      case 'high': return 'High Risk'
      default: return level
    }
  }

  return (
    <AnimatedCard className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Multimodal Analysis Fusion</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {modalityData.map((modality, index) => (
          <AnimatedCard 
            key={modality.label}
            delay={index * 0.1}
            className="border border-gray-200 rounded-lg p-4"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-medium text-gray-900">{modality.label} Analysis</h3>
              <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                {modality.emotion}
              </span>
            </div>
            
            <div className="space-y-4">
              <div>
                <AnimatedProgressBar 
                  value={modality.score * 100}
                  max={100}
                  label="Emotion Score"
                  color="bg-blue-500"
                  className="h-2"
                />
              </div>
              
              <div>
                <AnimatedProgressBar 
                  value={modality.confidence * 100}
                  max={100}
                  label="Confidence"
                  color="bg-green-500"
                  className="h-2"
                />
              </div>
            </div>
          </AnimatedCard>
        ))}
      </div>

      <AnimatedCard className="border border-gray-200 rounded-lg p-6 mb-6">
        <h3 className="font-medium text-gray-900 mb-4 text-center">Fusion Results</h3>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center">
            <div className={`w-32 h-32 rounded-full ${getRiskColor(fusionResult.risk_level)} flex items-center justify-center mb-3`}>
              <span className="text-4xl text-white font-bold">
                {Math.round(fusionResult.final_score * 100)}
              </span>
            </div>
            <span className="text-lg font-medium text-gray-900">Overall Score</span>
          </div>
          
          <div className="flex-1 max-w-md">
            <div className="text-center mb-4">
              <span className={`inline-block px-4 py-2 rounded-full text-white text-lg font-medium ${getRiskColor(fusionResult.risk_level)}`}>
                {getRiskLabel(fusionResult.risk_level)}
              </span>
            </div>
            
            <div className="space-y-4">
              <div>
                <AnimatedProgressBar 
                  value={fusionResult.confidence * 100}
                  max={100}
                  label="Confidence"
                  color={getRiskColor(fusionResult.risk_level)}
                />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Risk Level</span>
                  <span className="font-medium capitalize">{fusionResult.risk_level}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <motion.div 
                    className={`h-2.5 rounded-full ${getRiskColor(fusionResult.risk_level)}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${fusionResult.final_score * 100}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedCard>

      {fusionResult.discrepancy_detected && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg mb-6"
        >
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Discrepancy Detected</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  Significant differences were detected between modalities. This may indicate mixed emotions or varying expression across communication channels.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AnimatedStat 
          value={85} 
          label="Analysis Accuracy" 
          suffix="%" 
          className="text-center"
        />
        <AnimatedStat 
          value={3} 
          label="Modalities Used" 
          className="text-center"
        />
        <AnimatedStat 
          value={24} 
          label="Processing Time" 
          suffix="ms" 
          className="text-center"
        />
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Fusion Engine</h4>
        <p className="text-sm text-gray-600">
          Our multimodal fusion engine combines text, voice, and facial analysis using weighted algorithms to provide a comprehensive assessment of your emotional state and mental wellness.
        </p>
      </div>
    </AnimatedCard>
  )
}

export default FusionResults
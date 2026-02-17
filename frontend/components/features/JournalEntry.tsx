'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface SentimentResult {
  sentiment: 'positive' | 'negative' | 'neutral'
  score: number
  keywords: string[]
}

const JournalEntry = () => {
  const [entry, setEntry] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [sentiment, setSentiment] = useState<SentimentResult | null>(null)
  const [wordCount, setWordCount] = useState(0)
  const workerRef = useRef<Worker | null>(null)

  useEffect(() => {
    // Create Web Worker for sentiment analysis
    if (typeof Worker !== 'undefined') {
      workerRef.current = new Worker(new URL('../../workers/sentimentWorker.ts', import.meta.url))
      workerRef.current.onmessage = (e) => {
        setSentiment(e.data)
        setIsAnalyzing(false)
      }
    }

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate()
      }
    }
  }, [])

  useEffect(() => {
    setWordCount(entry.trim() === '' ? 0 : entry.trim().split(/\s+/).length)
  }, [entry])

  const analyzeSentiment = () => {
    if (entry.trim().length < 10) return
    
    setIsAnalyzing(true)
    setSentiment(null)
    
    if (workerRef.current) {
      workerRef.current.postMessage({ text: entry })
    }
  }

  const getSentimentColor = () => {
    if (!sentiment) return 'bg-gray-100'
    
    switch (sentiment.sentiment) {
      case 'positive': return 'bg-green-100 text-green-800'
      case 'negative': return 'bg-red-100 text-red-800'
      case 'neutral': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100'
    }
  }

  const getSentimentIcon = () => {
    if (!sentiment) return null
    
    switch (sentiment.sentiment) {
      case 'positive': return '😊'
      case 'negative': return '😞'
      case 'neutral': return '😐'
      default: return null
    }
  }

  return (
    <div className="glass-card rounded-3xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Daily Journal</h2>
        <div className="text-sm text-gray-500">
          {wordCount} words
        </div>
      </div>

      <div className="mb-4">
        <textarea
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          placeholder="What's on your mind today? Write freely about your thoughts and feelings..."
          className="w-full input-field min-h-[200px] p-4"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="text-sm text-gray-500">
          Tip: Write for at least 2 minutes to get the most benefit
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={analyzeSentiment}
          disabled={entry.trim().length < 10 || isAnalyzing}
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAnalyzing ? 'Analyzing...' : 'Analyze Sentiment'}
        </motion.button>
      </div>

      <AnimatePresence>
        {(isAnalyzing || sentiment) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 pt-6 border-t border-gray-200"
          >
            <h3 className="font-medium text-gray-900 mb-3">Sentiment Analysis</h3>
            
            {isAnalyzing ? (
              <div className="flex items-center">
                <div className="w-6 h-6 border-t-2 border-purple-500 border-solid rounded-full animate-spin mr-3"></div>
                <span className="text-gray-600">Analyzing your entry...</span>
              </div>
            ) : sentiment && (
              <div className="space-y-4">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{getSentimentIcon()}</span>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${getSentimentColor()}`}>
                    {sentiment.sentiment.charAt(0).toUpperCase() + sentiment.sentiment.slice(1)}
                  </div>
                  <div className="ml-4 text-sm text-gray-600">
                    Confidence: {Math.round(sentiment.score * 100)}%
                  </div>
                </div>
                
                {sentiment.keywords.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Key emotions detected:</p>
                    <div className="flex flex-wrap gap-2">
                      {sentiment.keywords.map((keyword, index) => (
                        <span 
                          key={index} 
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="mt-4 p-4 bg-blue-50 rounded-xl">
                  <h4 className="font-medium text-blue-900 mb-2">Reflection Prompt</h4>
                  <p className="text-sm text-blue-800">
                    {sentiment.sentiment === 'negative' 
                      ? "What are three things you can do today to improve your mood?" 
                      : sentiment.sentiment === 'positive'
                      ? "What contributed to your positive feelings today? How can you cultivate more of that?"
                      : "What would make today even better for you?"}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default JournalEntry
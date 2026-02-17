// useSentimentWorker.ts
import { useState, useEffect, useCallback } from 'react'

interface SentimentAnalysisRequest {
  id: string
  text: string
  userId: number
}

interface SentimentAnalysisResult {
  id: string
  result?: {
    emotion_label: string
    emotion_score: number
    confidence: number
  }
  error?: string
}

const useSentimentWorker = () => {
  const [worker, setWorker] = useState<Worker | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<SentimentAnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Create web worker
    const sentimentWorker = new Worker(new URL('../../workers/sentimentAnalyzer.worker.ts', import.meta.url))

    sentimentWorker.onmessage = (event: MessageEvent<SentimentAnalysisResult>) => {
      setIsLoading(false)
      setResult(event.data)
      if (event.data.error) {
        setError(event.data.error)
      }
    }

    sentimentWorker.onerror = (error) => {
      setIsLoading(false)
      setError(error.message)
    }

    setWorker(sentimentWorker)

    // Clean up worker on unmount
    return () => {
      sentimentWorker.terminate()
    }
  }, [])

  const analyzeSentiment = useCallback((text: string, userId: number) => {
    if (!worker) {
      setError('Worker not initialized')
      return
    }

    setIsLoading(true)
    setError(null)
    setResult(null)

    const requestId = Math.random().toString(36).substring(2, 15)

    const request: SentimentAnalysisRequest = {
      id: requestId,
      text,
      userId
    }

    worker.postMessage(request)
  }, [worker])

  return { analyzeSentiment, isLoading, result, error }
}

export default useSentimentWorker
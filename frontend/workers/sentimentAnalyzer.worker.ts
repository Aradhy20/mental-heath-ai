// sentimentAnalyzer.worker.ts
// Web Worker for sentiment analysis to keep the main thread free

// Type definitions for the messages
interface SentimentAnalysisRequest {
  id: string
  text: string
  userId: number
}

interface SentimentAnalysisResult {
  id: string
  result: {
    emotion_label: string
    emotion_score: number
    confidence: number
  }
}

// Mock sentiment analysis function
// In a real application, this would be replaced with actual ML model inference
const analyzeSentiment = (text: string) => {
  // Simple keyword-based sentiment analysis for demonstration
  const positiveWords = ['happy', 'joy', 'excited', 'good', 'great', 'wonderful', 'amazing', 'fantastic', 'love', 'peaceful']
  const negativeWords = ['sad', 'angry', 'frustrated', 'disappointed', 'worried', 'anxious', 'stressed', 'depressed', 'upset', 'mad']
  const neutralWords = ['okay', 'fine', 'normal', 'regular', 'average', 'standard', 'typical', 'usual']

  const words = text.toLowerCase().split(/\W+/)
  let positiveCount = 0
  let negativeCount = 0
  let neutralCount = 0

  words.forEach(word => {
    if (positiveWords.includes(word)) positiveCount++
    if (negativeWords.includes(word)) negativeCount++
    if (neutralWords.includes(word)) neutralCount++
  })

  const totalCount = positiveCount + negativeCount + neutralCount
  if (totalCount === 0) {
    return { emotion_label: 'Neutral', emotion_score: 5, confidence: 0.5 }
  }

  const positiveScore = positiveCount / totalCount
  const negativeScore = negativeCount / totalCount
  const neutralScore = neutralCount / totalCount

  if (positiveScore > negativeScore && positiveScore > neutralScore) {
    return { 
      emotion_label: 'Positive', 
      emotion_score: 7 + (positiveScore * 3), // Scale 7-10
      confidence: positiveScore 
    }
  } else if (negativeScore > positiveScore && negativeScore > neutralScore) {
    return { 
      emotion_label: 'Negative', 
      emotion_score: 3 - (negativeScore * 2), // Scale 1-3
      confidence: negativeScore 
    }
  } else {
    return { 
      emotion_label: 'Neutral', 
      emotion_score: 4 + (neutralScore * 2), // Scale 4-6
      confidence: neutralScore 
    }
  }
}

// Listen for messages from the main thread
self.onmessage = (event: MessageEvent<SentimentAnalysisRequest>) => {
  const { id, text, userId } = event.data
  
  try {
    // Perform sentiment analysis
    const result = analyzeSentiment(text)
    
    // Send result back to main thread
    const response: SentimentAnalysisResult = {
      id,
      result
    }
    
    self.postMessage(response)
  } catch (error) {
    // Send error back to main thread
    self.postMessage({ 
      id, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    })
  }
}

export {}
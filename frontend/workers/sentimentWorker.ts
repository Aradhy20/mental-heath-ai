// Web Worker for sentiment analysis
// This runs in a separate thread to keep the UI responsive

interface SentimentResult {
  sentiment: 'positive' | 'negative' | 'neutral'
  score: number
  keywords: string[]
}

// Simple sentiment analysis function
function analyzeSentiment(text: string): SentimentResult {
  // Convert to lowercase for easier matching
  const lowerText = text.toLowerCase();
  
  // Define keywords for each sentiment
  const positiveWords = [
    'happy', 'joy', 'love', 'great', 'excellent', 'wonderful', 'amazing', 'fantastic', 
    'awesome', 'brilliant', 'perfect', 'outstanding', 'superb', 'marvelous', 'terrific',
    'delighted', 'pleased', 'satisfied', 'content', 'cheerful', 'upbeat', 'optimistic',
    'hopeful', 'enthusiastic', 'excited', 'thrilled', 'elated', 'ecstatic', 'blissful'
  ];
  
  const negativeWords = [
    'sad', 'angry', 'hate', 'terrible', 'awful', 'horrible', 'dreadful', 'atrocious',
    'abysmal', 'miserable', 'depressed', 'unhappy', 'sorrowful', 'gloomy', 'melancholy',
    'disappointed', 'frustrated', 'annoyed', 'irritated', 'upset', 'distressed', 'worried',
    'anxious', 'nervous', 'stressed', 'overwhelmed', 'exhausted', 'fatigued', 'drained'
  ];
  
  // Count occurrences of positive and negative words
  let positiveCount = 0;
  let negativeCount = 0;
  const foundKeywords: string[] = [];
  
  // Check for positive words
  positiveWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = lowerText.match(regex);
    if (matches) {
      positiveCount += matches.length;
      foundKeywords.push(word);
    }
  });
  
  // Check for negative words
  negativeWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = lowerText.match(regex);
    if (matches) {
      negativeCount += matches.length;
      foundKeywords.push(word);
    }
  });
  
  // Determine sentiment based on counts
  const totalCount = positiveCount + negativeCount;
  
  if (totalCount === 0) {
    return {
      sentiment: 'neutral',
      score: 0.5,
      keywords: []
    };
  }
  
  const positiveRatio = positiveCount / totalCount;
  
  if (positiveRatio > 0.6) {
    return {
      sentiment: 'positive',
      score: positiveRatio,
      keywords: Array.from(new Set(foundKeywords)).slice(0, 5)
    };
  } else if (positiveRatio < 0.4) {
    return {
      sentiment: 'negative',
      score: 1 - positiveRatio,
      keywords: Array.from(new Set(foundKeywords)).slice(0, 5)
    };
  } else {
    return {
      sentiment: 'neutral',
      score: 0.5,
      keywords: Array.from(new Set(foundKeywords)).slice(0, 5)
    };
  }
}

// Listen for messages from the main thread
self.addEventListener('message', (e) => {
  const { text } = e.data;
  
  // Perform sentiment analysis
  const result = analyzeSentiment(text);
  
  // Send result back to main thread
  self.postMessage(result);
});

export {};
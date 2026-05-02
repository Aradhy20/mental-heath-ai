/**
 * MindfulAI — Centralized API Service Layer
 * Supports both high-fidelity STUB mode for stable demos 
 * and LIVE mode for actual backend integration.
 */

import {
  DEMO_AUTH_RESPONSE,
  DEMO_USER,
  DASHBOARD_STATS,
  INSIGHTS_DATA,
  MOOD_LOG_RESULT,
  JOURNAL_ENTRIES,
  WELLNESS_ACTIONS,
  ASSESSMENT_RESULT,
  GAME_RECOMMENDATIONS,
  GAME_SCORE_RESULT,
} from './static-data'

// Toggle this to true to enable actual backend calls (ensure backend is running at API_URL)
const IS_LIVE_MODE = true 
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

// ── Token helpers ──────────────────────────────────────────────────────────────
export const getToken = () =>
  (typeof window !== 'undefined' ? localStorage.getItem('mindful_token') : null) ?? ''

// ── Utility: Fetch Wrapper ───────────────────────────────────────────────────
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  if (!IS_LIVE_MODE) return {} as T // Fallback to empty or specific stub in calling method

  const token = getToken()
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const response = await fetch(`${API_URL}${path}`, { ...options, headers })
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }))
    throw new Error(error.detail || 'API Request Failed')
  }
  return response.json()
}

// ── AUTH ───────────────────────────────────────────────────────────────────────
export interface AuthResponse {
  access_token: string
  token: string
  user_id: string
  user: { username: string; email: string; full_name: string | null }
}

export const authAPI = {
  register: async (data: { username: string; email: string; password: string }): Promise<AuthResponse> => {
    if (!IS_LIVE_MODE) return DEMO_AUTH_RESPONSE
    return request<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
  login: async (data: { email: string; password: string }): Promise<AuthResponse> => {
    if (!IS_LIVE_MODE) return DEMO_AUTH_RESPONSE
    return request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
  me: async () => {
    if (!IS_LIVE_MODE) return DEMO_USER
    return request<any>('/auth/me')
  },
}

// ── CHAT (Enhanced Intelligence) ─────────────────────────────────────────────
export interface ChatChunk {
  type: 'token' | 'metadata' | 'error'
  content?: string
  emotion?: string
  emotion_source?: string
  confidence?: number
  risk?: string
  risk_confidence?: number
  mode?: string
  action?: string
}

const THERAPEUTIC_RESPONSES: Record<string, string[]> = {
  sad: [
    "I can sense the heaviness in your words. It's completely valid to feel this way. Let's explore this together — what do you feel is the root of this sorrow?",
    "It sounds like you're navigating a difficult emotional landscape. Remember, even the longest night eventually yields to the dawn. What's one small act of self-kindness you can perform right now?",
    "I hear you. Deep sadness can feel like an ocean, but you are a strong swimmer. Let's focus on grounding ourselves. Can you describe the texture of something near you?"
  ],
  anxious: [
    "Your neural signals suggest an elevated state of arousal. Let's try to decelerate. Can we do a 4-7-8 breathing cycle together? Inhale for 4...",
    "Anxiety often tries to pull us into a future that hasn't happened yet. Let's bring your focus back to the 'now'. What are three sounds you can hear in your immediate environment?",
    "It's okay to feel overwhelmed. Your mind is trying to protect you, but it's overreacting. Let's reframe this: you aren't 'anxious', you are 'prepared'. What are we preparing for?"
  ],
  happy: [
    "It's wonderful to witness this resonance of joy! These positive states are vital for neuroplasticity. Let's anchor this feeling. What specifically brought this smile to your face today?",
    "I'm detecting a very high clarity index in your response. This state of 'flow' is where your best work happens. How can we extend this positive momentum into your next task?",
  ],
  default: [
    "That's a profound reflection. It shows a high degree of emotional intelligence to observe your thoughts like that. Where do you want to take this conversation next?",
    "I appreciate your vulnerability. In our session today, my goal is to provide a safe space for your neural processing. Does it feel like we're touching on something important here?",
    "Your self-awareness is your greatest asset. By naming these feelings, you've already begun the process of regulating them. What would a 'successful' day look like for you today?",
    "I'm here to listen and help you synthesize these thoughts. Sometimes the mind just needs a mirror. What do you see when you look at this situation from a distance?",
  ]
}

export async function* streamChat(
  message: string,
  _history: { role: string; content: string }[],
  _biometrics?: Record<string, unknown> | null,
  _signal?: AbortSignal
): AsyncGenerator<ChatChunk> {
  // ── LIVE MODE ──────────────────────────────────────────────────────────────
  if (IS_LIVE_MODE) {
    // In a real production app, we would use WebSockets or Server-Sent Events here
    // For now, we'll simulate the bridge to the /api/v1/chat endpoint
    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ message, history: _history, biometrics: _biometrics }),
        signal: _signal
      })
      
      if (!response.body) throw new Error('No response body')
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      
      let buffer = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || '' // Keep the last partial line in the buffer
        
        for (const line of lines) {
          const trimmedLine = line.trim()
          if (!trimmedLine || !trimmedLine.startsWith('data: ')) continue
          
          try {
            const data = JSON.parse(trimmedLine.slice(6))
            yield data as ChatChunk
          } catch (e) {
            console.error('Error parsing SSE frame:', e)
          }
        }
      }
      return
    } catch (err) {
      yield { type: 'error', content: 'Connection to MindfulAI Core lost. Reverting to local backup...' }
    }
  }

  // ── STUB MODE (High-Fidelity) ──────────────────────────────────────────────
  const msg = message.toLowerCase()
  let pool = THERAPEUTIC_RESPONSES.default

  if (msg.includes('sad') || msg.includes('depressed') || msg.includes('bad') || msg.includes('lonely')) pool = THERAPEUTIC_RESPONSES.sad
  else if (msg.includes('anxious') || msg.includes('stress') || msg.includes('worried') || msg.includes('fear')) pool = THERAPEUTIC_RESPONSES.anxious
  else if (msg.includes('happy') || msg.includes('good') || msg.includes('great') || msg.includes('excited')) pool = THERAPEUTIC_RESPONSES.happy

  const response = pool[Math.floor(Math.random() * pool.length)]

  // Simulate ultra-realistic "Neural Streaming"
  const words = response.split(' ')
  for (const word of words) {
    yield { type: 'token', content: word + ' ' }
    await new Promise(r => setTimeout(r, 30 + Math.random() * 40)) // Varied typing speed for realism
  }

  // Inject randomized clinical metadata
  const emotions = ['focused', 'reflective', 'calm', 'analytical']
  const emotion = pool === THERAPEUTIC_RESPONSES.sad ? 'melancholy' : 
                  pool === THERAPEUTIC_RESPONSES.anxious ? 'anxious' : 
                  pool === THERAPEUTIC_RESPONSES.happy ? 'joy' : 
                  emotions[Math.floor(Math.random() * emotions.length)]

  yield {
    type: 'metadata',
    emotion,
    emotion_source: 'neural_synthesis',
    confidence: 0.85 + Math.random() * 0.1,
    risk: pool === THERAPEUTIC_RESPONSES.sad ? 'medium' : 'low',
    risk_confidence: 0.95,
    mode: 'CLINICAL_SUPPORT',
  }
}

// ── MOOD ──────────────────────────────────────────────────────────────────────
export interface MoodLog {
  score: number
  energy: number
  sleep_hours: number
  notes?: string
}
export interface MoodEntry extends MoodLog {
  id: string
  user_id: string
  created_at: string
}

export const moodAPI = {
  log: async (data: MoodLog) => {
    if (!IS_LIVE_MODE) return MOOD_LOG_RESULT
    return request<any>('/biometrics/mood', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
  recent: async (): Promise<MoodEntry[]> => {
    if (!IS_LIVE_MODE) return []
    return request<MoodEntry[]>('/biometrics/history')
  },
}

// ── JOURNAL ───────────────────────────────────────────────────────────────────
export interface JournalEntry {
  content: string
  mood_tag?: string
  is_private?: boolean
}
export interface JournalRecord extends JournalEntry {
  id: string
  created_at: string
  emotion_analysis?: { emotion: string; score: number }
}

export const journalAPI = {
  create: async (data: JournalEntry) => {
    if (!IS_LIVE_MODE) return { id: 'demo-journal-' + Date.now() }
    return request<any>('/wellness/journal', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
  list: async (): Promise<JournalRecord[]> => {
    if (!IS_LIVE_MODE) return JOURNAL_ENTRIES as JournalRecord[]
    return request<JournalRecord[]>('/wellness/journal')
  },
}

// ── INSIGHTS ──────────────────────────────────────────────────────────────────
export interface InsightData {
  weekly_summary: { avg_mood: number; trend: string; dominant_emotion: string }
  emotion_breakdown: { emotion: string; count: number; percentage: number }[]
  risk_assessment: { level: string; confidence: number }
  recommendations: string[]
  mood_history: { date: string; score: number; emotion: string }[]
}

export const insightsAPI = {
  get: async (): Promise<InsightData> => {
    if (!IS_LIVE_MODE) return INSIGHTS_DATA as InsightData
    return request<InsightData>('/insights/summary')
  },
}

// ── WELLNESS ──────────────────────────────────────────────────────────────────
export const wellnessAPI = {
  dashboard: async () => {
    if (!IS_LIVE_MODE) return DASHBOARD_STATS
    return request<any>('/analytics/dashboard')
  },
  actions: async () => {
    if (!IS_LIVE_MODE) return WELLNESS_ACTIONS
    return request<any>('/wellness/actions')
  },
}

// ── ASSESSMENT ────────────────────────────────────────────────────────────────
export interface AssessmentPayload { type: string; answers: Record<string, number> }
export const assessmentAPI = {
  submit: async (data: AssessmentPayload) => {
    if (!IS_LIVE_MODE) return ASSESSMENT_RESULT
    return request<any>('/clinical/submit', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
}

// ── GAMES ─────────────────────────────────────────────────────────────────────
export interface GameScorePayload {
  game_name: string
  score: number
  mood_impact: number
}

export interface GameRecommendation {
  id: string
  name: string
  description: string
  benefit: string
}

export const gamesAPI = {
  saveScore: async (data: GameScorePayload) => {
    if (!IS_LIVE_MODE) return GAME_SCORE_RESULT
    return request<any>('/games/score', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
  getRecommendations: async () => {
    if (!IS_LIVE_MODE) return GAME_RECOMMENDATIONS
    return request<GameRecommendation[]>('/games/recommendations')
  },
}

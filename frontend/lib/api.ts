/**
 * MindfulAI — Centralized API Service Layer
 * Used by BOTH web (Next.js) and can be ported to mobile
 * All backend calls go through this single module.
 */

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1'

// ── Token helpers ──────────────────────────────────────────────────────────────
export const getToken = () =>
  (typeof window !== 'undefined' ? localStorage.getItem('mindful_token') : null) ?? ''

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`,
})

// ── Generic fetch helpers ──────────────────────────────────────────────────────
async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { ...authHeaders(), ...(init?.headers ?? {}) },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(err?.detail ?? `Request failed: ${res.status}`)
  }
  return res.json()
}

const get  = <T>(path: string) => api<T>(path)
const post = <T>(path: string, body: unknown) =>
  api<T>(path, { method: 'POST', body: JSON.stringify(body) })

// ── AUTH ───────────────────────────────────────────────────────────────────────
export interface AuthResponse {
  access_token: string
  token: string
  user_id: string
  user: { username: string; email: string; full_name: string | null }
}

export const authAPI = {
  register: (data: { username: string; email: string; password: string }) =>
    post<AuthResponse>('/auth/signup', data),
  login: (data: { email: string; password: string }) =>
    post<AuthResponse>('/auth/login', data),
  me: () => get<AuthResponse['user']>('/auth/me'),
}

// ── CHAT (streaming) ──────────────────────────────────────────────────────────
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

export async function* streamChat(
  message: string,
  history: { role: string; content: string }[],
  biometrics?: Record<string, unknown> | null,
  signal?: AbortSignal
): AsyncGenerator<ChatChunk> {
  const res = await fetch(`${BASE}/chat`, {
    method: 'POST',
    headers: authHeaders(),
    signal,
    body: JSON.stringify({ message, history, biometrics }),
  })

  if (!res.body) throw new Error('No response body')
  const reader  = res.body.getReader()
  const decoder = new TextDecoder()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    const chunk = decoder.decode(value, { stream: true })
    for (const line of chunk.split('\n')) {
      if (line.startsWith('data: ')) {
        try { yield JSON.parse(line.slice(6)) as ChatChunk } catch {}
      }
    }
  }
}

// ── MOOD ───────────────────────────────────────────────────────────────────────
export interface MoodLog {
  score: number         // 1-10
  energy: number        // 1-10
  sleep_hours: number
  notes?: string
}
export interface MoodEntry extends MoodLog {
  id: string
  user_id: string
  created_at: string
}

export const moodAPI = {
  log:    (data: MoodLog) => post<{ success: boolean; id: string }>('/mood', data),
  recent: ()              => get<MoodEntry[]>('/mood?limit=14'),
}

// ── JOURNAL ────────────────────────────────────────────────────────────────────
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
  create:  (data: JournalEntry) => post<{ id: string }>('/journal', data),
  list:    ()                   => get<JournalRecord[]>('/journal'),
}

// ── INSIGHTS ───────────────────────────────────────────────────────────────────
export interface InsightData {
  weekly_summary:   { avg_mood: number; trend: string; dominant_emotion: string }
  emotion_breakdown: { emotion: string; count: number; percentage: number }[]
  risk_assessment:  { level: string; confidence: number }
  recommendations:  string[]
  mood_history:     { date: string; score: number; emotion: string }[]
}

export const insightsAPI = {
  get: () => get<InsightData>('/insights'),
}

// ── WELLNESS ───────────────────────────────────────────────────────────────────
export const wellnessAPI = {
  dashboard: () => get<{ wellness_score: number; active_sessions: number; last_emotion: string }>('/dashboard/stats'),
  actions:   () => get<{ actions: { id: string; title: string; completed: boolean }[] }>('/wellness/actions'),
}

// ── ASSESSMENT ────────────────────────────────────────────────────────────────
export interface AssessmentPayload { type: string; answers: Record<string, number> }
export const assessmentAPI = {
  submit: (data: AssessmentPayload) => post<{ score: number; level: string; feedback: string }>('/assessments', data),
}

// ── GAMES ──────────────────────────────────────────────────────────────────────
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
  saveScore: (data: GameScorePayload) => post<{ status: string; message: string }>('/games/score', data),
  getRecommendations: () => get<{ recommended_games: GameRecommendation[] }>('/games/recommendations'),
}


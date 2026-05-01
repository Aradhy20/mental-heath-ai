/**
 * MindfulAI — Zustand Auth Store
 * Persists JWT + user profile across page reloads.
 */
'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authAPI, type AuthResponse } from './api'

interface User {
  user_id: string
  username: string
  email: string
  full_name: string | null
}

interface AuthState {
  token:    string | null
  user:     User | null
  isAuthed: boolean
  login:    (email: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  logout:   () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token:    null,
      user:     null,
      isAuthed: false,

      login: async (email, password) => {
        const data = await authAPI.login({ email, password })
        const token = data.access_token || data.token
        if (typeof window !== 'undefined') {
          localStorage.setItem('mindful_token', token)
          document.cookie = `mindful_token=${token}; path=/; max-age=86400; SameSite=Strict`
        }
        set({ token, user: { user_id: data.user_id, ...data.user }, isAuthed: true })
      },

      register: async (username, email, password) => {
        const data = await authAPI.register({ username, email, password })
        const token = data.access_token || data.token
        if (typeof window !== 'undefined') {
          localStorage.setItem('mindful_token', token)
          document.cookie = `mindful_token=${token}; path=/; max-age=86400; SameSite=Strict`
        }
        set({ token, user: { user_id: data.user_id, ...data.user }, isAuthed: true })
      },

      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('mindful_token')
          document.cookie = 'mindful_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
        }
        set({ token: null, user: null, isAuthed: false })
      },
    }),
    {
      name:    'mindful-auth',
      partialize: (s) => ({ token: s.token, user: s.user, isAuthed: s.isAuthed }),
    }
  )
)

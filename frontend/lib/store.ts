/**
 * MindfulAI — Zustand Auth Store
 * Orchestrates user sessions and coordinates with the clinical backend.
 */
'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authAPI } from './api'
import { DEMO_USER, DEMO_TOKEN } from './static-data'

interface User {
  user_id: string
  username: string
  email: string
  full_name: string | null
  avatar?: string
  role?: string
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

      login: async (email: string, password: string) => {
        try {
          const res = await authAPI.login({ email, password })
          const token = res.access_token || res.token || DEMO_TOKEN
          const user = res.user ? { ...res.user, user_id: res.user_id } : DEMO_USER
          
          if (typeof window !== 'undefined') {
            localStorage.setItem('mindful_token', token)
            document.cookie = `mindful_token=${token}; path=/; max-age=86400; SameSite=Strict`
          }
          set({ token, user, isAuthed: true })
        } catch (err) {
          console.error("Login failed:", err)
          throw err
        }
      },

      register: async (username: string, email: string, password: string) => {
        try {
          const res = await authAPI.register({ username, email, password })
          const token = res.access_token || res.token || DEMO_TOKEN
          const user = res.user ? { ...res.user, user_id: res.user_id } : DEMO_USER

          if (typeof window !== 'undefined') {
            localStorage.setItem('mindful_token', token)
            document.cookie = `mindful_token=${token}; path=/; max-age=86400; SameSite=Strict`
          }
          set({ token, user, isAuthed: true })
        } catch (err) {
          console.error("Registration failed:", err)
          throw err
        }
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

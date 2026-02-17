import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UserState {
  user: any | null
  token: string | null
  isAuthenticated: boolean
  setUser: (user: any) => void
  setToken: (token: string) => void
  logout: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: true }),
      setToken: (token) => set({ token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'user-storage',
    }
  )
)

interface MoodData {
  date: string
  mood: number
  emotion: string
}

interface MoodState {
  moodHistory: MoodData[]
  addMoodEntry: (entry: MoodData) => void
  setMoodHistory: (history: MoodData[]) => void
}

export const useMoodStore = create<MoodState>()((set) => ({
  moodHistory: [],
  addMoodEntry: (entry) => set((state) => ({ 
    moodHistory: [...state.moodHistory, entry] 
  })),
  setMoodHistory: (history) => set({ moodHistory: history }),
}))
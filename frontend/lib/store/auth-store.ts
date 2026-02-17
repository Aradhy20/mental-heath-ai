import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
    user_id: string
    username: string
    email: string
    name?: string
    full_name?: string
    gender?: 'male' | 'female' | 'other'
    voice_preference?: 'male' | 'female'
    language_preference?: string
}

interface AuthState {
    user: User | null
    token: string | null
    isAuthenticated: boolean
    login: (user: User, token: string) => void
    logout: () => void
    updateUser: (userUpdates: Partial<User>) => void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            login: (user, token) => set({ user, token, isAuthenticated: true }),
            logout: () => set({ user: null, token: null, isAuthenticated: false }),
            updateUser: (userUpdates) => set((state) => ({
                user: state.user ? { ...state.user, ...userUpdates } : null
            })),
        }),
        {
            name: 'auth-storage',
        }
    )
)

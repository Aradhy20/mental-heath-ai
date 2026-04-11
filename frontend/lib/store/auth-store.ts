import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

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
            login: (user, token) => {
                // Also write to localStorage directly for non-Zustand consumers (e.g., cookie)
                if (typeof window !== 'undefined') {
                    localStorage.setItem('calmspace_token', token)
                    localStorage.setItem('calmspace_user', JSON.stringify(user))
                }
                set({ user, token, isAuthenticated: true })
            },
            logout: () => {
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('calmspace_token')
                    localStorage.removeItem('calmspace_user')
                    document.cookie = 'token=; path=/; max-age=0'
                }
                set({ user: null, token: null, isAuthenticated: false })
            },
            updateUser: (userUpdates) => set((state) => ({
                user: state.user ? { ...state.user, ...userUpdates } : null
            })),
        }),
        {
            name: 'auth-storage',               // stored as 'auth-storage' in localStorage
            storage: createJSONStorage(() => localStorage),
            // Rehydrate both user and token from persisted storage on app load
            partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
        }
    )
)

// ── Helper to get token from anywhere (Zustand store → localStorage → cookie) ─
export function getStoredToken(): string | null {
    // 1. Zustand store (in-memory after hydration)
    const storeToken = useAuthStore.getState().token
    if (storeToken) return storeToken

    // 2. Direct localStorage fallback (before Zustand hydrates on SSR)
    if (typeof window !== 'undefined') {
        const lsToken = localStorage.getItem('calmspace_token')
        if (lsToken) return lsToken

        // 3. Cookie fallback
        const cookieToken = document.cookie
            .split('; ')
            .find(r => r.startsWith('token='))
            ?.split('=')[1]
        if (cookieToken) return cookieToken
    }
    return null
}

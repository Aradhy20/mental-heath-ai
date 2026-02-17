'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuthStore } from '@/lib/store/auth-store'

export const useVoiceAssistant = () => {
    const user = useAuthStore((state) => state.user)
    const updateUser = useAuthStore((state) => state.updateUser)
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
    const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null)

    const loadVoices = useCallback(() => {
        const availableVoices = window.speechSynthesis.getVoices()
        if (availableVoices.length === 0) return

        setVoices(availableVoices)

        // Auto-select based on user gender if not set
        if (user && !user.voice_preference) {
            const userName = (user.full_name || user.name || user.username || '').toLowerCase()

            // Refined gender detection from specific names
            const isBoy = userName.includes('aradhy') ||
                userName.includes('aradi') ||
                user.gender === 'male'

            const isGirl = userName.includes('parinidhi') ||
                userName.includes('pari') ||
                user.gender === 'female'

            const suggestedGender = isBoy ? 'female' : (isGirl ? 'male' : 'female')

            // Find a polite/sweet voice
            const preferredVoice = availableVoices.find(v => {
                const name = v.name.toLowerCase()
                if (suggestedGender === 'female') {
                    return name.includes('google uk english female') ||
                        name.includes('samantha') ||
                        name.includes('zira') ||
                        (name.includes('female') && name.includes('english'))
                } else {
                    return name.includes('google uk english male') ||
                        name.includes('david') ||
                        name.includes('google us english male') ||
                        (name.includes('male') && name.includes('english'))
                }
            })

            if (preferredVoice) {
                setSelectedVoice(preferredVoice)
                updateUser({
                    voice_preference: suggestedGender as 'male' | 'female',
                    gender: isBoy ? 'male' : (isGirl ? 'female' : 'other')
                })
            }
        } else if (user?.voice_preference) {
            const voice = availableVoices.find(v => {
                const name = v.name.toLowerCase()
                if (user.voice_preference === 'female') {
                    return name.includes('google uk english female') || name.includes('samantha') || name.includes('zira')
                } else {
                    return name.includes('google uk english male') || name.includes('david')
                }
            })
            if (voice) setSelectedVoice(voice)
        }
    }, [user, updateUser])

    useEffect(() => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            window.speechSynthesis.onvoiceschanged = loadVoices
            loadVoices()
        }
    }, [loadVoices])

    const speak = useCallback((text: string, lang = 'en-US') => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel()
            const utterance = new SpeechSynthesisUtterance(text)
            utterance.voice = selectedVoice
            utterance.lang = lang
            utterance.pitch = user?.voice_preference === 'female' ? 1.2 : 0.9 // Sweeter/Polite pitch
            utterance.rate = 0.9 // Slightly slower for politeness
            window.speechSynthesis.speak(utterance)
        }
    }, [selectedVoice, user?.voice_preference])

    return { speak, voices, selectedVoice, setSelectedVoice }
}

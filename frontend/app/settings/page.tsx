'use client'

import React, { useState, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Settings as SettingsIcon, Bell, User, Moon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { fadeIn, slideInRight } from '@/lib/animations/presets'
import ThemeToggle from '@/components/anti-gravity/ThemeToggle'
import { useAuthStore } from '@/lib/store/auth-store'

const FloatingCard = memo(({ children, className = '' }: any) => (
    <div className={`glass-panel rounded-3xl p-6 ${className}`}>
        {children}
    </div>
))
FloatingCard.displayName = 'FloatingCard'

type SettingsTab = 'general' | 'notifications' | 'account'

export default function FastSettings() {
    const router = useRouter()
    const logout = useAuthStore((state) => state.logout)
    const [activeTab, setActiveTab] = useState<SettingsTab>('general')

    const handleLogout = () => {
        logout()
        router.push('/login')
    }

    const tabs = [
        { id: 'general' as SettingsTab, label: 'General', icon: SettingsIcon },
        { id: 'notifications' as SettingsTab, label: 'Notifications', icon: Bell },
        { id: 'account' as SettingsTab, label: 'Account', icon: User },
    ]

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <motion.div {...fadeIn}>
                <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Settings
                </h1>
                <p className="text-muted-foreground">Customize your experience</p>
            </motion.div>

            {/* Fast Tab Switcher */}
            <div className="flex gap-2 p-1 bg-white/50 dark:bg-black/20 rounded-2xl">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 px-4 py-3 rounded-xl font-medium transition-fast flex items-center justify-center gap-2 ${activeTab === tab.id
                                ? 'bg-white dark:bg-white/10 shadow-sm'
                                : 'hover:bg-white/50 dark:hover:bg-white/5'
                            }`}
                    >
                        <tab.icon size={18} />
                        <span className="hidden md:inline">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Tab Content - No AnimatePresence for better performance */}
            <div>
                {activeTab === 'general' && (
                    <motion.div {...slideInRight} className="space-y-4">
                        <FloatingCard>
                            <h3 className="text-lg font-bold mb-4">Appearance</h3>
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-black/5 dark:bg-white/5">
                                <div className="flex items-center gap-3">
                                    <Moon size={20} />
                                    <div>
                                        <p className="font-medium">Theme</p>
                                        <p className="text-xs text-muted-foreground">Light or Dark mode</p>
                                    </div>
                                </div>
                                <ThemeToggle />
                            </div>
                        </FloatingCard>
                    </motion.div>
                )}

                {activeTab === 'notifications' && (
                    <motion.div {...slideInRight} className="space-y-4">
                        <FloatingCard>
                            <h3 className="text-lg font-bold mb-4">Notifications</h3>
                            <p className="text-muted-foreground">
                                Manage your notification preferences in the dedicated Notifications & Devices tab above.
                            </p>
                        </FloatingCard>
                    </motion.div>
                )}

                {activeTab === 'account' && (
                    <motion.div {...slideInRight} className="space-y-4">
                        <FloatingCard className="border-red-500/20 bg-red-500/5">
                            <h3 className="text-lg font-bold mb-4 text-red-600">Danger Zone</h3>
                            <button
                                onClick={handleLogout}
                                className="w-full p-4 rounded-2xl bg-red-500/10 hover:bg-red-500/20 transition-fast text-red-600 font-medium"
                            >
                                Log Out
                            </button>
                        </FloatingCard>
                    </motion.div>
                )}
            </div>
        </div>
    )
}

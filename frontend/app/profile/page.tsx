'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Calendar, MapPin, Award, Activity, Star, Edit3, Save, X, BookOpen, Smile, Wind } from 'lucide-react'
import FloatingCard from '@/components/anti-gravity/FloatingCard'
import { useAuthStore } from '@/lib/store/auth-store'
import AnimatedButton from '@/components/animations/AnimatedButton'

export default function ProfilePage() {
    const user = useAuthStore((state) => state.user)
    const [isEditing, setIsEditing] = useState(false)

    // In a real app, these stats would come from an API
    const [stats] = useState([
        { label: 'Streak', value: '12 Days', icon: Activity, color: 'text-amber-500', bg: 'bg-amber-500/10' },
        { label: 'Journal Entries', value: '45', icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { label: 'Mood Logged', value: '128', icon: Smile, color: 'text-green-500', bg: 'bg-green-500/10' },
        { label: 'Meditation', value: '4.5 hrs', icon: Wind, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    ])

    const [formData, setFormData] = useState({
        full_name: user?.full_name || 'Alex Doe',
        bio: 'Mindfulness enthusiast. Working on finding balance in a chaotic world.',
        location: 'New York, USA',
        goals: ['Meditate daily', 'Drink more water', 'Sleep 8 hours']
    })

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                full_name: user.full_name || prev.full_name,
            }))
        }
    }, [user])

    const handleSave = () => {
        setIsEditing(false)
        // Here you would call an API to update the profile
    }

    return (
        <div className="space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-4xl font-display font-bold">My Profile</h1>
                    <p className="text-muted-foreground mt-2">Manage your personal information and preferences.</p>
                </div>
                <AnimatedButton
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                    variant={isEditing ? 'primary' : 'outline'}
                    icon={isEditing ? <Save size={18} /> : <Edit3 size={18} />}
                >
                    {isEditing ? 'Save Changes' : 'Edit Profile'}
                </AnimatedButton>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Left Column: User Card */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="md:col-span-4 space-y-6"
                >
                    <FloatingCard className="text-center p-8">
                        <div className="relative w-32 h-32 mx-auto mb-6">
                            <div className="w-full h-full rounded-full bg-gradient-to-br from-serenity-400 to-serenity-600 flex items-center justify-center text-4xl font-bold text-white shadow-lg overflow-hidden">
                                {formData.full_name.charAt(0)}
                            </div>
                            <div className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 border-4 border-white dark:border-gray-900 rounded-full" title="Online" />
                        </div>

                        {isEditing ? (
                            <input
                                value={formData.full_name}
                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                className="text-2xl font-bold text-center w-full bg-transparent border-b border-serenity-300 focus:outline-none mb-2"
                            />
                        ) : (
                            <h2 className="text-2xl font-bold mb-1">{formData.full_name}</h2>
                        )}

                        <p className="text-muted-foreground mb-6">@{user?.username || 'user'}</p>

                        <div className="space-y-4 text-left">
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <Mail size={16} />
                                <span>{user?.email || 'email@example.com'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <Calendar size={16} />
                                <span>Joined December 2025</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <MapPin size={16} />
                                {isEditing ? (
                                    <input
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        className="bg-transparent border-b border-serenity-300 focus:outline-none flex-1"
                                    />
                                ) : (
                                    <span>{formData.location}</span>
                                )}
                            </div>
                        </div>
                    </FloatingCard>

                    <FloatingCard>
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <Award className="text-yellow-500" size={20} />
                            Achievements
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {['Early Bird', 'Consistency King', 'Zen Master', 'Journalist'].map((badge, i) => (
                                <span key={i} className="px-3 py-1 rounded-full bg-serenity-100 dark:bg-aurora-500/20 text-xs font-medium text-serenity-700 dark:text-aurora-300 border border-serenity-200 dark:border-aurora-500/30">
                                    {badge}
                                </span>
                            ))}
                        </div>
                    </FloatingCard>
                </motion.div>

                {/* Right Column: Stats & Bio */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="md:col-span-8 space-y-6"
                >
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {stats.map((stat, i) => (
                            <FloatingCard key={i} className="p-4 flex flex-col items-center justify-center text-center">
                                <div className={`w-10 h-10 rounded-full ${stat.bg} ${stat.color} flex items-center justify-center mb-3`}>
                                    <stat.icon size={20} />
                                </div>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <div className="text-xs text-muted-foreground">{stat.label}</div>
                            </FloatingCard>
                        ))}
                    </div>

                    {/* Bio Section */}
                    <FloatingCard>
                        <h3 className="text-lg font-semibold mb-4">About Me</h3>
                        {isEditing ? (
                            <textarea
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                rows={4}
                                className="w-full p-3 rounded-xl border bg-white/50 dark:bg-black/20 focus:ring-2 focus:ring-serenity-400 outline-none resize-none"
                            />
                        ) : (
                            <p className="text-muted-foreground leading-relaxed">
                                {formData.bio}
                            </p>
                        )}
                    </FloatingCard>

                    {/* Goals Section */}
                    <FloatingCard>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Current Goals</h3>
                            {isEditing && (
                                <button className="text-sm text-serenity-600 font-medium hover:underline">
                                    + Add Goal
                                </button>
                            )}
                        </div>
                        <div className="space-y-3">
                            {formData.goals.map((goal, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/50 dark:bg-white/5 border border-white/20">
                                    <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-green-500' : 'bg-serenity-400'}`} />
                                    <span className="flex-1">{goal}</span>
                                    {isEditing && (
                                        <button className="text-muted-foreground hover:text-red-500">
                                            <X size={16} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </FloatingCard>
                </motion.div>
            </div>
        </div>
    )
}

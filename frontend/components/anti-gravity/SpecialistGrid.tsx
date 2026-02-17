'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Star, Phone, ShieldCheck, AlertCircle, CheckCircle } from 'lucide-react'
import FloatingCard from './FloatingCard'
import { doctorsAPI } from '@/lib/api'

interface Doctor {
    doctor_id?: number
    id?: number
    name: string
    specialization?: string
    specialty?: string
    address: string
    rating?: number
    contact?: string
    distance?: number
}

export default function SpecialistGrid() {
    const [doctors, setDoctors] = useState<Doctor[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [locating, setLocating] = useState(false)
    const [userLocation, setUserLocation] = useState<{ lat: number, lon: number } | null>(null)
    const [locationError, setLocationError] = useState<string | null>(null)
    const [permissionStatus, setPermissionStatus] = useState<'prompt' | 'granted' | 'denied' | null>(null)

    // Check permission status on mount
    useEffect(() => {
        if ('permissions' in navigator) {
            navigator.permissions.query({ name: 'geolocation' as PermissionName }).then((result) => {
                setPermissionStatus(result.state as 'prompt' | 'granted' | 'denied')

                result.addEventListener('change', () => {
                    setPermissionStatus(result.state as 'prompt' | 'granted' | 'denied')
                })
            }).catch(() => {
                console.log('Permission API not supported')
            })
        }
    }, [])

    const findNearby = async () => {
        setLocating(true)
        setLocationError(null)

        if (!navigator.geolocation) {
            setLocationError('❌ Geolocation not supported. Use Chrome, Firefox, or Safari.')
            setLocating(false)
            return
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude, accuracy } = position.coords
                setUserLocation({ lat: latitude, lon: longitude })

                console.log(`📍 Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)} (±${Math.round(accuracy)}m)`)

                try {
                    const response = await doctorsAPI.getNearby(latitude, longitude)

                    if (response.data) {
                        const nearbyDocs = response.data
                        if (nearbyDocs.length > 0) {
                            setDoctors(nearbyDocs.slice(0, 3))
                            setLocationError(`✅ Found ${nearbyDocs.length} nearby specialists`)
                        } else {
                            setLocationError('ℹ️ No specialists found nearby')
                        }
                    } else {
                        setLocationError('⚠️ Unable to fetch doctors')
                    }
                } catch (error: any) {
                    console.error('Failed to find nearby doctors:', error)
                    if (error.response?.status === 401) {
                        setLocationError('⚠️ Please login to find nearby doctors')
                    } else {
                        setLocationError('⚠️ Network error')
                    }
                } finally {
                    setLocating(false)
                }
            },
            (error) => {
                setLocating(false)

                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        setLocationError('🔒 Location permission denied. Enable in browser settings.')
                        setPermissionStatus('denied')
                        break
                    case error.POSITION_UNAVAILABLE:
                        setLocationError('📡 Location unavailable. Check device settings.')
                        break
                    case error.TIMEOUT:
                        setLocationError('⏱️ Request timed out. Try again.')
                        break
                    default:
                        setLocationError('❌ Unknown error occurred.')
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000
            }
        )
    }

    useEffect(() => {
        setIsLoading(false)
    }, [])

    if (isLoading) return <div className="h-48 animate-pulse bg-black/5 rounded-3xl" />

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <ShieldCheck size={20} className="text-serenity-600" />
                    Trusted Specialists
                </h3>
                <button
                    onClick={findNearby}
                    disabled={locating}
                    className="text-xs font-bold text-serenity-600 uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all disabled:opacity-50"
                >
                    {locating ? 'Locating...' : 'Find Nearby'} <MapPin size={14} />
                </button>
            </div>

            <AnimatePresence>
                {locationError && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`p-4 rounded-2xl flex items-center gap-3 ${locationError.includes('✅')
                            ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                            : locationError.includes('🔒') || locationError.includes('❌')
                                ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                                : 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                            }`}
                    >
                        {locationError.includes('✅') ? (
                            <CheckCircle size={20} />
                        ) : (
                            <AlertCircle size={20} />
                        )}
                        <span className="text-sm font-medium">{locationError}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {permissionStatus === 'denied' && !locating && (
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl">
                    <p className="text-sm font-bold text-amber-800 dark:text-amber-400 mb-2">
                        📍 Enable Location Access
                    </p>
                    <p className="text-xs text-amber-700 dark:text-amber-300">
                        Click the 🔒 icon in your browser's address bar and allow location access to find nearby specialists.
                    </p>
                </div>
            )}

            {doctors.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {doctors.map((doctor, i) => (
                        <FloatingCard key={doctor.doctor_id || doctor.id || i} delay={i * 0.1} className="group hover:bg-white dark:hover:bg-white/5 transition-all">
                            <div className="flex flex-col h-full">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 rounded-2xl bg-serenity-500/10 flex items-center justify-center text-serenity-600">
                                        <Star size={24} fill={doctor.rating && doctor.rating > 4.5 ? "currentColor" : "none"} />
                                    </div>
                                    <div className="flex items-center gap-1 text-sm font-bold bg-amber-500/10 text-amber-600 px-2 py-1 rounded-lg">
                                        <Star size={12} fill="currentColor" />
                                        {doctor.rating || 'N/A'}
                                    </div>
                                </div>

                                <h4 className="font-bold text-lg group-hover:text-serenity-600 transition-colors truncate">
                                    {doctor.name}
                                </h4>
                                <p className="text-xs text-serenity-600 font-bold uppercase tracking-tighter mb-4">
                                    {doctor.specialization || doctor.specialty}
                                </p>

                                <div className="space-y-2 mt-auto">
                                    <div className="flex items-start gap-2 text-xs text-muted-foreground">
                                        <MapPin size={14} className="shrink-0 mt-0.5" />
                                        <span className="line-clamp-1">{doctor.address}</span>
                                    </div>
                                    {doctor.distance && (
                                        <div className="flex items-center gap-2 text-xs font-bold text-serenity-600">
                                            <MapPin size={14} />
                                            {doctor.distance.toFixed(1)} km away
                                        </div>
                                    )}
                                    {doctor.contact && (
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Phone size={14} className="shrink-0" />
                                            <span>{doctor.contact}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </FloatingCard>
                    ))}
                </div>
            )}
        </div>
    )
}

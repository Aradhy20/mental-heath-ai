'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Bell, BellOff, Smartphone, Watch, Bluetooth, Battery, Check, X, Zap } from 'lucide-react'
import FloatingCard from '@/components/anti-gravity/FloatingCard'
import { useNotifications } from '@/lib/hooks/useNotifications'
import { useDeviceConnection } from '@/lib/hooks/useDeviceConnection'

export default function NotificationSettings() {
    const {
        permission,
        isSupported,
        requestPermission,
        sendNotification
    } = useNotifications()

    const {
        devices,
        isScanning,
        bluetoothSupported,
        connectDevice,
        disconnectDevice,
        syncDeviceData
    } = useDeviceConnection()

    const [notificationPreferences, setNotificationPreferences] = useState({
        dailyReminders: true,
        moodCheckIns: true,
        meditationAlerts: true,
        journalPrompts: true,
        achievementUnlocks: true,
        weeklyReports: true
    })

    const handleEnableNotifications = async () => {
        const result = await requestPermission()
        if (result === 'granted') {
            await sendNotification({
                title: '🎉 Notifications Enabled!',
                body: 'You\'ll now receive wellness reminders and insights.',
                requireInteraction: false
            })
        }
    }

    const handleConnectDevice = async () => {
        try {
            const device = await connectDevice()
            if (device) {
                await sendNotification({
                    title: '📱 Device Connected',
                    body: `${device.name} is now synced with your mental health app.`,
                })
            }
        } catch (error: any) {
            console.error('Failed to connect device:', error)
            alert(`Connection failed: ${error.message || 'Unknown error'}. Please ensure your device's Bluetooth is turned on and discoverable.`)
        }
    }

    const handleSyncDevice = async (deviceId: string) => {
        try {
            const data = await syncDeviceData(deviceId)
            await sendNotification({
                title: '✅ Sync Complete',
                body: `Heart rate: ${data.heartRate} bpm | Steps: ${data.steps}`,
            })
        } catch (error) {
            console.error('Sync failed:', error)
            alert('Failed to sync data. Please check device connection.')
        }
    }

    const togglePreference = (key: keyof typeof notificationPreferences) => {
        setNotificationPreferences(prev => ({
            ...prev,
            [key]: !prev[key]
        }))
    }

    return (
        <div className="space-y-8">
            {/* Notification Permission Card */}
            <FloatingCard>
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl ${permission === 'granted' ? 'bg-green-500/10 text-green-600' : 'bg-amber-500/10 text-amber-600'}`}>
                            {permission === 'granted' ? <Bell size={24} /> : <BellOff size={24} />}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">Push Notifications</h3>
                            <p className="text-sm text-muted-foreground">
                                {permission === 'granted'
                                    ? 'Enabled - You\'ll receive wellness reminders'
                                    : 'Enable notifications to stay connected with your mental health journey'}
                            </p>
                        </div>
                    </div>
                    {permission !== 'granted' && isSupported && (
                        <button
                            onClick={handleEnableNotifications}
                            className="px-6 py-3 bg-serenity-500 text-white rounded-xl font-medium hover:bg-serenity-600 transition-colors shadow-lg"
                        >
                            Enable Notifications
                        </button>
                    )}
                </div>

                {permission === 'granted' && (
                    <div className="space-y-3 pt-6 border-t border-black/5 dark:border-white/5">
                        <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">Notification Preferences</h4>
                        {Object.entries(notificationPreferences).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between p-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                                <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                <button
                                    onClick={() => togglePreference(key as keyof typeof notificationPreferences)}
                                    className={`w-12 h-6 rounded-full transition-colors ${value ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                                >
                                    <motion.div
                                        className="w-5 h-5 bg-white rounded-full shadow-md"
                                        animate={{ x: value ? 24 : 2 }}
                                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                    />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </FloatingCard>

            {/* Device Connection Card */}
            <FloatingCard>
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-600 font-bold">
                            <Bluetooth size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">Connected Devices</h3>
                            <p className="text-sm text-muted-foreground">
                                Sync your smartwatch or mobile device for real-time health tracking
                            </p>
                        </div>
                    </div>
                    {bluetoothSupported && (
                        <button
                            onClick={handleConnectDevice}
                            disabled={isScanning}
                            className="px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isScanning ? (
                                <>
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                                    >
                                        <Bluetooth size={18} />
                                    </motion.div>
                                    Scanning...
                                </>
                            ) : (
                                <>
                                    <Bluetooth size={18} />
                                    Connect Device
                                </>
                            )}
                        </button>
                    )}
                </div>

                {!bluetoothSupported && (
                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-sm">
                        <p className="font-medium">Bluetooth not supported or disabled</p>
                        <p className="text-xs mt-1">Please ensure you are using a modern browser (Chrome/Edge) and your laptop's Bluetooth hardware is enabled.</p>
                    </div>
                )}

                <div className="mt-4 p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-dashed border-black/10 dark:border-white/10 text-xs text-muted-foreground">
                    <h5 className="font-bold uppercase mb-2">Connection Guide</h5>
                    <ul className="list-disc pl-4 space-y-1">
                        <li>Make sure Bluetooth is enabled on your laptop and your target device</li>
                        <li>Set your device (smartwatch/phone) to "Discoverable" or "Pairing Mode"</li>
                        <li>Browser security requires a user click to search for devices</li>
                        <li>If your device doesn't appear, try restarting your browser's Bluetooth or resetting the device's pairing</li>
                    </ul>
                </div>

                {devices.length > 0 && (
                    <div className="space-y-4 pt-6 border-t border-black/5 dark:border-white/5">
                        {devices.map((device) => (
                            <motion.div
                                key={device.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 rounded-xl bg-white/50 dark:bg-white/5 border border-black/5 dark:border-white/10"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-xl ${device.connected ? 'bg-green-500/10 text-green-600' : 'bg-gray-500/10 text-gray-600'}`}>
                                            {device.type === 'smartwatch' ? <Watch size={20} /> : <Smartphone size={20} />}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold">{device.name}</h4>
                                            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                                                <span className="flex items-center gap-1">
                                                    {device.connected ? (
                                                        <>
                                                            <Check size={12} className="text-green-500" />
                                                            Connected
                                                        </>
                                                    ) : (
                                                        <>
                                                            <X size={12} className="text-red-500" />
                                                            Disconnected
                                                        </>
                                                    )}
                                                </span>
                                                {device.batteryLevel && (
                                                    <span className="flex items-center gap-1">
                                                        <Battery size={12} />
                                                        {device.batteryLevel}%
                                                    </span>
                                                )}
                                                {device.lastSync && (
                                                    <span>
                                                        Last sync: {new Date(device.lastSync).toLocaleTimeString()}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        {device.connected && (
                                            <button
                                                onClick={() => handleSyncDevice(device.id)}
                                                className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors flex items-center gap-2"
                                            >
                                                <Zap size={14} />
                                                Sync Now
                                            </button>
                                        )}
                                        <button
                                            onClick={() => disconnectDevice(device.id)}
                                            className="px-4 py-2 bg-red-500/10 text-red-600 rounded-lg text-sm font-medium hover:bg-red-500/20 transition-colors"
                                        >
                                            Disconnect
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </FloatingCard>

            {/* Test Notification Button */}
            {permission === 'granted' && (
                <FloatingCard className="bg-gradient-to-br from-purple-500/10 to-transparent">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-bold">Test Your Notifications</h4>
                            <p className="text-sm text-muted-foreground">Send a sample notification to verify everything works</p>
                        </div>
                        <button
                            onClick={() => sendNotification({
                                title: '🧘 Mindfulness Reminder',
                                body: 'Time for your 5-minute breathing exercise. Take a moment to center yourself.',
                                requireInteraction: false
                            })}
                            className="px-6 py-3 bg-purple-500 text-white rounded-xl font-medium hover:bg-purple-600 transition-colors shadow-lg"
                        >
                            Send Test
                        </button>
                    </div>
                </FloatingCard>
            )}
        </div>
    )
}

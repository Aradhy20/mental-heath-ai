/**
 * Advanced Notification Hook with Permission Management
 * Handles browser notifications, push notifications, and device sync
 */

import { useState, useEffect, useCallback } from 'react'

export type NotificationPermission = 'default' | 'granted' | 'denied'

interface NotificationOptions {
    title: string
    body: string
    icon?: string
    badge?: string
    tag?: string
    requireInteraction?: boolean
    actions?: Array<{
        action: string
        title: string
        icon?: string
    }>
}

export const useNotifications = () => {
    const [permission, setPermission] = useState<NotificationPermission>('default')
    const [isSupported, setIsSupported] = useState(false)

    useEffect(() => {
        // Check if notifications are supported
        if ('Notification' in window) {
            setIsSupported(true)
            setPermission(Notification.permission as NotificationPermission)
        }
    }, [])

    const requestPermission = useCallback(async (): Promise<NotificationPermission> => {
        if (!isSupported) {
            console.warn('Notifications not supported')
            return 'denied'
        }

        try {
            const result = await Notification.requestPermission()
            setPermission(result as NotificationPermission)

            // Register service worker for push notifications
            if (result === 'granted' && 'serviceWorker' in navigator) {
                const registration = await navigator.serviceWorker.ready
                console.log('Service Worker ready for notifications:', registration)
            }

            return result as NotificationPermission
        } catch (error) {
            console.error('Error requesting notification permission:', error)
            return 'denied'
        }
    }, [isSupported])

    const sendNotification = useCallback(async (options: NotificationOptions) => {
        if (!isSupported) {
            console.warn('Notifications not supported')
            return null
        }

        if (permission !== 'granted') {
            const newPermission = await requestPermission()
            if (newPermission !== 'granted') {
                console.warn('Notification permission denied')
                return null
            }
        }

        try {
            // Use service worker if available for better reliability
            if ('serviceWorker' in navigator) {
                const registration = await navigator.serviceWorker.ready
                return await registration.showNotification(options.title, {
                    body: options.body,
                    icon: options.icon || '/icon-192x192.png',
                    badge: options.badge || '/badge-72x72.png',
                    tag: options.tag,
                    requireInteraction: options.requireInteraction,
                    actions: options.actions,
                    vibrate: [200, 100, 200], // Vibration pattern for mobile
                    data: { timestamp: Date.now() }
                })
            } else {
                // Fallback to basic notification
                return new Notification(options.title, {
                    body: options.body,
                    icon: options.icon || '/icon-192x192.png',
                    tag: options.tag,
                })
            }
        } catch (error) {
            console.error('Error sending notification:', error)
            return null
        }
    }, [isSupported, permission, requestPermission])

    const scheduleNotification = useCallback((options: NotificationOptions, delayMs: number) => {
        setTimeout(() => {
            sendNotification(options)
        }, delayMs)
    }, [sendNotification])

    return {
        permission,
        isSupported,
        requestPermission,
        sendNotification,
        scheduleNotification
    }
}

/**
 * Device Connection Hook
 * Manages Bluetooth connections to smartwatches and mobile devices
 * Supports Web Bluetooth API for cross-device synchronization
 */

import { useState, useCallback, useEffect } from 'react'

export interface ConnectedDevice {
    id: string
    name: string
    type: 'smartwatch' | 'mobile' | 'fitness-tracker' | 'unknown'
    connected: boolean
    batteryLevel?: number
    lastSync?: Date
}

export const useDeviceConnection = () => {
    const [devices, setDevices] = useState<ConnectedDevice[]>([])
    const [isScanning, setIsScanning] = useState(false)
    const [bluetoothSupported, setBluetoothSupported] = useState(false)

    useEffect(() => {
        // Check Bluetooth support
        if ('bluetooth' in navigator) {
            setBluetoothSupported(true)
        }
    }, [])

    const requestBluetoothPermission = useCallback(async () => {
        if (!bluetoothSupported) {
            throw new Error('Bluetooth not supported on this device or browser')
        }

        try {
            // Broaden search to accept any device for maximum compatibility
            const device = await navigator.bluetooth.requestDevice({
                acceptAllDevices: true,
                optionalServices: [
                    'heart_rate',
                    'battery_service',
                    'device_information',
                    'generic_access',
                    'human_interface_device'
                ]
            })

            console.log('Successfully selected device:', device.name)
            return device
        } catch (error: any) {
            if (error.name === 'NotFoundError') {
                console.warn('Bluetooth pairing cancelled by user')
                return null
            }
            console.error('Bluetooth permission error:', error)
            throw error
        }
    }, [bluetoothSupported])

    const connectDevice = useCallback(async () => {
        setIsScanning(true)

        try {
            const device = await requestBluetoothPermission()

            if (!device) {
                throw new Error('No device selected')
            }

            // Connect to GATT server
            const server = await device.gatt?.connect()

            if (!server) {
                throw new Error('Failed to connect to device')
            }

            // Determine device type based on name
            let deviceType: ConnectedDevice['type'] = 'unknown'
            const name = device.name?.toLowerCase() || ''

            if (name.includes('watch') || name.includes('fitbit') || name.includes('garmin')) {
                deviceType = 'smartwatch'
            } else if (name.includes('phone') || name.includes('mobile')) {
                deviceType = 'mobile'
            } else if (name.includes('band') || name.includes('tracker')) {
                deviceType = 'fitness-tracker'
            }

            // Try to get battery level
            let batteryLevel: number | undefined
            try {
                const batteryService = await server.getPrimaryService('battery_service')
                const batteryCharacteristic = await batteryService.getCharacteristic('battery_level')
                const value = await batteryCharacteristic.readValue()
                batteryLevel = value.getUint8(0)
            } catch (e) {
                console.log('Battery service not available')
            }

            const newDevice: ConnectedDevice = {
                id: device.id,
                name: device.name || 'Unknown Device',
                type: deviceType,
                connected: true,
                batteryLevel,
                lastSync: new Date()
            }

            setDevices(prev => {
                const filtered = prev.filter(d => d.id !== device.id)
                return [...filtered, newDevice]
            })

            // Listen for disconnection
            device.addEventListener('gattserverdisconnected', () => {
                setDevices(prev =>
                    prev.map(d =>
                        d.id === device.id
                            ? { ...d, connected: false }
                            : d
                    )
                )
            })

            return newDevice
        } catch (error) {
            console.error('Device connection error:', error)
            throw error
        } finally {
            setIsScanning(false)
        }
    }, [requestBluetoothPermission])

    const disconnectDevice = useCallback(async (deviceId: string) => {
        setDevices(prev =>
            prev.map(d =>
                d.id === deviceId
                    ? { ...d, connected: false }
                    : d
            )
        )
    }, [])

    const syncDeviceData = useCallback(async (deviceId: string) => {
        const device = devices.find(d => d.id === deviceId)
        if (!device || !device.connected) {
            throw new Error('Device not connected')
        }

        // Update last sync time
        setDevices(prev =>
            prev.map(d =>
                d.id === deviceId
                    ? { ...d, lastSync: new Date() }
                    : d
            )
        )

        // In a real implementation, this would sync health data
        return {
            heartRate: Math.floor(Math.random() * 40) + 60,
            steps: Math.floor(Math.random() * 5000) + 2000,
            calories: Math.floor(Math.random() * 500) + 1000,
            timestamp: new Date()
        }
    }, [devices])

    return {
        devices,
        isScanning,
        bluetoothSupported,
        connectDevice,
        disconnectDevice,
        syncDeviceData
    }
}

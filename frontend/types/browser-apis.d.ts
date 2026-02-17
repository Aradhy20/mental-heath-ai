// Type definitions for Web Bluetooth API and Notifications
// This file extends the TypeScript definitions for browser APIs

interface Navigator {
    bluetooth: Bluetooth
}

interface Bluetooth {
    requestDevice(options?: RequestDeviceOptions): Promise<BluetoothDevice>
    getAvailability(): Promise<boolean>
}

interface RequestDeviceOptions {
    filters?: BluetoothLEScanFilter[]
    optionalServices?: BluetoothServiceUUID[]
    acceptAllDevices?: boolean
}

interface BluetoothLEScanFilter {
    services?: BluetoothServiceUUID[]
    name?: string
    namePrefix?: string
}

type BluetoothServiceUUID = string | number

interface BluetoothDevice extends EventTarget {
    id: string
    name?: string
    gatt?: BluetoothRemoteGATTServer
    addEventListener(type: 'gattserverdisconnected', listener: (this: BluetoothDevice, ev: Event) => any): void
}

interface BluetoothRemoteGATTServer {
    device: BluetoothDevice
    connected: boolean
    connect(): Promise<BluetoothRemoteGATTServer>
    disconnect(): void
    getPrimaryService(service: BluetoothServiceUUID): Promise<BluetoothRemoteGATTService>
    getPrimaryServices(service?: BluetoothServiceUUID): Promise<BluetoothRemoteGATTService[]>
}

interface BluetoothRemoteGATTService {
    device: BluetoothDevice
    uuid: string
    isPrimary: boolean
    getCharacteristic(characteristic: BluetoothServiceUUID): Promise<BluetoothRemoteGATTCharacteristic>
    getCharacteristics(characteristic?: BluetoothServiceUUID): Promise<BluetoothRemoteGATTCharacteristic[]>
}

interface BluetoothRemoteGATTCharacteristic {
    service: BluetoothRemoteGATTService
    uuid: string
    properties: BluetoothCharacteristicProperties
    value?: DataView
    readValue(): Promise<DataView>
    writeValue(value: BufferSource): Promise<void>
    startNotifications(): Promise<BluetoothRemoteGATTCharacteristic>
    stopNotifications(): Promise<BluetoothRemoteGATTCharacteristic>
}

interface BluetoothCharacteristicProperties {
    broadcast: boolean
    read: boolean
    writeWithoutResponse: boolean
    write: boolean
    notify: boolean
    indicate: boolean
    authenticatedSignedWrites: boolean
    reliableWrite: boolean
    writableAuxiliaries: boolean
}

// Extended Notification API types
interface NotificationOptions {
    actions?: NotificationAction[]
    badge?: string
    body?: string
    data?: any
    dir?: NotificationDirection
    icon?: string
    image?: string
    lang?: string
    renotify?: boolean
    requireInteraction?: boolean
    silent?: boolean
    tag?: string
    timestamp?: number
    vibrate?: VibratePattern
}

interface NotificationAction {
    action: string
    title: string
    icon?: string
}

type VibratePattern = number | number[]

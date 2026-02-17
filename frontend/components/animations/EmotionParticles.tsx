/**
 * Emotion Particles System
 * Dynamic particle system that responds to detected emotions
 */

'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { emotionColors } from '@/lib/animations/config'

type EmotionType = 'joy' | 'calm' | 'sadness' | 'anxiety' | 'neutral'

interface Particle {
    id: number
    x: number
    y: number
    vx: number
    vy: number
    size: number
    opacity: number
    color: string
}

interface EmotionParticlesProps {
    emotion: EmotionType
    intensity?: number // 0-1
    particleCount?: number
    className?: string
}

export default function EmotionParticles({
    emotion = 'neutral',
    intensity = 0.5,
    particleCount = 30,
    className = ""
}: EmotionParticlesProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const particlesRef = useRef<Particle[]>([])
    const animationRef = useRef<number>()

    const colors = emotionColors[emotion]

    // Initialize particles based on emotion
    useEffect(() => {
        const newParticles: Particle[] = []

        for (let i = 0; i < particleCount; i++) {
            const particle = createParticle(i, emotion, colors)
            newParticles.push(particle)
        }

        particlesRef.current = newParticles
    }, [emotion, particleCount, colors])

    // Animation loop
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // Set canvas size
        const resize = () => {
            canvas.width = canvas.offsetWidth * window.devicePixelRatio
            canvas.height = canvas.offsetHeight * window.devicePixelRatio
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
        }
        resize()
        window.addEventListener('resize', resize)

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // Update particles
            particlesRef.current = particlesRef.current.map(particle => {
                return updateParticle(particle, emotion, canvas.offsetWidth, canvas.offsetHeight, intensity, colors)
            })

            // Draw particles
            particlesRef.current.forEach(particle => {
                ctx.globalAlpha = particle.opacity
                ctx.fillStyle = particle.color
                ctx.beginPath()
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
                ctx.fill()
            })

            animationRef.current = requestAnimationFrame(animate)
        }

        animate()

        return () => {
            window.removeEventListener('resize', resize)
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
        }
    }, [emotion, intensity, colors])

    return (
        <div className={`relative w-full h-full ${className}`}>
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
            />

            {/* Emotion label */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-4 left-4 px-4 py-2 rounded-full backdrop-blur-md bg-white/10 border border-white/20 text-sm font-medium capitalize z-10"
                style={{
                    background: `linear-gradient(135deg, ${colors.from}20, ${colors.to}20)`
                }}
            >
                {emotion}
            </motion.div>
        </div>
    )
}

// Particle creation based on emotion
function createParticle(id: number, emotion: EmotionType, colors: any): Particle {
    const x = Math.random() * window.innerWidth
    const y = Math.random() * window.innerHeight

    let vx = 0, vy = 0, size = 3, opacity = 0.6

    switch (emotion) {
        case 'joy':
            // Upward floating particles
            vx = (Math.random() - 0.5) * 0.5
            vy = -Math.random() * 1.5 - 0.5
            size = Math.random() * 4 + 2
            opacity = Math.random() * 0.8 + 0.2
            break
        case 'calm':
            // Gentle slow drift
            vx = (Math.random() - 0.5) * 0.3
            vy = (Math.random() - 0.5) * 0.3
            size = Math.random() * 3 + 2
            opacity = Math.random() * 0.6 + 0.2
            break
        case 'sadness':
            // Slow falling particles
            vx = (Math.random() - 0.5) * 0.3
            vy = Math.random() * 0.8 + 0.2
            size = Math.random() * 3 + 1
            opacity = Math.random() * 0.5 + 0.3
            break
        case 'anxiety':
            // Erratic quick movement
            vx = (Math.random() - 0.5) * 2
            vy = (Math.random() - 0.5) * 2
            size = Math.random() * 2 + 1
            opacity = Math.random() * 0.7 + 0.3
            break
        default:
            // Neutral - balanced movement
            vx = (Math.random() - 0.5)
            vy = (Math.random() - 0.5)
            size = Math.random() * 3 + 2
            opacity = 0.5
    }

    const color = Math.random() > 0.5 ? colors.from : colors.to

    return { id, x, y, vx, vy, size, opacity, color }
}

// Update particle position based on emotion
function updateParticle(
    particle: Particle,
    emotion: EmotionType,
    width: number,
    height: number,
    intensity: number,
    colors: any
): Particle {
    let { x, y, vx, vy, opacity } = particle

    // Apply emotion-specific behavior
    switch (emotion) {
        case 'joy':
            y += vy * intensity
            x += vx * intensity
            // Add slight wave motion
            x += Math.sin(y * 0.01) * 0.5
            break
        case 'calm':
            x += vx * intensity * 0.5
            y += vy * intensity * 0.5
            // Gentle sine wave
            x += Math.sin(Date.now() * 0.001 + particle.id) * 0.3
            y += Math.cos(Date.now() * 0.001 + particle.id) * 0.3
            break
        case 'sadness':
            y += vy * intensity * 0.7
            x += vx * intensity * 0.3
            break
        case 'anxiety':
            x += vx * intensity
            y += vy * intensity
            // Add jitter
            x += (Math.random() - 0.5) * 2 * intensity
            y += (Math.random() - 0.5) * 2 * intensity
            break
        default:
            x += vx * intensity
            y += vy * intensity
    }

    // Wrap around edges
    if (x < 0) x = width
    if (x > width) x = 0
    if (y < 0) y = height
    if (y > height) y = 0

    // Pulse opacity for anxiety
    if (emotion === 'anxiety') {
        opacity = 0.3 + Math.sin(Date.now() * 0.005) * 0.4
    }

    return { ...particle, x, y, opacity }
}

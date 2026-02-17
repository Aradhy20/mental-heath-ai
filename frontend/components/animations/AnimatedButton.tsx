/**
 * Animated Button Component
 * Premium button with micro-interactions
 */

'use client'

import React from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { hoverScale, tapEffect } from '@/lib/animations/config'

interface AnimatedButtonProps extends Omit<HTMLMotionProps<"button">, 'ref'> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'success' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    loading?: boolean
    icon?: React.ReactNode
    iconPosition?: 'left' | 'right'
    fullWidth?: boolean
    ripple?: boolean
}

export default function AnimatedButton({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    icon,
    iconPosition = 'left',
    fullWidth = false,
    ripple = true,
    className = "",
    disabled,
    onClick,
    ...props
}: AnimatedButtonProps) {
    const [ripples, setRipples] = React.useState<Array<{ x: number; y: number; id: number }>>([])

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (ripple && !disabled && !loading) {
            const button = e.currentTarget
            const rect = button.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top

            const newRipple = { x, y, id: Date.now() }
            setRipples(prev => [...prev, newRipple])

            setTimeout(() => {
                setRipples(prev => prev.filter(r => r.id !== newRipple.id))
            }, 600)
        }

        onClick?.(e)
    }

    const getVariantClass = () => {
        const variants = {
            primary: 'bg-gradient-to-r from-serenity-600 to-serenity-500 text-white hover:from-serenity-700 hover:to-serenity-600 shadow-lg shadow-serenity-500/30',
            secondary: 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-700',
            outline: 'border-2 border-serenity-500 text-serenity-600 dark:text-serenity-400 hover:bg-serenity-50 dark:hover:bg-serenity-950',
            ghost: 'text-serenity-600 dark:text-serenity-400 hover:bg-serenity-50 dark:hover:bg-serenity-950',
            success: 'bg-gradient-to-r from-green-600 to-green-500 text-white hover:from-green-700 hover:to-green-600 shadow-lg shadow-green-500/30',
            danger: 'bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-700 hover:to-red-600 shadow-lg shadow-red-500/30',
        }
        return variants[variant]
    }

    const getSizeClass = () => {
        const sizes = {
            sm: 'px-3 py-1.5 text-sm rounded-lg',
            md: 'px-4 py-2.5 text-base rounded-xl',
            lg: 'px-6 py-3.5 text-lg rounded-xl',
        }
        return sizes[size]
    }

    const isDisabled = disabled || loading

    return (
        <motion.button
            className={`
        relative inline-flex items-center justify-center gap-2 font-medium
        transition-colors overflow-hidden
        ${getVariantClass()}
        ${getSizeClass()}
        ${fullWidth ? 'w-full' : ''}
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
            whileHover={!isDisabled ? hoverScale : undefined}
            whileTap={!isDisabled ? tapEffect : undefined}
            disabled={isDisabled}
            onClick={handleClick}
            {...props}
        >
            {/* Ripple effect */}
            {ripples.map(ripple => (
                <motion.span
                    key={ripple.id}
                    className="absolute bg-white/30 rounded-full pointer-events-none"
                    initial={{
                        width: 0,
                        height: 0,
                        x: ripple.x,
                        y: ripple.y,
                        opacity: 1,
                    }}
                    animate={{
                        width: 400,
                        height: 400,
                        x: ripple.x - 200,
                        y: ripple.y - 200,
                        opacity: 0,
                    }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                />
            ))}

            {/* Loading spinner */}
            {loading && (
                <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                >
                    <Loader2 className="animate-spin" size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
                </motion.div>
            )}

            {/* Icon (left) */}
            {icon && iconPosition === 'left' && !loading && (
                <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {icon}
                </motion.span>
            )}

            {/* Content */}
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative z-10"
            >
                {children}
            </motion.span>

            {/* Icon (right) */}
            {icon && iconPosition === 'right' && !loading && (
                <motion.span
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {icon}
                </motion.span>
            )}

            {/* Hover glow effect */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6 }}
            />
        </motion.button>
    )
}

// Preset button variants

export function PrimaryButton(props: Omit<AnimatedButtonProps, 'variant'>) {
    return <AnimatedButton variant="primary" {...props} />
}

export function SecondaryButton(props: Omit<AnimatedButtonProps, 'variant'>) {
    return <AnimatedButton variant="secondary" {...props} />
}

export function OutlineButton(props: Omit<AnimatedButtonProps, 'variant'>) {
    return <AnimatedButton variant="outline" {...props} />
}

export function GhostButton(props: Omit<AnimatedButtonProps, 'variant'>) {
    return <AnimatedButton variant="ghost" {...props} />
}

export function SuccessButton(props: Omit<AnimatedButtonProps, 'variant'>) {
    return <AnimatedButton variant="success" {...props} />
}

export function DangerButton(props: Omit<AnimatedButtonProps, 'variant'>) {
    return <AnimatedButton variant="danger" {...props} />
}

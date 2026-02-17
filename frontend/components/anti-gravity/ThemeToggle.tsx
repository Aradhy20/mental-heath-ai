'use client'

import React, { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { motion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'

const ThemeToggle = () => {
    const [mounted, setMounted] = useState(false)
    const { theme, setTheme } = useTheme()

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark')
    }

    return (
        <button
            onClick={toggleTheme}
            className="relative p-3 rounded-full bg-white/50 dark:bg-black/20 hover:bg-white/80 dark:hover:bg-black/40 backdrop-blur-md border border-white/20 shadow-sm transition-all duration-300 group"
            aria-label="Toggle Theme"
        >
            <div className="relative w-6 h-6">
                <motion.div
                    initial={false}
                    animate={{
                        scale: theme === 'dark' ? 0 : 1,
                        opacity: theme === 'dark' ? 0 : 1,
                        rotate: theme === 'dark' ? 90 : 0,
                    }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 flex items-center justify-center text-amber-500"
                >
                    <Sun className="w-6 h-6" />
                </motion.div>

                <motion.div
                    initial={false}
                    animate={{
                        scale: theme === 'dark' ? 1 : 0,
                        opacity: theme === 'dark' ? 1 : 0,
                        rotate: theme === 'dark' ? 0 : -90,
                    }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 flex items-center justify-center text-indigo-400"
                >
                    <Moon className="w-6 h-6" />
                </motion.div>
            </div>
            <span className="sr-only">Toggle theme</span>
        </button>
    )
}

export default ThemeToggle

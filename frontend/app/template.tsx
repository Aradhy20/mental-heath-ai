'use client'

import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'

export default function Template({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    // Skip template animation completely on landing, login, register, since those have their own massive layouts
    const isPublicRoute = pathname === '/' || pathname === '/login' || pathname === '/register'
    
    if (isPublicRoute) {
        return <>{children}</>
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="h-full w-full"
        >
            {children}
        </motion.div>
    )
}

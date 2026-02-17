'use client'

import dynamic from 'next/dynamic'
import { ThemeProvider } from 'next-themes'

const AnimatedSidebar = dynamic(() => import('@/components/anti-gravity/AnimatedSidebar'), {
    ssr: false,
    loading: () => <div className="w-[280px] h-screen bg-white/5 dark:bg-black/5 animate-pulse hidden md:block" />
})
const MobileBottomNav = dynamic(() => import('@/components/layout/MobileBottomNav'), { ssr: false })
const ParallaxBackground = dynamic(() => import('@/components/anti-gravity/ParallaxBackground'), { ssr: false })
const AuthGuard = dynamic(() => import('@/components/auth/AuthGuard'), { ssr: false })
const CrisisButton = dynamic(() => import('@/components/ui/CrisisButton'), { ssr: false })

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <AuthGuard>
                <div className="flex min-h-screen relative">
                    <ParallaxBackground />
                    <AnimatedSidebar />
                    <main className="flex-1 relative z-10 pb-24 md:pb-8 px-4 md:px-8 pt-6 md:pt-8 max-w-7xl mx-auto w-full">
                        {children}
                    </main>
                    <CrisisButton />
                    <MobileBottomNav />
                </div>
            </AuthGuard>
        </ThemeProvider>
    )
}

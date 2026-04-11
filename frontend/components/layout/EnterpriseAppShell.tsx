'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import * as Dialog from '@radix-ui/react-dialog'
import { 
    Activity, LayoutDashboard, MessageCircle, PenTool, Wind, 
    Settings, LogOut, ChevronLeft, ChevronRight, Search,
    Brain, Command, FlaskConical, Sparkles, Heart, BookOpen, Smile,
    Briefcase, MapPin, Video
} from 'lucide-react'
import { useAuthStore } from '@/lib/store/auth-store'
import { ThemeProvider } from 'next-themes'

// Navigation Config
const NAV_ITEMS = [
    { name: 'My Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'How I Feel', href: '/mood', icon: Smile },
    { name: 'My Journal', href: '/journal', icon: BookOpen },
    { name: 'Talk to AI', href: '/chat', icon: MessageCircle },
    { name: 'Mind Check', href: '/analysis', icon: FlaskConical },
    { name: 'Breathe & Relax', href: '/meditation', icon: Wind },
    { name: 'Career Guidance', href: '/career', icon: Briefcase },
    { name: 'Find a Doctor', href: '/doctors', icon: MapPin },
    { name: 'Virtual Consult', href: '/consult', icon: Video },
]

export default function EnterpriseAppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const router = useRouter()
    const { user, logout } = useAuthStore()
    
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const [isCommandOpen, setIsCommandOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    // Only apply layout to authenticated routes
    const isPublicRoute = pathname === '/' || pathname === '/login' || pathname === '/register'

    // Command palette global shortcut
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setIsCommandOpen((open) => !open)
            }
        }
        document.addEventListener('keydown', down)
        return () => document.removeEventListener('keydown', down)
    }, [])

    if (isPublicRoute) return <ThemeProvider attribute="class" defaultTheme="dark">{children}</ThemeProvider>

    return (
        <ThemeProvider attribute="class" defaultTheme="dark">
            <div className="flex h-screen bg-[#030014] text-slate-200 overflow-hidden font-sans">
                
                {/* 1. COLLAPSIBLE SIDEBAR */}
                <motion.div 
                    animate={{ width: isSidebarOpen ? 260 : 80 }}
                    className="h-full bg-slate-950/80 border-r border-white/10 backdrop-blur-2xl flex flex-col relative z-30 shrink-0 transition-all duration-300 ease-in-out"
                >
                    {/* Header */}
                    <div className="h-20 flex items-center px-6 border-b border-white/5 shrink-0">
                        <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-500 to-pink-500 flex items-center justify-center shrink-0 shadow-lg shadow-violet-500/30">
                               <Sparkles size={16} className="text-white" />
                            </div>
                            <div className={`transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
                                <span className="font-bold text-lg text-white">Calm<span className="text-violet-400">Space</span></span>
                                <p className="text-[10px] text-slate-500 leading-none mt-0.5">Your mental wellness companion</p>
                            </div>
                        </div>
                    </div>

                    {/* Nav Links */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar py-6 px-4 space-y-2">
                        {NAV_ITEMS.map((item) => {
                            const isActive = pathname.startsWith(item.href)
                            return (
                                <Link 
                                    href={item.href} 
                                    key={item.href}
                                    title={item.name}
                                    className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all relative overflow-hidden group ${
                                        isActive 
                                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
                                        : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'
                                    }`}
                                >
                                    <item.icon size={20} className="shrink-0" />
                                    <span className={`font-medium text-sm whitespace-nowrap transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0'}`}>
                                        {item.name}
                                    </span>
                                </Link>
                            )
                        })}
                    </div>

                    {/* Footer Settings */}
                    <div className="p-4 border-t border-white/5 space-y-2 shrink-0">
                        <button 
                          className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-slate-400 hover:bg-white/5 hover:text-white border border-transparent transition-all"
                          title="Settings"
                        >
                            <Settings size={20} className="shrink-0" />
                            <span className={`font-medium text-sm whitespace-nowrap transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0'}`}>
                                Preferences
                            </span>
                        </button>
                        <button 
                          onClick={() => { logout(); router.push('/login'); }}
                          className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-rose-400/80 hover:bg-rose-500/10 hover:text-rose-400 border border-transparent transition-all"
                          title="Sign Out"
                        >
                            <LogOut size={20} className="shrink-0" />
                            <span className={`font-medium text-sm whitespace-nowrap transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0'}`}>
                                Sign Out
                            </span>
                        </button>
                    </div>

                    {/* Collapse Toggle */}
                    <button 
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="absolute -right-4 top-10 w-8 h-8 bg-slate-800 border border-white/10 rounded-full flex items-center justify-center text-slate-400 hover:bg-cyan-500/20 hover:text-cyan-400 hover:border-cyan-500/30 transition-all z-40 shadow-xl"
                    >
                        {isSidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                    </button>
                </motion.div>

                {/* 2. MAIN CONTENT AREA */}
                <div className="flex-1 flex flex-col relative min-w-0 overflow-hidden bg-[radial-gradient(ellipse_at_top_right,rgba(6,182,212,0.05),transparent_50%)]">
                    
                    {/* Topbar Command Shell */}
                    <header className="h-20 border-b border-white/5 bg-slate-900/40 backdrop-blur-md flex items-center justify-between px-8 shrink-0 relative z-20">
                        <div className="flex items-center gap-4 cursor-pointer" onClick={() => setIsCommandOpen(true)}>
                            <div className="flex items-center gap-2 bg-slate-950 border border-white/10 rounded-full px-4 py-2 hover:border-violet-500/50 hover:bg-slate-900 transition-all shadow-inner shadow-black/50">
                                <Search size={16} className="text-slate-500" />
                                <span className="text-sm text-slate-500 font-medium">Search or jump anywhere...</span>
                                <kbd className="ml-4 px-2 py-0.5 bg-slate-800 rounded text-xs text-slate-400 border border-white/5 font-mono flex items-center gap-1">
                                  <Command size={10} /> K
                                </kbd>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="text-right hidden sm:block">
                               <p className="text-sm font-bold text-white">{user?.username || 'You'} ✨</p>
                               <div className="flex items-center gap-1.5 justify-end">
                                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse"></span>
                                  <span className="text-[10px] font-medium text-slate-500">Feeling good today 💜</span>
                               </div>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center border-2 border-slate-900 shadow-xl">
                               <span className="text-sm font-bold text-white uppercase">{user?.username?.charAt(0) || 'A'}</span>
                            </div>
                        </div>
                    </header>

                    {/* Page Content Viewport */}
                    <main className="flex-1 overflow-y-auto custom-scrollbar relative z-10 w-full h-full">
                        {children}
                    </main>
                </div>

                {/* 3. RADIX UI COMMAND MENU DIALOG */}
                <Dialog.Root open={isCommandOpen} onOpenChange={setIsCommandOpen}>
                    <AnimatePresence>
                        {isCommandOpen && (
                            <Dialog.Portal forceMount>
                                <Dialog.Overlay asChild>
                                    <motion.div 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-[15vh]"
                                    >
                                        <Dialog.Content asChild>
                                            <motion.div 
                                                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                                                className="w-[90vw] max-w-2xl bg-slate-900 border border-white/10 rounded-2xl shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-hidden"
                                            >
                                                <div className="flex items-center gap-3 p-4 border-b border-white/10 bg-slate-950">
                                                    <Search size={20} className="text-cyan-400" />
                                                    <input 
                                                        autoFocus
                                                        value={searchQuery}
                                                        onChange={(e) => setSearchQuery(e.target.value)}
                                                        placeholder="Type a command or jump to feature..."
                                                        className="flex-1 bg-transparent border-none outline-none text-lg text-white placeholder-slate-500"
                                                    />
                                                    <kbd className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-400 border border-white/5 font-mono">ESC</kbd>
                                                </div>
                                                
                                                <div className="max-h-[60vh] overflow-y-auto p-2">
                                                    {/* Filtered Results Logic */}
                                                    <div className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-slate-500">Fast Navigation</div>
                                                    {NAV_ITEMS.map((item, i) => (
                                                        <div 
                                                            key={i}
                                                            onClick={() => { router.push(item.href); setIsCommandOpen(false); }}
                                                            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-cyan-500/10 hover:text-cyan-400 text-slate-300 cursor-pointer group transition-colors"
                                                        >
                                                            <item.icon size={18} className="text-slate-500 group-hover:text-cyan-400" />
                                                            <span className="font-medium">{item.name}</span>
                                                        </div>
                                                    ))}
                                                    <div className="px-4 py-2 mt-4 text-xs font-bold uppercase tracking-widest text-slate-500">Quick Actions</div>
                                                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-purple-500/10 hover:text-purple-400 text-slate-300 cursor-pointer group transition-colors">
                                                        <PenTool size={18} className="text-slate-500 group-hover:text-purple-400" />
                                                        <span className="font-medium">Force Mood Entry</span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </Dialog.Content>
                                    </motion.div>
                                </Dialog.Overlay>
                            </Dialog.Portal>
                        )}
                    </AnimatePresence>
                </Dialog.Root>

            </div>
        </ThemeProvider>
    )
}

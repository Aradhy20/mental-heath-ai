'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard, MessageCircle, BookOpen, Wind,
  Settings, LogOut, ChevronLeft, ChevronRight, Search,
  Brain, Smile, MapPin, Video, HeartPulse, Sparkles,
  Bell, ChevronDown, Menu, X, User, ShieldAlert
} from 'lucide-react'
import { useAuthStore } from '@/lib/store/auth-store'

// ── Navigation Config ──────────────────────────────────────────────────────
const NAV_GROUPS = [
  {
    label: 'Core',
    items: [
      { name: 'Dashboard',     href: '/dashboard',  icon: LayoutDashboard, desc: 'Your wellness overview' },
      { name: 'Mood Check-in', href: '/mood',       icon: Smile,           desc: 'Track how you feel' },
      { name: 'AI Therapist',  href: '/chat',       icon: MessageCircle,   desc: 'Talk to MindfulAI' },

    ]
  },
  {
    label: 'Wellness',
    items: [
      { name: 'Breathe & Relax', href: '/meditation', icon: Wind,        desc: 'Guided breathing' },
      { name: 'Anakskit Hub',    href: '/anakskit',   icon: ShieldAlert,  desc: 'Crisis & Anxiety support' },

      { name: 'Face Analysis',   href: '/analysis',   icon: HeartPulse,   desc: 'Biometric emotion tracking' },
    ]
  },
  {
    label: 'Discover',
    items: [
      { name: 'Find Therapists', href: '/therapists', icon: MapPin,  desc: 'Nearby mental health support' },
      { name: 'Virtual Consult', href: '/consult',    icon: Video,   desc: 'Book a session' },
    ]
  }
]

const ALL_NAV_ITEMS = NAV_GROUPS.flatMap(g => g.items)

// ── User Avatar ────────────────────────────────────────────────────────────
function Avatar({ username, size = 'md' }: { username?: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizeMap = { sm: 'w-7 h-7 text-xs', md: 'w-9 h-9 text-sm', lg: 'w-12 h-12 text-base' }
  const letter = username?.charAt(0)?.toUpperCase() || 'U'
  return (
    <div className={`${sizeMap[size]} rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white font-bold shadow-md shrink-0`}>
      {letter}
    </div>
  )
}

// ── Sidebar Nav Item ───────────────────────────────────────────────────────
function NavItem({ item, isCollapsed, isActive }: { item: typeof ALL_NAV_ITEMS[0]; isCollapsed: boolean; isActive: boolean }) {
  const Icon = item.icon
  return (
    <Link
      href={item.href}
      title={isCollapsed ? item.name : undefined}
      className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
        isActive
          ? 'bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300'
          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-slate-100'
      }`}
    >
      {/* Active indicator */}
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-violet-600 rounded-r-full" />
      )}
      <Icon size={18} className="shrink-0" strokeWidth={isActive ? 2.5 : 1.75} />
      <AnimatePresence>
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            className="font-medium text-sm whitespace-nowrap overflow-hidden"
          >
            {item.name}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  )
}

// ── Main Shell ─────────────────────────────────────────────────────────────
export default function EnterpriseAppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuthStore()

  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])
  useEffect(() => { setIsMobileOpen(false) }, [pathname])

  // Global ⌘K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setShowSearch(v => !v)
      }
      if (e.key === 'Escape') setShowSearch(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  const isPublicRoute = ['/', '/login', '/register'].includes(pathname)
  if (isPublicRoute) return <>{children}</>
  if (!mounted) return null

  const filteredItems = ALL_NAV_ITEMS.filter(i =>
    i.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const currentPage = ALL_NAV_ITEMS.find(i => pathname.startsWith(i.href))

  return (
    <div className="flex h-screen bg-[var(--bg-base)] overflow-hidden">

      {/* ── Mobile Overlay ── */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* ── SIDEBAR ── */}
      <motion.aside
        animate={{ width: isCollapsed ? 72 : 260 }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        className={`relative z-50 h-full flex flex-col shrink-0 overflow-hidden
          bg-white dark:bg-[#0f1629]
          border-r border-slate-200 dark:border-white/[0.06]
          shadow-sm
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 fixed lg:relative transition-transform lg:transition-none`}
        style={{ width: isMobileOpen ? 260 : undefined }}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-slate-100 dark:border-white/[0.05] shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-lg overflow-hidden bg-white dark:bg-white/10 flex items-center justify-center shadow-md border border-slate-200 dark:border-white/10">
              <img src="/logo.png" alt="MindfulAI Logo" className="w-full h-full object-cover" />
            </div>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="overflow-hidden"
                >
                  <p className="text-[15px] font-bold text-slate-900 dark:text-white leading-none">
                    Mindful<span className="text-violet-600">AI</span>
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-none">Your wellness companion</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto sidebar-scroll py-4 px-3 space-y-5">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              {!isCollapsed && (
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-600 px-3 mb-2">
                  {group.label}
                </p>
              )}
              <div className="space-y-0.5">
                {group.items.map(item => (
                  <NavItem
                    key={item.href}
                    item={item}
                    isCollapsed={isCollapsed}
                    isActive={pathname.startsWith(item.href)}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-slate-100 dark:border-white/[0.05] space-y-1 shrink-0">
          <Link
            href="/settings"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-slate-100 transition-all ${pathname.startsWith('/settings') ? 'bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300' : ''}`}
          >
            <Settings size={18} strokeWidth={1.75} className="shrink-0" />
            {!isCollapsed && <span className="text-sm font-medium">Settings</span>}
          </Link>

          {!isCollapsed && (
            <div className="px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.05] flex items-center gap-3">
              <Avatar username={user?.username} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{user?.username || 'User'}</p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email || 'user@mindfulai.app'}</p>
              </div>
              <button
                onClick={() => { logout(); router.push('/login') }}
                className="text-slate-400 hover:text-rose-500 transition-colors"
                title="Sign out"
              >
                <LogOut size={15} />
              </button>
            </div>
          )}

          {isCollapsed && (
            <button
              onClick={() => { logout(); router.push('/login') }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all w-full"
              title="Sign out"
            >
              <LogOut size={18} className="shrink-0" />
            </button>
          )}
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setIsCollapsed(v => !v)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 hover:text-violet-600 shadow-sm transition-all z-50 hidden lg:flex"
        >
          {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </motion.aside>

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Topbar */}
        <header className="h-16 flex items-center justify-between px-6 bg-white dark:bg-[#0f1629] border-b border-slate-100 dark:border-white/[0.05] shrink-0 z-30">
          <div className="flex items-center gap-4">
            {/* Mobile menu */}
            <button
              onClick={() => setIsMobileOpen(v => !v)}
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
            >
              <Menu size={20} />
            </button>

            {/* Breadcrumb */}
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {currentPage?.name || 'Dashboard'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Search trigger */}
            <button
              onClick={() => setShowSearch(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/[0.08] text-slate-400 text-sm hover:border-violet-300 dark:hover:border-violet-500/30 transition-all"
            >
              <Search size={14} />
              <span className="text-xs">Quick jump</span>
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 rounded text-[10px] font-mono border border-slate-200 dark:border-white/10">⌘K</kbd>
            </button>

            {/* Notifications */}
            <button className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/[0.08] text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-all">
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-violet-500 rounded-full" />
            </button>

            {/* Profile */}
            <button className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all">
              <Avatar username={user?.username} size="sm" />
              <ChevronDown size={14} className="text-slate-400 hidden sm:block" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="h-full">
            {children}
          </div>
        </main>
      </div>

      {/* ── SEARCH PALETTE ── */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4"
            onClick={() => setShowSearch(false)}
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: -12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -12 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              onClick={e => e.stopPropagation()}
              className="relative w-full max-w-lg bg-white dark:bg-[#141b2d] rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.2)] border border-slate-200 dark:border-white/10 overflow-hidden"
            >
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 dark:border-white/[0.06]">
                <Search size={18} className="text-slate-400 shrink-0" />
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Jump to any feature..."
                  className="flex-1 text-sm text-slate-900 dark:text-white bg-transparent outline-none placeholder:text-slate-400"
                />
                <button onClick={() => setShowSearch(false)}>
                  <X size={16} className="text-slate-400" />
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto p-2">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 px-3 py-2">Navigation</p>
                {filteredItems.map(item => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.href}
                      onClick={() => { router.push(item.href); setShowSearch(false); setSearchQuery('') }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-violet-50 dark:hover:bg-violet-500/10 text-left group transition-all"
                    >
                      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:bg-violet-100 dark:group-hover:bg-violet-500/20 group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-all">
                        <Icon size={15} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-violet-700 dark:group-hover:text-violet-300">{item.name}</p>
                        <p className="text-xs text-slate-400">{item.desc}</p>
                      </div>
                    </button>
                  )
                })}
                {filteredItems.length === 0 && (
                  <p className="text-center text-sm text-slate-400 py-8">No results for "{searchQuery}"</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  User, Bell, Shield, Palette, Brain, Mic, Camera,
  ChevronRight, Check, LogOut, Trash2
} from 'lucide-react'
import { useAuthStore } from '@/lib/store/auth-store'
import { useRouter } from 'next/navigation'

type Section = 'profile' | 'notifications' | 'privacy' | 'appearance' | 'ai' | 'data'

const SECTIONS = [
  { id: 'profile'       as Section, label: 'Profile',        icon: User,    desc: 'Your name, email, avatar' },
  { id: 'notifications' as Section, label: 'Notifications',  icon: Bell,    desc: 'Reminders & alerts' },
  { id: 'privacy'       as Section, label: 'Privacy',        icon: Shield,  desc: 'Camera, mic, data sharing' },
  { id: 'appearance'    as Section, label: 'Appearance',     icon: Palette, desc: 'Theme, font size, layout' },
  { id: 'ai'            as Section, label: 'AI & Models',    icon: Brain,   desc: 'Chatbot, analysis settings' },
  { id: 'data'          as Section, label: 'Data & Account', icon: Trash2,  desc: 'Export, delete account' },
]

// ── Toggle ──────────────────────────────────────────────────────────────────
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-10 h-5.5 rounded-full transition-all duration-300 ${checked ? 'bg-violet-600' : 'bg-slate-200 dark:bg-slate-700'}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 rounded-full bg-white shadow-sm transition-transform duration-300 ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  )
}

// ── Setting Row ──────────────────────────────────────────────────────────────
function SettingRow({ label, description, control }: { label: string; description?: string; control: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-slate-100 dark:border-white/[0.05] last:border-0">
      <div className="flex-1 pr-4">
        <p className="text-sm font-medium text-slate-900 dark:text-white">{label}</p>
        {description && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>}
      </div>
      {control}
    </div>
  )
}

export default function SettingsPage() {
  const { user, logout } = useAuthStore()
  const router = useRouter()
  const [activeSection, setActiveSection] = useState<Section>('profile')

  // Settings state
  const [settings, setSettings] = useState({
    dailyReminder: true,
    weeklyReport: true,
    crisisAlerts: true,
    pushNotifications: false,
    cameraAccess: false,
    micAccess: false,
    shareAnalytics: false,
    theme: 'dark',
    fontSize: 'medium',
    sidebarCollapsed: false,
    chatbotPersonality: 'empathetic',
    faceTracking: false,
    voiceAnalysis: false,
    contextMemory: true,
  })

  const update = (key: string, value: any) => setSettings(prev => ({ ...prev, [key]: value }))

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-5 p-6 bg-slate-50 dark:bg-white/[0.03] rounded-2xl border border-slate-200 dark:border-white/[0.06]">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                {user?.username?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div>
                <p className="font-semibold text-lg text-slate-900 dark:text-white">{user?.username || 'User'}</p>
                <p className="text-sm text-slate-500">{user?.email || 'user@mindfulai.app'}</p>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold mt-1.5 px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-500/15 text-violet-700 dark:text-violet-300">
                  <Check size={9} /> Free Plan
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { label: 'Full Name', value: user?.username, type: 'text', placeholder: 'Your name' },
                { label: 'Email', value: user?.email, type: 'email', placeholder: 'your@email.com' },
              ].map(field => (
                <div key={field.label}>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">{field.label}</label>
                  <input
                    type={field.type}
                    defaultValue={field.value as string}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] text-slate-900 dark:text-white outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 transition-all"
                  />
                </div>
              ))}

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Change Password</label>
                <input
                  type="password"
                  placeholder="New password"
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] text-slate-900 dark:text-white outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 transition-all"
                />
              </div>

              <button className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl text-sm font-semibold shadow-md shadow-violet-500/25 hover:brightness-110 transition-all">
                Save Changes
              </button>
            </div>
          </div>
        )

      case 'notifications':
        return (
          <div className="divide-y divide-slate-100 dark:divide-white/[0.05]">
            <SettingRow label="Daily Mood Reminder" description="Get reminded to log your mood each day" control={<Toggle checked={settings.dailyReminder} onChange={v => update('dailyReminder', v)} />} />
            <SettingRow label="Weekly Wellness Report" description="Summary of your mental health trends" control={<Toggle checked={settings.weeklyReport} onChange={v => update('weeklyReport', v)} />} />
            <SettingRow label="Crisis Support Alerts" description="Emergency resources during distress patterns" control={<Toggle checked={settings.crisisAlerts} onChange={v => update('crisisAlerts', v)} />} />
            <SettingRow label="Push Notifications" description="Browser notifications (requires permission)" control={<Toggle checked={settings.pushNotifications} onChange={v => update('pushNotifications', v)} />} />
          </div>
        )

      case 'privacy':
        return (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20">
              <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 flex items-center gap-1.5 mb-1"><Shield size={13} /> Data Privacy First</p>
              <p className="text-xs text-blue-600 dark:text-blue-400">All your data is processed locally or encrypted end-to-end. We never sell personal wellness data.</p>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-white/[0.05]">
              <SettingRow label="Camera Access" description="Required for real-time face emotion analysis" control={<Toggle checked={settings.cameraAccess} onChange={v => update('cameraAccess', v)} />} />
              <SettingRow label="Microphone Access" description="Required for voice stress analysis" control={<Toggle checked={settings.micAccess} onChange={v => update('micAccess', v)} />} />
              <SettingRow label="Anonymous Analytics" description="Help us improve (no personal data shared)" control={<Toggle checked={settings.shareAnalytics} onChange={v => update('shareAnalytics', v)} />} />
            </div>
          </div>
        )

      case 'appearance':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Theme</label>
              <div className="grid grid-cols-3 gap-3">
                {['light', 'dark', 'system'].map(theme => (
                  <button
                    key={theme}
                    onClick={() => update('theme', theme)}
                    className={`p-3 rounded-xl border text-sm font-medium capitalize transition-all ${
                      settings.theme === theme
                        ? 'border-violet-400 bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300'
                        : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-violet-200'
                    }`}
                  >
                    {theme === 'light' ? '☀️' : theme === 'dark' ? '🌙' : '⚙️'} {theme}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Font Size</label>
              <div className="grid grid-cols-3 gap-3">
                {['small', 'medium', 'large'].map(size => (
                  <button
                    key={size}
                    onClick={() => update('fontSize', size)}
                    className={`p-3 rounded-xl border text-sm font-medium capitalize transition-all ${
                      settings.fontSize === size
                        ? 'border-violet-400 bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300'
                        : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )

      case 'ai':
        return (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20">
              <p className="text-xs font-semibold text-violet-700 dark:text-violet-300 flex items-center gap-1.5 mb-1"><Brain size={13} /> AI Engine: SmolLM2-Instruct</p>
              <p className="text-xs text-violet-600 dark:text-violet-400">Running locally on your device. No data sent to external AI APIs.</p>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-white/[0.05]">
              <SettingRow label="Real-time Face Tracking" description="MediaPipe emotion analysis during sessions" control={<Toggle checked={settings.faceTracking} onChange={v => update('faceTracking', v)} />} />
              <SettingRow label="Voice Stress Analysis" description="Detect stress patterns in your voice" control={<Toggle checked={settings.voiceAnalysis} onChange={v => update('voiceAnalysis', v)} />} />
              <SettingRow label="Conversation Memory" description="AI remembers context across sessions" control={<Toggle checked={settings.contextMemory} onChange={v => update('contextMemory', v)} />} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">AI Personality</label>
              <div className="grid grid-cols-2 gap-3">
                {['empathetic', 'clinical', 'motivational', 'neutral'].map(p => (
                  <button
                    key={p}
                    onClick={() => update('chatbotPersonality', p)}
                    className={`p-3 rounded-xl border text-xs font-semibold capitalize transition-all ${
                      settings.chatbotPersonality === p
                        ? 'border-violet-400 bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300'
                        : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-violet-200'
                    }`}
                  >
                    {p} {settings.chatbotPersonality === p && '✓'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )

      case 'data':
        return (
          <div className="space-y-4">
            <div className="p-5 rounded-xl border border-slate-200 dark:border-white/[0.06] space-y-3">
              <h3 className="font-semibold text-sm text-slate-900 dark:text-white">Export Your Data</h3>
              <p className="text-xs text-slate-500">Download all your mood logs and wellness data in JSON format.</p>
              <button className="px-4 py-2 text-sm font-semibold text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-500/30 rounded-xl hover:bg-violet-50 dark:hover:bg-violet-500/10 transition-all">
                Export All Data
              </button>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 dark:border-white/[0.06] space-y-3">
              <h3 className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2"><LogOut size={14} /> Sign Out</h3>
              <p className="text-xs text-slate-500">Sign out of your account on this device.</p>
              <button
                onClick={() => { logout(); router.push('/login') }}
                className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
              >
                Sign Out
              </button>
            </div>

            <div className="p-5 rounded-xl border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/[0.05] space-y-3">
              <h3 className="font-semibold text-sm text-red-700 dark:text-red-400 flex items-center gap-2"><Trash2 size={14} /> Delete Account</h3>
              <p className="text-xs text-red-600 dark:text-red-500">This will permanently delete all your data. This action cannot be undone.</p>
              <button className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all shadow-sm">
                Delete Account
              </button>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-full bg-slate-50 dark:bg-[#0a0d1a] p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Manage your account, preferences, and privacy</p>
        </div>

        <div className="flex gap-6">
          {/* Section nav */}
          <div className="w-52 shrink-0 space-y-1">
            {SECTIONS.map(s => {
              const Icon = s.icon
              const isActive = activeSection === s.id
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                    isActive
                      ? 'bg-white dark:bg-[#0f1629] shadow-sm border border-slate-200 dark:border-white/[0.06] text-violet-700 dark:text-violet-300'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-white/[0.03] hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon size={16} className={isActive ? 'text-violet-500' : 'text-slate-400'} strokeWidth={1.75} />
                  <span className="text-sm font-medium">{s.label}</span>
                </button>
              )
            })}
          </div>

          {/* Content panel */}
          <div className="flex-1 bg-white dark:bg-[#0f1629] rounded-2xl border border-slate-200 dark:border-white/[0.06] shadow-sm p-6 min-h-[400px]">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-5 pb-4 border-b border-slate-100 dark:border-white/[0.05]">
                {SECTIONS.find(s => s.id === activeSection)?.label}
              </h2>
              {renderContent()}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

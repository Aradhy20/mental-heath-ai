'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Briefcase, Target, TrendingUp, BookOpen, ChevronRight, Sparkles, Code, Palette, HeartHandshake, Presentation } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import Confetti from 'react-confetti'

// Recharts dummy data: Salary Growth Projections (Mock)
const JOB_MARKET_DATA = [
    { year: '2023', tech: 85, creative: 60, health: 70, management: 75 },
    { year: '2024', tech: 95, creative: 65, health: 78, management: 78 },
    { year: '2025', tech: 110, creative: 72, health: 85, management: 82 },
    { year: '2026', tech: 125, creative: 80, health: 95, management: 88 },
    { year: '2027', tech: 140, creative: 88, health: 105, management: 95 },
]

export default function CareerHubPage() {
    const [quizStarted, setQuizStarted] = useState(false)
    const [quizQuestion, setQuizQuestion] = useState(0)
    const [quizResult, setQuizResult] = useState<string | null>(null)

    const QUIZ = [
        {
            q: "What sounds like the most fun way to spend a Friday afternoon?",
            options: [
                { text: "Solving a really complex puzzle or coding challenge", trait: "tech" },
                { text: "Painting, writing, or designing something beautiful", trait: "creative" },
                { text: "Volunteering or helping a friend talk through a problem", trait: "health" },
                { text: "Organizing an event or leading a group project", trait: "management" }
            ]
        },
        {
            q: "When faced with an unexpected obstacle, you usually:",
            options: [
                { text: "Analyze the data to find the logical solution", trait: "tech" },
                { text: "Come up with an out-of-the-box unconventional idea", trait: "creative" },
                { text: "Check how everyone else is feeling and support them", trait: "health" },
                { text: "Take charge, delegate tasks, and form an action plan", trait: "management" }
            ]
        },
        {
            q: "What kind of work environment do you prefer?",
            options: [
                { text: "Quiet, independent, focused", trait: "tech" },
                { text: "Vibrant, flexible, expressive", trait: "creative" },
                { text: "Warm, empathetic, collaborative", trait: "health" },
                { text: "Fast-paced, high-stakes, structured", trait: "management" }
            ]
        }
    ]

    const handleAnswer = (trait: string) => {
        if (quizQuestion < QUIZ.length - 1) {
            setQuizQuestion(prev => prev + 1)
        } else {
            // Simplified result for demonstration
            const resultsMap: Record<string, any> = {
                tech: { title: "The Analytical Architect", icon: Code, color: "text-indigo-400", bg: "bg-indigo-500", desc: "You thrive on logic, structure, and solving complex problems. Consider: Software Engineering, Data Science, Research." },
                creative: { title: "The Creative Visionary", icon: Palette, color: "text-pink-400", bg: "bg-pink-500", desc: "You have an eye for aesthetics and expression. You belong where ideas flow freely. Consider: Design, Writing, Art Direction." },
                health: { title: "The Empathetic Healer", icon: HeartHandshake, color: "text-emerald-400", bg: "bg-emerald-500", desc: "You are driven by a deep desire to help others and make a meaningful impact. Consider: Psychology, Medicine, Social Work." },
                management: { title: "The Strategic Leader", icon: Presentation, color: "text-amber-400", bg: "bg-amber-500", desc: "You are a natural organizer who sees the big picture and inspires others. Consider: Business, Management, Law." }
            }
            setQuizResult(trait)
        }
    }

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col h-full gap-6 p-2 overflow-y-auto custom-scrollbar"
        >
            {quizResult && <Confetti recycle={false} numberOfPieces={500} gravity={0.2} />}

            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-3">
                        <Briefcase className="text-amber-500" /> Figure Out Your Future 🚀
                    </h1>
                    <p className="text-slate-400 mt-2 text-lg">AI-driven career mapping, skill tracking, and market trends.</p>
                </div>
                <button
                    onClick={() => window.location.href = '/chat'}
                    className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2 group"
                >
                    <Sparkles size={18} /> Ask Career Alex 
                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
                
                {/* CAREER QUIZ WIDGET */}
                <div className="lg:col-span-1 bg-slate-900 border border-white/5 rounded-3xl p-6 relative overflow-hidden shadow-2xl flex flex-col">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-bl-[100px] -z-0"></div>
                    <h2 className="text-xl font-bold text-white mb-2 z-10 flex items-center gap-2"><Target className="text-amber-400" /> Career Persona Quiz</h2>
                    
                    <div className="flex-1 flex flex-col justify-center relative z-10 mt-4">
                        <AnimatePresence mode="wait">
                            {!quizStarted ? (
                                <motion.div key="start" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -20 }} className="text-center">
                                    <p className="text-slate-400 mb-6 mt-4">Takes 3 minutes. Discover what professional paths align with your core personality drives.</p>
                                    <button onClick={() => setQuizStarted(true)} className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-full font-bold transition-all w-full border border-white/10">Start the Quiz</button>
                                </motion.div>
                            ) : !quizResult ? (
                                <motion.div key="q" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col h-full justify-between">
                                    <div>
                                        <div className="flex gap-1 mb-4">
                                            {QUIZ.map((_, i) => (
                                                <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= quizQuestion ? 'bg-amber-500' : 'bg-slate-800'}`}></div>
                                            ))}
                                        </div>
                                        <p className="text-white font-bold text-lg mb-6 leading-relaxed">{QUIZ[quizQuestion].q}</p>
                                        <div className="space-y-3">
                                            {QUIZ[quizQuestion].options.map((opt, i) => (
                                                <button key={i} onClick={() => handleAnswer(opt.trait)} className="w-full text-left p-4 rounded-xl border border-white/10 bg-slate-950/50 hover:bg-amber-500 hover:border-amber-500 text-slate-300 hover:text-white transition-all text-sm group">
                                                    {opt.text}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
                                    {(() => {
                                        const res = {
                                            tech: { title: "The Analytical Architect", icon: Code, color: "text-indigo-400", bg: "bg-indigo-500/20", desc: "You thrive on logic, structure, and solving complex problems. Consider: Software engineering, Data Science, Analytics." },
                                            creative: { title: "The Creative Visionary", icon: Palette, color: "text-pink-400", bg: "bg-pink-500/20", desc: "You belong where ideas flow freely. Consider: Design, Writing, Content Creation." },
                                            health: { title: "The Empathetic Healer", icon: HeartHandshake, color: "text-emerald-400", bg: "bg-emerald-500/20", desc: "You are driven by a desire to help others. Consider: Medicine, Therapy, Education." },
                                            management: { title: "The Strategic Leader", icon: Presentation, color: "text-amber-400", bg: "bg-amber-500/20", desc: "You see the big picture and inspire others. Consider: Business Operations, Law, Management." }
                                        }[quizResult]

                                        if (!res) return null;
                                        const ResIcon = res.icon
                                        return (
                                            <>
                                                <div className={`w-20 h-20 rounded-2xl mx-auto flex items-center justify-center mb-6 ${res.bg} border-2 border-white/10`}>
                                                    <ResIcon size={40} className={res.color} />
                                                </div>
                                                <h3 className={`text-2xl font-black mb-2 ${res.color}`}>{res.title}</h3>
                                                <p className="text-slate-400 text-sm leading-relaxed mb-6">{res.desc}</p>
                                                <button onClick={() => {setQuizStarted(false); setQuizQuestion(0); setQuizResult(null)}} className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Retake Quiz</button>
                                            </>
                                        )
                                    })()}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* CHART WIDGET */}
                    <div className="bg-slate-900 border border-white/5 rounded-3xl p-6 shadow-2xl h-[300px] flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2"><TrendingUp className="text-emerald-400" /> Projected Job Market Growth</h2>
                            <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">Live Update</span>
                        </div>
                        <div className="flex-1 w-full h-full -ml-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={JOB_MARKET_DATA}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                    <XAxis dataKey="year" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `+${val}%`} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                        itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                                    />
                                    <Line type="monotone" dataKey="tech" stroke="#818cf8" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} name="Tech/Data" />
                                    <Line type="monotone" dataKey="health" stroke="#34d399" strokeWidth={3} dot={false} activeDot={{ r: 6 }} name="Healthcare" />
                                    <Line type="monotone" dataKey="management" stroke="#fbbf24" strokeWidth={3} dot={false} activeDot={{ r: 6 }} name="Business" />
                                    <Line type="monotone" dataKey="creative" stroke="#f472b6" strokeWidth={3} dot={false} activeDot={{ r: 6 }} name="Creative" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* RESOURCES WIDGET */}
                    <div className="bg-slate-900 border border-white/5 rounded-3xl p-6 shadow-2xl">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><BookOpen className="text-indigo-400" /> Actionable Resources</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { title: "Fix your Resume in 5 mins", icon: "📄", time: "5 min read", cat: "Basics" },
                                { title: "How to answer 'What's your weakness?'", icon: "🗣️", time: "Video", cat: "Interviews" },
                                { title: "LinkedIn Networking Hacks for Gen-Z", icon: "💼", time: "Toolkit", cat: "Networking" },
                                { title: "Negotiating your first salary", icon: "💰", time: "Guide", cat: "Career Growth" }
                            ].map((item, i) => (
                                <motion.div 
                                    whileHover={{ scale: 1.02 }}
                                    key={i} 
                                    className="p-4 rounded-2xl bg-slate-950 border border-white/5 flex items-center gap-4 cursor-pointer group"
                                >
                                    <div className="text-2xl bg-white/5 p-3 rounded-xl group-hover:bg-white/10 transition-colors">{item.icon}</div>
                                    <div>
                                        <p className="text-white font-bold text-sm leading-tight mb-1 group-hover:text-amber-400 transition-colors">{item.title}</p>
                                        <div className="flex gap-2 text-[10px] text-slate-500 uppercase tracking-widest font-black">
                                            <span>{item.cat}</span> • <span>{item.time}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </motion.div>
    )
}

"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { 
  ClipboardCheck, 
  HelpCircle, 
  ChevronRight, 
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  FileText,
  Activity,
  Play
} from 'lucide-react'
import { cn } from '@/lib/utils'

const ASSESSMENTS = {
  phq9: {
    title: "PHQ-9 Patient Health Questionnaire",
    desc: "Standardized tool for screening and monitoring the severity of depression.",
    questions: [
      "Little interest or pleasure in doing things?",
      "Feeling down, depressed, or hopeless?",
      "Trouble falling or staying asleep, or sleeping too much?",
      "Feeling tired or having little energy?",
      "Poor appetite or overeating?",
      "Feeling bad about yourself — or that you are a failure or have let yourself or your family down?",
      "Trouble concentrating on things, such as reading the newspaper or watching television?",
      "Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual?",
      "Thoughts that you would be better off dead or of hurting yourself in some way?"
    ]
  },
  gad7: {
    title: "GAD-7 Generalized Anxiety Disorder",
    desc: "A rapid screening tool for the presence and severity of generalized anxiety disorder.",
    questions: [
      "Feeling nervous, anxious, or on edge?",
      "Not being able to stop or control worrying?",
      "Worrying too much about different things?",
      "Trouble relaxing?",
      "Being so restless that it is hard to sit still?",
      "Becoming easily annoyed or irritable?",
      "Feeling afraid, as if something awful might happen?"
    ]
  }
}

const OPTIONS = [
  { label: "Not at all", value: 0 },
  { label: "Several days", value: 1 },
  { label: "More than half the days", value: 2 },
  { label: "Nearly every day", value: 3 },
]

export default function AssessmentsPage() {
  const router = useRouter()
  const [selectedType, setSelectedType] = useState<'phq9' | 'gad7' | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [isFinished, setIsFinished] = useState(false)

  const activeAssessment = selectedType ? ASSESSMENTS[selectedType] : null

  const handleAnswer = (val: number) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = val
    setAnswers(newAnswers)

    if (activeAssessment && currentQuestion < activeAssessment.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setIsFinished(true)
    }
  }

  const calculateScore = () => answers.reduce((a, b) => a + b, 0)
  
  const getInterpretation = (score: number) => {
    if (selectedType === 'phq9') {
      if (score < 5) return { level: "Minimal", color: "text-emerald-400" }
      if (score < 10) return { level: "Mild", color: "text-amber-400" }
      if (score < 15) return { level: "Moderate", color: "text-orange-400" }
      if (score < 20) return { level: "Moderately Severe", color: "text-rose-400" }
      return { level: "Severe", color: "text-rose-600" }
    }
    // GAD-7
    if (score < 5) return { level: "Minimal", color: "text-emerald-400" }
    if (score < 10) return { level: "Mild", color: "text-amber-400" }
    if (score < 15) return { level: "Moderate", color: "text-orange-400" }
    return { level: "Severe", color: "text-rose-400" }
  }

  if (isFinished && selectedType) {
    const score = calculateScore()
    const interp = getInterpretation(score)
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-8">
        <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mx-auto mb-8">
          <CheckCircle2 size={40} />
        </div>
        <h1 className="text-4xl font-bold">Assessment Complete</h1>
        <p className="text-muted-foreground italic">Thank you for your honesty. This data helps our AI specialize your care plan.</p>
        
        <div className="p-12 glass rounded-[3rem] border border-black/5 space-y-4">
           <h2 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Clinical Outcome</h2>
           <div className="space-y-1">
              <p className="text-6xl font-black">{score}</p>
              <p className={cn("text-xl font-bold", interp.color)}>{interp.level} {selectedType.toUpperCase()}</p>
           </div>
        </div>

        <div className="flex gap-4 justify-center">
           <button 
             onClick={() => {
                setSelectedType(null)
                setIsFinished(false)
                setAnswers([])
                setCurrentQuestion(0)
             }}
             className="px-8 py-4 bg-black/5 border border-black/5 rounded-2xl font-bold hover:bg-black/10 transition-all"
           >
              Done
           </button>
           <button 
             onClick={() => router.push('/chat')}
             className="px-10 py-4 bg-primary text-white rounded-2xl font-bold hover:scale-105 transition-all shadow-xl shadow-primary/20"
           >
              Discuss Results with AI
           </button>
        </div>
      </div>
    )
  }

  if (activeAssessment) {
    const progress = (currentQuestion / activeAssessment.questions.length) * 100
    return (
      <div className="max-w-3xl mx-auto space-y-12">
        <header className="flex justify-between items-center bg-black/5 p-6 rounded-[2rem] border border-black/5">
           <button onClick={() => setSelectedType(null)} className="p-2 hover:bg-black/5 rounded-full transition-colors">
              <ChevronLeft size={24} />
           </button>
           <div className="text-center">
              <h2 className="font-bold">{activeAssessment.title}</h2>
              <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Question {currentQuestion + 1} of {activeAssessment.questions.length}</p>
           </div>
           <div className="w-10 h-10" />
        </header>

        <div className="h-1 w-full bg-black/5 rounded-full overflow-hidden">
           <motion.div animate={{ width: `${progress}%` }} className="h-full bg-primary" />
        </div>

        <div className="space-y-12 py-12 text-center">
           <h1 className="text-3xl font-medium leading-relaxed italic">
             "{activeAssessment.questions[currentQuestion]}"
           </h1>

           <div className="grid gap-4 max-w-sm mx-auto">
              {OPTIONS.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(opt.value)}
                  className="p-5 text-sm font-bold bg-black/5 border border-black/5 rounded-2xl hover:bg-black/10 hover:border-primary/40 transition-all"
                >
                  {opt.label}
                </button>
              ))}
           </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-3 mb-4">
             <CheckCircle2 className="text-emerald-400" size={20} />
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400/70">Clinical Diagnostic Core active</span>
          </div>
          <h1 className="text-5xl font-black tracking-tight mb-4">Assessment <span className="gradient-text italic font-serif">Portal</span></h1>
          <p className="text-muted-foreground font-medium text-lg max-w-2xl">
            Standardized psychiatric screening tools used for precision mental health monitoring and diagnostic baselining.
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="px-6 py-4 glass rounded-[2.5rem] border border-black/5 flex items-center gap-5 shadow-2xl"
        >
           <div className="w-12 h-12 rounded-[1.25rem] bg-primary/10 flex items-center justify-center text-primary shadow-[0_0_20px_rgba(139,92,246,0.1)]">
              <Activity size={24} />
           </div>
           <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-0.5">Neural Baseline</p>
              <p className="text-sm font-black tracking-tight text-emerald-400">Optimal Stability</p>
           </div>
        </motion.div>
      </header>

      <div className="grid lg:grid-cols-2 gap-8">
        {(Object.keys(ASSESSMENTS) as Array<keyof typeof ASSESSMENTS>).map((key, i) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group relative"
            onClick={() => {
              setSelectedType(key)
              setAnswers([])
              setCurrentQuestion(0)
            }}
          >
            <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full opacity-0 group-hover:opacity-20 transition-opacity" />
            <div className="relative p-12 glass rounded-[4rem] border border-black/5 hover:border-primary/40 transition-all cursor-pointer overflow-hidden space-y-10">
               <div className="flex justify-between items-start relative z-10">
                  <div className="space-y-3">
                     <h3 className="text-3xl font-black tracking-tight leading-none">{ASSESSMENTS[key].title.split(' ')[0]} <span className="text-primary italic">{ASSESSMENTS[key].title.split(' ')[1]}</span></h3>
                     <div className="flex gap-4 text-muted-foreground">
                        <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-black/5 px-3 py-1 rounded-full"><FileText size={12} /> {ASSESSMENTS[key].questions.length} Items</span>
                        <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-black/5 px-3 py-1 rounded-full text-emerald-400 border border-emerald-400/20">~3 min</span>
                     </div>
                  </div>
                  <div className="p-5 bg-primary text-white rounded-[1.5rem] shadow-xl shadow-primary/20 transition-transform group-hover:scale-110">
                     <Play size={24} fill="currentColor" />
                  </div>
               </div>

               <p className="text-sm font-medium text-muted-foreground leading-relaxed relative z-10 opacity-80 group-hover:opacity-100 transition-opacity">
                 {ASSESSMENTS[key].desc}
               </p>

               <div className="pt-10 border-t border-black/5 space-y-6 relative z-10">
                  <div className="flex justify-between items-end">
                     <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5 opacity-50">Latest Index</p>
                        <p className="text-2xl font-black text-emerald-400">Nominal Baseline</p>
                     </div>
                     <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest">Active Monitoring</p>
                  </div>
                  <div className="h-1.5 w-full bg-black/5 rounded-full overflow-hidden">
                     <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "12%" }} 
                        className="h-full bg-emerald-400/60 shadow-[0_0_10px_rgba(52,211,153,0.3)] rounded-full" 
                     />
                  </div>
               </div>

               {/* Background neural pattern */}
               <div className="absolute -bottom-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity">
                  <ClipboardCheck size={260} />
               </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="p-12 glass rounded-[4rem] border border-black/5 bg-gradient-to-r from-rose-500/5 via-transparent to-transparent flex flex-col md:flex-row items-center gap-12 relative overflow-hidden"
      >
        <div className="absolute bottom-0 right-0 p-12 opacity-5">
           <AlertCircle size={120} />
        </div>
        <div className="w-20 h-20 rounded-[2rem] bg-rose-500/20 flex items-center justify-center text-rose-500 border border-rose-500/30 shadow-2xl relative z-10">
          <AlertCircle size={40} />
        </div>
        <div className="flex-1 space-y-4 relative z-10 text-center md:text-left">
          <h4 className="text-2xl font-black tracking-tight text-rose-400">Clinical Emergency Protocols</h4>
          <p className="text-base font-medium text-muted-foreground leading-relaxed max-w-3xl">
            These screening tools are for diagnostic benchmarking only. If you are experiencing thoughts of self-harm or immediate crisis, please utilize the 
            <span className="text-rose-400 font-black px-2 hover:underline cursor-pointer">Neural Safety Line (988)</span> or call local emergency services immediately.
          </p>
        </div>
      </motion.div>
    </div>
  )
}

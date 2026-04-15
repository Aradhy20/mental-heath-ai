'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ClipboardCheck, 
  ChevronRight, 
  ChevronLeft, 
  ShieldCheck, 
  Info,
  Activity,
  Award
} from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export default function ClinicalAssessmentPage() {
  const [testType, setTestType] = useState<'PHQ-9' | 'GAD-7' | null>(null);
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  // Fetch questions when test type is selected
  useEffect(() => {
    if (testType) {
      axios.get(`${API_URL}/clinical/questions/${testType}`)
        .then(res => {
          setQuestions(res.data);
          setAnswers(new Array(res.data.length).fill(0));
        })
        .catch(err => console.error("Failed to fetch questions", err));
    }
  }, [testType]);

  const handleAnswer = (value: number) => {
    const nextAnswers = [...answers];
    nextAnswers[currentStep] = value;
    setAnswers(nextAnswers);
    
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const submitAssessment = async () => {
    setIsSubmitting(true);
    try {
      const resp = await axios.post(`${API_URL}/clinical/score`, {
        test_type: testType,
        answers: answers,
        user_id: "demo_user" // Dynamically fetch in production
      });
      setResult(resp.data);
    } catch (err) {
      console.error("Submission failed", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderWelcome = () => (
    <div className="max-w-2xl mx-auto space-y-8 text-center py-12">
      <div className="inline-flex p-4 rounded-full bg-blue-500/10 text-blue-400">
        <ClipboardCheck size={48} />
      </div>
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-white">Clinical Wellness Screening</h1>
        <p className="text-xl text-gray-400">
          Select a standardized assessment to measure your emotional health baseline. 
          These tools are used by professionals to track progress over time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-12">
        <button 
          onClick={() => setTestType('PHQ-9')}
          className="p-8 rounded-3xl bg-gray-900 border border-gray-800 hover:border-blue-500/50 transition-all text-left space-y-4 group"
        >
          <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 w-fit group-hover:bg-indigo-500 group-hover:text-white transition-colors">
            <Activity size={24} />
          </div>
          <h3 className="text-2xl font-semibold text-white">PHQ-9</h3>
          <p className="text-gray-400 italic font-mono text-sm leading-relaxed">Depression focus</p>
          <p className="text-gray-500">Standardized patient health questionnaire used to monitor depressive symptoms.</p>
        </button>

        <button 
          onClick={() => setTestType('GAD-7')}
          className="p-8 rounded-3xl bg-gray-900 border border-gray-800 hover:border-blue-500/50 transition-all text-left space-y-4 group"
        >
          <div className="p-3 rounded-2xl bg-teal-500/10 text-teal-400 w-fit group-hover:bg-teal-500 group-hover:text-white transition-colors">
            <ShieldCheck size={24} />
          </div>
          <h3 className="text-2xl font-semibold text-white">GAD-7</h3>
          <p className="text-gray-400 italic font-mono text-sm leading-relaxed">Anxiety focus</p>
          <p className="text-gray-500">Validated 7-item scale used to identify and measure the severity of general anxiety.</p>
        </button>
      </div>

      <div className="p-6 rounded-2xl bg-yellow-500/5 border border-yellow-500/20 flex gap-4 text-left">
        <Info className="text-yellow-500 shrink-0" size={24} />
        <p className="text-sm text-yellow-500/80">
          **Disclaimer**: These are screening tools, not clinical diagnoses. If you are in immediate distress, please seek professional care.
        </p>
      </div>
    </div>
  );

  const renderQuestion = () => (
    <div className="max-w-xl mx-auto py-20 space-y-12">
      <div className="space-y-4">
        <div className="flex justify-between items-center text-sm font-medium">
          <span className="text-blue-400">{testType} Assessment</span>
          <span className="text-gray-500">Question {currentStep + 1} of {questions.length}</span>
        </div>
        <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
            className="h-full bg-blue-500"
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-8"
        >
          <h2 className="text-3xl font-medium text-white leading-tight">
            Over the last 2 weeks, how often have you been bothered by:
            <span className="block mt-4 text-blue-400 font-bold">{questions[currentStep]}</span>
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {[
              { label: "Not at all", val: 0 },
              { label: "Several days", val: 1 },
              { label: "More than half the days", val: 2 },
              { label: "Nearly every day", val: 3 },
            ].map((opt) => (
              <button
                key={opt.val}
                onClick={() => handleAnswer(opt.val)}
                className={`flex items-center justify-between p-6 rounded-2xl border-2 transition-all group ${
                  answers[currentStep] === opt.val 
                  ? 'bg-blue-500/10 border-blue-500 text-white' 
                  : 'bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-600'
                }`}
              >
                <span className="text-lg font-medium">{opt.label}</span>
                <ChevronRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between pt-8">
        <button 
          onClick={() => currentStep > 0 && setCurrentStep(currentStep - 1)}
          disabled={currentStep === 0}
          className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors disabled:opacity-30"
        >
          <ChevronLeft size={20} /> Back
        </button>
        
        {currentStep === questions.length - 1 && (
          <button 
            onClick={submitAssessment}
            className="px-8 py-3 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-500 shadow-xl shadow-blue-500/20 transition-all scale-110"
          >
            Submit Assessment
          </button>
        )}
      </div>
    </div>
  );

  const renderResult = () => (
    <div className="max-w-2xl mx-auto py-20 space-y-12 text-center">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="space-y-6"
      >
        <div className="inline-flex p-6 rounded-full bg-emerald-500/10 text-emerald-400">
          <Award size={64} />
        </div>
        <h1 className="text-5xl font-bold tracking-tight text-white">Assessment Complete</h1>
        <p className="text-xl text-gray-400 italic font-mono text-sm leading-relaxed">Generated with clinical-grade precision</p>
      </motion.div>

      <div className="p-12 rounded-[32px] bg-gray-900 border-2 border-emerald-500/30 space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <ClipboardCheck size={120} />
        </div>
        <div className="space-y-2">
          <span className="text-emerald-400 font-bold uppercase tracking-widest text-sm">Severity Indicator</span>
          <h2 className="text-6xl font-black text-white">{result.severity}</h2>
          <p className="text-gray-400">Total Score: {result.total_score}</p>
        </div>
        <div className="p-6 rounded-2xl bg-emerald-500/5 text-emerald-400/80 leading-relaxed italic">
          "{result.clinical_note}"
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-center">
        <button 
          onClick={() => window.location.href = '/chat'}
          className="px-10 py-4 rounded-full bg-white text-black font-bold hover:bg-gray-200 transition-all"
        >
          Discuss with AI Assistant
        </button>
        <button 
          onClick={() => {setTestType(null); setResult(null); setCurrentStep(0);}}
          className="px-10 py-4 rounded-full bg-gray-800 text-white font-bold hover:bg-gray-700 transition-all"
        >
          Take Another Test
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-gray-100 font-sans selection:bg-blue-500/30">
      <main className="container mx-auto px-6">
        <AnimatePresence mode="wait">
          {!testType && !result && <motion.div key="welcome" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{renderWelcome()}</motion.div>}
          {testType && !result && <motion.div key="question" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{renderQuestion()}</motion.div>}
          {result && <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{renderResult()}</motion.div>}
        </AnimatePresence>
      </main>
    </div>
  );
}

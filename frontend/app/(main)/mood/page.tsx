"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Smile, 
  Meh, 
  Frown, 
  Angry, 
  Sun,
  CloudRain,
  Moon,
  Coffee,
  Heart,
  Plus
} from 'lucide-react'

const MoodButton = ({ icon: Icon, label, isActive, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-3 p-6 rounded-3xl transition-all border-2 ${
      isActive 
        ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-100 scale-105' 
        : 'bg-white border-slate-50 text-slate-400 hover:border-slate-200'
    }`}
  >
    <Icon size={32} />
    <span className={`text-xs font-bold uppercase tracking-wider ${isActive ? 'text-white' : 'text-slate-500'}`}>
      {label}
    </span>
  </button>
)

export default function MoodTrackerPage() {
  const [selectedMood, setSelectedMood] = useState('good')

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto space-y-10">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">How are you today?</h1>
        <p className="text-slate-500 font-medium">Select the emotion that best describes your current state.</p>
      </div>

      {/* Mood Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <MoodButton 
          icon={Smile} 
          label="Great" 
          isActive={selectedMood === 'great'} 
          onClick={() => setSelectedMood('great')} 
        />
        <MoodButton 
          icon={Sun} 
          label="Good" 
          isActive={selectedMood === 'good'} 
          onClick={() => setSelectedMood('good')} 
        />
        <MoodButton 
          icon={Meh} 
          label="Okay" 
          isActive={selectedMood === 'okay'} 
          onClick={() => setSelectedMood('okay')} 
        />
        <MoodButton 
          icon={Frown} 
          label="Bad" 
          isActive={selectedMood === 'bad'} 
          onClick={() => setSelectedMood('bad')} 
        />
      </div>

      {/* Detailed Entry */}
      <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm space-y-8">
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-4">What's contributing to your mood?</h3>
          <div className="flex flex-wrap gap-3">
            {['Work', 'Health', 'Social', 'Family', 'Sleep', 'Exercise', 'Hobbies'].map((tag) => (
              <button key={tag} className="px-5 py-2 rounded-xl bg-slate-50 text-slate-600 font-bold text-sm hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-transparent hover:border-indigo-100">
                {tag}
              </button>
            ))}
            <button className="px-3 py-2 rounded-xl bg-slate-100 text-slate-400 hover:bg-slate-200 transition-all">
              <Plus size={18} />
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-4">Add a private note (Optional)</h3>
          <textarea 
            placeholder="Write down your thoughts..."
            className="w-full h-40 p-6 bg-slate-50 border-none rounded-[24px] outline-none text-slate-700 font-medium placeholder-slate-400 focus:ring-2 focus:ring-indigo-100 transition-all resize-none"
          ></textarea>
        </div>

        <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
          Save Entry
        </button>
      </div>
    </div>
  )
}

'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import AnimatedCard from '@/components/animations/AnimatedCard'
import AnimatedButton from '@/components/animations/AnimatedButton'
import AnimatedSpinner from '@/components/animations/AnimatedSpinner'
import AnimatedToggle from '@/components/animations/AnimatedToggle'
import AnimatedNotification from '@/components/animations/AnimatedNotification'
import AnimatedTabs from '@/components/animations/AnimatedTabs'
import AnimatedAccordion from '@/components/animations/AnimatedAccordion'
import AnimatedStat from '@/components/animations/AnimatedStat'
import AnimatedProgressBar from '@/components/animations/AnimatedProgressBar'
import BreathingExercise from '@/components/BreathingExercise'
import VoiceAnalyzer from '@/components/features/VoiceAnalyzer'
import FaceAnalyzer from '@/components/features/FaceAnalyzer'
import FusionResults from '@/components/features/FusionResults'

const ComponentsDemoPage: React.FC = () => {
  const [toggle1, setToggle1] = useState(true)
  const [toggle2, setToggle2] = useState(false)
  const [notificationVisible, setNotificationVisible] = useState(true)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Components Demo</h1>
          <p className="text-gray-600">Showcase of all animated components in the mental health app</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Animated Card */}
          <AnimatedCard className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Animated Card</h2>
            <p className="text-gray-600 mb-4">Cards with subtle entrance animations and hover effects.</p>
            <AnimatedCard delay={0.2} className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">Nested animated card with delayed entrance animation.</p>
            </AnimatedCard>
          </AnimatedCard>

          {/* Animated Button */}
          <AnimatedCard className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Animated Buttons</h2>
            <div className="flex flex-wrap gap-3">
              <AnimatedButton variant="primary">Primary</AnimatedButton>
              <AnimatedButton variant="secondary">Secondary</AnimatedButton>
              <AnimatedButton variant="outline">Outline</AnimatedButton>
              <AnimatedButton>Default</AnimatedButton>
              <AnimatedButton disabled>Disabled</AnimatedButton>
            </div>
          </AnimatedCard>

          {/* Animated Spinner */}
          <AnimatedCard className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Animated Spinner</h2>
            <div className="flex items-center gap-4">
              <AnimatedSpinner size="sm" />
              <AnimatedSpinner size="md" />
              <AnimatedSpinner size="lg" />
            </div>
          </AnimatedCard>

          {/* Animated Toggle */}
          <AnimatedCard className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Animated Toggle</h2>
            <div className="flex items-center gap-4">
              <AnimatedToggle 
                isChecked={toggle1}
                onChange={setToggle1}
                label="Notifications"
              />
              <AnimatedToggle 
                isChecked={toggle2}
                onChange={setToggle2}
                label="Dark Mode"
              />
            </div>
          </AnimatedCard>

          {/* Animated Notification */}
          <AnimatedCard className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Animated Notification</h2>
            <AnimatedButton onClick={() => setNotificationVisible(true)}>
              Show Notification
            </AnimatedButton>
            <AnimatedNotification 
              message="Your mood entry has been saved successfully."
              type="success"
              isVisible={notificationVisible}
              onClose={() => setNotificationVisible(false)}
              duration={5000}
            />
          </AnimatedCard>

          {/* Animated Tabs */}
          <AnimatedCard className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Animated Tabs</h2>
            <AnimatedTabs 
              tabs={[
                { id: 'tab1', label: 'Tab 1', content: <p>Content for Tab 1</p> },
                { id: 'tab2', label: 'Tab 2', content: <p>Content for Tab 2</p> },
                { id: 'tab3', label: 'Tab 3', content: <p>Content for Tab 3</p> }
              ]}
              activeTab="tab1"
              onTabChange={() => {}}
            />
          </AnimatedCard>

          {/* Animated Accordion */}
          <AnimatedCard className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Animated Accordion</h2>
            <AnimatedAccordion 
              items={[
                {
                  id: 'item1',
                  title: "How does the breathing exercise work?",
                  content: (
                    <p>
                      The breathing exercise uses a 4-7-8 technique to help reduce anxiety and promote relaxation. 
                      Inhale for 4 counts, hold for 7, and exhale for 8.
                    </p>
                  )
                }
              ]}
            />
          </AnimatedCard>

          {/* Animated Stat */}
          <AnimatedCard className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Animated Stat</h2>
            <div className="grid grid-cols-3 gap-4">
              <AnimatedStat value={78} label="Wellness Score" suffix="%" />
              <AnimatedStat value={12} label="Day Streak" />
              <AnimatedStat value={24} label="Entries" />
            </div>
          </AnimatedCard>

          {/* Animated Progress Bar */}
          <AnimatedCard className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Animated Progress Bar</h2>
            <div className="space-y-4">
              <AnimatedProgressBar 
                value={75} 
                max={100} 
                label="Mindfulness"
                color="bg-blue-500" 
              />
              <AnimatedProgressBar 
                value={60} 
                max={100} 
                label="Sleep Quality"
                color="bg-green-500" 
              />
              <AnimatedProgressBar 
                value={90} 
                max={100} 
                label="Social Connection"
                color="bg-purple-500" 
              />
            </div>
          </AnimatedCard>

          {/* Breathing Exercise */}
          <AnimatedCard className="bg-white rounded-xl shadow-md p-6 lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Breathing Exercise</h2>
            <div className="max-w-md mx-auto">
              <BreathingExercise />
            </div>
          </AnimatedCard>

          {/* Voice Analyzer */}
          <AnimatedCard className="bg-white rounded-xl shadow-md p-6 lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Voice Analyzer</h2>
            <VoiceAnalyzer />
          </AnimatedCard>

          {/* Face Analyzer */}
          <AnimatedCard className="bg-white rounded-xl shadow-md p-6 lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Face Analyzer</h2>
            <FaceAnalyzer />
          </AnimatedCard>

          {/* Fusion Results */}
          <AnimatedCard className="bg-white rounded-xl shadow-md p-6 lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Fusion Results</h2>
            <FusionResults />
          </AnimatedCard>
        </div>
      </div>
    </div>
  )
}

export default ComponentsDemoPage
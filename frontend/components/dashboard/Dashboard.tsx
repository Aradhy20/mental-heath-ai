'use client'

import React, { useEffect, useState } from 'react'
import MoodTrendChart from '@/components/dashboard/MoodTrendChart'
import ProgressRing from '@/components/dashboard/ProgressRing'
import EmotionWordCloud from '@/components/dashboard/EmotionWordCloud'
import { useMoodStore, useUserStore } from '@/lib/store'
import api from '@/lib/api'
import AnimatedCard from '@/components/animations/AnimatedCard'
import StaggeredAnimationContainer from '@/components/animations/StaggeredAnimationContainer'
import AnimatedStat from '@/components/animations/AnimatedStat'
import AnimatedProgressBar from '@/components/animations/AnimatedProgressBar'

// Define types for our data
interface MoodData {
  date: string
  mood: number
  emotion: string
}

interface EmotionData {
  emotion: string
  count: number
}

const Dashboard = () => {
  const { moodHistory, setMoodHistory } = useMoodStore()
  const { user } = useUserStore()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMoodHistory = async () => {
      if (!user) return
      
      try {
        setLoading(true)
        const data = await api.getEmotionHistory(user.user_id)
        setMoodHistory(data.history || [])
        setError(null)
      } catch (err) {
        console.error('Failed to fetch mood history:', err)
        setError('Failed to load mood history')
      } finally {
        setLoading(false)
      }
    }

    fetchMoodHistory()
  }, [user, setMoodHistory])

  // Mock data for demonstration
  const mockMoodData: MoodData[] = [
    { date: '2023-01-01', mood: 7, emotion: 'Happy' },
    { date: '2023-01-02', mood: 5, emotion: 'Neutral' },
    { date: '2023-01-03', mood: 3, emotion: 'Sad' },
    { date: '2023-01-04', mood: 8, emotion: 'Excited' },
    { date: '2023-01-05', mood: 6, emotion: 'Calm' },
    { date: '2023-01-06', mood: 4, emotion: 'Anxious' },
    { date: '2023-01-07', mood: 9, emotion: 'Joyful' },
  ]

  const moodData: MoodData[] = moodHistory.length > 0 ? moodHistory : mockMoodData

  // Calculate average mood
  const averageMood = moodData.reduce((sum: number, entry: MoodData) => sum + entry.mood, 0) / moodData.length || 0

  // Mock emotion distribution for word cloud
  const emotionDistribution: EmotionData[] = [
    { emotion: 'Happy', count: 12 },
    { emotion: 'Calm', count: 8 },
    { emotion: 'Anxious', count: 5 },
    { emotion: 'Excited', count: 7 },
    { emotion: 'Sad', count: 3 },
    { emotion: 'Angry', count: 2 },
    { emotion: 'Peaceful', count: 6 },
    { emotion: 'Stressed', count: 4 },
  ]

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mental Health Dashboard</h1>
        <p className="text-gray-600 mt-2">Track and understand your emotional well-being</p>
      </header>

      {error && (
        <AnimatedCard className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </AnimatedCard>
      )}

      {/* Stats Overview */}
      <StaggeredAnimationContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <AnimatedCard delay={0.1} className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="rounded-lg bg-blue-100 p-3">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Average Mood</h3>
              <p className="text-2xl font-semibold text-gray-900">{averageMood.toFixed(1)}</p>
            </div>
          </div>
        </AnimatedCard>

        <AnimatedCard delay={0.2} className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="rounded-lg bg-green-100 p-3">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Entries This Week</h3>
              <p className="text-2xl font-semibold text-gray-900">{moodData.length}</p>
            </div>
          </div>
        </AnimatedCard>

        <AnimatedCard delay={0.3} className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="rounded-lg bg-purple-100 p-3">
              <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Trend</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {moodData.length >= 2 ? 
                  moodData[moodData.length - 1].mood >= moodData[moodData.length - 2].mood ? 'Improving' : 'Declining' 
                  : 'Not enough data'}
              </p>
            </div>
          </div>
        </AnimatedCard>
      </StaggeredAnimationContainer>

      {/* Main Charts */}
      <StaggeredAnimationContainer className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8" staggerDelay={0.2}>
        <AnimatedCard delay={0.1} className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Mood Trend</h2>
          <MoodTrendChart data={moodData} />
        </AnimatedCard>

        <AnimatedCard delay={0.3} className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Emotional Insights</h2>
          <EmotionWordCloud data={emotionDistribution} />
        </AnimatedCard>
      </StaggeredAnimationContainer>

      {/* Progress Section */}
      <AnimatedCard className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Wellness Goals</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AnimatedProgressBar 
            value={75} 
            max={100} 
            label="Mindfulness" 
            color="bg-primary" 
          />
          <AnimatedProgressBar 
            value={60} 
            max={100} 
            label="Sleep Quality" 
            color="bg-secondary" 
          />
          <AnimatedProgressBar 
            value={90} 
            max={100} 
            label="Social Connection" 
            color="bg-accent" 
          />
        </div>
      </AnimatedCard>
    </div>
  )
}

export default Dashboard
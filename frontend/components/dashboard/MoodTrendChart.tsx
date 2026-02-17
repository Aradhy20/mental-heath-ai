'use client'

import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface MoodData {
  date: string
  mood: number
  emotion: string
}

interface MoodTrendChartProps {
  data: MoodData[]
}

const MoodTrendChart: React.FC<MoodTrendChartProps> = ({ data }) => {
  // Format data for the chart
  const chartData = data.map((item: MoodData) => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    mood: item.mood,
    emotion: item.emotion
  }))

  const formatter = (value: any, name: any) => [value, 'Mood Score']
  const labelFormatter = (label: any) => `Date: ${label}`

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            stroke="#6b7280" 
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            domain={[0, 10]} 
            stroke="#6b7280" 
            tick={{ fontSize: 12 }}
            tickCount={6}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              borderRadius: '0.5rem', 
              border: '1px solid #e5e7eb',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}
            formatter={formatter}
            labelFormatter={labelFormatter}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="mood" 
            name="Mood Score" 
            stroke="#6366f1" 
            strokeWidth={2}
            dot={{ stroke: '#6366f1', strokeWidth: 2, r: 4, fill: 'white' }}
            activeDot={{ r: 6, fill: '#6366f1' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default MoodTrendChart
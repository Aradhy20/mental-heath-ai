'use client'

import React, { useEffect, useRef } from 'react'

interface EmotionData {
  emotion: string
  count: number
}

interface EmotionWordCloudProps {
  data: EmotionData[]
}

const EmotionWordCloud: React.FC<EmotionWordCloudProps> = ({ data }: { data: EmotionData[] }) => {
  const svgRef = useRef<SVGSVGElement>(null)

  // Calculate sizes based on count
  const getSize = (count: number, maxCount: number) => {
    const minSize = 16
    const maxSize = 48
    return minSize + (count / maxCount) * (maxSize - minSize)
  }

  // Get color based on emotion
  const getColor = (emotion: string) => {
    const colorMap: Record<string, string> = {
      'Happy': '#10b981', // green
      'Calm': '#6366f1', // indigo
      'Anxious': '#f59e0b', // amber
      'Excited': '#ec4899', // pink
      'Sad': '#64748b', // slate
      'Angry': '#ef4444', // red
      'Peaceful': '#06b6d4', // cyan
      'Stressed': '#f97316', // orange
    }
    return colorMap[emotion] || '#8b5cf6' // purple as default
  }

  // Find max count for sizing
  const maxCount = Math.max(...data.map((item: EmotionData) => item.count), 1)

  return (
    <div className="h-80 flex items-center justify-center">
      <svg 
        ref={svgRef}
        width="100%" 
        height="100%" 
        viewBox="0 0 400 300"
        className="overflow-visible"
      >
        {data.map((item: EmotionData, index: number) => {
          const size = getSize(item.count, maxCount)
          // Simple positioning algorithm (in a real app, you might want a more sophisticated layout)
          const x = 50 + (index % 4) * 80 + Math.random() * 20
          const y = 80 + Math.floor(index / 4) * 60 + Math.random() * 20
          
          return (
            <g key={item.emotion}>
              <text
                x={x}
                y={y}
                fontSize={size}
                fontWeight="bold"
                fill={getColor(item.emotion)}
                textAnchor="middle"
                dominantBaseline="middle"
                className="cursor-pointer transition-all hover:opacity-75"
              >
                {item.emotion}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export default EmotionWordCloud
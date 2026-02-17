'use client'

import React from 'react'

interface ProgressRingProps {
  value: number
  max: number
  label: string
  color: string
}

const ProgressRing: React.FC<ProgressRingProps> = ({ value, max, label, color }) => {
  const radius = 50
  const circumference = 2 * Math.PI * radius
  const progress = (value / max) * 100
  const strokeDashoffset = circumference - (progress / 100) * circumference

  // Color mapping
  const colorClasses: Record<string, string> = {
    primary: 'stroke-primary',
    secondary: 'stroke-secondary',
    accent: 'stroke-accent',
    neutral: 'stroke-neutral',
    success: 'stroke-success',
    warning: 'stroke-warning',
    error: 'stroke-error'
  }

  const bgColorClasses: Record<string, string> = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    accent: 'text-accent',
    neutral: 'text-neutral',
    success: 'text-success',
    warning: 'text-warning',
    error: 'text-error'
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full" viewBox="0 0 120 120">
          {/* Background circle */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="10"
          />
          {/* Progress circle */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            strokeWidth="10"
            transform="rotate(-90 60 60)"
            className={colorClasses[color] || 'stroke-primary'}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-2xl font-bold ${bgColorClasses[color] || 'text-primary'}`}>
            {Math.round(progress)}%
          </span>
        </div>
      </div>
      <h3 className="mt-4 text-lg font-medium text-gray-900">{label}</h3>
      <p className="text-sm text-gray-500">{value} of {max}</p>
    </div>
  )
}

export default ProgressRing
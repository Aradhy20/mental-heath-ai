'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface DashboardCardProps {
  title: string
  value: string | number
  description?: string
  icon?: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
  onClick?: () => void
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  description,
  icon,
  trend,
  className = '',
  onClick
}) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      className={`glass-panel p-6 rounded-[2rem] border border-white/5 cursor-pointer relative overflow-hidden group ${className}`}
      onClick={onClick}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150" />

      <div className="flex justify-between items-start relative z-10">
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</h3>
          <p className="mt-2 text-3xl font-display font-bold text-white tracking-tight">{value}</p>
          {description && (
            <p className="mt-1 text-xs text-slate-500 font-medium">{description}</p>
          )}
        </div>
        {icon && (
          <div className="p-3 rounded-2xl bg-violet-500/10 text-violet-400 group-hover:bg-violet-500 group-hover:text-white transition-colors shadow-inner">
            {icon}
          </div>
        )}
      </div>

      {trend && (
        <div className="mt-4 flex items-center relative z-10">
          <span className={`inline-flex items-center text-xs font-bold px-2 py-0.5 rounded-full ${trend.isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
            }`}>
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
          <span className="ml-2 text-[10px] text-slate-500 font-medium uppercase tracking-wide">vs last week</span>
        </div>
      )}
    </motion.div>
  )
}

export default DashboardCard
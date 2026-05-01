import React from 'react'
import { cn } from '@/lib/utils'

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function GlassCard({ className, children, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass rounded-[3rem] p-8 border border-white/5 shadow-2xl relative overflow-hidden",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Bot, User } from 'lucide-react'

interface AIChatBubbleProps {
    message: string
    isAi?: boolean
    timestamp?: string
}

const AIChatBubble = ({ message, isAi = false, timestamp }: AIChatBubbleProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={cn(
                "flex gap-4 max-w-[80%] mb-4",
                isAi ? "mr-auto" : "ml-auto flex-row-reverse"
            )}
        >
            <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm",
                isAi ? "bg-white dark:bg-aurora-800 text-serenity-600 dark:text-aurora-300" : "bg-serenity-500 dark:bg-aurora-500 text-white"
            )}>
                {isAi ? <Bot size={20} /> : <User size={20} />}
            </div>

            <div className={cn(
                "p-4 rounded-2xl shadow-sm backdrop-blur-sm",
                isAi
                    ? "bg-white/80 dark:bg-white/10 rounded-tl-none text-foreground"
                    : "bg-serenity-500 dark:bg-aurora-500 rounded-tr-none text-white"
            )}>
                <p className="text-sm leading-relaxed">{message}</p>
                {timestamp && (
                    <span className={cn(
                        "text-[10px] mt-2 block opacity-70",
                        isAi ? "text-muted-foreground" : "text-white/80"
                    )}>
                        {timestamp}
                    </span>
                )}
            </div>
        </motion.div>
    )
}

export default AIChatBubble

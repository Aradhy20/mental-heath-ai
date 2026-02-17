'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { format, startOfWeek, addDays, startOfMonth, endOfMonth, endOfWeek, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const AnimatedCalendar = () => {
    const [currentMonth, setCurrentMonth] = React.useState(new Date())
    const [selectedDate, setSelectedDate] = React.useState(new Date())

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))

    const renderHeader = () => {
        const dateFormat = "MMMM yyyy"
        return (
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">
                    {format(currentMonth, dateFormat)}
                </h2>
                <div className="flex gap-2">
                    <button onClick={prevMonth} className="p-2 hover:bg-muted rounded-full transition-colors">
                        <ChevronLeft size={20} />
                    </button>
                    <button onClick={nextMonth} className="p-2 hover:bg-muted rounded-full transition-colors">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        )
    }

    const renderDays = () => {
        const dateFormat = "EEEEE"
        const days = []
        let startDate = startOfWeek(currentMonth)
        for (let i = 0; i < 7; i++) {
            days.push(
                <div key={i} className="text-center text-xs font-medium text-muted-foreground uppercase py-2">
                    {format(addDays(startDate, i), dateFormat)}
                </div>
            )
        }
        return <div className="grid grid-cols-7 mb-2">{days}</div>
    }

    const renderCells = () => {
        const monthStart = startOfMonth(currentMonth)
        const monthEnd = endOfMonth(monthStart)
        const startDate = startOfWeek(monthStart)
        const endDate = endOfWeek(monthEnd)

        const dateFormat = "d"
        const rows = []
        let days = []
        let day = startDate
        let formattedDate = ""

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                formattedDate = format(day, dateFormat)
                const cloneDay = day

                days.push(
                    <motion.div
                        key={day.toString()}
                        className={cn(
                            "relative h-10 w-10 mx-auto flex items-center justify-center rounded-full cursor-pointer transition-colors text-sm",
                            !isSameMonth(day, monthStart) ? "text-muted-foreground/30" :
                                isSameDay(day, selectedDate) ? "bg-serenity-500 dark:bg-aurora-500 text-white shadow-glow" :
                                    "hover:bg-muted text-foreground"
                        )}
                        onClick={() => setSelectedDate(cloneDay)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <span>{formattedDate}</span>
                        {/* Mood Indicator Dot (Random for demo) */}
                        {isSameMonth(day, monthStart) && Math.random() > 0.5 && (
                            <div className={cn(
                                "absolute bottom-1 w-1 h-1 rounded-full",
                                Math.random() > 0.5 ? "bg-green-400" : "bg-purple-400"
                            )} />
                        )}
                    </motion.div>
                )
                day = addDays(day, 1)
            }
            rows.push(
                <div key={day.toString()} className="grid grid-cols-7 gap-y-2">
                    {days}
                </div>
            )
            days = []
        }
        return <div>{rows}</div>
    }

    return (
        <div className="w-full">
            {renderHeader()}
            {renderDays()}
            {renderCells()}
        </div>
    )
}

export default AnimatedCalendar

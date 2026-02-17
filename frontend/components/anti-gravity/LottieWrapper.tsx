'use client'

import React from 'react'
import Lottie, { LottieComponentProps } from 'lottie-react'
import { cn } from '@/lib/utils'

interface LottieWrapperProps extends LottieComponentProps {
    className?: string
}

const LottieWrapper = ({ className, ...props }: LottieWrapperProps) => {
    return (
        <div className={cn('relative', className)}>
            <Lottie {...props} />
        </div>
    )
}

export default LottieWrapper

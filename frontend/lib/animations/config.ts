/**
 * Animation Configuration & Presets
 * Central hub for all animation values in the app
 */

export const animationPresets = {
    // Spring Physics
    spring: {
        gentle: { type: "spring" as const, stiffness: 100, damping: 15 },
        bouncy: { type: "spring" as const, stiffness: 300, damping: 20 },
        smooth: { type: "spring" as const, stiffness: 200, damping: 25 },
        zen: { type: "spring" as const, stiffness: 80, damping: 20 },
    },

    // Transitions
    transitions: {
        fade: { duration: 0.3, ease: "easeInOut" },
        slide: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as any },
        zen: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as any },
        quick: { duration: 0.2, ease: "easeOut" },
    },

    // Emotion-based animations
    emotions: {
        joy: {
            scale: 1.05,
            duration: 0.5,
            ease: "backOut",
            color: { from: "#FBBF24", to: "#F59E0B" }
        },
        calm: {
            scale: 1,
            duration: 1.2,
            ease: "linear",
            color: { from: "#10B981", to: "#059669" }
        },
        sadness: {
            scale: 0.98,
            duration: 0.8,
            ease: "easeOut",
            color: { from: "#3B82F6", to: "#2563EB" }
        },
        anxiety: {
            scale: [1, 1.02, 1],
            duration: 0.3,
            color: { from: "#EF4444", to: "#DC2626" }
        },
        neutral: {
            scale: 1,
            duration: 0.5,
            ease: "easeInOut",
            color: { from: "#8B5CF6", to: "#7C3AED" }
        }
    }
}

// Motion tokens for consistent timing
export const motionTokens = {
    duration: {
        instant: 0,
        fast: 150,
        normal: 300,
        slow: 500,
        zen: 800,
    },
    easing: {
        smooth: [0.4, 0, 0.2, 1],
        bounce: [0.68, -0.55, 0.265, 1.55],
        zen: [0.25, 0.1, 0.25, 1],
        elastic: [0.175, 0.885, 0.32, 1.275],
    }
}

// Emotion color palettes
export const emotionColors = {
    joy: {
        from: "#FBBF24",
        to: "#F59E0B",
        light: "#FEF3C7",
        dark: "#D97706"
    },
    calm: {
        from: "#10B981",
        to: "#059669",
        light: "#D1FAE5",
        dark: "#047857"
    },
    sadness: {
        from: "#3B82F6",
        to: "#2563EB",
        light: "#DBEAFE",
        dark: "#1D4ED8"
    },
    anxiety: {
        from: "#EF4444",
        to: "#DC2626",
        light: "#FEE2E2",
        dark: "#B91C1C"
    },
    neutral: {
        from: "#8B5CF6",
        to: "#7C3AED",
        light: "#EDE9FE",
        dark: "#6D28D9"
    }
}

// Stagger children animation
export const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        }
    }
}

export const staggerItem = {
    hidden: { opacity: 0, y: 20 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: [0.4, 0, 0.2, 1]
        }
    }
}

// Page transition variants
export const pageVariants = {
    initial: { opacity: 0, x: -20 },
    animate: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1]
        }
    },
    exit: {
        opacity: 0,
        x: 20,
        transition: {
            duration: 0.3
        }
    }
}

// Hover scale effect
export const hoverScale = {
    scale: 1.02,
    transition: {
        duration: 0.2,
        ease: "easeOut"
    }
}

// Tap effect
export const tapEffect = {
    scale: 0.98,
    transition: {
        duration: 0.1
    }
}

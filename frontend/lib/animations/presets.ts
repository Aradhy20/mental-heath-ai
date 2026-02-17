/**
 * Gen Z Optimized Animation Library
 * Fast, smooth, and visually stunning animations
 */

export const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
}

export const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2 }
}

export const scaleIn = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] }
}

export const slideInLeft = {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 30 },
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
}

export const slideInRight = {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
}

export const bounceIn = {
    initial: { opacity: 0, scale: 0.3 },
    animate: {
        opacity: 1,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 260,
            damping: 20
        }
    }
}

export const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0.1
        }
    }
}

export const staggerItem = {
    hidden: { opacity: 0, y: 10 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.3,
            ease: [0.22, 1, 0.36, 1]
        }
    }
}

export const hoverScale = {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.98 },
    transition: { type: "spring", stiffness: 400, damping: 17 }
}

export const hoverLift = {
    whileHover: { y: -4, transition: { duration: 0.2 } },
    whileTap: { scale: 0.98 }
}

export const shimmer = {
    animate: {
        backgroundPosition: ["200% 0", "-200% 0"],
    },
    transition: {
        duration: 8,
        ease: "linear",
        repeat: Infinity,
    }
}

export const pulse = {
    animate: {
        scale: [1, 1.05, 1],
        opacity: [1, 0.8, 1],
    },
    transition: {
        duration: 2,
        ease: "easeInOut",
        repeat: Infinity,
    }
}

export const float = {
    animate: {
        y: [0, -10, 0],
    },
    transition: {
        duration: 3,
        ease: "easeInOut",
        repeat: Infinity,
    }
}

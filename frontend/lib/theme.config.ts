/* Enhanced Theme Configuration */

export const theme = {
    colors: {
        // Mental Health Focused Palette
        primary: {
            50: '#f0f9ff',
            100: '#e0f2fe',
            200: '#bae6fd',
            300: '#7dd3fc',
            400: '#38bdf8',
            500: '#0ea5e9',  // Main brand color - calming blue
            600: '#0284c7',
            700: '#0369a1',
            800: '#075985',
            900: '#0c4a6e',
        },
        serenity: {
            50: '#f0fdf4',
            100: '#dcfce7',
            200: '#bbf7d0',
            300: '#86efac',
            400: '#4ade80',
            500: '#22c55e',  // Calming green
            600: '#16a34a',
            700: '#15803d',
            800: '#166534',
            900: '#14532d',
        },
        warmth: {
            50: '#fff7ed',
            100: '#ffedd5',
            200: '#fed7aa',
            300: '#fdba74',
            400: '#fb923c',
            500: '#f97316',  // Warm orange for encouragement
            600: '#ea580c',
            700: '#c2410c',
            800: '#9a3412',
            900: '#7c2d12',
        },
        calm: {
            50: '#f5f3ff',
            100: '#ede9fe',
            200: '#ddd6fe',
            300: '#c4b5fd',
            400: '#a78bfa',
            500: '#8b5cf6',  // Peaceful purple
            600: '#7c3aed',
            700: '#6d28d9',
            800: '#5b21b6',
            900: '#4c1d95',
        },
        // Functional colors
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
    },

    spacing: {
        xs: '0.25rem',    // 4px
        sm: '0.5rem',     // 8px
        md: '1rem',       // 16px
        lg: '1.5rem',     // 24px
        xl: '2rem',       // 32px
        '2xl': '3rem',    // 48px
        '3xl': '4rem',    // 64px
        '4xl': '6rem',    // 96px
    },

    typography: {
        fontFamily: {
            display: "'Inter', 'Outfit', sans-serif",
            body: "'Inter', system-ui, sans-serif",
            mono: "'JetBrains Mono', monospace",
        },
        fontSize: {
            xs: '0.75rem',      // 12px
            sm: '0.875rem',     // 14px
            base: '1rem',       // 16px
            lg: '1.125rem',     // 18px
            xl: '1.25rem',      // 20px
            '2xl': '1.5rem',    // 24px
            '3xl': '1.875rem',  // 30px
            '4xl': '2.25rem',   // 36px
            '5xl': '3rem',      // 48px
            '6xl': '3.75rem',   // 60px
        },
        fontWeight: {
            light: 300,
            normal: 400,
            medium: 500,
            semibold: 600,
            bold: 700,
            extrabold: 800,
        },
        lineHeight: {
            tight: 1.25,
            normal: 1.5,
            relaxed: 1.75,
            loose: 2,
        },
    },

    borderRadius: {
        none: '0',
        sm: '0.375rem',   // 6px
        md: '0.5rem',     // 8px
        lg: '0.75rem',    // 12px
        xl: '1rem',       // 16px
        '2xl': '1.5rem',  // 24px
        '3xl': '2rem',    // 32px
        full: '9999px',
    },

    shadows: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        glow: '0 0 20px rgba(14, 165, 233, 0.5)',
        glowWarm: '0 0 20px rgba(249, 115, 22, 0.5)',
    },

    animation: {
        // Duration in milliseconds
        duration: {
            fast: 150,
            normal: 300,
            slow: 500,
            slower: 800,
        },
        // Easing functions
        easing: {
            default: 'cubic-bezier(0.4, 0, 0.2, 1)',
            linear: 'linear',
            in: 'cubic-bezier(0.4, 0, 1, 1)',
            out: 'cubic-bezier(0, 0, 0.2, 1)',
            inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
            spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        },
    },

    breakpoints: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
    },

    zIndex: {
        base: 0,
        dropdown: 1000,
        sticky: 1020,
        fixed: 1030,
        modalBackdrop: 1040,
        modal: 1050,
        popover: 1060,
        tooltip: 1070,
    },
};

export type Theme = typeof theme;

// Export individual theme sections for easy import
export const { colors, spacing, typography, borderRadius, shadows, animation, breakpoints, zIndex } = theme;

export default theme;

import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Serenity Light (Default)
        serenity: {
          50: '#f4f7f5',
          100: '#e3ebe5',
          200: '#c5d8cc',
          300: '#9ebfae',
          400: '#76a18d',
          500: '#558571',
          600: '#416958',
          700: '#355447',
          800: '#2d433a',
          900: '#263831',
        },
        // Aurora Dark
        aurora: {
          50: '#f2f0ff',
          100: '#e6e3ff',
          200: '#d1ccff',
          300: '#ada3ff',
          400: '#8570ff',
          500: '#633bff',
          600: '#521ce6',
          700: '#4313c2',
          800: '#38129e',
          900: '#1e0b5e', // Deep Navy
        },
        // Neo-Pastel
        pastel: {
          peach: '#ffe5d9',
          blue: '#dbe7e4',
          mint: '#e2f0cb',
          violet: '#e0c3fc',
        },
        // Minimal Black/White
        minimal: {
          black: '#0a0a0a',
          white: '#fafafa',
          graphite: '#262626',
          gold: '#d4af37',
        },

        // Semantic Colors (mapped to CSS variables)
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',

        // Functional Colors
        neutral: '#262626',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
      },
      backgroundImage: {
        'aurora-gradient': 'linear-gradient(135deg, rgba(99, 59, 255, 0.1) 0%, rgba(85, 133, 113, 0.1) 50%, rgba(224, 195, 252, 0.1) 100%)',
        'aurora-dark-gradient': 'linear-gradient(135deg, rgba(30, 11, 94, 0.4) 0%, rgba(67, 19, 194, 0.2) 50%, rgba(10, 10, 10, 0.8) 100%)',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'glass-lg': '0 12px 48px 0 rgba(31, 38, 135, 0.1)',
        'float': '0 10px 30px -10px rgba(0, 0, 0, 0.1)',
        'float-hover': '0 20px 40px -10px rgba(0, 0, 0, 0.15)',
        'glow': '0 0 20px rgba(99, 59, 255, 0.3)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'breathe': 'breathe 8s ease-in-out infinite',
        'aurora': 'aurora 20s ease infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'spin-slow': 'spin 12s linear infinite',
        'bounce-slow': 'bounce 3s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.9' },
          '50%': { transform: 'scale(1.05)', opacity: '1' },
        },
        aurora: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
// MindfulAI Mobile — Ultra-Premium Design System
export const COLORS = {
  background:  '#1C1B1F', // M3 Surface
  surface:     '#2B2930', // M3 Surface Container
  surfaceHighlight: '#332F37',
  border:      '#49454F', // M3 Outline
  borderHighlight: '#938F99',
  
  // Material 3 Primary / Violet
  primary:     '#D0BCFF',
  onPrimary:   '#381E72',
  primaryContainer: '#4F378B',
  onPrimaryContainer: '#EADDFF',
  
  secondary:   '#CCC2DC',
  onSecondary: '#332D41',
  
  text:        '#E6E1E5', // M3 On Surface
  textMuted:   '#938F99', // M3 Outline
  textSecond:  '#CAC4D0', // M3 On Surface Variant
  
  // Semantic
  emerald:     '#B4E49A', // M3 Positive
  amber:       '#FFB900', // M3 Warning
  rose:        '#F2B8B5', // M3 Error
  cyan:        '#A1CED4',
  
  glassLight:  'rgba(255, 255, 255, 0.04)',
  glassMedium: 'rgba(255, 255, 255, 0.08)',
} as const

export const FONTS = {
  black:    '900' as const,
  bold:     '700' as const,
  semibold: '600' as const,
  medium:   '500' as const,
  regular:  '400' as const,
  light:    '300' as const,
}

export const RADIUS = {
  sm:   8,
  md:   12,
  lg:   16,
  xl:   24,
  '2xl': 32,
  '3xl': 40,
  full: 9999,
} as const

export const SPACING = {
  xs: 4, sm: 8, md: 12, lg: 16, xl: 20, '2xl': 24, '3xl': 32, '4xl': 48, '5xl': 64
} as const

export const SHADOWS = {
  sm: '0px 2px 4px rgba(0, 0, 0, 0.1)',
  md: '0px 4px 8px rgba(0, 0, 0, 0.12)',
  lg: '0px 8px 16px rgba(0, 0, 0, 0.15)',
  glow: '0px 0px 20px rgba(139, 92, 246, 0.4)',
} as const

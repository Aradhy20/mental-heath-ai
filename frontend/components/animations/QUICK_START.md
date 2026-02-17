# 🎨 Animation Components - Quick Start Guide

## Installation

All animation components are already installed and ready to use!

## Import

```typescript
// Individual imports
import DynamicWellnessCard from '@/components/animations/DynamicWellnessCard'
import EmotionParticles from '@/components/animations/EmotionParticles'
import AnimatedButton from '@/components/animations/AnimatedButton'

// Or use barrel import
import { DynamicWellnessCard, EmotionParticles, AnimatedButton } from '@/components/animations'
```

## Quick Examples

### 1. Wellness Card with Animation
```tsx
<DynamicWellnessCard
  score={85}
  previousScore={78}
  label="Daily Wellness"
  subtitle="Great progress!"
/>
```

### 2. Emotion Particles
```tsx
const [emotion, setEmotion] = useState('calm')

<EmotionParticles 
  emotion={emotion}
  intensity={0.5}
  particleCount={30}
/>
```

### 3. Animated Buttons
```tsx
import { PrimaryButton, OutlineButton } from '@/components/animations'

<PrimaryButton 
  icon={<Heart size={16} />}
  loading={isLoading}
  onClick={handleClick}
>
  Save Progress
</PrimaryButton>
```

### 4. Smart Skeletons
```tsx
import { SkeletonCard, SmartSkeleton } from '@/components/animations'

{loading ? (
  <SkeletonCard />
) : (
  <ActualCard />
)}
```

### 5. Page Transitions
```tsx
import PageTransition from '@/components/animations/PageTransition'

export default function MyPage() {
  return (
    <PageTransition>
      <div>Your content</div>
    </PageTransition>
  )
}
```

### 6. Mood Background
```tsx
<MoodWaveBackground 
  mood="calm"
  intensity={0.6}
/>
```

### 7. Celebration Effects
```tsx
import CelebrationEffect from '@/components/animations/CelebrationEffect'

const [celebrate, setCelebrate] = useState(false)

<CelebrationEffect
  trigger={celebrate}
  onComplete={() => setCelebrate(false)}
/>
```

### 8. Animated Inputs
```tsx
import AnimatedInput from '@/components/animations/AnimatedInput'

<AnimatedInput
  label="Your Name"
  error={errors.name}
  success={isValid}
  helperText="Enter your full name"
/>
```

## Emotion Integration

Connect with your AI analysis:

```tsx
const [currentEmotion, setCurrentEmotion] = useState('neutral')

// After text analysis
const handleAnalysis = async (text: string) => {
  const result = await api.analyzeText(text)
  
  // Map AI emotion to component emotion
  const emotionMap = {
    'happy': 'joy',
    'sad': 'sadness',
    'anxious': 'anxiety',
    'peaceful': 'calm',
    'neutral': 'neutral'
  }
  
  setCurrentEmotion(emotionMap[result.emotion_label])
}

// Use in components
<EmotionParticles emotion={currentEmotion} />
<MoodWaveBackground mood={currentEmotion} />
```

## Performance Tips

1. **Reduce Motion**: Components respect `prefers-reduced-motion`
2. **Particle Count**: Start with 20-30 particles, increase if smooth
3. **Canvas Optimization**: Particles use requestAnimationFrame
4. **Memoization**: Heavy computations are memoized

## Customization

All components accept `className` for Tailwind styling:

```tsx
<AnimatedButton 
  className="my-custom-class"
  variant="primary"
>
  Custom Button
</AnimatedButton>
```

## Demo Page

See all components in action:
```
Navigate to: /animations-demo
```

## TypeScript Support

All components are fully typed:

```typescript
import type { EmotionType } from '@/lib/animations/config'

const emotion: EmotionType = 'joy' // Type-safe!
```

---

**That's it!** Start using premium animations everywhere! 🚀

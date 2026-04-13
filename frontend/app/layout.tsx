import './globals.css'
import type { Metadata, Viewport } from 'next'
import EnterpriseAppShell from '@/components/layout/EnterpriseAppShell'

export const metadata: Metadata = {
  title: {
    default: 'MindfulAI — Your Mental Wellness Companion',
    template: '%s | MindfulAI'
  },
  description: 'MindfulAI helps you track your mood, journal your thoughts, find therapists nearby, and talk to an AI companion trained to support your mental wellness.',
  keywords: ['mental health', 'AI therapist', 'mood tracking', 'journal', 'wellness', 'anxiety support', 'meditation'],
  authors: [{ name: 'MindfulAI Team' }],
  openGraph: {
    type: 'website',
    title: 'MindfulAI — Your Mental Wellness Companion',
    description: 'AI-powered mental wellness platform. Track mood, journal, find therapists, and get 24/7 AI support.',
    siteName: 'MindfulAI',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning className="antialiased font-sans overflow-x-hidden">
        <EnterpriseAppShell>
          {children}
        </EnterpriseAppShell>
      </body>
    </html>
  )
}

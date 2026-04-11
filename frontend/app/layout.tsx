import './globals.css'
import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'
import EnterpriseAppShell from '@/components/layout/EnterpriseAppShell'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })

export const metadata: Metadata = {
  title: 'CalmSpace – Your Mental Wellness Companion 💜',
  description: 'CalmSpace helps you track your mood, journal your thoughts, and talk to AI guides who actually get you. Built for the young generation.',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${inter.variable} ${outfit.variable} font-sans antialiased overflow-x-hidden`}>
        <EnterpriseAppShell>{children}</EnterpriseAppShell>
      </body>
    </html>
  )
}

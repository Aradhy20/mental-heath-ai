import './globals.css'
import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'
import ClientLayout from '@/components/layout/ClientLayout'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })

export const metadata: Metadata = {
  title: 'MindfulAI - Anti-Gravity Wellness',
  description: 'Next-generation mental health tracking with AI',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f4f7f5' },
    { media: '(prefers-color-scheme: dark)', color: '#1e0b5e' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${inter.variable} ${outfit.variable} font-sans antialiased overflow-x-hidden`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}

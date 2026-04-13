'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DoctorsRedirect() {
  const router = useRouter()
  useEffect(() => { router.replace('/therapists') }, [router])
  return null
}

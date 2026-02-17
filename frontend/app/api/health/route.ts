// route.ts
// Health check endpoint for the frontend

import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'mental-health-frontend',
    version: '1.0.0'
  })
}
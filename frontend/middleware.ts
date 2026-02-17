// middleware.ts
// Next.js middleware for handling authentication redirects

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define protected routes
const protectedRoutes = ['/dashboard', '/analysis']
const authRoutes = ['/login', '/register']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('token')?.value

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )

  // Check if the route is for authentication
  const isAuthRoute = authRoutes.some(route => 
    pathname.startsWith(route)
  )

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Redirect unauthenticated users to login page
  if (isProtectedRoute && !token) {
    const url = new URL('/login', request.url)
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

// Configure which routes to run middleware on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
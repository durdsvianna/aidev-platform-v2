import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from './src/lib/auth-utils'

export function middleware(request: NextRequest) {
  // Get current user information from localStorage on the client side
  // This is handled by the client components instead since middleware
  // doesn't have access to localStorage
  
  // Check if the requested path starts with /sidelayout
  if (request.nextUrl.pathname.startsWith('/sidelayout')) {
    // Get the JWT token from cookies
    const token = request.cookies.get('auth_token')?.value
    
    // If no token, redirect to login
    if (!token) {
      const url = request.nextUrl.pathname
      const redirectUrl = new URL('/login', request.url)
      redirectUrl.searchParams.set('redirectTo', url)
      return NextResponse.redirect(redirectUrl)
    }
    
    // Verify the token
    const decodedToken = verifyToken(token)
    
    // If token is invalid, redirect to login
    if (!decodedToken) {
      const url = request.nextUrl.pathname
      const redirectUrl = new URL('/login', request.url)
      redirectUrl.searchParams.set('redirectTo', url)
      return NextResponse.redirect(redirectUrl)
    }
  }
  
  return NextResponse.next()
}

export const config = {
  // Apply this middleware to the following paths
  matcher: ['/sidelayout/:path*'],
} 
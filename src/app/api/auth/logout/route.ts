import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  // Clear the auth token cookie
  cookies().set('auth_token', '', {
    maxAge: 0,
    path: '/'
  })
  
  return NextResponse.json({ 
    success: true,
    message: 'Logged out successfully'
  })
} 
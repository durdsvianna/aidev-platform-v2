import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import UserModel from '@/models/UserModel'
import { generateToken } from '@/lib/auth-utils'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic';

// Define the token response type
interface GoogleTokenResponse {
  access_token: string
  id_token: string
  expires_in: number
  refresh_token?: string
  token_type: string
  scope: string
}

// Define the user info response type
interface GoogleUserInfo {
  id: string
  email: string
  verified_email: boolean
  name: string
  given_name: string
  family_name: string
  picture: string
  locale: string
}

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    // Get the authorization code from the URL
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    // Check for error response
    if (error) {
      console.error('Google OAuth error:', error)
      return NextResponse.redirect(new URL('/login?error=google_auth_denied', request.url))
    }

    // Validate required parameters
    if (!code || !state) {
      console.error('Missing required parameters')
      return NextResponse.redirect(new URL('/login?error=missing_params', request.url))
    }

    // Verify state to prevent CSRF attacks
    const storedState = request.cookies.get('google_oauth_state')?.value
    if (!storedState || state !== storedState) {
      console.error('Invalid state parameter')
      return NextResponse.redirect(new URL('/login?error=invalid_state', request.url))
    }

    // Exchange authorization code for access token
    const tokenResponse = await fetchGoogleToken(code, request.nextUrl.origin)
    if (!tokenResponse) {
      return NextResponse.redirect(new URL('/login?error=token_exchange_failed', request.url))
    }

    // Get user information from Google
    const userInfo = await fetchGoogleUserInfo(tokenResponse.access_token)
    if (!userInfo) {
      return NextResponse.redirect(new URL('/login?error=user_info_failed', request.url))
    }

    // Find or create user
    let user = await UserModel.findOne({ googleId: userInfo.id });
    
    if (!user) {
      // Check if email already exists
      const existingUser = await UserModel.findOne({ email: userInfo.email });
      
      if (existingUser) {
        // Link Google account to existing user
        existingUser.googleId = userInfo.id;
        existingUser.googleProfilePicture = userInfo.picture;
        existingUser.isGoogleUser = true;
        existingUser.lastLogin = new Date();
        user = await existingUser.save();
      } else {
        // Create new user
        user = await UserModel.create({
          name: userInfo.name,
          email: userInfo.email,
          googleId: userInfo.id,
          googleProfilePicture: userInfo.picture,
          isGoogleUser: true,
          lastLogin: new Date()
        });
      }
    } else {
      // Update existing user
      user.lastLogin = new Date();
      user.googleProfilePicture = userInfo.picture; // Update profile picture
      await user.save();
    }
    
    // Generate JWT token
    const token = generateToken(user._id.toString());
    
    // Clear the state cookie & set auth token
    const response = NextResponse.redirect(new URL('/auth-success', request.url));
    response.cookies.set('google_oauth_state', '', { maxAge: 0, path: '/' });
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });
    
    return response;
  } catch (error) {
    console.error('Google OAuth callback error:', error)
    return NextResponse.redirect(new URL('/login?error=unexpected', request.url))
  }
}

async function fetchGoogleToken(code: string, origin: string): Promise<GoogleTokenResponse | null> {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${origin}/api/auth/google/callback`

    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId!,
        client_secret: clientSecret!,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      })
    })

    if (!response.ok) {
      console.error('Token exchange failed:', await response.text())
      return null
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching Google token:', error)
    return null
  }
}

async function fetchGoogleUserInfo(accessToken: string): Promise<GoogleUserInfo | null> {
  try {
    const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` }
    })

    if (!response.ok) {
      console.error('User info fetch failed:', await response.text())
      return null
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching Google user info:', error)
    return null
  }
} 
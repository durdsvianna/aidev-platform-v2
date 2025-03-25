import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import UserModel from '@/models/UserModel'
import { comparePasswords, generateToken } from '@/lib/auth-utils'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Connect to MongoDB
    await connectToDatabase()
    
    const body = await request.json()
    const { email, password } = body
    
    if (!email || !password) {
      return NextResponse.json({ 
        success: false,
        message: 'Email and password are required'
      }, { status: 400 })
    }
    
    // Find the user
    const user = await UserModel.findOne({ email })
    
    if (!user) {
      return NextResponse.json({ 
        success: false,
        message: 'Invalid email or password'
      }, { status: 401 })
    }
    
    // Verify password
    const isPasswordValid = await comparePasswords(password, user.password)
    
    if (!isPasswordValid) {
      return NextResponse.json({ 
        success: false,
        message: 'Invalid email or password'
      }, { status: 401 })
    }
    
    // Update lastLogin timestamp
    user.lastLogin = new Date()
    await user.save()
    
    // Generate JWT token
    const token = generateToken(user._id.toString())
    
    // Set the token as a cookie
    cookies().set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    })
    
    // Return user data without sensitive information
    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
        isGoogleUser: user.isGoogleUser,
        googleProfilePicture: user.googleProfilePicture
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ 
      success: false,
      message: 'An unexpected error occurred'
    }, { status: 500 })
  }
} 
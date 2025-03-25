import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import UserModel from '@/models/UserModel'
import { hashPassword, generateToken } from '@/lib/auth-utils'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Connect to MongoDB
    await connectToDatabase()
    
    const body = await request.json()
    const { name, email, password } = body
    
    if (!name || !email || !password) {
      return NextResponse.json({ 
        success: false,
        message: 'Name, email, and password are required'
      }, { status: 400 })
    }
    
    // Check if user with email already exists
    const existingUser = await UserModel.findOne({ email })
    
    if (existingUser) {
      return NextResponse.json({ 
        success: false,
        message: 'Email address is already registered'
      }, { status: 409 })
    }
    
    // Hash the password
    const hashedPassword = await hashPassword(password)
    
    // Create the new user in MongoDB
    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      lastLogin: new Date()
    })
    
    // Generate JWT token
    const token = generateToken(newUser._id.toString())
    
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
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        createdAt: newUser.createdAt,
        lastLogin: newUser.lastLogin
      }
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ 
      success: false,
      message: 'An unexpected error occurred'
    }, { status: 500 })
  }
} 
import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import UserModel from '@/models/UserModel'
import { verifyToken } from '@/lib/auth-utils'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Get the token from cookies
    const token = cookies().get('auth_token')?.value
    
    if (!token) {
      return NextResponse.json({ authenticated: false, user: null })
    }
    
    // Verify the token
    const decodedToken = verifyToken(token)
    
    if (!decodedToken || !decodedToken.userId) {
      return NextResponse.json({ authenticated: false, user: null })
    }
    
    // Get the user from the database
    await connectToDatabase()
    const user = await UserModel.findById(decodedToken.userId).select('-password')
    
    if (!user) {
      return NextResponse.json({ authenticated: false, user: null })
    }
    
    return NextResponse.json({
      authenticated: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        description: user.description,
        isGoogleUser: user.isGoogleUser,
        googleProfilePicture: user.googleProfilePicture,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      }
    })
  } catch (error) {
    console.error('Status check error:', error)
    return NextResponse.json({ authenticated: false, user: null })
  }
} 
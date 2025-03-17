import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database';
import AIModel from '@/models/AIModel';

// Check if we're in a build/static generation environment
const isServer = typeof window === 'undefined';
const isBuildTime = isServer && process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build';

// GET /api/models/active - Get all active AI models
export async function GET(request: NextRequest) {
  // During build, return empty array to avoid MongoDB connection errors
  if (isBuildTime) {
    console.log('Build-time call to /api/models/active - returning empty array');
    return NextResponse.json({ success: true, data: [] });
  }

  try {
    await connectToDatabase();
    
    // Get only active models without apiKey field
    const activeModels = await AIModel.find({ active: true }).select('-apiKey');
    
    return NextResponse.json({ success: true, data: activeModels });
  } catch (error) {
    console.error('Error fetching active AI models:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch active AI models' },
      { status: 500 }
    );
  }
} 
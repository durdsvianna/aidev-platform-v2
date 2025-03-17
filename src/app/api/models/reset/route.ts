import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database';
import AIModel from '@/models/AIModel';

// POST /api/models/reset - Reset the AIModel collection (for development use only)
export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { success: false, error: 'This endpoint is not available in production' },
      { status: 403 }
    );
  }
  
  try {
    await connectToDatabase();
    
    // Delete all models
    const result = await AIModel.deleteMany({});
    
    return NextResponse.json({
      success: true,
      message: `Successfully reset models collection. Deleted ${result.deletedCount} models.`,
      count: result.deletedCount
    });
  } catch (error) {
    console.error('Error resetting models collection:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to reset models collection',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
} 
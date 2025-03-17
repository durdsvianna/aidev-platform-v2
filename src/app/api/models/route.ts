import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database';
import AIModel, { IAIModel } from '@/models/AIModel';

// GET /api/models - Get all AI models
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    // Get query parameters for filtering
    const searchParams = request.nextUrl.searchParams;
    const provider = searchParams.get('provider');
    const active = searchParams.get('active');
    
    // Build query based on filters
    const query: any = {};
    if (provider) query.provider = provider;
    if (active !== null) query.active = active === 'true';
    
    // Get all models including apiKey field
    const models = await AIModel.find(query);
    
    return NextResponse.json({ success: true, data: models });
  } catch (error) {
    console.error('Error fetching AI models:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch AI models' },
      { status: 500 }
    );
  }
}

// POST /api/models - Create a new AI model
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.provider || !data.apiKey || !data.baseUrl) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Check if model with same name already exists
    const existingModel = await AIModel.findOne({ name: data.name });
    if (existingModel) {
      return NextResponse.json(
        { success: false, error: 'Model with this name already exists' },
        { status: 409 }
      );
    }
    
    // Store the API key as plain text - no encryption
    
    // Create new model
    const newModel = await AIModel.create(data);
    
    return NextResponse.json(
      { success: true, data: newModel },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating AI model:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create AI model' },
      { status: 500 }
    );
  }
}

// PUT and DELETE methods - Bulk operations not allowed for safety
export async function PUT() {
  return NextResponse.json(
    { success: false, error: 'Bulk update not allowed for safety. Use individual update endpoints.' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { success: false, error: 'Bulk delete not allowed for safety. Use individual delete endpoints.' },
    { status: 405 }
  );
} 
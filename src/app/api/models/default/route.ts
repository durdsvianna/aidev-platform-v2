import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database';
import AIModel from '@/models/AIModel';
import { encrypt } from '@/lib/encryption';

// POST /api/models/default - Add a default Anthropic/Claude model if it doesn't exist
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    // Check if API key was provided in the query
    const searchParams = request.nextUrl.searchParams;
    const apiKey = searchParams.get('apiKey');
    
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'API key is required as a query parameter' },
        { status: 400 }
      );
    }
    
    // Check if there's already a Claude model
    const existingModel = await AIModel.findOne({ provider: 'anthropic' });
    
    if (existingModel) {
      return NextResponse.json(
        { success: false, error: 'An Anthropic/Claude model already exists' },
        { status: 409 }
      );
    }
    
    // Encrypt the API key
    const encryptedApiKey = encrypt(apiKey);
    
    // Create a default Anthropic model
    const defaultModel = {
      name: 'Claude',
      provider: 'anthropic',
      apiKey: encryptedApiKey,
      baseUrl: 'https://api.anthropic.com',
      active: true,
      defaultParameters: {
        model: 'claude-3-opus-20240229',
        temperature: 0.7,
        max_tokens: 4000
      }
    };
    
    // Create the model
    const newModel = await AIModel.create(defaultModel);
    
    // Return the model without the API key
    const savedModel = await AIModel.findById(newModel._id).select('-apiKey');
    
    return NextResponse.json(
      { 
        success: true, 
        data: savedModel,
        message: 'Default Claude model created successfully' 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating default Claude model:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create default Claude model',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
} 
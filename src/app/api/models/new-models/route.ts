import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database';
import AIModel from '@/models/AIModel';

/**
 * Simple endpoint to add the requested new models
 * POST /api/models/new-models
 */
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const data = await request.json();
    const { apiKey } = data;
    
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'API key is required' },
        { status: 400 }
      );
    }
    
    // Configure our models
    const newModels = [
      {
        name: 'GPT-4o-mini',
        provider: 'OpenAI',
        apiKey,
        baseUrl: 'https://api.openai.com/v1/chat/completions',
        active: true,
        defaultParameters: {
          model: 'gpt-4o-mini',
          temperature: 0.7,
          max_tokens: 2000
        }
      },
      {
        name: 'Cursor-small',
        provider: 'OpenAI',
        apiKey,
        baseUrl: 'https://api.openai.com/v1/chat/completions',
        active: true,
        defaultParameters: {
          model: 'cursor-small',
          temperature: 0.3, // Lower temperature for better code completions
          max_tokens: 2000
        }
      }
    ];
    
    // Add models to database
    const results = [];
    for (const model of newModels) {
      // Skip if model with same name already exists
      const existingModel = await AIModel.findOne({ name: model.name });
      if (existingModel) {
        results.push({
          name: model.name,
          status: 'skipped',
          message: 'Model with this name already exists'
        });
        continue;
      }
      
      // No encryption - use API key as plain text
      
      // Create new model
      const newModel = new AIModel(model);
      await newModel.save();
      
      results.push({
        name: model.name,
        status: 'success',
        message: 'Model created successfully'
      });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: `${results.filter(r => r.status === 'success').length} models added successfully`,
      data: results
    });
    
  } catch (error) {
    console.error('Error adding models:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      },
      { status: 500 }
    );
  }
} 
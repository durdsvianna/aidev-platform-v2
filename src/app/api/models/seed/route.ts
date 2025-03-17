import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database';
import AIModel from '@/models/AIModel';

/**
 * Seed endpoint to add preconfigured AI models
 * POST /api/models/seed
 */
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const data = await request.json();
    const { modelType, apiKey } = data;
    
    if (!modelType) {
      return NextResponse.json(
        { success: false, error: 'Model type is required' },
        { status: 400 }
      );
    }
    
    let models = [];
    
    // Configure models based on type
    switch (modelType.toLowerCase()) {
      case 'openai':
        models = getOpenAIModels(apiKey || 'mock-key-for-testing-only');
        break;
      case 'deepseek':
        models = getDeepSeekModels(apiKey || 'mock-key-for-testing-only');
        break;
      case 'mock':
        models = getMockModels();
        break;
      case 'cursor':
        // Just add the Cursor model
        models = [{
          name: 'Cursor-small',
          provider: 'OpenAI',
          apiKey: apiKey || 'mock-key-for-testing-only',
          baseUrl: 'https://api.openai.com/v1/chat/completions',
          active: true,
          defaultParameters: {
            model: 'cursor-small',
            temperature: 0.3,
            max_tokens: 2000
          }
        }];
        break;
      case 'gpt4o-mini':
        // Just add the GPT-4o-mini model
        models = [{
          name: 'GPT-4o-mini',
          provider: 'OpenAI',
          apiKey: apiKey || 'mock-key-for-testing-only',
          baseUrl: 'https://api.openai.com/v1/chat/completions',
          active: true,
          defaultParameters: {
            model: 'gpt-4o-mini',
            temperature: 0.7,
            max_tokens: 2000
          }
        }];
        break;
      case 'all':
        models = [
          ...getOpenAIModels(apiKey || 'mock-key-for-openai-testing-only'),
          ...getDeepSeekModels(apiKey || 'mock-key-for-deepseek-testing-only'),
          ...getMockModels()
        ];
        break;
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid model type. Supported types: openai, deepseek, mock, cursor, gpt4o-mini, all' },
          { status: 400 }
        );
    }
    
    // Add models to database
    const results = [];
    for (const model of models) {
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
      
      // No need to encrypt API key
      
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
    console.error('Error seeding models:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      },
      { status: 500 }
    );
  }
}

// Configure OpenAI models
function getOpenAIModels(apiKey: string) {
  return [
    {
      name: 'GPT-4o',
      provider: 'OpenAI',
      apiKey,
      baseUrl: 'https://api.openai.com/v1/chat/completions',
      active: true,
      defaultParameters: {
        model: 'gpt-4o',
        temperature: 0.7,
        max_tokens: 2000
      }
    },
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
    },
    {
      name: 'GPT-4 Turbo',
      provider: 'OpenAI',
      apiKey,
      baseUrl: 'https://api.openai.com/v1/chat/completions',
      active: true,
      defaultParameters: {
        model: 'gpt-4-turbo-preview',
        temperature: 0.7,
        max_tokens: 2000
      }
    },
    {
      name: 'GPT-3.5 Turbo',
      provider: 'OpenAI',
      apiKey,
      baseUrl: 'https://api.openai.com/v1/chat/completions',
      active: true,
      defaultParameters: {
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
        max_tokens: 1500
      }
    }
  ];
}

// Configure DeepSeek models
function getDeepSeekModels(apiKey: string) {
  return [
    {
      name: 'DeepSeek Coder',
      provider: 'DeepSeek',
      apiKey,
      baseUrl: 'https://api.deepseek.com/v1/chat/completions',
      active: true,
      defaultParameters: {
        model: 'deepseek-coder',
        temperature: 0.3,
        max_tokens: 2000
      }
    },
    {
      name: 'DeepSeek Chat',
      provider: 'DeepSeek',
      apiKey,
      baseUrl: 'https://api.deepseek.com/v1/chat/completions',
      active: true,
      defaultParameters: {
        model: 'deepseek-chat',
        temperature: 0.7,
        max_tokens: 2000
      }
    }
  ];
}

// Configure mock models (no API keys required)
function getMockModels() {
  return [
    {
      name: 'Mock Assistant',
      provider: 'Mock',
      apiKey: '', // No API key required
      baseUrl: 'http://localhost/mock',
      active: true,
      defaultParameters: {
        model: 'mock-general',
        temperature: 0.7,
        max_tokens: 1000
      }
    },
    {
      name: 'Mock Code Assistant',
      provider: 'Mock',
      apiKey: '', // No API key required
      baseUrl: 'http://localhost/mock',
      active: true,
      defaultParameters: {
        model: 'mock-coder',
        temperature: 0.3,
        max_tokens: 2000
      }
    }
  ];
} 
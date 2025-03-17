import { NextRequest, NextResponse } from 'next/server';
import AIModel from '@/models/AIModel';
import { connectToDatabase } from '@/lib/database';

// POST /api/models/verify - Verify that an API key works with its provider
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Check if we're verifying an existing model's API key or a new one
    if (data.modelId) {
      return await verifyExistingModel(data.modelId);
    } else if (data.provider && data.apiKey && data.baseUrl) {
      return await verifyNewApiKey(data.provider, data.apiKey, data.baseUrl);
    } else {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error verifying API key:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to verify API key' },
      { status: 500 }
    );
  }
}

// Verify an existing model's API key
async function verifyExistingModel(modelId: string) {
  await connectToDatabase();
  
  // Find the model and include the API key
  const model = await AIModel.findById(modelId);
  
  if (!model) {
    return NextResponse.json(
      { success: false, error: 'Model not found' },
      { status: 404 }
    );
  }
  
  try {
    // No need to decrypt - use API key directly
    const apiKey = model.apiKey;
    
    // Verify the API key with the provider
    const isValid = await verifyApiKeyWithProvider(
      model.provider,
      apiKey,
      model.baseUrl
    );
    
    return NextResponse.json({ success: true, isValid });
  } catch (error) {
    console.error('Error verifying API key:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to verify API key' },
      { status: 500 }
    );
  }
}

// Verify a new API key before storing
async function verifyNewApiKey(provider: string, apiKey: string, baseUrl: string) {
  try {
    // For Mock provider, always return valid without verification
    if (provider.toLowerCase() === 'mock') {
      console.log('Mock provider detected - skipping API key verification');
      return NextResponse.json({ success: true, isValid: true });
    }
    
    // Verify the API key with the provider
    const isValid = await verifyApiKeyWithProvider(provider, apiKey, baseUrl);
    
    return NextResponse.json({ success: true, isValid });
  } catch (error) {
    console.error('Error verifying new API key:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to verify API key with provider' },
      { status: 500 }
    );
  }
}

// Verify an API key with the provider's API
async function verifyApiKeyWithProvider(
  provider: string,
  apiKey: string,
  baseUrl: string
): Promise<boolean> {
  try {
    // For Mock provider, always return true without verification
    if (provider.toLowerCase() === 'mock') {
      return true;
    }
    
    // Different verification methods based on provider
    switch (provider.toLowerCase()) {
      case 'openai':
        return await verifyOpenAIKey(apiKey);
      case 'anthropic':
        return await verifyAnthropicKey(apiKey, baseUrl);
      case 'deepseek':
        return await verifyDeepSeekKey(apiKey, baseUrl);
      // Add more providers as needed
      default:
        // For unknown providers, just return true
        // In a production app, you'd implement verification for each provider
        return true;
    }
  } catch (error) {
    console.error(`Error verifying ${provider} API key:`, error);
    return false;
  }
}

// Verify an OpenAI API key
async function verifyOpenAIKey(apiKey: string): Promise<boolean> {
  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.status === 200;
  } catch (error) {
    console.error('Error verifying OpenAI key:', error);
    return false;
  }
}

// Verify an Anthropic API key
async function verifyAnthropicKey(apiKey: string, baseUrl: string): Promise<boolean> {
  try {
    // Use the models endpoint as a simple way to verify the API key
    const apiEndpoint = `${baseUrl}/v1/models`;
    console.log(`Verifying Anthropic API key with endpoint: ${apiEndpoint}`);
    
    // Anthropic uses x-api-key header, not the standard Bearer token authentication
    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': apiKey, // Direct API key, not as Bearer token
      'anthropic-version': '2023-06-01'
    };
    
    console.log('Using headers:', Object.keys(headers));
    
    // Send the verification request
    const response = await fetch(apiEndpoint, {
      method: 'GET',
      headers
    });
    
    // Log response details for debugging
    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { raw: errorText };
      }
      
      console.error('Anthropic API verification error:', {
        status: response.status,
        statusText: response.statusText,
        errorData,
        headers: Object.fromEntries(Array.from(response.headers.entries()))
      });
    } else {
      console.log('Anthropic API verification successful');
    }
    
    return response.status === 200;
  } catch (error) {
    console.error('Error verifying Anthropic key:', error);
    return false;
  }
}

// Verify a DeepSeek API key
async function verifyDeepSeekKey(apiKey: string, baseUrl: string): Promise<boolean> {
  try {
    // Use the models endpoint to verify the API key
    const apiEndpoint = 'https://api.deepseek.com/v1/models';
    
    const response = await fetch(apiEndpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.status === 200;
  } catch (error) {
    console.error('Error verifying DeepSeek key:', error);
    return false;
  }
} 
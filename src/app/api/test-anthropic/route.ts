import { NextRequest, NextResponse } from 'next/server';

/**
 * Test endpoint to directly verify Anthropic API credentials
 * Call with: POST /api/test-anthropic
 * Body: { "apiKey": "your-anthropic-api-key" }
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const apiKey = data.apiKey;
    
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'API key is required' },
        { status: 400 }
      );
    }
    
    // Log the first few and last few characters of the API key for debugging
    // Be careful not to log the entire key
    const keyLength = apiKey.length;
    console.log(`Testing Anthropic API key (${keyLength} chars): ${apiKey.substring(0, 4)}...${apiKey.substring(keyLength - 4)}`);
    
    // First, test the models endpoint
    const modelsEndpoint = 'https://api.anthropic.com/v1/models';
    console.log(`Checking models endpoint: ${modelsEndpoint}`);
    
    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    };
    
    const modelsResponse = await fetch(modelsEndpoint, {
      method: 'GET',
      headers
    });
    
    console.log(`Models response status: ${modelsResponse.status}`);
    
    // Get full response details
    const modelsResponseDetails = {
      status: modelsResponse.status,
      statusText: modelsResponse.statusText,
      headers: Object.fromEntries(Array.from(modelsResponse.headers.entries()))
    };
    
    // Get response body
    const modelsResponseText = await modelsResponse.text();
    let modelsResponseBody;
    try {
      modelsResponseBody = JSON.parse(modelsResponseText);
    } catch (e) {
      modelsResponseBody = { raw: modelsResponseText };
    }
    
    // If models endpoint check failed, no need to test messages endpoint
    if (!modelsResponse.ok) {
      return NextResponse.json({
        success: false,
        error: 'Models endpoint check failed',
        response: modelsResponseDetails,
        body: modelsResponseBody
      });
    }
    
    // Test a simple messages call with a basic prompt
    const messagesEndpoint = 'https://api.anthropic.com/v1/messages';
    console.log(`Testing messages endpoint: ${messagesEndpoint}`);
    
    const messagesResponse = await fetch(messagesEndpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 100,
        messages: [
          { role: 'user', content: 'Say hello world' }
        ]
      })
    });
    
    console.log(`Messages response status: ${messagesResponse.status}`);
    
    // Get full response details
    const messagesResponseDetails = {
      status: messagesResponse.status,
      statusText: messagesResponse.statusText,
      headers: Object.fromEntries(Array.from(messagesResponse.headers.entries()))
    };
    
    // Get response body
    const messagesResponseText = await messagesResponse.text();
    let messagesResponseBody;
    try {
      messagesResponseBody = JSON.parse(messagesResponseText);
    } catch (e) {
      messagesResponseBody = { raw: messagesResponseText };
    }
    
    return NextResponse.json({
      success: true,
      modelsCheck: {
        success: modelsResponse.ok,
        response: modelsResponseDetails,
        body: modelsResponseBody
      },
      messagesCheck: {
        success: messagesResponse.ok,
        response: messagesResponseDetails,
        body: messagesResponseBody
      }
    });
  } catch (error) {
    console.error('Error in test-anthropic endpoint:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      },
      { status: 500 }
    );
  }
} 
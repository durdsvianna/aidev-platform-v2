import { NextRequest, NextResponse } from 'next/server';
import { AIChatService, ChatMessage } from '@/lib/services/aiChat';
import { isValidObjectId } from 'mongoose';

// POST /api/chat/:modelId - Send a message to a specific AI model
export async function POST(
  request: NextRequest,
  { params }: { params: { modelId: string } }
) {
  const { modelId } = params;
  
  // Validate modelId format
  if (!isValidObjectId(modelId)) {
    return NextResponse.json(
      { success: false, error: 'Invalid model ID format' },
      { status: 400 }
    );
  }
  
  try {
    const body = await request.json();
    
    // Validate request body
    if (!body.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Messages array is required and cannot be empty' },
        { status: 400 }
      );
    }
    
    // Validate message format
    const validRoles = ['user', 'assistant', 'system'];
    const invalidMessage = body.messages.find(
      (msg: any) => !msg.role || !validRoles.includes(msg.role) || typeof msg.content !== 'string'
    );
    
    if (invalidMessage) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid message format. Each message must have a valid role (user, assistant, or system) and content.' 
        },
        { status: 400 }
      );
    }
    
    // Send message to AI model
    const response = await AIChatService.sendMessage({
      modelId,
      messages: body.messages as ChatMessage[],
      parameters: body.parameters || {}
    });
    
    if (!response.success) {
      return NextResponse.json(
        { success: false, error: response.error },
        { status: 404 }
      );
    }
    
    return NextResponse.json(response);
  } catch (error) {
    console.error(`Error chatting with AI model ${modelId}:`, error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred during chat' 
      },
      { status: 500 }
    );
  }
} 
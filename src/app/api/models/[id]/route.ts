import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database';
import AIModel from '@/models/AIModel';
import { isValidObjectId } from 'mongoose';

// Helper function to validate MongoDB ObjectId
function validateObjectId(id: string) {
  if (!isValidObjectId(id)) {
    return NextResponse.json(
      { success: false, error: 'Invalid ID format' },
      { status: 400 }
    );
  }
  return null;
}

// GET /api/models/:id - Get a specific AI model
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  
  // Validate ID format
  const validationError = validateObjectId(id);
  if (validationError) return validationError;
  
  try {
    await connectToDatabase();
    
    // Find the model by ID including the apiKey
    const model = await AIModel.findById(id);
    
    if (!model) {
      return NextResponse.json(
        { success: false, error: 'AI model not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: model });
  } catch (error) {
    console.error(`Error fetching AI model with ID ${id}:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch AI model' },
      { status: 500 }
    );
  }
}

// PATCH /api/models/:id - Update a specific AI model
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  
  // Validate ID format
  const validationError = validateObjectId(id);
  if (validationError) return validationError;
  
  try {
    await connectToDatabase();
    
    const data = await request.json();
    
    // Find the model first to check if it exists
    const existingModel = await AIModel.findById(id);
    if (!existingModel) {
      return NextResponse.json(
        { success: false, error: 'AI model not found' },
        { status: 404 }
      );
    }
    
    // Check if updating name and if it already exists
    if (data.name && data.name !== existingModel.name) {
      const nameExists = await AIModel.findOne({ name: data.name });
      if (nameExists) {
        return NextResponse.json(
          { success: false, error: 'Model with this name already exists' },
          { status: 409 }
        );
      }
    }
    
    // No need to encrypt the API key - use as plain text
    
    // Update the model
    const updatedModel = await AIModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );
    
    return NextResponse.json({ success: true, data: updatedModel });
  } catch (error) {
    console.error(`Error updating AI model with ID ${id}:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to update AI model' },
      { status: 500 }
    );
  }
}

// DELETE /api/models/:id - Delete a specific AI model
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  
  // Validate ID format
  const validationError = validateObjectId(id);
  if (validationError) return validationError;
  
  try {
    await connectToDatabase();
    
    // Find and delete the model
    const deletedModel = await AIModel.findByIdAndDelete(id);
    
    if (!deletedModel) {
      return NextResponse.json(
        { success: false, error: 'AI model not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'AI model deleted successfully',
      data: { id }
    });
  } catch (error) {
    console.error(`Error deleting AI model with ID ${id}:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete AI model' },
      { status: 500 }
    );
  }
} 
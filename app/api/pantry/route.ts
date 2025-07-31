import { NextRequest, NextResponse } from 'next/server';
import { PantryService } from '@/lib/services/database';
import { z } from 'zod';

// Static export configuration
export const dynamic = 'force-static';
export const revalidate = false;

// Validation schemas
const createPantryItemSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  quantity: z.number().positive('Quantity must be positive'),
  unit: z.string().min(1, 'Unit is required'),
  category: z.string().min(1, 'Category is required'),
  expirationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  location: z.string().optional(),
  price: z.number().positive().optional(),
  notes: z.string().optional(),
  nutritionInfo: z.object({
    calories: z.number().positive(),
    protein: z.number().min(0),
    carbs: z.number().min(0),
    fat: z.number().min(0),
    servingSize: z.string(),
  }).optional(),
});

const updatePantryItemSchema = createPantryItemSchema.partial().extend({
  id: z.string().min(1, 'ID is required'),
});

export async function GET() {
  try {
    const items = await PantryService.getAllItems();
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    console.error('Error fetching pantry items:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch pantry items' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createPantryItemSchema.parse(body);
    
    const item = await PantryService.createItem(validatedData);
    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Error creating pantry item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create pantry item' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = updatePantryItemSchema.parse(body);
    
    const { id, ...updateData } = validatedData;
    const item = await PantryService.updateItem(id, updateData);
    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Error updating pantry item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update pantry item' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID is required' },
        { status: 400 }
      );
    }
    
    await PantryService.deleteItem(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting pantry item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete pantry item' },
      { status: 500 }
    );
  }
} 
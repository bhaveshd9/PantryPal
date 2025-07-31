import { NextRequest, NextResponse } from 'next/server';
import { ShoppingListService } from '@/lib/services/database';
import { z } from 'zod';

// Static export configuration
export const dynamic = 'force-static';
export const revalidate = false;

// Validation schemas
const createShoppingItemSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  quantity: z.number().positive('Quantity must be positive'),
  unit: z.string().min(1, 'Unit is required'),
  category: z.string().min(1, 'Category is required'),
  price: z.number().positive().optional(),
});

export async function GET() {
  try {
    const items = await ShoppingListService.getAllItems();
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    console.error('Error fetching shopping list:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch shopping list' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createShoppingItemSchema.parse(body);
    
    const item = await ShoppingListService.createItem(validatedData);
    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Error creating shopping list item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create shopping list item' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID is required' },
        { status: 400 }
      );
    }
    
    const item = await ShoppingListService.toggleItem(id);
    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    console.error('Error toggling shopping list item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to toggle shopping list item' },
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
    
    await ShoppingListService.deleteItem(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting shopping list item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete shopping list item' },
      { status: 500 }
    );
  }
} 
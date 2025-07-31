import { NextRequest, NextResponse } from 'next/server';
import { RecipeService } from '@/lib/services/database';
import { z } from 'zod';

// Validation schemas
const recipeIngredientSchema = z.object({
  itemId: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  quantity: z.number().positive('Quantity must be positive'),
  unit: z.string().min(1, 'Unit is required'),
  optional: z.boolean().optional(),
});

const createRecipeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  ingredients: z.array(recipeIngredientSchema).min(1, 'At least one ingredient is required'),
  instructions: z.array(z.string()).min(1, 'At least one instruction is required'),
  servings: z.number().positive('Servings must be positive'),
  prepTime: z.number().min(0, 'Prep time must be non-negative'),
  cookTime: z.number().min(0, 'Cook time must be non-negative'),
  dietaryType: z.enum(['vegetarian', 'vegan', 'non-vegetarian']),
  dietaryRestrictions: z.array(z.string()).optional(),
});

const updateRecipeSchema = createRecipeSchema.partial().extend({
  id: z.string().min(1, 'ID is required'),
});

export async function GET() {
  try {
    const recipes = await RecipeService.getAllRecipes();
    return NextResponse.json({ success: true, data: recipes });
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch recipes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createRecipeSchema.parse(body);
    
    const recipe = await RecipeService.createRecipe(validatedData);
    return NextResponse.json({ success: true, data: recipe }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Error creating recipe:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create recipe' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = updateRecipeSchema.parse(body);
    
    const { id, ...updateData } = validatedData;
    const recipe = await RecipeService.updateRecipe(id, updateData);
    return NextResponse.json({ success: true, data: recipe });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Error updating recipe:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update recipe' },
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
    
    await RecipeService.deleteRecipe(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting recipe:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete recipe' },
      { status: 500 }
    );
  }
} 
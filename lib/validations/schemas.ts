import { z } from 'zod';

// Common validation patterns
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
const priceRegex = /^\d+(\.\d{1,2})?$/;

// Base schemas
export const nutritionInfoSchema = z.object({
  calories: z.number().positive('Calories must be positive'),
  protein: z.number().min(0, 'Protein cannot be negative'),
  carbs: z.number().min(0, 'Carbs cannot be negative'),
  fat: z.number().min(0, 'Fat cannot be negative'),
  servingSize: z.string().min(1, 'Serving size is required'),
});

export const recipeIngredientSchema = z.object({
  itemId: z.string().optional(),
  name: z.string().min(1, 'Ingredient name is required').max(100, 'Name too long'),
  quantity: z.number().positive('Quantity must be positive'),
  unit: z.string().min(1, 'Unit is required').max(20, 'Unit too long'),
  optional: z.boolean().optional(),
});

// Pantry Item schemas
export const pantryItemSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name too long')
    .regex(/^[a-zA-Z0-9\s\-_]+$/, 'Name contains invalid characters'),
  quantity: z.number()
    .positive('Quantity must be positive')
    .max(999999, 'Quantity too large'),
  unit: z.string()
    .min(1, 'Unit is required')
    .max(20, 'Unit too long'),
  category: z.string()
    .min(1, 'Category is required')
    .max(50, 'Category too long'),
  expirationDate: z.string()
    .regex(dateRegex, 'Invalid date format (YYYY-MM-DD)')
    .refine((date) => {
      const inputDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return inputDate >= today;
    }, 'Expiration date cannot be in the past'),
  location: z.string()
    .max(100, 'Location too long')
    .optional(),
  price: z.number()
    .positive('Price must be positive')
    .max(999999, 'Price too large')
    .optional(),
  notes: z.string()
    .max(500, 'Notes too long')
    .optional(),
  nutritionInfo: nutritionInfoSchema.optional(),
});

export const updatePantryItemSchema = pantryItemSchema.partial().extend({
  id: z.string().min(1, 'ID is required'),
});

// Shopping List schemas
export const shoppingItemSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name too long')
    .regex(/^[a-zA-Z0-9\s\-_]+$/, 'Name contains invalid characters'),
  quantity: z.number()
    .positive('Quantity must be positive')
    .max(999999, 'Quantity too large'),
  unit: z.string()
    .min(1, 'Unit is required')
    .max(20, 'Unit too long'),
  category: z.string()
    .min(1, 'Category is required')
    .max(50, 'Category too long'),
  price: z.number()
    .positive('Price must be positive')
    .max(999999, 'Price too large')
    .optional(),
});

// Recipe schemas
export const recipeSchema = z.object({
  name: z.string()
    .min(1, 'Recipe name is required')
    .max(100, 'Name too long')
    .regex(/^[a-zA-Z0-9\s\-_]+$/, 'Name contains invalid characters'),
  ingredients: z.array(recipeIngredientSchema)
    .min(1, 'At least one ingredient is required')
    .max(50, 'Too many ingredients'),
  instructions: z.array(z.string())
    .min(1, 'At least one instruction is required')
    .max(20, 'Too many instructions')
    .refine((instructions) => 
      instructions.every(instruction => 
        instruction.trim().length > 0 && instruction.length <= 500
      ),
      'Instructions must not be empty and under 500 characters'
    ),
  servings: z.number()
    .int('Servings must be a whole number')
    .positive('Servings must be positive')
    .max(50, 'Too many servings'),
  prepTime: z.number()
    .int('Prep time must be a whole number')
    .min(0, 'Prep time cannot be negative')
    .max(480, 'Prep time too long (max 8 hours)'),
  cookTime: z.number()
    .int('Cook time must be a whole number')
    .min(0, 'Cook time cannot be negative')
    .max(480, 'Cook time too long (max 8 hours)'),
  dietaryType: z.enum(['vegetarian', 'vegan', 'non-vegetarian'], {
    errorMap: () => ({ message: 'Please select a valid dietary type' }),
  }),
  dietaryRestrictions: z.array(z.string())
    .max(10, 'Too many dietary restrictions')
    .optional(),
});

export const updateRecipeSchema = recipeSchema.partial().extend({
  id: z.string().min(1, 'ID is required'),
});

// Search schemas
export const searchSchema = z.object({
  query: z.string()
    .max(100, 'Search query too long')
    .optional(),
  category: z.string()
    .max(50, 'Category too long')
    .optional(),
  sortBy: z.enum(['name', 'expirationDate', 'category', 'createdAt'])
    .optional(),
  sortOrder: z.enum(['asc', 'desc'])
    .optional(),
});

// Filter schemas
export const filterSchema = z.object({
  categories: z.array(z.string()).optional(),
  expiringSoon: z.boolean().optional(),
  inStock: z.boolean().optional(),
  priceRange: z.object({
    min: z.number().min(0).optional(),
    max: z.number().positive().optional(),
  }).optional(),
});

// Export types
export type PantryItemFormData = z.infer<typeof pantryItemSchema>;
export type UpdatePantryItemFormData = z.infer<typeof updatePantryItemSchema>;
export type ShoppingItemFormData = z.infer<typeof shoppingItemSchema>;
export type RecipeFormData = z.infer<typeof recipeSchema>;
export type UpdateRecipeFormData = z.infer<typeof updateRecipeSchema>;
export type SearchFormData = z.infer<typeof searchSchema>;
export type FilterFormData = z.infer<typeof filterSchema>;
export type NutritionInfoFormData = z.infer<typeof nutritionInfoSchema>;
export type RecipeIngredientFormData = z.infer<typeof recipeIngredientSchema>; 
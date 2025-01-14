export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string;
}

export interface PantryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  expirationDate: string;
  location?: string;
  nutritionInfo?: NutritionInfo;
  price?: number;
  notes?: string;
}

export interface RecipeIngredient {
  itemId?: string;
  name: string;
  quantity: number;
  unit: string;
  optional?: boolean;
}

export interface Recipe {
  id: string;
  name: string;
  ingredients: RecipeIngredient[];
  instructions: string[];
  servings: number;
  prepTime: number;
  cookTime: number;
  dietaryType: DietaryType;
  dietaryRestrictions?: string[];
}

export interface ShoppingListItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  price?: number;
  isChecked: boolean;
}

export interface PantryStats {
  totalItems: number;
  expiringItems: number;
  categories: number;
}

export interface PantryCategory {
  id: string;
  name: string;
  color: string;
}

export type DietaryType = 'vegetarian' | 'vegan' | 'non-vegetarian';
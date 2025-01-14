import { PantryItem, PantryCategory, Recipe } from '@/types/pantry';

export const defaultCategories: PantryCategory[] = [
  { id: '1', name: 'Canned Goods', color: 'hsl(var(--chart-1))' },
  { id: '2', name: 'Dry Goods', color: 'hsl(var(--chart-2))' },
  { id: '3', name: 'Spices', color: 'hsl(var(--chart-3))' },
  { id: '4', name: 'Beverages', color: 'hsl(var(--chart-4))' },
  { id: '5', name: 'Fresh Produce', color: 'hsl(var(--chart-5))' },
  { id: '6', name: 'Dairy', color: 'hsl(var(--chart-1))' },
  { id: '7', name: 'Meat & Seafood', color: 'hsl(var(--chart-2))' },
  { id: '8', name: 'Frozen Foods', color: 'hsl(var(--chart-3))' },
  { id: '9', name: 'Snacks', color: 'hsl(var(--chart-4))' },
  { id: '10', name: 'Other', color: 'hsl(var(--chart-5))' },
];

export const defaultLocations = [
  'Pantry',
  'Refrigerator',
  'Freezer',
  'Cabinet',
  'Spice Rack',
];

export const dietaryRestrictions = [
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Dairy-Free',
  'Nut-Free',
  'Kosher',
  'Halal',
];

export const defaultShelfLife = {
  'Fresh Produce': 7,
  'Dairy': 14,
  'Meat & Seafood': 5,
  'Frozen Foods': 180,
  'Canned Goods': 730,
  'Dry Goods': 365,
  'Spices': 730,
  'Beverages': 365,
  'Snacks': 90,
  'Other': 90,
};

// Add sample pantry items
export const initialPantryItems: PantryItem[] = [
  {
    id: '1',
    name: 'Pasta',
    quantity: 2,
    unit: 'kg',
    category: 'Dry Goods',
    expirationDate: '2024-12-31',
    location: 'Pantry',
    nutritionInfo: {
      calories: 350,
      protein: 12,
      carbs: 70,
      fat: 1.5,
      servingSize: '100g',
    },
  },
  {
    id: '2',
    name: 'Tomato Sauce',
    quantity: 3,
    unit: 'jars',
    category: 'Canned Goods',
    expirationDate: '2024-06-30',
    location: 'Pantry',
    nutritionInfo: {
      calories: 80,
      protein: 2,
      carbs: 12,
      fat: 3,
      servingSize: '100g',
    },
  },
  {
    id: '3',
    name: 'Milk',
    quantity: 1,
    unit: 'gallon',
    category: 'Dairy',
    expirationDate: '2024-04-15',
    location: 'Refrigerator',
    nutritionInfo: {
      calories: 120,
      protein: 8,
      carbs: 12,
      fat: 5,
      servingSize: '240ml',
    },
  },
];

export const sampleRecipes: Recipe[] = [
  {
    id: '1',
    name: 'Simple Pasta Dinner',
    ingredients: [
      { itemId: '1', name: 'Pasta', quantity: 500, unit: 'g' },
      { itemId: '2', name: 'Tomato Sauce', quantity: 1, unit: 'jar' },
      { itemId: '3', name: 'Parmesan', quantity: 50, unit: 'g', optional: true },
    ],
    instructions: [
      'Boil pasta according to package instructions',
      'Heat tomato sauce in a pan',
      'Combine pasta and sauce',
      'Serve with grated parmesan',
    ],
    servings: 4,
    prepTime: 5,
    cookTime: 15,
    dietaryRestrictions: ['Vegetarian'],
    dietaryType: 'vegetarian', // Added this property
  },
];

export const defaultUserPreferences = {
  dietaryRestrictions: [],
  lowStockThreshold: 2,
  expirationAlertDays: 7,
  defaultLocation: 'Pantry',
};
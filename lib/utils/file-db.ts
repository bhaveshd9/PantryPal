'use client';

import { PantryItem, Recipe, ShoppingListItem } from '@/types/pantry';

// Initial Data
export const initialPantryItems: PantryItem[] = [
  {
    id: '1',
    name: 'Pasta',
    quantity: 2,
    unit: 'kg',
    category: 'Dry Goods',
    expirationDate: '2025-12-31',
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
    expirationDate: '2025-06-30',
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
    expirationDate: '2025-04-15',
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

export const initialShoppingList: ShoppingListItem[] = [
  {
    id: '1',
    name: 'Parmesan',
    quantity: 1,
    unit: 'pack',
    category: 'Dairy',
    isChecked: false,
    price: 4.99
  },
  {
    id: '2',
    name: 'Fresh Basil',
    quantity: 1,
    unit: 'bunch',
    category: 'Fresh Produce',
    isChecked: false,
    price: 2.99
  }
];

export const initialRecipes: Recipe[] = [
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
    dietaryType: 'vegetarian',
  },
];

// Helper function to safely parse JSON from localStorage
function getStoredData<T>(key: string, initialData: T): T {
  if (typeof window === 'undefined') return initialData;
  
  const storedData = localStorage.getItem(key);
  if (!storedData) return initialData;
  
  try {
    return JSON.parse(storedData);
  } catch {
    return initialData;
  }
}

// Helper function to safely store data in localStorage
function setStoredData(key: string, data: any): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
}

export function loadPantryItems(): PantryItem[] {
  return getStoredData('pantryItems', initialPantryItems);
}

export function loadShoppingList(): ShoppingListItem[] {
  return getStoredData('shoppingList', initialShoppingList);
}

export function loadRecipes(): Recipe[] {
  return getStoredData('recipes', initialRecipes);
}

export function updateDatabase(
  key: 'pantryItems' | 'recipes' | 'shoppingList',
  data: any[]
): void {
  setStoredData(key, data);
}
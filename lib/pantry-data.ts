import { PantryItem, PantryCategory, Recipe, ShoppingListItem } from '@/types/pantry';

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

export const defaultUserPreferences = {
  dietaryRestrictions: [],
  lowStockThreshold: 2,
  expirationAlertDays: 7,
  defaultLocation: 'Pantry',
};
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

// Commonly used shopping items with typical units and categories
export const commonShoppingItems = [
  // Dairy
  { name: 'Milk', unit: 'gallons', category: 'Dairy' },
  { name: 'Eggs', unit: 'dozen', category: 'Dairy' },
  { name: 'Cheese', unit: 'pounds', category: 'Dairy' },
  { name: 'Butter', unit: 'pounds', category: 'Dairy' },
  { name: 'Yogurt', unit: 'containers', category: 'Dairy' },
  { name: 'Cream', unit: 'cups', category: 'Dairy' },
  
  // Fresh Produce
  { name: 'Bananas', unit: 'bunches', category: 'Fresh Produce' },
  { name: 'Apples', unit: 'pounds', category: 'Fresh Produce' },
  { name: 'Oranges', unit: 'pounds', category: 'Fresh Produce' },
  { name: 'Tomatoes', unit: 'pounds', category: 'Fresh Produce' },
  { name: 'Onions', unit: 'pounds', category: 'Fresh Produce' },
  { name: 'Potatoes', unit: 'pounds', category: 'Fresh Produce' },
  { name: 'Carrots', unit: 'pounds', category: 'Fresh Produce' },
  { name: 'Lettuce', unit: 'heads', category: 'Fresh Produce' },
  { name: 'Spinach', unit: 'bags', category: 'Fresh Produce' },
  { name: 'Broccoli', unit: 'heads', category: 'Fresh Produce' },
  
  // Meat & Seafood
  { name: 'Chicken Breast', unit: 'pounds', category: 'Meat & Seafood' },
  { name: 'Ground Beef', unit: 'pounds', category: 'Meat & Seafood' },
  { name: 'Pork Chops', unit: 'pounds', category: 'Meat & Seafood' },
  { name: 'Salmon', unit: 'pounds', category: 'Meat & Seafood' },
  { name: 'Shrimp', unit: 'pounds', category: 'Meat & Seafood' },
  { name: 'Bacon', unit: 'packages', category: 'Meat & Seafood' },
  { name: 'Turkey', unit: 'pounds', category: 'Meat & Seafood' },
  
  // Dry Goods
  { name: 'Rice', unit: 'pounds', category: 'Dry Goods' },
  { name: 'Pasta', unit: 'pounds', category: 'Dry Goods' },
  { name: 'Bread', unit: 'loaves', category: 'Dry Goods' },
  { name: 'Flour', unit: 'pounds', category: 'Dry Goods' },
  { name: 'Sugar', unit: 'pounds', category: 'Dry Goods' },
  { name: 'Cereal', unit: 'boxes', category: 'Dry Goods' },
  { name: 'Oatmeal', unit: 'containers', category: 'Dry Goods' },
  
  // Canned Goods
  { name: 'Tomato Sauce', unit: 'cans', category: 'Canned Goods' },
  { name: 'Beans', unit: 'cans', category: 'Canned Goods' },
  
  // Spices
  { name: 'Salt', unit: 'containers', category: 'Spices' },
  
  // Other (for oils and items that don't fit other categories)
  { name: 'Olive Oil', unit: 'bottles', category: 'Other' },
  { name: 'Vegetable Oil', unit: 'bottles', category: 'Other' },
  
  // Beverages
  { name: 'Coffee', unit: 'bags', category: 'Beverages' },
  { name: 'Tea', unit: 'boxes', category: 'Beverages' },
  { name: 'Orange Juice', unit: 'gallons', category: 'Beverages' },
  { name: 'Apple Juice', unit: 'gallons', category: 'Beverages' },
  { name: 'Soda', unit: 'bottles', category: 'Beverages' },
  { name: 'Water', unit: 'bottles', category: 'Beverages' },
  { name: 'Beer', unit: 'packs', category: 'Beverages' },
  { name: 'Wine', unit: 'bottles', category: 'Beverages' },
  
  // Snacks
  { name: 'Chips', unit: 'bags', category: 'Snacks' },
  { name: 'Popcorn', unit: 'bags', category: 'Snacks' },
  { name: 'Nuts', unit: 'bags', category: 'Snacks' },
  { name: 'Crackers', unit: 'boxes', category: 'Snacks' },
  { name: 'Cookies', unit: 'packages', category: 'Snacks' },
  { name: 'Candy', unit: 'bags', category: 'Snacks' },
  
  // Frozen Foods
  { name: 'Ice Cream', unit: 'containers', category: 'Frozen Foods' },
  { name: 'Frozen Pizza', unit: 'pizzas', category: 'Frozen Foods' },
  { name: 'Frozen Vegetables', unit: 'bags', category: 'Frozen Foods' },
  { name: 'Frozen French Fries', unit: 'bags', category: 'Frozen Foods' },
  { name: 'Frozen Chicken Nuggets', unit: 'bags', category: 'Frozen Foods' },
  
  // Other (household items)
  { name: 'Toilet Paper', unit: 'rolls', category: 'Other' },
  { name: 'Paper Towels', unit: 'rolls', category: 'Other' },
  { name: 'Dish Soap', unit: 'bottles', category: 'Other' },
  { name: 'Laundry Detergent', unit: 'bottles', category: 'Other' },
  { name: 'Shampoo', unit: 'bottles', category: 'Other' },
  { name: 'Toothpaste', unit: 'tubes', category: 'Other' },
  { name: 'Deodorant', unit: 'sticks', category: 'Other' },
  { name: 'Soap', unit: 'bars', category: 'Other' },
  
  // Other (condiments)
  { name: 'Ketchup', unit: 'bottles', category: 'Other' },
  { name: 'Mustard', unit: 'bottles', category: 'Other' },
  { name: 'Mayonnaise', unit: 'jars', category: 'Other' },
  { name: 'Hot Sauce', unit: 'bottles', category: 'Other' },
  { name: 'Soy Sauce', unit: 'bottles', category: 'Other' },
  { name: 'Ranch Dressing', unit: 'bottles', category: 'Other' },
  { name: 'BBQ Sauce', unit: 'bottles', category: 'Other' },
  
  // Dry Goods (baking items)
  { name: 'Baking Soda', unit: 'boxes', category: 'Dry Goods' },
  { name: 'Baking Powder', unit: 'containers', category: 'Dry Goods' },
  { name: 'Vanilla Extract', unit: 'bottles', category: 'Dry Goods' },
  { name: 'Chocolate Chips', unit: 'bags', category: 'Dry Goods' },
  { name: 'Yeast', unit: 'packages', category: 'Dry Goods' },
  { name: 'Brown Sugar', unit: 'pounds', category: 'Dry Goods' },
  
  // Spices
  { name: 'Black Pepper', unit: 'containers', category: 'Spices' },
  { name: 'Garlic Powder', unit: 'containers', category: 'Spices' },
  { name: 'Onion Powder', unit: 'containers', category: 'Spices' },
  { name: 'Oregano', unit: 'containers', category: 'Spices' },
  { name: 'Basil', unit: 'containers', category: 'Spices' },
  { name: 'Cinnamon', unit: 'containers', category: 'Spices' },
  { name: 'Cumin', unit: 'containers', category: 'Spices' },
  { name: 'Paprika', unit: 'containers', category: 'Spices' },
];

// Common unit types for shopping items
export const commonUnits = [
  'pieces',
  'pounds',
  'ounces',
  'grams',
  'kilograms',
  'gallons',
  'quarts',
  'pints',
  'cups',
  'tablespoons',
  'teaspoons',
  'dozen',
  'bunches',
  'heads',
  'bags',
  'boxes',
  'containers',
  'bottles',
  'jars',
  'cans',
  'packages',
  'rolls',
  'loaves',
  'pizzas',
  'sticks',
  'tubes',
  'bars',
  'packs'
];
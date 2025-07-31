import { PantryItem, Recipe, ShoppingListItem } from '@/types/pantry';

// Configuration for database mode
const USE_DEMO_DATA = process.env.NODE_ENV === 'development' && !process.env.USE_REAL_DB;

// In-memory demo data storage
let pantryItems: PantryItem[] = [
  {
    id: '1',
    name: 'Apples',
    quantity: 6,
    unit: 'pieces',
    category: 'Fruits',
    expirationDate: '2024-02-15',
    location: 'Fridge',
    price: 3.99,
    notes: 'Organic red apples',
    nutritionInfo: {
      calories: 95,
      protein: 0.5,
      carbs: 25,
      fat: 0.3,
      servingSize: '1 medium apple'
    }
  },
  {
    id: '2',
    name: 'Milk',
    quantity: 1,
    unit: 'gallon',
    category: 'Dairy',
    expirationDate: '2025-02-10',
    location: 'Fridge',
    price: 4.50,
    notes: '2% milk'
  },
  {
    id: '3',
    name: 'Bread',
    quantity: 2,
    unit: 'loaves',
    category: 'Bakery',
    expirationDate: '2024-02-08',
    location: 'Pantry',
    price: 3.99,
    notes: 'Whole wheat bread'
  },
  {
    id: '4',
    name: 'Eggs',
    quantity: 12,
    unit: 'pieces',
    category: 'Dairy',
    expirationDate: '2025-02-20',
    location: 'Fridge',
    price: 4.00,
    notes: 'Large eggs'
  },
  {
    id: '5',
    name: 'Butter',
    quantity: 1,
    unit: 'pound',
    category: 'Dairy',
    expirationDate: '2025-03-01',
    location: 'Fridge',
    price: 4.50,
    notes: 'Unsalted butter'
  }
];

let shoppingItems: ShoppingListItem[] = [
  {
    id: '1',
    name: 'Bananas',
    quantity: 1,
    unit: 'bunch',
    category: 'Fruits',
    price: 2.99,
    isChecked: false
  },
  {
    id: '2',
    name: 'Eggs',
    quantity: 1,
    unit: 'dozen',
    category: 'Dairy',
    price: 4.99,
    isChecked: true
  }
];

let recipes: Recipe[] = [
  {
    id: '1',
    name: 'Scrambled Eggs',
    ingredients: [
      { name: 'Eggs', quantity: 2, unit: 'pieces' },
      { name: 'Milk', quantity: 2, unit: 'tbsp' },
      { name: 'Butter', quantity: 1, unit: 'tbsp' }
    ],
    instructions: [
      'Crack eggs into a bowl',
      'Add milk and whisk',
      'Melt butter in pan',
      'Pour egg mixture and scramble'
    ],
    servings: 1,
    prepTime: 5,
    cookTime: 5,
    dietaryType: 'non-vegetarian'
  }
];

// Error handling wrapper
class DatabaseError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'DatabaseError';
  }
}

// Database service interface
interface IDatabaseService {
  getAllItems(): Promise<PantryItem[]>;
  createItem(item: Omit<PantryItem, 'id'>): Promise<PantryItem>;
  updateItem(id: string, item: Partial<PantryItem>): Promise<PantryItem>;
  deleteItem(id: string): Promise<void>;
  getExpiringItems(days?: number): Promise<PantryItem[]>;
}

// Demo data implementation
class DemoPantryService implements IDatabaseService {
  async getAllItems(): Promise<PantryItem[]> {
    try {
      return [...pantryItems];
    } catch (error) {
      throw new DatabaseError(`Failed to fetch pantry items: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async createItem(item: Omit<PantryItem, 'id'>): Promise<PantryItem> {
    try {
      const newItem: PantryItem = {
        ...item,
        id: Date.now().toString(),
      };
      pantryItems.push(newItem);
      return newItem;
    } catch (error) {
      throw new DatabaseError(`Failed to create pantry item: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateItem(id: string, item: Partial<PantryItem>): Promise<PantryItem> {
    try {
      const index = pantryItems.findIndex(i => i.id === id);
      if (index === -1) {
        throw new DatabaseError('Item not found');
      }
      
      pantryItems[index] = { ...pantryItems[index], ...item };
      return pantryItems[index];
    } catch (error) {
      throw new DatabaseError(`Failed to update pantry item: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async deleteItem(id: string): Promise<void> {
    try {
      const index = pantryItems.findIndex(i => i.id === id);
      if (index === -1) {
        throw new DatabaseError('Item not found');
      }
      
      pantryItems.splice(index, 1);
    } catch (error) {
      throw new DatabaseError(`Failed to delete pantry item: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getExpiringItems(days: number = 7): Promise<PantryItem[]> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() + days);
      
      return pantryItems.filter(item => {
        const expirationDate = new Date(item.expirationDate);
        return expirationDate <= cutoffDate && expirationDate >= new Date();
      });
    } catch (error) {
      throw new DatabaseError(`Failed to fetch expiring items: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Real database implementation (using Prisma)
class PrismaPantryService implements IDatabaseService {
  private prisma: any;

  constructor() {
    // Dynamically import Prisma to avoid issues in demo mode
    try {
      this.prisma = require('@prisma/client').PrismaClient;
    } catch (error) {
      throw new DatabaseError('Prisma client not available. Make sure to run: npm run db:generate');
    }
  }

  private getClient() {
    return new this.prisma();
  }

  async getAllItems(): Promise<PantryItem[]> {
    const prisma = this.getClient();
    try {
      const items = await prisma.pantryItem.findMany({
        orderBy: { createdAt: 'desc' }
      });
      
      return items.map((item: any) => ({
        ...item,
        expirationDate: item.expirationDate.toISOString().split('T')[0],
        nutritionInfo: item.calories ? {
          calories: item.calories,
          protein: item.protein,
          carbs: item.carbs,
          fat: item.fat,
          servingSize: item.servingSize
        } : undefined
      }));
    } catch (error) {
      throw new DatabaseError(`Failed to fetch pantry items: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      await prisma.$disconnect();
    }
  }

  async createItem(item: Omit<PantryItem, 'id'>): Promise<PantryItem> {
    const prisma = this.getClient();
    try {
      const newItem = await prisma.pantryItem.create({
        data: {
          name: item.name,
          quantity: item.quantity,
          unit: item.unit,
          category: item.category,
          expirationDate: new Date(item.expirationDate),
          location: item.location,
          price: item.price,
          notes: item.notes,
          calories: item.nutritionInfo?.calories,
          protein: item.nutritionInfo?.protein,
          carbs: item.nutritionInfo?.carbs,
          fat: item.nutritionInfo?.fat,
          servingSize: item.nutritionInfo?.servingSize,
        }
      });

      return {
        ...newItem,
        expirationDate: newItem.expirationDate.toISOString().split('T')[0],
        nutritionInfo: newItem.calories ? {
          calories: newItem.calories,
          protein: newItem.protein,
          carbs: newItem.carbs,
          fat: newItem.fat,
          servingSize: newItem.servingSize
        } : undefined
      };
    } catch (error) {
      throw new DatabaseError(`Failed to create pantry item: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      await prisma.$disconnect();
    }
  }

  async updateItem(id: string, item: Partial<PantryItem>): Promise<PantryItem> {
    const prisma = this.getClient();
    try {
      const updateData: any = {};
      
      if (item.name !== undefined) updateData.name = item.name;
      if (item.quantity !== undefined) updateData.quantity = item.quantity;
      if (item.unit !== undefined) updateData.unit = item.unit;
      if (item.category !== undefined) updateData.category = item.category;
      if (item.expirationDate !== undefined) updateData.expirationDate = new Date(item.expirationDate);
      if (item.location !== undefined) updateData.location = item.location;
      if (item.price !== undefined) updateData.price = item.price;
      if (item.notes !== undefined) updateData.notes = item.notes;
      if (item.nutritionInfo?.calories !== undefined) updateData.calories = item.nutritionInfo.calories;
      if (item.nutritionInfo?.protein !== undefined) updateData.protein = item.nutritionInfo.protein;
      if (item.nutritionInfo?.carbs !== undefined) updateData.carbs = item.nutritionInfo.carbs;
      if (item.nutritionInfo?.fat !== undefined) updateData.fat = item.nutritionInfo.fat;
      if (item.nutritionInfo?.servingSize !== undefined) updateData.servingSize = item.nutritionInfo.servingSize;

      const updatedItem = await prisma.pantryItem.update({
        where: { id },
        data: updateData
      });

      return {
        ...updatedItem,
        expirationDate: updatedItem.expirationDate.toISOString().split('T')[0],
        nutritionInfo: updatedItem.calories ? {
          calories: updatedItem.calories,
          protein: updatedItem.protein,
          carbs: updatedItem.carbs,
          fat: updatedItem.fat,
          servingSize: updatedItem.servingSize
        } : undefined
      };
    } catch (error) {
      throw new DatabaseError(`Failed to update pantry item: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      await prisma.$disconnect();
    }
  }

  async deleteItem(id: string): Promise<void> {
    const prisma = this.getClient();
    try {
      await prisma.pantryItem.delete({
        where: { id }
      });
    } catch (error) {
      throw new DatabaseError(`Failed to delete pantry item: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      await prisma.$disconnect();
    }
  }

  async getExpiringItems(days: number = 7): Promise<PantryItem[]> {
    const prisma = this.getClient();
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() + days);
      
      const items = await prisma.pantryItem.findMany({
        where: {
          expirationDate: {
            gte: new Date(),
            lte: cutoffDate
          }
        },
        orderBy: { expirationDate: 'asc' }
      });

      return items.map((item: any) => ({
        ...item,
        expirationDate: item.expirationDate.toISOString().split('T')[0],
        nutritionInfo: item.calories ? {
          calories: item.calories,
          protein: item.protein,
          carbs: item.carbs,
          fat: item.fat,
          servingSize: item.servingSize
        } : undefined
      }));
    } catch (error) {
      throw new DatabaseError(`Failed to fetch expiring items: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      await prisma.$disconnect();
    }
  }
}

// Factory function to get the appropriate service
function createPantryService(): IDatabaseService {
  if (USE_DEMO_DATA) {
    console.log('🔧 Using demo data mode');
    return new DemoPantryService();
  } else {
    console.log('🗄️ Using real database mode');
    return new PrismaPantryService();
  }
}

// Export the service instance
export const PantryService = createPantryService();

// Shopping List Service (demo data only for now)
export class ShoppingListService {
  static async getAllItems(): Promise<ShoppingListItem[]> {
    try {
      return [...shoppingItems];
    } catch (error) {
      throw new DatabaseError(`Failed to fetch shopping list: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async createItem(item: Omit<ShoppingListItem, 'id' | 'isChecked'>): Promise<ShoppingListItem> {
    try {
      const newItem: ShoppingListItem = {
        ...item,
        id: Date.now().toString(),
        isChecked: false,
      };
      shoppingItems.push(newItem);
      return newItem;
    } catch (error) {
      throw new DatabaseError(`Failed to create shopping item: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async toggleItem(id: string): Promise<ShoppingListItem> {
    try {
      const index = shoppingItems.findIndex(i => i.id === id);
      if (index === -1) {
        throw new DatabaseError('Item not found');
      }
      
      shoppingItems[index].isChecked = !shoppingItems[index].isChecked;
      return shoppingItems[index];
    } catch (error) {
      throw new DatabaseError(`Failed to toggle shopping item: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async deleteItem(id: string): Promise<void> {
    try {
      const index = shoppingItems.findIndex(i => i.id === id);
      if (index === -1) {
        throw new DatabaseError('Item not found');
      }
      
      shoppingItems.splice(index, 1);
    } catch (error) {
      throw new DatabaseError(`Failed to delete shopping item: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Recipe Service (demo data only for now)
export class RecipeService {
  static async getAllRecipes(): Promise<Recipe[]> {
    try {
      return [...recipes];
    } catch (error) {
      throw new DatabaseError(`Failed to fetch recipes: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async createRecipe(recipe: Omit<Recipe, 'id'>): Promise<Recipe> {
    try {
      const newRecipe: Recipe = {
        ...recipe,
        id: Date.now().toString(),
      };
      recipes.push(newRecipe);
      return newRecipe;
    } catch (error) {
      throw new DatabaseError(`Failed to create recipe: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async updateRecipe(id: string, recipe: Partial<Recipe>): Promise<Recipe> {
    try {
      const index = recipes.findIndex(r => r.id === id);
      if (index === -1) {
        throw new DatabaseError('Recipe not found');
      }
      
      recipes[index] = { ...recipes[index], ...recipe };
      return recipes[index];
    } catch (error) {
      throw new DatabaseError(`Failed to update recipe: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async deleteRecipe(id: string): Promise<void> {
    try {
      const index = recipes.findIndex(r => r.id === id);
      if (index === -1) {
        throw new DatabaseError('Recipe not found');
      }
      
      recipes.splice(index, 1);
    } catch (error) {
      throw new DatabaseError(`Failed to delete recipe: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
} 
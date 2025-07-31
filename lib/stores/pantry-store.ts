import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { PantryItem, Recipe, ShoppingListItem } from '@/types/pantry';

interface PantryState {
  // Pantry Items
  pantryItems: PantryItem[];
  pantryLoading: boolean;
  pantryError: string | null;
  
  // Shopping List
  shoppingItems: ShoppingListItem[];
  shoppingLoading: boolean;
  shoppingError: string | null;
  
  // Recipes
  recipes: Recipe[];
  recipesLoading: boolean;
  recipesError: string | null;
  
  // Actions
  setPantryItems: (items: PantryItem[]) => void;
  addPantryItem: (item: PantryItem) => void;
  updatePantryItem: (item: PantryItem) => void;
  deletePantryItem: (id: string) => void;
  setPantryLoading: (loading: boolean) => void;
  setPantryError: (error: string | null) => void;
  
  setShoppingItems: (items: ShoppingListItem[]) => void;
  addShoppingItem: (item: ShoppingListItem) => void;
  updateShoppingItem: (item: ShoppingListItem) => void;
  deleteShoppingItem: (id: string) => void;
  toggleShoppingItem: (id: string) => void;
  setShoppingLoading: (loading: boolean) => void;
  setShoppingError: (error: string | null) => void;
  
  setRecipes: (recipes: Recipe[]) => void;
  addRecipe: (recipe: Recipe) => void;
  updateRecipe: (recipe: Recipe) => void;
  deleteRecipe: (id: string) => void;
  setRecipesLoading: (loading: boolean) => void;
  setRecipesError: (error: string | null) => void;
  
  // Computed values
  getExpiringItems: (days?: number) => PantryItem[];
  getPantryStats: () => {
    totalItems: number;
    expiringItems: number;
    categories: number;
  };
}

export const usePantryStore = create<PantryState>()(
  devtools(
    (set, get) => ({
      // Initial state
      pantryItems: [],
      pantryLoading: false,
      pantryError: null,
      
      shoppingItems: [],
      shoppingLoading: false,
      shoppingError: null,
      
      recipes: [],
      recipesLoading: false,
      recipesError: null,
      
      // Pantry Items actions
      setPantryItems: (items) => set({ pantryItems: items }),
      addPantryItem: (item) => set((state) => ({ 
        pantryItems: [item, ...state.pantryItems] 
      })),
      updatePantryItem: (item) => set((state) => ({
        pantryItems: state.pantryItems.map((i) => 
          i.id === item.id ? item : i
        )
      })),
      deletePantryItem: (id) => set((state) => ({
        pantryItems: state.pantryItems.filter((i) => i.id !== id)
      })),
      setPantryLoading: (loading) => set({ pantryLoading: loading }),
      setPantryError: (error) => set({ pantryError: error }),
      
      // Shopping List actions
      setShoppingItems: (items) => set({ shoppingItems: items }),
      addShoppingItem: (item) => set((state) => ({ 
        shoppingItems: [item, ...state.shoppingItems] 
      })),
      updateShoppingItem: (item) => set((state) => ({
        shoppingItems: state.shoppingItems.map((i) => 
          i.id === item.id ? item : i
        )
      })),
      deleteShoppingItem: (id) => set((state) => ({
        shoppingItems: state.shoppingItems.filter((i) => i.id !== id)
      })),
      toggleShoppingItem: (id) => set((state) => ({
        shoppingItems: state.shoppingItems.map((item) =>
          item.id === id ? { ...item, isChecked: !item.isChecked } : item
        )
      })),
      setShoppingLoading: (loading) => set({ shoppingLoading: loading }),
      setShoppingError: (error) => set({ shoppingError: error }),
      
      // Recipes actions
      setRecipes: (recipes) => set({ recipes }),
      addRecipe: (recipe) => set((state) => ({ 
        recipes: [recipe, ...state.recipes] 
      })),
      updateRecipe: (recipe) => set((state) => ({
        recipes: state.recipes.map((r) => 
          r.id === recipe.id ? recipe : r
        )
      })),
      deleteRecipe: (id) => set((state) => ({
        recipes: state.recipes.filter((r) => r.id !== id)
      })),
      setRecipesLoading: (loading) => set({ recipesLoading: loading }),
      setRecipesError: (error) => set({ recipesError: error }),
      
      // Computed values
      getExpiringItems: (days = 7) => {
        const state = get();
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() + days);
        
        return state.pantryItems.filter((item) => {
          const expirationDate = new Date(item.expirationDate);
          return expirationDate <= cutoffDate && expirationDate >= new Date();
        });
      },
      
      getPantryStats: () => {
        const state = get();
        const expiringItems = state.getExpiringItems();
        
        return {
          totalItems: state.pantryItems.length,
          expiringItems: expiringItems.length,
          categories: new Set(state.pantryItems.map(item => item.category)).size,
        };
      },
    }),
    {
      name: 'pantry-store',
    }
  )
); 
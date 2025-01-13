import { PantryItem, Recipe, ShoppingListItem } from '@/types/pantry';
import { defaultUserPreferences } from '@/lib/pantry-data';

interface IngredientStatus {
  available: boolean;
  expired: boolean;
  insufficientQuantity: boolean;
  currentQuantity: number;
  requiredQuantity: number;
  expirationDate?: string;
  pantryItem?: PantryItem;
}

interface RecipeCheck {
  canProceed: boolean;
  ingredientStatuses: Record<string, IngredientStatus>;
  updatedItems: PantryItem[];
  shoppingItems: Omit<ShoppingListItem, 'id' | 'isChecked'>[];
}

function normalizeString(str: string): string {
  return str.toLowerCase().trim();
}

function findMatchingPantryItem(items: PantryItem[], ingredientName: string, unit: string): PantryItem | undefined {
  return items.find(item => 
    normalizeString(item.name) === normalizeString(ingredientName) && 
    normalizeString(item.unit) === normalizeString(unit)
  );
}

export function checkRecipeIngredients(
  items: PantryItem[],
  recipe: Recipe
): RecipeCheck {
  const ingredientStatuses: Record<string, IngredientStatus> = {};
  const updatedItems = [...items];
  const shoppingItems: Omit<ShoppingListItem, 'id' | 'isChecked'>[] = [];
  let canProceed = true;

  recipe.ingredients.forEach(ingredient => {
    const pantryItem = findMatchingPantryItem(items, ingredient.name, ingredient.unit);

    const isExpired = pantryItem ? 
      new Date(pantryItem.expirationDate) < new Date() : 
      false;

    const status: IngredientStatus = {
      available: !!pantryItem,
      expired: isExpired,
      insufficientQuantity: pantryItem ? pantryItem.quantity < ingredient.quantity : true,
      currentQuantity: pantryItem?.quantity || 0,
      requiredQuantity: ingredient.quantity,
      expirationDate: pantryItem?.expirationDate,
      pantryItem: pantryItem,
    };

    // Mark recipe as unable to proceed if any non-optional ingredient is unavailable,
    // expired, or insufficient
    if (!ingredient.optional && (
      !status.available || 
      status.expired || 
      status.insufficientQuantity
    )) {
      canProceed = false;
    }

    ingredientStatuses[ingredient.name] = status;

    // Add to shopping list if needed
    if (!status.available || status.insufficientQuantity) {
      const quantityNeeded = status.available ? 
        ingredient.quantity - status.currentQuantity :
        ingredient.quantity;

      shoppingItems.push({
        name: ingredient.name,
        quantity: quantityNeeded,
        unit: ingredient.unit,
        category: pantryItem?.category || 'Other',
        price: pantryItem?.price,
      });
    }
  });

  return {
    canProceed,
    ingredientStatuses,
    updatedItems,
    shoppingItems,
  };
}

export function calculateNewQuantities(
  items: PantryItem[],
  recipe: Recipe
): { updatedItems: PantryItem[]; shoppingItems: Omit<ShoppingListItem, 'id' | 'isChecked'>[]; } {
  const { canProceed, ingredientStatuses, updatedItems, shoppingItems } = checkRecipeIngredients(items, recipe);

  if (!canProceed) {
    throw new Error('Cannot proceed with recipe due to missing or expired ingredients');
  }

  // Update quantities only if we can proceed
  recipe.ingredients.forEach(ingredient => {
    const status = ingredientStatuses[ingredient.name];
    if (status.pantryItem) {
      const index = updatedItems.findIndex(item => item.id === status.pantryItem!.id);
      if (index !== -1) {
        const newQuantity = Math.max(0, status.currentQuantity - ingredient.quantity);
        updatedItems[index] = {
          ...status.pantryItem!,
          quantity: newQuantity,
        };

        // Add to shopping list if quantity is low after making recipe
        if (newQuantity <= defaultUserPreferences.lowStockThreshold) {
          const shoppingItem = shoppingItems.find(item => 
            normalizeString(item.name) === normalizeString(ingredient.name)
          );
          if (!shoppingItem) {
            shoppingItems.push({
              name: status.pantryItem.name,
              quantity: ingredient.quantity,
              unit: status.pantryItem.unit,
              category: status.pantryItem.category,
              price: status.pantryItem.price,
            });
          }
        }
      }
    }
  });

  return { updatedItems, shoppingItems };
}
'use client';

import { useState } from 'react';
import { Recipe, PantryItem } from '@/types/pantry';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Users, Edit, Trash2, ChefHat, DollarSign } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { RecipeEditForm } from './recipe-edit-form';
import { RecipeDetails } from './recipe-details';
import { DIETARY_TYPES } from '@/types/recipe';

interface RecipeCardProps {
  recipe: Recipe;
  pantryItems: PantryItem[];
  onEditRecipe: (recipe: Recipe) => void;
  onDeleteRecipe: (id: string) => void;
  onDeductItems: (itemsToDeduct: { id: string; quantity: number }[]) => void;
  onUpdatePrice?: (itemName: string, newPrice: number) => void;
}

export function RecipeCard({ 
  recipe, 
  pantryItems, 
  onEditRecipe, 
  onDeleteRecipe, 
  onDeductItems,
  onUpdatePrice
}: RecipeCardProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showMissingItemsDialog, setShowMissingItemsDialog] = useState(false);
  const [missingItems, setMissingItems] = useState<{ name: string; required: number; available: number; expiringSoon?: boolean }[]>([]);
  const [allowExpiringItems, setAllowExpiringItems] = useState(false);
  const [pendingDeduction, setPendingDeduction] = useState<{ id: string; quantity: number }[]>([]);

  const handleEdit = (editedRecipe: Recipe) => {
    onEditRecipe(editedRecipe);
    setShowEditDialog(false);
    toast.success('Recipe updated successfully');
  };

  const handleDelete = () => {
    onDeleteRecipe(recipe.id);
  };

  const checkInventory = () => {
    const missing: { name: string; required: number; available: number; expiringSoon?: boolean }[] = [];
    const itemsToDeduct: { id: string; quantity: number }[] = [];

    for (const ingredient of recipe.ingredients) {
      // Find matching pantry item by name (case-insensitive) and check if not expired
      const pantryItem = pantryItems.find(item => {
        const nameMatches = item.name.toLowerCase() === ingredient.name.toLowerCase();
        const notExpired = new Date(item.expirationDate) > new Date();
        return nameMatches && notExpired;
      });

      if (!pantryItem) {
        // Check if item exists but is expired
        const expiredItem = pantryItems.find(item => 
          item.name.toLowerCase() === ingredient.name.toLowerCase()
        );
        
        if (expiredItem) {
          missing.push({
            name: ingredient.name,
            required: ingredient.quantity,
            available: 0 // Expired items count as 0
          });
        } else {
          missing.push({
            name: ingredient.name,
            required: ingredient.quantity,
            available: 0
          });
        }
      } else if (pantryItem.quantity < ingredient.quantity) {
        missing.push({
          name: ingredient.name,
          required: ingredient.quantity,
          available: pantryItem.quantity
        });
      } else {
        // Check if item is expiring soon (within 3 days)
        const expirationDate = new Date(pantryItem.expirationDate);
        const threeDaysFromNow = new Date();
        threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
        const expiringSoon = expirationDate <= threeDaysFromNow;
        
        if (expiringSoon) {
          missing.push({
            name: ingredient.name,
            required: ingredient.quantity,
            available: pantryItem.quantity,
            expiringSoon: true
          });
        } else {
          itemsToDeduct.push({
            id: pantryItem.id,
            quantity: ingredient.quantity
          });
        }
      }
    }

    if (missing.length > 0) {
      setMissingItems(missing);
      setPendingDeduction(itemsToDeduct);
      setShowMissingItemsDialog(true);
    } else {
      // All ingredients available, deduct them
      onDeductItems(itemsToDeduct);
      toast.success(`Successfully cooked ${recipe.name}! Ingredients deducted from pantry.`);
    }
  };

  const handleProceedWithExpiring = () => {
    if (allowExpiringItems) {
      // Add expiring items to deduction list
      const expiringItemsToDeduct = missingItems
        .filter(item => item.expiringSoon)
        .map(item => {
          const pantryItem = pantryItems.find(p => 
            p.name.toLowerCase() === item.name.toLowerCase()
          );
          return {
            id: pantryItem!.id,
            quantity: item.required
          };
        });
      
      const allItemsToDeduct = [...pendingDeduction, ...expiringItemsToDeduct];
      onDeductItems(allItemsToDeduct);
      setShowMissingItemsDialog(false);
      setAllowExpiringItems(false);
      toast.success(`Successfully cooked ${recipe.name}! Ingredients deducted from pantry.`);
    }
  };

  const dietaryType = DIETARY_TYPES.find(type => type.value === recipe.dietaryType);

  const hasExpiringItems = missingItems.some(item => item.expiringSoon);
  const hasMissingItems = missingItems.some(item => !item.expiringSoon);

  // Calculate total cost of ingredients
  const calculateRecipeCost = () => {
    let totalCost = 0;
    let missingCost = 0;
    let availableCost = 0;

    for (const ingredient of recipe.ingredients) {
      const pantryItem = pantryItems.find(item => 
        item.name.toLowerCase() === ingredient.name.toLowerCase()
      );

      if (pantryItem && pantryItem.price) {
        // Check if the item is not expired
        const isExpired = new Date(pantryItem.expirationDate) <= new Date();
        
        if (!isExpired) {
          // Calculate the cost based on unit conversion for non-expired items
          const itemCost = calculateItemCost(pantryItem, ingredient);
          
          if (pantryItem.quantity >= ingredient.quantity) {
            availableCost += itemCost;
          } else {
            // Calculate cost for available portion
            const availablePortion = Math.min(pantryItem.quantity, ingredient.quantity);
            const availableCostPortion = calculateItemCost(pantryItem, { ...ingredient, quantity: availablePortion });
            availableCost += availableCostPortion;
            
            // Calculate cost for missing portion
            const missingPortion = ingredient.quantity - availablePortion;
            const missingCostPortion = calculateItemCost(pantryItem, { ...ingredient, quantity: missingPortion });
            missingCost += missingCostPortion;
          }
        } else {
          // Item is expired, count as missing
          const estimatedCost = getEstimatedCost(ingredient.name, ingredient.quantity);
          missingCost += estimatedCost;
        }
      } else {
        // Estimate cost for items not in pantry (using average prices)
        const estimatedCost = getEstimatedCost(ingredient.name, ingredient.quantity);
        missingCost += estimatedCost;
      }
    }

    totalCost = availableCost + missingCost;
    return { totalCost, availableCost, missingCost };
  };

  // Helper function to calculate cost with proper unit conversion
  const calculateItemCost = (pantryItem: PantryItem, ingredient: { name: string; quantity: number; unit: string }): number => {
    if (!pantryItem.price) return 0;
    
    // Convert pantry item to base units for comparison
    const pantryBaseQuantity = convertToBaseUnit(pantryItem.quantity, pantryItem.unit);
    const ingredientBaseQuantity = convertToBaseUnit(ingredient.quantity, ingredient.unit);
    
    // Calculate cost per base unit
    const costPerBaseUnit = pantryItem.price / pantryBaseQuantity;
    
    // Calculate total cost for the ingredient
    return costPerBaseUnit * ingredientBaseQuantity;
  };

  // Helper function to convert units to base units for comparison
  const convertToBaseUnit = (quantity: number, unit: string): number => {
    const unitLower = unit.toLowerCase();
    
    // Volume conversions (to tablespoons)
    if (unitLower.includes('gallon')) return quantity * 256; // 1 gallon = 256 tbsp
    if (unitLower.includes('quart')) return quantity * 64; // 1 quart = 64 tbsp
    if (unitLower.includes('pint')) return quantity * 32; // 1 pint = 32 tbsp
    if (unitLower.includes('cup')) return quantity * 16; // 1 cup = 16 tbsp
    if (unitLower.includes('tbsp') || unitLower.includes('tablespoon')) return quantity;
    if (unitLower.includes('tsp') || unitLower.includes('teaspoon')) return quantity / 3; // 1 tbsp = 3 tsp
    
    // Weight conversions (to ounces)
    if (unitLower.includes('pound') || unitLower.includes('lb')) return quantity * 16; // 1 pound = 16 oz
    if (unitLower.includes('ounce') || unitLower.includes('oz')) return quantity;
    
    // Count conversions
    if (unitLower.includes('dozen')) return quantity * 12; // 1 dozen = 12 pieces
    if (unitLower.includes('piece') || unitLower.includes('pieces')) return quantity;
    
    // Default: assume 1:1 ratio for unknown units
    return quantity;
  };

  const getEstimatedCost = (itemName: string, quantity: number): number => {
    // Common item price estimates (per unit)
    const priceEstimates: { [key: string]: { price: number; unit: string } } = {
      'milk': { price: 3.50, unit: 'gallon' }, // per gallon
      'eggs': { price: 4.00, unit: 'dozen' }, // per dozen
      'cheese': { price: 6.00, unit: 'pound' }, // per pound
      'butter': { price: 4.50, unit: 'pound' }, // per pound
      'chicken breast': { price: 8.00, unit: 'pound' }, // per pound
      'ground beef': { price: 7.00, unit: 'pound' }, // per pound
      'rice': { price: 2.00, unit: 'pound' }, // per pound
      'pasta': { price: 2.50, unit: 'pound' }, // per pound
      'bread': { price: 3.00, unit: 'loaf' }, // per loaf
      'flour': { price: 2.00, unit: 'pound' }, // per pound
      'sugar': { price: 2.50, unit: 'pound' }, // per pound
      'olive oil': { price: 8.00, unit: 'bottle' }, // per bottle
      'tomatoes': { price: 3.00, unit: 'pound' }, // per pound
      'onions': { price: 2.00, unit: 'pound' }, // per pound
      'potatoes': { price: 2.50, unit: 'pound' }, // per pound
      'carrots': { price: 2.00, unit: 'pound' }, // per pound
      'lettuce': { price: 2.50, unit: 'head' }, // per head
      'spinach': { price: 3.00, unit: 'bag' }, // per bag
      'broccoli': { price: 3.50, unit: 'head' }, // per head
      'bananas': { price: 1.50, unit: 'bunch' }, // per bunch
      'apples': { price: 4.00, unit: 'pound' }, // per pound
      'oranges': { price: 3.50, unit: 'pound' }, // per pound
      'coffee': { price: 12.00, unit: 'bag' }, // per bag
      'tea': { price: 4.00, unit: 'box' }, // per box
      'orange juice': { price: 4.00, unit: 'gallon' }, // per gallon
      'soda': { price: 1.50, unit: 'bottle' }, // per bottle
      'water': { price: 1.00, unit: 'bottle' }, // per bottle
      'beer': { price: 12.00, unit: 'pack' }, // per pack
      'wine': { price: 15.00, unit: 'bottle' }, // per bottle
      'chips': { price: 4.00, unit: 'bag' }, // per bag
      'popcorn': { price: 3.00, unit: 'bag' }, // per bag
      'nuts': { price: 8.00, unit: 'bag' }, // per bag
      'crackers': { price: 3.50, unit: 'box' }, // per box
      'cookies': { price: 4.00, unit: 'package' }, // per package
      'candy': { price: 3.00, unit: 'bag' }, // per bag
      'ice cream': { price: 5.00, unit: 'container' }, // per container
      'frozen pizza': { price: 8.00, unit: 'pizza' }, // per pizza
      'frozen vegetables': { price: 3.00, unit: 'bag' }, // per bag
      'toilet paper': { price: 8.00, unit: 'roll' }, // per roll
      'paper towels': { price: 6.00, unit: 'roll' }, // per roll
      'dish soap': { price: 3.00, unit: 'bottle' }, // per bottle
      'laundry detergent': { price: 12.00, unit: 'bottle' }, // per bottle
      'shampoo': { price: 6.00, unit: 'bottle' }, // per bottle
      'toothpaste': { price: 4.00, unit: 'tube' }, // per tube
      'deodorant': { price: 4.00, unit: 'stick' }, // per stick
      'soap': { price: 2.00, unit: 'bar' }, // per bar
      'ketchup': { price: 3.00, unit: 'bottle' }, // per bottle
      'mustard': { price: 2.50, unit: 'bottle' }, // per bottle
      'mayonnaise': { price: 4.00, unit: 'jar' }, // per jar
      'hot sauce': { price: 3.00, unit: 'bottle' }, // per bottle
      'soy sauce': { price: 3.00, unit: 'bottle' }, // per bottle
      'ranch dressing': { price: 3.50, unit: 'bottle' }, // per bottle
      'bbq sauce': { price: 3.00, unit: 'bottle' }, // per bottle
      'baking soda': { price: 2.00, unit: 'box' }, // per box
      'baking powder': { price: 3.00, unit: 'container' }, // per container
      'vanilla extract': { price: 8.00, unit: 'bottle' }, // per bottle
      'chocolate chips': { price: 4.00, unit: 'bag' }, // per bag
      'yeast': { price: 3.00, unit: 'package' }, // per package
      'brown sugar': { price: 3.00, unit: 'pound' }, // per pound
      'black pepper': { price: 4.00, unit: 'container' }, // per container
      'garlic powder': { price: 3.00, unit: 'container' }, // per container
      'onion powder': { price: 3.00, unit: 'container' }, // per container
      'oregano': { price: 3.00, unit: 'container' }, // per container
      'basil': { price: 3.00, unit: 'container' }, // per container
      'cinnamon': { price: 4.00, unit: 'container' }, // per container
      'cumin': { price: 3.00, unit: 'container' }, // per container
      'paprika': { price: 3.00, unit: 'container' }, // per container
    };

    const itemKey = itemName.toLowerCase();
    const itemData = priceEstimates[itemKey] || { price: 3.00, unit: 'piece' }; // Default $3.00 for unknown items
    
    // Calculate proportional cost based on the unit
    let proportionalCost = 0;
    
    if (itemData.unit === 'dozen' && itemName.toLowerCase().includes('egg')) {
      // For eggs, calculate per egg (12 eggs per dozen)
      proportionalCost = (itemData.price / 12) * quantity;
    } else if (itemData.unit === 'gallon' && itemName.toLowerCase().includes('milk')) {
      // For milk, calculate per tablespoon (256 tbsp per gallon)
      proportionalCost = (itemData.price / 256) * quantity;
    } else if (itemData.unit === 'pound' && itemName.toLowerCase().includes('butter')) {
      // For butter, calculate per tablespoon (32 tbsp per pound)
      proportionalCost = (itemData.price / 32) * quantity;
    } else if (itemData.unit === 'pound') {
      // For other items sold by pound, assume the quantity is already in pounds
      proportionalCost = itemData.price * quantity;
    } else {
      // For other units, use the full unit price
      proportionalCost = itemData.price * quantity;
    }
    
    return proportionalCost;
  };

  const { totalCost, availableCost, missingCost } = calculateRecipeCost();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-start">
          <span>{recipe.name}</span>
          <div className="flex gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={checkInventory}
              className="flex items-center gap-2"
            >
              <ChefHat className="h-4 w-4" />
              Cook Recipe
            </Button>
            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Edit Recipe</DialogTitle>
                </DialogHeader>
                <RecipeEditForm recipe={recipe} pantryItems={pantryItems} onSave={handleEdit} />
              </DialogContent>
            </Dialog>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
        {dietaryType && (
          <Badge variant="secondary" className="mt-2">
            {dietaryType.label}
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{recipe.prepTime + recipe.cookTime} min</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{recipe.servings} servings</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              <span className="font-medium text-green-600">
                {totalCost.toFixed(2)}
              </span>
              {missingCost > 0 && (
                <span className="text-xs text-muted-foreground">
                  ({availableCost.toFixed(2)} available, {missingCost.toFixed(2)} to buy)
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground">
                {(totalCost / recipe.servings).toFixed(2)} per serving
              </span>
            </div>
          </div>
          <RecipeDetails recipe={recipe} />
        </div>
      </CardContent>

      {/* Missing Items Dialog */}
      <Dialog open={showMissingItemsDialog} onOpenChange={setShowMissingItemsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Missing Ingredients</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Alert variant="destructive">
              <AlertDescription>
                {hasMissingItems 
                  ? "You don't have enough fresh ingredients to cook this recipe. Please add the missing items to your pantry."
                  : "Some ingredients are expiring soon. You can proceed if you want to use them."
                }
              </AlertDescription>
            </Alert>
            <div className="space-y-2">
              {missingItems.map((item, index) => {
                const pantryItem = pantryItems.find(p => 
                  p.name.toLowerCase() === item.name.toLowerCase()
                );
                const isExpired = pantryItem && new Date(pantryItem.expirationDate) <= new Date();
                
                                 // Calculate cost for this item
                 let itemCost = 0;
                 if (pantryItem && pantryItem.price) {
                   const missingQuantity = item.required - item.available;
                   // Find the recipe ingredient to get the unit
                   const recipeIngredient = recipe.ingredients.find(ing => 
                     ing.name.toLowerCase() === item.name.toLowerCase()
                   );
                   itemCost = calculateItemCost(pantryItem, { 
                     name: item.name, 
                     quantity: missingQuantity, 
                     unit: recipeIngredient?.unit || 'pieces'
                   });
                 } else {
                   itemCost = getEstimatedCost(item.name, item.required - item.available);
                 }
                
                return (
                  <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                    <div className="flex flex-col">
                      <span className="font-medium">{item.name}</span>
                      {isExpired && (
                        <span className="text-xs text-red-600">⚠️ Expired</span>
                      )}
                      {item.expiringSoon && !isExpired && (
                        <span className="text-xs text-orange-600">⚠️ Expiring soon</span>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-muted-foreground">
                        Need: {item.required} | Have: {item.available}
                      </span>
                      <div className="text-sm font-medium text-green-600">
                        {itemCost.toFixed(2)}
                      </div>
                      {onUpdatePrice && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs mt-1"
                          onClick={() => {
                            const newPrice = prompt(`Enter new price for ${item.name}:`, itemCost.toFixed(2));
                            if (newPrice && !isNaN(parseFloat(newPrice))) {
                              onUpdatePrice(item.name, parseFloat(newPrice));
                            }
                          }}
                        >
                          Update Price
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Cost Summary */}
            {missingCost > 0 && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-green-800">Total Cost to Buy:</span>
                  <span className="text-lg font-bold text-green-600">{missingCost.toFixed(2)}</span>
                </div>
                <div className="text-sm text-green-700 mt-1">
                  You already have {availableCost.toFixed(2)} worth of ingredients
                </div>
              </div>
            )}
            
            {hasExpiringItems && !hasMissingItems && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="allow-expiring" 
                    checked={allowExpiringItems}
                    onCheckedChange={(checked) => setAllowExpiringItems(checked as boolean)}
                  />
                  <Label htmlFor="allow-expiring">
                    I understand these items are expiring soon and want to proceed
                  </Label>
                </div>
                <Button 
                  onClick={handleProceedWithExpiring}
                  disabled={!allowExpiringItems}
                  className="w-full"
                >
                  Cook Recipe with Expiring Items
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
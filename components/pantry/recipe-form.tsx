'use client';

import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Search, Calculator, Weight } from 'lucide-react';
import { Recipe, RecipeIngredient, PantryItem } from '@/types/pantry';
import { DietaryType } from '@/types/recipe';
import { RecipeDietarySelect } from './recipe-dietary-select';
import { commonShoppingItems, commonUnits } from '@/lib/pantry-data';
import { toast } from 'sonner';

interface RecipeFormProps {
  onSubmit: (recipe: Omit<Recipe, 'id'>) => void;
  pantryItems: PantryItem[];
}

export function RecipeForm({ onSubmit, pantryItems }: RecipeFormProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    ingredients: [] as RecipeIngredient[],
    instructions: [''],
    servings: 4,
    prepTime: 15,
    cookTime: 30,
    dietaryType: 'non-vegetarian' as DietaryType,
  });

  // Autocomplete states for current ingredient being added
  const [currentIngredient, setCurrentIngredient] = useState({
    name: '',
    quantity: 1,
    unit: 'pieces',
    weight: undefined as number | undefined,
    showSuggestions: false,
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Combine pantry items and common shopping items for suggestions
  const allSuggestions = [
    // First add pantry items with current quantities (excluding expired items)
    ...pantryItems
      .filter(item => new Date(item.expirationDate) > new Date()) // Only non-expired items
      .reduce((acc, item) => {
        const existing = acc.find(s => s.name.toLowerCase() === item.name.toLowerCase());
        if (!existing) {
          acc.push({
            name: item.name,
            unit: item.unit,
            category: item.category,
            price: item.price,
            currentQuantity: item.quantity,
            source: 'pantry' as const
          });
        } else {
          existing.currentQuantity += item.quantity;
        }
        return acc;
      }, [] as { name: string; unit: string; category: string; price?: number; currentQuantity: number; source: 'pantry' }[]),
    
    // Then add common shopping items (without duplicates from pantry)
    ...commonShoppingItems
      .filter(commonItem => !pantryItems
        .filter(item => new Date(item.expirationDate) > new Date()) // Only check non-expired items
        .some(pantryItem => 
          pantryItem.name.toLowerCase() === commonItem.name.toLowerCase()
        )
      )
      .map(item => ({
        ...item,
        price: undefined,
        currentQuantity: 0,
        source: 'common' as const
      }))
  ];

  const filteredSuggestions = allSuggestions.filter(item =>
    item.name.toLowerCase().includes(currentIngredient.name.toLowerCase())
  ).slice(0, 8);

  // Cost calculation functions
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

  const calculateIngredientCost = (ingredient: RecipeIngredient): { cost: number; isEstimated: boolean; weightInfo?: string } => {
    const pantryItem = pantryItems.find(item => 
      item.name.toLowerCase() === ingredient.name.toLowerCase() && 
      new Date(item.expirationDate) > new Date() // Only non-expired items
    );

    if (!pantryItem || !pantryItem.price) {
      // Use the same estimated prices as recipe card
      const estimatedPrices: { [key: string]: { price: number; unit: string } } = {
        'milk': { price: 3.50, unit: 'gallon' },
        'eggs': { price: 4.00, unit: 'dozen' },
        'cheese': { price: 6.00, unit: 'pound' },
        'butter': { price: 4.50, unit: 'pound' },
        'chicken breast': { price: 8.00, unit: 'pound' },
        'ground beef': { price: 7.00, unit: 'pound' },
        'rice': { price: 2.00, unit: 'pound' },
        'pasta': { price: 2.50, unit: 'pound' },
        'bread': { price: 3.00, unit: 'loaf' },
        'flour': { price: 2.00, unit: 'pound' },
        'sugar': { price: 2.50, unit: 'pound' },
        'olive oil': { price: 8.00, unit: 'bottle' },
        'tomatoes': { price: 3.00, unit: 'pound' },
        'onions': { price: 2.00, unit: 'pound' },
        'potatoes': { price: 2.50, unit: 'pound' },
        'carrots': { price: 2.00, unit: 'pound' },
        'lettuce': { price: 2.50, unit: 'head' },
        'spinach': { price: 3.00, unit: 'bag' },
        'broccoli': { price: 3.50, unit: 'head' },
        'bananas': { price: 1.50, unit: 'bunch' },
        'apples': { price: 4.00, unit: 'pound' },
        'oranges': { price: 3.50, unit: 'pound' },
      };

      const itemKey = ingredient.name.toLowerCase();
      const estimate = estimatedPrices[itemKey];
      
      if (estimate) {
        // Calculate proportional cost based on unit conversion
        const estimatedBaseQuantity = convertToBaseUnit(1, estimate.unit);
        const ingredientBaseQuantity = convertToBaseUnit(ingredient.quantity, ingredient.unit);
        const costPerBaseUnit = estimate.price / estimatedBaseQuantity;
        const cost = costPerBaseUnit * ingredientBaseQuantity;
        
        return { 
          cost, 
          isEstimated: true, 
          weightInfo: `${estimate.price.toFixed(2)} per ${estimate.unit}` 
        };
      }
      
      return { cost: 0, isEstimated: true, weightInfo: 'Price unknown' };
    }

    // Calculate proportional cost based on unit conversion (same as recipe card)
    const pantryBaseQuantity = convertToBaseUnit(pantryItem.quantity, pantryItem.unit);
    const ingredientBaseQuantity = convertToBaseUnit(ingredient.quantity, ingredient.unit);
    const costPerBaseUnit = pantryItem.price / pantryBaseQuantity;
    const cost = costPerBaseUnit * ingredientBaseQuantity;

    return { cost, isEstimated: false };
  };

  const getTotalRecipeCost = () => {
    return formData.ingredients.reduce((total, ingredient) => {
      const { cost } = calculateIngredientCost(ingredient);
      return total + cost;
    }, 0);
  };

  // Ingredient management
  const handleAddIngredient = () => {
    if (!currentIngredient.name.trim()) {
      toast.error('Please enter an ingredient name');
      return;
    }

    const newIngredient: RecipeIngredient = {
      name: currentIngredient.name,
      quantity: currentIngredient.quantity,
      unit: currentIngredient.unit,
    };

    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, newIngredient]
    }));

    setCurrentIngredient({
      name: '',
      quantity: 1,
      unit: 'pieces',
      weight: undefined,
      showSuggestions: false,
    });
  };

  const handleRemoveIngredient = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const handleIngredientSelect = (itemName: string) => {
    const selectedItem = allSuggestions.find(item => item.name === itemName);
    if (selectedItem) {
      setCurrentIngredient(prev => ({
        ...prev,
        name: selectedItem.name,
        unit: selectedItem.unit,
        quantity: 1,
        showSuggestions: false,
      }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCurrentIngredient(prev => ({ 
      ...prev, 
      name: value,
      showSuggestions: value.length > 0 
    }));
  };

  const handleInputFocus = () => {
    if (currentIngredient.name.length > 0) {
      setCurrentIngredient(prev => ({ ...prev, showSuggestions: true }));
    }
  };

  const handleInputBlur = () => {
    setTimeout(() => setCurrentIngredient(prev => ({ ...prev, showSuggestions: false })), 200);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current && 
        !inputRef.current.contains(event.target as Node)
      ) {
        setCurrentIngredient(prev => ({ ...prev, showSuggestions: false }));
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Instruction management
  const handleAddInstruction = () => {
    setFormData(prev => ({
      ...prev,
      instructions: [...prev.instructions, '']
    }));
  };

  const handleRemoveInstruction = (index: number) => {
    setFormData(prev => ({
      ...prev,
      instructions: prev.instructions.filter((_, i) => i !== index)
    }));
  };

  const handleUpdateInstruction = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      instructions: prev.instructions.map((instruction, i) =>
        i === index ? value : instruction
      )
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.ingredients.length === 0) {
      toast.error('Please add at least one ingredient');
      return;
    }
    onSubmit(formData);
    setOpen(false);
    setFormData({
      name: '',
      ingredients: [],
      instructions: [''],
      servings: 4,
      prepTime: 15,
      cookTime: 30,
      dietaryType: 'non-vegetarian',
    });
  };

  const totalCost = getTotalRecipeCost();
  const costPerServing = formData.servings > 0 ? totalCost / formData.servings : 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add New Recipe
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Recipe</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Recipe Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Recipe Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          {/* Recipe Details */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="servings">Servings</Label>
              <Input
                id="servings"
                type="number"
                min="1"
                value={formData.servings}
                onChange={(e) => setFormData({ ...formData, servings: parseInt(e.target.value) || 1 })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prepTime">Prep Time (min)</Label>
              <Input
                id="prepTime"
                type="number"
                min="0"
                value={formData.prepTime}
                onChange={(e) => setFormData({ ...formData, prepTime: parseInt(e.target.value) || 0 })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cookTime">Cook Time (min)</Label>
              <Input
                id="cookTime"
                type="number"
                min="0"
                value={formData.cookTime}
                onChange={(e) => setFormData({ ...formData, cookTime: parseInt(e.target.value) || 0 })}
                required
              />
            </div>
          </div>

          {/* Cost Summary */}
          {formData.ingredients.length > 0 && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calculator className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-900">Cost Estimate</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Total Cost:</span>
                  <span className="ml-2 font-medium">${totalCost.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Per Serving:</span>
                  <span className="ml-2 font-medium">${costPerServing.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Ingredients */}
          <div className="space-y-4">
            <Label>Ingredients</Label>
            
            {/* Current ingredient being added */}
            <div className="p-4 border rounded-lg bg-gray-50">
              <div className="grid grid-cols-12 gap-2 items-end">
                <div className="col-span-5 relative">
                  <Label className="text-xs">Ingredient Name</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      ref={inputRef}
                      value={currentIngredient.name}
                      onChange={handleInputChange}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      className="pl-10"
                      placeholder="Start typing to see suggestions..."
                      autoComplete="off"
                    />
                    {currentIngredient.showSuggestions && (
                      <div 
                        ref={suggestionsRef}
                        className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto"
                      >
                        {filteredSuggestions.length === 0 ? (
                          <div className="p-3 text-sm text-muted-foreground">
                            {currentIngredient.name ? (
                              `No matching items found. You can add "${currentIngredient.name}" as a new ingredient.`
                            ) : (
                              "Start typing to see suggestions from your pantry and common items."
                            )}
                          </div>
                        ) : (
                          <div>
                            {filteredSuggestions.map((item) => (
                              <button
                                key={item.name}
                                type="button"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  handleIngredientSelect(item.name);
                                }}
                                className="w-full px-3 py-2 text-left hover:bg-gray-100 flex justify-between items-center border-b border-gray-100 last:border-b-0"
                              >
                                <div className="flex-1">
                                  <div className="font-medium">{item.name}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {item.unit} • {item.category}
                                    {item.source === 'pantry' && (
                                      <span className="text-blue-600 ml-2">
                                        (Have: {item.currentQuantity})
                                      </span>
                                    )}
                                  </div>
                                </div>
                                {item.price && (
                                  <div className="text-sm text-muted-foreground ml-2">
                                    ${item.price.toFixed(2)}
                                  </div>
                                )}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="col-span-2">
                  <Label className="text-xs">Quantity</Label>
                  <Input
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={currentIngredient.quantity}
                    onChange={(e) => setCurrentIngredient(prev => ({ 
                      ...prev, 
                      quantity: parseFloat(e.target.value) || 1 
                    }))}
                  />
                </div>
                
                <div className="col-span-3">
                  <Label className="text-xs">Unit</Label>
                  <Select
                    value={currentIngredient.unit}
                    onValueChange={(value) => setCurrentIngredient(prev => ({ ...prev, unit: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {commonUnits.map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-2">
                  <Button 
                    type="button" 
                    onClick={handleAddIngredient}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Added ingredients list */}
            {formData.ingredients.map((ingredient, index) => {
              const { cost, isEstimated, weightInfo } = calculateIngredientCost(ingredient);
              return (
                <div key={index} className="flex items-center gap-2 p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{ingredient.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {ingredient.quantity} {ingredient.unit}
                      {isEstimated && weightInfo && (
                        <span className="text-orange-600 ml-2">
                          (Est: {weightInfo})
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-sm font-medium">
                    ${cost.toFixed(2)}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveIngredient(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>

          {/* Instructions */}
          <div className="space-y-4">
            <Label>Instructions</Label>
            {formData.instructions.map((instruction, index) => (
              <div key={index} className="flex gap-2">
                <div className="flex-1">
                  <Textarea
                    placeholder={`Step ${index + 1}`}
                    value={instruction}
                    onChange={(e) => handleUpdateInstruction(index, e.target.value)}
                    className="min-h-[60px]"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveInstruction(index)}
                  className="self-start"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={handleAddInstruction}>
              <Plus className="mr-2 h-4 w-4" />
              Add Instruction
            </Button>
          </div>

          {/* Dietary Type */}
          <RecipeDietarySelect
            value={formData.dietaryType}
            onValueChange={(value) => setFormData({ ...formData, dietaryType: value })}
          />

          <Button type="submit" className="w-full">
            Create Recipe
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
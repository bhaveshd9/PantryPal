'use client';

import { useState } from 'react';
import { Recipe, RecipeIngredient } from '@/types/pantry';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';

interface RecipeEditFormProps {
  recipe: Recipe;
  onSave: (recipe: Recipe) => void;
}

export function RecipeEditForm({ recipe, onSave }: RecipeEditFormProps) {
  const [editedRecipe, setEditedRecipe] = useState<Recipe>(recipe);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedRecipe);
  };

  const handleAddIngredient = () => {
    setEditedRecipe({
      ...editedRecipe,
      ingredients: [
        ...editedRecipe.ingredients,
        {
          itemId: Math.random().toString(36).substr(2, 9),
          name: '',
          quantity: 1,
          unit: 'pieces',
          optional: false,
        },
      ],
    });
  };

  const handleRemoveIngredient = (index: number) => {
    setEditedRecipe({
      ...editedRecipe,
      ingredients: editedRecipe.ingredients.filter((_, i) => i !== index),
    });
  };

  const handleUpdateIngredient = (index: number, updates: Partial<RecipeIngredient>) => {
    setEditedRecipe({
      ...editedRecipe,
      ingredients: editedRecipe.ingredients.map((ingredient, i) =>
        i === index ? { ...ingredient, ...updates } : ingredient
      ),
    });
  };

  const handleAddInstruction = () => {
    setEditedRecipe({
      ...editedRecipe,
      instructions: [...editedRecipe.instructions, ''],
    });
  };

  const handleRemoveInstruction = (index: number) => {
    setEditedRecipe({
      ...editedRecipe,
      instructions: editedRecipe.instructions.filter((_, i) => i !== index),
    });
  };

  const handleUpdateInstruction = (index: number, value: string) => {
    setEditedRecipe({
      ...editedRecipe,
      instructions: editedRecipe.instructions.map((instruction, i) =>
        i === index ? value : instruction
      ),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Recipe Name</Label>
        <Input
          id="name"
          value={editedRecipe.name}
          onChange={(e) => setEditedRecipe({ ...editedRecipe, name: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Ingredients</Label>
        {editedRecipe.ingredients.map((ingredient, index) => (
          <div key={index} className="flex gap-2 items-end">
            <div className="flex-1">
              <Input
                placeholder="Ingredient name"
                value={ingredient.name}
                onChange={(e) => handleUpdateIngredient(index, { name: e.target.value })}
                required
              />
            </div>
            <div className="w-20">
              <Input
                type="number"
                min="0"
                step="0.1"
                value={ingredient.quantity}
                onChange={(e) => handleUpdateIngredient(index, { quantity: parseFloat(e.target.value) })}
                required
              />
            </div>
            <div className="w-24">
              <Input
                value={ingredient.unit}
                onChange={(e) => handleUpdateIngredient(index, { unit: e.target.value })}
                required
              />
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
        ))}
        <Button type="button" variant="outline" onClick={handleAddIngredient}>
          <Plus className="mr-2 h-4 w-4" />
          Add Ingredient
        </Button>
      </div>

      <div className="space-y-2">
        <Label>Instructions</Label>
        {editedRecipe.instructions.map((instruction, index) => (
          <div key={index} className="flex gap-2">
            <div className="flex-1">
              <Input
                value={instruction}
                onChange={(e) => handleUpdateInstruction(index, e.target.value)}
                placeholder={`Step ${index + 1}`}
                required
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveInstruction(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" onClick={handleAddInstruction}>
          <Plus className="mr-2 h-4 w-4" />
          Add Step
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="prepTime">Prep Time (min)</Label>
          <Input
            id="prepTime"
            type="number"
            min="0"
            value={editedRecipe.prepTime}
            onChange={(e) => setEditedRecipe({ ...editedRecipe, prepTime: parseInt(e.target.value) })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cookTime">Cook Time (min)</Label>
          <Input
            id="cookTime"
            type="number"
            min="0"
            value={editedRecipe.cookTime}
            onChange={(e) => setEditedRecipe({ ...editedRecipe, cookTime: parseInt(e.target.value) })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="servings">Servings</Label>
        <Input
          id="servings"
          type="number"
          min="1"
          value={editedRecipe.servings}
          onChange={(e) => setEditedRecipe({ ...editedRecipe, servings: parseInt(e.target.value) })}
          required
        />
      </div>

      <Button type="submit" className="w-full">Save Changes</Button>
    </form>
  );
}
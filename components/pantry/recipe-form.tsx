'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';
import { Recipe, RecipeIngredient } from '@/types/pantry';
import { DietaryType } from '@/types/recipe';
import { RecipeDietarySelect } from './recipe-dietary-select';

interface RecipeFormProps {
  onSubmit: (recipe: Omit<Recipe, 'id'>) => void;
}

export function RecipeForm({ onSubmit }: RecipeFormProps) {
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

  // ... existing ingredient and instruction handlers ...

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add New Recipe
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Recipe</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ... existing form fields ... */}
          
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
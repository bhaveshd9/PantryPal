'use client';

import { useState } from 'react';
import { Recipe } from '@/types/pantry';
import { toast } from 'sonner';

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  const addRecipe = (newRecipe: Omit<Recipe, 'id'>) => {
    const recipe: Recipe = {
      ...newRecipe,
      id: Math.random().toString(36).substr(2, 9),
    };
    setRecipes(prev => [...prev, recipe]);
    toast.success('Recipe added successfully');
  };

  const editRecipe = (editedRecipe: Recipe) => {
    setRecipes(prev => prev.map(recipe =>
      recipe.id === editedRecipe.id ? editedRecipe : recipe
    ));
    toast.success('Recipe updated successfully');
  };

  const deleteRecipe = (id: string) => {
    setRecipes(prev => prev.filter(recipe => recipe.id !== id));
    toast.success('Recipe deleted successfully');
  };

  return {
    recipes,
    addRecipe,
    editRecipe,
    deleteRecipe,
  };
}
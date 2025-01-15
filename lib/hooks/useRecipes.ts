'use client';

import { useState, useEffect } from 'react';
import { Recipe } from '@/types/pantry';
import { toast } from 'sonner';
import { loadRecipes, updateDatabase } from '@/lib/utils/file-db';

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    setRecipes(loadRecipes());
  }, []);

  const addRecipe = (newRecipe: Omit<Recipe, 'id'>) => {
    const recipe: Recipe = {
      ...newRecipe,
      id: Math.random().toString(36).substr(2, 9),
    };
    const updatedRecipes = [...recipes, recipe];
    setRecipes(updatedRecipes);
    updateDatabase('recipes', updatedRecipes);
    toast.success('Recipe added successfully');
  };

  const editRecipe = (editedRecipe: Recipe) => {
    const updatedRecipes = recipes.map(recipe =>
      recipe.id === editedRecipe.id ? editedRecipe : recipe
    );
    setRecipes(updatedRecipes);
    updateDatabase('recipes', updatedRecipes);
    toast.success('Recipe updated successfully');
  };

  const deleteRecipe = (id: string) => {
    const updatedRecipes = recipes.filter(recipe => recipe.id !== id);
    setRecipes(updatedRecipes);
    updateDatabase('recipes', updatedRecipes);
    toast.success('Recipe deleted successfully');
  };

  return {
    recipes,
    addRecipe,
    editRecipe,
    deleteRecipe,
  };
}
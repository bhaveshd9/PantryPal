'use client';

import { useEffect, useCallback } from 'react';
import { Recipe } from '@/types/pantry';
import { usePantryStore } from '@/lib/stores/pantry-store';
import { RecipeService } from '@/lib/services/database';
import { toast } from 'sonner';

export function useRecipes() {
  const {
    recipes,
    recipesLoading,
    recipesError,
    setRecipes,
    addRecipe: addToStore,
    updateRecipe: updateInStore,
    deleteRecipe: deleteFromStore,
    setRecipesLoading,
    setRecipesError,
  } = usePantryStore();

  // Load recipes on mount
  useEffect(() => {
    let isMounted = true;
    
    const loadRecipes = async () => {
      if (!isMounted) return;
      
      setRecipesLoading(true);
      setRecipesError(null);
      
      try {
        const recipesData = await RecipeService.getAllRecipes();
        if (!isMounted) return;
        
        setRecipes(recipesData);
      } catch (error) {
        if (!isMounted) return;
        
        const errorMessage = error instanceof Error ? error.message : 'Failed to load recipes';
        setRecipesError(errorMessage);
        toast.error(errorMessage);
      } finally {
        if (isMounted) {
          setRecipesLoading(false);
        }
      }
    };

    loadRecipes();

    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array since we only want to run on mount

  const addRecipe = useCallback(async (newRecipe: Omit<Recipe, 'id'>) => {
    setRecipesLoading(true);
    setRecipesError(null);
    
    try {
      const recipe = await RecipeService.createRecipe(newRecipe);
      addToStore(recipe);
      toast.success('Recipe added successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add recipe';
      setRecipesError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setRecipesLoading(false);
    }
  }, [addToStore, setRecipesLoading, setRecipesError]);

  const editRecipe = useCallback(async (editedRecipe: Recipe) => {
    setRecipesLoading(true);
    setRecipesError(null);
    
    try {
      const { id, ...updateData } = editedRecipe;
      const recipe = await RecipeService.updateRecipe(id, updateData);
      updateInStore(recipe);
      toast.success('Recipe updated successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update recipe';
      setRecipesError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setRecipesLoading(false);
    }
  }, [updateInStore, setRecipesLoading, setRecipesError]);

  const deleteRecipe = useCallback(async (id: string) => {
    setRecipesLoading(true);
    setRecipesError(null);
    
    try {
      await RecipeService.deleteRecipe(id);
      deleteFromStore(id);
      toast.success('Recipe deleted successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete recipe';
      setRecipesError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setRecipesLoading(false);
    }
  }, [deleteFromStore, setRecipesLoading, setRecipesError]);

  return {
    recipes,
    loading: recipesLoading,
    error: recipesError,
    addRecipe,
    editRecipe,
    deleteRecipe,
  };
}
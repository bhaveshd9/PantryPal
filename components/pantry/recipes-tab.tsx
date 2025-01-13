'use client';

import { Recipe } from '@/types/pantry';
import { RecipeForm } from './recipe-form';
import { RecipeCard } from './recipe-card';

interface RecipesTabProps {
  recipes: Recipe[];
  onAddRecipe: (recipe: Omit<Recipe, 'id'>) => void;
  onEditRecipe: (recipe: Recipe) => void;
  onDeleteRecipe: (id: string) => void;
}

export function RecipesTab({
  recipes,
  onAddRecipe,
  onEditRecipe,
  onDeleteRecipe,
}: RecipesTabProps) {
  return (
    <>
      <div className="mb-4">
        <RecipeForm onSubmit={onAddRecipe} />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onEditRecipe={onEditRecipe}
            onDeleteRecipe={onDeleteRecipe}
          />
        ))}
        {recipes.length === 0 && (
          <p className="text-muted-foreground col-span-full text-center py-8">
            No recipes found. Add some recipes to get started!
          </p>
        )}
      </div>
    </>
  );
}
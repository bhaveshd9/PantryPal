'use client';

import { Recipe, PantryItem } from '@/types/pantry';
import { RecipeForm } from './recipe-form';
import { RecipeCard } from './recipe-card';

interface RecipesTabProps {
  recipes: Recipe[];
  pantryItems: PantryItem[];
  onAddRecipe: (recipe: Omit<Recipe, 'id'>) => void;
  onEditRecipe: (recipe: Recipe) => void;
  onDeleteRecipe: (id: string) => void;
  onDeductItems: (itemsToDeduct: { id: string; quantity: number }[]) => void;
  onUpdatePrice?: (itemName: string, newPrice: number) => void;
}

export function RecipesTab({
  recipes,
  pantryItems,
  onAddRecipe,
  onEditRecipe,
  onDeleteRecipe,
  onDeductItems,
  onUpdatePrice,
}: RecipesTabProps) {
  return (
    <>
      <div className="mb-4">
        <RecipeForm onSubmit={onAddRecipe} pantryItems={pantryItems} />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            pantryItems={pantryItems}
            onEditRecipe={onEditRecipe}
            onDeleteRecipe={onDeleteRecipe}
            onDeductItems={onDeductItems}
            onUpdatePrice={onUpdatePrice}
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
'use client';

import { Recipe } from '@/types/pantry';

interface RecipeDetailsProps {
  recipe: Recipe;
}

export function RecipeDetails({ recipe }: RecipeDetailsProps) {
  return (
    <>
      <div>
        <h4 className="font-medium mb-2">Ingredients</h4>
        <ul className="list-disc list-inside space-y-1 text-sm">
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index}>
              {ingredient.quantity} {ingredient.unit} {ingredient.name}
              {ingredient.optional && ' (optional)'}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="font-medium mb-2">Instructions</h4>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          {recipe.instructions.map((instruction, index) => (
            <li key={index}>{instruction}</li>
          ))}
        </ol>
      </div>
    </>
  );
}
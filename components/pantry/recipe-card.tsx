'use client';

import { useState } from 'react';
import { Recipe } from '@/types/pantry';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Users, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { RecipeEditForm } from './recipe-edit-form';
import { RecipeDetails } from './recipe-details';
import { DIETARY_TYPES } from '@/types/recipe';

interface RecipeCardProps {
  recipe: Recipe;
  onEditRecipe: (recipe: Recipe) => void;
  onDeleteRecipe: (id: string) => void;
}

export function RecipeCard({ recipe, onEditRecipe, onDeleteRecipe }: RecipeCardProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);

  const handleEdit = (editedRecipe: Recipe) => {
    onEditRecipe(editedRecipe);
    setShowEditDialog(false);
    toast.success('Recipe updated successfully');
  };

  const handleDelete = () => {
    onDeleteRecipe(recipe.id);
  };

  const dietaryType = DIETARY_TYPES.find(type => type.value === recipe.dietaryType);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-start">
          <span>{recipe.name}</span>
          <div className="flex gap-2">
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
                <RecipeEditForm recipe={recipe} onSave={handleEdit} />
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
          </div>
          <RecipeDetails recipe={recipe} />
        </div>
      </CardContent>
    </Card>
  );
}
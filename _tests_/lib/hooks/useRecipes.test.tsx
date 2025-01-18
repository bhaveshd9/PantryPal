import { renderHook, act } from '@testing-library/react';
import { useRecipes } from '@/lib/hooks/useRecipes';
import { loadRecipes, updateDatabase } from '@/lib/utils/file-db';

jest.mock('@/lib/utils/file-db', () => ({
  loadRecipes: jest.fn(),
  updateDatabase: jest.fn(),
}));

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
  },
}));

describe('useRecipes', () => {
  const mockRecipes = [
    {
      id: '1',
      name: 'Test Recipe',
      ingredients: [
        { name: 'Ingredient 1', quantity: 1, unit: 'piece' },
      ],
      instructions: ['Step 1'],
      servings: 4,
      prepTime: 10,
      cookTime: 20,
      dietaryType: 'vegetarian' as const,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (loadRecipes as jest.Mock).mockReturnValue(mockRecipes);
  });

  it('should load initial recipes', () => {
    const { result } = renderHook(() => useRecipes());
    expect(result.current.recipes).toEqual(mockRecipes);
    expect(loadRecipes).toHaveBeenCalled();
  });

  it('should add a new recipe', () => {
    const { result } = renderHook(() => useRecipes());

    const newRecipe = {
      name: 'New Recipe',
      ingredients: [
        { name: 'New Ingredient', quantity: 1, unit: 'piece' },
      ],
      instructions: ['New Step'],
      servings: 2,
      prepTime: 5,
      cookTime: 15,
      dietaryType: 'vegan' as const,
    };

    act(() => {
      result.current.addRecipe(newRecipe);
    });

    expect(result.current.recipes).toHaveLength(2);
    expect(result.current.recipes[1]).toMatchObject(newRecipe);
    expect(updateDatabase).toHaveBeenCalled();
  });

  it('should edit an existing recipe', () => {
    const { result } = renderHook(() => useRecipes());

    const editedRecipe = {
      ...mockRecipes[0],
      name: 'Edited Recipe',
    };

    act(() => {
      result.current.editRecipe(editedRecipe);
    });

    expect(result.current.recipes[0].name).toBe('Edited Recipe');
    expect(updateDatabase).toHaveBeenCalled();
  });

  it('should delete a recipe', () => {
    const { result } = renderHook(() => useRecipes());

    act(() => {
      result.current.deleteRecipe('1');
    });

    expect(result.current.recipes).toHaveLength(0);
    expect(updateDatabase).toHaveBeenCalled();
  });
});
import { renderHook, act } from '@testing-library/react';
import { useRecipes } from '@/lib/hooks/useRecipes';
import { RecipeService } from '@/lib/services/database';

// Mock the database service
jest.mock('@/lib/services/database', () => ({
  RecipeService: {
    getAllRecipes: jest.fn(),
    createRecipe: jest.fn(),
    updateRecipe: jest.fn(),
    deleteRecipe: jest.fn(),
  },
}));

// Mock the sonner toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock the pantry store
jest.mock('@/lib/stores/pantry-store', () => ({
  usePantryStore: () => ({
    recipes: [],
    recipesLoading: false,
    recipesError: null,
    setRecipes: jest.fn(),
    addRecipe: jest.fn(),
    updateRecipe: jest.fn(),
    deleteRecipe: jest.fn(),
    setRecipesLoading: jest.fn(),
    setRecipesError: jest.fn(),
  }),
}));

describe('useRecipes', () => {
  const mockRecipes = [
    {
      id: '1',
      name: 'Test Recipe',
      ingredients: [
        { name: 'Ingredient 1', quantity: 1, unit: 'piece' }
      ],
      instructions: ['Step 1', 'Step 2'],
      servings: 2,
      prepTime: 10,
      cookTime: 20,
      dietaryType: 'vegetarian',
    },
  ];

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    (RecipeService.getAllRecipes as jest.Mock).mockResolvedValue(mockRecipes);
  });

  it('should load initial recipes', async () => {
    const { result } = renderHook(() => useRecipes());
    
    // Wait for the async effect to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    expect(RecipeService.getAllRecipes).toHaveBeenCalled();
  });

  it('should add a new recipe', async () => {
    const { result } = renderHook(() => useRecipes());
    const newRecipe = {
      name: 'New Recipe',
      ingredients: [
        { name: 'Ingredient 1', quantity: 1, unit: 'piece' }
      ],
      instructions: ['Step 1'],
      servings: 1,
      prepTime: 5,
      cookTime: 10,
      dietaryType: 'vegetarian',
    };

    (RecipeService.createRecipe as jest.Mock).mockResolvedValue({ ...newRecipe, id: '2' });

    await act(async () => {
      await result.current.addRecipe(newRecipe);
    });

    expect(RecipeService.createRecipe).toHaveBeenCalledWith(newRecipe);
  });

  it('should edit an existing recipe', async () => {
    const { result } = renderHook(() => useRecipes());
    const editedRecipe = {
      ...mockRecipes[0],
      name: 'Edited Recipe',
    };

    (RecipeService.updateRecipe as jest.Mock).mockResolvedValue(editedRecipe);

    await act(async () => {
      await result.current.editRecipe(editedRecipe);
    });

    expect(RecipeService.updateRecipe).toHaveBeenCalledWith('1', expect.objectContaining({ name: 'Edited Recipe' }));
  });

  it('should delete a recipe', async () => {
    const { result } = renderHook(() => useRecipes());

    (RecipeService.deleteRecipe as jest.Mock).mockResolvedValue(undefined);

    await act(async () => {
      await result.current.deleteRecipe('1');
    });

    expect(RecipeService.deleteRecipe).toHaveBeenCalledWith('1');
  });
});
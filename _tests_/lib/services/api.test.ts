import { pantryApi, recipesApi, shoppingApi, ApiError } from '@/lib/services/api';

// Mock fetch globally
global.fetch = jest.fn();

describe('API Services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Pantry API', () => {
    it('should fetch all pantry items successfully', async () => {
      const mockItems = [
        { id: '1', name: 'Apple', quantity: 5, unit: 'pieces', category: 'Fruits', expirationDate: '2024-12-31' }
      ];

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockItems })
      });

      const result = await pantryApi.getAll();
      expect(result.data).toEqual(mockItems);
      expect(fetch).toHaveBeenCalledWith('/api/pantry', expect.any(Object));
    });

    it('should handle API errors', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Internal server error' })
      });

      await expect(pantryApi.getAll()).rejects.toThrow(ApiError);
    });

    it('should handle network errors', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      await expect(pantryApi.getAll()).rejects.toThrow('Network error');
    });
  });

  describe('Recipe API', () => {
    it('should fetch all recipes successfully', async () => {
      const mockRecipes = [
        { id: '1', name: 'Pasta', ingredients: [], instructions: [], servings: 4, prepTime: 10, cookTime: 20, dietaryType: 'vegetarian' }
      ];

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockRecipes })
      });

      const result = await recipesApi.getAll();
      expect(result.data).toEqual(mockRecipes);
      expect(fetch).toHaveBeenCalledWith('/api/recipes', expect.any(Object));
    });

    it('should create a new recipe', async () => {
      const newRecipe = {
        name: 'New Recipe',
        ingredients: [],
        instructions: [],
        servings: 2,
        prepTime: 5,
        cookTime: 15,
        dietaryType: 'vegetarian' as const
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: { ...newRecipe, id: '2' } })
      });

      const result = await recipesApi.create(newRecipe);
      expect(result.data.id).toBe('2');
      expect(fetch).toHaveBeenCalledWith('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRecipe)
      });
    });
  });

  describe('Shopping List API', () => {
    it('should fetch all shopping list items successfully', async () => {
      const mockItems = [
        { id: '1', name: 'Milk', quantity: 1, unit: 'gallon', category: 'Dairy', isChecked: false }
      ];

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockItems })
      });

      const result = await shoppingApi.getAll();
      expect(result.data).toEqual(mockItems);
      expect(fetch).toHaveBeenCalledWith('/api/shopping-list', expect.any(Object));
    });

    it('should toggle shopping list item', async () => {
      const toggledItem = { id: '1', name: 'Milk', quantity: 1, unit: 'gallon', category: 'Dairy', isChecked: true };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: toggledItem })
      });

      const result = await shoppingApi.toggle('1');
      expect(result.data.isChecked).toBe(true);
      expect(fetch).toHaveBeenCalledWith('/api/shopping-list?id=1', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      });
    });
  });

  describe('Error Handling', () => {
    it('should create ApiError with proper properties', () => {
      const error = new ApiError('Test error', 400, 'BAD_REQUEST');
      expect(error.message).toBe('Test error');
      expect(error.status).toBe(400);
      expect(error.code).toBe('BAD_REQUEST');
      expect(error.name).toBe('ApiError');
    });

    it('should handle JSON parsing errors', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => { throw new Error('Invalid JSON'); }
      });

      await expect(pantryApi.getAll()).rejects.toThrow();
    });
  });
}); 
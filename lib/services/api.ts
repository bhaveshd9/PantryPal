import { PantryItem, Recipe, ShoppingListItem } from '@/types/pantry';

// API base URL
const API_BASE = '/api';

// Custom error class for API errors
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Generic API request function with error handling
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        data.error || 'An error occurred',
        response.status,
        data.code
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new ApiError('Network error - please check your connection', 0);
    }
    
    throw new ApiError(
      error instanceof Error ? error.message : 'An unexpected error occurred',
      500
    );
  }
}

// Pantry Items API
export const pantryApi = {
  getAll: () => apiRequest<{ success: boolean; data: PantryItem[] }>('/pantry'),
  
  create: (item: Omit<PantryItem, 'id'>) =>
    apiRequest<{ success: boolean; data: PantryItem }>('/pantry', {
      method: 'POST',
      body: JSON.stringify(item),
    }),
  
  update: (item: PantryItem) =>
    apiRequest<{ success: boolean; data: PantryItem }>('/pantry', {
      method: 'PUT',
      body: JSON.stringify(item),
    }),
  
  delete: (id: string) =>
    apiRequest<{ success: boolean }>(`/pantry?id=${id}`, {
      method: 'DELETE',
    }),
};

// Shopping List API
export const shoppingApi = {
  getAll: () => apiRequest<{ success: boolean; data: ShoppingListItem[] }>('/shopping-list'),
  
  create: (item: Omit<ShoppingListItem, 'id' | 'isChecked'>) =>
    apiRequest<{ success: boolean; data: ShoppingListItem }>('/shopping-list', {
      method: 'POST',
      body: JSON.stringify(item),
    }),
  
  toggle: (id: string) =>
    apiRequest<{ success: boolean; data: ShoppingListItem }>(`/shopping-list?id=${id}`, {
      method: 'PATCH',
    }),
  
  delete: (id: string) =>
    apiRequest<{ success: boolean }>(`/shopping-list?id=${id}`, {
      method: 'DELETE',
    }),
};

// Recipes API
export const recipesApi = {
  getAll: () => apiRequest<{ success: boolean; data: Recipe[] }>('/recipes'),
  
  create: (recipe: Omit<Recipe, 'id'>) =>
    apiRequest<{ success: boolean; data: Recipe }>('/recipes', {
      method: 'POST',
      body: JSON.stringify(recipe),
    }),
  
  update: (recipe: Recipe) =>
    apiRequest<{ success: boolean; data: Recipe }>('/recipes', {
      method: 'PUT',
      body: JSON.stringify(recipe),
    }),
  
  delete: (id: string) =>
    apiRequest<{ success: boolean }>(`/recipes?id=${id}`, {
      method: 'DELETE',
    }),
};

// Utility function to handle API responses
export function handleApiResponse<T>(response: { success: boolean; data: T; error?: string }) {
  if (!response.success) {
    throw new ApiError(response.error || 'API request failed', 500);
  }
  return response.data;
} 
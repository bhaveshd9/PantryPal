import { renderHook, act } from '@testing-library/react';
import { useShoppingList } from '@/lib/hooks/useShoppingList';
import { ShoppingListService } from '@/lib/services/database';

// Mock the database service
jest.mock('@/lib/services/database', () => ({
  ShoppingListService: {
    getAllItems: jest.fn(),
    createItem: jest.fn(),
    toggleItem: jest.fn(),
    deleteItem: jest.fn(),
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
    shoppingList: [],
    shoppingLoading: false,
    shoppingError: null,
    setShoppingList: jest.fn(),
    addShoppingItem: jest.fn(),
    updateShoppingItem: jest.fn(),
    deleteShoppingItem: jest.fn(),
    setShoppingLoading: jest.fn(),
    setShoppingError: jest.fn(),
  }),
}));

describe('useShoppingList', () => {
  const mockItems = [
    {
      id: '1',
      name: 'Test Item',
      quantity: 1,
      unit: 'piece',
      category: 'Test Category',
      price: 2.99,
      isChecked: false,
    },
  ];

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    (ShoppingListService.getAllItems as jest.Mock).mockResolvedValue(mockItems);
  });

  it('should load initial shopping list items', async () => {
    const { result } = renderHook(() => useShoppingList());
    
    // Wait for the async effect to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    expect(ShoppingListService.getAllItems).toHaveBeenCalled();
  });

  it('should add a new shopping list item', async () => {
    const { result } = renderHook(() => useShoppingList());
    const newItem = {
      name: 'New Item',
      quantity: 1,
      unit: 'piece',
      category: 'Test Category',
      price: 3.99,
    };

    (ShoppingListService.createItem as jest.Mock).mockResolvedValue({ ...newItem, id: '2', isChecked: false });

    await act(async () => {
      await result.current.addItem(newItem);
    });

    expect(ShoppingListService.createItem).toHaveBeenCalledWith(newItem);
  });

  it('should toggle a shopping list item', async () => {
    const { result } = renderHook(() => useShoppingList());
    const toggledItem = { ...mockItems[0], isChecked: true };

    (ShoppingListService.toggleItem as jest.Mock).mockResolvedValue(toggledItem);

    await act(async () => {
      await result.current.toggleItem('1');
    });

    expect(ShoppingListService.toggleItem).toHaveBeenCalledWith('1');
  });

  it('should remove a shopping list item', async () => {
    const { result } = renderHook(() => useShoppingList());

    (ShoppingListService.deleteItem as jest.Mock).mockResolvedValue(undefined);

    await act(async () => {
      await result.current.removeItem('1');
    });

    expect(ShoppingListService.deleteItem).toHaveBeenCalledWith('1');
  });
});
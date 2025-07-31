import { renderHook, act } from '@testing-library/react';
import { usePantryItems } from '@/lib/hooks/usePantryItems';
import { PantryService } from '@/lib/services/database';

// Mock the database service
jest.mock('@/lib/services/database', () => ({
  PantryService: {
    getAllItems: jest.fn(),
    createItem: jest.fn(),
    updateItem: jest.fn(),
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
    pantryItems: [],
    pantryLoading: false,
    pantryError: null,
    setPantryItems: jest.fn(),
    addPantryItem: jest.fn(),
    updatePantryItem: jest.fn(),
    deletePantryItem: jest.fn(),
    setPantryLoading: jest.fn(),
    setPantryError: jest.fn(),
  }),
}));

describe('usePantryItems', () => {
  const mockItems = [
    {
      id: '1',
      name: 'Test Item',
      quantity: 1,
      unit: 'piece',
      category: 'Test Category',
      expirationDate: '2024-12-31',
      location: 'Test Location',
    },
  ];

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    (PantryService.getAllItems as jest.Mock).mockResolvedValue(mockItems);
  });

  it('should load initial items', async () => {
    const { result } = renderHook(() => usePantryItems());
    
    // Wait for the async effect to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    expect(PantryService.getAllItems).toHaveBeenCalled();
  });

  it('should add a new item', async () => {
    const { result } = renderHook(() => usePantryItems());
    const newItem = {
      name: 'New Item',
      quantity: 1,
      unit: 'piece',
      category: 'Test Category',
      expirationDate: '2024-12-31',
      location: 'Test Location',
    };

    (PantryService.createItem as jest.Mock).mockResolvedValue({ ...newItem, id: '2' });

    await act(async () => {
      await result.current.addItem(newItem);
    });

    expect(PantryService.createItem).toHaveBeenCalledWith(newItem);
  });

  it('should edit an existing item', async () => {
    const { result } = renderHook(() => usePantryItems());
    const editedItem = {
      ...mockItems[0],
      name: 'Edited Item',
    };

    (PantryService.updateItem as jest.Mock).mockResolvedValue(editedItem);

    await act(async () => {
      await result.current.editItem(editedItem);
    });

    expect(PantryService.updateItem).toHaveBeenCalledWith('1', expect.objectContaining({ name: 'Edited Item' }));
  });

  it('should delete an item', async () => {
    const { result } = renderHook(() => usePantryItems());

    (PantryService.deleteItem as jest.Mock).mockResolvedValue(undefined);

    await act(async () => {
      await result.current.deleteItem('1');
    });

    expect(PantryService.deleteItem).toHaveBeenCalledWith('1');
  });
});
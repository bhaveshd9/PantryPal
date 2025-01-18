import { renderHook, act } from '@testing-library/react';
import { usePantryItems } from '@/lib/hooks/usePantryItems';
import { loadPantryItems, updateDatabase } from '@/lib/utils/file-db';

// Mock the file-db module
jest.mock('@/lib/utils/file-db', () => ({
  loadPantryItems: jest.fn(),
  updateDatabase: jest.fn(),
}));

// Mock the sonner toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
  },
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
    (loadPantryItems as jest.Mock).mockReturnValue(mockItems);
  });

  it('should load initial items', () => {
    const { result } = renderHook(() => usePantryItems());
    expect(result.current.items).toEqual(mockItems);
    expect(loadPantryItems).toHaveBeenCalled();
  });

  it('should add a new item', () => {
    const { result } = renderHook(() => usePantryItems());

    const newItem = {
      name: 'New Item',
      quantity: 1,
      unit: 'piece',
      category: 'Test Category',
      expirationDate: '2024-12-31',
      location: 'Test Location',
    };

    act(() => {
      result.current.addItem(newItem);
    });

    expect(result.current.items).toHaveLength(2);
    expect(result.current.items[1]).toMatchObject(newItem);
    expect(updateDatabase).toHaveBeenCalled();
  });

  it('should edit an existing item', () => {
    const { result } = renderHook(() => usePantryItems());

    const editedItem = {
      ...mockItems[0],
      name: 'Edited Item',
    };

    act(() => {
      result.current.editItem(editedItem);
    });

    expect(result.current.items[0].name).toBe('Edited Item');
    expect(updateDatabase).toHaveBeenCalled();
  });

  it('should delete an item', () => {
    const { result } = renderHook(() => usePantryItems());

    act(() => {
      result.current.deleteItem('1');
    });

    expect(result.current.items).toHaveLength(0);
    expect(updateDatabase).toHaveBeenCalled();
  });
});
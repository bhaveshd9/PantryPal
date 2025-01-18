import { renderHook, act } from '@testing-library/react';
import { useShoppingList } from '@/lib/hooks/useShoppingList';
import { loadShoppingList, updateDatabase } from '@/lib/utils/file-db';

jest.mock('@/lib/utils/file-db', () => ({
  loadShoppingList: jest.fn(),
  updateDatabase: jest.fn(),
}));

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
  },
}));

describe('useShoppingList', () => {
  const mockItems = [
    {
      id: '1',
      name: 'Test Item',
      quantity: 1,
      unit: 'piece',
      category: 'Test Category',
      isChecked: false,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (loadShoppingList as jest.Mock).mockReturnValue(mockItems);
  });

  it('should load initial shopping list', () => {
    const { result } = renderHook(() => useShoppingList());
    expect(result.current.shoppingList).toEqual(mockItems);
    expect(loadShoppingList).toHaveBeenCalled();
  });

  it('should add a new item', () => {
    const { result } = renderHook(() => useShoppingList());

    const newItem = {
      name: 'New Item',
      quantity: 1,
      unit: 'piece',
      category: 'Test Category',
    };

    act(() => {
      result.current.addItem(newItem);
    });

    expect(result.current.shoppingList).toHaveLength(2);
    expect(result.current.shoppingList[1]).toMatchObject({
      ...newItem,
      isChecked: false,
    });
    expect(updateDatabase).toHaveBeenCalled();
  });

  it('should update quantity of existing item', () => {
    const { result } = renderHook(() => useShoppingList());

    const existingItem = {
      name: 'Test Item',
      quantity: 2,
      unit: 'piece',
      category: 'Test Category',
    };

    act(() => {
      result.current.addItem(existingItem);
    });

    expect(result.current.shoppingList[0].quantity).toBe(3);
    expect(updateDatabase).toHaveBeenCalled();
  });

  it('should toggle item checked status', () => {
    const { result } = renderHook(() => useShoppingList());

    act(() => {
      result.current.toggleItem('1');
    });

    expect(result.current.shoppingList[0].isChecked).toBe(true);
    expect(updateDatabase).toHaveBeenCalled();
  });

  it('should remove an item', () => {
    const { result } = renderHook(() => useShoppingList());

    act(() => {
      result.current.removeItem('1');
    });

    expect(result.current.shoppingList).toHaveLength(0);
    expect(updateDatabase).toHaveBeenCalled();
  });
});
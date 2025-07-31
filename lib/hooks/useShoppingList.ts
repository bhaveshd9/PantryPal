'use client';

import { useEffect, useCallback } from 'react';
import { ShoppingListItem } from '@/types/pantry';
import { usePantryStore } from '@/lib/stores/pantry-store';
import { ShoppingListService } from '@/lib/services/database';
import { toast } from 'sonner';

export function useShoppingList() {
  const {
    shoppingItems,
    shoppingLoading,
    shoppingError,
    setShoppingItems,
    addShoppingItem: addToStore,
    updateShoppingItem: updateInStore,
    deleteShoppingItem: deleteFromStore,
    toggleShoppingItem: toggleInStore,
    setShoppingLoading,
    setShoppingError,
  } = usePantryStore();

  // Load shopping list on mount
  useEffect(() => {
    let isMounted = true;
    
    const loadItems = async () => {
      if (!isMounted) return;
      
      setShoppingLoading(true);
      setShoppingError(null);
      
      try {
        const items = await ShoppingListService.getAllItems();
        if (!isMounted) return;
        
        setShoppingItems(items);
      } catch (error) {
        if (!isMounted) return;
        
        const errorMessage = error instanceof Error ? error.message : 'Failed to load shopping list';
        setShoppingError(errorMessage);
        toast.error(errorMessage);
      } finally {
        if (isMounted) {
          setShoppingLoading(false);
        }
      }
    };

    loadItems();

    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array since we only want to run on mount

  const addItem = useCallback(async (newItem: Omit<ShoppingListItem, 'id' | 'isChecked'>) => {
    setShoppingLoading(true);
    setShoppingError(null);
    
    try {
      const item = await ShoppingListService.createItem(newItem);
      addToStore(item);
      toast.success('Item added to shopping list');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add item to shopping list';
      setShoppingError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setShoppingLoading(false);
    }
  }, [addToStore, setShoppingLoading, setShoppingError]);

  const toggleItem = useCallback(async (id: string) => {
    setShoppingLoading(true);
    setShoppingError(null);
    
    try {
      const item = await ShoppingListService.toggleItem(id);
      updateInStore(item);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to toggle item';
      setShoppingError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setShoppingLoading(false);
    }
  }, [updateInStore, setShoppingLoading, setShoppingError]);

  const removeItem = useCallback(async (id: string) => {
    setShoppingLoading(true);
    setShoppingError(null);
    
    try {
      await ShoppingListService.deleteItem(id);
      deleteFromStore(id);
      toast.success('Item removed from shopping list');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to remove item';
      setShoppingError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setShoppingLoading(false);
    }
  }, [deleteFromStore, setShoppingLoading, setShoppingError]);

  return {
    shoppingList: shoppingItems,
    loading: shoppingLoading,
    error: shoppingError,
    addItem,
    toggleItem,
    removeItem,
  };
}
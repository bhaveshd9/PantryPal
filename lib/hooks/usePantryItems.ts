'use client';

import { useEffect, useCallback } from 'react';
import { PantryItem } from '@/types/pantry';
import { usePantryStore } from '@/lib/stores/pantry-store';
import { PantryService } from '@/lib/services/database';
import { toast } from 'sonner';

export function usePantryItems() {
  const {
    pantryItems,
    pantryLoading,
    pantryError,
    setPantryItems,
    addPantryItem: addToStore,
    updatePantryItem: updateInStore,
    deletePantryItem: deleteFromStore,
    setPantryLoading,
    setPantryError,
  } = usePantryStore();

  // Load pantry items on mount
  useEffect(() => {
    let isMounted = true;
    
    const loadItems = async () => {
      if (!isMounted) return;
      
      setPantryLoading(true);
      setPantryError(null);
      
      try {
        const items = await PantryService.getAllItems();
        if (!isMounted) return;
        
        setPantryItems(items);
      } catch (error) {
        if (!isMounted) return;
        
        const errorMessage = error instanceof Error ? error.message : 'Failed to load pantry items';
        setPantryError(errorMessage);
        toast.error(errorMessage);
      } finally {
        if (isMounted) {
          setPantryLoading(false);
        }
      }
    };

    loadItems();

    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array since we only want to run on mount

  const addItem = useCallback(async (newItem: Omit<PantryItem, 'id'>) => {
    setPantryLoading(true);
    setPantryError(null);
    
    try {
      const item = await PantryService.createItem(newItem);
      addToStore(item);
      toast.success('Item added successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add item';
      setPantryError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setPantryLoading(false);
    }
  }, [addToStore, setPantryLoading, setPantryError]);

  const editItem = useCallback(async (editedItem: PantryItem) => {
    setPantryLoading(true);
    setPantryError(null);
    
    try {
      const { id, ...updateData } = editedItem;
      const item = await PantryService.updateItem(id, updateData);
      updateInStore(item);
      toast.success('Item updated successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update item';
      setPantryError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setPantryLoading(false);
    }
  }, [updateInStore, setPantryLoading, setPantryError]);

  const deleteItem = useCallback(async (id: string) => {
    setPantryLoading(true);
    setPantryError(null);
    
    try {
      await PantryService.deleteItem(id);
      deleteFromStore(id);
      toast.success('Item deleted successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete item';
      setPantryError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setPantryLoading(false);
    }
  }, [deleteFromStore, setPantryLoading, setPantryError]);

  return {
    items: pantryItems,
    loading: pantryLoading,
    error: pantryError,
    addItem,
    editItem,
    deleteItem,
  };
}
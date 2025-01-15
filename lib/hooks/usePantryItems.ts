'use client';

import { useState, useEffect } from 'react';
import { PantryItem } from '@/types/pantry';
import { toast } from 'sonner';
import { loadPantryItems, updateDatabase } from '@/lib/utils/file-db';

export function usePantryItems() {
  const [items, setItems] = useState<PantryItem[]>([]);

  useEffect(() => {
    setItems(loadPantryItems());
  }, []);

  const addItem = (newItem: Omit<PantryItem, 'id'>) => {
    const item: PantryItem = {
      ...newItem,
      id: Math.random().toString(36).substr(2, 9),
    };
    const updatedItems = [...items, item];
    setItems(updatedItems);
    updateDatabase('pantryItems', updatedItems);
    toast.success('Item added successfully');
  };

  const editItem = (editedItem: PantryItem) => {
    const updatedItems = items.map(item => 
      item.id === editedItem.id ? editedItem : item
    );
    setItems(updatedItems);
    updateDatabase('pantryItems', updatedItems);
    toast.success('Item updated successfully');
  };

  const deleteItem = (id: string) => {
    const updatedItems = items.filter(item => item.id !== id);
    setItems(updatedItems);
    updateDatabase('pantryItems', updatedItems);
    toast.success('Item deleted successfully');
  };

  return {
    items,
    addItem,
    editItem,
    deleteItem,
  };
}
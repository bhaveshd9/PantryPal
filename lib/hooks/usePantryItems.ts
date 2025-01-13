'use client';

import { useState } from 'react';
import { PantryItem } from '@/types/pantry';
import { toast } from 'sonner';

export function usePantryItems() {
  const [items, setItems] = useState<PantryItem[]>([]);

  const addItem = (newItem: Omit<PantryItem, 'id'>) => {
    const item: PantryItem = {
      ...newItem,
      id: Math.random().toString(36).substr(2, 9),
    };
    setItems(prev => [...prev, item]);
    toast.success('Item added successfully');
  };

  const editItem = (editedItem: PantryItem) => {
    setItems(prev => prev.map(item => 
      item.id === editedItem.id ? editedItem : item
    ));
    toast.success('Item updated successfully');
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
    toast.success('Item deleted successfully');
  };

  return {
    items,
    addItem,
    editItem,
    deleteItem,
  };
}
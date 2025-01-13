'use client';

import { useState } from 'react';
import { ShoppingListItem } from '@/types/pantry';
import { toast } from 'sonner';

export function useShoppingList() {
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);

  const addItem = (newItem: Omit<ShoppingListItem, 'id' | 'isChecked'>) => {
    // Check if item already exists
    const existingItem = shoppingList.find(
      item => item.name.toLowerCase() === newItem.name.toLowerCase() && 
             item.unit.toLowerCase() === newItem.unit.toLowerCase()
    );

    if (existingItem) {
      // Update quantity if item exists
      setShoppingList(prev => prev.map(item => 
        item.id === existingItem.id 
          ? { ...item, quantity: item.quantity + newItem.quantity }
          : item
      ));
    } else {
      // Add new item if it doesn't exist
      const item: ShoppingListItem = {
        ...newItem,
        id: Math.random().toString(36).substr(2, 9),
        isChecked: false,
      };
      setShoppingList(prev => [...prev, item]);
    }
    toast.success('Item added to shopping list');
  };

  const toggleItem = (id: string) => {
    setShoppingList(prev =>
      prev.map(item =>
        item.id === id ? { ...item, isChecked: !item.isChecked } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setShoppingList(prev => prev.filter(item => item.id !== id));
    toast.success('Item removed from shopping list');
  };

  const addMultipleItems = (items: Omit<ShoppingListItem, 'id' | 'isChecked'>[]) => {
    items.forEach(item => addItem(item));
  };

  return {
    shoppingList,
    addItem,
    toggleItem,
    removeItem,
    addMultipleItems,
  };
}
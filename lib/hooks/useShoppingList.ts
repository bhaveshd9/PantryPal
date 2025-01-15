'use client';

import { useState, useEffect } from 'react';
import { ShoppingListItem } from '@/types/pantry';
import { toast } from 'sonner';
import { loadShoppingList, updateDatabase } from '@/lib/utils/file-db';

export function useShoppingList() {
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);

  useEffect(() => {
    setShoppingList(loadShoppingList());
  }, []);

  const addItem = (newItem: Omit<ShoppingListItem, 'id' | 'isChecked'>) => {
    const existingItem = shoppingList.find(
      item => item.name.toLowerCase() === newItem.name.toLowerCase() && 
             item.unit.toLowerCase() === newItem.unit.toLowerCase()
    );

    let updatedList;
    if (existingItem) {
      updatedList = shoppingList.map(item => 
        item.id === existingItem.id 
          ? { ...item, quantity: item.quantity + newItem.quantity }
          : item
      );
    } else {
      const item: ShoppingListItem = {
        ...newItem,
        id: Math.random().toString(36).substr(2, 9),
        isChecked: false,
      };
      updatedList = [...shoppingList, item];
    }
    
    setShoppingList(updatedList);
    updateDatabase('shoppingList', updatedList);
    toast.success('Item added to shopping list');
  };

  const toggleItem = (id: string) => {
    const updatedList = shoppingList.map(item =>
      item.id === id ? { ...item, isChecked: !item.isChecked } : item
    );
    setShoppingList(updatedList);
    updateDatabase('shoppingList', updatedList);
  };

  const removeItem = (id: string) => {
    const updatedList = shoppingList.filter(item => item.id !== id);
    setShoppingList(updatedList);
    updateDatabase('shoppingList', updatedList);
    toast.success('Item removed from shopping list');
  };

  const addMultipleItems = (items: Omit<ShoppingListItem, 'id' | 'isChecked'>[]) => {
    for (const item of items) {
      addItem(item);
    }
  };

  return {
    shoppingList,
    addItem,
    toggleItem,
    removeItem,
    addMultipleItems,
  };
}
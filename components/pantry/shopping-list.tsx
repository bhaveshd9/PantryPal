'use client';

import { useState } from 'react';
import { ShoppingListItem } from '@/types/pantry';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { ShoppingListForm } from './shopping-list-form';

interface ShoppingListProps {
  items: ShoppingListItem[];
  onToggleItem: (id: string) => void;
  onRemoveItem: (id: string) => void;
  onAddItem: (item: Omit<ShoppingListItem, 'id' | 'isChecked'>) => void;
}

export function ShoppingList({ items, onToggleItem, onRemoveItem, onAddItem }: ShoppingListProps) {
  const [sortBy, setSortBy] = useState<'category' | 'name'>('category');

  const sortedItems = [...items].sort((a, b) => {
    if (sortBy === 'category') {
      return a.category.localeCompare(b.category) || a.name.localeCompare(b.name);
    }
    return a.name.localeCompare(b.name);
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Shopping List</CardTitle>
          <ShoppingListForm onSubmit={onAddItem} />
        </div>
        <div className="flex gap-2">
          <Button
            variant={sortBy === 'category' ? 'secondary' : 'ghost'}
            onClick={() => setSortBy('category')}
          >
            Sort by Category
          </Button>
          <Button
            variant={sortBy === 'name' ? 'secondary' : 'ghost'}
            onClick={() => setSortBy('name')}
          >
            Sort by Name
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-2 hover:bg-accent rounded-lg"
            >
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={item.isChecked}
                  onCheckedChange={() => onToggleItem(item.id)}
                />
                <div className={item.isChecked ? 'line-through text-muted-foreground' : ''}>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.quantity} {item.unit} • {item.category}
                    {item.price && ` • $${item.price.toFixed(2)}`}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemoveItem(item.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {sortedItems.length === 0 && (
            <p className="text-center text-muted-foreground">No items in shopping list</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
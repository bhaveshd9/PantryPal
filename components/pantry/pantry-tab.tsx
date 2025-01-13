'use client';

import { PantryItem } from '@/types/pantry';
import { StatsCards } from './stats-cards';
import { ItemForm } from './item-form';
import { ItemCard } from './item-card';

interface PantryTabProps {
  items: PantryItem[];
  stats: {
    totalItems: number;
    expiringItems: number;
    categories: number;
  };
  searchQuery: string;
  onAddItem: (item: Omit<PantryItem, 'id'>) => void;
  onEditItem: (item: PantryItem) => void;
  onDeleteItem: (id: string) => void;
}

export function PantryTab({
  items,
  stats,
  searchQuery,
  onAddItem,
  onEditItem,
  onDeleteItem,
}: PantryTabProps) {
  return (
    <div className="space-y-6">
      <StatsCards stats={stats} />
      <div className="flex justify-end">
        <ItemForm onSubmit={onAddItem} />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            onEdit={onEditItem}
            onDelete={onDeleteItem}
          />
        ))}
        {items.length === 0 && (
          <p className="text-muted-foreground col-span-full text-center py-8">
            {searchQuery ? 'No items found matching your search.' : 'No items in your pantry. Add some items to get started!'}
          </p>
        )}
      </div>
    </div>
  );
}
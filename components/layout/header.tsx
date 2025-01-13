'use client';

import { Utensils } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto py-4 px-4">
        <div className="flex items-center gap-2">
          <Utensils className="h-6 w-6" />
          <h1 className="text-2xl font-bold">PantryPal</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Track your pantry items, manage recipes, and create shopping lists
        </p>
      </div>
    </header>
  );
}
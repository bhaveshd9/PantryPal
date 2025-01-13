'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRecipes } from '@/lib/hooks/useRecipes';
import { usePantryItems } from '@/lib/hooks/usePantryItems';
import { useShoppingList } from '@/lib/hooks/useShoppingList';
import { SearchBar } from '@/components/pantry/search-bar';
import { ShoppingList } from '@/components/pantry/shopping-list';
import { PantryTab } from '@/components/pantry/pantry-tab';
import { RecipesTab } from '@/components/pantry/recipes-tab';
import { Header } from '@/components/layout/header';

export default function Home() {
  const [activeTab, setActiveTab] = useState('pantry');
  const [searchQuery, setSearchQuery] = useState('');

  const {
    items,
    addItem,
    editItem,
    deleteItem,
  } = usePantryItems();

  const {
    recipes,
    addRecipe,
    editRecipe,
    deleteRecipe,
  } = useRecipes();

  const {
    shoppingList,
    addItem: addShoppingItem,
    toggleItem: toggleShoppingItem,
    removeItem: removeShoppingItem,
  } = useShoppingList();

  // Filter pantry items based on search query
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate stats
  const stats = {
    totalItems: items.length,
    expiringItems: items.filter(item => {
      const daysUntilExpiration = Math.ceil(
        (new Date(item.expirationDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysUntilExpiration <= 7 && daysUntilExpiration > 0;
    }).length,
    categories: Array.from(new Set(items.map(item => item.category))).length,
  };

  return (
    <>
      <Header />
      <main className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="pantry">Pantry</TabsTrigger>
            <TabsTrigger value="shopping">Shopping List</TabsTrigger>
            <TabsTrigger value="recipes">Recipes</TabsTrigger>
          </TabsList>

          <TabsContent value="pantry">
            <PantryTab
              items={filteredItems}
              stats={stats}
              searchQuery={searchQuery}
              onAddItem={addItem}
              onEditItem={editItem}
              onDeleteItem={deleteItem}
            />
          </TabsContent>

          <TabsContent value="shopping">
            <ShoppingList
              items={shoppingList}
              onToggleItem={toggleShoppingItem}
              onRemoveItem={removeShoppingItem}
              onAddItem={addShoppingItem}
            />
          </TabsContent>

          <TabsContent value="recipes">
            <RecipesTab
              recipes={recipes}
              onAddRecipe={addRecipe}
              onEditRecipe={editRecipe}
              onDeleteRecipe={deleteRecipe}
            />
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}
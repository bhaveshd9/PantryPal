'use client';

import { useState, useMemo, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRecipes } from '@/lib/hooks/useRecipes';
import { usePantryItems } from '@/lib/hooks/usePantryItems';
import { useShoppingList } from '@/lib/hooks/useShoppingList';
import { usePantryStore } from '@/lib/stores/pantry-store';
import { EnhancedSearch } from '@/components/pantry/enhanced-search';
import { ShoppingList } from '@/components/pantry/shopping-list';
import { PantryTab } from '@/components/pantry/pantry-tab';
import { RecipesTab } from '@/components/pantry/recipes-tab';
import { Header } from '@/components/layout/header';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { PageLoading, SectionLoading } from '@/components/ui/loading-states';
import { usePantryShortcuts } from '@/lib/hooks/useKeyboardShortcuts';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

// Import the SearchFilters type from the EnhancedSearch component
type SearchFilters = {
  query: string;
  category: string;
  sortBy: 'name' | 'expirationDate' | 'category' | 'createdAt';
  sortOrder: 'asc' | 'desc';
  expiringSoon: boolean;
  inStock: boolean;
  priceRange: [number, number];
};

export default function Home() {
  const [activeTab, setActiveTab] = useState('pantry');
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    query: '',
    category: '',
    sortBy: 'name',
    sortOrder: 'asc',
    expiringSoon: false,
    inStock: false,
    priceRange: [0, 1000],
  });

  // Initialize keyboard shortcuts
  usePantryShortcuts();

  // Get data from hooks
  const {
    items: pantryItems,
    loading: pantryLoading,
    error: pantryError,
    addItem,
    editItem,
    deleteItem,
  } = usePantryItems();

  const {
    recipes,
    loading: recipesLoading,
    error: recipesError,
    addRecipe,
    editRecipe,
    deleteRecipe,
  } = useRecipes();

  const {
    shoppingList,
    loading: shoppingLoading,
    error: shoppingError,
    addItem: addShoppingItem,
    toggleItem: toggleShoppingItem,
    removeItem: removeShoppingItem,
  } = useShoppingList();

  // Get store for computed values
  const { getPantryStats } = usePantryStore();

  // Filter and sort pantry items based on search filters
  const filteredItems = useMemo(() => {
    let filtered = pantryItems;

    // Text search
    if (searchFilters.query) {
      const query = searchFilters.query.toLowerCase();
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        (item.notes && item.notes.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (searchFilters.category) {
      filtered = filtered.filter(item => item.category === searchFilters.category);
    }

    // Expiring soon filter
    if (searchFilters.expiringSoon) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() + 7);
      filtered = filtered.filter(item => {
        const expirationDate = new Date(item.expirationDate);
        return expirationDate <= cutoffDate && expirationDate >= new Date();
      });
    }

    // In stock filter
    if (searchFilters.inStock) {
      filtered = filtered.filter(item => item.quantity > 0);
    }

    // Price range filter
    if (searchFilters.priceRange[0] > 0 || searchFilters.priceRange[1] < 1000) {
      filtered = filtered.filter(item => {
        if (!item.price) return false;
        return item.price >= searchFilters.priceRange[0] && item.price <= searchFilters.priceRange[1];
      });
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (searchFilters.sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'expirationDate':
          aValue = new Date(a.expirationDate);
          bValue = new Date(b.expirationDate);
          break;
        case 'category':
          aValue = a.category.toLowerCase();
          bValue = b.category.toLowerCase();
          break;
        case 'createdAt':
          // Note: createdAt is not available in current data structure
          aValue = 0;
          bValue = 0;
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (searchFilters.sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [pantryItems, searchFilters]);

  // Calculate stats - memoized to prevent unnecessary recalculations
  const stats = useMemo(() => getPantryStats(), [getPantryStats]);

  // Get unique categories for search - memoized
  const categories = useMemo(() => {
    const uniqueCategories = new Set(pantryItems.map(item => item.category));
    return Array.from(uniqueCategories).sort();
  }, [pantryItems]);

  // Get max price for search - memoized
  const maxPrice = useMemo(() => {
    const prices = pantryItems.map(item => item.price || 0);
    return Math.max(1000, ...prices);
  }, [pantryItems]);

  // Memoized callback for search filters
  const handleSearchFiltersChange = useCallback((newFilters: SearchFilters) => {
    setSearchFilters(newFilters);
  }, []);

  // Memoized callback for tab change
  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
  }, []);

  const handleDeductItems = useCallback((itemsToDeduct: { id: string; quantity: number }[]) => {
    itemsToDeduct.forEach(({ id, quantity }) => {
      const pantryItem = pantryItems.find(item => item.id === id);
      if (pantryItem) {
        const newQuantity = Math.max(0, pantryItem.quantity - quantity);
        editItem({ ...pantryItem, quantity: newQuantity });
      }
    });
  }, [pantryItems, editItem]);

  const handleUpdatePrice = useCallback((itemName: string, newPrice: number) => {
    const pantryItem = pantryItems.find(item => 
      item.name.toLowerCase() === itemName.toLowerCase()
    );
    if (pantryItem) {
      editItem({ ...pantryItem, price: newPrice });
    }
  }, [pantryItems, editItem]);

  // Show loading state if any data is loading
  if (pantryLoading && pantryItems.length === 0) {
    return <PageLoading />;
  }

  return (
    <ErrorBoundary>
      <Header />
      <main className="container mx-auto py-8 px-4">
        {/* Error Alerts */}
        {pantryError && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>Error loading pantry items: {pantryError}</AlertDescription>
          </Alert>
        )}

        {recipesError && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>Error loading recipes: {recipesError}</AlertDescription>
          </Alert>
        )}

        {shoppingError && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>Error loading shopping list: {shoppingError}</AlertDescription>
          </Alert>
        )}

        {/* Enhanced Search */}
        <div className="mb-8">
          <EnhancedSearch
            onSearch={handleSearchFiltersChange}
            categories={categories}
            maxPrice={maxPrice}
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
          <TabsList>
            <TabsTrigger value="pantry" data-tab="pantry">Pantry</TabsTrigger>
            <TabsTrigger value="shopping" data-tab="shopping">Shopping List</TabsTrigger>
            <TabsTrigger value="recipes" data-tab="recipes">Recipes</TabsTrigger>
          </TabsList>

          <TabsContent value="pantry">
            {pantryLoading ? (
              <SectionLoading />
            ) : (
              <PantryTab
                items={filteredItems}
                stats={stats}
                searchQuery={searchFilters.query}
                onAddItem={addItem}
                onEditItem={editItem}
                onDeleteItem={deleteItem}
              />
            )}
          </TabsContent>

          <TabsContent value="shopping">
            {shoppingLoading ? (
              <SectionLoading />
            ) : (
              <ShoppingList
                items={shoppingList}
                pantryItems={pantryItems}
                onToggleItem={toggleShoppingItem}
                onRemoveItem={removeShoppingItem}
                onAddItem={addShoppingItem}
                onUpdatePrice={handleUpdatePrice}
                onAddToPantry={addItem}
              />
            )}
          </TabsContent>

          <TabsContent value="recipes">
            {recipesLoading ? (
              <SectionLoading />
            ) : (
              <RecipesTab
                recipes={recipes}
                pantryItems={pantryItems}
                onAddRecipe={addRecipe}
                onEditRecipe={editRecipe}
                onDeleteRecipe={deleteRecipe}
                onDeductItems={handleDeductItems}
                onUpdatePrice={handleUpdatePrice}
              />
            )}
          </TabsContent>
        </Tabs>
      </main>
    </ErrorBoundary>
  );
}
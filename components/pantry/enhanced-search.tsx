'use client';

import { useState, useMemo } from 'react';
import { Search, Filter, SortAsc, SortDesc, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';

interface SearchFilters {
  query: string;
  category: string;
  sortBy: 'name' | 'expirationDate' | 'category' | 'createdAt';
  sortOrder: 'asc' | 'desc';
  expiringSoon: boolean;
  inStock: boolean;
  priceRange: [number, number];
}

interface EnhancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  categories: string[];
  maxPrice: number;
  className?: string;
}

export function EnhancedSearch({ 
  onSearch, 
  categories, 
  maxPrice, 
  className = '' 
}: EnhancedSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: '',
    sortBy: 'name',
    sortOrder: 'asc',
    expiringSoon: false,
    inStock: false,
    priceRange: [0, maxPrice],
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.query) count++;
    if (filters.category) count++;
    if (filters.expiringSoon) count++;
    if (filters.inStock) count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice) count++;
    return count;
  }, [filters, maxPrice]);

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onSearch(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: SearchFilters = {
      query: '',
      category: '',
      sortBy: 'name',
      sortOrder: 'asc',
      expiringSoon: false,
      inStock: false,
      priceRange: [0, maxPrice],
    };
    setFilters(clearedFilters);
    onSearch(clearedFilters);
  };

  const clearFilter = (key: keyof SearchFilters) => {
    const newFilters = { ...filters };
    if (key === 'query') newFilters.query = '';
    else if (key === 'category') newFilters.category = '';
    else if (key === 'expiringSoon') newFilters.expiringSoon = false;
    else if (key === 'inStock') newFilters.inStock = false;
    else if (key === 'priceRange') newFilters.priceRange = [0, maxPrice];
    
    setFilters(newFilters);
    onSearch(newFilters);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search items..."
            value={filters.query}
            onChange={(e) => handleFilterChange('query', e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="relative">
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Filters</h4>
                {activeFiltersCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear all
                  </Button>
                )}
              </div>
              
              <Separator />
              
              {/* Category Filter */}
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort Options */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label>Sort by</Label>
                  <Select value={filters.sortBy} onValueChange={(value: any) => handleFilterChange('sortBy', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="expirationDate">Expiration Date</SelectItem>
                      <SelectItem value="category">Category</SelectItem>
                      <SelectItem value="createdAt">Date Added</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Order</Label>
                  <Select value={filters.sortOrder} onValueChange={(value: any) => handleFilterChange('sortOrder', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asc">Ascending</SelectItem>
                      <SelectItem value="desc">Descending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Checkbox Filters */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="expiringSoon"
                    checked={filters.expiringSoon}
                    onCheckedChange={(checked) => handleFilterChange('expiringSoon', checked)}
                  />
                  <Label htmlFor="expiringSoon">Expiring soon (7 days)</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="inStock"
                    checked={filters.inStock}
                    onCheckedChange={(checked) => handleFilterChange('inStock', checked)}
                  />
                  <Label htmlFor="inStock">In stock only</Label>
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <Label>Price Range</Label>
                <div className="px-2">
                  <Slider
                    value={filters.priceRange}
                    onValueChange={(value) => handleFilterChange('priceRange', value)}
                    max={maxPrice}
                    step={0.01}
                    className="w-full"
                  />
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>${filters.priceRange[0].toFixed(2)}</span>
                  <span>${filters.priceRange[1].toFixed(2)}</span>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.query && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search: {filters.query}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => clearFilter('query')}
              />
            </Badge>
          )}
          
          {filters.category && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Category: {filters.category}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => clearFilter('category')}
              />
            </Badge>
          )}
          
          {filters.expiringSoon && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Expiring soon
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => clearFilter('expiringSoon')}
              />
            </Badge>
          )}
          
          {filters.inStock && (
            <Badge variant="secondary" className="flex items-center gap-1">
              In stock
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => clearFilter('inStock')}
              />
            </Badge>
          )}
          
          {(filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice) && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Price: ${filters.priceRange[0].toFixed(2)} - ${filters.priceRange[1].toFixed(2)}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => clearFilter('priceRange')}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
} 
'use client';

import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { defaultCategories, commonShoppingItems, commonUnits } from '@/lib/pantry-data';
import { ShoppingListItem, PantryItem } from '@/types/pantry';
import { Plus, Search, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

interface ShoppingListFormProps {
  onSubmit: (item: Omit<ShoppingListItem, 'id' | 'isChecked'>) => void;
  pantryItems: PantryItem[];
  onUpdatePrice?: (itemName: string, newPrice: number) => void;
}

export function ShoppingListForm({ onSubmit, pantryItems, onUpdatePrice }: ShoppingListFormProps) {
  const [open, setOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [customUnit, setCustomUnit] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    quantity: 1,
    unit: 'pieces',
    category: defaultCategories[0].name,
    price: undefined as number | undefined,
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Combine pantry items and common shopping items for suggestions
  const allSuggestions = [
    // First add pantry items with current quantities (excluding expired items)
    ...pantryItems
      .filter(item => new Date(item.expirationDate) > new Date()) // Only non-expired items
      .reduce((acc, item) => {
        const existing = acc.find(s => s.name.toLowerCase() === item.name.toLowerCase());
        if (!existing) {
          acc.push({
            name: item.name,
            unit: item.unit,
            category: item.category,
            price: item.price,
            currentQuantity: item.quantity,
            source: 'pantry' as const
          });
        } else {
          existing.currentQuantity += item.quantity;
        }
        return acc;
      }, [] as { name: string; unit: string; category: string; price?: number; currentQuantity: number; source: 'pantry' }[]),
    
    // Then add common shopping items (without duplicates from pantry)
    ...commonShoppingItems
      .filter(commonItem => !pantryItems
        .filter(item => new Date(item.expirationDate) > new Date()) // Only check non-expired items
        .some(pantryItem => 
          pantryItem.name.toLowerCase() === commonItem.name.toLowerCase()
        )
      )
      .map(item => ({
        ...item,
        price: undefined,
        currentQuantity: 0,
        source: 'common' as const
      }))
  ];

  const filteredSuggestions = allSuggestions.filter(item =>
    item.name.toLowerCase().includes(formData.name.toLowerCase())
  ).slice(0, 8); // Limit to 8 suggestions

  const handlePriceUpdate = () => {
    const pantryItem = pantryItems.find(item => 
      item.name.toLowerCase() === formData.name.toLowerCase()
    );
    
    if (pantryItem && formData.price !== undefined && onUpdatePrice) {
      onUpdatePrice(formData.name, formData.price);
      toast.success(`Price updated for ${formData.name}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalUnit = formData.unit === 'custom' ? customUnit : formData.unit;
    onSubmit({
      ...formData,
      unit: finalUnit
    });
    
    if (formData.price !== undefined) {
      handlePriceUpdate();
    }
    
    setOpen(false);
    setFormData({
      name: '',
      quantity: 1,
      unit: 'pieces',
      category: defaultCategories[0].name,
      price: undefined,
    });
    setCustomUnit('');
  };

  const handleItemSelect = (itemName: string) => {
    const selectedItem = allSuggestions.find(item => item.name === itemName);
    if (selectedItem) {
      // Suggest a smart quantity based on current pantry level
      let suggestedQuantity = 1;
      if (selectedItem.source === 'pantry') {
        if (selectedItem.currentQuantity === 0) {
          suggestedQuantity = 2;
        } else if (selectedItem.currentQuantity <= 1) {
          suggestedQuantity = 1;
        } else if (selectedItem.currentQuantity <= 3) {
          suggestedQuantity = 1;
        }
      }
      
      setFormData(prev => ({
        ...prev,
        name: selectedItem.name,
        unit: selectedItem.unit,
        category: selectedItem.category,
        price: selectedItem.price,
        quantity: suggestedQuantity
      }));
    }
    setShowSuggestions(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, name: value }));
    
    if (value.length > 0) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleInputFocus = () => {
    if (formData.name.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    // Delay to allow clicking on suggestions
    setTimeout(() => setShowSuggestions(false), 200);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current && 
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add to Shopping List
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Shopping List Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Item Name</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                ref={inputRef}
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                className="pl-10"
                placeholder="Start typing to see suggestions..."
                required
                autoComplete="off"
              />
              {showSuggestions && (
                <div 
                  ref={suggestionsRef}
                  className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto"
                >
                  {filteredSuggestions.length === 0 ? (
                    <div className="p-3 text-sm text-muted-foreground">
                      {formData.name ? (
                        `No matching items found. You can add "${formData.name}" as a new item.`
                      ) : (
                        "Start typing to see suggestions from your pantry and common items."
                      )}
                    </div>
                  ) : (
                    <div>
                      {filteredSuggestions.map((item) => (
                        <button
                          key={item.name}
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            handleItemSelect(item.name);
                          }}
                          className="w-full px-3 py-2 text-left hover:bg-gray-100 flex justify-between items-center border-b border-gray-100 last:border-b-0"
                        >
                          <div className="flex-1">
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {item.unit} • {item.category}
                              {item.source === 'pantry' && (
                                <span className="text-blue-600 ml-2">
                                  (Have: {item.currentQuantity})
                                </span>
                              )}
                              {item.source === 'common' && (
                                <span className="text-green-600 ml-2">
                                  (Common item)
                                </span>
                              )}
                            </div>
                          </div>
                          {item.price && (
                            <div className="text-sm text-muted-foreground ml-2">
                              ${item.price.toFixed(2)}
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            {formData.name && !allSuggestions.find(item => item.name.toLowerCase() === formData.name.toLowerCase()) && (
              <p className="text-xs text-blue-600">
                💡 This appears to be a new item. Fill in the details below.
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <div className="flex gap-2">
                <Select
                  value={formData.unit}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, unit: value }))}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {commonUnits.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                    <SelectItem value="custom">Custom...</SelectItem>
                  </SelectContent>
                </Select>
                {formData.unit === 'custom' && (
                  <Input
                    placeholder="Enter unit"
                    value={customUnit}
                    onChange={(e) => setCustomUnit(e.target.value)}
                    className="flex-1"
                    required
                  />
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {defaultCategories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price (optional)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price || ''}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                price: e.target.value ? parseFloat(e.target.value) : undefined 
              }))}
            />
          </div>

          <Button type="submit" className="w-full">
            Add Item
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
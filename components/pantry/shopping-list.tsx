'use client';

import { useState } from 'react';
import { ShoppingListItem, PantryItem } from '@/types/pantry';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Trash2, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ShoppingListForm } from './shopping-list-form';

interface ShoppingListProps {
  items: ShoppingListItem[];
  pantryItems: PantryItem[];
  onToggleItem: (id: string) => void;
  onRemoveItem: (id: string) => void;
  onAddItem: (item: Omit<ShoppingListItem, 'id' | 'isChecked'>) => void;
  onUpdatePrice?: (itemName: string, newPrice: number) => void;
  onAddToPantry?: (item: Omit<PantryItem, 'id'>) => void;
}

export function ShoppingList({ 
  items, 
  pantryItems, 
  onToggleItem, 
  onRemoveItem, 
  onAddItem, 
  onUpdatePrice,
  onAddToPantry 
}: ShoppingListProps) {
  const [sortBy, setSortBy] = useState<'category' | 'name'>('category');
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
  const [purchasedItem, setPurchasedItem] = useState<ShoppingListItem | null>(null);
  const [purchaseDetails, setPurchaseDetails] = useState({
    quantity: '',
    unit: '',
    price: '',
    expirationDate: '',
    location: 'Pantry',
    notes: ''
  });

  const sortedItems = [...items].sort((a, b) => {
    if (sortBy === 'category') {
      return a.category.localeCompare(b.category) || a.name.localeCompare(b.name);
    }
    return a.name.localeCompare(b.name);
  });

  const handleToggleItem = (item: ShoppingListItem) => {
    if (item.isChecked) {
      // If item is already checked, just uncheck it
      onToggleItem(item.id);
    } else {
      // If item is being checked, show purchase dialog
      setPurchasedItem(item);
      setPurchaseDetails({
        quantity: item.quantity.toString(),
        unit: item.unit,
        price: item.price?.toString() || '',
        expirationDate: '',
        location: 'Pantry',
        notes: `Purchased from shopping list`
      });
      setShowPurchaseDialog(true);
    }
  };

  const handleConfirmPurchase = () => {
    if (!purchasedItem || !onAddToPantry) return;

    const quantity = parseFloat(purchaseDetails.quantity);
    const price = parseFloat(purchaseDetails.price) || 0;

    if (isNaN(quantity) || quantity <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }

    // Calculate expiration date (default to 7 days from now if not specified)
    let expirationDate = purchaseDetails.expirationDate;
    if (!expirationDate) {
      const defaultExpiration = new Date();
      defaultExpiration.setDate(defaultExpiration.getDate() + 7);
      expirationDate = defaultExpiration.toISOString().split('T')[0];
    }

    // Add to pantry
    onAddToPantry({
      name: purchasedItem.name,
      quantity,
      unit: purchaseDetails.unit,
      category: purchasedItem.category,
      expirationDate,
      location: purchaseDetails.location,
      price,
      notes: purchaseDetails.notes
    });

    // Mark as purchased in shopping list
    onToggleItem(purchasedItem.id);

    // Close dialog and reset
    setShowPurchaseDialog(false);
    setPurchasedItem(null);
    setPurchaseDetails({
      quantity: '',
      unit: '',
      price: '',
      expirationDate: '',
      location: 'Pantry',
      notes: ''
    });

    toast.success(`${purchasedItem.name} added to pantry and marked as purchased!`);
  };

  const handleCancelPurchase = () => {
    setShowPurchaseDialog(false);
    setPurchasedItem(null);
    setPurchaseDetails({
      quantity: '',
      unit: '',
      price: '',
      expirationDate: '',
      location: 'Pantry',
      notes: ''
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Shopping List</CardTitle>
            <ShoppingListForm onSubmit={onAddItem} pantryItems={pantryItems} onUpdatePrice={onUpdatePrice} />
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
                    onCheckedChange={() => handleToggleItem(item)}
                  />
                  <div className={item.isChecked ? 'line-through text-muted-foreground' : ''}>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.quantity} {item.unit} • {item.category}
                      {item.price && ` • ${item.price.toFixed(2)}`}
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

      {/* Purchase Confirmation Dialog */}
      <Dialog open={showPurchaseDialog} onOpenChange={setShowPurchaseDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Purchase</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              You're marking <strong>{purchasedItem?.name}</strong> as purchased. 
              Please confirm the details and it will be added to your pantry.
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  step="0.01"
                  value={purchaseDetails.quantity}
                  onChange={(e) => setPurchaseDetails(prev => ({ ...prev, quantity: e.target.value }))}
                  placeholder="Enter quantity"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Input
                  id="unit"
                  value={purchaseDetails.unit}
                  onChange={(e) => setPurchaseDetails(prev => ({ ...prev, unit: e.target.value }))}
                  placeholder="e.g., pieces, lbs, etc."
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={purchaseDetails.price}
                  onChange={(e) => setPurchaseDetails(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="Enter price"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Select 
                  value={purchaseDetails.location} 
                  onValueChange={(value) => setPurchaseDetails(prev => ({ ...prev, location: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pantry">Pantry</SelectItem>
                    <SelectItem value="Fridge">Fridge</SelectItem>
                    <SelectItem value="Freezer">Freezer</SelectItem>
                    <SelectItem value="Spice Rack">Spice Rack</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiration">Expiration Date (Optional)</Label>
              <Input
                id="expiration"
                type="date"
                value={purchaseDetails.expirationDate}
                onChange={(e) => setPurchaseDetails(prev => ({ ...prev, expirationDate: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground">
                Leave empty to set default expiration (7 days from today)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Input
                id="notes"
                value={purchaseDetails.notes}
                onChange={(e) => setPurchaseDetails(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Any additional notes..."
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleCancelPurchase} variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleConfirmPurchase} className="flex-1">
                <Plus className="h-4 w-4 mr-2" />
                Add to Pantry & Mark Purchased
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
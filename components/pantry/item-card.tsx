'use client';

import { useState } from 'react';
import { PantryItem } from '@/types/pantry';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Clock, Edit, Trash2, DollarSign } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ItemForm } from './item-form';
import { toast } from 'sonner';

interface ItemCardProps {
  item: PantryItem;
  onEdit: (item: PantryItem) => void;
  onDelete: (id: string) => void;
}

export function ItemCard({ item, onEdit, onDelete }: ItemCardProps) {
  const [showEditForm, setShowEditForm] = useState(false);
  const [showPriceDialog, setShowPriceDialog] = useState(false);
  const [newPrice, setNewPrice] = useState(item.price?.toString() || '');
  
  const expirationDate = new Date(item.expirationDate);
  const isExpired = expirationDate < new Date();
  const expiresText = isExpired 
    ? `expired ${formatDistanceToNow(expirationDate, { addSuffix: true })}` 
    : `expires in ${formatDistanceToNow(expirationDate)}`;
  
  const handleEdit = (editedItem: Omit<PantryItem, 'id'>) => {
    onEdit({ ...editedItem, id: item.id });
    setShowEditForm(false);
  };

  const handlePriceUpdate = () => {
    const price = newPrice ? parseFloat(newPrice) : undefined;
    onEdit({ ...item, price });
    setShowPriceDialog(false);
    toast.success(`Price updated for ${item.name}`);
  };

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{item.name}</h3>
            <p className="text-sm text-muted-foreground">
              {item.quantity} {item.unit}
            </p>
            {item.price && (
              <p className="text-sm font-medium text-green-600 flex items-center gap-1 mt-1">
                <DollarSign className="w-3 h-3" />
                {item.price.toFixed(2)}
              </p>
            )}
          </div>
          <Badge variant="secondary">{item.category}</Badge>
        </div>
        <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span className={isExpired ? 'text-destructive' : ''}>{expiresText}</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        {/* Quick Price Update */}
        <Dialog open={showPriceDialog} onOpenChange={setShowPriceDialog}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <DollarSign className="w-4 h-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[300px]">
            <DialogHeader>
              <DialogTitle>Update Price for {item.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="price">New Price</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  placeholder="Enter new price"
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handlePriceUpdate}
                  className="flex-1"
                >
                  Update Price
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setShowPriceDialog(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        
        <ItemForm
          item={item}
          onSubmit={handleEdit}
          open={showEditForm}
          onOpenChange={setShowEditForm}
          trigger={
            <Button variant="ghost" size="icon">
              <Edit className="w-4 h-4" />
            </Button>
          }
        />
        <Button variant="ghost" size="icon" onClick={() => onDelete(item.id)}>
          <Trash2 className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
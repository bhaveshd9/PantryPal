'use client';

import { useState } from 'react';
import { PantryItem } from '@/types/pantry';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Edit, Trash2 } from 'lucide-react';
import { formatDistanceToNow, isFuture } from 'date-fns';
import { ItemForm } from './item-form';

interface ItemCardProps {
  item: PantryItem;
  onEdit: (item: PantryItem) => void;
  onDelete: (id: string) => void;
}

export function ItemCard({ item, onEdit, onDelete }: ItemCardProps) {
  const [showEditForm, setShowEditForm] = useState(false);
  const expirationDate = new Date(item.expirationDate);
  const isExpired = !isFuture(expirationDate);
  const expiresText = isExpired 
    ? `expired ${formatDistanceToNow(expirationDate, { addSuffix: true })}` 
    : `expires in ${formatDistanceToNow(expirationDate)}`;
  
  const handleEdit = (editedItem: Omit<PantryItem, 'id'>) => {
    onEdit({ ...editedItem, id: item.id });
    setShowEditForm(false);
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
          </div>
          <Badge variant="secondary">{item.category}</Badge>
        </div>
        <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span className={isExpired ? 'text-destructive' : ''}>{expiresText}</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
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
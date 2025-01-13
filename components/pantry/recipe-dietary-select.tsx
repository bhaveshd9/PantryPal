'use client';

import { DietaryType, DIETARY_TYPES } from '@/types/recipe';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface RecipeDietarySelectProps {
  value: DietaryType;
  onValueChange: (value: DietaryType) => void;
}

export function RecipeDietarySelect({ value, onValueChange }: RecipeDietarySelectProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="dietaryType">Dietary Type</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger id="dietaryType">
          <SelectValue placeholder="Select dietary type" />
        </SelectTrigger>
        <SelectContent>
          {DIETARY_TYPES.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              <div className="flex flex-col">
                <span>{type.label}</span>
                <span className="text-xs text-muted-foreground">{type.description}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
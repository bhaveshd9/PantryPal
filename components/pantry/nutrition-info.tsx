'use client';

import { NutritionInfo } from '@/types/pantry';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface NutritionInfoProps {
  nutrition: NutritionInfo;
}

export function NutritionInfoDisplay({ nutrition }: NutritionInfoProps) {
  return (
    <div className="w-full">
      <h3 className="text-sm font-medium mb-2">Nutrition Information</h3>
      <p className="text-sm text-muted-foreground mb-2">
        Per {nutrition.servingSize} serving
      </p>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nutrient</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Calories</TableCell>
            <TableCell className="text-right">{nutrition.calories}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Protein</TableCell>
            <TableCell className="text-right">{nutrition.protein}g</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Carbohydrates</TableCell>
            <TableCell className="text-right">{nutrition.carbs}g</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Fat</TableCell>
            <TableCell className="text-right">{nutrition.fat}g</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
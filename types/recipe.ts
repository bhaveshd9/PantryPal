export type DietaryType = 'vegetarian' | 'vegan' | 'non-vegetarian';

export interface DietaryTypeOption {
  value: DietaryType;
  label: string;
  description: string;
}

export const DIETARY_TYPES: DietaryTypeOption[] = [
  {
    value: 'vegetarian',
    label: 'Vegetarian',
    description: 'No meat, may include dairy and eggs'
  },
  {
    value: 'vegan',
    label: 'Vegan',
    description: 'No animal products'
  },
  {
    value: 'non-vegetarian',
    label: 'Non-Vegetarian',
    description: 'May include meat and animal products'
  }
];
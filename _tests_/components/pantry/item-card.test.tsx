import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ItemCard } from '@/components/pantry/item-card';
import { PantryItem } from '@/types/pantry';

// Mock the toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock the ItemForm component
jest.mock('@/components/pantry/item-form', () => ({
  ItemForm: ({ trigger, open, onOpenChange }: any) => (
    <div>
      <div onClick={() => onOpenChange(true)} data-testid="edit-trigger">
        {trigger}
      </div>
      {open && <div data-testid="edit-form">Edit Form</div>}
    </div>
  ),
}));

describe('ItemCard', () => {
  const mockItem: PantryItem = {
    id: '1',
    name: 'Test Apple',
    quantity: 5,
    unit: 'pieces',
    category: 'Fruits',
    expirationDate: '2024-12-31',
    location: 'Fridge',
    price: 3.99,
    notes: 'Organic red apples',
    nutritionInfo: {
      calories: 95,
      protein: 0.5,
      carbs: 25,
      fat: 0.3,
      servingSize: '1 medium apple'
    }
  };

  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders item information correctly', () => {
    render(
      <ItemCard
        item={mockItem}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Test Apple')).toBeInTheDocument();
    expect(screen.getByText('5 pieces')).toBeInTheDocument();
    expect(screen.getByText('Fruits')).toBeInTheDocument();
    expect(screen.getByText('3.99')).toBeInTheDocument();
  });

  it('shows expiration text for items expiring soon', () => {
    const expiringItem = {
      ...mockItem,
      expirationDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 3 days from now
    };

    render(
      <ItemCard
        item={expiringItem}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText(/expires in/i)).toBeInTheDocument();
  });

  it('shows expired text for expired items', () => {
    const expiredItem = {
      ...mockItem,
      expirationDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 1 day ago
    };

    render(
      <ItemCard
        item={expiredItem}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText(/expired/i)).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    render(
      <ItemCard
        item={mockItem}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const editButton = screen.getByTestId('edit-trigger');
    fireEvent.click(editButton);

    expect(screen.getByTestId('edit-form')).toBeInTheDocument();
  });

  it('calls onDelete when delete button is clicked', () => {
    render(
      <ItemCard
        item={mockItem}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    // Find the delete button by looking for the trash icon
    const buttons = screen.getAllByRole('button');
    const deleteButton = buttons.find(button => 
      button.querySelector('svg[class*="trash2"]')
    );
    fireEvent.click(deleteButton!);

    expect(mockOnDelete).toHaveBeenCalledWith(mockItem.id);
  });

  it('handles items without price', () => {
    const itemWithoutPrice = {
      ...mockItem,
      price: undefined
    };

    render(
      <ItemCard
        item={itemWithoutPrice}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.queryByText('3.99')).not.toBeInTheDocument();
  });

  it('displays price update dialog when price button is clicked', () => {
    render(
      <ItemCard
        item={mockItem}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    // Find the price button by looking for the dollar sign icon
    const buttons = screen.getAllByRole('button');
    const priceButton = buttons.find(button => 
      button.querySelector('svg[class*="dollar-sign"]')
    );
    
    fireEvent.click(priceButton!);

    expect(screen.getByText(`Update Price for ${mockItem.name}`)).toBeInTheDocument();
  });

  it('updates price when price dialog form is submitted', () => {
    render(
      <ItemCard
        item={mockItem}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    // Find the price button by looking for the dollar sign icon
    const buttons = screen.getAllByRole('button');
    const priceButton = buttons.find(button => 
      button.querySelector('svg[class*="dollar-sign"]')
    );
    
    fireEvent.click(priceButton!);

    const priceInput = screen.getByLabelText('New Price');
    fireEvent.change(priceInput, { target: { value: '4.50' } });

    const updateButton = screen.getByText('Update Price');
    fireEvent.click(updateButton);

    expect(mockOnEdit).toHaveBeenCalledWith({ ...mockItem, price: 4.50 });
  });
}); 
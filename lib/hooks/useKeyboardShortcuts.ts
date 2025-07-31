'use client';

import { useEffect, useCallback } from 'react';

interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  action: () => void;
  description: string;
}

interface UseKeyboardShortcutsOptions {
  shortcuts: KeyboardShortcut[];
  enabled?: boolean;
}

export function useKeyboardShortcuts({ 
  shortcuts, 
  enabled = true 
}: UseKeyboardShortcutsOptions) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    try {
      // Don't trigger shortcuts when typing in input fields
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable
      ) {
        return;
      }

      for (const shortcut of shortcuts) {
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatch = !!shortcut.ctrl === event.ctrlKey;
        const shiftMatch = !!shortcut.shift === event.shiftKey;
        const altMatch = !!shortcut.alt === event.altKey;
        const metaMatch = !!shortcut.meta === event.metaKey;

        if (keyMatch && ctrlMatch && shiftMatch && altMatch && metaMatch) {
          event.preventDefault();
          shortcut.action();
          break;
        }
      }
    } catch (error) {
      // Prevent event object errors from bubbling up
      if (error && typeof error === 'object' && error.toString() === '[object Event]') {
        console.warn('Keyboard shortcut error caught:', error);
      } else {
        console.error('Keyboard shortcut error:', error);
      }
    }
  }, [shortcuts, enabled]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Helper function to format shortcut for display
  const formatShortcut = (shortcut: KeyboardShortcut): string => {
    const parts: string[] = [];
    
    if (shortcut.ctrl) parts.push('Ctrl');
    if (shortcut.shift) parts.push('Shift');
    if (shortcut.alt) parts.push('Alt');
    if (shortcut.meta) parts.push('⌘');
    
    parts.push(shortcut.key.toUpperCase());
    
    return parts.join(' + ');
  };

  return { formatShortcut };
}

// Predefined shortcuts for common actions
export const commonShortcuts = {
  search: {
    key: 'f',
    ctrl: true,
    action: () => {
      const searchInput = document.querySelector('input[placeholder*="search" i]') as HTMLInputElement;
      if (searchInput) {
        searchInput.focus();
        searchInput.select();
      }
    },
    description: 'Focus search bar',
  },
  
  addItem: {
    key: 'n',
    ctrl: true,
    action: () => {
      const addButton = document.querySelector('button[aria-label*="add" i], button:contains("Add")') as HTMLButtonElement;
      if (addButton) {
        addButton.click();
      }
    },
    description: 'Add new item',
  },
  
  refresh: {
    key: 'r',
    ctrl: true,
    action: () => {
      window.location.reload();
    },
    description: 'Refresh page',
  },
  
  help: {
    key: '?',
    action: () => {
      // Toggle help modal or show keyboard shortcuts
      console.log('Show keyboard shortcuts help');
    },
    description: 'Show keyboard shortcuts',
  },
  
  escape: {
    key: 'Escape',
    action: () => {
      // Close modals, dropdowns, etc.
      const modals = document.querySelectorAll('[role="dialog"]');
      modals.forEach(modal => {
        const closeButton = modal.querySelector('button[aria-label="Close"], button:contains("Close")') as HTMLButtonElement;
        if (closeButton) {
          closeButton.click();
        }
      });
    },
    description: 'Close modal or cancel action',
  },
};

// Hook for pantry-specific shortcuts
export function usePantryShortcuts() {
  const shortcuts: KeyboardShortcut[] = [
    commonShortcuts.search,
    commonShortcuts.addItem,
    commonShortcuts.refresh,
    commonShortcuts.help,
    commonShortcuts.escape,
    {
      key: '1',
      action: () => {
        const pantryTab = document.querySelector('[data-tab="pantry"]') as HTMLElement;
        if (pantryTab) pantryTab.click();
      },
      description: 'Switch to Pantry tab',
    },
    {
      key: '2',
      action: () => {
        const shoppingTab = document.querySelector('[data-tab="shopping"]') as HTMLElement;
        if (shoppingTab) shoppingTab.click();
      },
      description: 'Switch to Shopping List tab',
    },
    {
      key: '3',
      action: () => {
        const recipesTab = document.querySelector('[data-tab="recipes"]') as HTMLElement;
        if (recipesTab) recipesTab.click();
      },
      description: 'Switch to Recipes tab',
    },
    {
      key: 'Delete',
      action: () => {
        // Delete selected items
        const selectedItems = document.querySelectorAll('[data-selected="true"]');
        if (selectedItems.length > 0) {
          // Trigger delete action for selected items
          console.log('Delete selected items');
        }
      },
      description: 'Delete selected items',
    },
  ];

  return useKeyboardShortcuts({ shortcuts });
} 
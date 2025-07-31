'use client';

import { useEffect, useState } from 'react';
import { PantryService } from '@/lib/services/database';

export default function TestPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testDatabase = async () => {
      try {
        setLoading(true);
        const result = await PantryService.getAllItems();
        setItems(result);
        console.log('Database test successful:', result);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        console.error('Database test failed:', err);
      } finally {
        setLoading(false);
      }
    };

    testDatabase();
  }, []);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">Database Test</h1>
      
      {loading && <p>Loading...</p>}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {!loading && !error && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Items loaded: {items.length}</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(items, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
} 
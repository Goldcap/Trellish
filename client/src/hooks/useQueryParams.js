import { useSearchParams } from 'react-router-dom';
import { useCallback } from 'react';

export function useQueryParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = {
    assigned: searchParams.get('assigned') || '',
    category: searchParams.get('category') || '',
    priority: searchParams.get('priority') || '',
  };

  const setFilter = useCallback(
    (key, value) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (value) {
          next.set(key, value);
        } else {
          next.delete(key);
        }
        return next;
      });
    },
    [setSearchParams]
  );

  const clearFilters = useCallback(() => {
    setSearchParams({});
  }, [setSearchParams]);

  const hasFilters = Object.values(filters).some(Boolean);

  return { filters, setFilter, clearFilters, hasFilters };
}

import { useState, useEffect, useCallback } from 'react';
import api from '../api.js';
import toast from 'react-hot-toast';

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    try {
      const { data } = await api.get('/categories');
      setCategories(data);
    } catch {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const createCategory = useCallback(async (catData) => {
    const { data } = await api.post('/categories', catData);
    setCategories((prev) => [...prev, data]);
    return data;
  }, []);

  const updateCategory = useCallback(async (id, updates) => {
    const { data } = await api.patch(`/categories/${id}`, updates);
    setCategories((prev) => prev.map((c) => (c.id === id ? data : c)));
    return data;
  }, []);

  const deleteCategory = useCallback(async (id) => {
    await api.delete(`/categories/${id}`);
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }, []);

  return { categories, loading, createCategory, updateCategory, deleteCategory, refetch: fetchCategories };
}

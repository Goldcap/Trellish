import { useState, useEffect, useCallback } from 'react';
import api from '../api.js';
import toast from 'react-hot-toast';

export function useCrew() {
  const [crew, setCrew] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCrew = useCallback(async () => {
    try {
      const { data } = await api.get('/crew');
      setCrew(data);
    } catch {
      toast.error('Failed to load crew');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCrew();
  }, [fetchCrew]);

  const updateCrew = useCallback(async (id, updates) => {
    try {
      const { data } = await api.patch(`/crew/${id}`, updates);
      setCrew((prev) => prev.map((c) => (c.id === id ? data : c)));
      toast.success('Crew member updated');
      return data;
    } catch {
      toast.error('Failed to update crew member');
    }
  }, []);

  return { crew, loading, updateCrew, refetch: fetchCrew };
}

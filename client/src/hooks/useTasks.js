import { useState, useEffect, useCallback } from 'react';
import api from '../api.js';
import toast from 'react-hot-toast';

export function useTasks(filters = {}) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    try {
      const params = {};
      if (filters.assigned) params.assigned = filters.assigned;
      if (filters.category) params.category = filters.category;
      if (filters.priority) params.priority = filters.priority;
      const { data } = await api.get('/tasks', { params });
      setTasks(data);
    } catch (err) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [filters.assigned, filters.category, filters.priority]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const updateTask = useCallback(async (id, updates) => {
    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
    try {
      const { data } = await api.patch(`/tasks/${id}`, updates);
      setTasks((prev) => prev.map((t) => (t.id === id ? data : t)));
      return data;
    } catch (err) {
      toast.error('Failed to update task');
      fetchTasks(); // rollback
      throw err;
    }
  }, [fetchTasks]);

  const createTask = useCallback(async (taskData) => {
    const { data } = await api.post('/tasks', taskData);
    setTasks((prev) => [...prev, data]);
    return data;
  }, []);

  const deleteTask = useCallback(async (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    try {
      await api.delete(`/tasks/${id}`);
    } catch {
      toast.error('Failed to delete task');
      fetchTasks();
    }
  }, [fetchTasks]);

  return { tasks, loading, updateTask, createTask, deleteTask, refetch: fetchTasks };
}

import { useState, useEffect, useCallback } from 'react';
import api from '../api.js';
import toast from 'react-hot-toast';

export function useMessages(taskId) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMessages = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const { data } = await api.get('/messages', { params });
      setMessages(data);
    } catch {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (taskId) fetchMessages({ task_id: taskId });
  }, [taskId, fetchMessages]);

  const sendSms = useCallback(async ({ to, taskId: tid, body }) => {
    const { data } = await api.post('/messages/sms', { to, task_id: tid, body });
    if (tid) fetchMessages({ task_id: tid });
    return data;
  }, [fetchMessages]);

  const sendEmail = useCallback(async ({ to, taskId: tid, subject, body }) => {
    const { data } = await api.post('/messages/email', { to, task_id: tid, subject, body });
    if (tid) fetchMessages({ task_id: tid });
    return data;
  }, [fetchMessages]);

  return { messages, loading, fetchMessages, sendSms, sendEmail };
}

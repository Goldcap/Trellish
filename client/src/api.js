import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// Inject auth token
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('dasboot_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Redirect to login on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config.url?.includes('/auth/login')) {
      sessionStorage.removeItem('dasboot_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

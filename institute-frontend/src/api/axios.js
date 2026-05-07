import axios from 'axios';
import { toast } from 'react-toastify';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.detail || error.response?.data?.message || 'Something went wrong';

    if (status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      window.location.href = '/login';
      toast.error('Session expired. Please login again.');
    } else if (status === 403) {
      toast.error('Access denied.');
    } else if (status === 404) {
      toast.error('Resource not found.');
    } else if (status === 422) {
      toast.error('Validation error. Check your input.');
    } else if (status >= 500) {
      toast.error('Server error. Please try again.');
    } else if (!error.response) {
      toast.error('Network error. Is the backend running?');
    }

    return Promise.reject(error);
  }
);

export default api;

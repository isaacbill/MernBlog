import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:5000/api' });

api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('token');
  if (token && cfg.headers) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export const register = (data: any) => api.post('/auth/register', data).then(r => r.data);
export const login = (data: any) => api.post('/auth/login', data).then(r => r.data);
export const fetchMessages = (params?: any) => api.get('/messages', { params }).then(r => r.data);
export const postMessage = (payload: any) => api.post('/messages', payload).then(r => r.data);

export default api;

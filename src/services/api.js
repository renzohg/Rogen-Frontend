import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token a las peticiones autenticadas
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API pública - Autos
export const getAutos = () => api.get('/autos');
export const getAutoById = (id) => api.get(`/autos/${id}`);

// API Admin - Autenticación
export const loginAdmin = (username, password) => 
  api.post('/auth/login', { username, password });

// API Admin - CRUD Autos
export const getAutosAdmin = () => api.get('/admin/autos');
export const getAutoByIdAdmin = (id) => api.get(`/admin/autos/${id}`);
export const createAuto = (auto) => api.post('/admin/autos', auto);
export const updateAuto = (id, auto) => api.put(`/admin/autos/${id}`, auto);
export const deleteAuto = (id) => api.delete(`/admin/autos/${id}`);

export default api;


import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL ?? '/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ──────────────────────────────────────────
// Interceptor de REQUEST
// Añade el Bearer token si el usuario admin está logueado
// ──────────────────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    if (config.headers && config.headers.set) {
      config.headers.set('Authorization', `Bearer ${token}`);
    } else {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return config;
});

// ──────────────────────────────────────────
// Interceptor de RESPONSE
// Si el backend devuelve 401 (token expirado o inválido),
// limpia la sesión y redirige al usuario al inicio
// ──────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config.url.includes('/auth/login')) {
      localStorage.removeItem('token');
      // Recarga la app para que el contexto de Auth se reinicie
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth
export const login = (username, password) =>
  api.post('/auth/login', { username, password });

// Poems
export const getPoems = async (
  page = 0,
  size = 20,
  sortBy = 'createdAt',
  sortDirection = 'DESC'
) => {
  const { data } = await api.get('/poems', {
    params: { page, size, sortBy, sortDirection },
  });

  return {
    poems: data.content ?? [],
    totalElements: data.totalElements ?? 0,
    totalPages: data.totalPages ?? 0,
    currentPage: data.number ?? 0,
    pageSize: data.size ?? size,
    isLast: data.last ?? false,
    isFirst: data.first ?? true,
  };
};
export const getPoemById = (id) => api.get(`/poems/${id}`);
export const createPoem = (data) => api.post('/poems', data);
export const updatePoem = (id, data) => api.put(`/poems/${id}`, data);
export const deletePoem = (id) => api.delete(`/poems/${id}`);

// Comments
export const getCommentsByPoemId = (poemId) => api.get(`/comments/poem/${poemId}`);
export const createComment = (data) => api.post('/comments', data);

export default api;

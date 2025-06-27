import axios from 'axios';

const API_BASE_URL = 'http://localhost:5454/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const adminApi = {
  // Auth
  login: (data: { email: string; password: string }) => api.post('/admin/login', data),

  // Admin Management
  getAdmins: () => api.get('/admin/admins'),
  addAdmin: (data: { firstName: string; lastName: string; email: string; password: string }) => api.post('/admin/admins', data),
  deleteAdmin: (id: string) => api.delete(`/admin/admins/${id}`),
  firstAdmin: (data: { firstName: string; lastName: string; email: string; password: string }) => api.post('/admin/first-admin', data),

  // Customer Management
  getCustomers: () => api.get('/admin/customers'),
  getCustomer: (id: string) => api.get(`/admin/customers/${id}`),
  createCustomer: (data: { firstName: string; lastName: string; email: string; password: string; mobile?: string }) => api.post('/admin/customers', data),
  updateCustomer: (id: string, data: { firstName: string; lastName: string; email: string; mobile?: string }) => api.put(`/admin/customers/${id}`, data),
  blockOrUnblockCustomer: (id: string) => api.put(`/admin/customers/${id}/block`),
  deleteCustomer: (id: string) => api.delete(`/admin/customers/${id}`),
}; 
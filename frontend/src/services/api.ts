import axios from 'axios';
import { handleApiError } from '../utils/helpers';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Token ekleme
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Hata yönetimi
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(handleApiError(error));
  }
);

// Auth endpoints
export const authApi = {
  login: (credentials: { email: string; password: string }) => 
    api.post('/auth/login', credentials),
  register: (userData: { email: string; password: string; username: string }) => 
    api.post('/auth/register', userData),
  me: () => api.get('/auth/me'),
  logout: () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
};

// Student endpoints
export const studentApi = {
  getAll: (params?: { page?: number; limit?: number; search?: string }) => 
    api.get('/students', { params }),
  getById: (id: string) => api.get(`/students/${id}`),
  create: (data: any) => api.post('/students', data),
  update: (id: string, data: any) => api.put(`/students/${id}`, data),
  delete: (id: string) => api.delete(`/students/${id}`),
  getCourses: (id: string) => api.get(`/students/${id}/courses`)
};

// Course endpoints
export const courseApi = {
  getAll: (params?: { page?: number; limit?: number }) => 
    api.get('/courses', { params }),
  getById: (id: string) => api.get(`/courses/${id}`),
  create: (data: any) => api.post('/courses', data),
  update: (id: string, data: any) => api.put(`/courses/${id}`, data),
  delete: (id: string) => api.delete(`/courses/${id}`),
  getStudents: (id: string) => api.get(`/courses/${id}/students`)
};

// Enrollment endpoints
export const enrollmentApi = {
  getAll: (params?: { page?: number; limit?: number }) => 
    api.get('/enrollments', { params }),
  create: (data: { studentId: string; courseId: string }) => 
    api.post('/enrollments', data),
  delete: (id: string) => api.delete(`/enrollments/${id}`)
};

export default api; 
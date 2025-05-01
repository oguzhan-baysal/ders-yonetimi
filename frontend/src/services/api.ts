import axios from 'axios';
import { handleApiError } from '../utils/helpers';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
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
  (response) => {
    // API yanıtını doğrudan response.data olarak dön
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(handleApiError(error));
  }
);

// Generic tip desteği eklenmiş metodlar
const apiWithTypes = {
  get: <T>(url: string, config?: any) => api.get<T, T>(url, config),
  post: <T>(url: string, data?: any, config?: any) => api.post<T, T>(url, data, config),
  put: <T>(url: string, data?: any, config?: any) => api.put<T, T>(url, data, config),
  delete: <T>(url: string, config?: any) => api.delete<T, T>(url, config),
};

// Auth endpoints
export const authApi = {
  login: (credentials: { email: string; password: string }) => 
    api.post('/auth/login', credentials),
  register: (userData: { email: string; password: string; username: string }) => 
    api.post('/auth/register', userData),
  me: () => api.get('/auth/me'),
  logout: () => {
    localStorage.removeItem('token');
    window.location.href = '/auth/login';
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

export default apiWithTypes; 
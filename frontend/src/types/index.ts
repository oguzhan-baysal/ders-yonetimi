// User types
export interface User {
  _id: string;
  username: string;
  email: string;
  role: 'admin' | 'student';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  username: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Student types
export interface Student {
  _id: string;
  firstName: string;
  lastName: string;
  birthDate?: string;
  userId: string | User;
  createdAt: string;
  updatedAt: string;
  email: string;
}

export interface StudentFormData {
  firstName: string;
  lastName: string;
  birthDate?: string;
}

// Course types
export interface Course {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface CourseFormData {
  name: string;
  description: string;
}

// Enrollment types
export interface Enrollment {
  _id: string;
  studentId: string | Student;
  courseId: string | Course;
  enrollmentDate: string;
  createdAt: string;
  updatedAt: string;
}

// API response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pages: number;
  hasMore: boolean;
}

// Store types
export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface StudentsState {
  items: Student[];
  selected: Student | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    total: number;
    pages: number;
    hasMore: boolean;
  };
}

export interface CoursesState {
  items: Course[];
  selected: Course | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    total: number;
    pages: number;
    hasMore: boolean;
  };
} 
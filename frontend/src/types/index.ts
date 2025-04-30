// User types
export interface User {
  _id: string;
  username: string;
  email: string;
  role: 'admin' | 'student';
}

export interface Student {
  _id: string;
  userId: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  fullName?: string;
}

export interface Course {
  _id: string;
  name: string;
  description: string;
}

export interface Enrollment {
  _id: string;
  studentId: string;
  courseId: string;
  enrollmentDate: string;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  username: string;
  role: 'admin' | 'student';
  firstName?: string;
  lastName?: string;
  birthDate?: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pages: number;
  total: number;
} 
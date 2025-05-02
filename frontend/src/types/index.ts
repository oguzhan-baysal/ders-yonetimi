// User types
export interface User {
  _id: string;
  email: string;
  username?: string;
  role: 'admin' | 'student';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  username: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'student';
  birthDate?: string;
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
  email: string;
  birthDate: string;
  studentNumber: string;
  department: string;
  createdAt: string;
  updatedAt: string;
  courses?: Course[];
}

export interface StudentFormData {
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  studentNumber: string;
  department: string;
}

// Course types
export interface Course {
  _id: string;
  code: string;
  name: string;
  description: string;
  instructor: string;
  credits: number;
  semester: string;
  department: string;
  capacity: number;
  enrolledStudents: number;
  createdAt: string;
  updatedAt: string;
}

export interface CourseFormData {
  code: string;
  name: string;
  description: string;
  instructor: string;
  credits: number;
  semester: string;
  department: string;
  capacity: number;
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
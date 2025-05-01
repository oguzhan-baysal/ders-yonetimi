import type { Course } from './index';

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
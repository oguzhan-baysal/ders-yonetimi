export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  studentNumber: string;
  department: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentFormData {
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  studentNumber: string;
  department: string;
} 
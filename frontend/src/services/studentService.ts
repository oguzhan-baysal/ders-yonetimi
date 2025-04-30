import axios from 'axios';
import { Student, StudentFormData } from '../types/student';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const studentService = {
  getAllStudents: async (): Promise<Student[]> => {
    const response = await axios.get(`${API_URL}/students`);
    return response.data;
  },

  getStudentById: async (id: string): Promise<Student> => {
    const response = await axios.get(`${API_URL}/students/${id}`);
    return response.data;
  },

  createStudent: async (data: StudentFormData): Promise<Student> => {
    const response = await axios.post(`${API_URL}/students`, data);
    return response.data;
  },

  updateStudent: async (id: string, data: StudentFormData): Promise<Student> => {
    const response = await axios.put(`${API_URL}/students/${id}`, data);
    return response.data;
  },

  deleteStudent: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/students/${id}`);
  },
}; 
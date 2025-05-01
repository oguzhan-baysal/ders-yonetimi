import api from './api';

export interface Student {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  studentNumber: string;
  department: string;
}

export interface StudentFormData {
  firstName: string;
  lastName: string;
  birthDate?: Date;
}

interface GetStudentsParams {
  page?: number;
  limit?: number;
  search?: string;
}

interface GetStudentsResponse {
  students: Student[];
  total: number;
  page: number;
  pages: number;
  hasMore: boolean;
}

interface StudentResponse {
  student: Student;
}

export const studentService = {
  getAllStudents: async (params?: GetStudentsParams): Promise<GetStudentsResponse> => {
    const { page = 1, limit = 10, search = '' } = params || {};
    try {
      const response = await api.get<GetStudentsResponse>('/students', {
        params: {
          page,
          limit,
          search
        }
      });
      return response;
    } catch (error) {
      console.error('Error fetching students:', error);
      return {
        students: [],
        total: 0,
        page: 1,
        pages: 1,
        hasMore: false
      };
    }
  },

  getStudentById: async (id: string): Promise<Student | null> => {
    try {
      const response = await api.get<Student>(`/students/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching student:', error);
      return null;
    }
  },

  createStudent: async (data: StudentFormData): Promise<Student | null> => {
    try {
      const response = await api.post<Student>('/students', data);
      return response;
    } catch (error) {
      console.error('Error creating student:', error);
      return null;
    }
  },

  updateStudent: async (id: string, data: StudentFormData): Promise<Student | null> => {
    try {
      const response = await api.put<Student>(`/students/${id}`, data);
      return response;
    } catch (error) {
      console.error('Error updating student:', error);
      return null;
    }
  },

  deleteStudent: async (id: string): Promise<boolean> => {
    try {
      await api.delete(`/students/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting student:', error);
      return false;
    }
  },
}; 
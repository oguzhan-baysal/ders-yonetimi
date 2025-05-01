import api from './api';
import type { Course, CourseFormData } from '@/types';

interface GetCoursesParams {
  page?: number;
  limit?: number;
  search?: string;
}

interface GetCoursesResponse {
  courses: Course[];
  total: number;
  page: number;
  pages: number;
  hasMore: boolean;
}

interface CourseResponse {
  course: Course;
}

export const courseService = {
  getAllCourses: async (params?: GetCoursesParams): Promise<GetCoursesResponse> => {
    const { page = 1, limit = 10, search = '' } = params || {};
    try {
      const response = await api.get<GetCoursesResponse>('/courses', {
        params: {
          page,
          limit,
          search
        }
      });
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Dersler yüklenirken bir hata oluştu');
    }
  },

  getCourseById: async (id: string): Promise<Course> => {
    try {
      const response = await api.get<Course>(`/courses/${id}`);
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Ders bilgileri yüklenirken bir hata oluştu');
    }
  },

  createCourse: async (data: CourseFormData): Promise<Course> => {
    try {
      const response = await api.post<Course>('/courses', data);
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Ders oluşturulurken bir hata oluştu');
    }
  },

  updateCourse: async (id: string, data: CourseFormData): Promise<Course> => {
    try {
      const response = await api.put<Course>(`/courses/${id}`, data);
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Ders güncellenirken bir hata oluştu');
    }
  },

  deleteCourse: async (id: string): Promise<void> => {
    try {
      await api.delete(`/courses/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Ders silinirken bir hata oluştu');
    }
  },

  getCourseStudents: async (id: string): Promise<any[]> => {
    try {
      const response = await api.get<any[]>(`/courses/${id}/students`);
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Ders öğrencileri yüklenirken bir hata oluştu');
    }
  },
}; 
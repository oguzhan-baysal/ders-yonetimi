import { create } from 'zustand';
import { courseService } from '@/services/courseService';
import { Course, CourseFormData } from '@/types';
import { toast } from 'react-hot-toast';

interface CourseStore {
  courses: Course[];
  loading: boolean;
  error: string | null;
  selectedCourse: Course | null;
  fetchCourses: () => Promise<void>;
  createCourse: (data: CourseFormData) => Promise<void>;
  updateCourse: (id: string, data: CourseFormData) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;
  setSelectedCourse: (course: Course | null) => void;
}

export const useCourseStore = create<CourseStore>((set) => ({
  courses: [],
  loading: false,
  error: null,
  selectedCourse: null,

  fetchCourses: async () => {
    try {
      set({ loading: true, error: null });
      const response = await courseService.getAllCourses();
      set({ courses: response.courses, loading: false });
    } catch (error: any) {
      const errorMessage = error.message || 'Dersler yüklenirken bir hata oluştu';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },

  createCourse: async (data: CourseFormData) => {
    try {
      set({ loading: true, error: null });
      const course = await courseService.createCourse(data);
      set((state) => ({
        courses: [...state.courses, course],
        loading: false
      }));
      toast.success('Ders başarıyla oluşturuldu');
    } catch (error: any) {
      const errorMessage = error.message || 'Ders oluşturulurken bir hata oluştu';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },

  updateCourse: async (id: string, data: CourseFormData) => {
    try {
      set({ loading: true, error: null });
      const updatedCourse = await courseService.updateCourse(id, data);
      set((state) => ({
        courses: state.courses.map((course) =>
          course._id === id ? updatedCourse : course
        ),
        loading: false,
        selectedCourse: null
      }));
      toast.success('Ders başarıyla güncellendi');
    } catch (error: any) {
      const errorMessage = error.message || 'Ders güncellenirken bir hata oluştu';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },

  deleteCourse: async (id: string) => {
    try {
      set({ loading: true, error: null });
      await courseService.deleteCourse(id);
      set((state) => ({
        courses: state.courses.filter((course) => course._id !== id),
        loading: false
      }));
      toast.success('Ders başarıyla silindi');
    } catch (error: any) {
      const errorMessage = error.message || 'Ders silinirken bir hata oluştu';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },

  setSelectedCourse: (course: Course | null) => {
    set({ selectedCourse: course });
  }
})); 
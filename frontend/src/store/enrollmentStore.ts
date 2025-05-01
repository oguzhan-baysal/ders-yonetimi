import { create } from 'zustand';
import { Enrollment } from '../services/enrollmentService';

interface EnrollmentStore {
  enrollments: Enrollment[];
  setEnrollments: (enrollments: Enrollment[]) => void;
  isEnrolled: (courseId: string) => boolean;
}

export const useEnrollmentStore = create<EnrollmentStore>((set, get) => ({
  enrollments: [],
  setEnrollments: (enrollments) => set({ enrollments }),
  isEnrolled: (courseId) => {
    return get().enrollments.some((enrollment) => 
      (enrollment.courseId as any)?._id === courseId || enrollment.courseId === courseId
    );
  },
})); 
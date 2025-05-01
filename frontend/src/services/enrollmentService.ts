import api from './api';

export interface Enrollment {
  _id: string;
  studentId: string;
  courseId: string;
  enrollmentDate: Date;
  course?: {
    _id: string;
    name: string;
    code: string;
    instructor: string;
    capacity: number;
  };
  student?: {
    _id: string;
    name: string;
    email: string;
    studentNumber: string;
  };
}

export interface CreateEnrollmentDTO {
  courseId: string;
}

class EnrollmentService {
  private readonly baseUrl = '/enrollments';

  async getAllEnrollments(): Promise<Enrollment[]> {
    const response = await api.get<{ enrollments: Enrollment[] }>(this.baseUrl);
    return response.enrollments;
  }

  async getEnrollments(): Promise<Enrollment[]> {
    const response = await api.get<Enrollment[]>(this.baseUrl);
    return response;
  }

  async getStudentEnrollments(studentId: string): Promise<Enrollment[]> {
    const response = await api.get<Enrollment[]>(`${this.baseUrl}/student/${studentId}`);
    return response;
  }

  async getMyEnrollments(): Promise<Enrollment[]> {
    const response = await api.get<Enrollment[]>(`${this.baseUrl}/my`);
    return response;
  }

  async createEnrollment(data: CreateEnrollmentDTO): Promise<Enrollment> {
    const response = await api.post<Enrollment>(this.baseUrl, data);
    return response;
  }

  async deleteEnrollment(enrollmentId: string): Promise<void> {
    await api.delete(`${this.baseUrl}/${enrollmentId}`);
  }
}

export const enrollmentService = new EnrollmentService(); 
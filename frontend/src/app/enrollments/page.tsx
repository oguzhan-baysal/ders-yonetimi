'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/hooks/useAuth';
import { Enrollment } from '../../services/enrollmentService';
import { enrollmentService } from '../../services/enrollmentService';
import { useEnrollmentStore } from '@/store/enrollmentStore';
import { toast } from 'react-hot-toast';

const EnrollmentsPage = () => {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { enrollments, setEnrollments } = useEnrollmentStore();

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      if (!isAuthenticated) {
        router.push('/auth/login');
        return;
      }

      await fetchEnrollments();
    };

    checkAuthAndFetch();
  }, [isAuthenticated, router]);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      let data;
      if (user?.role === 'admin') {
        data = await enrollmentService.getAllEnrollments();
      } else {
        data = await enrollmentService.getMyEnrollments();
      }
      setEnrollments(data);
    } catch (err: any) {
      if (err?.response?.status === 401) {
        router.push('/auth/login');
        return;
      }
      setError('Kayıtlar yüklenirken bir hata oluştu.');
      console.error('Error fetching enrollments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnenroll = async (enrollmentId: string) => {
    if (window.confirm('Bu ders kaydını silmek istediğinizden emin misiniz?')) {
      try {
        await enrollmentService.deleteEnrollment(enrollmentId);
        toast.success('Ders kaydı başarıyla silindi.');
        fetchEnrollments();
      } catch (error) {
        toast.error('Ders kaydı silinirken bir hata oluştu.');
      }
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {user?.role === 'admin' ? 'Tüm Ders Kayıtları' : 'Kayıtlı Derslerim'}
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ders Kodu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ders Adı
                </th>
                {user?.role === 'admin' && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Öğrenci
                  </th>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Öğretim Görevlisi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kayıt Tarihi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {enrollments.length > 0 ? (
                enrollments.map((enrollment) => {
                  const course = enrollment.courseId as any;
                  const student = enrollment.studentId as any;
                  return (
                    <tr key={enrollment._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {course.code || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {course.name || '-'}
                      </td>
                      {user?.role === 'admin' && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {student ? `${student.firstName} ${student.lastName}` : '-'} 
                          {student?.studentNumber ? ` (${student.studentNumber})` : ''}
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {course.instructor || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(enrollment.enrollmentDate).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => handleUnenroll(enrollment._id)}
                          className="text-red-600 hover:text-red-900 font-medium"
                        >
                          Kaydı Sil
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={user?.role === 'admin' ? 6 : 5} className="px-6 py-4 text-center text-gray-500">
                    Kayıtlı ders bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default EnrollmentsPage; 
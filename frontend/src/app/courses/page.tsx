'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { courseService } from '@/services/courseService';
import type { Course } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { useEnrollmentStore } from '@/store/enrollmentStore';
import { enrollmentService } from '@/services/enrollmentService';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

const CoursesPage = () => {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [enrollingCourseId, setEnrollingCourseId] = useState<string | null>(null);
  const { isEnrolled, setEnrollments } = useEnrollmentStore();
  const itemsPerPage = 10;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    fetchCourses();
    // Sadece öğrenci rolü için enrollment'ları getir
    if (user?.role !== 'admin') {
      fetchEnrollments();
    }
  }, [isAuthenticated, router, currentPage, searchTerm, user?.role]);

  const fetchEnrollments = async () => {
    try {
      const data = await enrollmentService.getMyEnrollments();
      setEnrollments(data);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    }
  };

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await courseService.getAllCourses({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm
      });

      setCourses(response.courses);
      setTotalPages(response.pages);
    } catch (err) {
      setError('Ders listesi yüklenirken bir hata oluştu.');
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bu dersi silmek istediğinizden emin misiniz?')) {
      try {
        await courseService.deleteCourse(id);
        toast.success('Ders başarıyla silindi.');
        fetchCourses();
      } catch (error) {
        toast.error('Ders silinirken bir hata oluştu.');
      }
    }
  };

  const handleEnroll = async (courseId: string) => {
    try {
      setEnrollingCourseId(courseId);
      await courseService.enrollCourse(courseId);
      toast.success('Derse başarıyla kayıt oldunuz.');
      await fetchEnrollments(); // Kayıt işleminden sonra enrollments'ı güncelle
      fetchCourses();
    } catch (error: any) {
      toast.error(error.message || 'Derse kayıt olurken bir hata oluştu.');
    } finally {
      setEnrollingCourseId(null);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Ders Listesi</h1>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            {user?.role === 'admin' && (
              <Link href="/courses/new">
                <Button variant="primary" size="sm">
                  Yeni Ders Oluştur
                </Button>
              </Link>
            )}
            <input
              type="text"
              placeholder="Ders ara..."
              value={searchTerm}
              onChange={handleSearch}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Açıklama
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kredi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {course.code}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {course.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {course.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {course.credits}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex gap-2">
                      {user?.role === 'admin' ? (
                        <>
                          <Link href={`/courses/${course._id}/edit`}>
                            <Button variant="secondary" size="sm">
                              Düzenle
                            </Button>
                          </Link>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(course._id)}
                          >
                            Sil
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleEnroll(course._id)}
                          disabled={enrollingCourseId === course._id || isEnrolled(course._id)}
                        >
                          {enrollingCourseId === course._id
                            ? 'Kaydediliyor...'
                            : isEnrolled(course._id)
                              ? 'Kayıtlı'
                              : 'Derse Kayıt Ol'}
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {courses.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    Kayıtlı ders bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <nav className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 rounded ${currentPage === page
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                  {page}
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CoursesPage; 
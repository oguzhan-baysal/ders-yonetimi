'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { studentService } from '@/services/studentService';
import { Student } from '@/types/student';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function StudentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (user?.role !== 'admin') {
      router.push('/dashboard');
      return;
    }

    fetchStudent();
  }, [isAuthenticated, user, router, params.id]);

  const fetchStudent = async () => {
    try {
      const data = await studentService.getStudentById(params.id as string);
      setStudent(data);
    } catch (err) {
      setError('Öğrenci bilgileri yüklenirken bir hata oluştu.');
      console.error('Error fetching student:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!student) return;

    if (window.confirm('Bu öğrenciyi silmek istediğinizden emin misiniz?')) {
      try {
        await studentService.deleteStudent(student._id);
        toast.success('Öğrenci başarıyla silindi.');
        router.push('/students');
      } catch (err) {
        toast.error('Öğrenci silinirken bir hata oluştu.');
        console.error('Error deleting student:', err);
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

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  if (error || !student) {
    return (
      <Layout>
        <div className="container mx-auto py-8 px-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error || 'Öğrenci bulunamadı.'}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Öğrenci Detayı
              </h1>
              <div className="flex gap-2">
                <Link href={`/students/${student._id}/edit`}>
                  <Button variant="outline">Düzenle</Button>
                </Link>
                <Button variant="danger" onClick={handleDelete}>
                  Sil
                </Button>
                <Link href="/students">
                  <Button variant="outline">Geri Dön</Button>
                </Link>
              </div>
            </div>
          </div>
          <div className="px-6 py-4">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Öğrenci No</dt>
                <dd className="mt-1 text-sm text-gray-900">{student.studentNumber}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Ad Soyad</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {student.firstName} {student.lastName}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">E-posta</dt>
                <dd className="mt-1 text-sm text-gray-900">{student.email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Doğum Tarihi</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {format(new Date(student.birthDate), 'dd MMMM yyyy', { locale: tr })}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Bölüm</dt>
                <dd className="mt-1 text-sm text-gray-900">{student.department}</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Kayıtlı Dersler */}
        <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Kayıtlı Dersler</h2>
          </div>
          <div className="px-6 py-4">
            {student.courses && student.courses.length > 0 ? (
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
                        Kredi
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dönem
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {student.courses.map((course) => (
                      <tr key={course._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {course.code}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {course.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {course.credits}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {course.semester}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Henüz kayıtlı ders bulunmuyor.</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
} 
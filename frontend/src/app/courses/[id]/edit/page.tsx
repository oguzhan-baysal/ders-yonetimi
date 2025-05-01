'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import Button from '@/components/ui/Button';
import { courseService } from '@/services/courseService';
import type { CourseFormData } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-hot-toast';

const EditCoursePage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CourseFormData>({
    code: '',
    name: '',
    description: '',
    credits: 3,
    department: '',
    semester: '',
    instructor: '',
    capacity: 30
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (user?.role !== 'admin') {
      router.push('/dashboard');
      return;
    }

    fetchCourse();
  }, [isAuthenticated, user, router, params.id]);

  const fetchCourse = async () => {
    try {
      const course = await courseService.getCourseById(params.id);
      if (course) {
        setFormData({
          code: course.code,
          name: course.name,
          description: course.description,
          credits: course.credits,
          department: course.department || '',
          semester: course.semester || '',
          instructor: course.instructor || '',
          capacity: course.capacity || 30
        });
      } else {
        toast.error('Ders bulunamadı.');
        router.push('/courses');
      }
    } catch (error) {
      console.error('Error fetching course:', error);
      toast.error('Ders bilgileri yüklenirken bir hata oluştu.');
      router.push('/courses');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || user?.role !== 'admin') {
      toast.error('Bu işlem için yetkiniz yok.');
      return;
    }

    try {
      setLoading(true);
      const course = await courseService.updateCourse(params.id, formData);
      
      if (course) {
        toast.success('Ders başarıyla güncellendi.');
        router.push('/courses');
      } else {
        toast.error('Ders güncellenirken bir hata oluştu.');
      }
    } catch (error) {
      console.error('Error updating course:', error);
      toast.error('Ders güncellenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: CourseFormData) => ({
      ...prev,
      [name]: name === 'credits' || name === 'capacity' ? parseInt(value) || 0 : value
    }));
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Ders Düzenle</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                Ders Kodu
              </label>
              <input
                type="text"
                id="code"
                name="code"
                required
                value={formData.code}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Ders Adı
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Açıklama
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                required
                value={formData.description}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="instructor" className="block text-sm font-medium text-gray-700">
                Öğretim Görevlisi
              </label>
              <input
                type="text"
                id="instructor"
                name="instructor"
                required
                value={formData.instructor}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="credits" className="block text-sm font-medium text-gray-700">
                  Kredi
                </label>
                <input
                  type="number"
                  id="credits"
                  name="credits"
                  min="1"
                  max="30"
                  required
                  value={formData.credits}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
                  Kontenjan
                </label>
                <input
                  type="number"
                  id="capacity"
                  name="capacity"
                  min="1"
                  required
                  value={formData.capacity}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                Bölüm
              </label>
              <input
                type="text"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="semester" className="block text-sm font-medium text-gray-700">
                Dönem
              </label>
              <select
                id="semester"
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Seçiniz</option>
                <option value="1">1. Dönem</option>
                <option value="2">2. Dönem</option>
                <option value="3">3. Dönem</option>
                <option value="4">4. Dönem</option>
                <option value="5">5. Dönem</option>
                <option value="6">6. Dönem</option>
                <option value="7">7. Dönem</option>
                <option value="8">8. Dönem</option>
              </select>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/courses')}
              >
                İptal
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
              >
                {loading ? 'Güncelleniyor...' : 'Güncelle'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default EditCoursePage; 
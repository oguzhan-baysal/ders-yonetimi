'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Formik, Field } from 'formik';
import type { FormikHelpers } from 'formik';
import Layout from '@/components/layout/Layout';
import Button from '@/components/ui/Button';
import { courseService } from '@/services/courseService';
import type { CourseFormData } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-hot-toast';
import { courseValidationSchema } from '@/validations/courseValidation';

const NewCoursePage = () => {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState(false);

  const initialValues: CourseFormData = {
    code: '',
    name: '',
    description: '',
    credits: 3,
    department: '',
    semester: '',
    instructor: '',
    capacity: 30
  };

  const handleSubmit = async (values: CourseFormData) => {
    if (!isAuthenticated || user?.role !== 'admin') {
      toast.error('Bu işlem için yetkiniz yok.');
      return;
    }

    try {
      setLoading(true);
      const course = await courseService.createCourse(values);

      if (course) {
        toast.success('Ders başarıyla oluşturuldu.');
        router.push('/courses');
      } else {
        toast.error('Ders oluşturulurken bir hata oluştu.');
      }
    } catch (error) {
      console.error('Error creating course:', error);
      toast.error('Ders oluşturulurken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    router.push('/dashboard');
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Yeni Ders Oluştur</h1>

          <Formik
            initialValues={initialValues}
            validationSchema={courseValidationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, handleSubmit }) => (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                    Ders Kodu
                  </label>
                  <Field
                    type="text"
                    id="code"
                    name="code"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  {errors.code && touched.code && (
                    <div className="text-red-500 text-sm mt-1">{errors.code}</div>
                  )}
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Ders Adı
                  </label>
                  <Field
                    type="text"
                    id="name"
                    name="name"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  {errors.name && touched.name && (
                    <div className="text-red-500 text-sm mt-1">{errors.name}</div>
                  )}
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Açıklama
                  </label>
                  <Field
                    as="textarea"
                    id="description"
                    name="description"
                    rows={3}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  {errors.description && touched.description && (
                    <div className="text-red-500 text-sm mt-1">{errors.description}</div>
                  )}
                </div>

                <div>
                  <label htmlFor="instructor" className="block text-sm font-medium text-gray-700">
                    Öğretim Görevlisi
                  </label>
                  <Field
                    type="text"
                    id="instructor"
                    name="instructor"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  {errors.instructor && touched.instructor && (
                    <div className="text-red-500 text-sm mt-1">{errors.instructor}</div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="credits" className="block text-sm font-medium text-gray-700">
                      Kredi
                    </label>
                    <Field
                      type="number"
                      id="credits"
                      name="credits"
                      min="1"
                      max="30"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    {errors.credits && touched.credits && (
                      <div className="text-red-500 text-sm mt-1">{errors.credits}</div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
                      Kontenjan
                    </label>
                    <Field
                      type="number"
                      id="capacity"
                      name="capacity"
                      min="1"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    {errors.capacity && touched.capacity && (
                      <div className="text-red-500 text-sm mt-1">{errors.capacity}</div>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                    Bölüm
                  </label>
                  <Field
                    type="text"
                    id="department"
                    name="department"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  {errors.department && touched.department && (
                    <div className="text-red-500 text-sm mt-1">{errors.department}</div>
                  )}
                </div>

                <div>
                  <label htmlFor="semester" className="block text-sm font-medium text-gray-700">
                    Dönem
                  </label>
                  <Field
                    as="select"
                    id="semester"
                    name="semester"
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
                  </Field>
                  {errors.semester && touched.semester && (
                    <div className="text-red-500 text-sm mt-1">{errors.semester}</div>
                  )}
                </div>

                <div className="flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => router.push('/courses')}
                  >
                    İptal
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={loading}
                  >
                    {loading ? 'Kaydediliyor...' : 'Kaydet'}
                  </Button>
                </div>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </Layout>
  );
};

export default NewCoursePage; 
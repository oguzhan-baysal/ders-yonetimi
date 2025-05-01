'use client';

import { useState, useEffect } from 'react';
import { Course } from '@/types';
import { useCourseStore } from '@/store/courseStore';
import Layout from '@/components/layout/Layout';
import CourseList from '@/components/courses/CourseList';
import CourseForm from '@/components/courses/CourseForm';
import Modal from '@/components/ui/Modal';
import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal';

export default function CoursesPage() {
  const { courses, loading, fetchCourses, createCourse, updateCourse, deleteCourse } = useCourseStore();
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Sayfa yüklendiğinde dersleri getir
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleOpenFormModal = (course?: Course) => {
    setSelectedCourse(course || null);
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setSelectedCourse(null);
    setIsFormModalOpen(false);
  };

  const handleOpenDeleteModal = (course: Course) => {
    setSelectedCourse(course);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setSelectedCourse(null);
    setIsDeleteModalOpen(false);
  };

  const handleSubmit = async (data: any) => {
    if (selectedCourse) {
      await updateCourse(selectedCourse._id, data);
    } else {
      await createCourse(data);
    }
    handleCloseFormModal();
  };

  const handleDelete = async () => {
    if (selectedCourse) {
      await deleteCourse(selectedCourse._id);
      handleCloseDeleteModal();
    }
  };

  return (
    <Layout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">Ders Yönetimi</h1>
            <button
              onClick={() => handleOpenFormModal()}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Yeni Ders Ekle
            </button>
          </div>

          <div className="mt-8">
            {loading ? (
              <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <CourseList
                courses={courses}
                onEdit={handleOpenFormModal}
                onDelete={handleOpenDeleteModal}
              />
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
        title={selectedCourse ? 'Dersi Düzenle' : 'Yeni Ders Ekle'}
      >
        <CourseForm
          onSubmit={handleSubmit}
          initialData={selectedCourse || undefined}
          onCancel={handleCloseFormModal}
        />
      </Modal>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDelete}
        title="Dersi Sil"
        message={`"${selectedCourse?.name}" dersini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`}
      />
    </Layout>
  );
} 
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Student, StudentFormData } from '@/types/student';
import { studentService } from '@/services/studentService';
import { Button } from '@/components/ui/Button';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const studentSchema = z.object({
  firstName: z.string().min(2, 'Ad en az 2 karakter olmalıdır.'),
  lastName: z.string().min(2, 'Soyad en az 2 karakter olmalıdır.'),
  email: z.string().email('Geçerli bir e-posta adresi giriniz.'),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Geçerli bir tarih giriniz (YYYY-MM-DD).'),
  studentNumber: z.string().min(5, 'Öğrenci numarası en az 5 karakter olmalıdır.'),
  department: z.string().min(2, 'Bölüm en az 2 karakter olmalıdır.'),
});

export default function EditStudentPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
  });

  useEffect(() => {
    fetchStudent();
  }, []);

  const fetchStudent = async () => {
    try {
      const data = await studentService.getStudentById(params.id as string);
      if (!data) {
        toast.error('Öğrenci bulunamadı');
        return;
      }
      reset({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        birthDate: data.birthDate.split('T')[0],
        studentNumber: data.studentNumber,
        department: data.department,
      });
    } catch (error) {
      toast.error('Öğrenci bilgileri yüklenirken bir hata oluştu.');
      router.push('/students');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: StudentFormData) => {
    try {
      await studentService.updateStudent(params.id as string, data);
      toast.success('Öğrenci başarıyla güncellendi.');
      router.push(`/students/${params.id}`);
    } catch (error) {
      toast.error('Öğrenci güncellenirken bir hata oluştu.');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Yükleniyor...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Öğrenci Düzenle</h1>
        <Link href={`/students/${params.id}`}>
          <Button variant="outline">Geri Dön</Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-2xl mx-auto">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="firstName" className="text-sm font-medium">
              Ad
            </label>
            <input
              {...register('firstName')}
              type="text"
              id="firstName"
              className="w-full p-2 border rounded-md"
            />
            {errors.firstName && (
              <p className="text-sm text-red-500">{errors.firstName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="lastName" className="text-sm font-medium">
              Soyad
            </label>
            <input
              {...register('lastName')}
              type="text"
              id="lastName"
              className="w-full p-2 border rounded-md"
            />
            {errors.lastName && (
              <p className="text-sm text-red-500">{errors.lastName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              E-posta
            </label>
            <input
              {...register('email')}
              type="email"
              id="email"
              className="w-full p-2 border rounded-md"
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="birthDate" className="text-sm font-medium">
              Doğum Tarihi
            </label>
            <input
              {...register('birthDate')}
              type="date"
              id="birthDate"
              className="w-full p-2 border rounded-md"
            />
            {errors.birthDate && (
              <p className="text-sm text-red-500">{errors.birthDate.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="studentNumber" className="text-sm font-medium">
              Öğrenci Numarası
            </label>
            <input
              {...register('studentNumber')}
              type="text"
              id="studentNumber"
              className="w-full p-2 border rounded-md"
            />
            {errors.studentNumber && (
              <p className="text-sm text-red-500">{errors.studentNumber.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="department" className="text-sm font-medium">
              Bölüm
            </label>
            <input
              {...register('department')}
              type="text"
              id="department"
              className="w-full p-2 border rounded-md"
            />
            {errors.department && (
              <p className="text-sm text-red-500">{errors.department.message}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Link href={`/students/${params.id}`}>
            <Button type="button" variant="outline">
              İptal
            </Button>
          </Link>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
          </Button>
        </div>
      </form>
    </div>
  );
} 
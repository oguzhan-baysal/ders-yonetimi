'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Student } from '@/types/student';
import { studentService } from '@/services/studentService';
import { Button } from '@/components/ui/Button';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function StudentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudent();
  }, []);

  const fetchStudent = async () => {
    try {
      const data = await studentService.getStudentById(params.id as string);
      setStudent(data);
    } catch (error) {
      toast.error('Öğrenci bilgileri yüklenirken bir hata oluştu.');
      router.push('/students');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Bu öğrenciyi silmek istediğinizden emin misiniz?')) {
      try {
        await studentService.deleteStudent(params.id as string);
        toast.success('Öğrenci başarıyla silindi.');
        router.push('/students');
      } catch (error) {
        toast.error('Öğrenci silinirken bir hata oluştu.');
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Yükleniyor...</div>;
  }

  if (!student) {
    return <div className="flex justify-center items-center h-screen">Öğrenci bulunamadı.</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Öğrenci Detayı</h1>
        <div className="flex gap-2">
          <Link href="/students">
            <Button variant="outline">Geri Dön</Button>
          </Link>
          <Link href={`/students/${student.id}/edit`}>
            <Button variant="outline">Düzenle</Button>
          </Link>
          <Button variant="destructive" onClick={handleDelete}>
            Sil
          </Button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Ad Soyad</h3>
            <p className="mt-1 text-sm text-gray-900">{`${student.firstName} ${student.lastName}`}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Öğrenci Numarası</h3>
            <p className="mt-1 text-sm text-gray-900">{student.studentNumber}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">E-posta</h3>
            <p className="mt-1 text-sm text-gray-900">{student.email}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Doğum Tarihi</h3>
            <p className="mt-1 text-sm text-gray-900">
              {format(new Date(student.birthDate), 'dd MMMM yyyy', { locale: tr })}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Bölüm</h3>
            <p className="mt-1 text-sm text-gray-900">{student.department}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Kayıt Tarihi</h3>
            <p className="mt-1 text-sm text-gray-900">
              {format(new Date(student.createdAt), 'dd MMMM yyyy', { locale: tr })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 
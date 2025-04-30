'use client';

import { useEffect, useState } from 'react';
import { Student } from '@/types/student';
import { studentService } from '@/services/studentService';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from '@/components/ui/Table';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { toast } from 'react-hot-toast';

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const data = await studentService.getAllStudents();
      setStudents(data);
    } catch (error) {
      toast.error('Öğrenciler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bu öğrenciyi silmek istediğinizden emin misiniz?')) {
      try {
        await studentService.deleteStudent(id);
        toast.success('Öğrenci başarıyla silindi.');
        fetchStudents();
      } catch (error) {
        toast.error('Öğrenci silinirken bir hata oluştu.');
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Yükleniyor...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Öğrenci Listesi</h1>
        <Link href="/students/new">
          <Button>Yeni Öğrenci Ekle</Button>
        </Link>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Öğrenci No</TableHead>
            <TableHead>Ad Soyad</TableHead>
            <TableHead>E-posta</TableHead>
            <TableHead>Doğum Tarihi</TableHead>
            <TableHead>Bölüm</TableHead>
            <TableHead>İşlemler</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell>{student.studentNumber}</TableCell>
              <TableCell>{`${student.firstName} ${student.lastName}`}</TableCell>
              <TableCell>{student.email}</TableCell>
              <TableCell>
                {format(new Date(student.birthDate), 'dd MMMM yyyy', { locale: tr })}
              </TableCell>
              <TableCell>{student.department}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Link href={`/students/${student.id}`}>
                    <Button variant="outline" size="sm">
                      Detay
                    </Button>
                  </Link>
                  <Link href={`/students/${student.id}/edit`}>
                    <Button variant="outline" size="sm">
                      Düzenle
                    </Button>
                  </Link>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleDelete(student.id)}
                  >
                    Sil
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 
import Student from '../models/Student';
import User from '../models/User';
import Enrollment from '../models/Enrollment';
import mongoose from 'mongoose';
import { Request, Response } from 'express';

interface QueryParams {
  page?: string;
  limit?: string;
  search?: string;
}

interface StudentBody {
  firstName: string;
  lastName: string;
  birthDate?: Date;
}

// @desc    Tüm öğrencileri getir
// @route   GET /api/students
// @access  Private/Admin
export const getStudents = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Arama ve filtreleme
    const search = req.query.search as string || '';
    const filter: any = {};
    
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } }
      ];
    }

    // Öğrenci bilgilerini ve ilişkili kullanıcı bilgilerini tek sorguda getir
    const students = await Student.find(filter)
      .populate({
        path: 'userId',
        select: 'username email role',
        match: { role: 'student' }
      })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    // Sadece geçerli kullanıcı ilişkisi olan öğrencileri filtrele
    const validStudents = students.filter(student => student.userId);

    // Toplam sayıyı bul
    const total = await Student.countDocuments(filter);

    const response = {
      students: validStudents.map(student => ({
        _id: student._id,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.userId?.email || '',
        birthDate: student.birthDate,
        studentNumber: student.userId?.username || '',
        department: 'Bilgisayar Mühendisliği' // Varsayılan değer
      })),
      page,
      pages: Math.ceil(total / limit),
      total,
      hasMore: page * limit < total
    };

    res.json(response);
  } catch (error: unknown) {
    console.error('Get Students Error:', error);
    res.status(500).json({ 
      message: 'Öğrenciler listelenirken bir hata oluştu',
      error: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'Bilinmeyen hata' : undefined
    });
  }
};

// @desc    Öğrenci detayını getir
// @route   GET /api/students/:id
// @access  Private/Admin
export const getStudentById = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(400).json({ message: 'Geçersiz öğrenci ID' });
      return;
    }

    const student = await Student.findById(req.params.id)
      .populate('userId', 'username email');

    if (!student) {
      res.status(404).json({ message: 'Öğrenci bulunamadı' });
      return;
    }

    res.json(student);
  } catch (error: unknown) {
    console.error('Get Student Error:', error);
    res.status(500).json({ 
      message: 'Öğrenci bilgileri alınırken bir hata oluştu',
      error: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'Bilinmeyen hata' : undefined
    });
  }
};

// @desc    Yeni öğrenci oluştur
// @route   POST /api/students
// @access  Private/Admin
export const createStudent = async (req: Request<{}, {}, StudentBody>, res: Response): Promise<void> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { firstName, lastName, birthDate } = req.body;

    const student = await Student.create([{
      firstName,
      lastName,
      birthDate: birthDate || undefined
    }], { session });

    await session.commitTransaction();
    res.status(201).json(student[0]);
  } catch (error: unknown) {
    await session.abortTransaction();
    console.error('Create Student Error:', error);
    res.status(500).json({ 
      message: 'Öğrenci oluşturulurken bir hata oluştu',
      error: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'Bilinmeyen hata' : undefined
    });
  } finally {
    session.endSession();
  }
};

// @desc    Öğrenci güncelle
// @route   PUT /api/students/:id
// @access  Private/Admin
export const updateStudent = async (req: Request<{ id: string }, {}, StudentBody>, res: Response): Promise<void> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(400).json({ message: 'Geçersiz öğrenci ID' });
      return;
    }

    const { firstName, lastName, birthDate } = req.body;

    // Input validasyonu
    if (!firstName || !lastName) {
      res.status(400).json({ message: 'İsim ve soyisim alanları zorunludur' });
      return;
    }

    const student = await Student.findById(req.params.id);

    if (!student) {
      res.status(404).json({ message: 'Öğrenci bulunamadı' });
      return;
    }

    student.firstName = firstName;
    student.lastName = lastName;
    if (birthDate) student.birthDate = birthDate;

    const updatedStudent = await student.save();
    
    res.json(updatedStudent);
  } catch (error: unknown) {
    console.error('Update Student Error:', error);
    res.status(500).json({ 
      message: 'Öğrenci güncellenirken bir hata oluştu',
      error: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'Bilinmeyen hata' : undefined
    });
  }
};

// @desc    Öğrenci sil
// @route   DELETE /api/students/:id
// @access  Private/Admin
export const deleteStudent = async (req: Request, res: Response): Promise<void> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(400).json({ message: 'Geçersiz öğrenci ID' });
      return;
    }

    const student = await Student.findById(req.params.id);

    if (!student) {
      res.status(404).json({ message: 'Öğrenci bulunamadı' });
      return;
    }

    // Transaction ile silme işlemleri
    await Enrollment.deleteMany({ studentId: student._id }, { session });
    await User.findByIdAndDelete(student.userId, { session });
    await Student.findByIdAndDelete(student._id, { session });

    await session.commitTransaction();
    
    res.json({ message: 'Öğrenci başarıyla silindi' });
  } catch (error: unknown) {
    await session.abortTransaction();
    console.error('Delete Student Error:', error);
    res.status(500).json({ 
      message: 'Öğrenci silinirken bir hata oluştu',
      error: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'Bilinmeyen hata' : undefined
    });
  } finally {
    session.endSession();
  }
};

// @desc    Öğrencinin kayıtlı olduğu dersleri getir
// @route   GET /api/students/:id/courses
// @access  Private
export const getStudentCourses = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(400).json({ message: 'Geçersiz öğrenci ID' });
      return;
    }

    const student = await Student.findById(req.params.id);
    if (!student) {
      res.status(404).json({ message: 'Öğrenci bulunamadı' });
      return;
    }

    const enrollments = await Enrollment.find({ studentId: req.params.id })
      .populate('courseId', 'name description');

    res.json(enrollments);
  } catch (error: unknown) {
    console.error('Get Student Courses Error:', error);
    res.status(500).json({ 
      message: 'Öğrenci dersleri listelenirken bir hata oluştu',
      error: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'Bilinmeyen hata' : undefined
    });
  }
}; 
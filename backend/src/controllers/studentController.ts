import { Request, Response } from 'express';
import Student from '../models/Student';
import User from '../models/User';
import Enrollment from '../models/Enrollment';
import mongoose from 'mongoose';

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
export const getStudents = async (req: Request<{}, {}, {}, QueryParams>, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page || '1');
    const limit = parseInt(req.query.limit || '10');
    const skip = (page - 1) * limit;

    // Arama ve filtreleme
    const search = req.query.search || '';
    const filter: any = {};
    
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } }
      ];
    }

    const students = await Student.find(filter)
      .populate('userId', 'username email')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Student.countDocuments(filter);

    res.json({
      students,
      page,
      pages: Math.ceil(total / limit),
      total,
      hasMore: page * limit < total
    });
  } catch (error) {
    console.error('Get Students Error:', error);
    res.status(500).json({ 
      message: 'Öğrenciler listelenirken bir hata oluştu',
      error: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'Unknown error' : undefined
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
  } catch (error) {
    console.error('Get Student Error:', error);
    res.status(500).json({ 
      message: 'Öğrenci bilgileri alınırken bir hata oluştu',
      error: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'Unknown error' : undefined
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
  } catch (error) {
    await session.abortTransaction();
    console.error('Create Student Error:', error);
    res.status(500).json({ 
      message: 'Öğrenci oluşturulurken bir hata oluştu',
      error: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'Unknown error' : undefined
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
  } catch (error) {
    console.error('Update Student Error:', error);
    res.status(500).json({ 
      message: 'Öğrenci güncellenirken bir hata oluştu',
      error: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'Unknown error' : undefined
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
  } catch (error) {
    await session.abortTransaction();
    console.error('Delete Student Error:', error);
    res.status(500).json({ 
      message: 'Öğrenci silinirken bir hata oluştu',
      error: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'Unknown error' : undefined
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
  } catch (error) {
    console.error('Get Student Courses Error:', error);
    res.status(500).json({ 
      message: 'Öğrenci dersleri listelenirken bir hata oluştu',
      error: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'Unknown error' : undefined
    });
  }
}; 
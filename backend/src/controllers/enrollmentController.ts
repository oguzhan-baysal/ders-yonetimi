import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Enrollment from '../models/Enrollment';
import Student from '../models/Student';
import Course from '../models/Course';

interface QueryParams {
  page?: string;
  limit?: string;
}

interface EnrollmentBody {
  studentId: string;
  courseId: string;
}

// @desc    Tüm kayıtları getir
// @route   GET /api/enrollments
// @access  Private/Admin
export const getEnrollments = async (req: Request<{}, {}, {}, QueryParams>, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page || '1');
    const limit = parseInt(req.query.limit || '10');
    const skip = (page - 1) * limit;

    const enrollments = await Enrollment.find()
      .populate('studentId', 'firstName lastName')
      .populate('courseId', 'name')
      .skip(skip)
      .limit(limit)
      .sort({ enrollmentDate: -1 });

    const total = await Enrollment.countDocuments();

    res.json({
      enrollments,
      page,
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Sunucu hatası', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

// @desc    Kayıt oluştur
// @route   POST /api/enrollments
// @access  Private/Admin
export const createEnrollment = async (req: Request<{}, {}, EnrollmentBody>, res: Response): Promise<void> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { studentId, courseId } = req.body;

    // Öğrenci ve ders var mı kontrol et
    const student = await Student.findById(studentId);
    const course = await Course.findById(courseId);

    if (!student || !course) {
      await session.abortTransaction();
      res.status(404).json({ 
        message: !student ? 'Öğrenci bulunamadı' : 'Ders bulunamadı' 
      });
      return;
    }

    // Kayıt zaten var mı kontrol et
    const existingEnrollment = await Enrollment.findOne({ studentId, courseId });
    if (existingEnrollment) {
      await session.abortTransaction();
      res.status(400).json({ 
        message: 'Bu öğrenci zaten bu derse kayıtlı' 
      });
      return;
    }

    const enrollment = await Enrollment.create([{
      studentId,
      courseId,
      enrollmentDate: new Date()
    }], { session });

    await session.commitTransaction();
    res.status(201).json(enrollment[0]);
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ 
      message: 'Sunucu hatası', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  } finally {
    session.endSession();
  }
};

// @desc    Kayıt sil
// @route   DELETE /api/enrollments/:id
// @access  Private
export const deleteEnrollment = async (req: Request, res: Response): Promise<void> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
      await session.abortTransaction();
      res.status(404).json({ message: 'Kayıt bulunamadı' });
      return;
    }

    // Admin değilse, sadece kendi kaydını silebilir
    if (req.user?.role !== 'admin') {
      const student = await Student.findOne({ userId: req.user?._id });
      
      if (!student || student._id.toString() !== enrollment.studentId.toString()) {
        await session.abortTransaction();
        res.status(403).json({ message: 'Bu kaydı silme yetkiniz yok' });
        return;
      }
    }

    await enrollment.deleteOne({ session });
    await session.commitTransaction();
    
    res.json({ message: 'Kayıt başarıyla silindi' });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ 
      message: 'Sunucu hatası', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  } finally {
    session.endSession();
  }
};

// @desc    Öğrencinin derslerini getir
// @route   GET /api/students/:id/courses
// @access  Private
export const getStudentCourses = async (req: Request, res: Response): Promise<void> => {
  try {
    const enrollments = await Enrollment.find({ studentId: req.params.id })
      .populate('courseId', 'name description')
      .sort({ enrollmentDate: -1 });

    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ 
      message: 'Sunucu hatası', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

// @desc    Dersin öğrencilerini getir
// @route   GET /api/courses/:id/students
// @access  Private
export const getCourseStudents = async (req: Request, res: Response): Promise<void> => {
  try {
    const enrollments = await Enrollment.find({ courseId: req.params.id })
      .populate({
        path: 'studentId',
        select: 'firstName lastName userId',
        populate: {
          path: 'userId',
          select: 'email'
        }
      })
      .sort({ enrollmentDate: -1 });

    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ 
      message: 'Sunucu hatası', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

// @desc    Giriş yapmış kullanıcının kayıtlarını getir
// @route   GET /api/enrollments/my
// @access  Private
export const getMyEnrollments = async (req: Request, res: Response): Promise<void> => {
  try {
    const student = await Student.findOne({ userId: req.user?._id });
    
    if (!student) {
      res.status(404).json({ message: 'Öğrenci bulunamadı' });
      return;
    }

    const enrollments = await Enrollment.find({ studentId: student._id })
      .populate('courseId', 'name code instructor capacity')
      .sort({ enrollmentDate: -1 });

    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ 
      message: 'Sunucu hatası', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}; 
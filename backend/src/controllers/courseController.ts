import { Request, Response } from 'express';
import Course, { ICourse } from '../models/Course';
import Enrollment from '../models/Enrollment';
import mongoose from 'mongoose';

interface QueryParams {
  page?: string;
  limit?: string;
  search?: string;
}

interface CourseBody {
  code: string;
  name: string;
  description: string;
  credits: number;
  department?: string;
  semester?: string;
}

// @desc    Tüm dersleri getir
// @route   GET /api/courses
// @access  Private
export const getCourses = async (req: Request<{}, {}, {}, QueryParams>, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page || '1');
    const limit = parseInt(req.query.limit || '10');
    const skip = (page - 1) * limit;

    // Arama ve filtreleme
    const search = req.query.search || '';
    const filter: any = {};
    
    if (search) {
      filter.$or = [
        { code: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } }
      ];
    }

    const courses = await Course.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ code: 1 });

    const total = await Course.countDocuments(filter);

    res.json({
      courses,
      page,
      pages: Math.ceil(total / limit),
      total,
      hasMore: page * limit < total
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Sunucu hatası', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

// @desc    Ders detayını getir
// @route   GET /api/courses/:id
// @access  Private
export const getCourseById = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(400).json({ message: 'Geçersiz ders ID' });
      return;
    }

    const course = await Course.findById(req.params.id);

    if (course) {
      res.json(course);
    } else {
      res.status(404).json({ message: 'Ders bulunamadı' });
    }
  } catch (error) {
    res.status(500).json({ 
      message: 'Sunucu hatası', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

// @desc    Yeni ders oluştur
// @route   POST /api/courses
// @access  Private/Admin
export const createCourse = async (req: Request<{}, {}, CourseBody>, res: Response): Promise<void> => {
  try {
    const { code, name, description, credits, department, semester } = req.body;

    // Ders kodu kontrolü
    const courseExists = await Course.findOne({ code });
    if (courseExists) {
      res.status(400).json({ message: 'Bu ders kodu zaten kullanılıyor' });
      return;
    }

    const course = await Course.create({
      code,
      name,
      description,
      credits,
      department,
      semester
    });

    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ 
      message: 'Sunucu hatası', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

// @desc    Ders güncelle
// @route   PUT /api/courses/:id
// @access  Private/Admin
export const updateCourse = async (req: Request<{ id: string }, {}, CourseBody>, res: Response): Promise<void> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(400).json({ message: 'Geçersiz ders ID' });
      return;
    }

    const { code, name, description, credits, department, semester } = req.body;
    const course = await Course.findById(req.params.id);

    if (!course) {
      res.status(404).json({ message: 'Ders bulunamadı' });
      return;
    }

    // Ders kodu değişiyorsa, yeni kodda başka bir ders var mı kontrol et
    if (code !== course.code) {
      const courseExists = await Course.findOne({ code });
      if (courseExists) {
        res.status(400).json({ message: 'Bu ders kodu zaten kullanılıyor' });
        return;
      }
    }

    course.code = code;
    course.name = name;
    course.description = description;
    course.credits = credits;
    if (department) course.department = department;
    if (semester) course.semester = semester;

    const updatedCourse = await course.save();
    res.json(updatedCourse);
  } catch (error) {
    res.status(500).json({ 
      message: 'Sunucu hatası', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

// @desc    Ders sil
// @route   DELETE /api/courses/:id
// @access  Private/Admin
export const deleteCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(400).json({ message: 'Geçersiz ders ID' });
      return;
    }

    const course = await Course.findById(req.params.id);

    if (course) {
      // Derse kayıtlı öğrencilerin kayıtlarını sil
      await Enrollment.deleteMany({ courseId: course._id });
      
      // Dersi sil
      await course.deleteOne();
      
      res.json({ message: 'Ders başarıyla silindi' });
    } else {
      res.status(404).json({ message: 'Ders bulunamadı' });
    }
  } catch (error) {
    res.status(500).json({ 
      message: 'Sunucu hatası', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

// @desc    Derse kayıtlı öğrencileri getir
// @route   GET /api/courses/:id/students
// @access  Private/Admin
export const getCourseStudents = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(400).json({ message: 'Geçersiz ders ID' });
      return;
    }

    const enrollments = await Enrollment.find({ courseId: req.params.id })
      .populate({
        path: 'studentId',
        populate: {
          path: 'userId',
          select: 'username email'
        }
      });

    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ 
      message: 'Sunucu hatası', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}; 
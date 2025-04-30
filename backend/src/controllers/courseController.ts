import { Request, Response } from 'express';
import Course, { ICourse } from '../models/Course';
import Enrollment from '../models/Enrollment';

interface QueryParams {
  page?: string;
  limit?: string;
}

// @desc    Tüm dersleri getir
// @route   GET /api/courses
// @access  Private
export const getCourses = async (req: Request<{}, {}, {}, QueryParams>, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page || '1');
    const limit = parseInt(req.query.limit || '10');
    const skip = (page - 1) * limit;

    const courses = await Course.find()
      .skip(skip)
      .limit(limit)
      .sort({ name: 1 });

    const total = await Course.countDocuments();

    res.json({
      courses,
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

// @desc    Ders detayını getir
// @route   GET /api/courses/:id
// @access  Private
export const getCourseById = async (req: Request, res: Response): Promise<void> => {
  try {
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

interface CourseBody {
  name: string;
  description: string;
}

// @desc    Yeni ders oluştur
// @route   POST /api/courses
// @access  Private/Admin
export const createCourse = async (req: Request<{}, {}, CourseBody>, res: Response): Promise<void> => {
  try {
    const { name, description } = req.body;

    const courseExists = await Course.findOne({ name });
    if (courseExists) {
      res.status(400).json({ message: 'Bu isimde bir ders zaten var' });
      return;
    }

    const course = await Course.create({
      name,
      description
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
    const { name, description } = req.body;
    const course = await Course.findById(req.params.id);

    if (!course) {
      res.status(404).json({ message: 'Ders bulunamadı' });
      return;
    }

    // Eğer isim değişiyorsa, yeni isimde başka bir ders var mı kontrol et
    if (name !== course.name) {
      const courseExists = await Course.findOne({ name });
      if (courseExists) {
        res.status(400).json({ message: 'Bu isimde bir ders zaten var' });
        return;
      }
    }

    course.name = name;
    course.description = description;

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
    const course = await Course.findById(req.params.id);

    if (course) {
      // Derse kayıtlı öğrencilerin kayıtlarını sil
      await Enrollment.deleteMany({ courseId: course._id });
      
      // Dersi sil
      await course.deleteOne();
      
      res.json({ message: 'Ders silindi' });
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
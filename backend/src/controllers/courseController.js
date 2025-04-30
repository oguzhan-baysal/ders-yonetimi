const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// @desc    Tüm dersleri getir
// @route   GET /api/courses
// @access  Private
const getCourses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
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
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// @desc    Ders detayını getir
// @route   GET /api/courses/:id
// @access  Private
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (course) {
      res.json(course);
    } else {
      res.status(404).json({ message: 'Ders bulunamadı' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// @desc    Yeni ders oluştur
// @route   POST /api/courses
// @access  Private/Admin
const createCourse = async (req, res) => {
  try {
    const { name, description } = req.body;

    const courseExists = await Course.findOne({ name });
    if (courseExists) {
      return res.status(400).json({ message: 'Bu isimde bir ders zaten var' });
    }

    const course = await Course.create({
      name,
      description
    });

    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// @desc    Ders güncelle
// @route   PUT /api/courses/:id
// @access  Private/Admin
const updateCourse = async (req, res) => {
  try {
    const { name, description } = req.body;
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Ders bulunamadı' });
    }

    // Eğer isim değişiyorsa, yeni isimde başka bir ders var mı kontrol et
    if (name !== course.name) {
      const courseExists = await Course.findOne({ name });
      if (courseExists) {
        return res.status(400).json({ message: 'Bu isimde bir ders zaten var' });
      }
    }

    course.name = name;
    course.description = description;

    const updatedCourse = await course.save();
    res.json(updatedCourse);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// @desc    Ders sil
// @route   DELETE /api/courses/:id
// @access  Private/Admin
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (course) {
      // Derse kayıtlı öğrencilerin kayıtlarını sil
      await Enrollment.deleteMany({ courseId: course._id });
      
      // Dersi sil
      await course.remove();
      
      res.json({ message: 'Ders silindi' });
    } else {
      res.status(404).json({ message: 'Ders bulunamadı' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// @desc    Derse kayıtlı öğrencileri getir
// @route   GET /api/courses/:id/students
// @access  Private/Admin
const getCourseStudents = async (req, res) => {
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
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseStudents
}; 
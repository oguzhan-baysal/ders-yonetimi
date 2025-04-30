const mongoose = require('mongoose');
const Enrollment = require('../models/Enrollment');
const Student = require('../models/Student');
const Course = require('../models/Course');

// @desc    Tüm kayıtları getir
// @route   GET /api/enrollments
// @access  Private/Admin
const getEnrollments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
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
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// @desc    Kayıt oluştur
// @route   POST /api/enrollments
// @access  Private/Admin
const createEnrollment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { studentId, courseId } = req.body;

    // Öğrenci ve ders var mı kontrol et
    const student = await Student.findById(studentId);
    const course = await Course.findById(courseId);

    if (!student || !course) {
      await session.abortTransaction();
      return res.status(404).json({ 
        message: !student ? 'Öğrenci bulunamadı' : 'Ders bulunamadı' 
      });
    }

    // Kayıt zaten var mı kontrol et
    const existingEnrollment = await Enrollment.findOne({ studentId, courseId });
    if (existingEnrollment) {
      await session.abortTransaction();
      return res.status(400).json({ 
        message: 'Bu öğrenci zaten bu derse kayıtlı' 
      });
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
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  } finally {
    session.endSession();
  }
};

// @desc    Kayıt sil
// @route   DELETE /api/enrollments/:id
// @access  Private/Admin
const deleteEnrollment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Kayıt bulunamadı' });
    }

    await enrollment.deleteOne({ session });
    await session.commitTransaction();
    
    res.json({ message: 'Kayıt başarıyla silindi' });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  } finally {
    session.endSession();
  }
};

// @desc    Öğrencinin derslerini getir
// @route   GET /api/students/:id/courses
// @access  Private
const getStudentCourses = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ studentId: req.params.id })
      .populate('courseId', 'name description')
      .sort({ enrollmentDate: -1 });

    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// @desc    Dersin öğrencilerini getir
// @route   GET /api/courses/:id/students
// @access  Private
const getCourseStudents = async (req, res) => {
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
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

module.exports = {
  getEnrollments,
  createEnrollment,
  deleteEnrollment,
  getStudentCourses,
  getCourseStudents
}; 
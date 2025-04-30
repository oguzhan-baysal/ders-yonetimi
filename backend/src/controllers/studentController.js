const Student = require('../models/Student');
const User = require('../models/User');
const Enrollment = require('../models/Enrollment');
const mongoose = require('mongoose');

// @desc    Tüm öğrencileri getir
// @route   GET /api/students
// @access  Private/Admin
const getStudents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Arama ve filtreleme
    const search = req.query.search || '';
    const filter = {};
    
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
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Öğrenci detayını getir
// @route   GET /api/students/:id
// @access  Private/Admin
const getStudentById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Geçersiz öğrenci ID' });
    }

    const student = await Student.findById(req.params.id)
      .populate('userId', 'username email');

    if (!student) {
      return res.status(404).json({ message: 'Öğrenci bulunamadı' });
    }

    res.json(student);
  } catch (error) {
    console.error('Get Student Error:', error);
    res.status(500).json({ 
      message: 'Öğrenci bilgileri alınırken bir hata oluştu',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Yeni öğrenci oluştur
// @route   POST /api/students
// @access  Private/Admin
const createStudent = async (req, res) => {
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
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    session.endSession();
  }
};

// @desc    Öğrenci güncelle
// @route   PUT /api/students/:id
// @access  Private/Admin
const updateStudent = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Geçersiz öğrenci ID' });
    }

    const { firstName, lastName, birthDate } = req.body;

    // Input validasyonu
    if (!firstName || !lastName) {
      return res.status(400).json({ message: 'İsim ve soyisim alanları zorunludur' });
    }

    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: 'Öğrenci bulunamadı' });
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
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Öğrenci sil
// @route   DELETE /api/students/:id
// @access  Private/Admin
const deleteStudent = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Geçersiz öğrenci ID' });
    }

    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: 'Öğrenci bulunamadı' });
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
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    session.endSession();
  }
};

// @desc    Öğrencinin kayıtlı olduğu dersleri getir
// @route   GET /api/students/:id/courses
// @access  Private
const getStudentCourses = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Geçersiz öğrenci ID' });
    }

    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Öğrenci bulunamadı' });
    }

    const enrollments = await Enrollment.find({ studentId: req.params.id })
      .populate('courseId', 'name description');

    res.json(enrollments);
  } catch (error) {
    console.error('Get Student Courses Error:', error);
    res.status(500).json({ 
      message: 'Öğrenci dersleri listelenirken bir hata oluştu',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentCourses
}; 
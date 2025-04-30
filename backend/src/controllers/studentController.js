const Student = require('../models/Student');
const User = require('../models/User');
const Enrollment = require('../models/Enrollment');

// @desc    Tüm öğrencileri getir
// @route   GET /api/students
// @access  Private/Admin
const getStudents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const students = await Student.find()
      .populate('userId', 'username email')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Student.countDocuments();

    res.json({
      students,
      page,
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// @desc    Öğrenci detayını getir
// @route   GET /api/students/:id
// @access  Private/Admin
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('userId', 'username email');

    if (student) {
      res.json(student);
    } else {
      res.status(404).json({ message: 'Öğrenci bulunamadı' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// @desc    Öğrenci güncelle
// @route   PUT /api/students/:id
// @access  Private/Admin
const updateStudent = async (req, res) => {
  try {
    const { firstName, lastName, birthDate } = req.body;

    const student = await Student.findById(req.params.id);

    if (student) {
      student.firstName = firstName || student.firstName;
      student.lastName = lastName || student.lastName;
      student.birthDate = birthDate || student.birthDate;

      const updatedStudent = await student.save();
      res.json(updatedStudent);
    } else {
      res.status(404).json({ message: 'Öğrenci bulunamadı' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// @desc    Öğrenci sil
// @route   DELETE /api/students/:id
// @access  Private/Admin
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (student) {
      // Öğrencinin kayıtlı olduğu dersleri sil
      await Enrollment.deleteMany({ studentId: student._id });
      
      // Öğrenci kullanıcısını sil
      await User.findByIdAndDelete(student.userId);
      
      // Öğrenciyi sil
      await student.remove();
      
      res.json({ message: 'Öğrenci silindi' });
    } else {
      res.status(404).json({ message: 'Öğrenci bulunamadı' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// @desc    Öğrencinin kayıtlı olduğu dersleri getir
// @route   GET /api/students/:id/courses
// @access  Private
const getStudentCourses = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ studentId: req.params.id })
      .populate('courseId', 'name description');

    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

module.exports = {
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getStudentCourses
}; 
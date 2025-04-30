const express = require('express');
const router = express.Router();
const {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
} = require('../controllers/studentController');
const { getStudentCourses } = require('../controllers/enrollmentController');
const { protect, admin } = require('../middleware/auth');
const { body } = require('express-validator');
const validate = require('../middleware/validate');

// Validasyon kuralları
const studentValidation = [
  body('firstName').trim().notEmpty().withMessage('Ad zorunludur'),
  body('lastName').trim().notEmpty().withMessage('Soyad zorunludur'),
  body('birthDate').optional().isISO8601().withMessage('Geçerli bir tarih giriniz')
];

// Ana rotalar
router.route('/')
  .get(protect, getStudents)
  .post(protect, admin, studentValidation, validate, createStudent);

router.route('/:id')
  .get(protect, getStudentById)
  .put(protect, admin, studentValidation, validate, updateStudent)
  .delete(protect, admin, deleteStudent);

// Öğrencinin derslerini getir
router.get('/:id/courses', protect, getStudentCourses);

module.exports = router; 
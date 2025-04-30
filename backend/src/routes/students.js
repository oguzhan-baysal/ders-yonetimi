const express = require('express');
const router = express.Router();
const {
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getStudentCourses
} = require('../controllers/studentController');
const { protect, admin } = require('../middleware/auth');
const { body } = require('express-validator');
const validate = require('../middleware/validate');

// Validasyon kuralları
const studentUpdateValidation = [
  body('firstName').optional().trim().notEmpty().withMessage('İsim boş olamaz'),
  body('lastName').optional().trim().notEmpty().withMessage('Soyisim boş olamaz'),
  body('birthDate').optional().isISO8601().withMessage('Geçerli bir tarih giriniz')
];

router.route('/')
  .get(protect, admin, getStudents);

router.route('/:id')
  .get(protect, admin, getStudentById)
  .put(protect, admin, studentUpdateValidation, validate, updateStudent)
  .delete(protect, admin, deleteStudent);

router.get('/:id/courses', protect, getStudentCourses);

module.exports = router; 
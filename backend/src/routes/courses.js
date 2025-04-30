const express = require('express');
const router = express.Router();
const {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse
} = require('../controllers/courseController');
const { getCourseStudents } = require('../controllers/enrollmentController');
const { protect, admin } = require('../middleware/auth');
const { body } = require('express-validator');
const validate = require('../middleware/validate');

// Validasyon kuralları
const courseValidation = [
  body('name').trim().notEmpty().withMessage('Ders adı zorunludur'),
  body('description').trim().notEmpty().withMessage('Ders açıklaması zorunludur')
];

// Ana rotalar
router.route('/')
  .get(protect, getCourses)
  .post(protect, admin, courseValidation, validate, createCourse);

router.route('/:id')
  .get(protect, getCourseById)
  .put(protect, admin, courseValidation, validate, updateCourse)
  .delete(protect, admin, deleteCourse);

// Dersin öğrencilerini getir
router.get('/:id/students', protect, admin, getCourseStudents);

module.exports = router; 
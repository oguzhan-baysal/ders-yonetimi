const express = require('express');
const router = express.Router();
const {
  getEnrollments,
  createEnrollment,
  deleteEnrollment,
  getStudentCourses,
  getCourseStudents
} = require('../controllers/enrollmentController');
const { protect, admin } = require('../middleware/auth');
const { body } = require('express-validator');
const validate = require('../middleware/validate');

// Validasyon kuralları
const enrollmentValidation = [
  body('studentId')
    .notEmpty()
    .withMessage('Öğrenci ID zorunludur')
    .isMongoId()
    .withMessage('Geçerli bir Öğrenci ID giriniz'),
  body('courseId')
    .notEmpty()
    .withMessage('Ders ID zorunludur')
    .isMongoId()
    .withMessage('Geçerli bir Ders ID giriniz')
];

// Ana enrollment rotaları
router.route('/')
  .get(protect, admin, getEnrollments)
  .post(protect, admin, enrollmentValidation, validate, createEnrollment);

router.route('/:id')
  .delete(protect, admin, deleteEnrollment);

module.exports = router; 
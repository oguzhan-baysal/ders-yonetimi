import express from 'express';
import {
  getEnrollments,
  createEnrollment,
  deleteEnrollment,
  getStudentCourses,
  getCourseStudents,
  getMyEnrollments
} from '../controllers/enrollmentController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// Tüm route'lar için authentication gerekli
router.use(protect);

// Giriş yapmış kullanıcının kayıtları
router.get('/my', getMyEnrollments);

router.route('/')
  .get(authorize('admin'), getEnrollments)
  .post(authorize('admin'), createEnrollment);

// Öğrenciler kendi kayıtlarını silebilmeli
router.route('/:id').delete(deleteEnrollment);

router.get('/students/:id/courses', getStudentCourses);
router.get('/courses/:id/students', authorize('admin'), getCourseStudents);

export default router; 
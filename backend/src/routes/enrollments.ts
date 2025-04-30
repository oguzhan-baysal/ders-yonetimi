import express from 'express';
import {
  getEnrollments,
  createEnrollment,
  deleteEnrollment,
  getStudentCourses,
  getCourseStudents
} from '../controllers/enrollmentController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// Tüm route'lar için authentication gerekli
router.use(protect);

router.route('/')
  .get(authorize('admin'), getEnrollments)
  .post(authorize('admin'), createEnrollment);

router.route('/:id')
  .delete(authorize('admin'), deleteEnrollment);

router.get('/students/:id/courses', getStudentCourses);
router.get('/courses/:id/students', authorize('admin'), getCourseStudents);

export default router; 
import express from 'express';
import {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseStudents,
  enrollCourse
} from '../controllers/courseController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// Tüm route'lar için authentication gerekli
router.use(protect);

// Genel route'lar
router.route('/')
  .get(getCourses)
  .post(authorize('admin'), createCourse);

router.route('/:id')
  .get(getCourseById)
  .put(authorize('admin'), updateCourse)
  .delete(authorize('admin'), deleteCourse);

// Öğrenci işlemleri
router.post('/:id/enroll', authorize('student'), enrollCourse);
router.get('/:id/students', authorize('admin'), getCourseStudents);

export default router; 
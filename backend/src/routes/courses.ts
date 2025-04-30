import express from 'express';
import {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseStudents
} from '../controllers/courseController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// Tüm route'lar için authentication gerekli
router.use(protect);

router.route('/')
  .get(getCourses)
  .post(authorize('admin'), createCourse);

router.route('/:id')
  .get(getCourseById)
  .put(authorize('admin'), updateCourse)
  .delete(authorize('admin'), deleteCourse);

router.get('/:id/students', authorize('admin'), getCourseStudents);

export default router; 
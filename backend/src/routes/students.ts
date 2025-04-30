import express from 'express';
import {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentCourses
} from '../controllers/studentController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// Tüm route'lar için authentication gerekli
router.use(protect);

router.route('/')
  .get(authorize('admin'), getStudents)
  .post(authorize('admin'), createStudent);

router.route('/:id')
  .get(authorize('admin'), getStudentById)
  .put(authorize('admin'), updateStudent)
  .delete(authorize('admin'), deleteStudent);

router.get('/:id/courses', getStudentCourses);

export default router; 
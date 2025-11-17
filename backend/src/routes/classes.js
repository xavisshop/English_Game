// Update the routes file to include classes routes
const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  getClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
  addStudentToClass,
  removeStudentFromClass,
} from '../controllers/classController';

const router = express.Router();

router.route('/')
  .get(protect, getClasses)
  .post(protect, authorize('teacher'), createClass);

router.route('/:id')
  .get(protect, getClassById)
  .put(protect, authorize('teacher'), updateClass)
  .delete(protect, authorize('teacher'), deleteClass);

router.route('/:id/students')
  .post(protect, authorize('teacher'), addStudentToClass);

router.route('/:id/students/:studentId')
  .delete(protect, authorize('teacher'), removeStudentFromClass);

module.exports = router;
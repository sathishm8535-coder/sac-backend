import express from 'express';
import { createExam, getExams, getExamById, getAvailableExams, submitExam, deleteExam } from '../controllers/examController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticate, authorize('admin', 'staff'), createExam);
router.get('/', authenticate, authorize('admin', 'staff'), getExams);
router.get('/available', authenticate, authorize('student'), getAvailableExams);
router.get('/:id', authenticate, getExamById);
router.post('/submit', authenticate, authorize('student'), submitExam);
router.delete('/:id', authenticate, authorize('admin'), deleteExam);

export default router;

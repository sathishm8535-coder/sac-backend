import express from 'express';
import { createQuestion, getQuestions, updateQuestion, deleteQuestion } from '../controllers/questionController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticate, authorize('admin', 'staff'), createQuestion);
router.get('/', authenticate, authorize('admin', 'staff'), getQuestions);
router.put('/:id', authenticate, authorize('admin', 'staff'), updateQuestion);
router.delete('/:id', authenticate, authorize('admin'), deleteQuestion);

export default router;

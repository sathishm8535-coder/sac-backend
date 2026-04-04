import express from 'express';
import { createSubject, getSubjects, updateSubject, deleteSubject } from '../controllers/subjectController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticate, authorize('admin', 'staff'), createSubject);
router.get('/', authenticate, getSubjects);
router.put('/:id', authenticate, authorize('admin'), updateSubject);
router.delete('/:id', authenticate, authorize('admin'), deleteSubject);

export default router;

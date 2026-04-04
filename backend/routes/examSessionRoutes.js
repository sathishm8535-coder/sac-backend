import express from 'express';
import { startExamSession, getExamSession, updateExamSession, recordViolation, endExamSession } from '../controllers/examSessionController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/start', authenticate, authorize('student'), startExamSession);
router.get('/:examId', authenticate, authorize('student'), getExamSession);
router.put('/update', authenticate, authorize('student'), updateExamSession);
router.post('/violation', authenticate, authorize('student'), recordViolation);
router.post('/end', authenticate, authorize('student'), endExamSession);

export default router;

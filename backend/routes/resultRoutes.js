import express from 'express';
import { getResults, getStudentResults, publishResult, getAnalytics, exportResults, downloadResultPDF } from '../controllers/resultController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, authorize('admin', 'staff'), getResults);
router.get('/my-results', authenticate, authorize('student'), getStudentResults);
router.put('/publish/:id', authenticate, authorize('admin'), publishResult);
router.get('/analytics', authenticate, authorize('admin'), getAnalytics);
router.get('/export', authenticate, authorize('admin'), exportResults);
router.get('/:id/download', authenticate, authorize('admin', 'staff'), downloadResultPDF);

export default router;

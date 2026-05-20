import express from 'express';
import {
  generateCertificate,
  getMyCertificates,
  getAllCertificates,
  toggleCertificate,
  verifyCertificate
} from '../controllers/certificateController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/generate/:resultId', authenticate, authorize('student'), generateCertificate);
router.get('/verify/:certificateId', verifyCertificate);  // public — no auth needed
router.get('/my',                    authenticate, authorize('student'), getMyCertificates);
router.get('/',                      authenticate, authorize('admin', 'staff'), getAllCertificates);
router.put('/toggle/:examId',        authenticate, authorize('admin'), toggleCertificate);

export default router;

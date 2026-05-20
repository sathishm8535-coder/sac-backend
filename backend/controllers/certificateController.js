import Certificate from '../models/Certificate.js';
import Result from '../models/Result.js';
import Exam from '../models/Exam.js';
import { nanoid } from 'nanoid';

const getGrade = (percentage) => {
  if (percentage >= 90) return 'O';
  if (percentage >= 80) return 'A+';
  if (percentage >= 70) return 'A';
  if (percentage >= 60) return 'B+';
  if (percentage >= 50) return 'B';
  if (percentage >= 40) return 'C';
  return 'F';
};

// POST /api/certificates/generate/:resultId
export const generateCertificate = async (req, res) => {
  try {
    const result = await Result.findById(req.params.resultId)
      .populate('student_id', 'name department')
      .populate({ path: 'exam_id', populate: { path: 'subject_id' } });

    if (!result) return res.status(404).json({ message: 'Result not found' });
    if (!result.published) return res.status(400).json({ message: 'Result not published yet' });

    const percentage = (result.score / result.total_marks) * 100;
    if (percentage < 40) return res.status(400).json({ message: 'Only passed students can get certificates' });

    const exam = await Exam.findById(result.exam_id._id);
    if (!exam.certificateEnabled) return res.status(403).json({ message: 'Certificate generation is disabled for this exam' });

    const existing = await Certificate.findOne({ result_id: result._id });
    if (existing) return res.json(existing);

    const certificate = await Certificate.create({
      certificate_id:  `SAC-${nanoid(10).toUpperCase()}`,
      student_id:      result.student_id._id,
      exam_id:         result.exam_id._id,
      result_id:       result._id,
      student_name:    result.student_id.name,
      department:      result.student_id.department || '',
      exam_name:       result.exam_id.title,
      score:           result.score,
      total_marks:     result.total_marks,
      grade:           getGrade(percentage),
      issued_date:     new Date()
    });

    res.status(201).json(certificate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/certificates/verify/:certificateId
export const verifyCertificate = async (req, res) => {
  try {
    const cert = await Certificate.findOne({ certificate_id: req.params.certificateId })
      .populate('student_id', 'name email department')
      .populate('exam_id', 'title');
    if (!cert) return res.status(404).json({ valid: false, message: 'Certificate not found' });
    res.json({
      valid: true,
      certificate_id: cert.certificate_id,
      student_name:   cert.student_name,
      department:     cert.department,
      exam_name:      cert.exam_name,
      grade:          cert.grade,
      issued_date:    cert.issued_date
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/certificates/my
export const getMyCertificates = async (req, res) => {
  try {
    const certs = await Certificate.find({ student_id: req.user._id })
      .populate('exam_id', 'title')
      .sort({ issued_date: -1 });
    res.json(certs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/certificates (admin)
export const getAllCertificates = async (req, res) => {
  try {
    const certs = await Certificate.find()
      .populate('student_id', 'name email')
      .populate('exam_id', 'title')
      .sort({ issued_date: -1 });
    res.json(certs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/certificates/toggle/:examId (admin)
export const toggleCertificate = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.examId);
    if (!exam) return res.status(404).json({ message: 'Exam not found' });
    exam.certificateEnabled = !exam.certificateEnabled;
    await exam.save();
    res.json({ certificateEnabled: exam.certificateEnabled });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

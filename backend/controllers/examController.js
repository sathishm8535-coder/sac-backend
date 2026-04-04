import Exam from '../models/Exam.js';
import Question from '../models/Question.js';
import Result from '../models/Result.js';

export const createExam = async (req, res) => {
  try {
    const exam = await Exam.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json(exam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getExams = async (req, res) => {
  try {
    const exams = await Exam.find().populate('subject_id').populate('createdBy', 'name');
    res.json(exams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id).populate('subject_id');
    if (!exam) return res.status(404).json({ message: 'Exam not found' });
    if (!exam.questions || exam.questions.length === 0) {
      return res.status(400).json({ message: 'No questions in this exam' });
    }
    const questions = await Question.find({ _id: { $in: exam.questions } }).select('-correct_answer');
    res.json({ ...exam.toObject(), questions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAvailableExams = async (req, res) => {
  try {
    const exams = await Exam.find().populate('subject_id');
    const attempted = await Result.find({ student_id: req.user._id }).select('exam_id');
    const attemptedIds = attempted.map(r => r.exam_id.toString());
    
    const examsWithStatus = exams.map(exam => ({
      ...exam.toObject(),
      attempted: attemptedIds.includes(exam._id.toString())
    }));
    
    res.json(examsWithStatus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const submitExam = async (req, res) => {
  try {
    const { exam_id, student_roll_no, answers } = req.body;
    
    if (!student_roll_no) {
      return res.status(400).json({ message: 'Roll number is required' });
    }
    
    const existing = await Result.findOne({ student_id: req.user._id, exam_id });
    if (existing) return res.status(400).json({ message: 'Exam already submitted — duplicate submission rejected' });

    const exam = await Exam.findById(exam_id);
    const questions = await Question.find({ _id: { $in: exam.questions } });
    
    let score = 0;
    questions.forEach(q => {
      if (answers[q._id.toString()] === q.correct_answer) score++;
    });

    const result = await Result.create({
      student_id: req.user._id,
      exam_id,
      student_roll_no,
      answers,
      score,
      total_marks: exam.total_marks,
      published: false
    });

    res.status(201).json({ message: 'Exam submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteExam = async (req, res) => {
  try {
    await Exam.findByIdAndDelete(req.params.id);
    res.json({ message: 'Exam deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

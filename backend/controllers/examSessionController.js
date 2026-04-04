import ExamSession from '../models/ExamSession.js';
import Exam from '../models/Exam.js';
import Result from '../models/Result.js';
import Question from '../models/Question.js';

export const startExamSession = async (req, res) => {
  try {
    const { exam_id } = req.body;
    
    // Check for existing active session
    let existing = await ExamSession.findOne({ student_id: req.user._id, exam_id, is_active: true });
    if (existing) {
      const now = new Date();
      if (now > existing.end_time) {
        existing.is_active = false;
        await existing.save();
      } else {
        return res.json({ session: existing, resumed: true });
      }
    }

    // Check for any inactive session and remove it
    await ExamSession.deleteMany({ student_id: req.user._id, exam_id, is_active: false });

    const exam = await Exam.findById(exam_id);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + exam.duration * 60000);

    const session = await ExamSession.create({
      student_id: req.user._id,
      exam_id,
      start_time: startTime,
      end_time: endTime
    });

    res.json({ session, resumed: false });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getExamSession = async (req, res) => {
  try {
    const session = await ExamSession.findOne({
      student_id: req.user._id,
      exam_id: req.params.examId,
      is_active: true
    });

    if (!session) {
      return res.status(404).json({ message: 'No active session found' });
    }

    const now = new Date();
    if (now > session.end_time) {
      session.is_active = false;
      await session.save();
      return res.status(400).json({ message: 'Exam time expired', expired: true });
    }

    const timeRemaining = Math.floor((session.end_time - now) / 1000);
    res.json({ session, timeRemaining });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateExamSession = async (req, res) => {
  try {
    const { exam_id, current_question_index, answers } = req.body;

    const session = await ExamSession.findOne({
      student_id: req.user._id,
      exam_id,
      is_active: true
    });

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    session.current_question_index = current_question_index;
    session.answers = answers;
    session.last_activity = new Date();
    await session.save();

    res.json({ message: 'Session updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const recordViolation = async (req, res) => {
  try {
    const { exam_id } = req.body;

    const session = await ExamSession.findOne({
      student_id: req.user._id,
      exam_id,
      is_active: true
    });

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    session.violations += 1;
    await session.save();

    if (session.violations >= 3) {
      await autoSubmitExam(session);
      return res.json({ message: 'Exam auto-submitted due to violations', autoSubmitted: true });
    }

    res.json({ violations: session.violations, warning: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const autoSubmitExam = async (session) => {
  try {
    const exam = await Exam.findById(session.exam_id);
    const questions = await Question.find({ _id: { $in: exam.questions } });
    
    let score = 0;
    questions.forEach(q => {
      if (session.answers.get(q._id.toString()) === q.correct_answer) score++;
    });

    await Result.create({
      student_id: session.student_id,
      exam_id: session.exam_id,
      student_roll_no: 'AUTO-SUBMIT',
      answers: session.answers,
      score,
      total_marks: exam.total_marks,
      published: false
    });

    session.is_active = false;
    await session.save();
  } catch (error) {
    console.error('Auto-submit error:', error);
  }
};

export const endExamSession = async (req, res) => {
  try {
    const { exam_id } = req.body;

    const session = await ExamSession.findOne({
      student_id: req.user._id,
      exam_id,
      is_active: true
    });

    if (session) {
      session.is_active = false;
      await session.save();
    }

    res.json({ message: 'Session ended' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

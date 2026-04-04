import Result from '../models/Result.js';
import Exam from '../models/Exam.js';
import User from '../models/User.js';
import Question from '../models/Question.js';
import PDFDocument from 'pdfkit';

export const getResults = async (req, res) => {
  try {
    const results = await Result.find()
      .populate('student_id', 'name email')
      .populate({ path: 'exam_id', populate: { path: 'subject_id' } });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStudentResults = async (req, res) => {
  try {
    const results = await Result.find({ student_id: req.user._id, published: true })
      .populate({ path: 'exam_id', populate: { path: 'subject_id' } });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const publishResult = async (req, res) => {
  try {
    const result = await Result.findByIdAndUpdate(
      req.params.id, 
      { published: true }, 
      { new: true }
    );
    await Exam.findByIdAndUpdate(result.exam_id, { resultPublished: true });
    res.json({ message: 'Result published', result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAnalytics = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalExams = await Exam.countDocuments();
    const totalResults = await Result.countDocuments({ published: true });
    
    const results = await Result.find({ published: true });
    const passed = results.filter(r => (r.score / r.total_marks) >= 0.4).length;
    const passPercentage = totalResults > 0 ? ((passed / totalResults) * 100).toFixed(2) : 0;

    const subjectPerformance = await Result.aggregate([
      { $match: { published: true } },
      { $lookup: { from: 'exams', localField: 'exam_id', foreignField: '_id', as: 'exam' } },
      { $unwind: '$exam' },
      { $lookup: { from: 'subjects', localField: 'exam.subject_id', foreignField: '_id', as: 'subject' } },
      { $unwind: '$subject' },
      { $group: { 
        _id: '$subject.subject_name', 
        avgScore: { $avg: { $multiply: [{ $divide: ['$score', '$total_marks'] }, 100] } } 
      }}
    ]);

    res.json({ totalStudents, totalExams, totalResults, passPercentage, subjectPerformance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const exportResults = async (req, res) => {
  try {
    const results = await Result.find({ published: true })
      .populate('student_id', 'name email')
      .populate({ path: 'exam_id', populate: { path: 'subject_id' } });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const downloadResultPDF = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id)
      .populate('student_id', 'name email')
      .populate({ path: 'exam_id', populate: { path: 'subject_id' } });

    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }

    const questions = await Question.find({ _id: { $in: result.exam_id.questions } });
    
    const doc = new PDFDocument({ margin: 50 });
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=result-${result.student_roll_no}-${Date.now()}.pdf`);
    
    doc.pipe(res);

    doc.fontSize(20).text('Sadakathullah Appa College', { align: 'center' });
    doc.fontSize(16).text('MCQ Exam Result', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12);
    doc.text(`Student Name: ${result.student_id.name}`);
    doc.text(`Roll Number: ${result.student_roll_no}`);
    doc.text(`Email: ${result.student_id.email}`);
    doc.text(`Exam: ${result.exam_id.title}`);
    doc.text(`Subject: ${result.exam_id.subject_id.subject_name}`);
    doc.text(`Date: ${new Date(result.date).toLocaleString()}`);
    doc.text(`Score: ${result.score}/${result.total_marks}`);
    doc.text(`Percentage: ${((result.score / result.total_marks) * 100).toFixed(2)}%`);
    doc.moveDown();

    doc.fontSize(14).text('Answers:', { underline: true });
    doc.moveDown();

    questions.forEach((q, index) => {
      const studentAnswer = result.answers.get(q._id.toString());
      const isCorrect = studentAnswer === q.correct_answer;
      
      doc.fontSize(11);
      doc.text(`Q${index + 1}. ${q.question_text}`, { bold: true });
      doc.fontSize(10);
      doc.text(`A) ${q.options.A}`);
      doc.text(`B) ${q.options.B}`);
      doc.text(`C) ${q.options.C}`);
      doc.text(`D) ${q.options.D}`);
      doc.text(`Your Answer: ${studentAnswer || 'Not Answered'}`, { 
        color: isCorrect ? 'green' : 'red' 
      });
      doc.text(`Correct Answer: ${q.correct_answer}`, { color: 'green' });
      doc.moveDown();
    });

    doc.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

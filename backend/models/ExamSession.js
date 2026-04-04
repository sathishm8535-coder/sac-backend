import mongoose from 'mongoose';

const examSessionSchema = new mongoose.Schema({
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  exam_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  start_time: { type: Date, required: true },
  end_time: { type: Date, required: true },
  current_question_index: { type: Number, default: 0 },
  answers: { type: Map, of: String, default: {} },
  violations: { type: Number, default: 0 },
  is_active: { type: Boolean, default: true },
  last_activity: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('ExamSession', examSessionSchema);

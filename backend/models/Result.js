import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema({
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  exam_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  student_roll_no: { type: String, required: true },
  answers: { type: Map, of: String },
  score: { type: Number, required: true },
  total_marks: { type: Number, required: true },
  published: { type: Boolean, default: false },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

resultSchema.index({ student_id: 1, exam_id: 1 }, { unique: true });

export default mongoose.model('Result', resultSchema);

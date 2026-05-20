import mongoose from 'mongoose';

const examSchema = new mongoose.Schema({
  subject_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  title: { type: String, required: true },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  duration: { type: Number, required: true },
  total_marks: { type: Number, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  resultPublished:      { type: Boolean, default: false },
  certificateEnabled:   { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Exam', examSchema);

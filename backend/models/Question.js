import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  subject_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  question_text: { type: String, required: true },
  options: {
    A: { type: String, required: true },
    B: { type: String, required: true },
    C: { type: String, required: true },
    D: { type: String, required: true }
  },
  correct_answer: { type: String, enum: ['A', 'B', 'C', 'D'], required: true }
}, { timestamps: true });

export default mongoose.model('Question', questionSchema);

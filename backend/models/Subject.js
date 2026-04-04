import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
  subject_name: { type: String, required: true, unique: true }
}, { timestamps: true });

export default mongoose.model('Subject', subjectSchema);

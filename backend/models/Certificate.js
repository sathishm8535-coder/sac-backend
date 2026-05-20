import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema({
  certificate_id: { type: String, required: true, unique: true },
  student_id:     { type: mongoose.Schema.Types.ObjectId, ref: 'User',   required: true },
  exam_id:        { type: mongoose.Schema.Types.ObjectId, ref: 'Exam',   required: true },
  result_id:      { type: mongoose.Schema.Types.ObjectId, ref: 'Result', required: true },
  student_name:   { type: String, required: true },
  department:     { type: String, default: '' },
  exam_name:      { type: String, required: true },
  score:          { type: Number, required: true },
  total_marks:    { type: Number, required: true },
  grade:          { type: String, required: true },
  issued_date:    { type: Date,   default: Date.now },
  certificate_url:{ type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('Certificate', certificateSchema);

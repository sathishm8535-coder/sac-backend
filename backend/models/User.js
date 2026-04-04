import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  // admin & staff
  username: { type: String, unique: true, sparse: true, trim: true },
  // students
  name:  { type: String },
  email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
  // shared
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'staff', 'student'], required: true }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model('User', userSchema);

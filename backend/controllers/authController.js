import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// Student registration
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: 'Name, email and password are required' });

    if (await User.findOne({ email }))
      return res.status(400).json({ message: 'Email already exists' });

    const user = await User.create({ name, email, password, role: 'student' });
    const token = signToken(user._id);

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Strict credentials for admin/staff — no loose matching allowed
const STAFF_CREDENTIALS = [
  { username: 'adminsac', password: 'admin123', role: 'admin' },
  { username: 'staffsac', password: 'staff123', role: 'staff' }
];

// Unified login — detects student vs admin/staff from request body
export const login = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!password)
      return res.status(400).json({ message: 'Password is required' });

    // Admin / Staff: strict exact-match against hardcoded credentials
    if (username) {
      const match = STAFF_CREDENTIALS.find(
        (c) => c.username === username && c.password === password
      );

      if (!match)
        return res.status(401).json({ message: 'Invalid username or password' });

      // Fetch DB user only to get _id for JWT (user must exist from seed)
      const user = await User.findOne({ username: match.username });
      if (!user)
        return res.status(401).json({ message: 'Invalid username or password' });

      const token = signToken(user._id);
      return res.json({
        message: 'Login success',
        token,
        user: { id: user._id, username: user.username, role: user.role }
      });
    }

    // Student: email + bcrypt check
    if (email) {
      const user = await User.findOne({ email });
      if (!user || !(await user.comparePassword(password)))
        return res.status(401).json({ message: 'Invalid email or password' });

      const token = signToken(user._id);
      return res.json({
        message: 'Login success',
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role }
      });
    }

    return res.status(400).json({ message: 'Username or email is required' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProfile = async (req, res) => {
  res.json({ user: req.user });
};

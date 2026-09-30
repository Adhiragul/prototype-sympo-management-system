import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'srm_easwari_engineering_college_symposphere_super_secret_key_2026',
    { expiresIn: '30d' }
  );
};

// @desc    Register a new user (Student or Organizer)
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, department, collegeName, rollNo, year, phone } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email address already exists.'
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'student',
      department,
      collegeName: collegeName || 'SRM Easwari Engineering College (Autonomous)',
      rollNo: rollNo || '',
      year: year ? Number(year) : 3,
      phone: phone || ''
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,

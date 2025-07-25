const User = require('../models/UserModel');
const sendEmail = require('../utils/sendEmail');
const jwt = require('jsonwebtoken');

// Helper to generate 6-digit OTP string
const generate6DigitOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Reusable HTML template for OTP email
const otpMessageHTML = (otp) => `
  <div style="font-family: Arial, sans-serif; line-height: 1.6;">
    <h2>Your OTP Code</h2>
    <p style="font-size: 18px; font-weight: bold;">${otp}</p>
    <p>This OTP is valid for <strong>5 minutes</strong>. Please use it before it expires.</p>
    <p>If you did not request this code, please ignore this email.</p>
  </div>
`;

exports.sendOtp = async (req, res) => {
  const { email, name } = req.body;
  if (!email) return res.status(400).json({ message: 'Email required' });

  let user = await User.findOne({ email });

  // If user doesn't exist, require name for registration
  if (!user) {
    if (!name) {
      return res.status(400).json({ message: 'Name required for new users' });
    }
    user = new User({ email, name });
  }

  const otp = generate6DigitOTP();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry

  user.otp = { code: otp, expiresAt };
  user.otpResendCount = (user.otpResendCount || 0) + 1;
  user.otpResendLastTime = new Date();

  await user.save();

  try {
    await sendEmail(email, 'Your OTP Code', otpMessageHTML(otp));
    res.status(200).json({ message: 'OTP sent' });
  } catch (err) {
    console.error('Error sending OTP email:', err);
    res.status(500).json({ message: 'Failed to send OTP', error: err.message });
  }
};

exports.resendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const now = new Date();
  const RESEND_COOLDOWN = 60 * 1000; // 60 seconds cooldown
  const MAX_RESEND = 5;

  if (user.otpResendLastTime && (now - user.otpResendLastTime) < RESEND_COOLDOWN) {
    return res.status(429).json({ message: 'Please wait before resending OTP again' });
  }

  if ((user.otpResendCount || 0) >= MAX_RESEND) {
    return res.status(429).json({ message: 'Maximum OTP resend attempts reached. Please try after some time.' });
  }

  const otp = generate6DigitOTP();
  const expiresAt = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes validity

  user.otp = { code: otp, expiresAt };
  user.otpResendCount = (user.otpResendCount || 0) + 1;
  user.otpResendLastTime = now;

  await user.save();

  try {
    await sendEmail(email, 'Your OTP Code', otpMessageHTML(otp));
    res.status(200).json({ message: 'OTP resent successfully' });
  } catch (error) {
    console.error('Error resending OTP:', error);
    res.status(500).json({ message: 'Failed to resend OTP', error: error.message });
  }
};

exports.register = async (req, res) => {
  const { name, email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP required' });
  }

  let user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'User not found. Please request OTP first.' });
  }

  if (!user.otp || user.otp.code !== otp) {
    return res.status(400).json({ message: 'Invalid OTP' });
  }

  if (user.otp.expiresAt < new Date()) {
    return res.status(400).json({ message: 'OTP expired' });
  }

  if (!user.name && name) {
    user.name = name;
  }

  // Clear OTP and resend counters after successful registration
  user.otp = undefined;
  user.otpResendCount = 0;
  user.otpResendLastTime = undefined;

  await user.save();

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  res.status(201).json({ message: 'Registered successfully', token, user: { email: user.email, name: user.name } });
};

exports.login = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP required' });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (!user.otp || user.otp.code !== otp) {
    return res.status(400).json({ message: 'Invalid OTP' });
  }

  if (user.otp.expiresAt < new Date()) {
    return res.status(400).json({ message: 'OTP expired' });
  }

  // Clear OTP and resend counters after successful login
  user.otp = undefined;
  user.otpResendCount = 0;
  user.otpResendLastTime = undefined;

  await user.save();

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  res.status(200).json({ message: 'Login successful', token, user: { email: user.email, name: user.name } });
};

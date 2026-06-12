import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { hashPassword, comparePassword } from '../utils/helpers.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const passwordMatch = await comparePassword(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'User account is inactive' });
    }

    
    // Update last login
    user.lastLogin = new Date();
    await user.save();

    console.log("User:", user.email);
    console.log("2FA Enabled:", user.twoFactorEnabled);

    if (user.twoFactorEnabled) {
      return res.json({
        requires2FA: true,
        userId: user._id,
      });
    }

    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await hashPassword(password);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'user',
    });

    await user.save();

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.json({
        user: {
          name: req.user.name,
          email: req.user.email,
        },
      });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
};

export const logout = (req, res) => {
  res.json({ message: 'Logout successful' });
};

export const setup2FA = async (req, res) => {

  const user = await User.findById(req.user.id);

  const secret = speakeasy.generateSecret({
    name: `MANIRATNA JEWELS (${user.email})`,
  });

  user.twoFactorSecret = secret.base32;

  await user.save();

  const qrCode = await QRCode.toDataURL(
    secret.otpauth_url
  );

  res.json({
    qrCode,
    secret: secret.base32,
  });
};

export const enable2FA = async (req, res) => {

  const { token } = req.body;

  const user = await User.findById(req.user.id);

  const verified = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: 'base32',
    token,
  });

  if (!verified) {
    return res.status(400).json({
      message: 'Invalid OTP',
    });
  }

  user.twoFactorEnabled = true;

  await user.save();

  res.json({
    message: '2FA enabled',
  });
};

export const verify2FA = async (req, res) => {

  const { userId, token } = req.body;

  const user = await User.findById(userId);

  const verified = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: 'base32',
    token,
    window: 1,
  });

  if (!verified) {
    return res.status(400).json({
      message: 'Invalid OTP',
    });
  }

  const jwtToken = jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '7d',
    }
  );

  res.json({
    token: jwtToken,
    user,
  });
};
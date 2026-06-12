import express from 'express';
import { login, register, getCurrentUser, logout, setup2FA, enable2FA, verify2FA } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/me', authenticate, getCurrentUser);
router.post('/logout', authenticate, logout);
router.get('/setup-2fa', authenticate, setup2FA);
router.post('/enable-2fa', authenticate, enable2FA);
router.post('/verify-2fa', authenticate, verify2FA);

export default router;

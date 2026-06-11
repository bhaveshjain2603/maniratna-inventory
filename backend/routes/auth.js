import express from 'express';
import passport from 'passport';
import { login, register, getCurrentUser, logout } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
  }),
  async (req, res) => {

    const token = jwt.sign(
      {
        id: req.user.googleId,
        name: req.user.name,
        email: req.user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1d',
      }
    );

    res.redirect(
      `https://dashboard.maniratnajewels.in/auth-success?token=${token}`
    );
  }
);

router.post('/login', login);
router.post('/register', register);
router.get('/me', authenticate, getCurrentUser);
router.post('/logout', authenticate, logout);

export default router;

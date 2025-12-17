// routes/auth.routes.js
const express = require('express');
const router = express.Router();
const passport = require('passport');
const {
  register,
  login,
  refresh,
  logout,
  setup2FA,
  verify2FA,
  disable2FA,
  me,
  forgotPassword
} = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { loginLimiter, generalLimiter } = require('../middlewares/rateLimiter.middleware');

// Rotas públicas
router.post('/register', generalLimiter, register);
router.post('/login', loginLimiter, login);
router.post('/refresh', refresh);
router.post('/forgot-password', generalLimiter, forgotPassword);

// OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
  const accessToken = require('../services/token.service').generateAccessToken(req.user);
  const refreshToken = require('../services/token.service').generateRefreshToken(req.user);
  res.redirect(`${process.env.FRONTEND_URL}/oauth-success?accessToken=${accessToken}&refreshToken=${refreshToken}`);
});

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback', passport.authenticate('github', { session: false }), (req, res) => {
  const accessToken = require('../services/token.service').generateAccessToken(req.user);
  const refreshToken = require('../services/token.service').generateRefreshToken(req.user);
  res.redirect(`${process.env.FRONTEND_URL}/oauth-success?accessToken=${accessToken}&refreshToken=${refreshToken}`);
});

// Rotas protegidas
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, me);
router.post('/2fa/setup', authenticate, setup2FA);
router.post('/2fa/verify', authenticate, verify2FA);
router.post('/2fa/disable', authenticate, disable2FA);

module.exports = router;
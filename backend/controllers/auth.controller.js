// controllers/auth.controller.js
const User = require('../models/User.model');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyToken
} = require('../services/token.service');
const { sendEmail } = require('../services/email.service');
const {
  generate2FASecret,
  generateQRCode,
  verify2FAToken
} = require('../services/twofa.service');
const { addToBlacklist } = require('../middlewares/auth.middleware');
const logger = require('../utils/logger.util');

const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'Email já registrado' });

    user = await User.create({ username, email, password, provider: 'local' });

    logger.info('Novo usuário registrado (local)', { email });

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      user: { id: user._id, email: user.email, username: user.username }
    });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao registrar usuário' });
  }
};

const login = async (req, res) => {
  const { email, password, totpToken } = req.body;

  const user = await User.findOne({ email });
  if (!user || user.provider !== 'local') {
    return res.status(401).json({ message: 'Credenciais inválidas' });
  }

  const passwordValid = await user.comparePassword(password);
  if (!passwordValid) {
    return res.status(401).json({ message: 'Credenciais inválidas' });
  }

  // Verificar 2FA se ativado
  if (user.twoFactorEnabled) {
    if (!totpToken) {
      return res.status(200).json({ message: '2FA requerido', requires2FA: true });
    }
    const verified = verify2FAToken(user.twoFactorSecret, totpToken);
    if (!verified) {
      return res.status(401).json({ message: 'Código 2FA inválido' });
    }
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save();

  logger.info('Login bem-sucedido', { email });

  res.json({
    message: 'Login bem-sucedido',
    accessToken,
    refreshToken,
    user: { id: user._id, email: user.email, username: user.username, twoFactorEnabled: user.twoFactorEnabled }
  });
};

const refresh = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ message: 'Refresh token requerido' });

  try {
    const decoded = verifyToken(refreshToken);
    const user = await User.findById(decoded.userId);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: 'Refresh token inválido' });
    }

    const newAccessToken = generateAccessToken(user);
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(403).json({ message: 'Refresh token expirado' });
  }
};

const logout = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  addToBlacklist(token);

  if (req.user) {
    req.user.refreshToken = null;
    await req.user.save();
    logger.info('Logout realizado', { email: req.user.email });
  }

  res.json({ message: 'Logout realizado com sucesso' });
};

const setup2FA = async (req, res) => {
  const user = req.user;

  if (user.twoFactorEnabled) {
    return res.status(400).json({ message: '2FA já está ativado' });
  }

  const secret = generate2FASecret(user);
  const qrCodeUrl = await generateQRCode(secret.otpauth_url);

  user.twoFactorSecret = secret.base32;
  await user.save();

  res.json({
    message: 'Escaneie o QR code com Google Authenticator ou Authy',
    qrCode: qrCodeUrl,
    secret: secret.base32
  });
};

const verify2FA = async (req, res) => {
  const { token } = req.body;
  const user = req.user;

  if (!user.twoFactorSecret) {
    return res.status(400).json({ message: '2FA não configurado' });
  }

  const verified = verify2FAToken(user.twoFactorSecret, token);
  if (!verified) {
    return res.status(400).json({ message: 'Código inválido' });
  }

  user.twoFactorEnabled = true;
  await user.save();

  res.json({ message: '2FA ativado com sucesso' });
};

const disable2FA = async (req, res) => {
  const { token } = req.body;
  const user = req.user;

  const verified = verify2FAToken(user.twoFactorSecret, token);
  if (!verified) {
    return res.status(400).json({ message: 'Código inválido' });
  }

  user.twoFactorEnabled = false;
  user.twoFactorSecret = undefined;
  await user.save();

  res.json({ message: '2FA desativado com sucesso' });
};

const me = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password -twoFactorSecret -refreshToken');
  res.json({ user });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    const resetToken = generateAccessToken(user);
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    await sendEmail(
      email,
      'Redefinição de Senha - Auth Pro',
      `<p>Clique no link para redefinir sua senha: <a href="${resetLink}">Redefinir</a></p><p>Expira em 1 hora.</p>`
    );
  }

  res.json({ message: 'Se o email existir, enviamos um link de redefinição' });
};

module.exports = {
  register,
  login,
  refresh,
  logout,
  setup2FA,
  verify2FA,
  disable2FA,
  me,
  forgotPassword
};
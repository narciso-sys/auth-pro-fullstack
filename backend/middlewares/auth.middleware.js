// middlewares/auth.middleware.js
const { verifyToken } = require('../services/token.service');
const User = require('../models/User.model');

// Blacklist simples em memória (em produção use Redis)
const tokenBlacklist = new Set();

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token de acesso requerido' });
  }

  if (tokenBlacklist.has(token)) {
    return res.status(401).json({ message: 'Token revogado' });
  }

  try {
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido ou expirado' });
  }
};

const addToBlacklist = (token) => {
  if (token) tokenBlacklist.add(token);
};

module.exports = { authenticate, addToBlacklist };
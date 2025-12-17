// services/token.service.js
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const generateAccessToken = (user) => {
  return jwt.sign(
    { userId: user._id, email: user.email },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { userId: user._id },
    config.jwtSecret,
    { expiresIn: config.refreshExpiresIn }
  );
};

const verifyToken = (token) => {
  return jwt.verify(token, config.jwtSecret);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken
};
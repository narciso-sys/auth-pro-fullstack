// services/twofa.service.js
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

const generate2FASecret = (user) => {
  const secret = speakeasy.generateSecret({
    name: `AuthPro (${user.email})`,
    length: 32
  });
  return secret;
};

const generateQRCode = async (otpauthUrl) => {
  return await qrcode.toDataURL(otpauthUrl);
};

const verify2FAToken = (secret, token) => {
  return speakeasy.totp.verify({
    secret: secret,
    encoding: 'base32',
    token,
    window: 1
  });
};

module.exports = {
  generate2FASecret,
  generateQRCode,
  verify2FAToken
};
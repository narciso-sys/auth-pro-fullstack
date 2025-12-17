// models/User.model.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, sparse: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // null para usuários OAuth
  provider: { type: String, enum: ['local', 'google', 'github'], default: 'local' },
  providerId: { type: String }, // ID do Google/GitHub
  twoFactorEnabled: { type: Boolean, default: false },
  twoFactorSecret: { type: String }, // base32 secret para TOTP
  refreshToken: { type: String },
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function(next) {
  if (this.isModified('password') && this.password) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
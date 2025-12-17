// utils/database.js
const mongoose = require('mongoose');
const config = require('../config/config');
const logger = require('./logger.util');

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongodbUri);
    logger.info('MongoDB conectado com sucesso');
  } catch (err) {
    logger.error('Erro ao conectar ao MongoDB', err);
    process.exit(1);
  }
};

module.exports = { connectDB };
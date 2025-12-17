// utils/logger.util.js
const log = (type, message, details = '') => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${type.toUpperCase()}] ${message}`, details ? JSON.stringify(details) : '');
};

module.exports = {
  info: (msg, details) => log('info', msg, details),
  error: (msg, details) => log('error', msg, details),
  warn: (msg, details) => log('warn', msg, details)
};
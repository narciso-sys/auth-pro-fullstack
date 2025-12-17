// services/email.service.js
const nodemailer = require('nodemailer');
const config = require('../config/config');

const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: false,
  auth: {
    user: config.email.user,
    pass: config.email.pass
  }
});

const sendEmail = async (to, subject, html) => {
  await transporter.sendMail({
    from: config.email.from,
    to,
    subject,
    html
  });
};

module.exports = { sendEmail };
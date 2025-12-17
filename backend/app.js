// app.js
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const config = require('./config/config');
const authRoutes = require('./routes/auth.routes');
const { connectDB } = require('./utils/database');
const logger = require('./utils/logger.util');

require('./config/passport'); // Inicializa Passport

const app = express();

// Conectar ao MongoDB
connectDB();

// Middlewares
app.use(cors({ origin: config.frontendUrl, credentials: true }));
app.use(express.json());
app.use(passport.initialize());

// Rotas
app.use('/auth', authRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Auth Pro API rodando!' });
});

app.get('/', (req, res) => {
  res.json({
    message: 'Bem-vindo à Auth Pro API - Autenticação Empresarial',
    version: '2.0',
    features: ['Email/Senha', 'Google', 'GitHub', '2FA', 'Refresh Token', 'Reset Password']
  });
});

// Error handler
app.use((err, req, res, next) => {
  logger.error('Erro interno', { error: err.message });
  res.status(500).json({ message: 'Erro interno do servidor' });
});

const PORT = config.port;
app.listen(PORT, () => {
  logger.info(`Servidor rodando na porta ${PORT}`);
  console.log(`🚀 Auth Pro Backend pronto em http://localhost:${PORT}`);
});
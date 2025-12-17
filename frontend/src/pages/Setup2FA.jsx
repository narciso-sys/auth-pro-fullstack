// src/pages/Setup2FA.jsx
import { useState, useEffect } from 'react';
import axios from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Setup2FA() {
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSetup = async () => {
      try {
        const res = await axios.post('/auth/2fa/setup');
        setQrCode(res.data.qrCode);
        setSecret(res.data.secret);
      } catch (err) {
        setError('Erro ao configurar 2FA');
      }
    };
    fetchSetup();
  }, []);

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/auth/2fa/verify', { token });
      setSuccess('2FA ativado com sucesso!');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError('Código inválido. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Ativar 2FA</h2>

        <div className="text-center space-y-6">
          <p className="text-gray-600">
            Escaneie o QR code abaixo com um app autenticador (Google Authenticator, Authy, Microsoft Authenticator)
          </p>

          {qrCode ? (
            <img src={qrCode} alt="QR Code 2FA" className="mx-auto w-64 h-64" />
          ) : (
            <p>Carregando QR code...</p>
          )}

          <div className="bg-gray-100 p-4 rounded-lg text-sm break-all">
            <strong>Chave secreta manual:</strong><br />
            {secret}
          </div>

          <form onSubmit={handleVerify} className="space-y-4">
            <input
              type="text"
              placeholder="Digite o código de 6 dígitos"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              maxLength="6"
              className="w-full px-4 py-3 text-center text-2xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />

            {error && <p className="text-red-600">{error}</p>}
            {success && <p className="text-green-600 font-bold">{success}</p>}

            <button type="submit" className="w-full bg-primary hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition">
              Verificar e Ativar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
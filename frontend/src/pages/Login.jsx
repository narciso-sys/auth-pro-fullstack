// src/pages/Login.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authStore from '../store/authStore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [totpToken, setTotpToken] = useState('');
  const [requires2FA, setRequires2FA] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = authStore();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password, totpToken || undefined);
      navigate('/');
    } catch (err) {
      if (err.response?.data?.requires2FA) {
        setRequires2FA(true);
      } else {
        setError(err.response?.data?.message || 'Erro ao fazer login');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="glass max-w-md w-full p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Auth Pro</h1>
          <p className="text-indigo-200">Bem-vindo de volta</p>
        </div>

        <div className="space-y-4 mb-8">
          <a href={`${API_URL}/auth/google`} className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 font-medium py-3 rounded-xl transition hover:shadow-lg hover:scale-105">
            <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" className="w-6 h-6" />
            Continuar com Google
          </a>
          <a href={`${API_URL}/auth/github`} className="w-full flex items-center justify-center gap-3 bg-gray-800 text-white font-medium py-3 rounded-xl transition hover:shadow-lg hover:scale-105">
            <img src="https://www.svgrepo.com/show/355081/github.svg" alt="GitHub" className="w-6 h-6" />
            Continuar com GitHub
          </a>
        </div>

        <div className="relative text-center mb-8">
          <span className="bg-transparent text-indigo-300 px-4">ou com email</span>
          <div className="absolute left-0 right-0 top-1/2 h-px bg-indigo-600 opacity-50"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-5 py-4 bg-white/10 border border-indigo-500/30 rounded-xl text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-5 py-4 bg-white/10 border border-indigo-500/30 rounded-xl text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-primary transition"
            required
          />
          {requires2FA && (
            <input
              type="text"
              placeholder="Código 2FA (6 dígitos)"
              value={totpToken}
              onChange={(e) => setTotpToken(e.target.value)}
              maxLength="6"
              className="w-full px-5 py-4 bg-white/10 border border-indigo-500/30 rounded-xl text-white text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-primary transition"
              required
            />
          )}
          {error && <p className="text-red-400 text-center font-medium">{error}</p>}
          <button type="submit" className="w-full bg-primary hover:bg-primaryDark text-white font-bold py-4 rounded-xl transition hover:shadow-xl hover:scale-105">
            Entrar
          </button>
        </form>

        <div className="text-center mt-8 space-y-3">
          <Link to="/register" className="block text-indigo-300 hover:text-white transition">
            Não tem conta? <span className="font-semibold underline">Criar agora</span>
          </Link>
          <Link to="/reset-password" className="block text-indigo-300 hover:text-white transition">
            Esqueceu a senha?
          </Link>
        </div>
      </div>
    </div>
  );
}
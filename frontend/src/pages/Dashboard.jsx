// src/pages/Dashboard.jsx
import { useEffect } from 'react';
import authStore from '../store/authStore';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../services/api';

export default function Dashboard() {
  const { user, logout } = authStore();
  const navigate = useNavigate();

  useEffect(() => {
    authStore.getState().loadUser();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('/auth/logout');
      logout();
      navigate('/login');
    } catch (err) {
      logout();
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-primary text-white p-8 text-center">
            <h1 className="text-4xl font-bold">Bem-vindo, {user?.username || user?.email}!</h1>
            <p className="mt-2 text-indigo-100">Sua conta está protegida e ativa</p>
          </div>

          <div className="p-8 space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Informações da conta</h3>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>2FA:</strong> {user?.twoFactorEnabled ? 'Ativado ✅' : 'Desativado ❌'}</p>
                <p><strong>Criado em:</strong> {new Date(user?.createdAt || Date.now()).toLocaleDateString('pt-BR')}</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Segurança</h3>
                {!user?.twoFactorEnabled ? (
                  <Link to="/2fa/setup" className="block w-full bg-green-600 hover:bg-green-700 text-white text-center font-bold py-3 rounded-lg transition">
                    Ativar Autenticação em 2 Fatores (2FA)
                  </Link>
                ) : (
                  <div className="text-green-600 font-semibold text-center">
                    ✅ 2FA já está ativo
                  </div>
                )}
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition"
              >
                Sair da conta
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
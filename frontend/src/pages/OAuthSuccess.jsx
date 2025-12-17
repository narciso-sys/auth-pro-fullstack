// src/pages/OAuthSuccess.jsx
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import authStore from '../store/authStore';

export default function OAuthSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const { oauthSuccess } = authStore();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const accessToken = params.get('accessToken');
    const refreshToken = params.get('refreshToken');

    if (accessToken && refreshToken) {
      oauthSuccess(accessToken, refreshToken, { email: 'via OAuth' });
      navigate('/');
    } else {
      navigate('/login');
    }
  }, [location, navigate, oauthSuccess]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white mx-auto mb-6"></div>
        <p className="text-xl text-white font-semibold">Finalizando login com Google/GitHub...</p>
      </div>
    </div>
  );
}
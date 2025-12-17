// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Setup2FA from './pages/Setup2FA';
import OAuthSuccess from './pages/OAuthSuccess';
import ResetPassword from './pages/ResetPassword';
import authStore from './store/authStore';
import { useEffect } from 'react';

function PrivateRoute({ children }) {
  const { isAuthenticated, loadUser } = authStore();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />
        
        <Route path="/" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        
        <Route path="/2fa/setup" element={
          <PrivateRoute>
            <Setup2FA />
          </PrivateRoute>
        } />
        
        {/* Rota padrão: vai para login se não estiver logado */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
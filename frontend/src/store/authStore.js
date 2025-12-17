// src/store/authStore.js
import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const authStore = create((set) => ({
  user: null,
  token: localStorage.getItem('accessToken'),
  isAuthenticated: !!localStorage.getItem('accessToken'),

  login: async (email, password, totpToken) => {
    const res = await axios.post(`${API_URL}/auth/login`, { email, password, totpToken });
    const { accessToken, refreshToken, user } = res.data;

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);

    set({ user, token: accessToken, isAuthenticated: true });
  },

  oauthSuccess: (accessToken, refreshToken, user) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    set({ user, token: accessToken, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    set({ user: null, token: null, isAuthenticated: false });
  },

  loadUser: async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const res = await axios.get(`${API_URL}/auth/me`);
      set({ user: res.data.user, isAuthenticated: true });
    } catch (err) {
      localStorage.removeItem('accessToken');
      set({ isAuthenticated: false });
    }
  }
}));

export default authStore;
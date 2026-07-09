import { create } from 'zustand';
import { api } from '../utils/api';

const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,

  setUser: (user, token) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    set({ user, token, error: null });
  },

  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },

  register: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/auth/register', data);
      get().setUser(res.user, res.token);
      set({ loading: false });
      return res;
    } catch (err) {
      set({ loading: false, error: err.message });
      throw err;
    }
  },

  login: async (phone) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/auth/login', { phone });
      set({ loading: false });
      return res;
    } catch (err) {
      set({ loading: false, error: err.message });
      throw err;
    }
  },

  verifyOtp: async (phone, otp) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/auth/verify-otp', { phone, otp });
      get().setUser(res.user, res.token);
      set({ loading: false });
      return res;
    } catch (err) {
      set({ loading: false, error: err.message });
      throw err;
    }
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;

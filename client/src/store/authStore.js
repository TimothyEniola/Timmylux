import { create } from 'zustand';
import { apiRequest } from '../utils/api';
import { clearCurrentUser, setCurrentUser } from '../utils/userHelpers';

const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  // Called on app load to verify the HTTP-only cookie
  checkAuth: async () => {
    try {
      const response = await apiRequest('/auth/profile', { method: 'GET' });
      set({ user: response.data, isAuthenticated: true, isLoading: false });
      setCurrentUser(response.data); // Keep legacy helpers synced if needed
    } catch (error) {
      set({ user: null, isAuthenticated: false, isLoading: false });
      clearCurrentUser();
    }
  },

  login: async (email, password) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: { email, password }
    });
    set({ user: response.data, isAuthenticated: true });
    setCurrentUser(response.data);
    return response;
  },

  register: async (userData) => {
    return await apiRequest('/auth/register', {
      method: 'POST',
      body: userData
    });
  },

  verifyEmail: async (email, otp) => {
    return await apiRequest('/auth/verify-email', {
      method: 'POST',
      body: { email, otp }
    });
  },

  updateProfile: async (formData) => {
    const response = await apiRequest('/auth/profile', {
      method: 'PUT',
      body: formData
    });
    set({ user: response.data });
    setCurrentUser(response.data); // Keeps local storage synced for Navbar dropdowns
    return response;
  },

  logout: async () => {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
    } finally {
      set({ user: null, isAuthenticated: false });
      clearCurrentUser();
    }
  }
}));

export default useAuthStore;
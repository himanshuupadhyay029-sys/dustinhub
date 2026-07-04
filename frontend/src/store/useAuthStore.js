import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  token: localStorage.getItem('token') || null,
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
  isAuthenticated: !!localStorage.getItem('token'),
  isAdmin: localStorage.getItem('user') 
    ? JSON.parse(localStorage.getItem('user')).role === 'admin' 
    : false,
  
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),

  login: (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({
      token,
      user,
      isAuthenticated: true,
      isAdmin: user.role === 'admin',
    });
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({
      token: null,
      user: null,
      isAuthenticated: false,
      isAdmin: false,
    });
  }
}));

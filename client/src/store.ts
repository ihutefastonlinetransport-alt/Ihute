import { create } from 'zustand';

export interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
  type: 'admin' | 'driver' | 'passenger';
}

interface AppStore {
  user: User | null;
  token: string | null;
  language: string;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLanguage: (lang: string) => void;
  logout: () => void;
}

export const useAppStore = create<AppStore>((set) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  language: typeof window !== 'undefined' ? (localStorage.getItem('language') || 'en') : 'en',
  setUser: (user) => set({ user }),
  setToken: (token) => {
    if (typeof window !== 'undefined') {
      if (token) localStorage.setItem('token', token);
      else localStorage.removeItem('token');
    }
    set({ token });
  },
  setLanguage: (language) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('language', language);
      } catch (e) {}
    }
    set({ language });
  },
  logout: () => {
    if (typeof window !== 'undefined') localStorage.removeItem('token');
    set({ user: null, token: null });
  },
}));

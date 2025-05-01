import { create } from 'zustand';
import Cookies from 'js-cookie';

interface User {
  id: string;
  email: string;
  role: string;
  displayName?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

// LocalStorage'dan başlangıç durumunu al
const getInitialState = () => {
  if (typeof window === 'undefined') {
    return {
      isAuthenticated: false,
      user: null,
      token: null
    };
  }

  const storedToken = localStorage.getItem('token') || Cookies.get('token');
  const storedUser = localStorage.getItem('user');

  if (storedToken && storedUser) {
    try {
      const user = JSON.parse(storedUser);
      // E-posta adresinden kullanıcı adı oluştur
      if (!user.displayName && user.email) {
        user.displayName = user.email.split('@')[0];
      }
      return {
        isAuthenticated: true,
        user,
        token: storedToken
      };
    } catch (error) {
      console.error('Error parsing stored user:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      Cookies.remove('token');
    }
  }

  return {
    isAuthenticated: false,
    user: null,
    token: null
  };
};

const useAuthStore = create<AuthState>()((set) => ({
  ...getInitialState(),
  login: (user: User, token: string) => {
    if (!user.displayName && user.email) {
      user.displayName = user.email.split('@')[0];
    }
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    Cookies.set('token', token, { expires: 7, path: '/' });
    set({ isAuthenticated: true, user, token });
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    Cookies.remove('token', { path: '/' });
    set({ isAuthenticated: false, user: null, token: null });
  },
  updateUser: (userData: Partial<User>) => {
    set((state) => {
      if (!state.user) return state;
      const updatedUser = { ...state.user, ...userData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return { ...state, user: updatedUser };
    });
  }
}));

export const useAuth = () => {
  const store = useAuthStore();
  return store;
}; 
import api from './api';

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'student';
  firstName?: string;
  lastName?: string;
  birthDate?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  _id: string;
  username: string;
  email: string;
  role: string;
  token: string;
  studentInfo?: {
    firstName: string;
    lastName: string;
    birthDate: string;
  };
}

const authService = {
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/register', data);
      const responseData = response as unknown as AuthResponse;
      if (responseData && responseData.token) {
        localStorage.setItem('user', JSON.stringify(responseData));
        localStorage.setItem('token', responseData.token);
      }
      return responseData;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },

  async login(data: LoginData): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/login', data);
      const responseData = response as unknown as AuthResponse;
      if (responseData && responseData.token) {
        localStorage.setItem('user', JSON.stringify(responseData));
        localStorage.setItem('token', responseData.token);
      }
      return responseData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  },

  getCurrentUser(): AuthResponse | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },

  async getMe(): Promise<AuthResponse> {
    const response = await api.get<AuthResponse>('/auth/me');
    return response as unknown as AuthResponse;
  },
};

export default authService; 
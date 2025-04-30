import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

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
    const response = await axios.post(`${API_URL}/auth/register`, data);
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/auth/login`, data);
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  logout(): void {
    localStorage.removeItem('user');
  },

  getCurrentUser(): AuthResponse | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },

  async getMe(): Promise<AuthResponse> {
    const user = this.getCurrentUser();
    if (!user) {
      throw new Error('Kullanıcı girişi yapılmamış');
    }

    const response = await axios.get(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    return response.data;
  },
};

export default authService; 
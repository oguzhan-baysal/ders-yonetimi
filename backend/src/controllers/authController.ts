import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import Student from '../models/Student';

// JWT Token oluşturma
const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET || '', {
    expiresIn: '30d',
  });
};

interface RegisterBody {
  username: string;
  email: string;
  password: string;
  role?: 'admin' | 'student';
  firstName?: string;
  lastName?: string;
  birthDate?: Date;
}

interface LoginBody {
  email: string;
  password: string;
}

// @desc    Kullanıcı kaydı
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password, role, firstName, lastName, birthDate } = req.body as RegisterBody;

    // Input validasyonu
    if (!username || !email || !password) {
      res.status(400).json({ message: 'Tüm alanları doldurunuz' });
      return;
    }

    // Email format kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ message: 'Geçerli bir email adresi giriniz' });
      return;
    }

    // Şifre uzunluk kontrolü
    if (password.length < 6) {
      res.status(400).json({ message: 'Şifre en az 6 karakter olmalıdır' });
      return;
    }

    // Role kontrolü
    if (role && !['admin', 'student'].includes(role)) {
      res.status(400).json({ message: 'Geçersiz rol' });
      return;
    }

    // Kullanıcı kontrolü
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      if (userExists.email === email) {
        res.status(400).json({ message: 'Bu email adresi zaten kayıtlı' });
        return;
      }
      res.status(400).json({ message: 'Bu kullanıcı adı zaten kayıtlı' });
      return;
    }

    // Kullanıcı oluşturma
    const user = await User.create({
      username,
      email,
      password,
      role: role || 'student'
    });

    // Öğrenci ise öğrenci kaydı oluştur
    if (role === 'student') {
      if (!firstName || !lastName) {
        await User.findByIdAndDelete(user._id);
        res.status(400).json({ message: 'Öğrenci kaydı için isim ve soyisim gereklidir' });
        return;
      }

      await Student.create({
        userId: user._id,
        firstName,
        lastName,
        birthDate
      });
    }

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ 
      message: 'Kayıt işlemi başarısız', 
      error: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'Unknown error' : undefined 
    });
  }
};

// @desc    Kullanıcı girişi
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as LoginBody;

    // Input validasyonu
    if (!email || !password) {
      res.status(400).json({ message: 'Email ve şifre zorunludur' });
      return;
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.status(401).json({ message: 'Geçersiz email veya şifre' });
      return;
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      res.status(401).json({ message: 'Geçersiz email veya şifre' });
      return;
    }

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ 
      message: 'Giriş işlemi başarısız',
      error: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'Unknown error' : undefined 
    });
  }
};

// @desc    Kullanıcı bilgilerini getir
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id).select('-password');
    
    if (!user) {
      res.status(404).json({ message: 'Kullanıcı bulunamadı' });
      return;
    }

    if (user.role === 'student') {
      const student = await Student.findOne({ userId: user._id });
      if (!student) {
        res.status(404).json({ message: 'Öğrenci bilgileri bulunamadı' });
        return;
      }
      res.json({ ...user.toObject(), studentInfo: student });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error('GetMe Error:', error);
    res.status(500).json({ 
      message: 'Kullanıcı bilgileri alınamadı',
      error: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'Unknown error' : undefined 
    });
  }
};

// @desc    Kullanıcı çıkışı
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    res.json({ message: 'Başarıyla çıkış yapıldı' });
  } catch (error) {
    console.error('Logout Error:', error);
    res.status(500).json({ 
      message: 'Çıkış işlemi başarısız',
      error: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'Unknown error' : undefined 
    });
  }
}; 
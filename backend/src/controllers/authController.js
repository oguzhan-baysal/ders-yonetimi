const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Student = require('../models/Student');

// JWT Token oluşturma
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Kullanıcı kaydı
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { username, email, password, role, firstName, lastName, birthDate } = req.body;

    // Input validasyonu
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Tüm alanları doldurunuz' });
    }

    // Email format kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Geçerli bir email adresi giriniz' });
    }

    // Şifre uzunluk kontrolü
    if (password.length < 6) {
      return res.status(400).json({ message: 'Şifre en az 6 karakter olmalıdır' });
    }

    // Role kontrolü
    if (role && !['admin', 'student'].includes(role)) {
      return res.status(400).json({ message: 'Geçersiz rol' });
    }

    // Kullanıcı kontrolü
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      if (userExists.email === email) {
        return res.status(400).json({ message: 'Bu email adresi zaten kayıtlı' });
      }
      return res.status(400).json({ message: 'Bu kullanıcı adı zaten kayıtlı' });
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
        return res.status(400).json({ message: 'Öğrenci kaydı için isim ve soyisim gereklidir' });
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
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
};

// @desc    Kullanıcı girişi
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validasyonu
    if (!email || !password) {
      return res.status(400).json({ message: 'Email ve şifre zorunludur' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Geçersiz email veya şifre' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Geçersiz email veya şifre' });
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
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
};

// @desc    Kullanıcı bilgilerini getir
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    if (user.role === 'student') {
      const student = await Student.findOne({ userId: user._id });
      if (!student) {
        return res.status(404).json({ message: 'Öğrenci bilgileri bulunamadı' });
      }
      return res.json({ ...user.toObject(), studentInfo: student });
    }

    res.json(user);
  } catch (error) {
    console.error('GetMe Error:', error);
    res.status(500).json({ 
      message: 'Kullanıcı bilgileri alınamadı',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
};

module.exports = {
  register,
  login,
  getMe
}; 
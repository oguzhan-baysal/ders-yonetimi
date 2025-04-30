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

    // Kullanıcı kontrolü
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: 'Bu email veya kullanıcı adı zaten kayıtlı' });
    }

    // Kullanıcı oluşturma
    const user = await User.create({
      username,
      email,
      password,
      role
    });

    // Öğrenci ise öğrenci kaydı oluştur
    if (role === 'student') {
      await Student.create({
        userId: user._id,
        firstName,
        lastName,
        birthDate
      });
    }

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// @desc    Kullanıcı girişi
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Geçersiz email veya şifre' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// @desc    Kullanıcı bilgilerini getir
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (user.role === 'student') {
      const student = await Student.findOne({ userId: user._id });
      res.json({ ...user.toObject(), studentInfo: student });
    } else {
      res.json(user);
    }
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

module.exports = {
  register,
  login,
  getMe
}; 
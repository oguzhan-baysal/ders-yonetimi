const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { body } = require('express-validator');
const validate = require('../middleware/validate');

// Validasyon kuralları
const registerValidation = [
  body('username').trim().notEmpty().withMessage('Kullanıcı adı zorunludur'),
  body('email').isEmail().withMessage('Geçerli bir email adresi giriniz'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Şifre en az 6 karakter olmalıdır'),
  body('role').isIn(['admin', 'student']).withMessage('Geçersiz rol'),
  body('firstName').if(body('role').equals('student')).notEmpty().withMessage('İsim zorunludur'),
  body('lastName').if(body('role').equals('student')).notEmpty().withMessage('Soyisim zorunludur'),
  body('birthDate').if(body('role').equals('student')).isISO8601().withMessage('Geçerli bir tarih giriniz')
];

const loginValidation = [
  body('email').isEmail().withMessage('Geçerli bir email adresi giriniz'),
  body('password').notEmpty().withMessage('Şifre zorunludur')
];

router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.get('/me', protect, getMe);

module.exports = router; 
import express from 'express';
import { register, login, logout, getMe } from '../controllers/authController';
import { protect } from '../middleware/auth';
import { body } from 'express-validator';
import { validate } from '../middleware/validate';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: Kullanıcı adı
 *         email:
 *           type: string
 *           format: email
 *           description: E-posta adresi
 *         password:
 *           type: string
 *           format: password
 *           description: Şifre
 *         role:
 *           type: string
 *           enum: [admin, student]
 *           description: Kullanıcı rolü
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Yeni kullanıcı kaydı
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [admin, student]
 *     responses:
 *       201:
 *         description: Kullanıcı başarıyla oluşturuldu
 *       400:
 *         description: Geçersiz girdi
 */

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

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Kullanıcı girişi
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Giriş başarılı
 *       401:
 *         description: Geçersiz kimlik bilgileri
 */
router.post('/login', loginValidation, validate, login);

router.post('/logout', logout);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Mevcut kullanıcı bilgilerini getir
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Kullanıcı bilgileri başarıyla getirildi
 *       401:
 *         description: Yetkilendirme başarısız
 */
router.get('/me', protect, getMe);

export default router; 
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../app';
import User from '../models/User';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
    // Mevcut bağlantıyı kapat
    await mongoose.disconnect();

    // In-memory MongoDB sunucusu başlat
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

beforeEach(async () => {
    // Her testten önce koleksiyonları temizle
    await User.deleteMany({});
});

describe('Auth API Tests', () => {
    describe('POST /api/auth/register', () => {
        it('should register a new student successfully', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'testuser',
                    email: 'test@example.com',
                    password: 'password123',
                    role: 'student',
                    firstName: 'Test',
                    lastName: 'User',
                    birthDate: '2000-01-01'
                });

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('token');
            expect(res.body.email).toBe('test@example.com');
            expect(res.body.role).toBe('student');
        });

        it('should not register with existing email', async () => {
            // İlk kullanıcıyı oluştur
            await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'testuser1',
                    email: 'test@example.com',
                    password: 'password123',
                    role: 'student',
                    firstName: 'Test',
                    lastName: 'User',
                    birthDate: '2000-01-01'
                });

            // Aynı email ile tekrar kayıt dene
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'testuser2',
                    email: 'test@example.com',
                    password: 'password123',
                    role: 'student',
                    firstName: 'Test',
                    lastName: 'User',
                    birthDate: '2000-01-01'
                });

            expect(res.status).toBe(400);
            expect(res.body.message).toContain('email adresi zaten kayıtlı');
        });
    });

    describe('POST /api/auth/login', () => {
        beforeEach(async () => {
            // Test için kullanıcı oluştur
            await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'testuser',
                    email: 'test@example.com',
                    password: 'password123',
                    role: 'student',
                    firstName: 'Test',
                    lastName: 'User',
                    birthDate: '2000-01-01'
                });
        });

        it('should login successfully with correct credentials', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'password123'
                });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('token');
            expect(res.body.email).toBe('test@example.com');
        });

        it('should not login with incorrect password', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'wrongpassword'
                });

            expect(res.status).toBe(401);
            expect(res.body.message).toContain('Geçersiz email veya şifre');
        });
    });
}); 
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../app';
import Course from '../models/Course';
import User from '../models/User';

let mongoServer: MongoMemoryServer;
let adminToken: string;

beforeAll(async () => {
    // Mevcut bağlantıyı kapat
    await mongoose.disconnect();

    // In-memory MongoDB sunucusu başlat
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);

    // Admin kullanıcısı oluştur
    const adminUser = await User.create({
        username: 'admin',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin'
    });

    // Admin token al
    const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
            email: 'admin@example.com',
            password: 'admin123'
        });

    adminToken = loginRes.body.token;
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

beforeEach(async () => {
    await Course.deleteMany({});
});

describe('Courses API Tests', () => {
    describe('POST /api/courses', () => {
        it('should create a new course when admin', async () => {
            const courseData = {
                code: '101',
                name: 'Test Course',
                description: 'Test Description',
                credits: 3,
                department: 'Test Department',
                semester: '1',
                instructor: 'Test Instructor',
                capacity: 30
            };

            const res = await request(app)
                .post('/api/courses')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(courseData);

            expect(res.status).toBe(201);
            expect(res.body.name).toBe(courseData.name);
            expect(res.body.code).toBe(courseData.code);
        });

        it('should not create course without admin token', async () => {
            const courseData = {
                code: '101',
                name: 'Test Course',
                description: 'Test Description',
                credits: 3,
                department: 'Test Department',
                semester: '1',
                instructor: 'Test Instructor',
                capacity: 30
            };

            const res = await request(app)
                .post('/api/courses')
                .send(courseData);

            expect(res.status).toBe(401);
        });
    });

    describe('GET /api/courses', () => {
        beforeEach(async () => {
            // Test için kurs oluştur
            await Course.create({
                code: '101',
                name: 'Test Course',
                description: 'Test Description',
                credits: 3,
                department: 'Test Department',
                semester: '1',
                instructor: 'Test Instructor',
                capacity: 30
            });
        });

        it('should return list of courses', async () => {
            const res = await request(app)
                .get('/api/courses')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body.courses)).toBeTruthy();
            expect(res.body.courses.length).toBe(1);
            expect(res.body.courses[0].name).toBe('Test Course');
        });

        it('should return courses with pagination', async () => {
            // İkinci bir kurs ekle
            await Course.create({
                code: '102',
                name: 'Test Course 2',
                description: 'Test Description 2',
                credits: 3,
                department: 'Test Department',
                semester: '1',
                instructor: 'Test Instructor',
                capacity: 30
            });

            const res = await request(app)
                .get('/api/courses')
                .query({ page: 1, limit: 1 })
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.status).toBe(200);
            expect(res.body.courses.length).toBe(1);
            expect(res.body.total).toBe(2);
            expect(res.body.pages).toBe(2);
        });
    });
}); 
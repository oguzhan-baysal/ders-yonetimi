import dotenv from 'dotenv';

// Test ortamı için environment değişkenlerini yükle
dotenv.config({ path: '.env.test' });

// Test timeout süresini artır
jest.setTimeout(30000); 
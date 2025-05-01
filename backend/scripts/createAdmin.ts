import mongoose from 'mongoose';
import User from '../src/models/User';
import dotenv from 'dotenv';

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ders-yonetimi');
    
    const adminData = {
      username: 'admin',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin'
    };

    // Önce mevcut admin kontrolü
    const existingAdmin = await User.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log('Admin kullanıcısı zaten mevcut!');
      await mongoose.disconnect();
      return;
    }

    // Admin oluştur
    const admin = await User.create(adminData);
    console.log('Admin kullanıcısı başarıyla oluşturuldu:', admin);

    await mongoose.disconnect();
  } catch (error) {
    console.error('Admin oluşturma hatası:', error);
    process.exit(1);
  }
};

createAdmin(); 
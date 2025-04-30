import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || '');
    console.log(`MongoDB Bağlantısı Başarılı: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB Bağlantı Hatası:', error);
    process.exit(1);
  }
}; 
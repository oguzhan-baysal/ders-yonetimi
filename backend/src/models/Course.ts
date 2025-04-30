import mongoose, { Document, Model } from 'mongoose';

export interface ICourse extends Document {
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ICourseModel extends Model<ICourse> {
  // Model statik metodları buraya eklenebilir
}

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Ders adı zorunludur'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Ders açıklaması zorunludur']
  }
}, {
  timestamps: true
});

const Course = mongoose.model<ICourse, ICourseModel>('Course', courseSchema);

export default Course; 
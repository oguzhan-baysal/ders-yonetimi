import mongoose, { Document, Model } from 'mongoose';
import { IUser } from './User';

export interface IStudent extends Document {
  userId: IUser['_id'];
  firstName: string;
  lastName: string;
  birthDate: Date;
  fullName: string;
  createdAt: Date;
  updatedAt: Date;
}

interface IStudentModel extends Model<IStudent> {
  // Model statik metodları buraya eklenebilir
}

const studentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  firstName: {
    type: String,
    required: [true, 'İsim zorunludur'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Soyisim zorunludur'],
    trim: true
  },
  birthDate: {
    type: Date,
    required: [true, 'Doğum tarihi zorunludur']
  }
}, {
  timestamps: true
});

// Tam isim için virtual field
studentSchema.virtual('fullName').get(function(this: IStudent): string {
  return `${this.firstName} ${this.lastName}`;
});

// JSON dönüşlerinde virtual'ları dahil et
studentSchema.set('toJSON', { virtuals: true });
studentSchema.set('toObject', { virtuals: true });

const Student = mongoose.model<IStudent, IStudentModel>('Student', studentSchema);

export default Student; 
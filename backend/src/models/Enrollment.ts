import mongoose, { Document, Model } from 'mongoose';
import { IStudent } from './Student';
import { ICourse } from './Course';

export interface IEnrollment extends Document {
  studentId: IStudent['_id'];
  courseId: ICourse['_id'];
  enrollmentDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface IEnrollmentModel extends Model<IEnrollment> {
  // Model statik metodları buraya eklenebilir
}

const enrollmentSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  enrollmentDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Aynı öğrencinin aynı derse tekrar kaydını engelle
enrollmentSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

const Enrollment = mongoose.model<IEnrollment, IEnrollmentModel>('Enrollment', enrollmentSchema);

export default Enrollment; 
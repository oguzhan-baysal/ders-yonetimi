import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ICourse extends Document {
  code: string;
  name: string;
  description: string;
  credits: number;
  department?: string;
  semester?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICourseModel extends Model<ICourse> {
  // Model statik metodları buraya eklenebilir
}

const courseSchema = new Schema<ICourse>(
  {
    code: {
      type: String,
      required: [true, 'Ders kodu zorunludur'],
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Ders adı zorunludur'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Ders açıklaması zorunludur'],
    },
    credits: {
      type: Number,
      required: [true, 'Ders kredisi zorunludur'],
      min: [1, 'Ders kredisi en az 1 olmalıdır'],
      max: [30, 'Ders kredisi en fazla 30 olabilir'],
    },
    department: {
      type: String,
      trim: true,
    },
    semester: {
      type: String,
      enum: ['1', '2', '3', '4', '5', '6', '7', '8'],
    },
  },
  {
    timestamps: true,
  }
);

// Ders kodunun benzersiz olmasını sağla
courseSchema.index({ code: 1 }, { unique: true });

const Course = mongoose.model<ICourse, ICourseModel>('Course', courseSchema);

export default Course; 
import mongoose, { Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'student';
  matchPassword(enteredPassword: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}

interface IUserModel extends Model<IUser> {
  // Model statik metodları buraya eklenebilir
}

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Kullanıcı adı zorunludur'],
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email adresi zorunludur'],
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Geçerli bir email adresi giriniz']
  },
  password: {
    type: String,
    required: [true, 'Şifre zorunludur'],
    minlength: [6, 'Şifre en az 6 karakter olmalıdır']
  },
  role: {
    type: String,
    enum: ['admin', 'student'],
    default: 'student'
  }
}, {
  timestamps: true
});

// Şifre hashleme middleware
userSchema.pre('save', async function(this: IUser, next) {
  if (!this.isModified('password')) {
    next();
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Şifre karşılaştırma metodu
userSchema.methods.matchPassword = async function(this: IUser, enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model<IUser, IUserModel>('User', userSchema);

export default User; 
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import Student from '../models/Student';

// Request tipini genişlet
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let token;

    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      res.status(401).json({ message: 'Yetkilendirme başarısız' });
      return;
    }

    // Token'ı doğrula
    const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as { id: string };

    // Kullanıcıyı bul ve studentId'yi populate et
    const user = await User.findById(decoded.id).populate('studentId');

    if (!user) {
      res.status(401).json({ message: 'Kullanıcı bulunamadı' });
      return;
    }

    // Eğer kullanıcı öğrenci ise ve studentId yoksa, Student koleksiyonundan bul
    if (user.role === 'student' && !user.studentId) {
      const student = await Student.findOne({ userId: user._id });
      if (student) {
        await User.findByIdAndUpdate(user._id, { studentId: student._id });
        user.studentId = student._id;
      }
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      message: 'Yetkilendirme başarısız',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ message: 'Yetkilendirme başarısız' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        message: 'Bu işlem için yetkiniz yok'
      });
      return;
    }
    next();
  };
}; 
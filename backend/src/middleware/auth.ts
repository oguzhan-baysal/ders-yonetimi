import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IUser } from '../models/User';
import User from '../models/User';

// Request tipini genişlet
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token: string | undefined;

  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      // Token'ı al
      token = req.headers.authorization.split(' ')[1];

      // Token'ı doğrula
      const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as jwt.JwtPayload;

      // Kullanıcıyı bul ve request'e ekle (şifre hariç)
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        res.status(401).json({ message: 'Kullanıcı bulunamadı' });
        return;
      }
      req.user = user as IUser;

      next();
    } catch (error) {
      res.status(401).json({ message: 'Yetkilendirme başarısız' });
      return;
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Token bulunamadı' });
    return;
  }
};

export const authorize = (role: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (req.user && req.user.role === role) {
      next();
    } else {
      res.status(403).json({ message: `Bu işlem için ${role} yetkisi gereklidir` });
    }
  };
}; 
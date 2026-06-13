import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

export interface AuthRequest extends Request {
  user?: IUser;
}

export async function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Missing authorization token' });
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT secret not configured');

    const payload = jwt.verify(token, secret) as { userId: string };
    const user = await User.findById(payload.userId);
    if (!user || !user.active) {
      return res.status(401).json({ message: 'User not found or inactive' });
    }

    req.user = user as IUser;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token', error: error instanceof Error ? error.message : undefined });
  }
}

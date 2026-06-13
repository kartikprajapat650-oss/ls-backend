import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';

export function requireRole(role: 'super-admin' | 'sub-admin') {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    if (req.user.role !== role) {
      return res.status(403).json({ message: 'Forbidden: insufficient role' });
    }
    next();
  };
}

export function requirePermission(permissionKey: string) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    if (req.user.role === 'super-admin') {
      return next();
    }
    if (!req.user.permissions.includes(permissionKey)) {
      return res.status(403).json({ message: 'Forbidden: permission required' });
    }
    next();
  };
}

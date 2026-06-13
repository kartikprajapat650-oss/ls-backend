import jwt from 'jsonwebtoken';

interface TokenPayload {
  userId: string;
}

export function signToken(payload: TokenPayload) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not configured');
  return jwt.sign(payload, secret, { expiresIn: '4h' });
}

export function verifyToken(token: string) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not configured');
  return jwt.verify(token, secret) as TokenPayload;
}

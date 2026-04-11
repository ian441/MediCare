import jwt from 'jsonwebtoken';
import { AppError } from '@/middleware/errorHandler';

export const generateToken = (
  payload: any,
  expiresIn: string = process.env.JWT_EXPIRY || '24h',
): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new AppError('JWT_SECRET not configured', 500);
  }

  return jwt.sign(payload, secret, { expiresIn });
};

export const generateRefreshToken = (
  payload: any,
  expiresIn: string = process.env.JWT_REFRESH_EXPIRY || '7d',
): string => {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) {
    throw new AppError('JWT_REFRESH_SECRET not configured', 500);
  }

  return jwt.sign(payload, secret, { expiresIn });
};

export const verifyToken = (token: string): any => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new AppError('JWT_SECRET not configured', 500);
  }

  try {
    return jwt.verify(token, secret);
  } catch (error) {
    throw new AppError('Invalid or expired token', 401);
  }
};

export const verifyRefreshToken = (token: string): any => {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) {
    throw new AppError('JWT_REFRESH_SECRET not configured', 500);
  }

  try {
    return jwt.verify(token, secret);
  } catch (error) {
    throw new AppError('Invalid or expired refresh token', 401);
  }
};

export const decodeToken = (token: string): any => {
  return jwt.decode(token);
};

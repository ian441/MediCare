import prisma from '@/config/database';
import { logger } from '@/config/logger';
import { AppError } from '@/middleware/errorHandler';
import userRepository from '@/repositories/user.repository';
import { hashPassword, comparePassword } from '@/utils/password';
import {
  generateToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '@/utils/jwt';

class AuthService {
  async registerUser(data: {
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    password: string;
    role: string;
  }) {
    try {
      // Check if user exists
      const existingUser = await userRepository.findByEmail(data.email);
      if (existingUser) {
        throw new AppError('User with this email already exists', 409);
      }

      // Hash password
      const passwordHash = await hashPassword(data.password);

      // Create user record
      const user = await userRepository.create({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        passwordHash,
        role: data.role,
      });

      // Generate tokens
      const token = generateToken({
        sub: user.id,
        email: user.email,
        role: user.role,
      });

      const refreshToken = generateRefreshToken({
        sub: user.id,
        email: user.email,
      });

      logger.info('User registered successfully', { userId: user.id });

      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        token,
        refreshToken,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Registration service error:', error);
      throw new AppError('Registration failed', 500);
    }
  }

  async loginUser(email: string, password: string) {
    try {
      // Find user by email
      const user = await userRepository.findByEmail(email);
      if (!user) {
        throw new AppError('Invalid email or password', 401);
      }

      // Check if user is active
      if (user.status !== 'ACTIVE') {
        throw new AppError('User account is not active', 403);
      }

      // Verify password
      const isPasswordValid = await comparePassword(password, user.passwordHash);
      if (!isPasswordValid) {
        throw new AppError('Invalid email or password', 401);
      }

      // Generate tokens
      const token = generateToken({
        sub: user.id,
        email: user.email,
        role: user.role,
      });

      const refreshToken = generateRefreshToken({
        sub: user.id,
        email: user.email,
      });

      logger.info('User logged in successfully', { userId: user.id });

      return {
        token,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Login service error:', error);
      throw new AppError('Login failed', 500);
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      // Verify refresh token
      const decoded = verifyRefreshToken(refreshToken);

      // Find user
      const user = await userRepository.findById(decoded.sub);
      if (!user || user.status !== 'ACTIVE') {
        throw new AppError('User not found or inactive', 401);
      }

      // Generate new token
      const newToken = generateToken({
        sub: user.id,
        email: user.email,
        role: user.role,
      });

      logger.info('Token refreshed', { userId: user.id });

      return {
        token: newToken,
        refreshToken, // Keep same refresh token (optional: rotate with new one)
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Token refresh service error:', error);
      throw new AppError('Token refresh failed', 500);
    }
  }
}

export default new AuthService();

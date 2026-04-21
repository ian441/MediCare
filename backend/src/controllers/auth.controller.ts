import { Request, Response } from 'express';
import { AppError } from '@/middleware/errorHandler';
import { logger } from '@/config/logger';
import authService from '@/services/auth.service';

class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { email, password, firstName, lastName, phoneNumber } = req.body;

      // Validation
      if (!email || !password || !firstName || !lastName) {
        throw new AppError('Missing required fields', 422);
      }

      // Call service layer
      const result = await authService.registerUser({
        email,
        firstName,
        lastName,
        phoneNumber,
        password,
        role: 'PATIENT',
      });

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result,
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Registration error:', error);
      throw new AppError('Registration failed', 500);
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new AppError('Email and password required', 422);
      }

      // Call service layer
      const result = await authService.loginUser(email, password);

      res.status(200).json({
        success: true,
        message: 'Logged in successfully',
        data: result,
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Login error:', error);
      throw new AppError('Login failed', 500);
    }
  }

  async logout(req: Request, res: Response) {
    try {
      // TODO: Implement logout (invalidate token in Redis)
      res.status(204).send();
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Logout error:', error);
      throw new AppError('Logout failed', 500);
    }
  }

  async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        throw new AppError('Refresh token required', 422);
      }

      // Call service layer
      const result = await authService.refreshToken(refreshToken);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Refresh token error:', error);
      throw new AppError('Token refresh failed', 500);
    }
  }
}

export default new AuthController();

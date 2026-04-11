import { Request, Response, NextFunction } from 'express';
import { logger } from '@/config/logger';

class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: 'APP_ERROR',
        message: err.message,
      },
      statusCode: err.statusCode,
    });
  }

  // Prisma errors
  if (err.name === 'PrismaClientKnownRequestError') {
    logger.error('Database error:', err);
    return res.status(400).json({
      success: false,
      error: {
        code: 'DB_ERROR',
        message: 'Database operation failed',
      },
      statusCode: 400,
    });
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(422).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: err.message,
      },
      statusCode: 422,
    });
  }

  // Default error
  logger.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: process.env.NODE_ENV === 'production'
        ? 'Something went wrong'
        : err.message,
    },
    statusCode: 500,
  });
};

export { AppError };

import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { AppError } from '@/middleware/errorHandler';

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(
      {
        body: req.body,
        query: req.query,
        params: req.params,
      },
      {
        abortEarly: false,
        stripUnknown: true,
      },
    );

    if (error) {
      const errorMessage = error.details
        .map((detail) => `${detail.path.join('.')}: ${detail.message}`)
        .join(', ');
      throw new AppError(errorMessage, 422);
    }

    req.body = value.body || req.body;
    req.query = value.query || req.query;
    req.params = value.params || req.params;

    next();
  };
};

// Common validation schemas
export const schemas = {
  uuidParam: Joi.object({
    params: Joi.object({
      id: Joi.string().uuid().required(),
    }),
  }),

  pagination: Joi.object({
    query: Joi.object({
      limit: Joi.number().min(1).max(100).default(20),
      offset: Joi.number().min(0).default(0),
    }),
  }),
};

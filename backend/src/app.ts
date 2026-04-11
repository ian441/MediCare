import express, { Express, Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import rateLimit, { RateLimitRequestHandler } from 'express-rate-limit';
import { errorHandler } from '@/middleware/errorHandler';
import { logger } from '@/config/logger';
import authRoutes from '@/routes/auth.routes';

const app: Express = express();

// ============ SECURITY MIDDLEWARE ============

// Helmet for security headers
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  credentials: true,
  optionsSuccessStatus: 200,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again later.',
});

app.use('/api/', limiter);

// ============ BODY PARSING MIDDLEWARE ============

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ============ COMPRESSION ============

app.use(compression());

// ============ REQUEST LOGGING ============

app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info({
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
    });
  });
  
  next();
});

// ============ HEALTH CHECK ============

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ============ API ROUTES ============

app.use('/api/v1/auth', authRoutes);

// API root endpoint
app.get('/api/v1', (req: Request, res: Response) => {
  res.status(200).json({
    message: '🏥 MediCare Clinic API v1',
    version: process.env.APP_VERSION || '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
  });
});

// ============ 404 HANDLER ============

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found`,
    },
  });
});

// ============ ERROR HANDLER ============

app.use(errorHandler);

export default app;

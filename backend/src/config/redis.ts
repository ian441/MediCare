import Redis from 'ioredis';
import { logger } from '@/config/logger';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB || '0'),
  retryStrategy: (times: number) => Math.min(times * 50, 2000),
});

redis.on('connect', () => {
  logger.info('✅ Redis connected');
});

redis.on('error', (err: Error) => {
  logger.error('❌ Redis connection error:', err.message);
});

redis.on('disconnect', () => {
  logger.warn('⚠️ Redis disconnected');
});

redis.on('reconnecting', () => {
  logger.info('🔄 Redis reconnecting...');
});

export default redis;

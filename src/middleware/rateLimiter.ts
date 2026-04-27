import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';


export const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 15 minutes
  max: 2, // max 100 requests per IP
  standardHeaders: true,
  legacyHeaders: false,

  message: {
    error: 'Too many requests, please try again later.',
  },
});
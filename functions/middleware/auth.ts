import { Request, Response, NextFunction } from 'express';
import { HttpException } from '../../src/utils/exceptions';
import HttpStatus from '../../src/utils/httpStatus';

const API_KEYS = process.env.API_KEYS?.split(',') || [];

export const validateApiKey = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.header('X-API-Key');

  if (!apiKey) {
    throw new HttpException(
      HttpStatus.UNAUTHORIZED,
      'API key is missing'
    );
  }

  if (!API_KEYS.includes(apiKey)) {
    throw new HttpException(
      HttpStatus.UNAUTHORIZED,
      'Invalid API key'
    );
  }

  next();
};

export const rateLimiter = (req: Request, res: Response, next: NextFunction) => {
  // Simple in-memory rate limiting
  const apiKey = req.header('X-API-Key');
  const requestCount = requestMap.get(apiKey!) || 0;
  
  if (requestCount >= RATE_LIMIT) {
    throw new HttpException(
      HttpStatus.TOO_MANY_REQUESTS,
      'Rate limit exceeded. Please try again later.'
    );
  }

  requestMap.set(apiKey!, requestCount + 1);
  setTimeout(() => {
    requestMap.set(apiKey!, (requestMap.get(apiKey!) || 1) - 1);
  }, RATE_WINDOW);

  next();
};

// Rate limiting configuration
const RATE_LIMIT = 100; // requests
const RATE_WINDOW = 60 * 1000; // 1 minute
const requestMap = new Map<string, number>();

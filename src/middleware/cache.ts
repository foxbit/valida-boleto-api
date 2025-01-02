import NodeCache from 'node-cache';
import { Request, Response, NextFunction } from 'express';

const cache = new NodeCache({ stdTTL: 600 }); // 10 minutes

export const cacheMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const key = req.originalUrl;
  const cachedResponse = cache.get(key);

  if (cachedResponse) {
    return res.json(cachedResponse);
  }

  const originalJson = res.json;
  res.json = function(body) {
    cache.set(key, body);
    return originalJson.call(this, body);
  };

  next();
};

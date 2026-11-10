import type { Request, Response, NextFunction } from 'express';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const mulai = Date.now();

  res.on('finish', () => {
    const durasi = Date.now() - mulai;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} - ${durasi}ms`);
  });

  next();
};
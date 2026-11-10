import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import path from 'path';
import reviewsRouter from './routes/reviews.routes';
import { requestLogger } from './middleware/request-logger';

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'front-end')));
app.use(requestLogger);
app.use('/reviews', reviewsRouter);

app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: 'Route tidak ditemukan.' });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
});

export default app;
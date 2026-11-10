import type { Request, Response } from 'express';
import type { Review } from '../generated/prisma/client';
import { prisma } from '../lib/prisma';
import { GENRE } from '../data/reviews';

const validasi = (body: any): string | null => {
  const { judul, tipe, genre, rating, ulasan, tanggal_nonton } = body ?? {};

  if (typeof judul !== 'string' || judul.trim() === '') return 'Judul wajib diisi.';

  if (!['film', 'series'].includes(tipe)) return 'Tipe harus di antara film atau series.';

  if (!GENRE.includes(genre)) return 'Genre yang tersedia hanya Horror, Komedi, Romantis, Action, Drama, Thriller.';

  if (typeof rating !== 'number' || rating < 0.5 || rating > 5 || !Number.isInteger(rating * 2)) {
    return 'Rating harus kelipatan 0.5 antara 0.5 dan 5.';
  }

  if (typeof ulasan !== 'string' || ulasan.trim() === '' || ulasan.length > 300) {
    return 'Ulasan tidak boleh kosong dan maksimal 300 karakter.';
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(tanggal_nonton)) || Number.isNaN(Date.parse(String(tanggal_nonton)))) {
    return 'Tanggal menonton harus berformat yyyy-mm-dd dan berupa tanggal yang valid.';
  }

  return null;
};

const keluar = (r: Review) => ({
  ...r,
  tanggal_nonton: r.tanggal_nonton.toISOString().slice(0, 10),
});

const ambilId = (req: Request): number | null => {
  const id = Number(req.params.id);
  return Number.isInteger(id) ? id : null;
};

export const getAllReviews = async (_req: Request, res: Response) => {
  const data = await prisma.review.findMany({ orderBy: { id: 'asc' } });
  res.status(200).json(data.map(keluar));
};

export const getReviewById = async (req: Request, res: Response) => {
  const id = ambilId(req);
  const review = id === null ? null : await prisma.review.findUnique({ where: { id } });

  if (!review) {
    res.status(404).json({ message: 'Review tidak ditemukan.' });
    return;
  }

  res.status(200).json(keluar(review));
};

export const createReview = async (req: Request, res: Response) => {
  const error = validasi(req.body);
  if (error) {
    res.status(400).json({ message: error });
    return;
  }

  const { judul, tipe, genre, rating, ulasan, tanggal_nonton, poster } = req.body;

  const reviewBaru = await prisma.review.create({
    data: {
      judul: judul.trim(),
      tipe,
      genre,
      rating,
      ulasan: ulasan.trim(),
      tanggal_nonton: new Date(tanggal_nonton),
      poster: typeof poster === 'string' ? poster.trim() : '',
    },
  });

  res.status(201).json(keluar(reviewBaru));
};

export const updateReview = async (req: Request, res: Response) => {
  const id = ambilId(req);
  const ada = id === null ? null : await prisma.review.findUnique({ where: { id } });

  if (id === null || !ada) {
    res.status(404).json({ message: 'Review tidak ditemukan.' });
    return;
  }

  const error = validasi(req.body);
  if (error) {
    res.status(400).json({ message: error });
    return;
  }

  const { judul, tipe, genre, rating, ulasan, tanggal_nonton, poster } = req.body;

  const diperbarui = await prisma.review.update({
    where: { id },
    data: {
      judul: judul.trim(),
      tipe,
      genre,
      rating,
      ulasan: ulasan.trim(),
      tanggal_nonton: new Date(tanggal_nonton),
      poster: typeof poster === 'string' ? poster.trim() : ada.poster,
    },
  });

  res.status(200).json(keluar(diperbarui));
};

export const deleteReview = async (req: Request, res: Response) => {
  const id = ambilId(req);
  const ada = id === null ? null : await prisma.review.findUnique({ where: { id } });

  if (id === null || !ada) {
    res.status(404).json({ message: 'Review tidak ditemukan.' });
    return;
  }

  await prisma.review.delete({ where: { id } });

  res.status(200).json({ message: 'Review berhasil dihapus.' });
};
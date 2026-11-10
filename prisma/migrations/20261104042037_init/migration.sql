-- CreateTable
CREATE TABLE "reviews" (
    "id" SERIAL NOT NULL,
    "judul" TEXT NOT NULL,
    "tipe" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "ulasan" TEXT NOT NULL,
    "tanggal_nonton" DATE NOT NULL,
    "poster" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

export const GENRE = ['Horror', 'Komedi', 'Romantis', 'Action', 'Drama', 'Thriller'] as const;
export type Genre = (typeof GENRE)[number];
export type Tipe = 'film' | 'series';

export const dataAwal = [
  {
    judul: 'Monster 2023',
    tipe: 'film',
    genre: 'Drama',
    rating: 5,
    ulasan: 'Di film ini kita bakal dikasih beberapa point of view, di setiap point of view kita bakal dibuat menerka nerka, "sebenernya siapa sih monsternya?". turns out im the monster :D.',
    tanggal_nonton: '2026-03-21',
    poster: 'https://image.tmdb.org/t/p/original/7kDwfWG8FVNZCnc3okmXATVb92r.jpg',
  },
  {
    judul: 'My Liberation Notes',
    tipe: 'series',
    genre: 'Drama',
    rating: 5,
    ulasan: 'abis nonton ini rasanya hampa banget tp as an introvert aku relate sama fl-nya.',
    tanggal_nonton: '2026-03-21',
    poster: 'https://upload.wikimedia.org/wikipedia/id/0/05/Poster_series_My_Liberation_Diary.jpeg?utm_source=id.wikipedia.org&utm_campaign=index&utm_content=original',
  },
  {
    judul: 'Mouse',
    tipe: 'series',
    genre: 'Thriller',
    rating: 5,
    ulasan: 'plot twistnya oke',
    tanggal_nonton: '2026-03-21',
    poster: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpK1WHr-4YtvR_T1unJ2aE5Q4AT5z20QPm5eFcAIfySPD3Q1_yGY-Xd7J9&s=10',
  },
];
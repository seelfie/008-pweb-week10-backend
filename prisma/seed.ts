import { prisma } from '../src/lib/prisma';
import { dataAwal } from '../src/data/reviews';

async function main() {
  const jumlah = await prisma.review.count();

  if (jumlah > 0) {
    console.log(`Database telah terisi ${jumlah} data, seed dilewati.`);
    return;
  }

  await prisma.review.createMany({
    data: dataAwal.map((r) => ({ ...r, tanggal_nonton: new Date(r.tanggal_nonton) })),
  });

  console.log(`Seed selesai: ${dataAwal.length} review ditambahkan.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
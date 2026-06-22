import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const provinces = [
  { name: 'Hà Nội', code: 'HN', region: 'Miền Bắc' },
  { name: 'Hồ Chí Minh', code: 'HCM', region: 'Miền Nam' },
  { name: 'Đà Nẵng', code: 'DN', region: 'Miền Trung' },
  { name: 'Hải Phòng', code: 'HP', region: 'Miền Bắc' },
  { name: 'Cần Thơ', code: 'CT', region: 'Miền Nam' },
  { name: 'An Giang', code: 'AG', region: 'Miền Nam' },
  { name: 'Bà Rịa - Vũng Tàu', code: 'BRVT', region: 'Miền Nam' },
  { name: 'Bắc Giang', code: 'BG', region: 'Miền Bắc' },
  { name: 'Bắc Kạn', code: 'BK', region: 'Miền Bắc' },
  { name: 'Bạc Liêu', code: 'BL', region: 'Miền Nam' },
  { name: 'Bắc Ninh', code: 'BN', region: 'Miền Bắc' },
  { name: 'Bến Tre', code: 'BT', region: 'Miền Nam' },
  { name: 'Bình Định', code: 'BD', region: 'Miền Trung' },
  { name: 'Bình Dương', code: 'BDU', region: 'Miền Nam' },
  { name: 'Bình Phước', code: 'BP', region: 'Miền Nam' },
  { name: 'Bình Thuận', code: 'BTH', region: 'Miền Trung' },
  { name: 'Cà Mau', code: 'CM', region: 'Miền Nam' },
  { name: 'Cao Bằng', code: 'CB', region: 'Miền Bắc' },
  { name: 'Đắk Lắk', code: 'DL', region: 'Miền Trung' },
  { name: 'Đắk Nông', code: 'DN2', region: 'Miền Trung' },
  { name: 'Điện Biên', code: 'DB', region: 'Miền Bắc' },
  { name: 'Đồng Nai', code: 'DN3', region: 'Miền Nam' },
  { name: 'Đồng Tháp', code: 'DT', region: 'Miền Nam' },
  { name: 'Gia Lai', code: 'GL', region: 'Miền Trung' },
  { name: 'Hà Giang', code: 'HG', region: 'Miền Bắc' },
  { name: 'Hà Nam', code: 'HNam', region: 'Miền Bắc' },
  { name: 'Hà Tây', code: 'HT', region: 'Miền Bắc' },
  { name: 'Hà Tĩnh', code: 'HT2', region: 'Miền Trung' },
  { name: 'Hải Dương', code: 'HD', region: 'Miền Bắc' },
  { name: 'Hậu Giang', code: 'HG2', region: 'Miền Nam' },
  { name: 'Hòa Bình', code: 'HB', region: 'Miền Bắc' },
  { name: 'Hưng Yên', code: 'HY', region: 'Miền Bắc' },
  { name: 'Khánh Hòa', code: 'KH', region: 'Miền Trung' },
  { name: 'Kiên Giang', code: 'KG', region: 'Miền Nam' },
  { name: 'Kon Tum', code: 'KT', region: 'Miền Trung' },
  { name: 'Lai Châu', code: 'LC', region: 'Miền Bắc' },
  { name: 'Lâm Đồng', code: 'LD', region: 'Miền Trung' },
  { name: 'Lạng Sơn', code: 'LS', region: 'Miền Bắc' },
  { name: 'Lào Cai', code: 'LC2', region: 'Miền Bắc' },
  { name: 'Long An', code: 'LA', region: 'Miền Nam' },
  { name: 'Nam Định', code: 'ND', region: 'Miền Bắc' },
  { name: 'Nghệ An', code: 'NA', region: 'Miền Trung' },
  { name: 'Ninh Bình', code: 'NB', region: 'Miền Bắc' },
  { name: 'Ninh Thuận', code: 'NT', region: 'Miền Trung' },
  { name: 'Phú Thọ', code: 'PT', region: 'Miền Bắc' },
  { name: 'Phú Yên', code: 'PY', region: 'Miền Trung' },
  { name: 'Quảng Bình', code: 'QB', region: 'Miền Trung' },
  { name: 'Quảng Nam', code: 'QNam', region: 'Miền Trung' },
  { name: 'Quảng Ngãi', code: 'QNG', region: 'Miền Trung' },
  { name: 'Quảng Ninh', code: 'QN', region: 'Miền Bắc' },
  { name: 'Quảng Trị', code: 'QT', region: 'Miền Trung' },
  { name: 'Sóc Trăng', code: 'ST', region: 'Miền Nam' },
  { name: 'Sơn La', code: 'SL', region: 'Miền Bắc' },
  { name: 'Tây Ninh', code: 'TN', region: 'Miền Nam' },
  { name: 'Thái Bình', code: 'TB', region: 'Miền Bắc' },
  { name: 'Thái Nguyên', code: 'TNG', region: 'Miền Bắc' },
  { name: 'Thanh Hóa', code: 'TH', region: 'Miền Trung' },
  { name: 'Thừa Thiên - Huế', code: 'TTH', region: 'Miền Trung' },
  { name: 'Tiền Giang', code: 'TG', region: 'Miền Nam' },
  { name: 'Tuyên Quang', code: 'TQ', region: 'Miền Bắc' },
  { name: 'Vĩnh Long', code: 'VL', region: 'Miền Nam' },
  { name: 'Vĩnh Phúc', code: 'VP', region: 'Miền Bắc' },
  { name: 'Yên Bái', code: 'YB', region: 'Miền Bắc' },
];

async function main() {
  console.log('Seeding provinces...');

  for (const province of provinces) {
    await prisma.province.upsert({
      where: { code: province.code },
      update: {},
      create: {
        name: province.name,
        code: province.code,
        region: province.region,
      },
    });
  }

  console.log(`Successfully seeded ${provinces.length} provinces`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

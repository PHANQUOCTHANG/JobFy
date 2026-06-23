import * as bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const defaultPassword = await bcrypt.hash('12345678', 10);

  console.log('👑 Seeding Admin...');
  await prisma.user.upsert({
    where: { email: 'admin@jobfy.vn' },
    update: {
      passwordHash: defaultPassword,
      role: 'admin',
      status: 'active',
      emailVerified: true,
    },
    create: {
      email: 'admin@jobfy.vn',
      passwordHash: defaultPassword,
      role: 'admin',
      status: 'active',
      emailVerified: true,
    }
  });
  console.log('✅ Đã tạo tài khoản admin thành công: admin@jobfy.vn / 12345678');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

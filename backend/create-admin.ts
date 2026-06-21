import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@jobfy.com';
  const plainPassword = 'password123';
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash: hashedPassword,
      role: 'admin',
      status: 'active',
      emailVerified: true
    },
    create: {
      email,
      passwordHash: hashedPassword,
      role: 'admin',
      status: 'active',
      emailVerified: true
    }
  });

  console.log('✅ Đã tạo tài khoản Admin thành công:');
  console.log('-----------------------------------');
  console.log(`Email: ${admin.email}`);
  console.log(`Password: ${plainPassword}`);
  console.log(`Role: ${admin.role}`);
  console.log('-----------------------------------');
}

main()
  .catch((e) => {
    console.error('❌ Lỗi khi tạo Admin:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

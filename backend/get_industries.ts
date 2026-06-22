import prisma from './src/lib/prisma';

async function main() {
  const industries = await prisma.industry.findMany();
  console.log(industries);
}

main().catch(console.error).finally(() => prisma.$disconnect());

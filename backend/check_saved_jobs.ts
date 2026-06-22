import prisma from './src/lib/prisma';

async function main() {
  const savedJobs = await prisma.savedJob.findMany();
  console.log("Total saved jobs in DB:", savedJobs.length);
  if (savedJobs.length > 0) {
    console.log("First saved job:", savedJobs[0]);
  }
  const users = await prisma.user.findMany({ where: { role: 'candidate' } });
  console.log("Candidates count:", users.length);
}

main().catch(console.error).finally(() => prisma.$disconnect());

import prisma from './src/lib/prisma';

async function main() {
  const users = await prisma.user.findMany({ where: { role: 'candidate' }, include: { candidateProfile: true } });
  console.log("Users with role candidate:", users.length);
  const profiles = await prisma.candidateProfile.findMany();
  console.log("Total candidate profiles:", profiles.length);

  // Group saved jobs by candidate ID
  const savedJobs = await prisma.savedJob.findMany();
  for (const job of savedJobs) {
    console.log("Saved job:", job.id, "Candidate:", job.candidateId);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());

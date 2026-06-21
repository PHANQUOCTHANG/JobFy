import prisma from "./src/lib/prisma";

async function main() {
  const companies = await prisma.company.findMany();
  const users = await prisma.user.findMany({ select: { email: true, role: true } });
  const jobs = await prisma.jobs.findMany();

  console.log("Companies:", companies.length);
  if (companies.length > 0) console.log(companies[0]);

  console.log("Users:", users.length);
  console.log("Roles:", new Set(users.map(u => u.role)));

  console.log("Jobs:", jobs.length);

  process.exit(0);
}

main().catch(console.error);

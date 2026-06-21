import prisma from "./src/lib/prisma";

async function main() {
  const [
    totalUsers,
    totalCandidates,
    totalEmployers,
    totalCompanies,
    totalJobs,
    totalReports,
    totalRevenue
  ] = await Promise.all([
    prisma.user.count({ where: { deletedAt: null } }),
    prisma.user.count({ where: { role: "candidate", deletedAt: null } }),
    prisma.user.count({ where: { role: "employer", deletedAt: null } }),
    prisma.company.count({ where: { deletedAt: null } }),
    prisma.jobs.count({ where: { deletedAt: null } }),
    prisma.report.count(),
    prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: "completed" }
    }).catch(e => { console.error("Error in totalRevenue:", e); return null; })
  ]);

  console.log({
    totalUsers,
    totalCandidates,
    totalEmployers,
    totalCompanies,
    totalJobs,
    totalReports,
    totalRevenue
  });

  process.exit(0);
}

main().catch(console.error);

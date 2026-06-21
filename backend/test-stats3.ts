import { AdminRepository } from "./src/module/admin/admin.repository";

async function main() {
  const repo = new AdminRepository();
  const stats = await repo.getDashboardStats(7);
  console.log(JSON.stringify(stats, null, 2));
  process.exit(0);
}

main().catch(console.error);

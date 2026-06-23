import { SavedJobService } from './src/module/saved-job/saved-job.service';
import prisma from './src/lib/prisma';
import { toSavedJobListResponse } from './src/module/saved-job/saved-job.response';

async function main() {
  const service = new SavedJobService();
  
  const savedJobs = await prisma.savedJob.findMany({ include: { candidate: true } });
  if (savedJobs.length === 0) {
    console.log("No saved jobs found in DB.");
    return;
  }
  
  const candidate = savedJobs[0].candidate;
  const userId = candidate.userId;
  console.log("Testing with userId:", userId);
  
  const result = await service.getSavedJobs(userId, { page: 1, limit: 10 });
  console.log("Result length:", result.data.length);
  
  const mapped = toSavedJobListResponse(result.data);
  console.log("Mapped Result Length:", mapped.length);
  console.log("First item:", JSON.stringify(mapped[0], null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());

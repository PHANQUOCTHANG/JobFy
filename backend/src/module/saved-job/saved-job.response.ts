import { ISavedJob } from "./saved-job.type";

export const toSavedJobResponse = (savedJob: any) => {
  return {
    id: savedJob.id,
    candidateId: savedJob.candidateId,
    jobId: savedJob.jobId,
    savedAt: savedJob.savedAt,
    job: savedJob.job
  };
};

export const toSavedJobListResponse = (savedJobs: any[]) => {
  return savedJobs.map(toSavedJobResponse);
};

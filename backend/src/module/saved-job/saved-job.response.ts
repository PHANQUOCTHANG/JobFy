import { ISavedJob } from "./saved-job.type";

export const toSavedJobResponse = (savedJob: ISavedJob) => {
  return {
    id: savedJob.id,
    candidateId: savedJob.candidateId,
    jobId: savedJob.jobId,
    savedAt: savedJob.savedAt,
    job: savedJob.job ? {
      id: savedJob.job.id,
      title: savedJob.job.title,
      slug: savedJob.job.slug,
      jobType: savedJob.job.jobType,
      salaryMin: savedJob.job.salaryMin,
      salaryMax: savedJob.job.salaryMax,
      salaryCurrency: savedJob.job.salaryCurrency,
      provinceId: savedJob.job.provinceId,
      company: savedJob.job.company ? {
        id: savedJob.job.company.id,
        name: savedJob.job.company.name,
        logoUrl: savedJob.job.company.logoUrl,
      } : undefined
    } : undefined
  };
};

export const toSavedJobListResponse = (savedJobs: ISavedJob[]) => {
  return savedJobs.map(toSavedJobResponse);
};

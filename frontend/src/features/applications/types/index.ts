import { Job } from '@/features/jobs/types';
import { CandidateProfile, Resume } from '@/features/candidates/types';

export type ApplicationStatus = 'pending' | 'reviewing' | 'interviewed' | 'offered' | 'rejected' | 'hired';

export interface JobApplication {
  id: string;
  jobId: string;
  candidateId: string;
  resumeId: string;
  coverLetter?: string;
  status: ApplicationStatus;
  appliedAt: string;
  updatedAt: string;
  
  // Relations
  job?: Job;
  candidate?: CandidateProfile;
  resume?: Resume;
}

export interface ApplyPayload {
  jobId: string;
  resumeId: string;
  coverLetter?: string;
}

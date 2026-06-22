import api from '@/lib/axios';
import { JobApplication, ApplyPayload } from '../types';

export const applyForJob = async (payload: ApplyPayload): Promise<JobApplication> => {
  const response = await api.post('/applications', payload);
  return response.data?.data || response.data;
};

export const applyWithUploadCv = async (data: {
  jobId: string;
  cvFile: File;
  coverLetter?: string;
  fullName: string;
  email: string;
  phone: string;
}): Promise<JobApplication> => {
  const formData = new FormData();
  formData.append("cvFile", data.cvFile);
  formData.append("jobId", data.jobId);
  if (data.coverLetter) formData.append("coverLetter", data.coverLetter);
  formData.append("fullName", data.fullName);
  formData.append("email", data.email);
  formData.append("phone", data.phone);

  const response = await api.post("/applications/upload-cv", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data?.data || response.data;
};

export const getMyApplications = async (): Promise<JobApplication[]> => {
  const response = await api.get('/applications');
  return response.data?.data || response.data;
};

export const checkApplied = async (jobId: string, candidateId: string): Promise<JobApplication | null> => {
  try {
    const response = await api.get('/applications', {
      params: { jobId, candidateId }
    });
    const data = response.data?.data || response.data;
    if (data && Array.isArray(data) && data.length > 0) {
      return data[0];
    }
    return null;
  // eslint-disable-next-line unused-imports/no-unused-vars
  } catch (error) {
    return null;
  }
};

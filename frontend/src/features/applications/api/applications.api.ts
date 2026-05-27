import api from '@/lib/axios';
import { JobApplication, ApplyPayload } from '../types';

export const applyForJob = async (payload: ApplyPayload): Promise<JobApplication> => {
  const response = await api.post('/applications', payload);
  return response.data?.data || response.data;
};

export const getMyApplications = async (): Promise<JobApplication[]> => {
  const response = await api.get('/applications/me');
  return response.data?.data || response.data;
};

export const checkApplicationStatus = async (jobId: string): Promise<JobApplication | null> => {
  try {
    const response = await api.get(`/applications/check/${jobId}`);
    return response.data?.data || response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

import api from '@/lib/axios';
import { Job, JobCategory, JobFilterParams } from '../types';

export const getJobs = async (params?: JobFilterParams): Promise<{ data: Job[], meta: any }> => {
  const response = await api.get('/jobs', { params });
  return {
    data: response.data?.data || response.data,
    meta: response.data?.meta || {},
  };
};

export const getJobBySlug = async (slug: string): Promise<Job> => {
  const response = await api.get(`/jobs/${slug}`);
  return response.data?.data || response.data;
};

export const getJobCategories = async (): Promise<JobCategory[]> => {
  const response = await api.get('/job-categories');
  return response.data?.data || response.data;
};

export const saveJob = async (jobId: string): Promise<void> => {
  await api.post(`/jobs/${jobId}/save`);
};

export const unsaveJob = async (jobId: string): Promise<void> => {
  await api.delete(`/jobs/${jobId}/save`);
};

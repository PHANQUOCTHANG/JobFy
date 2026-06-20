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
  await api.post(`/saved-jobs/${jobId}`);
};

export const unsaveJob = async (jobId: string): Promise<void> => {
  await api.delete(`/saved-jobs/${jobId}`);
};

export const getSavedJobs = async (params?: { page?: number, limit?: number }): Promise<{ data: any[], meta: any }> => {
  const response = await api.get('/saved-jobs', { params });
  return {
    data: response.data?.data || response.data,
    meta: response.data?.meta || {},
  };
};

export const getSavedJobIds = async (): Promise<string[]> => {
  const response = await api.get('/saved-jobs/ids');
  return response.data?.data || response.data || [];
};

export const getProvinces = async (): Promise<{id: number, name: string}[]> => {
  const response = await api.get('/locations/provinces');
  return response.data?.data || response.data;
};

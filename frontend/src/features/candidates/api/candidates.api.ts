import api from '@/lib/axios';
import { CandidateProfile, Resume } from '../types';

export const getMyProfile = async (): Promise<CandidateProfile> => {
  const response = await api.get('/candidates/me');
  return response.data?.data || response.data;
};

export const updateMyProfile = async (data: Partial<CandidateProfile>): Promise<CandidateProfile> => {
  const response = await api.patch('/candidates/me', data);
  return response.data?.data || response.data;
};

export const getMyResumes = async (): Promise<Resume[]> => {
  const response = await api.get('/candidates/me/resumes');
  return response.data?.data || response.data;
};

export const getCandidateById = async (id: string): Promise<CandidateProfile> => {
  const response = await api.get(`/candidates/${id}`);
  return response.data?.data || response.data;
};

export const getCandidateResumes = async (id: string): Promise<Resume[]> => {
  const response = await api.get(`/candidates/${id}/resumes`);
  return response.data?.data || response.data;
};

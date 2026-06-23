import api from '@/lib/axios';
import { CandidateProfile, Resume } from '../types';

export const getMyProfile = async (): Promise<CandidateProfile> => {
  const response = await api.get('/candidate-profiles/me');
  return response.data?.data || response.data;
};

export const updateMyProfile = async (data: Partial<CandidateProfile>): Promise<CandidateProfile> => {
  const response = await api.patch('/candidate-profiles/me', data);
  return response.data?.data || response.data;
};

export const getMyResumes = async (): Promise<Resume[]> => {
  const response = await api.get('/resumes/my');
  return response.data?.data || response.data;
};

export const getCandidateById = async (id: string): Promise<CandidateProfile> => {
  const response = await api.get(`/candidate-profiles/${id}`);
  return response.data?.data || response.data;
};

export const getCandidateResumes = async (id: string): Promise<Resume[]> => {
  const response = await api.get(`/resumes`, { params: { candidateId: id } });
  // Some endpoints might wrap results in pagination object, so let's check
  const data = response.data?.data || response.data;
  return Array.isArray(data) ? data : (data.data || []);
};

import api from '@/lib/axios';
import { Company, CompanyLocation, CompanyReview } from '../types';

export const getCompanies = async (params?: Record<string, any>): Promise<Company[]> => {
  const response = await api.get('/companies', { params });
  return response.data?.data || response.data;
};

export const getCompanyBySlug = async (slug: string): Promise<Company> => {
  const response = await api.get(`/companies/${slug}`);
  return response.data?.data || response.data;
};

export const getCompanyLocations = async (companyId: string): Promise<CompanyLocation[]> => {
  const response = await api.get(`/companies/${companyId}/locations`);
  return response.data?.data || response.data;
};

export const getCompanyReviews = async (companyId: string): Promise<CompanyReview[]> => {
  const response = await api.get(`/companies/${companyId}/reviews`);
  return response.data?.data || response.data;
};

// --- API cho Nhà tuyển dụng (Employer) ---

export const getMyCompany = async (): Promise<Company> => {
  const response = await api.get('/companies/me');
  return response.data?.data || response.data;
};

export const updateMyCompany = async (data: Partial<Company>): Promise<Company> => {
  const response = await api.put('/companies/me', data);
  return response.data?.data || response.data;
};

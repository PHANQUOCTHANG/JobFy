import api from '@/lib/axios';
import { Company, CompanyLocation, CompanyReview } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getCompanies = async (params?: Record<string, any>): Promise<{ data: Company[]; meta: any }> => {
  const apiParams = { ...params };
  
  if (apiParams.keyword) {
    apiParams.search = apiParams.keyword;
    delete apiParams.keyword;
  }
  
  const response = await api.get('/companies', { params: apiParams });
  const data = response.data?.data || response.data || [];
  
  return {
    data,
    meta: response.data?.meta || { total: 0, page: 1, limit: 10, totalPages: 1 },
  };
};

export const getIndustries = async (): Promise<{ data: any[]; meta: any }> => {
  const response = await api.get('/industries');
  const data = response.data?.data || response.data || [];

  return {
    data,
    meta: response.data?.meta || { total: 0, page: 1, limit: 10, totalPages: 1 },
  };
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
  const response = await api.get(`/company-reviews`, { params: { companyId } });
  return response.data?.data || response.data;
};

// API cho Nhà tuyển dụng (Employer) ---

export const getMyCompany = async (): Promise<Company> => {
  const response = await api.get('/companies/me');
  return response.data?.data || response.data;
};

export const updateMyCompany = async (data: Partial<Company>): Promise<Company> => {
  const response = await api.put('/companies/me', data);
  return response.data?.data || response.data;
};

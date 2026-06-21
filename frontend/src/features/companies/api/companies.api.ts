import api from '@/lib/axios';
import { Company, CompanyLocation, CompanyReview } from '../types';

import { mockCompanies, mockIndustries } from './mockData';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getCompanies = async (params?: Record<string, any>): Promise<{ data: Company[]; meta: any }> => {
  const apiParams = { ...params };
  
  try {
    const response = await api.get('/companies', { params: apiParams });
    const data = response.data?.data || response.data;
    if (!data || data.length === 0) throw new Error("No real data yet");
    
    return {
      data,
      meta: response.data?.meta || {},
    };
  // eslint-disable-next-line unused-imports/no-unused-vars
  } catch (error) {
    let filtered = [...mockCompanies];
    
    if (apiParams.keyword) {
      const lowerKw = apiParams.keyword.toLowerCase();
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(lowerKw) || 
        c.shortDescription?.toLowerCase().includes(lowerKw)
      );
    }
    
    if (apiParams.industryId) {
      filtered = filtered.filter(c => c.industryId === Number(apiParams.industryId));
    }
    
    const page = apiParams.page || 1;
    const limit = apiParams.limit || 10;
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    
    // Simulate pagination for mock
    const paginated = filtered.slice((page - 1) * limit, page * limit);
    
    return {
      data: paginated as unknown as Company[],
      meta: { total, page, limit, totalPages }
    };
  }
};

export const getIndustries = async (): Promise<{ data: any[]; meta: any }> => {
  try {
    const response = await api.get('/industries');
    const data = response.data?.data || response.data;
    if (!data || data.length === 0) throw new Error("No real data yet");

    return {
      data,
      meta: response.data?.meta || {},
    };
  // eslint-disable-next-line unused-imports/no-unused-vars
  } catch (error) {
    return {
      data: mockIndustries,
      meta: { total: mockIndustries.length, page: 1, limit: 100, totalPages: 1 }
    };
  }
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

// API cho Nhà tuyển dụng (Employer) ---

export const getMyCompany = async (): Promise<Company> => {
  const response = await api.get('/companies/me');
  return response.data?.data || response.data;
};

export const updateMyCompany = async (data: Partial<Company>): Promise<Company> => {
  const response = await api.put('/companies/me', data);
  return response.data?.data || response.data;
};

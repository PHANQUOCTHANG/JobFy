import { useQuery } from '@tanstack/react-query';
import { getCompanies, getCompanyBySlug, getCompanyLocations, getCompanyReviews } from '../api/companies.api';

export const useCompanies = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: ['companies', params],
    queryFn: () => getCompanies(params),
  });
};

export const useCompany = (slug: string) => {
  return useQuery({
    queryKey: ['company', slug],
    queryFn: () => getCompanyBySlug(slug),
    enabled: !!slug,
  });
};

export const useCompanyLocations = (companyId: string) => {
  return useQuery({
    queryKey: ['companyLocations', companyId],
    queryFn: () => getCompanyLocations(companyId),
    enabled: !!companyId,
  });
};

export const useCompanyReviews = (companyId: string) => {
  return useQuery({
    queryKey: ['companyReviews', companyId],
    queryFn: () => getCompanyReviews(companyId),
    enabled: !!companyId,
  });
};

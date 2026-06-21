import { useQuery } from '@tanstack/react-query';
import { getCompanies, getCompanyBySlug, getCompanyLocations, getCompanyReviews, getIndustries } from '../api/companies.api';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useCompanies = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: ['companies', params],
    queryFn: () => getCompanies(params),
  });
};

export const useIndustries = () => {
  return useQuery({
    queryKey: ['industries'],
    queryFn: () => getIndustries(),
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

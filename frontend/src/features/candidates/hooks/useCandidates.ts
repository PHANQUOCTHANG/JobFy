import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getMyProfile, 
  updateMyProfile, 
  getMyResumes, 
  getCandidateById, 
  getCandidateResumes 
} from '../api/candidates.api';
import { CandidateProfile } from '../types';

export const useMyProfile = () => {
  return useQuery({
    queryKey: ['myProfile'],
    queryFn: getMyProfile,
  });
};

export const useUpdateMyProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<CandidateProfile>) => updateMyProfile(data),
    onSuccess: (data) => {
      queryClient.setQueryData(['myProfile'], data);
    },
  });
};

export const useMyResumes = () => {
  return useQuery({
    queryKey: ['myResumes'],
    queryFn: getMyResumes,
  });
};

export const useCandidateProfile = (id: string) => {
  return useQuery({
    queryKey: ['candidateProfile', id],
    queryFn: () => getCandidateById(id),
    enabled: !!id,
  });
};

export const useCandidateResumes = (id: string) => {
  return useQuery({
    queryKey: ['candidateResumes', id],
    queryFn: () => getCandidateResumes(id),
    enabled: !!id,
  });
};

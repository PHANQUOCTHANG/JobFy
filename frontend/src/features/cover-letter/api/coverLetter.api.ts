import axiosClient from '@/lib/axios';
import { CoverLetter, CreateCoverLetterDto, UpdateCoverLetterDto } from '../types';
import { ApiResponse } from '@/types';

export const coverLetterApi = {
  getAll: () => 
    axiosClient.get<ApiResponse<CoverLetter[]>>('/cover-letters'),
    
  getById: (id: string) => 
    axiosClient.get<ApiResponse<CoverLetter>>(`/cover-letters/${id}`),
    
  create: (data: CreateCoverLetterDto) => 
    axiosClient.post<ApiResponse<CoverLetter>>('/cover-letters', data),
    
  update: (id: string, data: UpdateCoverLetterDto) => 
    axiosClient.patch<ApiResponse<CoverLetter>>(`/cover-letters/${id}`, data),
    
  delete: (id: string) => 
    axiosClient.delete<ApiResponse<null>>(`/cover-letters/${id}`),
};

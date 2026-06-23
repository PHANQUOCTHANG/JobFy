import axiosClient from '@/lib/axios';
import { 
  GenerateSummaryPayload, 
  ReviewCvPayload, 
  MatchJobPayload, 
  SuggestSkillsPayload, 
  GenerateCoverLetterPayload,
  GenerateFullCvPayload,
  CvReviewResult,
  JobMatchResult
} from '../types';
import { ApiResponse } from '@/types';

export const aiApi = {
  generateCvSummary: (data: GenerateSummaryPayload) => 
    axiosClient.post<ApiResponse<{ summary: string }>>('/ai/cv/generate-summary', data),
    
  reviewCv: (data: ReviewCvPayload) => 
    axiosClient.post<ApiResponse<CvReviewResult>>('/ai/cv/review', data),
    
  matchJob: (data: MatchJobPayload) => 
    axiosClient.post<ApiResponse<JobMatchResult>>('/ai/cv/match-job', data),
    
  suggestSkills: (data: SuggestSkillsPayload) => 
    axiosClient.post<ApiResponse<string[]>>('/ai/cv/suggest-skills', data),
    
  generateCoverLetter: (data: GenerateCoverLetterPayload) => 
    axiosClient.post<ApiResponse<{ content: string }>>('/ai/cover-letter/generate', data),
    
  generateFullCv: (data: GenerateFullCvPayload) => 
    axiosClient.post<ApiResponse<any>>('/ai/cv/generate-full', data),
};

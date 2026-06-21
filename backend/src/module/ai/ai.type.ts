export type AiLanguage = 'vi' | 'en';

export interface GenerateSummaryRequest {
  jobTitle: string;
  experiences: any[];
  skills: any[];
  educations: any[];
  language?: AiLanguage;
}

export interface ReviewCvRequest {
  cvData: any;
  language?: AiLanguage;
}

export interface MatchJobRequest {
  resumeId: string;
  jobId: string;
  language?: AiLanguage;
}

export interface SuggestSkillsRequest {
  jobTitle: string;
  existingSkills: string[];
  language?: AiLanguage;
}

export interface GenerateCoverLetterRequest {
  jobId?: string;
  resumeId?: string;
  jobTitle?: string;
  companyName?: string;
  language?: AiLanguage;
}

export type AiLanguage = 'vi' | 'en';

export interface GenerateSummaryPayload {
  jobTitle: string;
  experiences: any[];
  skills: any[];
  educations: any[];
  language?: AiLanguage;
}

export interface ReviewCvPayload {
  cvData: any;
  language?: AiLanguage;
}

export interface MatchJobPayload {
  resumeId: string;
  jobId: string;
  language?: AiLanguage;
}

export interface SuggestSkillsPayload {
  jobTitle: string;
  existingSkills: string[];
  language?: AiLanguage;
}

export interface GenerateCoverLetterPayload {
  jobId?: string;
  resumeId?: string;
  jobTitle?: string;
  companyName?: string;
  language?: AiLanguage;
  tone?: string;
  cvData: any;
  jobData: any;
}

export interface CvSectionReview {
  score: number;
  feedback: string;
}

export interface CvReviewResult {
  overallScore: number;
  sections: {
    personalInfo: CvSectionReview;
    experience: CvSectionReview;
    education: CvSectionReview;
    skills: CvSectionReview;
    summary: CvSectionReview;
  };
  suggestions: string[];
}

export interface JobMatchResult {
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  experienceMatch: string;
  suggestions: string[];
}

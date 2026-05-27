export interface CandidateProfile {
  id: string;
  userId: string;
  fullName: string;
  headline?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  dob?: string;
  provinceId?: number;
  districtId?: number;
  address?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  desiredJobTitle?: string;
  desiredSalaryMin?: number;
  desiredSalaryMax?: number;
  desiredSalaryType?: 'hourly' | 'daily' | 'monthly' | 'yearly' | 'negotiable';
  experienceLevel?: 'intern' | 'fresher' | 'junior' | 'mid' | 'senior' | 'lead' | 'manager' | 'director' | 'executive';
  isLooking: boolean;
  isProfilePublic: boolean;
  bio?: string;
  profileViews: number;
  createdAt: string;
  updatedAt: string;
}

export interface ResumeEducation {
  id: number;
  resumeId: string;
  schoolName: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  gpa?: number;
  description?: string;
  sortOrder: number;
}

export interface ResumeExperience {
  id: number;
  resumeId: string;
  companyId?: string;
  companyName: string;
  jobTitle: string;
  employmentType?: string;
  provinceId?: number;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
  sortOrder: number;
}

export interface ResumeSkill {
  id: number;
  resumeId: string;
  skillId: number;
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  years?: number;
  skill?: {
    id: number;
    name: string;
  };
}

export interface Resume {
  id: string;
  candidateId: string;
  title: string;
  fileUrl?: string;
  isPrimary: boolean;
  isPublic: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  educations?: ResumeEducation[];
  experiences?: ResumeExperience[];
  skills?: ResumeSkill[];
}

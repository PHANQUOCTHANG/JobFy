export interface Experience {
  id: string;
  companyName: string;
  jobTitle: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
}

export interface Education {
  id: string;
  schoolName: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
}

export interface Skill {
  id: string;
  name: string;
  level?: number; // 1-5 or 0-100
  description?: string;
}

export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
}

export interface CvData {
  id?: string;
  templateId: string;
  title: string; // The user-defined title for this CV (e.g., "My Frontend CV")
  fileUrl?: string;
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    jobTitle: string;
    summary: string;
    avatarUrl?: string;
    website?: string;
    linkedin?: string;
    settings?: any;
  };
  experiences: Experience[];
  educations: Education[];
  skills: Skill[];
  certificates: Certificate[];
  createdAt: string;
  updatedAt: string;
}

export const initialCvData: CvData = {
  templateId: 'cv-1',
  title: 'CV chưa đặt tên',
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    address: '',
    jobTitle: '',
    summary: '',
    avatarUrl: '',
    website: '',
    linkedin: '',
  },
  experiences: [],
  educations: [],
  skills: [],
  certificates: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

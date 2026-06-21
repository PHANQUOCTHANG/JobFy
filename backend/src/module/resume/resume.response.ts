export class ResumeResponseDto {
  id: string;
  candidateId: string;
  title: string;
  templateId: string | null;
  personalData: any | null;
  fileUrl: string | null;
  isPrimary: boolean;
  isPublic: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  
  // Relations (optional)
  educations?: any[];
  experiences?: any[];
  skills?: any[];
  certifications?: any[];
  projects?: any[];

  constructor(resume: any) {
    const toISO = (d: any) => d ? (typeof d === 'string' ? d : new Date(d).toISOString()) : null;

    this.id = resume.id;
    this.candidateId = resume.candidateId;
    this.title = resume.title;
    this.templateId = resume.templateId || null;
    this.personalData = resume.personalData || null;
    this.fileUrl = resume.fileUrl;
    this.isPrimary = resume.isPrimary;
    this.isPublic = resume.isPublic;
    this.viewCount = resume.viewCount;
    this.createdAt = toISO(resume.createdAt) as string;
    this.updatedAt = toISO(resume.updatedAt) as string;

    if (resume.educations) {
      this.educations = resume.educations.map((e: any) => ({
        ...e,
        startDate: toISO(e.startDate),
        endDate: toISO(e.endDate),
      }));
    }
    
    if (resume.experiences) {
      this.experiences = resume.experiences.map((e: any) => ({
        ...e,
        startDate: toISO(e.startDate),
        endDate: toISO(e.endDate),
      }));
    }

    if (resume.skills) this.skills = resume.skills;
    
    if (resume.certifications) {
      this.certifications = resume.certifications.map((c: any) => ({
        ...c,
        issueDate: toISO(c.issueDate),
        expireDate: toISO(c.expireDate),
      }));
    }
    
    if (resume.projects) {
      this.projects = resume.projects.map((p: any) => ({
        ...p,
        startDate: toISO(p.startDate),
        endDate: toISO(p.endDate),
      }));
    }
  }

  static from(resume: any): ResumeResponseDto {
    return new ResumeResponseDto(resume);
  }

  static fromList(resumes: any[]): ResumeResponseDto[] {
    return resumes.map((r) => new ResumeResponseDto(r));
  }
}
